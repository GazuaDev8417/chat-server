const express = require('express')
const cors = require('cors')
const fs = require('fs')
const { Server } = require('socket.io')
const con = require('./sources/connection/connection')
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('./dist'))


// SOCKET CONNECTION
const options = {
    cors: true,
    origin: ['https://chat-jcnn.onrender.com']
    // origin: ['http://localhost:3003']
}

const server = app.listen(3003, ()=>{
    console.log('Servidor rondando em na porta 3003')
})

const io = new Server(server, options)

//CONNETCION CONFIGURATIONS
let id

io.on('connection', socket=>{
    id = socket.id
    socket.join('room1')
    socket.on('message', message=>{
        io.to('room1').emit('receivedMessage', {
            sender: message.sender,
            message: message.message
        })
    })

    socket.on('file', data=>{
        io.to('room1').emit('receivedFile', data)
    })
})


// =================ENTER WITH USER============================
app.post('/signup', (req, res)=>{
    try{
        const { nickname } = req.body
        const sql = `INSERT INTO chat_users VALUES(?,?)`

        if(!nickname){
            res.status(401).send('Digite um nome de usuário')
        }else{
            con.query(sql, [id, nickname], error=>{
                if(error){
                    if(error.code === 'ER_DUP_ENTRY'){
                        res.status(403).send(`Já existe um usuário com esse nome`)
                    }else{
                        res.status(500).send(`Falha ao registrar usuário: ${error}`)
                    }
                }else{
                    res.status(201).send(nickname)                    
                }
            })
        }
                            
    }catch(e){
        res.status(400).send(e.message || e.sqlMessage )
    }    
})

// =======================SELECT ALL USERS=================================
app.get('/users', (req, res)=>{
    try{
        con.query('SELECT * FROM chat_users', (error, users)=>{
            if(error){
                res.status(500).send(`Falha ao buscar usuários: ${error}`)
            }else{
                res.status(200).send(users)
            }
        })
    }catch(e){
        res.status(400).send(e.message || e.sqlMessage)
    }
})

// =========================ALTER ID===============================
app.patch('/changeid/:name', (req, res)=>{
    try{
        const { userId } = req.body
        const getuser = `SELECT * FROM chat_users WHERE nickname = '${req.params.name}'`

        con.query(getuser, (error, user)=>{
            if(error){
                res.status(400).send(`Falha ao buscar usuário: ${error}`)
            }else if(user.length === 0){
                res.status(404).send(`Usuário não encontrado`)
            }else{
                con.query(`
                    UPDATE chat_users SET id = '${userId}' WHERE nickname = '${req.params.name}'
                `, (error)=>{
                    if(error){
                        res.status(500).send(`Falha ao alterar id: ${error}`)
                    }else{
                        res.status(200).send('Id alterado')
                    }
                })
            }
        })
    
    }catch(e){
        res.status(400).send(e.message || e.sqlMessage)
    }
})

// =========================GET USER BY NAME========================
app.get('/user/:name', (req, res)=>{
    try{

        const getuser = `SELECT * FROM chat_users WHERE nickname = '${req.params.name}'`

        con.query(getuser, (error, user)=>{
            if(error){
                res.status(400).send(`Falha ao buscar usuário: ${error}`)
            }else if(user.length === 0){
                res.status(404).send('Usuário não encontrado')
            }else{
                res.status(200).send(user[0])
            }
        })        
    }catch(e){
        res.status(400).send(e.message || e.sqlMessage)
    }
})

// ===========================SEND MESSAGES========================
app.post('/messages', (req, res)=>{
    const { id, sender, message, sentAt } = req.body
    const getuser = `SELECT * FROM chat_users WHERE nickname = '${sender}'`
    const sql = `INSERT INTO chat_messages VALUES(?,?,?,?)`


    con.query(getuser, (error, user)=>{
        if(error){
            res.status(404).send(`Usuário não encontrado: ${error}`)
        }else{
            if(user.length > 0){
                con.query(sql, [id, user[0].nickname, message, sentAt], error=>{
                    if(error){
                        res.status(500).send(`Falha ao enviar messagem: ${error}`)
                    }else{
                        res.send('Mensagem enviada')
                    }
                })
            }else{
                res.status(404).send(`Usuário não encontrado ${error}`)
            }
        }
    })
})

// ==========================GET ALL MESSAGES=============================
app.get('/messages', (req, res)=>{
    con.query('SELECT * FROM chat_messages', (error, messages)=>{
        if(error){
            res.status(500).send(error)
        }else{
            res.send(messages)
        }
    })
})

// =========================SIGNOUT WITH USER=============================
app.delete('/signout/:name', (req, res)=>{
    const getuser = `SELECT * FROM chat_users WHERE nickname = '${req.params.name}'`
    const sql = `
        DELETE FROM chat_users WHERE nickname = '${req.params.name}'
    `

    con.query(getuser, (error, user)=>{
        if(error){
            res.status(400).send(`Falha ao buscar usuário: ${error}`)
        }else if(user.length === 0){
            res.status(404).send('Usuário não encontrado')
        }else{
            con.query(sql, error=>{
                if(error){
                    res.status(500).send(`Erro ao deslogar usuário: ${error}`)
                }else{
                    // con.query(`
                    //     DELETE FROM chat_messages WHERE sender = '${user[0].nickname}'
                    // `)
                    res.send(`${user[0].nickname} deslogado`)
                }
            })
        }
    })    
})
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
const { Server } = require('socket.io')
const con = require('./sources/connection/connection')


//SOCKET CONNECTION
const options = {
    cors: true,
    origin: ['http://localhost:3003']
}

const server = app.listen(3003, ()=>{
    console.log('Servidor rondando em http://localhost:3003')
})

const io = new Server(server, options)

app.use(express.static('./dist'))

//CONNETCION CONFIGURATIONS
io.on('connection', socket=>{
    socket.emit('welcome', socket.id)
    socket.join('room1')
    socket.on('message', message=>{
        io.to('room1').emit('receivedMessage', {
            userId: socket.id,
            message: message
        })
    })   
})



// =================ENTER WITH USER============================
app.post('/signup', (req, res)=>{
    const { nickname } = req.body
    const sql = `INSERT INTO chat_users VALUES(?,?)`
    const id = Date.now().toString(18)
                           
    con.query(sql, [id, nickname], error=>{
        if(error){
            res.status(500).send(`Falha ao registrar usuário: ${error}`)
        }else{
            res.status(201).send({id, nickname})                    
        }
    })
})

// =======================SELECT ALL USERS=================================
app.get('/users', (req, res)=>{
    con.query('SELECT * FROM chat_users', (error, users)=>{
        if(error){
            res.status(404).send(`Erro ao buscar usuários: ${error}`)
        }else{
            res.send(users)
        }
    })
})

// =========================ALTER ID===============================
app.patch('/changeid/:name', (req, res)=>{
    const { userId } = req.body

    con.query(`
        UPDATE chat_users SET id = '${userId}' WHERE nickname = '${req.params.name}'
    `, error=>{
        if(error){
            res.status(500).send(error)
        }else{
            res.send('Id alterado')
        }
    })
})

// =========================GET USER BY NAME========================
app.get('/user/:id', (req, res)=>{
    con.query(`
        SELECT * FROM chat_users WHERE id = '${req.params.id}'
    `, (error, user)=>{
        if(error){
            res.status(500).send()
        }else{
            res.send(user[0])
        }
    })
})

// ===========================SEND MESSAGES========================
app.post('/messages', (req, res)=>{
    const { sender, message } = req.body    
    const getuser = `SELECT * FROM chat_users WHERE nickname = '${sender}'`
    const sql = `INSERT INTO chat_messages VALUES(?,?,?)`
    const id = Date.now().toString(18)


    con.query(getuser, (error, user)=>{
        if(error){
            res.status(404).send(`Usuário não encontrado: ${error}`)
        }else{
            if(user.length > 0){
                con.query(sql, [id, user[0].nickname, message], error=>{
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
            res.status(404).send(`Usuário não encontrado: ${error}`)
        }else if(user.length > 0){
            con.query(sql, error=>{
                if(error){
                    res.status(500).send(`Erro ao deslogar usuário: ${error}`)
                }else{
                    con.query(`
                        DELETE FROM chat_messages WHERE sender = '${user[0].nickname}'
                    `)
                    res.send(`${user[0].nickname} deslogado`)
                }
            })
        }else{
            res.status(404).send(`Usuário não encontrado ${error}`)
        }
    })    
})
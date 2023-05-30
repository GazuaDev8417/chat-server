const con = require('./connection')
const table = 'chat_users'
const tablemsg = 'chat_messages'


con.query(`
    CREATE TABLE ${table}(
        id VARCHAR(50) PRIMARY KEY NOT NULL,
        nickname VARCHAR(50) NOT NULL UNIQUE
    )
`, error=>{
    if(error){
        console.log(`Falha ao criar tabela ${table}: ${error}`)
    }else{
        console.log(`Tabela ${table} criada com sucesso`)
    }
})

con.query(`
    CREATE TABLE ${tablemsg}(
        id VARCHAR(50) PRIMARY KEY NOT NULL,
        sender VARCHAR(50) NOT NULL,
        message TEXT
    )
`, error=>{
    if(error){
        console.log(`Falhar ao criar tabela ${tablemsg}: ${error}`)
    } else{
        console.log(`Tabela ${tablemsg} criada com sucesso`)
    }
})
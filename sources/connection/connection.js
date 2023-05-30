const mysql = require('mysql')


const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'alfadb',
    database: 'chat'
})

con.connect(error=>{
    if(error){
        console.log(`Falha ao conectar banco de dados: ${error}`)
    }else{
        console.log('Conectado ao banco de dados')
    }
})

module.exports = con
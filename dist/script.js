const nickname = document.getElementById('nickname')
const btn = document.getElementById('submitForm')
const url = 'https://chat-jcnn.onrender.com'
// const url = 'http://localhost:3003'


window.addEventListener('load', ()=>{
    const user = localStorage.getItem('user')

    if(user){
        location.href = './pages/chat/index.html'
    }
})


nickname.addEventListener('input', ()=>{
    btn.style.backgroundColor = 'green'

    if(nickname.value !== ''){
        btn.addEventListener('mouseover', handleMouseOver)
        btn.addEventListener('mouseout', handleMouseOut)
    }else{
        btn.style.backgroundColor = 'rgb(50, 49, 49)'
        btn.removeEventListener('mouseover', handleMouseOver)
        btn.removeEventListener('mouseout', handleMouseOut)
    }
})

const handleMouseOver = ()=>{
    btn.style.backgroundColor = 'rgb(5, 66, 5)'
    btn.style.fontWeight = 'bold'
}

const handleMouseOut = ()=>{
    btn.style.backgroundColor = 'green'
    btn.style.fontWeight = 'normal'
}


document.getElementById('form').addEventListener('submit', (e)=>{
    e.preventDefault()
    signup()
})

document.getElementById('submitForm').addEventListener('click', ()=>{
    signup()
})


const signup = ()=>{
    const body = {
        nickname: nickname.value
    }
    fetch(`${url}/signup`, {
        method:'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(res=>{
        if(!res.ok && res.statusText === 'Unauthorized'){
            throw new Error(`Digite um nome de usuário`)
        }
        
        return res.text()
    }).then(data=>{
        localStorage.setItem('user', data)
        location.href = './pages/chat/index.html'
    }).catch(e=>{
        alert(e.message)
    })
}
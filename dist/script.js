// const url = 'https://chat-jcnn.onrender.com'
const url = 'http://localhost:3003'
const nickname = document.getElementById('nickname')
const btn = document.getElementById('submitForm')
const form = document.getElementById('form')



window.addEventListener('load', ()=>{
    const user = localStorage.getItem('user')

    if(user){
        location.href = './pages/chat/index.html'
    }

    form.style.marginTop = '10vh'
    form.style.transition = '2s'
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
    btn.style.backgroundColor = 'rgb(3, 156, 3)'
}

const handleMouseOut = ()=>{
    btn.style.backgroundColor = 'green'
}


form.addEventListener('submit', (e)=>{
    e.preventDefault()

    const body = {
        nickname: nickname.value
    }  
    fetch(`${url}/signup`, {
        method:'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(body) 
    }).then(res =>{
        if(res.statusText === 'Forbidden'){
            throw new Error('Já existe um usuário com esse nome')
        }
        res.text()
    }).then(()=>{
        localStorage.setItem('user', nickname.value)
        location.href = './pages/chat/index.html'
    }).catch(e=>{
        alert(e.message)
    })
})
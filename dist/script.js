const nickname = document.getElementById('nickname')
const url = 'https://chat-0q7t.onrender.com'
// const url = 'http://localhost:3003'


window.addEventListener('load', ()=>{
    const user = localStorage.getItem('user')

    if(user){
        location.href = './pages/chat/index.html'
    }
})

document.getElementById('form').addEventListener('submit', (e)=>{
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
    }).then(res => res.text()).then(data=>{
        localStorage.setItem('user', data)
        location.href = './pages/chat/index.html'
    }).catch(e=>{
        alert(e.message)
    })
})
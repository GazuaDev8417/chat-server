const nickname = document.getElementById('nickname')
const btn = document.getElementById('submitForm')
const form = document.getElementById('form')
const url = 'https://chat-production-6117.up.railway.app'
// const url = 'http://localhost:3003'


window.addEventListener('load', ()=>{
    const user = localStorage.getItem('user')

    if(user){
        location.href = './pages/chat/index.html'
    }

    form.style.marginTop = '10vh'
    document.body.style.backgroundImage = "url('https://media.istockphoto.com/id/1218737747/vector/learning-online-e-learning-video-call-chat-with-class-distance-education.jpg?s=612x612&w=0&k=20&c=fFFwc3CTP4XtvmruZLiK8EzAbzvAxJL_kw5BsA7z7w8=')"
    document.body.style.backgroundSize = 'cover'
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
    }).then(res => res.text()).then(data=>{
        localStorage.setItem('user', data)
        location.href = './pages/chat/index.html'
    }).catch(e=>{
        alert(e.message)
    })
}
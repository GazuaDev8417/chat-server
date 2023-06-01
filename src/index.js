const io = require('socket.io-client')
const url = 'https://chat-0q7t.onrender.com'
// const url = 'http://localhost:3003'
const socket = io(url)
const userList = document.querySelector('.user-list')
const send = document.getElementById('send')
const messages = document.querySelector('.messages')
const currentUserIcon = document.getElementById('user')
const popup = document.querySelector('.popup-prfile-photo')
const inputFile = document.getElementById('inputFile')
const imgProfile = document.getElementById('imgProfile')
const input = document.getElementById('input')
let user = JSON.parse(localStorage.getItem('user'))
let users



document.scrollTop = messages.scrollHeight

document.getElementById('userName').innerHTML = user.nickname
// document.getElementById('user').addEventListener('mouseover', ()=>{    
//     popup.style.opacity = 1
    
//     setTimeout(()=>{
//         popup.style.opacity = 0
//         popup.style.transition = '1.5s'
//     }, 3000)
// })
// currentUserIcon.addEventListener('mouseout', ()=>{
//     popup.style.opacity = 0
// })
currentUserIcon.addEventListener('click', ()=>{
    inputFile.click()
})
imgProfile.addEventListener('click', ()=>{
    inputFile.click()
})
inputFile.addEventListener('change', ()=>{
    const file = inputFile.files[0]
    const fileReader = new FileReader()

    fileReader.addEventListener('load', ()=>{
        currentUserIcon.style.display = 'none'
        imgProfile.style.display = 'block'
        imgProfile.src = fileReader.result
    })

    if (file) {
        fileReader.readAsDataURL(file)        
    }
})


fetch(`${url}/users`).then(res => res.json()).then(data=>{
    const filtered = data.filter(item => item.nickname !== user.nickname)
    users = data

    userList.innerHTML = filtered.map(user=>{
        return`            
            <p class='user'>
                <i class="fa-solid fa-user icon"></i>
                ${user.nickname}
            </p>
        `
    }).join('')
})



document.getElementById('logout').addEventListener('click', ()=>{
    const decide = window.confirm('Tem certeza que deseja sair do chat')
    
    if(decide){
        fetch(`${url}/signout/${user.nickname}`, {
            method:'DELETE'
        }).then(res => res.text()).then(()=>{
            localStorage.clear()
            location.href = '../../index.html'
        }).catch(e=>{
            alert(e.message)
        })
    }
})


let userId

socket.on('welcome', id=>{
    userId = id
})


send.addEventListener('submit', (event)=>{
    event.preventDefault()

    socket.emit('message', input.value)       
    
    const body = {
        id: userId,
        sender: user.nickname,
        message: input.value,
        sentAt: new Date().toLocaleTimeString()
    }
    fetch(`${url}/messages`, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(res => res.text()).then(()=>{
        input.value = ''
        input.focus()
    }).catch(e=>{
        alert(e.message)
    })
})


fetch(`${url}/messages`).then(res => res.json()).then(data=>{
    const messagesByDate = data.sort((a, b)=>{
        return a.sentAt - b.sentAt
    })
    messages.innerHTML = messagesByDate.map(message=>{
        const isOur = message.sender === user.nickname
        if(!isOur){
            return`
                <div class="messageContainer left">
                    <div class="message foreign">
                        <div class="messageInfo">
                            <p class="username">${message.sender}</p>
                            <p class="date">${message.sentAt}</p>
                        </div>
                        <div class="textContainer">
                            <p>${message.message}</p>
                        </div>
                    </div>
                </div>
            `
        }else{
            return`
            <div class="messageContainer">
                <div class="message">
                    <div class="messageInfo">
                        <p class="username">${message.sender}</p>
                        <p class="date">${message.sentAt}</p>
                    </div>
                    <div class="textContainer">
                        <p>${message.message}</p>
                    </div>
                </div>
            </div>
            `
        }
    }).join('')
})


socket.on('receivedMessage', response=>{
    const isOur = response.userId === userId

    const messageContainer = document.createElement('div')
    messageContainer.classList.add('messageContainer')
    if(!isOur) messageContainer.classList.add('left')
    
    const innerMessage = document.createElement('div')
    innerMessage.classList.add('message')
    if(!isOur) innerMessage.classList.add('foreign')
    
    const messageInfo = document.createElement('div')
    messageInfo.classList.add('messageInfo')
    
    const username = document.createElement('p')
    username.classList.add('username')
    const userNickname = users.filter(username => username.nickname === user.nickname)
    username.innerHTML = userNickname[0].nickname
    
    const date = document.createElement('p')
    date.classList.add('date')
    date.innerHTML = `<small>${new Date().toLocaleTimeString()}</small>`    
    
    const textContainer = document.createElement('div')
    textContainer.classList.add('textContainer')
    
    const textParagraph = document.createElement('p')
    textParagraph.innerText = response.message

    messageContainer.appendChild(innerMessage)
    innerMessage.appendChild(messageInfo)
    messageInfo.appendChild(username)
    messageInfo.appendChild(date)
    innerMessage.appendChild(textContainer)
    textContainer.appendChild(textParagraph)

    // const mainMessageContainer = document.getElementsByClassName('messages')
    messages.appendChild(messageContainer)
})

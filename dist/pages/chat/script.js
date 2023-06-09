const url = 'https://chat-jcnn.onrender.com'
// const url = 'http://localhost:3003'
const socket = io(url)
const userList = document.querySelector('.user-list')
const send = document.getElementById('send')
const messages = document.querySelector('.messages')
const currentUserIcon = document.getElementById('user')
const inputFile = document.getElementById('inputFile')
const imgProfile = document.getElementById('imgProfile')
const input = document.getElementById('input')
const btnSend = document.getElementById('btnSend')
const inputAttach = document.getElementById('inputAttach')
const attachImage = document.getElementById('attachImage')
const modal = document.querySelector('.modal')
const imageDescription = document.getElementById('imageDescription')
const sendFile = document.getElementById('sendFile')
let user = localStorage.getItem('user')




document.getElementById('userName').innerHTML = user

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
    const filtered = data.filter(item => item.nickname !== user)

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
        fetch(`${url}/signout/${user}`, {
            method:'DELETE',
        }).then(res => res.text()).then(()=>{
            localStorage.clear()
            location.href = '../../index.html'
        }).catch(e=>{
            alert(e.message)
        })
    }
})


input.addEventListener('input', ()=>{
    const msgTemp = document.getElementById('msgTemp')
    btnSend.style.display = 'block'
    btnSend.removeAttribute('disabled')
    msgTemp.style.display = 'none'

    if(input.value === ''){
        msgTemp.style.display = 'block'
        btnSend.style.display = 'none'
        btnSend.setAttribute('disbled', 'true')
    }
})

// ====================================SEND MESSAGES==================================
send.addEventListener('submit', (event)=>{
    event.preventDefault()
    
    const messageData = {
        sender: user,
        message: input.value
    }
    socket.emit('message', messageData)
    input.value = ''
    btnSend.setAttribute('disabled', 'true')
    msgTemp.style.display = 'block'
    btnSend.style.display = 'none'
    input.focus()
})

// ==========================RECEIVED AND MESSAGES==========================================
socket.on('receivedMessage', response=>{
    const isOur = response.sender === user
    const mediaQuery = matchMedia('(max-width: 600px)')

    const messageContainer = document.createElement('div')
    messageContainer.classList.add('messageContainer')
    if(!isOur) messageContainer.classList.add('left')

    const ifMatchesChange = ()=>{
        if(mediaQuery.matches){     
            if(isOur) messageContainer.classList.add('right')
        }else{
            messageContainer.classList.add('left')
        }
    }

    mediaQuery.addEventListener('change', ifMatchesChange)
    
    const innerMessage = document.createElement('div')
    innerMessage.classList.add('message')
    innerMessage.style.backgroundImage = 'linear-gradient(lightgray, whitesmoke)'
    if(!isOur){
        innerMessage.style.backgroundImage = 'linear-gradient(lightgray, gray)'
    }
    
    const messageInfo = document.createElement('div')
    messageInfo.classList.add('messageInfo')
    
    const username = document.createElement('p')
    username.classList.add('username')
    username.innerHTML = response.sender
    
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
    
    messages.appendChild(messageContainer)

    messages.scrollTop = messages.scrollHeight
})

// ==============================SEND FILES========================================
document.getElementById('attach').addEventListener('click', ()=>{
    inputAttach.click()
})

inputAttach.addEventListener('change', ()=>{
    const file = inputAttach.files[0]
    const fileReader = new FileReader()

    if(file){
        fileReader.readAsDataURL(file)
    }

    fileReader.addEventListener('load', ()=>{        
        attachImage.src = fileReader.result
        
        sendFile.addEventListener('submit', (e)=>{
            e.preventDefault()
            
            socket.emit('file', {
                sender: user,
                file: fileReader.result,
                legend: imageDescription.value
            })
            modal.style.display = 'none'        
        })
    })

    fileReader.addEventListener('loadend', ()=>{
        modal.style.display = 'flex'
    })
})

document.getElementById('close').addEventListener('click', ()=>{
    modal.style.display = 'none'
})

// ================================RECEIVE FILES=============================
socket.on('receivedFile', response=>{
    const isOur = response.sender === user
    const mediaQuery = matchMedia('(max-width: 600px)')

    const messageContainer = document.createElement('div')
    messageContainer.classList.add('messageContainer')
    if(!isOur) messageContainer.classList.add('left')

    const ifMatchesChange = ()=>{
        if(mediaQuery.matches){     
            if(isOur) messageContainer.classList.add('right')
        }else{
            messageContainer.classList.add('left')
        }
    }

    mediaQuery.addEventListener('change', ifMatchesChange)
    
    const innerMessage = document.createElement('div')
    innerMessage.classList.add('message')
    innerMessage.style.backgroundImage = 'linear-gradient(lightgray, whitesmoke)'
    if(!isOur){
        innerMessage.style.backgroundImage = 'linear-gradient(lightgray, gray)'
    }
    
    const messageInfo = document.createElement('div')
    messageInfo.classList.add('messageInfo')
    
    const username = document.createElement('p')
    username.classList.add('username')
    username.innerHTML = response.sender
    
    const date = document.createElement('p')
    date.classList.add('date')
    date.innerHTML = `<small>${new Date().toLocaleTimeString()}</small>`    
    
    const fileContainer = document.createElement('div')
    fileContainer.classList.add('fileContainer')

    const fileParagraph = document.createElement('p')
    fileParagraph.innerHTML = `
        <img class='fileContent' src='${response.file}'>
        <div style='text-align:left;'>${response.legend}</div>
    `
    
    messageContainer.appendChild(innerMessage)
    innerMessage.appendChild(messageInfo)
    messageInfo.appendChild(username)
    messageInfo.appendChild(date)
    innerMessage.appendChild(fileContainer)
    fileContainer.appendChild(fileParagraph)    
    
    messages.appendChild(messageContainer)

    messages.scrollTop = messages.scrollHeight
})
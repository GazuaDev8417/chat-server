import io from 'socket.io-client'
const socket = io('http://localhost:3003')
const input = document.getElementById('input')
const send = document.getElementById('send')
let userId



send.addEventListener('click', ()=>{
    socket.emit('message', input.value)
    input.value = ''
    input.focus()
})

socket.on('welcome', id=>{
    userId = id
})

socket.on('receivedMessage', response=>{
    const isOur = response.userId === userId

    const messageContainer = document.createElement('div')
    messageContainer.classList.add('messageContainer')
    const innerMessage = document.createElement('div')
    innerMessage.classList.add('message')
    const messageInfo = document.createElement('div')
    messageInfo.classList.add('messageInfo')
    const username = document.createElement('p')
    username.classList.add('username')
    username.innerText = 'Eu mesmo'
    const date = document.createElement('p')
    date.classList.add('date')
    date.innerText = new Date().toLocaleTimeString()    
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

    const mainMessageContainer = document.getElementsByClassName('messages')[0]
    mainMessageContainer.appendChild(messageContainer)
})

{/* <div class="messageContainer">
    <div class="message">
        <div class="messageInfo">
            <p class="username">Eu mesmo</p>
            <p class="date">20/03/2023</p>
        </div>
        <div class="textContainer">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Aspernatur iure voluptates, officiis quam non eligendi 
                placeat quisquam modi tempora similique tempore sapiente 
                inventore enim commodi temporibus hic ut id rem.
            </p>
        </div>
    </div>
</div> */}
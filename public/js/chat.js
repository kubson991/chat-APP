const socket=io()
const form=document.querySelector('form')
const $messageForm = document.querySelector('form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $locationButton=document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $url =document.querySelector('#url')
const title = document.querySelector('h1')

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const {userName,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

socket.on('roomData',({room,users})=>{
    console.log(users)
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')

    const message= e.target.elements.message.value
    $messageFormInput.value=''
    $messageFormInput.focus()
    socket.emit('message',message,(error)=>{
        if (error) {
            return console.error(error)
        }
        console.log('message Delivered')
    })
    $messageFormButton.removeAttribute('disabled')
})

title.innerText=`You are in server : ${room}`

socket.on('message',(message)=>{
    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createAt:moment(message.createAt).format('h:m a')
    })
    $messages.insertAdjacentHTML('beforeend',html);
    $messages.scrollTop = $messages.scrollHeight;
})

socket.on('position',(message)=>{
    console.log(message)
    const html=Mustache.render(locationTemplate,{
        username:message.username,
        url:message.position,
        createAt:moment(message.createAt).format('h:m a')

    })
    $messages.insertAdjacentHTML('beforeend',html)
    $messages.scrollTop = $messages.scrollHeight;
})

document.querySelector('#send-location').addEventListener('click',()=>{
    $locationButton.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        return alert('Geolocation is not supported in your browser')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('position',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },(error)=>{
            $locationButton.removeAttribute('disabled')
            if (error) {
                return console.error(error)
            }
            console.log('position delivered')
        })
    })
})

socket.emit('join',{userName,room},(error)=>{
    if (error) {
        alert(error)
        location.href='/'
    }
})
const users=[]

const addUser=({id,username,room})=>{
    //clean data
        username=username.trim().toLowerCase()
        room = room.trim().toLowerCase()
    //variable the data
    if (!username || !room) {
        return{
            error:'Username and room are required!'
        }
    }
    // check existing user
    const existingUser=users.find((user)=>{
        return user.room === room && user.username ===username
    })

    // validate username
    if (existingUser) {
        return{
            error:'Username is in use!'
        }
    }
    //Store user
    const user={id,username,room}
    users.push(user)
    return { user }
}
export const removeUser=(id)=>{
    const index = users.findIndex((user)=> user.id === id)
    console.log(index)
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    console.log(users)
    if (index > -1) {
        return users.splice(index,1)[0]
    }
    console.log('____________________________')
    console.log(users)
    console.log('____________________________')
}
export const getUser=(id)=>{
    const index = users.findIndex((user)=> user.id === id)
    if (index !== undefined) {
        return users[index]
    }
}
export const getUsersInRoom=(room)=>{
    const Room=users.filter(user => user.room === room)
    return Room
}

export default addUser
const generateMessage=(username,text)=>{
    return{
        username,
        text,
        createAt:new Date().getTime()
    }
}
export const generatePosition=(username,position)=>{
    return{
        username,
        position,
        createAt:new Date().getTime()
    }
}

export default generateMessage



import socket from 'socket.io-client'

let socketinstance=null;

export const initiateSocket=(projectId)=>{
    socketinstance=socket('http://localhost:3444',{
        auth:{
            token:localStorage.getItem('token')
        },
        query:{
            projectId
        }
    })
    return socketinstance;
}

export const receivemsg=(eventname,cb)=>{
    socketinstance.on(eventname,cb);

}

export const send=(eventname,data)=>{
    socketinstance.emit(eventname,data)
}

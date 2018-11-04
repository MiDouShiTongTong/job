// 引入客户端io
import io from 'socket.io-client';

// 连接服务器
const socket = io('ws://127.0.0.1:8002');

// 绑定 receiveMessage 的监听(用域接收服务端消息)
socket.on('receiveMsg', function (data) {
  console.log('客户端接收到消息:', data);
});

// 向服务端发送信息
const sendData = {
  name: 'yyc',
  data: Date.now()
};
socket.emit('sendMsg', sendData);
console.log('向服务端发送消息:', sendData);

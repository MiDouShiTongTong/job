// 引入客户端io
import io from 'socket.io-client';

// 连接服务器
const socket = io('ws://127.0.0.1:8002/home/chat');

socket.on('connect', () => {
  // WebSocket 连接完成
  console.log('connect!');

  // 发送消息
  const data = {
    name: 'yyc'
  };
  console.log('send to server!', data);
  socket.emit('receive', data);

  // 接收消息
  socket.on('send', data => {
    console.log('receive from server!', data);
  });
});

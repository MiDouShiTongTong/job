module.exports = () => {
  return async (ctx, next) => {
    const userId = ctx.query.userId;
    const socketId = ctx.socket.id;
    // 连接时更新用户的 socket id
    await ctx.service.chatSocket.insertUserSocketId(userId, socketId);

    await next();

    // 断开连接清空 socket id
    ctx.service.chatSocket.deleteMany({
      where: {
        socket_id: socketId
      }
    });
  };
};

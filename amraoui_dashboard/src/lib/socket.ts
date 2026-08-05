import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.vehiqqo.com';

    if (backendUrl.includes('vercel.app')) {
      socket = {
        on: () => { },
        off: () => { },
        emit: () => { },
        connect: () => { },
        disconnect: () => { },
        disconnected: true,
        io: { opts: { query: {} } },
      } as unknown as Socket;
    } else {
      socket = io(backendUrl, {
        autoConnect: false,
      });
    }
  }
  return socket;
};

export const connectSocket = (userId: string, role: string) => {
  const socketInstance = getSocket();
  if (socketInstance.disconnected) {
    socketInstance.io.opts.query = { id: userId, role };
    socketInstance.connect();
  }
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

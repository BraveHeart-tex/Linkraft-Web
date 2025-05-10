import { io, Socket } from 'socket.io-client';
import { SOCKET_NAMESPACES } from './socket.constants';
import { SocketEvent, SocketEventPayloads } from './socket.types';

export class SocketClient {
  private socket: Socket | null = null;

  connect() {
    if (this.socket) return this.socket;

    const socket = io(
      `${process.env.NEXT_PUBLIC_API_URL}/${SOCKET_NAMESPACES.BOOKMARKS}`,
      {
        withCredentials: true,
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      }
    );

    socket.on('connect', () => console.log(`[Socket] Connected: ${socket.id}`));
    socket.on('disconnect', (reason) =>
      console.warn('[Socket] Disconnected:', reason)
    );
    socket.io.on('reconnect_attempt', (attempt) =>
      console.info('[Socket] Reconnect attempt:', attempt)
    );
    socket.io.on('reconnect_error', (err) =>
      console.error('[Socket] Reconnect error:', err)
    );
    socket.io.on('error', (err) =>
      console.error('[Socket] Connection error:', err)
    );

    this.socket = socket;
    return socket;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  get instance(): Socket {
    if (!this.socket) throw new Error('Socket not connected');
    return this.socket;
  }

  on<K extends SocketEvent>(
    event: K,
    handler: (payload: SocketEventPayloads[K]) => void
  ) {
    this.instance.on(event as string, handler);
  }

  off<K extends SocketEvent>(
    event: K,
    handler: (payload: SocketEventPayloads[K]) => void
  ) {
    this.instance.off(event as string, handler);
  }

  emit<K extends SocketEvent>(event: K, payload: SocketEventPayloads[K]) {
    this.instance.emit(event, payload);
  }
}

let socketClient: SocketClient | null = null;

export function getSocketClient(): SocketClient {
  if (!socketClient) {
    socketClient = new SocketClient();
  }
  return socketClient;
}

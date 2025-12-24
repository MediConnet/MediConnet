/**
 * WebSocket para tracking en tiempo real de ambulancias
 * TODO: Implementar con Socket.io o similar
 */
export class AmbulanceSocket {
  private socket: WebSocket | null = null;

  connect(requestId: string, _onUpdate: (data: any) => void) {
    // TODO: Implementar conexión WebSocket
    console.log('Conectando WebSocket para request:', requestId);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}






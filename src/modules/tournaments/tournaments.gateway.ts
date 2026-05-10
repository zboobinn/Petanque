import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

// On ouvre le portail WebSocket et on autorise tout le monde à s'y connecter (CORS)
@WebSocketGateway({ cors: { origin: '*' } })
export class TournamentsGateway {
  
  @WebSocketServer()
  server!: Server; // <-- LE FAMEUX POINT D'EXCLAMATION EST ICI !

  // Fonction appelée par le service quand un joueur valide un score sur le web
  notifyNewScore(tournamentId: number) {
    this.server.emit('newPendingScore', { tournamentId });
  }
}
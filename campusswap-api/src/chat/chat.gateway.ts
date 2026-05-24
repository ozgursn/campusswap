import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// CORS hatası yememek için tarayıcı kapılarını (frontend portunu) açıyoruz
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173', // React ön yüzümüzün adresi
  },
})
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  // 1. Odaya Katılma Mesajı: Öğrenciler ilan ID'sine göre özel bir odaya (room) girecek
  // Böylece A ilanı için konuşulanlar B ilanına karışmayacak
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId);
    console.log(`🔌 Bir öğrenci odaya katıldı: ${data.roomId}`);
  }

  // 2. Mesaj Gönderme: Bir öğrenci mesaj attığında bu fonksiyon tetiklenecek
  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { roomId: string; senderName: string; message: string },
  ) {
    console.log(`💬 [${data.roomId}] ${data.senderName}: ${data.message}`);
    
    // Mesajı odadaki diğer kişiye (alıcıya) anlık olarak fırlatıyoruz
    this.server.to(data.roomId).emit('newMessage', data);
  }
}
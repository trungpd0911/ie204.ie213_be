import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TablesService } from './tables.service';

@WebSocketGateway(8000, {
	cors: {
		origin: '*',
	},
})
export class tableGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;
	constructor(
		private configService: ConfigService,
		private jwtService: JwtService,
		private tableService: TablesService,
	) {}

	afterInit(server: Socket) {
		console.log('Server initialized');
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log('Client connected ' + client.id);
		const authHeader = client.handshake.headers['authorization'];
		if (authHeader) {
			try {
				const token = authHeader;
				const decoded = this.jwtService.verify(token, {
					secret: this.configService.get('JWT_SECRET'),
				});
				client.data = decoded;
			} catch (error) {
				console.log(error);

				client.emit('error', {
					message: 'Unauthorized',
				});
				// send error message to client
				client.disconnect();
			}
		} else {
			client.emit('error', {
				message: 'Unauthorized',
			});
			client.disconnect();
		}
	}

	@SubscribeMessage('BOOK_TABLE')
	async handleBookTable(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: any,
	) {
		try {
			const tableId = data.tableId;
			const bookingTime = data.bookingTime;

			const userId = client.data._id;
			const roomId = '' + userId;

			// console.log('Table booked ' + tableId + ' at ' + bookingTime);
			client.join(roomId);

			const res = await this.tableService.bookTable(
				tableId,
				bookingTime,
				userId,
			);

			this.server.to(roomId).emit('BOOK_TABLE', res.toClient.message, {
				tableId: res.toClient.tableId,
			});
			if (res.broadcast) {
				client.broadcast.emit('BOOK_TABLE', res.broadcast.message, {
					tableId: res.broadcast.tableId,
				});
			}
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	@SubscribeMessage('CANCEL_TABLE')
	async handleCancelTable(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: any,
	) {
		try {
			const tableId = data.tableId;
			const userId = client.data._id;
			const roomId = '' + userId;

			// console.log('Table canceled ' + tableId);
			client.join(roomId);

			const res = await this.tableService.cancelTable(tableId, userId);

			this.server.to(roomId).emit('CANCEL_TABLE', res.toClient.message, {
				tableId: res.toClient.tableId,
			});
			if (res.broadcast) {
				client.broadcast.emit('CANCEL_TABLE', res.broadcast.message, {
					tableId: res.broadcast.tableId,
				});
			}
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	handleDisconnect(client: Socket) {
		console.log('Client disconnected ' + client.id);
	}
}

import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TicketSchema } from "./schemas/ticket"
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from '../event/event.module';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Ticket', schema: TicketSchema }]),
    EventModule,
  ],
  providers: [TicketService],
  controllers: [TicketController]
})
export class TicketModule {}

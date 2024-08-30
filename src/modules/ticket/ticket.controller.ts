import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { Ticket } from './schemas/ticket';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  async addTicket(
    @Body('event') event: string,
    @Body('price') price: number,
    @Body('seat') seat: string,
  ): Promise<Ticket> {
    return await this.ticketService.createTicket(event, price, seat);
  }

  @Get()
  async getAllTickets(): Promise<Ticket[]> {
    return await this.ticketService.getTickets();
  }

  @Get(':id')
  async getTicket(@Param('id') ticketId: string): Promise<Ticket> {
    return await this.ticketService.getTicketById(ticketId);
  }

  @Patch(':id')
  async updateTicket(
    @Param('id') ticketId: string,
    @Body('event') event: string,
    @Body('price') price: number,
    @Body('seat') seat: string,
  ): Promise<Ticket> {
    return await this.ticketService.updateTicket(ticketId, event, price, seat);
  }

  @Delete(':id')
  async removeTicket(@Param('id') ticketId: string): Promise<void> {
    return await this.ticketService.deleteTicket(ticketId);
  }
}

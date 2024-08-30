import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from './schemas/event.schema';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async addEvent(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('date') date: Date,
  ): Promise<Event> {
    return await this.eventService.createEvent(title, description, date);
  }

  @Get()
  async getAllEvents(): Promise<Event[]> {
    return await this.eventService.getEvents();
  }

  @Get(':id')
  async getEvent(@Param('id') eventId: string): Promise<Event> {
    return await this.eventService.getEventById(eventId);
  }

  @Patch(':id')
  async updateEvent(
    @Param('id') eventId: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('date') date: Date,
  ): Promise<Event> {
    return await this.eventService.updateEvent(eventId, title, description, date);
  }

  @Delete(':id')
  async removeEvent(@Param('id') eventId: string): Promise<void> {
    return await this.eventService.deleteEvent(eventId);
  }
}

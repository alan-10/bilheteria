import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from "./schemas/event.schema";

@Injectable()
export class EventService {
  constructor(@InjectModel('Event') private readonly eventModel: Model<Event>) {}

  async createEvent(title: string, description: string, date: Date): Promise<Event> {
    const newEvent = new this.eventModel({ title, description, date });
    return await newEvent.save();
  }

  async getEvents(): Promise<Event[]> {
    return await this.eventModel.find().exec();
  }

  async getEventById(eventId: string): Promise<Event> {
    const event = await this.eventModel.findById(eventId).exec() || null;
    console.log("alan event",event )
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async updateEvent(eventId: string, title: string, description: string, date: Date): Promise<Event> {
    const updatedEvent = await this.eventModel.findByIdAndUpdate(eventId, { title, description, date }, { new: true });
    if (!updatedEvent) {
      throw new NotFoundException('Event not found');
    }
    return updatedEvent;
  }

  async deleteEvent(eventId: string): Promise<void> {
    const result = await this.eventModel.findByIdAndDelete(eventId).exec();
    if (result === null) {
      throw new NotFoundException('Event not found');
    }
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schemas/event.schema';
import { NotFoundException } from '@nestjs/common';

const mockEvent = {
  title: 'Test Event',
  description: 'Test Description',
  date: new Date(),
};

const mockEventModel = {
  new: jest.fn().mockResolvedValue(mockEvent),
  constructor: jest.fn().mockResolvedValue(mockEvent),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  save: jest.fn(),
  exec: jest.fn(),
};

describe('EventService', () => {
  let service: EventService;
  let model: Model<Event>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: getModelToken('Event'), useValue: mockEventModel },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    model = module.get<Model<Event>>(getModelToken('Event'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createEvent', () => {

    const mockEventModel: jest.Mock = jest.fn();

    const service = new EventService( mockEventModel as unknown as Model<Event>);

    it('should create a new event', async () => {

      mockEventModel.mockImplementation(() => ({
        save: jest.fn().mockReturnValue(mockEvent),

      }));
      const result = await service.createEvent(mockEvent.title, mockEvent.description, mockEvent.date);

      expect(result).toEqual(mockEvent);

    });
  });

  describe('getEvents', () => {
    it('should return an array of events', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce([mockEvent]),
      } as any);
      const result = await service.getEvents();
      expect(result).toEqual([mockEvent]);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('getEventById', () => {
    it('should return an event if found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockEvent),
      } as any);
      const result = await service.getEventById('someId');
      expect(result).toEqual(mockEvent);
      expect(model.findById).toHaveBeenCalledWith('someId');
    });

    it('should throw a NotFoundException if event is not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      await expect(service.getEventById('someId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateEvent', () => {
    it('should update an existing event', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockEvent),
      } as any);
      const result = await service.updateEvent('someId', mockEvent.title, mockEvent.description, mockEvent.date);
      
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith('someId', {
        title: mockEvent.title,
        description: mockEvent.description,
        date: mockEvent.date,
      }, { new: true });

      expect(model.findByIdAndUpdate).toHaveBeenCalled(); 
      expect(result).toEqual(mockEvent); 
    });

    it('should throw a NotFoundException if event is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      await expect(service.updateEvent('someId', mockEvent.title, mockEvent.description, mockEvent.date)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockEvent),
      } as any);
      await service.deleteEvent('someId');
      expect(model.findByIdAndDelete).toHaveBeenCalledWith('someId');
    });

    it('should throw a NotFoundException if event is not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      await expect(service.deleteEvent('someId')).rejects.toThrow(NotFoundException);
    });
  });
});

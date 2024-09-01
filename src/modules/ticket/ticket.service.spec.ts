import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket } from './schemas/ticket';
import { EventService } from '../event/event.service';
import { NotFoundException } from '@nestjs/common';

const mockTicket = {
  event: 'someEventId',
  price: 100,
  seat: 1,
};

const mockTicketModel = {
  new: jest.fn().mockResolvedValue(mockTicket),
  constructor: jest.fn().mockResolvedValue(mockTicket),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  save: jest.fn().mockResolvedValue(mockTicket),
  exec: jest.fn(),
  populate: jest.fn(),
};

const mockEventService = {
  getEventById: jest.fn().mockResolvedValue({}),
};

describe('TicketService', () => {
  let service: TicketService;
  let model: Model<Ticket>;
  let eventService: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        { provide: getModelToken('Ticket'), useValue: mockTicketModel },
        { provide: EventService, useValue: mockEventService },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
    model = module.get<Model<Ticket>>(getModelToken('Ticket'));
    eventService = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTicket', () => {
    it('should create a new ticket', async () => {

      const mockTicketModel: jest.Mock = jest.fn();
      const mockEventModel = {
        getEventById: jest.fn().mockReturnValue(mockTicket.event)
      };

      mockTicketModel.mockImplementation(() => ({
        save: jest.fn().mockReturnValue(mockTicket),
      }));

      const service = await new TicketService(mockTicketModel as unknown as Model<Ticket>,
        mockEventModel as unknown as EventService).createTicket('teste', 2, 2);

      expect(service).toEqual(mockTicket);
      expect(mockTicketModel).toHaveBeenCalled();
      expect(mockTicketModel).toHaveBeenCalledWith({event: "teste", price: 2, seat: 2});
      expect(mockEventModel.getEventById).toHaveBeenCalled();
      expect(mockEventModel.getEventById).toHaveBeenCalledWith("teste");

    });

  });

  describe('getTickets', () => {
    it('should return an array of tickets', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce([mockTicket]),
      } as any);
      const result = await service.getTickets();
      expect(result).toEqual([mockTicket]);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('getTicketById', () => {
    it('should return a ticket if found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(mockTicket),
      } as any);
      const result = await service.getTicketById('someTicketId');
      expect(result).toEqual(mockTicket);
      expect(model.findById).toHaveBeenCalledWith('someTicketId');
    });

    it('should throw a NotFoundException if ticket is not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      await expect(service.getTicketById('someTicketId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTicket', () => {
    it('should update an existing ticket', async () => {
      const updatedTicket = { ...mockTicket, price: 200 };
      
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: jest.fn().mockResolvedValueOnce(updatedTicket),
      
      } as any);
      const result = await service.updateTicket('someTicketId', updatedTicket.event, updatedTicket.price, updatedTicket.seat);
      expect(result).toEqual(updatedTicket);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith('someTicketId', {
        event: updatedTicket.event,
        price: updatedTicket.price,
        seat: updatedTicket.seat,
      }, { new: true });
    });

    it('should throw a NotFoundException if ticket is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      await expect(service.updateTicket('someTicketId', mockTicket.event, mockTicket.price, mockTicket.seat)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTicket', () => {
    it('should delete a ticket', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockTicket),
      } as any);
      await service.deleteTicket('someTicketId');
      expect(model.findByIdAndDelete).toHaveBeenCalledWith('someTicketId');
    });

    it('should throw a NotFoundException if ticket is not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      await expect(service.deleteTicket('someTicketId')).rejects.toThrow(NotFoundException);
    });
  });
});

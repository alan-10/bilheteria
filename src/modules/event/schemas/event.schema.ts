import { Schema, Document } from 'mongoose';

export const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
});

export interface Event extends Document {
  id?: string;
  title: string;
  description: string;
  date: Date;
}

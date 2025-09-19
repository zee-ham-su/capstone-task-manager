import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
}

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  _id: string; // Added for Mongoose documents

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ default: new Date() })
  dueDate: Date;

  @Prop({ default: 'medium', enum: ['low', 'medium', 'high'] })
  priority: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: String, enum: Object.values(TaskStatus), default: TaskStatus.PENDING })
  status: TaskStatus;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
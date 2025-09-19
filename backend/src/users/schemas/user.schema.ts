import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum NotificationType {
  EMAIL = 'email',
  PUSH = 'push',
}

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_doc, ret: any) => {
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: ['user'] })
  roles: string[];

  @Prop({ required: false })
  passwordResetToken?: string;

  @Prop({ required: false })
  passwordResetExpires?: Date;

  @Prop({ default: true })
  notificationEnabled: boolean;

  @Prop({ type: [Number], default: [60 * 24] }) // Default to 24 hours (1440 minutes)
  notificationIntervals: number[];

  @Prop({ type: String, enum: Object.values(NotificationType), default: NotificationType.EMAIL })
  notificationType: NotificationType;
}

export const UserSchema = SchemaFactory.createForClass(User);

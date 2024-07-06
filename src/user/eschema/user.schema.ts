import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop({
    required: true,
    unique: true
  })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
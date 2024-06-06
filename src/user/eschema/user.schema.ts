import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop()
  email: string;


  // constructor(user?: Partial<User>) {
  //   super()
  //   this.name = user?.name;
  //   this.password = user?.password;
  //   this.email = user?.email;
  // }
}

export const UserSchema = SchemaFactory.createForClass(User);
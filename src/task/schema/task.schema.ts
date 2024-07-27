import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class Task extends Document {

    @Prop()
    userId: string;

    @Prop()
    title: string;

    @Prop({default: 'a fazer'})
    status: string
  
    @Prop()
    description: string;
  
    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop()
    priority: number
}

export const TaskSchema = SchemaFactory.createForClass(Task);
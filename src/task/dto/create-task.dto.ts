import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
    userId: string;

    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsString()
    description?: string;
  
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    startDate: Date;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    endDate: Date;

    @IsNumber()
    @IsNotEmpty()
    priority: number
}

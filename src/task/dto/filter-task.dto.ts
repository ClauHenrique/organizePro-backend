import { IsNotEmpty, IsString } from "class-validator";

export class FilterTaskStatus {
    
    @IsString()
    @IsNotEmpty()
    status: string
}
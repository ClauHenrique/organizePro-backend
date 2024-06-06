import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {

    @MinLength(3, {
        message: 'username must contain at least 3 characters',
    })
    @IsString()
    name: string;

    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must contain at least 8 characters, one letter, one number, and one special character',
      })
    @MinLength(8, {
        message: 'the password must contain at least 8 characters',
    })
    @MaxLength(15, {
        message: 'password cannot contain more than 15 characters',
    })
    @IsString()
    password: string;
  
    @IsEmail()
    email: string;
}

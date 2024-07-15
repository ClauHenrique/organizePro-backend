import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {

    @MinLength(3, {
        message: 'o nome de usuário deve conter pelo menos 3 caracteres',
    })
    @IsString()
    name: string;

    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'a senha deve conter letras, números e caracteres especiais',
      })
    @MinLength(8, {
        message: 'a senha deve conter pelo menos 8 caracteres',
    })
    @IsString()
    password: string;
  
    @IsEmail()
    email: string;
}

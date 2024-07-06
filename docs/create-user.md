# Cadastrar Usuário

## Validações realizadas no corpo da requisição
Antes de cadastrar o usuário, precisamos verificar se os dados enviados pelo frontend correspondem às regras de negócio da aplicação.
 - A senha deve conter pelo menos 8 caracteres, incluindo letras, números e símbolos.
 - O nome do usuário deve conter pelo menos 3 caracteres.
     - Defini isso para evitar usuários com nomes muito pequenos, que talvez não seriam reconhecidos pelo usuário ou então caso ele tente deixar o campo de **nome** vazio.
 - Essas validações são realizadas pela biblioteca **class-validator** no objeto que captura os dados do corpo da requisição.
 - Observe que as mensagens de resposta estão sendo enviadas em português. Estou fazendo isso para que o frontend possa renderizar essas mensagens na tela como resposta a uma tentativa de cadastro inválido.

```typescript
 // src/user/dto/create-user.dto.ts
 import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

 export class CreateUserDto {
     @MinLength(3, {
         message: 'O nome de usuário deve conter pelo menos 3 caracteres',
     })
     @IsString()
     name: string;

     @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
         message: 'A senha deve conter letras, números e caracteres especiais',
     })
     @MinLength(8, {
         message: 'A senha deve conter pelo menos 8 caracteres',
     })
     @IsString()
     password: string;

     @IsEmail()
     email: string;
 }
```

## O cadastro de usuário é feito pelo método *create*, descrito abaixo:

```typescript
 // src/user/user.service.ts
 import { ConflictException } from '@nestjs/common';
 import * as bcrypt from 'bcrypt';
 import { CreateUserDto } from './dto/create-user.dto';
 import { User } from './schema/user.schema';
 import { Model } from 'mongoose';
 import { InjectModel } from '@nestjs/mongoose';

export class UserService {
     constructor(
         @InjectModel(User.name) private userModel: Model<User>,
     ) {}

     async create(createUserDto: CreateUserDto): Promise<User> {
         // Verificar se já existe um cadastro com esse email
         const { email } = createUserDto;
         const verify = await this.userModel.findOne({ email });

         if (verify) {
             throw new ConflictException("Este usuário já existe");
         }

         try {
             // Criptografar a senha
             const hash = await bcrypt.hash(createUserDto.password, 8);
             createUserDto.password = hash;

             const createdUser = new this.userModel(createUserDto);

             return await createdUser.save();
         } catch (error) {
             throw new ConflictException("Este usuário já existe");
         }
     }
 }
 ```

 ## Esse método é composto por três partes principais:
 Primeiro, precisamos verificar se já existe um cadastro com o email que o usuário está tentando utilizar. <br>
 Caso o usuário esteja tentando cadastrar o mesmo email novamente, é retornada uma exceção:
 ```typescript
 const { email } = createUserDto;
 const verify = await this.userModel.findOne({ email });

 if (verify) {
     throw new ConflictException("Este usuário já existe");
 }
 ```

Para garantir que a aplicação aceite apenas um cadastro por email, durante a modelagem do banco, defini que o campo email deve ser único:

```typescript
 // src/user/schema/user.schema.ts
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
         unique: true,
     })
     email: string;
 }

 export const UserSchema = SchemaFactory.createForClass(User);
 ```

O cadastro do usuário no banco é realizado em um bloco **try e catch** caso a verificação anterior falhe ou essa parte do código seja executada antes que a primeira termine sua execução. <br> 
Caso o MongoDB retorne um erro devido à duplicidade de emails, também retornamos uma exceção. <br>
Em seguida, criptografamos a senha do usuário para garantir a segurança de suas informações e por último, salvamos as informações no banco de dados.

```typescript
 try {
     // Criptografar a senha
     const hash = await bcrypt.hash(createUserDto.password, 8);
     createUserDto.password = hash;

     const createdUser = new this.userModel(createUserDto);

     return await createdUser.save();
 } catch (error) {
     throw new ConflictException("Este usuário já existe");
 }
```

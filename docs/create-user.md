# cadastrar usuário

O cadastro de usuário é feito pelo método **create**, descrito abaixo:

```src/user/user.service.ts```
```typescript
async create(createUserDto: CreateUserDto): Promise<User> {
    // verificar se ja existe um cadastro com esse email
    const {email} = createUserDto
    const verify = await this.userModel.findOne({email})

    if (verify) {
      throw new ConflictException("This user already exists")
    }
    
    try {
       // criptografar a senha
      const hash = await bcrypt.hash(createUserDto.password, 8);
      createUserDto.password = hash

      const createdUser = new this.userModel(createUserDto);

      return await createdUser.save();
      
    } catch (error) {
      throw new ConflictException("This user already exists")
    }
  }
```

## Esse metodo é composto por três partes principais:
primeiro precisamos verificar se já existe um cadastro com o email que o usuario está tentando cadastrar. <br>
Caso o usuário esteja tentando cadastrar o mesmo email novamente, é retornado uma exceção:
```typescript
 const {email} = createUserDto
 const verify = await this.userModel.findOne({email})

 if (verify) {
      throw new ConflictException("This user already exists")
    }
 ```
Para garantir que a aplicação aceite apenas um cadastro por email, durante a modelagem do banco, eu defini que o campo email deve ser único:
```src/user/schema/user.schema.ts```
```typescript
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
 ```
O cadastro do usuario no banco é realizado em um bloco **try e catch** caso a verificação anterior falhe ou essa parte do código seja executada antes que a primeira termine sua execução. <br> 
Caso o mongodb retorne um erro devido a duplicidade de emails, também retornamos uma exceção. <br>
Em seguida criptografamos a senha do usúario para garantir a segurança de suas informações. E por último salvamos as informações no banco de dados.

```typescript
  try {
       // criptografar a senha
      const hash = await bcrypt.hash(createUserDto.password, 8);
      createUserDto.password = hash

      const createdUser = new this.userModel(createUserDto);

      return await createdUser.save();
      
    } catch (error) {
      throw new ConflictException("This user already exists")
    }
 ```



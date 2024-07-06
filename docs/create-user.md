# cadastrar usuario

o cadastro de usuario é feito pelo metodo create descrio a baixo:

```src/user/user.service.ts```
```typescript
async create(createUserDto: CreateUserDto): Promise<User> {
    // verificar se ja existe um cadastro com esse email
    const {email} = createUserDto
    const verify = await this.userModel.findOne({email})

    if (verify) {
      throw new ConflictException("Este usuario já existe")
    }
    
    try {
       // criptografar a senha
      const hash = await bcrypt.hash(createUserDto.password, 8);
      createUserDto.password = hash

      const createdUser = new this.userModel(createUserDto);

      return await createdUser.save();
      
    } catch (error) {
      throw new ConflictException("Este usuario já existe")
    }
  }
```

## esse metodo é composto por três partes principais:
primeiro precisamos verificar se já existe um cadastro com o email que o usuario está tentando cadastrar. <br>
Caso o usuario esteja tentando cadastrar o mesmo email novamente, é retornado uma exceção
```typescript
 const {email} = createUserDto
 const verify = await this.userModel.findOne({email})

 if (verify) {
      throw new ConflictException("Este usuario já existe")
    }
 ```
Para garantir que a aplicação aceite apenas um cadastro de email, durante a modelagem do banco, eu defini que o campo email deve ser único:
```src/user/schema/user.schema.ts```
```typescript
 const {email} = createUserDto
 const verify = await this.userModel.findOne({email})

 if (verify) {
      throw new ConflictException("Este usuario já existe")
    }
 ```


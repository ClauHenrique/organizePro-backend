# Login do Usuário

 ## Tecnologias Utilizadas
 
 - **JWT**: utilizado para gerar tokens de acesso a aplicação.
 - **bcrypt**: utilizado para criptografar as senhas dos usuários cadastrados e valida-las ao realizar o login.

## O login de usuário foi implementado da seguinte forma:
   
O serviço `auth.service.ts` contém a lógica para autenticar o usuário.
- O método **signIn** realiza uma busca no banco de dados pelo usuário através do seu email
- Se esse email não for encontrado, significa que esse usuário não está cadastrado e uma exceção de inautorização é retornada
- Se o email estiver cadastrado no banco, utilizamos método **compare** do bcrypt para verificar se a senha fornecida pelo
 usuário corresponde a senha criptografada que está salva no banco
- Se as credenciais forem validas, utilizamos a lib **JWT** para gerar um token de acesso para ser utilizado pelo usuário no frontend
- A lib **JWT** está sendo estanciada e utilizada pelo serviço de injeção de dependencias do Nest.js como `jwtService`:

 ```typescript
    // src/auth/auth.service.ts
    @Injectable()
    export class AuthService {
      constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) {}
 ```

### Código completo:

 ```typescript
 // src/auth/auth.service.ts
  async signIn(login: LoginUserDto): Promise<any> {

    try {
        const user = await this.usersService.findOne(login.email);   

        if (!user) {
          throw new UnauthorizedException('invalid credentials');
        }
    
        const validatePassword = await bcrypt.compare(login.password, user.password)

        if (!validatePassword) {
          throw new UnauthorizedException('invalid credentials');
        }

        const payload = { email: user.email, sub: user._id };

        return {
          access_token: await this.jwtService.signAsync(payload),
        };

    }
    
      catch(err) {
        throw new UnauthorizedException('invalid credentials');
      }
    }
 ```

## Implementação do Guardião responsável por proteger as rotas da aplicação 
    
O guardião `auth.guard.ts` implementa a lógica para verificar se o token JWT está presente e válido em cada 
requisição, utilizando o `JwtService` do Nest.js.

Exemplo de `auth.guard.ts`:
  
```typescript
// src/auth/guards/auth.guard.ts
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.SECRET_KEY
        }
      );
     
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
 ```

 #### Exemplo de Uso

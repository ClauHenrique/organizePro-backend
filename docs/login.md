# Login do Usuário

 ## Tecnologias Utilizadas
 
 - **JWT**: utilizado para gerar tokens de acesso a aplicação.
 - **bcrypt**: utilizado para criptografar as senhas dos usuários cadastrados e validá-las ao realizar o login.

## O login de usuário foi implementado da seguinte forma:
   
O serviço `auth.service.ts` contém a lógica para autenticar o usuário.
- O método **signIn** realiza uma busca no banco de dados pelo usuário através do seu email
- Se esse email não for encontrado, significa que esse usuário não está cadastrado e uma exceção de não autorização é retornada
- Se o email estiver cadastrado no banco, utilizamos o método **compare** do bcrypt para verificar se a senha fornecida pelo usuário corresponde à senha criptografada que está salva no banco
- Se as credenciais forem válidas, utilizamos a lib **JWT** para gerar um token de acesso a ser utilizado pelo usuário no frontend
- A lib **JWT** está sendo instanciada e utilizada pelo serviço de injeção de dependências do Nest.js como `jwtService`:

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
    
O guardião `auth.guard.ts` protege as rotas da API permitindo que elas possa ser acessadas apenas se o cliente da API 
enviar um token valido junto da requisição.
  
```typescript
  // src/auth/guards/auth.guard.ts
    
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
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
  }
 ```
O token enviado na requisição pode ser obtido através da função `extractTokenFromHeader(request: Request)`,  
que extrai o token presente cabeçalho da requisição. \
Após isso, a bilioteca JWT valida se o token recebido é valido. Caso seja invalido, retornamos uma `UnauthorizedException`.
<br>
<br>
Podemos usar esse guardião para proteger algumas rotas da API. Permitindo que elas possas se acessadas apenas se o token
for passado.

 ### Exemplo de Uso
 Proteje todo o controller responsável por tratar as requisições de **tasks** 

 ```typescript
// src/task/task.service.ts

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    createTaskDto.userId = req['user'].sub
    
    return this.taskService.create(createTaskDto);
  }

...
}
 ```
 

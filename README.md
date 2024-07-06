### ` Status: em desenvolvimento... `
# 📜 Sobre
Este projeto é a parte backend de um sistema de gerenciamento de tarefas. Esse sistema está sendo construído com o objetivo de ser utilizado como parte do meu portfólio pessoal.

Sim! Apesar de sistemas de gerenciamento de tarefas serem algo bem clichê, este é um projeto especial. Pretendo deixá-lo o mais próximo do funcionamento de um sistema em produção. E em breve estarei fazendo o deploy da aplicação e irei disponibilizar o link aqui.

## Documentação

- [Cadastro de usuário](https://github.com/ClauHenrique/organizePro-backend/blob/main/docs/create-user.md)
- [Login](https://github.com/ClauHenrique/organizePro-backend/blob/main/docs/login.md)
- [Testes](https://github.com/ClauHenrique/organizePro-backend/blob/main/docs/testes.md)
- [Como instalar e executar o projeto](#como-instalar-e-executar-o-projeto-em-sua-máquina)


## 📑 Principais caracteristicas 
- validar email
- recuperação de senha
- autenticação de usuario com JWT
- cadastrar tarefas
- gerenciar conflitos nos horarios de agendamento das tarefas
- receber notificações por email
- relatorio com desmpenho de tarefas cumpridas/não cumpridas
- criar um ambiente de testes

## Como instalar e executar o projeto em sua máquina
### Opção 1
Clone o projeto <br>

Crie o arquivo com as variáveis de ambiente:
```console
Crie um arquivo `.env`
Você pode seguir o exemplo do arquivo `.env.exemple` presente no diretório raiz.
```
No diretório raiz, execute:
```bash
  npm i
```
```bash
  npm run start
```
 
### Opção 2
- Se desejar, pode executar o projeto através de containers Docker.
- Crie o arquivo com as variáveis de ambiente.
- O próprio docker-compose se encarregará de instalar dependências e iniciar o projeto.
- Apenas execute no terminal:
```bash
  docker-compose up
```

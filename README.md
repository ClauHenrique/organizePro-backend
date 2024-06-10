### ` Status: em desenvolvimento... `
# 📜 Sobre
Este projeto é a parte backend de um sistema de gerenciamento de tarefas. Esse sistema está sendo construído com o objetivo de ser utilizado como parte do meu portfólio pessoal.

Sim! Apesar de sistemas de gerenciamento de tarefas serem algo bem clichê, este é um projeto especial. Pretendo deixá-lo o mais próximo do funcionamento de um sistema em produção. E em breve estarei fazendo o deploy da aplicação e irei disponibilizar o link aqui.

# 📑 Principais regras de negócio 
- Cadastro de usuários
  - Validar se o email informado corresponde à estrutura correta de um email.
  - Não permitir que uma pessoa possa cadastrar um usuário com nome ou email que já foram cadastrados anteriormente.
  - A senha deve conter caracteres especiais, no mínimo 8 e no máximo 15 caracteres.
  - Criptografar a senha e salvá-la no banco de dados.
    
  Incorreto:
  - 👤 Nome: `joao`  ❌ este usuário já existe.
  - 📧 Email: `joao.com`  ❌ esta não é a estrutura de um email válido.
  - 🔒 Senha: `123456`  ❌ a senha deve conter de 8 a 15 caracteres, incluindo letras, símbolos e números.
  - 
  Correto:
  - 👤 Nome: `Mateus`  ✅
  - 📧 Email: `mateus@email.com`  ✅
  - 🔒 Senha: `mat@1234&@!`  ✅

- Fazer login de usuário
  - Verificar se as credenciais informadas são válidas.
  - Retornar um token de acesso para o usuário.

- Proteger algumas rotas de acesso
  - As rotas relacionadas ao cadastro de tarefas só podem ser acessadas se o usuário fornecer o token.
  - Retornar uma exceção para tentativas de acesso sem autorização.

- O usuário pode cadastrar uma tarefa definindo:
  - Título
  - Descrição
  - Data de Início
  - Data de Fim
  - Prioridade 

- Uma tarefa não pode ser cadastrada em um dia/horário que entre em conflito com outra já cadastrada.
  - Tarefas com prioridade mais alta podem ser cadastradas mesmo que já exista uma cadastrada ocupando esse dia/horário.
  - O dia/horário das demais tarefas serão reajustados para se adequar ao novo horário.
  - Apresentar gráficos com tarefas concluídas para determinado mês, dia e horário.
  - Apresentar gráfico com tarefas prestes a vencer.

# 🛠 Tecnologias utilizadas
...

# Como instalar e executar o projeto em sua máquina
### Opção 1
- Clone o projeto.
- No diretório raiz, execute: npm i.
- Crie o arquivo com as variáveis de ambiente:
  - Crie um arquivo `.env`.
  - Você pode seguir o exemplo do arquivo `.env.exemple` presente no diretório raiz.
    
### Opção 2
- Se desejar, pode executar o projeto através de containers Docker.
- Crie o arquivo com as variáveis de ambiente.
- O próprio docker-compose se encarregará de instalar dependências e iniciar o projeto.
- Apenas execute no terminal: docker-compose up.

# Testes realizados
...

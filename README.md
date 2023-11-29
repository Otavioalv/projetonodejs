NodeApp
Este projeto foi desenvolvido durante um curso de NodeJs enquanto aprendia sobre NodeJs, MongoDB e Mysql. O objetivo era criar um CRUD, cadastro de usuarios, e permisões administrativas onde somente adms poderiam acesar conteudos especificos.

Configuração
Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

Pré-requisitos
Node.js instalado
MongoDB instalado
Seu editor de texto preferido (recomendado: Visual Studio Code)
Instalação
Clone o repositório:

bash
Copy code
git clone https://github.com/seu-usuario/seu-projeto.git
Abra o diretório do projeto no seu editor de texto:

bash
Copy code
cd seu-projeto
code .
No terminal, instale as dependências:

bash
Copy code
npm install
Banco de Dados
Inicie o MongoDB em um terminal:

bash
Copy code
mongod
Em outro terminal, acesse o console do MongoDB:

bash
Copy code
mongo
Crie um novo banco de dados e liste as coleções disponíveis:

bash
Copy code
use blogapp
show collections
Encontre o usuário que deseja tornar um administrador:

bash
Copy code
db.usuarios.find()
Atualize o usuário para ser um administrador:

bash
Copy code
db.usuarios.updateOne({nome: "nomeDoUsuario"}, {$set: {eAdmin: 1}})
Executando o Projeto
Inicie o servidor:

bash
Copy code
npm start
Abra o navegador e acesse:

Página principal: http://localhost:8089
Página de administração (apenas para administradores): http://localhost:8089/admin/postagens
Página de categorias (apenas para administradores): http://localhost:8089/admin/categorias
Criando Usuários e Realizando Login
Siga os procedimentos padrão fornecidos pela aplicação para criar usuários e realizar logins.
Acesso Administrativo
Apenas usuários com permissões de administrador podem acessar as seguintes URLs:

http://localhost:8089/admin/postagens
http://localhost:8089/admin/categorias
Lembre-se de fazer login com o usuário que foi configurado como administrador.

Observação: Certifique-se de que o MongoDB está em execução antes de iniciar o projeto.



# NodeApp
Este projeto foi desenvolvido durante um curso de Node.js, enquanto aprendia sobre Node.js, MongoDB e MySQL. O objetivo era criar um CRUD, cadastro de usuários e permissões administrativas, onde apenas administradores poderiam acessar conteúdos específicos.
---

## Configuração
Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

* **Node.js instalado**
* **MongoDB instalado**
* **Seu editor de texto preferido (recomendado: Visual Studio Code)**


### Instalação

* **Abra um termial na pasta da sua escolha e clone o repositório:**

```
git clone https://github.com/seu-usuario/seu-projeto.git
```

* **Abra o diretório do projeto no seu editor de texto:**

```
cd local-do-projeto
```

```
code .
```

* **No terminal, instale as dependências:**

```
npm install
```
### Banco de Dados

* **Inicie o MongoDB em um terminal:**

```
mongod
```

* **Em outro terminal, acesse o console do MongoDB:**

```
mongosh
```

### Executando o Projeto
> [!WARNING]
> * **Certifique-se de que o MongoDB está em execução antes de iniciar o projeto.**

* **Inicie o servidor:**

```
npm start
```

* **Abra o navegador e acesse:**
[Página principal](http://localhost:8089)

### Criando Usuários e Realizando Login
> [!NOTE]
> * **Siga os procedimentos padrão fornecidos pela aplicação para criar usuários e realizar logins.**

### Acesso Administrativo
* **Apenas usuários com permissões de administrador podem acessar as seguintes URLs:**

  - http://localhost:8089/admin/postagens
  - http://localhost:8089/admin/categorias

* **Para acessá-los, faça login com o usuário que foi configurado como administrador.**


### Administração
* **No console do MongoDb liste as coleções disponíveis no banco de dados:**

```
show dbs
```
```
use blogapp
```
```
show collections
```

* **Encontre o usuário que deseja tornar um administrador:**

```
db.usuarios.find()
```

* **Atualize o usuário para ser um administrador:**

```
db.usuarios.updateOne({nome: "nomeDoUsuario"}, {$set: {eAdmin: 1}})
```

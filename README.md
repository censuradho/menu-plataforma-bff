# Trabalho final

Este trabalho consiste no desenvolvimento de APIs RESTful (Web Services RESTful) com persistência da nossa aplicação Web. O objetivo deste trabalho é permitir os alunos aplicarem os conceitos e funcionalidades do REST e dos padrões de persistência vistos em aula. Nesse trabalho, a ideia é realizar o back-end do trabalho.

## Instruções gerais

O trabalho possui um tema livre com algumas restrições quanto às funcionalidades, ou seja, o(s) aluno(s) poderá(ão) trabalhar com um domínio de aplicação de seu interesse. Com base nessa especificação, o(s) aluno(s) (individual ou dupla) deverá(ão) desenvolver o back-end da aplicação. Para isso, todas as APIs devem ser implementados e testados - utilizando a ferramenta Postman (vista em aula). As APIs deverão contemplar pelo menos dois CRUD de entidades e uma funcionalidade específica, e essas funcionalidades deverão persistir seus dados em um banco de dados. Caso o aluno não tenha ideia de trabalho, o aluno deverá realizar a aplicação biblioteca descrito no anexo do Escopo do Trabalho (abaixo). A aplicação desenvolvida deverá contemplar alguns assuntos vistos em aula. Assim, a avaliação será baseada de acordo com as funcionalidades a serem desenvolvidas e com os conceitos de REST (vistos em aula) empregados para o desenvolvimento dessa aplicação.


## Avaliação

O conceito desse trabalho será baseado de acordo com as funcionalidades realizadas no trabalho e com os conceitos de REST e persistência empregados no trabalho. Abaixo segue a relação de conceitos e features a serem realizadas no trabalho: Conceito C:

Apresentação de forma clara (para o professor);
Duas APIs RESTful realizando CRUD funcionando de forma correta com persistência (um para cada aluno);
Testes das APIs corretamente. Conceito B:
Realizar as tarefas para alcançar o conceito C;
Realizar uma funcionalidade de negócio (ou CRUD) que manipule duas entidades simultaneamente na aplicação como um todo (utilizando APIs de forma correta e adequada) - no caso do retorno do buscarPorId, retornar os dois objetos relacionados e nos outros casos, verificar corretamente as restrições de FK;
Utilização de um sistema de controle de versão (ex: git) e de um ambiente de colaboração e gerenciamento de código baseado nesse controle de versão (ex: GitHub, Bitbucket). Caso o trabalho seja em grupo, a colaboração deve estar evidenciada;
Testes unitários aplicados utilizando Jest (pelo menos uma entidade para cada aluno - trabalhando com cenários de sucesso e pelo menos um de exceção - quando tiver).
Modelagem apropriada das APIs (retorno dos status code correto) e do código (visto em aula); Conceito A:
Aplicação completa, realizando todas as funcionalidades do conceito B com regras de negócio aplicadas corretamente;
Tratamento de erros, regras de negócio e exceções;
Testes de APIs utilizando Jest e Supertest;
Utilizar autenticação aplicando técnicas de segurança adequadamente (OAuth e JWT); ou uma das seguintes funcionalidades não vistas em aula: Implantar os Web Services em um servidor na nuvem: Heroku, Digital Ocean, etc; Swagger;


## Tema

Sistema de cardápio online

- Gerenciamento de empresa
- Gerenciamento de grupo de cardápios
- Gerenciamento de cardápio
- Gerenciamento de produtos
- upload de arquivo
- Autenticação via email/senha com token JWT serverOnly

## Getting started

### Requisitos

 - [Node.js](https://nodejs.org/en)


### Instalar ambiente

1. Após instalar os requisitos a cima, Na raiz do projeto, rode o comando 

```bash
$ npm i
```

2. Copiar o arquivo `.env.exemple` na raiz do projeto, renomeando-o para `.env`

3. Gerando o banco de dados local

```bash
npm run generate
```

4. Rode o ambiente de desenvolvimento

```bash
$ npm run dev
```

5. Agora, se acessar o path `http://localhost:3333`, devera aparecer a seguinte mensagem:

```json
{ "ok": "server is on" }
```

## END Points 
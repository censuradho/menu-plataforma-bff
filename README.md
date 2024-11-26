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


## Scripts

1. **npm run dev**: Roda o ambiente de desenvolvimento;
2. **npm run migrate:dev**: Gera novas migrations caso o schema tenha sido alterado;
3. **npm run generate**: Gera as migrations a partir dos arquivos pre-existentes;
4. **npm run studio**: Roda uma aplicação que exibe os dados do banco de dados;
5. **npm run build**: Gera o build da aplicação;
6. **npm run start**: Roda o arquivo buildado;
7. **npm run test**: Roda as suítes de teste;

## END Points 

###  Autenticação

**Cadastro**

Endpoint `POST /auth/store-user/register`

Request body

```json
{
  "email": "teste@teste.com",
	"firstName": "firstName",
	"lastName": "lastName",
	"password": "1234567890",
	"phone": "+5551982307645"
}
```

**Validação de e-mail**

Endpoint `POST /auth/store-user/email-validation`

Request body

```json
{
  "email": "teste@teste.com"
}
```


**Login**

Endpoint `POST /auth/store-user/login`

Request body

```json
{
	"email": "teste@teste.com",
	"password": "1234567890"
}
```

**Me**: Informações sobre o usuário

Endpoint `GET /auth/store-user/me`

Request body

```json
{
	"id": "13434ab5-cdf9-4ea6-9119-bced84a5340a",
	"firstName": "firstName",
	"email": "teste@teste.com",
	"lastName": "lastName"
}
```


**Logout**

Endpoint `GET /auth/store-user/logout`

###  Store

**Create**

Endpoint `POST /store`

Request body

```json
{
	"cuisineType": "cuisineType",
  "document": "document",
  "documentType": "documentType",
  "establishmentTime": "establishmentTime",
  "name": "name",
  "revenueEstimate": "revenueEstimate",
  "numberOfEmployees": 10
}
```

**FindByOwnerId**: Encontra uma loja pelo id do criador

Endpoint `GET /store`

Response body

```json
{
	"id": 1,
	"name": "name",
	"document": "document",
	"documentType": "documentType",
	"cuisineType": "cuisineType",
	"establishmentTime": "establishmentTime",
	"revenueEstimate": "revenueEstimate",
	"numberOfEmployees": 10,
	"ownerId": "13434ab5-cdf9-4ea6-9119-bced84a5340a",
	"createdAt": "2024-11-15T00:16:06.127Z",
	"updatedAt": "2024-11-15T00:16:06.127Z"
}
```

###  MenuGroup

Agrupador de cardápios

**Upsert**: Cria ou atualiza caso ja exista

Endpoint `POST /menu-group`

Request body

```json
{
	"id": 4,
  "hourFrom": "",
  "hourTo": "",
  "label": "menu group 0",
  "visible": true,
  "menus": [
    {
			"id": 1,
      "label": "menu 0",
      "products": [
        {
					"id": 1,
          "label": "product 0",
          "limitAge": true,
          "value": "100",
          "visible": true
        },
				{
					"id": 3,
          "label": "product 0",
          "limitAge": true,
          "value": "100",
          "visible": true
        },
				{
          "label": "product 99",
          "limitAge": true,
          "value": "100",
          "visible": true
        }
      ]
    }
  ]
}
```

**FindMany**

Endpoint `GET /menu-group`

Response body

```json
[
		{
		"id": 1,
		"label": "menu group 0",
		"visible": true,
		"storeId": 1,
		"hourFrom": "",
		"hourTo": "",
		"createdAt": "2024-11-15T12:39:32.329Z",
		"updatedAt": "2024-11-15T13:59:52.880Z",
		"menus": [
			{
				"id": 1,
				"label": "menu 0",
				"groupId": 1,
				"createdAt": "2024-11-15T13:48:05.000Z",
				"updatedAt": "2024-11-15T13:59:52.880Z",
				"products": [
					{
						"id": 4,
						"label": "product 99",
						"value": "100",
						"image": "C:\\code\\estudos\\menu\\menu-bff\\src\\shared\\tmp\\1731848898808-900312694-WhatsApp Image 2024-10-25 at 11.54.43.jpeg",
						"visible": true,
						"limitAge": true,
						"menuId": 1,
						"createdAt": "2024-11-15T13:59:52.882Z",
						"updatedAt": "2024-11-15T13:59:52.882Z"
					}
				]
			}
		]
	},
]
```

### Product

**Delete**

Endpoint `DELETE product/:productId/menu/:menuId/menuGroup/:groupId`

**ImageUpload**: Upload da foto do produto

Endpoint `PUT product/:productId/menu/:menuId/menuGroup/:groupId/image`


Request body:

application/form-data - file: File



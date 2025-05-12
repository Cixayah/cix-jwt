# Projeto API JWT em Node.js

## Descrição
Este projeto é uma API desenvolvida em Node.js que utiliza autenticação JWT (JSON Web Tokens). Ele fornece endpoints para registro de usuários, login e acesso a recursos protegidos.

## Instruções de Uso

### Insomnia
Você pode importar as instruções de uso da API no Insomnia utilizando o arquivo `Insomnia_Requests.json` fornecido neste repositório.

### Endpoints

#### 1. Registrar usuário
**POST** /auth/register


{
  "name": "Cix",
  "email": "cix@dev.com",
  "password": "cix123",
  "confirmPassword": "cix123"
}


#### 2. Login
**POST** /auth/login

{
  "email": "cix@dev.com",
  "password": "cix123"
}


#### 3. Obter informações do usuário por ID
**GET** /user/:userId

https://cix-api.vercel.app


## Agradecimentos
Este projeto foi desenvolvido com muito carinho e dedicação. Obrigado por testar e contribuir!

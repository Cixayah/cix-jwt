require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

//Config JSON response - Configuração de resposta do JSON
app.use(express.json())

//Models - Modelos
const User = require('./models/User');

//Public Open Route - Rota Aberta Pública
app.get('/', (req, res) => {
    res.status(200).json({ msg: "Bem vindo a API do Cix" });
});

//Private Route - Rota Privada
app.get("/user/:id", checkToken, async (req, res) => {
    const id = req.params.id;
    //check if users exists - checando usuário
    const user = await User.findById(id, '-password')
    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado" })
    }

    res.status(200).json({ user })
})


//Check Token - Verifica o Token
function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ msg: "Acesso negado!" });
    }
    try {

        const secret = process.env.SECRET
        jwt.verify(token, secret);
        next();

    } catch (error) {
        res.status(400).json({ msg: "Token inválido, hoje não amigo." });
    }
}


//Register User - Registro de Usuário
app.post('/auth/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    
    //Validations - Validações
    if (!name) {
        return res.status(422).json({ msg: "O nome é obrigatório!" })
    }
    if (!email) {
        return res.status(422).json({ msg: "O e-mail é obrigatório!" })
    }
    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória!" })
    }
    if (password !== confirmPassword) {
        return res.status(422).json({ msg: "A senha não confere!" })
    }

    //check if user already exists - Checa se o usuário já existe
    const userExist = await User.findOne({ email: email })
    if (userExist) {
        return res.status(422).json({ msg: "Usuário já cadastrado!" })
    }

    //Create password - Senha criada
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create user - Criando usuário
    const user = new User({
        name,
        email,
        password: passwordHash,
    })
    try {
        await user.save();
        res.status(201).json({ msg: "Usuário criado com sucesso!" })
    } catch (error) {
        res.status(500).json({
            msg: "Aconteceu um erro no servidor, tente novamente mais tarde!"
        })
    }
});

//Login User - Login de Usuário
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body

    //Validations - Validações
    if (!email) {
        return res.status(422).json({ msg: "O e-mail é obrigatório!" })
    }
    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória!" })
    }
    //Check if user exists (why?!) - Checar se o usuário existe (Por quê?!)
    const user = await User.findOne({ email: email })

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" })
    }

    //Check if password match - Verifica se as senhas batem
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        return res.status(422).json({ msg: "Senha inválida!" })
    }

    try {
        const secret = process.env.SECRET
        const token = jwt.sign({
            id: user._id,
        },
            secret,
        )

        res.status(200).json({ msg: "Autenticação realizada com sucesso", token })

    } catch (err) {
        console.log(error)
        res
            .status(500)
            .json({
                msg: "Aconteceu um erro no servidor, tente novamente mais tarde!"
            })

    }

})

//Credentials - Credenciais
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPass}@cluster0.qteohvi.mongodb.net/?retryWrites=true&w=majority`
)
    .then(() => {
        app.listen(3000);
        console.log('Conectou ao MongoDB! ><');
    })
    .catch((err) => console.log(err));
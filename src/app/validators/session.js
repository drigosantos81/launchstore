const User = require('../models/User');
const { compare } = require('bcryptjs');

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
    
        if (!user) {
            return res.render("session/login", {
                user: req.body,
                error: 'Usuário não cadastrado'
            });
        }
    
        const passed = await compare(password, user.password);
    
        if (!passed) {
            return res.render('session/login', {
                user: req.body,
                error: 'Senha incorreta'
            });
        }
    
        req.user  = user;
    
        next();
    } catch (error) {
        console.log(error);
    }
}

async function forgot(req, res, next) {
    const { email } = req.body;
    try {
        let user = await User.findOne({ where: { email } });

        if (!user) {
            return res.render('session/forgot-password', {
                user: req.body,
                error: 'E-mail não cadastrado'
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error(error);
    }
}

async function reset(req, res, next) {
    const { email, password, token, passwordRepeat } = req.body;

    try {
        // VERIFICA SE JÁ TEM CADASTRO
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.render('session/password-reset', {
                user: req.body,
                token,
                error: 'Usuário não cadastrado'
            });
        }
        // VERIFICA SE AS SENHAS ESTÃO IGUAIS
        if (password != passwordRepeat) {
            return res.render('session/password-reset', {
                user: req.body,
                token,
                error: 'A repetição da senha está diferente'
            });
        }
        //VERIFICA SE O TOKEN ESTÁ CORRETO
        if (token != user.reset_token) {
            return res.render('session/password-reset', {
                user: req.body,
                token,
                error: 'Token inválido. Solicite uma nova recuperação de senha.'
            });
        }
        // VERIFICAR SE TOKEN EXPIROU
        let now = new Date();
        now = now.setHours(now.getHours());

        if (now > user.reset_token_expire) {
            return res.render('session/password-reset', {
                user: req.body,
                token,
                error: 'Token expirado. Solicite uma nova recuperação de senha.'
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    login,
    forgot,
    reset
}
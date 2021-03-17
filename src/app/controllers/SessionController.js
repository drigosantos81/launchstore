const crypto = require('crypto');
const { hash } = require('bcryptjs');

const User = require('../models/User');
const mailer = require('../../lib/mailer');

module.exports = {
  loginForm(req, res) {
    return res.render('session/login');
  },

  login(req, res) {
    req.session.userId = req.user.id;

    return res.redirect('/users');
  },

  logout(req, res ) {
    req.session.destroy();

    return res.redirect('/');
  },

  forgotForm(req, res) {
    return res.render('session/forgot-password');
  },

  async forgot(req, res) {
    const user = req.user;

    try {
      // CRIAÇÃO DE UM TOKEN
      const token = crypto.randomBytes(20).toString('hex');

      // EXPIRAÇÃO DO TOKEN
      let now = new Date();
      now = now.setHours(now.getHours() + 1);

      await User.update(user.id, {
        reset_token: token,
        reset_token_expire: now
      });

      // ENVIAR E-MAIL DE RECUPERAÇÃO DE SENHA
      await mailer.sendMail({
        to: user.email,
        from: 'no-reply@launchstore.com.br',
        subject: 'Recuperação de senha',
        html: `
          <h2>Perdeu a chave?</h2>
          <p>Clique no link abaixo para recuperar sua senha</p>
          <p>
            <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
              RECUPERAR SENHA
            </a>
          </p>
        `,
      })

      return res.render('session/forgot-password', {
        success: 'Verifique seu e-mail para resetar sua senha'
      });
    } catch (error) {
      console.error(error);
      return res.render('session/forgot-password', {
        success: 'Erro inesperado, tente novamente.'
      });
    }
  },

  resetForm(req, res) {
    return res.render('session/password-reset', { token: req.query.token });
  },
  
  async reset(req, res) {
    const user = req.user;

    const { password, token } = req.body;

    try {
      // CRIA NOVO HASH DE SENHA
      const newPassword = await hash(password, 8);

      // ATUALIZA USUÁRIO
      await User.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expire: ""
      });

      // AVISA AO USUÁRIO QUE ELE TEM UMA NOVA SENHA
      return res.render('session/login', {
        user: req.body,
        success: 'Senha atualizada. Faça o seu login'
      });
      
    } catch (error) {
      console.error(error);
      return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Erro inesperado, tente novamente.'
      });
    }
  }
}
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Model Usauarios
require('../models/Ussuario');
const Usuario = mongoose.model('usuarios');

module.exports = function(passport) {

    // Registrando nova estrategia de autenticação
    passport.use(new localStrategy({usernameField: 'email', passwordField: "senha"}, (email, senha, done) => {
        Usuario.findOne({email: email})
        .then(usuario => {
            if(!usuario) {
                return done(null, false, {message: "Conta não existe."});
            }else {
                bcrypt.compare(senha, usuario.senha, (erro, baten) => {
                    if(baten) {
                        return done(null, usuario);
                    }else{
                        return done(null, false, {message: "Senha incorreta!"});
                    }
                });
            }   
        })
        .catch(err => {
            console.log('Erro ao autenticar >>> '+ err);
        });
    }));

    passport.serializeUser((usuario, done) => {
        done(null, usuario._id);
    });

    passport.deserializeUser((id, done) => {
        Usuario.findById(id)
            .then(usuario => {
                if (!usuario) {
                    return done(null, false);
                }
                done(null, usuario);
            })
            .catch(err => {
                done(err, null);
            });
    });

};
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Ussuario');
const Usuario = mongoose.model('usuarios');
const bcrypt = require('bcryptjs');

const passport = require('passport');


router.get('/usuario/:id', (req, res) => {
    Usuario.findOne({_id: req.params.id}).lean()
    .then(usuario => {
        res.render('./usuarios/usuario', {usuario: usuario});
    })
    .catch(err => {
        req.flash('error_msg', "Erro ao encontrar usuario");
        res.redirect('/');
    })
});

router.get('/registro', (req, res) => {
    res.render('usuarios/registro');
    Usuario.find().then(usuario => console.log(usuario));
});

router.post('/registro', (req, res) => {
    var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome Invalido"});
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email Invalido"});
    }
    
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha Invalida"});
    }    

    if(req.body.senha.length < 4 ) {
        erros.push({texto: "A senha tem que ter no minimo 4 digitos!!!"});
    }

    if(req.body.senha != req.body.senha2) {
        erros.push({texto: "Senhas diferentes, tente novamente"});
    }

    if(erros.length > 0) {
        res.render('./usuarios/registro', {erros: erros});
    } else {
       
        Usuario.findOne({email: req.body.email}).lean()
        .then(usuario => {
            if(usuario) {
                req.flash('error_msg', "Já existe uma conta com esse email");
                res.redirect('/usuario/registro');
            } else {

                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                    eAdmin: 0
                });

                // salt e um valor aleatorio misturado com o hash para q fique mais dificil descobrir a senha
                bcrypt.genSalt(10, (erro, salt) => {
                    // pede 3 parametros, 
                    // 1 - o valor que quero hashear
                    // 2 - salt
                    // 3 - calbacl(erro, hash)
                    bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
                        if(err) {
                            req.flash('error_msg', "Erro ao salvamento do usuairo");
                            res.redirect('/');
                        } 

                        novoUsuario.senha = hash;
                        novoUsuario.save()
                        .then(() => {
                            req.flash('success_msg', "Usuario Criado com suceso!!");                            
                            res.redirect("/");
                        })
                        .catch(err => {
                            req.flash('error_msg', "Erro ao salvar usuario");
                            res.redirect('/');
                        });
                    });
                });

            }
        })
        .catch(err => {
            req.flash('error_msg', "Houve um erro Interno");
            res.redirect('/');
        })
        // pass
    }
});


router.get('/login', (req, res) => {
    res.render("usuarios/login");    
});

router.post('/login', (req, res, next) => {

    // autenticar algo
    passport.authenticate('local', {
        successRedirect: "/", 
        failureRedirect: "/usuario/login",
        failureFlash: true
    })(req, res, next);

});

router.get('/logout', (req, res) => {

    req.logout(err => {
        req.flash('success_msg', "deslogado com sucesso!!");
        res.redirect('/');
    });
});


module.exports = router;
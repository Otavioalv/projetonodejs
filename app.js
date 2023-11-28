// Modulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const mongoose = require('mongoose');

    const admin = require('./routes/admin');
    const usuario = require('./routes/usuario');
    const path = require('path');

    const session = require('express-session');
    const flash = require('connect-flash'); // Cria seção q aparece uma vez

    const app = express();
    const PORT = process.env.PORT || 8089;

    require('./models/Postagens');
    const Postagens = mongoose.model('postagens');

    require('./models/Categoria');
    const Categoria = mongoose.model('categorias');

    const passport = require('passport');
    require('./config/auth')(passport);

    const db = require('config/db');

// Configurações 
    // Sessão app.use() criação e configuração de midlleware
    app.use(session({
        secret: "cursodenode",
        resave: true,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    
    // Tem que ficar abaixo da seção 
    app.use(flash());

    // Middleware 
    app.use((req, res, next) => {
        // declarar uma variavel global res.locals.nomeVariavel
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
        next();
    });

    app.use(express.urlencoded({extended: false}));
    app.use(express.json());

    // handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
    app.set('view engine', "handlebars");

    // mongoose
    mongoose.Promise = global.Promise;
    
    mongoose.connect('mongodb://127.0.0.1:27017/blogapp', {}).then(() => {
        console.log("Conectado ao bando de dados....");
    }).catch((err) => {
        console.log("Houve um erro >>> ", err);
    });

    
    // Public
    app.use(express.static(path.join(__dirname, 'public')));

    // middleware: fica interceptando o cliente e o servidor durante a comunicação
    app.use((req, res, next) => {
        next(); // Mandar passar a requisição 
    });

// Rotas deve chamar rotas abaixo das configurações
    app.use('/admin', admin);

    app.get('/', (req, res) => {
        Postagens.find().lean().populate('categoria').sort({data: 'desc'})
        .then((postagens) => {
            res.render('index', {postagens: postagens});
        }) 
        .catch(err => {
            req.flash('error_msg', "Erro ao monstra posts recentes >>> ");
            res.render('/404')
        });
        
    })

    app.get('/postagem/:slug', (req, res) => {
        Postagens.findOne({slug: req.params.slug}).lean()
        .then(postagem => {
            if(postagem)
                res.render('./postagem/', {postagem: postagem});
            else {
                req.flash('error_msg', "Postagem não existe");
                res.redirect('/');
            }
        })
        .catch(err => {
            req.flash('error_msg', "Houve um erro");
            res.render('/');
        });
    });


    app.get('/categorias', (req, res) => {
        Categoria.find().lean()
        .then(categorias => {
            res.render('./categorias', {categorias});
        })  
        .catch(err => {
            req.flash('error_msg', "erro ao listar categorias");
            res.redirect('/');
        })
    })

    app.get('/categorias/:slug', (req, res) => {
        Categoria.findOne({slug: req.params.slug}).lean()
        .then(categoria => {
            if(categoria){
             
                Postagens.find({categoria: categoria._id}).lean()
                .then(postagens => {

                    res.render('./categorias/postagens', {
                        categoria: categoria, 
                        postagens: postagens
                    });
                })
                .catch(err => {
                    req.flash('error_msg', 'Houve um erro');
                    res.redirect('/');
                });
            } else {
                req.flash('error_msg', "Não existe categorias");
                res.redirect('/');
            }
            
        })  
        .catch(err => {
            req.flash('error_msg', "erro ao listar categorias");
            res.redirect('/');
        })
    })

    app.get('/404', (req, res) => {
        res.send("erro")
    });

   app.use('/usuario', usuario);

// Outros
    app.listen(PORT, () => {
        console.log(`\nServer rodando na url http://localhost:${PORT}`);
    });
const express = require('express');
const router = express.Router();

const mongose = require('mongoose'); 

require('../models/Categoria');
const Categoria = mongose.model('categorias');
require('../models/Postagens');
const Postagens = mongose.model('postagens');

const {eAdmin} = require('../helpers/eAdmin');

router.get('/',eAdmin,(req, res) => {
    res.render('./admin/index');
});

router.get('/posts',eAdmin, (req, res) => {
    res.send('Posts');
});

router.get('/categorias',eAdmin,(req, res) => {    
    Categoria.find().sort({date: 'desc'})
    .lean() // Transforma os dados mais somples
    .then((categorias) => {
        res.render('./admin/categorias', {categorias: categorias});
    }) 
    .catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar categorias");
        req.redirect("/admin");
    });
});

router.get('/categorias/add',eAdmin,(req, res) => {
    res.render('./admin/addcategorias');
});

router.post('/categorias/nova',eAdmin,(req, res) => {
    // validar formulario
    var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: "Nome Invalido!"});
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({texto: "Slug Invalido!"});
    }

    if(erros.length > 0){
        res.render("./admin/addcategorias", {erros: erros});
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save()
        .then(() => {
            req.flash("success_msg", "Categoria criada com sucesso");
            res.redirect("/admin/categorias");
        })
        .catch((err) => {
            req.flash("error_msg", "Erro ao criar categoria");
            res.redirect("/admin");
        });
    }

    // -------------------------
});

router.get('/categorias/edit/:id',eAdmin,(req, res) => {
    Categoria.findOne({_id: req.params.id})
    .then((categoria) => {
        res.render("./admin/editcategoria", {
            nome: categoria.nome, 
            slug: categoria.slug,
            id: categoria._id
        });
    })
    .catch((err) => {
        req.flash("error_msg", "Esta categoria não existe");
        res.redirect("/admin");
    })
});

router.post('/categorias/edit',eAdmin,(req, res) => {

    var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: "Nome Invalido!"});
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({texto: "Slug Invalido!"});
    }

    if(erros.length > 0){
        Categoria.findOne({_id: req.body.id})
        .then((categoria) => {
            res.render("./admin/editcategoria", {
                erros: erros,
                nome: categoria.nome, 
                slug: categoria.slug,
                id: categoria._id
            });
        })
        .catch((err) => {
            req.flash("error_msg", "Erro ao verificar validação");
            res.redirect("/admin");
        })
    } else {
        
        Categoria.findOne({_id: req.body.id})
        .then((categoria) => {
            
            categoria.nome = req.body.nome;
            categoria.slug = req.body.slug;

            categoria.save()
            .then(() => {
                req.flash('success_msg', "Categoria Editata");
                res.redirect('/admin/categorias');
            }) 
            .catch((err) => {
                req.flash('error_msg', "Erro ao salvar");
                res.redirect("/admin/categoria");
            });
        }) 
        .catch((err) => {
            req.flash("error_msg", "Erro ao editar categoria");
            res.redirect("/admin/categorias");
        });
    }

});

router.post('/categorias/deletar',eAdmin,(req, res) => {
   
    Categoria.deleteOne({_id: req.body.id})
    .then(() => {
        req.flash("success_msg", "Categoria apagada com sucesso");
        res.redirect('/admin/categorias');
    })
    .catch((err) => {
        req.flash('error_msg', "Erro ao deletar Categoria"); 
        res.redirect('/admin/categorias');
    });

});



router.get('/postagens',eAdmin,(req, res) => {
    
    Postagens.find().lean().populate('categoria').sort({data: 'desc'})
    .then((postagens) => {
        res.render("admin/postagens", {postagens:postagens});
    })
    .catch((err) => {
        req.flash("error_msg", "Erro ao Listar postagens: "+err);
        res.redirect("/admin");
    });

});

router.get('/postagens/add',eAdmin,(req, res) => {
    Categoria.find().sort({date: 'desc'}).lean()
    .then((categorias) => {
        // req.flash('success_msg', "Criação de postagem aberto");
        res.render('./admin/addpostagens', {categorias: categorias});
    })
    .catch((err) => {
        req.flash('error_msg', "Erro ao abrir editor de postagem");
    });
});

router.post('/postagens/nova',eAdmin,(req, res) => {
    
    var erros = [];

    for(const key in req.body) {
        if(!req.body[key] || typeof req.body[key] == undefined || req.body[key] == null) {       
            erros.push({texto: `${key.charAt(0).toUpperCase() + key.slice(1)} Invalido!!!`})
        }
    }

    if(req.body.categoria == "0") {
        erros.push({texto: "Categoria invalida, registre uma categoria!!"});
    }

    if(erros.length > 0) {
        res.render("./admin/addpostagens", {erros: erros});
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }

        new Postagens(novaPostagem).save()
        .then(() => {
            req.flash('success_msg', "Postagem salva!!");
            res.redirect('/admin/postagens');
        })
        .catch((err) => {
            req.flash('error_msg', "Erro ao Salvar postagem");
            res.redirect('/admin/postagens');
        })
    }
});


router.get("/postagens/edit/:id",eAdmin,(req, res) => {
    Postagens.findOne({_id: req.params.id})
    .then((postagem) => {

        Categoria.find().sort({date: 'desc'}).lean()
        .then((categorias) => {
            
            res.render('./admin/editpostagens', {
                titulo: postagem.titulo,
                slug: postagem.slug,
                descricao: postagem.descricao,
                conteudo: postagem.conteudo,
                categoria: postagem.categoria,
                id: postagem.id,
                categorias: categorias
            });
        }).catch(err => {
            req.flash('error_msg', "Erro ao listar categorias");
            res.redirect('/admin/postagens');
        })
    })
    .catch((err) => {
        req.flash("error_msg", "Postagem não existe...");
        res.redirect('/admin');
    })
});

router.post('/postagens/edit',eAdmin,(req, res) => {

    var erros = [];

    for(const key in req.body) {
        if(!req.body[key] || typeof req.body[key] == undefined || req.body[key] == null) {       
            erros.push({texto: `${key.charAt(0).toUpperCase() + key.slice(1)} Invalido!!!`})
        }
    }

    if(req.body.categoria == "0") {
        erros.push({texto: "Categoria invalida, registre uma categoria!!"});
    }

    if(erros.length > 0) {
        // res.render("./admin/addpostagens", {erros: erros});
        Postagens.findOne({_id: req.body.id})
        .then((postagem) => {
            Categoria.find().sort({date: 'desc'}).lean() 
            .then(categorias => {
                res.render('./admin/editpostagens', {
                    titulo: postagem.titulo,
                    slug: postagem.slug,
                    descricao: postagem.descricao,
                    conteudo: postagem.conteudo,
                    categoria: postagem.categoria,
                    id: postagem.id,
                    categorias: categorias,
                    erros: erros
                });
            })
            .catch(err => {
                req.flash('error_msg', "Erro ao encontrar categoris");
                res.redirect('/admin/postagens');
            })
        }) 
        .catch(err => {
            req.flash('error_msg', "Erro ao encontrar postagem");
            res.redirect('/admin/postagens');
        })

    } else {
        Postagens.findOne({_id: req.body.id})
        .then((postagem) => {
            postagem.titulo = req.body.titulo;
            postagem.slug = req.body.slug;
            postagem.descricao = req.body.conteudo;
            postagem.categoria = req.body.categoria;
            postagem.conteudo = req.body.conteudo;
    
            postagem.save()
            .then(() => {
                req.flash('success_msg', "Categoria editada com sucesso!!!");
                res.redirect('/admin/postagens');
            }).catch((err) => {
                req.flash('error_msg', "Erro ao salvar postagem: "+ err);
                res.redirect('/admin/postagens');
            });
        }).catch((err) => {
            req.flash('error_msg', "Erro ao encontrar postagem: "+err);
            res.redirect('/admin/postagens');
        })
    }
});



router.get('/postagens/deletar/:id',eAdmin,(req, res) => {
    Postagens.deleteOne({_id: req.params.id})
    .then(() => {
        req.flash('success_msg', 'Postagem deletado com sucesso!!!');
        res.redirect('/admin/postagens');
    })
    .catch(err => {
        console.log('deletado ERR: '+ err);
        req.flash('error_msg', "Erro ao deletar postagem");
        res.redirect('/admin/postagens');
    });
});


module.exports = router;
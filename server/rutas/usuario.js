const express = require('express');
const Usuario = require('../modelos/usuario');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();






app.get('/usuario', verificaToken, (req, res) => {

    let desde = Number(req.query.desde) || 0;

    let limite = Number(req.query.limite) || 5;


    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((error, usuarios) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                })
            }



            res.json({
                ok: true,
                usuarios,
                cuantos: usuarios.length
            })

        })


});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((error, usuarioDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            })
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });

});

app.put('/usuario/:id', verificaToken, function(req, res) {
    let identificador = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(identificador, body, { new: true, runValidators: true }, (error, usuarioDB) => {

        if (error) {
            return res.status(400).json({
                ok: false,
                error
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })

});

app.delete('/usuario/:id', verificaToken, function(req, res) {

    let id = req.params.id;

    let body = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, body, { new: true }, (error, usuarioBorrado) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            })
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'USUARIO NO ENCONTRADO'
                }
            })
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});


module.exports = app;
const express = require('express');
const Usuario = require('../modelos/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const app = express();

app.post('/login', (req, resp) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (error, usuarioDB) => {
        if (error) {
            return resp.status(500).json({
                ok: false,
                error
            });
        }

        if (!usuarioDB) {
            return resp.status(400).json({
                ok: false,
                error: {
                    mensaje: "(Usuario) o contraseña incorrectos"
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return resp.status(400).json({
                ok: false,
                error: {
                    mensaje: "Usuario o (contraseña) incorrectos"
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });


        resp.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    })
});

//Configuraciones de google
async function verify(token) {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}


app.post('/google', async(req, resp) => {
    let token = req.body.idtoken;

    console.log('TOKEN DE GOOGLE', token);
    let googleUser = await verify(token)
        .catch(error => {

            return {
                ok: false,
                error: error
            }
        });

    console.log('googleUser', googleUser);
    if (googleUser.email) {
        console.log('googleUser', googleUser);

        Usuario.findOne({ email: googleUser.email }, (error, usuarioDB) => {
            if (error) {
                return resp.status(500).json({
                    ok: false,
                    error
                });
            }
            console.log('usuarioDB', usuarioDB);
            if (usuarioDB) {
                if (usuarioDB.google === false) {
                    return resp.status(400).json({
                        ok: false,
                        error: {
                            mensage: 'DEBE USAR SUS CREDENCIALES NORMALES'
                        }
                    });
                } else {
                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                    return resp.json({
                        ok: true,
                        usuario: usuarioDB,
                        token
                    });
                }
            } else {
                //SI EL USUARIO NO EXISTE EN LA BD
                let usuario = new Usuario();

                usuario.nombre = googleUser.nombre;
                usuario.email = googleUser.email;
                usuario.img = googleUser.img;
                usuario.google = true;
                usuario.password = ':)';

                usuario.save((errorSave, usuarioDB) => {
                    if (errorSave) {
                        return resp.status(500).json({
                            ok: false,
                            error: errorSave
                        });
                    }

                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                    return resp.json({
                        ok: true,
                        usuario: usuarioDB,
                        token
                    });
                });

            }


        });
    } else {

        console.log('googleUser', googleUser);
        return resp.status(403).json({
            ok: false,
            error: String(googleUser.error)
        });
    }

});







module.exports = app;
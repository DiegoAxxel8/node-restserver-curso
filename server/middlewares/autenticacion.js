const jwt = require('jsonwebtoken');

//========================================
//Verificar token
//========================================

let verificaToken = (req, resp, next) => {
    let token = req.get('Authorization');
    console.log('token', token);
    jwt.verify(token, process.env.SEED, (error, decoded) => {
        console.log('decoded', decoded);
        if (error) {
            return resp.status(401).json({
                ok: false,
                error
            })
        }

        req.usuario = decoded.usuario;
        next();
    });
};

//========================================
//Verificar usuario ADMIN
//========================================

let verificaAdminRole = (req, resp, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return resp.status(401).json({
            ok: false,
            error: 'NO TIENE LOS PERMISOS SUFICIENTES'
        })
    }
}


module.exports = {
    verificaToken,
    verificaAdminRole
}
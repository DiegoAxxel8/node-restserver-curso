//==============================================
//PUERTO
//==============================================
process.env.PORT = process.env.PORT || 3000;

//==============================================
//ENTORNO
//==============================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//============================
//Venciemiento del token
//=============================
process.env.CADUCIDAD_TOKEN = (60 * 60 * 24 * 30);

//============================
//Venciemiento del token
//=============================
process.env.SEED = process.env.SEED || 'SEED-DESARROLLO';


//==============================================
//base de datos
//==============================================
let urlBD;

if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = process.env.MONGO_URI;
}

process.env.URLDB = urlBD;
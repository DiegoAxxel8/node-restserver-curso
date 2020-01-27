//==============================================
//PUERTO
//==============================================
process.env.PORT = process.env.PORT || 3000;

//==============================================
//ENTORNO
//==============================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//==============================================
//base de datos
//==============================================

let urlBD;

if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = 'mongodb+srv://mongocluster1:erb8EqqOmcJpDx2f@cluster0-e0rup.mongodb.net/test?retryWrites=true&w=majority';
}

process.env.URLDB = urlBD;
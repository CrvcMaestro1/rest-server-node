const cors = require('cors')
const express = require('express');
const { dbConnection } = require('../database/config');
const app = express()

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.path = {
            auth: '/api/auth',
            categorias: '/api/categorias',
            usuarios: '/api/usuarios',
            productos: '/api/productos',
        }
        // BD
        this.conectarDB();
        // Middlewares
        this.middlewares();
        // Rutas
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());
        // Lectura y parser del body
        this.app.use(express.json());
        // Directorio público
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.path.auth, require('../routes/auth'));
        this.app.use(this.path.usuarios, require('../routes/usuarios'));
        this.app.use(this.path.categorias, require('../routes/categorias'));
        this.app.use(this.path.productos, require('../routes/productos'));
    }

    listener() {
        this.app.listen(this.port, () => {
            console.log(`Server listening at http://localhost:${this.port}`)
        })
    }
}

module.exports = Server;
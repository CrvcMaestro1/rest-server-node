const mongoose = require('mongoose')

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Base de datos conectada')
    } catch (error) {
        console.log(error)
        throw new Error('Ocurrió un error al conectar a BD')
    }
}

module.exports = {
    dbConnection
}
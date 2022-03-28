const { request, response } = require("express");

const validarArchivoSubir = (req = request, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            message: 'No se han subido archivos'
        });
    }
    next()
}

module.exports = {
    validarArchivoSubir
}
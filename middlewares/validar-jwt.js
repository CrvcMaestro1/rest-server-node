const { response } = require('express')
const { request } = require('express')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')


const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token')
    if (!token) {
        return res.status(401).json({
            message: 'No hay token en la petición'
        })
    }
    try {
        const { uuid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const usuario = await Usuario.findById(uuid)
        if (!usuario) {
            return res.status(401).json({
                message: 'Token no válido'
            })
        }
        if (!usuario.estado) {
            return res.status(401).json({
                message: 'Token no válido'
            })
        }
        req.usuario = usuario
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: 'Token no válido'
        })
    }


}

module.exports = {
    validarJWT
}
const bcryptjs = require("bcryptjs");
const { request, response } = require("express");
const { generarJWT } = require("../helpers/generar-jwt");
const Usuario = require('../models/usuario')

const login = async (req = request, res = response) => {
    const { correo, password } = req.body
    try {

        // verificar si email existe
        const usuario = await Usuario.findOne({ correo })
        if (!usuario) {
            return res.status(400).json({
                message: 'No son correctos'
            })
        }
        // si está activo
        if (!usuario.estado) {
            return res.status(400).json({
                message: 'No son correctos'
            })
        }
        // verificar password
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                message: 'No son correctos'
            })
        }
        // generar jwt
        const token = await generarJWT(usuario.id);
        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Hable con el administrador'
        })
    }
}

module.exports = {
    login
}
const bcryptjs = require("bcryptjs");
const { request, response } = require("express");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
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

const googleSignIn = async (req = request, res = response) => {
    const { id_token } = req.body;
    try {
        const { nombre, img, correo } = await googleVerify(id_token);
        let usuario = await Usuario.findOne({ correo })
        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: "With Google",
                img,
                google: true,
                rol: "USER_ROLE"
            }
            usuario = new Usuario(data);
            await usuario.save();
        }
        // si está activo
        if (!usuario.estado) {
            return res.status(400).json({
                message: 'Usuario bloqueado'
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
        return res.status(400).json({
            message: 'Ocurrió un error al iniciar sesión con google'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}
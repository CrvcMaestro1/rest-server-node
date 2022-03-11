const { request, response } = require('express')
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async (req = request, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });
    // hash de password
    const salt = bcryptjs.genSaltSync(10)
    usuario.password = bcryptjs.hashSync(password, salt)
    // guardar
    await usuario.save();

    res.json({
        usuario
    })
}

const usuariosPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;
    if (password) {
        const salt = bcryptjs.genSaltSync(10)
        resto.password = bcryptjs.hashSync(password, salt)
    }
    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    res.json({
        usuario
    })
}

const usuariosPatch = (req = request, res = response) => {
    res.json({
        message: 'Patch API - controlador'
    })
}

const usuariosDelete = async (req = request, res = response) => {
    const { id } = req.params;
    // Eliminar fisicamente
    //const usuario = await Usuario.findByIdAndDelete(id);
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false })
    res.json({
        usuario
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}
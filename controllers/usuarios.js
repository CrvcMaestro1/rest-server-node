const { request, response } = require('express')

const usuariosGet = (req = request, res = response) => {

    const { q } = req.query;

    res.json({
        message: 'Get API - controlador',
        q
    })
}

const usuariosPost = (req = request, res = response) => {
    const body = req.body;
    res.json({
        message: 'Post API - controlador',
        body
    })
}

const usuariosPut = (req = request, res = response) => {
    const { id } = req.params;
    res.json({
        message: 'Put API - controlador',
        id
    })
}

const usuariosPatch = (req = request, res = response) => {
    res.json({
        message: 'Patch API - controlador'
    })
}

const usuariosDelete = (req, res = response) => {
    res.json({
        message: 'Delete API - controlador'
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}
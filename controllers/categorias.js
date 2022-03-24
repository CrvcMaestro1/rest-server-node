const { request, response } = require('express')
const { Categoria } = require('../models')

// const obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre')
    ])
    res.json({
        total,
        categorias
    })
}

// const obtenerCategoria - populate {}
const obtenerCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre')
    res.json({
        categoria
    })
}

const crearCategoria = async (req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre })
    if (categoriaDB) {
        return res.status(400).json({
            message: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria = new Categoria(data);
    await categoria.save();

    res.status(201).json({
        categoria
    })
}

// const actualizarCategoria
const actualizarCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase()
    data.usuario = req.usuario._id

    const categoriaDB = await Categoria.findOne({ nombre: data.nombre, _id: { $ne: id } })
    if (categoriaDB) {
        return res.status(400).json({
            message: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
    res.json({
        categoria
    })
}

// const borrarCategoria  - estado : false
const borrarCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })
    res.json({
        categoria
    })
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}
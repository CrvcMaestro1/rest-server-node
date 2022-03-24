const { request, response } = require('express')
const { Producto } = require('../models')

const obtenerProductos = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre')
    ])
    res.json({
        total,
        productos
    })
}

const obtenerProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findById(id)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre')
    res.json({
        producto
    })
}

const crearProducto = async (req = request, res = response) => {

    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase()
    data.usuario = req.usuario._id

    const productoDB = await Producto.findOne({ nombre: data.nombre })
    if (productoDB) {
        return res.status(400).json({
            message: `El producto ${productoDB.nombre}, ya existe`
        })
    }
    const producto = new Producto(data);
    await producto.save();

    res.status(201).json({
        producto
    })
}

const actualizarProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase()
    }
    data.usuario = req.usuario._id

    const productoDB = await Producto.findOne({ nombre: data.nombre, _id: { $ne: id } })
    if (productoDB) {
        return res.status(400).json({
            message: `El producto ${productoDB.nombre}, ya existe`
        })
    }

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
    res.json({
        producto
    })
}

const borrarProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })
    res.json({
        producto
    })
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}
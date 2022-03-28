const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { request, response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");


const cargarArchivo = async (req = request, res = response) => {
    try {
        const nombre = await subirArchivo(req.files, undefined, 'img')

        res.json({
            nombre
        })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}

const actualizarImagen = async (req = request, res = response) => {
    const { id, coleccion } = req.params

    let modelo
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(404).json({
                    message: `No existe un usuario con el ID ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(404).json({
                    message: `No existe un producto con el ID ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({ message: 'Se olvidó validar esto' })
    }

    try {
        if (modelo.img) {
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen)
            }
        }

        const nombre = await subirArchivo(req.files, undefined, coleccion)
        modelo.img = nombre

        await modelo.save()

        res.json({
            modelo
        })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}

const mostrarImagen = async (req = request, res = response) => {
    const { id, coleccion } = req.params

    let modelo
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(404).json({
                    message: `No existe un usuario con el ID ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(404).json({
                    message: `No existe un producto con el ID ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({ message: 'Se olvidó validar esto' })
    }

    try {
        if (modelo.img) {
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
            if (fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen)
            }
        }
        const pathPlaceholder = path.join(__dirname, '../assets', 'no-image.jpg')
        res.sendFile(pathPlaceholder)
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}

const actualizarImagenCloudinary = async (req = request, res = response) => {
    const { id, coleccion } = req.params

    let modelo
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(404).json({
                    message: `No existe un usuario con el ID ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(404).json({
                    message: `No existe un producto con el ID ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({ message: 'Se olvidó validar esto' })
    }

    try {

        if (modelo.img) {
            const nombreSplitted = modelo.img.split('/')
            const nombre = nombreSplitted[nombreSplitted.length - 1]
            if (nombre) {
                const [public_id] = nombre.split('.')
                cloudinary.uploader.destroy(public_id)
            }
        }

        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

        modelo.img = secure_url

        await modelo.save()

        res.json({
            modelo
        })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}
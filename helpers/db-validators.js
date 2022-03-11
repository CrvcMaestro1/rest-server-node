const Role = require('../models/role')
const Usuario = require('../models/usuario')

const isRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol })
    if (!existeRol) {
        throw new Error('No es un rol válido')
    }
}

const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo })
    if (existeEmail) {
        throw new Error('El correo ya está registrado')
    }
}

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
        throw new Error('El id no existe')
    }
}

module.exports = {
    isRoleValido,
    emailExiste,
    existeUsuarioPorId
}
const { response } = require("express");
const { request } = require("express");

const esAdminRole = (req = request, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            message: 'Se quiere verificar el role sin validar el token'
        })
    }
    const { rol, nombre } = req.usuario
    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            message: `${nombre} no es administrador`
        })
    }
    next()
}

const tieneRole = (...roles) => {
    return (req = request, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                message: 'Se quiere verificar el role sin validar el token'
            })
        }
        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                message: `El servicio requiere un rol del tipo ${roles}`
            })
        }
        next()
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}
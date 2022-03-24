const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, tieneRole } = require('../middlewares');

const router = Router();

/**
 * {{url}}/api/productos
 */

router.get('/', obtenerProductos)

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto)

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID válido').isMongoId(),
    validarCampos,
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto)

router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoPorId),
    validarCampos,
], actualizarProducto)

router.delete('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoPorId),
    tieneRole('ADMIN_ROLE'),
    validarCampos,
], borrarProducto)

module.exports = router;
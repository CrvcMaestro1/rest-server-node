const { Router } = require('express');
const { check } = require('express-validator')

const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares')

const { isRoleValido,
    emailExiste,
    existeUsuarioPorId } = require('../helpers/db-validators')
const { usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete, } = require('../controllers/usuarios')


const router = Router();

router.get('/', usuariosGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener más de 6 caractéres').isLength(min = 6),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    // check('rol', 'No es un rol válido').isIn('ADMIN_ROLE', 'USER_ROLE'),
    check('rol').custom(isRoleValido),
    validarCampos
], usuariosPost);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(isRoleValido),
    validarCampos
], usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

module.exports = router;
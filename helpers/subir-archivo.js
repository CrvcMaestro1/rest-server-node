const path = require('path')
const { v4: uuidv4 } = require('uuid')

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {
        const { archivo } = files ? files : reject('Archivo no enviado')
        const nombreCortado = archivo.name.split('.')
        const extension = nombreCortado[nombreCortado.length - 1].toLowerCase()

        if (!extensionesValidas.includes(extension.toLowerCase())) {
            return reject(`La extensión ${extension} no es permitida. Permitidas: ${extensionesValidas}`)
        }

        const nombreTemp = `${uuidv4()}.${extension}`

        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err)
            }
            resolve(nombreTemp)
        });
    })
}

module.exports = {
    subirArchivo
}
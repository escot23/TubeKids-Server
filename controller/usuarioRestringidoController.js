const UsuarioRestringidoModel = require('../models/usuarioRestringidoModel.js'); 

const crearUsuarioRestringido = async (req, res) => {
    const { nombre, pin, avatar, edad } = req.body;
    if (!nombre || !pin || !avatar || !edad) {
        return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    try {
        const usuarioRestringido = new UsuarioRestringidoModel({
            nombre,
            pin,
            avatar,
            edad
        });
        const nuevoUsuarioRestringido = await usuarioRestringido.save();
        res.status(201).json(nuevoUsuarioRestringido);
    } catch (error) {
        console.error('Error al guardar el usuario restringido:', error);
        res.status(500).json({ error: 'Hubo un error al intentar registrar el usuario restringido' });
    }
};

const obtenerUsuariosRestringidos = async (req, res) => {
    try {
        const usuarios = await UsuarioRestringidoModel.find();
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios restringidos:', error);
        res.status(500).json({ error: 'Hubo un error al obtener los usuarios restringidos' });
    }
};

const cargarDatosUsuariosRestringidos = async (req, res) => {
    try {
        const usuarios = await UsuarioRestringidoModel.find();
        console.log(usuarios);
        const datosUsuarios = usuarios.map(usuario => {
            return {
                nombre: usuario.nombre,
                avatar: usuario.avatar
            };
        });
        console.log(datosUsuarios);
        res.json(datosUsuarios);
    } catch (error) {
        console.error('Error al cargar los datos de usuarios restringidos:', error);
        res.status(500).json({ error: 'Hubo un error al cargar los datos de usuarios restringidos' });
    }
};

const editarUsuarioRestringido = async (req, res) => {
    const { id } = req.params;
    const { nombre, pin, avatar, edad } = req.body;

    try {
        const usuarioActualizado = await UsuarioRestringidoModel.findByIdAndUpdate(id, {
            nombre,
            pin,
            avatar,
            edad
        }, { new: true });

        if (!usuarioActualizado) {
            return res.status(404).json({ error: 'Usuario restringido no encontrado' });
        }
        
        res.json(usuarioActualizado);
    } catch (error) {
        console.error('Error al editar el usuario restringido:', error);
        res.status(500).json({ error: 'Hubo un error al intentar editar el usuario restringido' });
    }
};


const eliminarUsuarioRestringido = async (req, res) => {
    const { id } = req.params;

    try {
        const usuarioEliminado = await UsuarioRestringidoModel.findByIdAndDelete(id);
        if (!usuarioEliminado) {
            return res.status(404).json({ error: 'Usuario restringido no encontrado' });
        }
        res.json({ message: 'Usuario restringido eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el usuario restringido:', error);
        res.status(500).json({ error: 'Hubo un error al intentar eliminar el usuario restringido' });
    }
};

module.exports = {
    crearUsuarioRestringido,
    obtenerUsuariosRestringidos,
    cargarDatosUsuariosRestringidos,
    editarUsuarioRestringido,
    eliminarUsuarioRestringido
};

const UsuarioRestringidoModel = require('../models/usuarioRestringidoModel.js'); 

const crearUsuarioRestringido = async (req, res) => {
    const { nombre, pin, avatar, edad } = req.body;
    const userId = req.userId; // Obtener el ID de usuario del token JWT
    console.log(userId);
    if (!nombre || !pin || !avatar || !edad) {
        return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    try {
        const usuarioRestringido = new UsuarioRestringidoModel({
            nombre,
            pin,
            avatar,
            edad,
            userId
        });
        const nuevoUsuarioRestringido = await usuarioRestringido.save();
        res.status(201).json(nuevoUsuarioRestringido);
        //console.log(nuevoUsuarioRestringido);
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

const getUsuarioRestringidos = async (req, res) => {
    try {
        // Aquí puedes obtener los datos de los usuarios restringidos según el userId del token decodificado
        const userId = req.user._id; // userId obtenido del token decodificado

        // Consulta a la base de datos para obtener los datos de los usuarios restringidos asociados al userId
        const usuariosRestringidos = await UsuarioRestringidoModel.find({ userId });

        // Enviar los datos de los usuarios restringidos como respuesta
        res.status(200).json(usuariosRestringidos);
    } catch (error) {
        console.error('Error al obtener datos de usuarios restringidos:', error);
        res.status(500).json({ error: 'Error al obtener datos de usuarios restringidos' });
    }
};


const cargarDatosUsuariosRestringidos = async (req, res) => {
    try {
        // Obtén todos los usuarios restringidos desde la base de datos
        const usuarios = await UsuarioRestringidoModel.find();
        
        // Mapea los datos de los usuarios incluyendo el ID
        const datosUsuarios = usuarios.map(usuario => {
            return {
                _id: usuario._id, // Incluye el ID del usuario
                nombre: usuario.nombre,
                avatar: usuario.avatar
            };
        });
        
        res.status(200).json(datosUsuarios); // Envia los datos de los usuarios restringidos al cliente
    } catch (error) {
        console.error('Error al cargar los datos de usuarios restringidos:', error);
        res.status(500).json({ error: 'Hubo un error al cargar los datos de usuarios restringidos' });
    }
};

const cargarUsuariosRestringidos = async (req, res) => {
    try {
        // Obtén todos los usuarios restringidos desde la base de datos
        const usuarios = await UsuarioRestringidoModel.find();
        
        // Mapea los datos de los usuarios incluyendo el ID
        const datosUsuarios = usuarios.map(usuario => {
            return {
                _id: usuario._id, // Incluye el ID del usuario
                nombre: usuario.nombre,
                avatar: usuario.avatar,
                pin: usuario.pin,
                edad: usuario.edad
            };
        });
        
        res.status(200).json(datosUsuarios); // Envia los datos de los usuarios restringidos al cliente
    } catch (error) {
        console.error('Error al cargar los datos de usuarios restringidos:', error);
        res.status(500).json({ error: 'Hubo un error al cargar los datos de usuarios restringidos' });
    }
};



const editarUsuarioRestringido = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, pin, avatar, edad  } = req.body;
        console.log('ID del usuario restringido:', id);
        // Actualizar el video en la base de datos
        const UsuarioActualizado = await UsuarioRestringidoModel.findByIdAndUpdate(id,
            {
                nombre, pin, avatar, edad 
            }, { new: true });
        if (!UsuarioActualizado) {
            return res.status(404).json({ error: 'No se encontró el usuario' });
        }
        res.status(200).json(UsuarioActualizado);
    } catch (error) {
        console.error('Error al editar el usuario:', error);
        res.status(500).json({ error: 'Hubo un error al intentar editar el usuario' });
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

const validarPin = async (req, res) => {
    const { pin } = req.body;

    try {
        // Obtener el ID del usuario principal desde la solicitud (asumiendo que está autenticado y tiene un ID válido)
        const userId = req.user.id;

        // Buscar al usuario principal por su ID y verificar el PIN
        const userPrincipal = await UserModel.findOne({ _id: userId });
        if (userPrincipal && userPrincipal.pin === pin) {
            // Ahora puedes hacer la verificación del PIN del usuario restringido
            const { userIdUsuarioRestringido, pinUsuarioRestringido } = req.body;
            const usuarioRestringido = await UsuarioRestringidoModel.findOne({ _id: userIdUsuarioRestringido });
            if (usuarioRestringido && usuarioRestringido.pin === pinUsuarioRestringido) {
                res.json({ message: 'PIN del usuario restringido válido.' });
            } else {
                res.status(400).json({ message: 'PIN del usuario restringido incorrecto.' });
            }
        } else {
            res.status(400).json({ message: 'PIN del usuario principal incorrecto.' });
        }
    } catch (error) {
        console.error('Error al validar el PIN:', error);
        res.status(500).json({ error: 'Hubo un error al validar el PIN.' });
    }
};

module.exports = {
    crearUsuarioRestringido,
    obtenerUsuariosRestringidos,
    cargarDatosUsuariosRestringidos,
    editarUsuarioRestringido,
    eliminarUsuarioRestringido,
    getUsuarioRestringidos,
    cargarUsuariosRestringidos,
    validarPin
};

const UsuarioRestringidoModel = require('../models/usuarioRestringidoModel.js'); 

const PostUsuarioRestringido = async (req, res) => {
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


const GetDatos = async (req, res) => {
    try {
        // Obtén todos los usuarios restringidos desde la base de datos
        const usuarios = await UsuarioRestringidoModel.find();
        
        // Mapea los datos de los usuarios incluyendo el ID
        const datosUsuarios = usuarios.map(usuario => {
            return {
                _id: usuario._id, // Incluye el ID del usuario
                nombre: usuario.nombre,
                avatar: usuario.avatar,
                pin: usuario.pin
            };
        });
        console.log("id res",datosUsuarios);
        res.status(200).json(datosUsuarios); // Envia los datos de los usuarios restringidos al cliente
    } catch (error) {
        console.error('Error al cargar los datos de usuarios restringidos:', error);
        res.status(500).json({ error: 'Hubo un error al cargar los datos de usuarios restringidos' });
    }
};

const GetPinUserPrincipal = (req, res) => {
    if (req.user && req.user._id && req.user.pin) { // Verificar si existe el usuario en el token y si tiene un ID y un pin
        const userId = req.user._id; // Obtener el ID del usuario del token JWT
        const pinUserPrincipal = req.user.pin; // Obtener el pinPrincipal del token JWT
        console.log("id...", userId);
        // Buscar todos los usuarios restringidos asociados con el ID del usuario
        UsuarioRestringidoModel.find({ userId: userId })
            .then(users => {
                // Enviar los usuarios restringidos junto con el pinPrincipal en la respuesta
                res.json({ users: users, pin: pinUserPrincipal });
                console.log("pin del principal...", pinUserPrincipal);
                console.log("id...", userId);
            })
            .catch(err => {
                res.status(500).json({ error: "Error interno del servidor" });
            });
    } else {
        res.status(401).json({ error: "Usuario no autorizado" }); // Usuario no autenticado o token inválido
}
};



const GetListaUsuariosRestringidos = async (req, res) => {
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



const PatchUsuarioRestringido = async (req, res) => {
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

const PutUsuarioRestringido = async (req, res) => {
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
    PostUsuarioRestringido,
    GetPinUserPrincipal,
    PatchUsuarioRestringido,
    PutUsuarioRestringido,
    GetListaUsuariosRestringidos,
    GetDatos
};

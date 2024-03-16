const UserModel = require("../models/usermodel");

const createUser = async (req, res) => {
    // Valida los datos recibidos del cliente
    const { email, password, pin, name, lastName, country, birthdate } = req.body;
    if (!email || !password || !pin || !name || !lastName || !birthdate) {
        return res.status(400).json({ error: "Todos los campos son requeridos" });
    }
    
    // Crea instancia del usuario con los datos recibidos
    let user = new UserModel({
        email,
        password,
        pin,
        name,
        lastName,
        country,
        birthdate
    });
    
    // Verifica si el usuario tiene al menos 18 años
    const today = new Date();
    const dob = new Date(user.birthdate);
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }
    if (age < 18) {
        return res.status(400).json({ error: "Debes tener al menos 18 años para registrarte" });
    }

    // Guarda el usuario en la base de datos
    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error al guardar el usuario:', error);
        res.status(500).json({ error: 'Hubo un error al intentar registrar el usuario' });
    }
};

const getUser = (req, res) => {
    UserModel.find()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error('Error al obtener usuarios:', err);
            res.status(500).json({ error: 'Hubo un error al obtener los usuarios' });
        });
};


const autenticarUsuario = async (req, res) => {
    const { pin } = req.body;

    try {
        // Buscar el usuario principal en la base de datos
        const usuarioPrincipal = await UserModel.findOne({}); 

        // Verificar si se encontró el usuario principal
        if (!usuarioPrincipal) {
            return res.status(404).json({ error: 'Usuario principal no encontrado' });
        }

        // Verificar si el PIN coincide
        if (pin === usuarioPrincipal.pin) {
            return res.status(200).json({ message: 'Autenticación exitosa' });
        } else {
            return res.status(401).json({ error: 'PIN incorrecto' });
        }
    } catch (error) {
        console.error('Error al autenticar el usuario:', error);
        res.status(500).json({ error: 'Hubo un error al intentar autenticar al usuario' });
    }
};

module.exports = {
    createUser,
    getUser,
    autenticarUsuario
};

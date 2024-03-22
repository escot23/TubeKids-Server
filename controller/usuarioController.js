require('dotenv').config(); 
const jwt = require('jsonwebtoken');

const UserModel = require("../models/usuarioModel");

const PostUsuario = async (req, res) => {
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
        res.status(201).json({ message: 'Usuario registrado correctamente', userId: savedUser._id });
    } catch (error) {
        console.error('Error al guardar el usuario:', error);
        res.status(500).json({ error: 'Hubo un error al intentar registrar el usuario' });
    }
};

const GetUsuario = (req, res) => {
    UserModel.find()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error('Error al obtener usuarios:', err);
            res.status(500).json({ error: 'Hubo un error al obtener los usuarios' });
        });
};


module.exports = {
    PostUsuario,
    GetUsuario,
    autenticarUsuario
};

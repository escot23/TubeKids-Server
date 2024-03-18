const jwt = require('jsonwebtoken');
const authModel = require("../models/usuarioModel");

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el usuario existe en la base de datos
        const user = await authModel.findOne({ email });
        console.log(user);
        if (user && user.password === password) {
            // Generar un JWT con el userId
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });
            console.log(token);
            res.status(200).json({ message: "Inicio de sesión exitoso", userId: user._id, token });
        } else {
            res.status(401).json({ error: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error('Error en inicio de sesión:', error);
        res.status(500).json({ error: 'Error en inicio de sesión' });
    }
};

module.exports = { loginUser };

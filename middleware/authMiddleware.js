const jwt = require('jsonwebtoken');
const UserModel = require('../models/usermodel');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Verificar si el usuario existe en la base de datos
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(401).json({ error: 'Usuario no autorizado' });
        }

        // Agregar el usuario al objeto de solicitud para uso posterior
        req.user = user;
        next();
    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        return res.status(401).json({ error: 'Token inválido' });
    }
};

module.exports = authMiddleware;

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const requiereAutenticar = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso no autorizado' });
    }

    const tokenString = token.split(' ')[1]; // <-- Aquí ocurre el error
    try {
        const decoded = jwt.verify(tokenString, jwtSecret);
        req.userId = decoded.userId; // Adjuntar el ID de usuario al objeto de solicitud
        next(); // Continuar con la ejecución de la ruta
    } catch (error) {
        res.status(401).json({ error: 'Acceso no autorizado' });
    }
};

module.exports = { requiereAutenticar };

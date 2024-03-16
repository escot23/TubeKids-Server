const jwt = require('jsonwebtoken');

const requiereautenticar = (req, res, next) => {
  const token = req.cookies.jwt;

  // Verificar si el token existe
  if (token) {
    // Verificar el token JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.error(err.message);
        res.status(401).json({ error: 'Token inválido' });
      } else {
        console.log('Token verificado:', decodedToken);
        req.userId = decodedToken.userId; // Adjuntar el ID del usuario principal a la solicitud
        next(); // Pasar al siguiente middleware
      }
    });
  } else {
    res.status(401).json({ error: 'Token no proporcionado' });
  }
};



module.exports = { requiereautenticar };

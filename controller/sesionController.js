const Session = require("../models/sesionModel");

// Función para generar un token único
const generarToken = () => {
  // Generar un token único basado en la fecha actual
  return Date.now().toString();
};

// Función para guardar la sesión en la base de datos
const guardarSesion = async function (username) {
  const token = generarToken();
  const session = new Session({
    token: token,
    usuario: username,
    expira: new Date(), 
  });
  return session.save();
};

// Función para obtener la sesión mediante el token
const obtenerSesion = function (token) {
  return Session.findOne({ token });
};

module.exports = {
  guardarSesion,
  obtenerSesion,
};

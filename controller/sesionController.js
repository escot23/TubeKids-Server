const Sesion = require("../models/sesionModel");

const guardarSesion = async (userId, token) => {
  const session = new Sesion({
    userId: userId,
    token: token,
    expire: new Date(Date.now() + 5 * 60 * 60 * 1000), // Expira en 5 horas
  });
  await session.save();
};

const obtenerSesion = async (token) => {
  return await Sesion.findOne({ token });
};

module.exports = { guardarSesion, obtenerSesion };

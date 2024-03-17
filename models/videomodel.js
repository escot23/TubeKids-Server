const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    urlYoutube: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', // Ajusta el nombre del modelo de usuario según tu implementación
        required: true
    }
});

const VideoModel = mongoose.model("Video", videoSchema);

module.exports = VideoModel;

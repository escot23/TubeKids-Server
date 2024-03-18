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
    }
});

const VideoModel = mongoose.model("Video", videoSchema);

module.exports = VideoModel;
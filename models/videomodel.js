const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

const VideoModel = mongoose.model("Video", videoSchema);

module.exports = VideoModel;

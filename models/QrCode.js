const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QrSchema = new Schema ({
    imageUrl : {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('QrCode', QrSchema);
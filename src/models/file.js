const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    fileName: String,
    fileType: String,
    fileData: String 

})

const File = mongoose.model('file', fileSchema);
module.exports = File;
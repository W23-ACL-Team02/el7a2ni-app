const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    fileName: String,
    fileType: String,
    fileData: String 
})

const decodeBase64ToFile = (base64String) => {
    try {
      const buffer = Buffer.from(base64String, 'base64');
      return buffer;
    } catch (error) {
      throw new Error('Error decoding Base64 to file:', error.message);
    }
  };

const encodeFileToBase64 = (file) => {
    try {
        const base64Data = file.buffer.toString('base64');
        return base64Data;
    } catch (error) {
        throw new Error('Error encoding file to Base64:', error.message);
    }
};

const File = mongoose.model('file', fileSchema);
module.exports = {File, encodeFileToBase64, decodeBase64ToFile};

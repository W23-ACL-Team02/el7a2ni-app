const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const familymemberSchema = new Schema({
        name:
        { type:String,
          required: true 
        },
        nationalID: {
            type: String,
            unique: true, 
            required: true,
         //   match: /^[0-9]{14}$/ // Match the format of a 14-digit national ID (adjust the regular expression as needed)
        },
        
       age: {
           type:String,
           required: true
           },
      
       gender: {
            type: String,
            enum: ['Male', 'Female' ]// Define allowed gender values
        },
        relationship: {
            type: String,
            enum: ['Wife', 'Husband', 'Children'] // Restrict allowed relationship values
        },
    }, {
      timestamps: true
    });
    const familymember=mongoose.model('familymember',familymemberSchema);

    module.exports=familymember;
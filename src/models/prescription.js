const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
    patient: {
        name:
        { type:String,
          required: true 
        }
        },
      doctor: {
        name:
        {
          type:String,
          required: true,
        },
        specialization: String,
        enum: ['General Practitioner', 'Cardiologist', 'Neurologist', 'Dermatologist', 'Surgeon', 'Ophthalmologist', 'Optometrist', 'Pediatrician', 'Family Medicine', 'Radiologist', 'Psychiatrist', 'Anesthesiologist'],

      },
      medications: [
        {
          name: String,
          dosage: String,
          instructions: String,
          
        }
      ],
      
      isFilled: {
        type: Boolean,
        default: false 
      },
    }, {
      timestamps: true
    });
    const prescription=mongoose.model('prescription',prescriptionSchema);

    module.exports=prescription;
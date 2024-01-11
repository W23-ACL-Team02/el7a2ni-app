import React, { useState,useEffect } from 'react'
import Select from 'react-select';
import axios from 'axios';
const serverURL = process.env.REACT_APP_SERVER_URL;
export default function Addprescription() {

    const [doctorName,setDoctorName]=useState('');
    const [doctorSpecialization,setDoctorSpecialization]=useState('');
    const [patientNames,setPatientNames]=useState([]);
    const [patientName, setPatientName] = useState('');
    const[addedmedications,setAddedMedications]=useState([]);
    const [medicines,setmedicines]=useState([]);
    const [selectedMedicineNameDropdown,setSelectedMedicineNameDropdown]=useState('');
    const [selectedMedicineDosageDropdown,setSelectedMedicineDosageDropdown]=useState('');
    const [dosagesForSelectedMedicine,setdosagesForSelectedMedicine]=useState([]);
    const [addedmedicineName,setAddedMedicineName]=useState('');
    const [addedmedicineDosage,setAddedMedicineDosage]=useState('');
    const [addedmedicineInstruction,setAddedMedicineInstruction]=useState('');
    const [selectedMedicineIndex, setSelectedMedicineIndex] = useState(null);
    const[message,setMessage]=useState('');


   
    
    useEffect(()=>{
        axios.get(`${serverURL}/clinic/private/doctor/addprescriptionView`,{withCredentials: true}) //change to base Url and check the route
        .then((res)=>{
          console.log(res)
            setDoctorName(res.data.doctorUsername);
            setDoctorSpecialization(res.data.doctorSpecialization);
            setPatientNames(res.data.patientNames);
            setmedicines(res.data.medications);
        })
        .catch((error) =>{
          console.log(error)
        })

    },[])


    
  const handleEditMedicine = (index) => {
    setSelectedMedicineIndex(index);
    const selectedMedicine = addedmedications[index];
    setAddedMedicineName(selectedMedicine.addedmedicineName);
    setAddedMedicineDosage(selectedMedicine.addedmedicineDosage);
    setAddedMedicineInstruction(selectedMedicine.addedmedicineInstruction);
    //remove the medicine from addmedications during editing
    const updatedMedications = [...addedmedications];
      updatedMedications.splice(index, 1);
      setAddedMedications(updatedMedications);
  };

  const handleDeleteMedicine = (index) => {
    const updatedMedications = [...addedmedications];
    updatedMedications.splice(index, 1);
    setAddedMedications(updatedMedications);

    if (index === selectedMedicineIndex) {
      setSelectedMedicineIndex(null);
      setSelectedMedicineDosageDropdown('');
      setSelectedMedicineDosageDropdown('');
      setAddedMedicineInstruction('');
    }
  };
    const handleAddMedicine =() =>{

        const newMedicine={
            addedmedicineName: selectedMedicineNameDropdown,
            addedmedicineDosage : selectedMedicineDosageDropdown,
            addedmedicineInstruction,
        };
        setAddedMedications([...addedmedications,newMedicine]);


        setSelectedMedicineNameDropdown('');
        setSelectedMedicineDosageDropdown('');
        setAddedMedicineInstruction('');
    }
    const handlePrescriptionSubmit =() =>{
      if(!patientName )
      {
        setMessage("please choose a patient name")
      }
      else if (addedmedications.length!=1)
      {
        setMessage("please add  at least one medicine")

      }
      else{
        const prescriptionData= {
          patientName:patientName,
          doctorname: doctorName,
          specialization: doctorSpecialization,
          medications: addedmedications,

        };
        
        axios.post(`${serverURL}/clinic/private/doctor/addprescriptionSubmit`,prescriptionData,{withCredentials: true}).then((Response)=>{
            console.log("Prescription submitted successfully:", Response.data);
            setMessage("prescription added successfully");

        })
        .catch((error)=>{
            console.log("Error submitting prescription:", error);
        })
      }
    }
    const handlePatientChange = (event) => {
        setPatientName(event.target.value);
      };
      const handleDosageChange = (selectedOption) => {
        setSelectedMedicineDosageDropdown(selectedOption.value);
      };
    

  return (
    <div>
          <h2>Add Prescription</h2>
    <form method="POST">
    <div className="form-group">
          <h3>Patient</h3>
          <label htmlFor="patientname">Name</label>
          <select className="form-control" name="name" value={patientName} onChange={handlePatientChange} required>
            <option value="" disabled selected>Select Patient</option>
            {patientNames.map((patient, index) => (
              <option key={index} value={patient}>
                {patient}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <h3>Doctor</h3>
          <label htmlFor="doctorname">Name</label>
          <input className="form-control" type="text" name="doctorname" placeholder="Doctor Name" value={doctorName} readOnly required />
        </div>
        <div className="form-group">
          <label htmlFor="specialization">Specialization</label>
          <input className="form-control" type="text" name="specialization" placeholder="Specialization" value={doctorSpecialization} readOnly required />
        </div>
        <div class="form-group">
            <h3>Add Medicine </h3>
        </div>
        <div className="form-group">
             <label htmlFor="medicineName">Medicine Name</label>
              <Select
                options={[...new Set(medicines.map((medicine) => medicine.name))].map((medicineName) => ({ value: medicineName, label: medicineName }))}
                value={{ value: selectedMedicineNameDropdown, label: selectedMedicineNameDropdown }}
                onChange={(selectedOption) => { 
                  setSelectedMedicineDosageDropdown('');
                  setSelectedMedicineNameDropdown(selectedOption.value)
                      // Filter dosages for the selected medicine
                      const dosages = medicines
                      .filter((medicine) => medicine.name === selectedOption.value)
                      .map((medicine) => ({ value: medicine.dosage, label: medicine.dosage }));
              
                    setdosagesForSelectedMedicine(dosages);
                      setdosagesForSelectedMedicine(dosages);
              }}
                isSearchable
                placeholder="Select Medicine"
                />
        </div>
        <div className="form-group">
          <label htmlFor="dosage">Dosage</label>
          <Select
                  options={dosagesForSelectedMedicine}
                  value={{ value: selectedMedicineDosageDropdown, label: selectedMedicineDosageDropdown }}
                  onChange={handleDosageChange}
                  isSearchable
                  placeholder="Select Dosage"
          />
        </div>
        <div class="form-group">
            <label for="instructions">Instructions</label>
            <input class="form-control" type="text" name="instructions1" placeholder="Instructions" value={addedmedicineInstruction} onChange={(e)=>setAddedMedicineInstruction(e.target.value)} required/>
        </div>
        <div>
        <button class="btn btn-primary" type="button" onClick={handleAddMedicine}>Add Medicine</button>
        </div>
        <div>
            <h3>Added Medicines</h3>
            <ul>
                {addedmedications.map((medicine,index)=>(
                    <li key={index}>
                {`Medicine Name: ${medicine.addedmedicineName}, Dosage: ${medicine.addedmedicineDosage}, Instructions: ${medicine.addedmedicineDosage}`}
                <button type="button" onClick={() => handleEditMedicine(index)}>Edit</button>
                <button type="button" onClick={() => handleDeleteMedicine(index)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
        <div>
            <button type="button" onClick={handlePrescriptionSubmit}>Submit</button>
        </div>
        <div>
          {message&& <p>{message}</p>}
        </div>

    </form>
    </div>
  )
}

import axios from 'axios';
const { useState } = require("react");
const { useEffect } = require("react");
const { useLocation } = require("react-router-dom")

const PatientDetails = () => {
    const [patient,setPatient] = useState([]);
    let { state } = useLocation();

    const patientID = state.patientID
    console.log("id:" + patientID)
    const getPatient = async () => {
        await axios.get(`http://localhost:4000/private/patients/patient/${patientID}`).then(
            (res) => { 
               const patient = res.data
               console.log(patient)
               setPatient(patient)
           }); 
    }

    useEffect(() =>{
        getPatient();
     }, []);

//     const patient = {username : "Mo", 
//     name: "Mohamed", 
//     email: "Mo@yahoo.com",
//     dateOfBirth: "10-10-2002",
//     mobile: "01065762770",
//    };

    return (
        <div>
            <h1>Patient Details</h1>
            <p>Username: {patient.username}</p>
            <p>Name: {patient.name}</p>
            <p>Email: {patient.email}</p>
            <p>Date of Birth: {patient.dateOfBirth}</p>
            <p>Mobile: {patient.mobile}</p>
            {patient.emergencyContact && Object.keys(patient.emergencyContact.name).length!==0  
                ? <p>Emergency Contact Name: {patient.emergencyContact.name}</p>
                : <p>Emergency Contact Name: not provided </p>
            }
            {patient.emergencyContact && Object.keys(patient.emergencyContact.mobile).length!==0  
                ? <p>Emergency Contact Mobile: {patient.emergencyContact.mobile}</p>
                : <p>Emergency Contact Mobile: not provided </p>
            }
        </div>
    );
}

export default PatientDetails
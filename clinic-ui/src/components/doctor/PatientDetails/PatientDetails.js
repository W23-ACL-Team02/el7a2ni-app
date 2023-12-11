import axios from 'axios';
import { useNavigate } from "react-router-dom";
const { useState } = require("react");
const { useEffect } = require("react");
const { useLocation } = require("react-router-dom")
const serverURL = process.env.REACT_APP_SERVER_URL

const PatientDetails = () => {
    const [patient,setPatient] = useState([]);
    let { state } = useLocation();
    const navigate = useNavigate();

    const patientID = state.patientID
    const getPatient = async () => {
        await axios.get(`${serverURL}/private/doctor/patient/${patientID}`, {withCredentials: true}).then(
            (res) => { 
               const patient = res.data
               console.log(patient)
               setPatient(patient)
           }); 
    }

    const handleGoBack = () => {
        navigate(-1); // new line
    }; 
    const handleGoToPatientRecords = (event) => {
        const data = {patientUsername: patient.username}
        console.log('sending you to the patient\'s records...')
        console.log(data)
        navigate( "/doctorHealthRecords", {state: { ...data }}); // new line
    }; 

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
            <button className="backBtn" onClick={handleGoToPatientRecords}>view records</button>
            <button className="backBtn" onClick={handleGoBack}>back</button>
        </div>
    );
}

export default PatientDetails
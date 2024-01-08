import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Card from "../../../components-main/Card"
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
        await axios.get(`${serverURL}/clinic/private/doctor/patient/${patientID}`, {withCredentials: true}).then(
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

    return (
        <div style={{display:"flex", alignItems:"center", justifyContent:"center", alignContent:"center", marginTop:"150px"}}>
            <Card height="550px" width="450px" > 
                <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", alignContent:"center"}}>
                    <h1 style={{color:"black"}}>Patient Details</h1>
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
                    <button style={{width:"100px", height:"30px"}} onClick={handleGoToPatientRecords}>view records</button>
                    <button style={{width:"100px", height:"30px"}} onClick={handleGoBack}>back</button>
                </div>
            </Card>
        </div>
    );
}

export default PatientDetails
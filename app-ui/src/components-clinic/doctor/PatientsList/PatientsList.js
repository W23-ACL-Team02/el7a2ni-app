import axios from 'axios';
import styles from './PatientsList.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons' 
import { useNavigate } from "react-router-dom";
import "../../../css/table.css"
const { useState } = require("react");
const { useEffect } = require("react");
const serverURL = process.env.REACT_APP_SERVER_URL

const PatientsList = () => { 
    const [patients,setPatients] = useState([]);
    const [appointments,setAppointments] = useState([]);
    const navigate = useNavigate()
    const getPatients =  async () => {
        try{
            await axios.get(`${serverURL}/clinic/private/doctor/getAllPatients`, {withCredentials: true}).then(
            (res) => {
                console.log(res.data);  // Log the data directly
                const patients = res.data;
                setPatients(patients);
            })
        }catch (error) {
            // Log the entire error object for debugging
            console.error('Axios Error:', error);
        }
        
    }
    const getAppointments =  async () => {
      try{
        await axios.get(`${serverURL}/clinic/private/doctor/appointments`, {withCredentials: true}).then(
            (res) => { 
               const appointments = res.data
               setAppointments(appointments)
           }
            ); 
      }catch(error){
            console.error('Axios Error:', error);
      }  
      
    }

    useEffect(() =>{
       getPatients();
       getAppointments();
    }, []);

    const handleGoBack = () => {
        navigate(-1); // new line
    }; 
    
    const handleGoToPatientDetails = (PatientID) => {
        const data = {patientID: PatientID}
        navigate( "/patient-details", {state: data}); // new line
    }; 

    function search() {
      const searchInput = document.getElementById("searchInput");
      const tableRows = document.querySelectorAll("tbody tr");
      const searchQuery = searchInput.value.toLowerCase();

      tableRows.forEach(row => {
          const name = row.querySelector("td:nth-child(3)").textContent.toLowerCase();
          if (name.includes(searchQuery)) {
              row.style.display = "";
          } else {
              row.style.display = "none";
          }
      });
  }

  function filter() {
      const tableRows = document.querySelectorAll("tbody tr");
      const apps = appointments
      const FromDateInput = document.getElementById("FromDateInput");
      const ToDateInput = document.getElementById("ToDateInput");
      const FromDate = new Date(FromDateInput.value);
      const ToDate = new Date(ToDateInput.value);

      tableRows.forEach(row => {
          const username = row.querySelector("td:nth-child(2)").textContent;
          const app = apps.filter((data) => {
              const date = new Date(data.date);
              if (FromDateInput.value === "" && ToDateInput.value === "")
                  return data.patientUsername === username;
              if (FromDateInput.value === "")
                  return data.patientUsername === username && date <= ToDate;
              if (ToDateInput.value === "")
                  return data.patientUsername === username && date >= FromDate;

              return data.patientUsername === username && date >= FromDate && date <= ToDate;
          });
          if (app.length === 0) {
              row.style.display = "none";
          } else {
              row.style.display = "";
          }
      });
  }

    return(
        <div className={styles.container}>
            <div className={styles.filterContainer}>
                <div className={styles.search}>
                    <input type="text" id="searchInput" style={{fontSize:"14px", width:"160px", height:"35px"}} placeholder="Search for patients..."/>
                    <button id="searchListener" onClick={search} style={{width:"50px", height:"35px"}}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />   
                    </button>  
                </div>
                <div className={styles.dateFilter}>
                    <p style={{bottom:"10px", fontSize:"14px"}}>Appointments From</p>
                    <input type="date" style={{width:"160px", height:"35px"}} id="FromDateInput"/>
                    <p style={{bottom:"10px", fontSize:"14px"}}>To</p>
                    <input type="date" style={{width:"160px", height:"35px"}} id="ToDateInput"/>
                    <button id="filterListener" onClick={filter} style={{width:"60px", height:"35px"}}>filter</button>
                </div>  
            </div>
            <div className="TableContainer" style={{height:'420px', width: '850px'}}>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                    {patients.map((patient) => (
                    <tr key={patient._id}>
                        <td>            
                        <a onClick={() => handleGoToPatientDetails(patient._id)}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </a>        
                        </td>
                        <td>{patient.username}</td>
                        <td>{patient.name}</td>
                        <td>{patient.email}</td>
                    </tr>
                    ))}
                    </tbody>
                </table>
                <button onClick={handleGoBack} style={{width:"60px", height:"35px"}}>back</button>
            </div> 
        </div>  
    )
}
export default PatientsList;
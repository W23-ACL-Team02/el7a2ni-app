import axios from 'axios';
import styles from './PatientsList.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons' 
import { useNavigate } from "react-router-dom";
const { useState } = require("react");
const { useEffect } = require("react");
const serverURL = process.env.REACT_APP_SERVER_URL

const PatientsList = () => { 
    const [currUser, setCurrUser] = useState([]);
    const [patients,setPatients] = useState([]);
    const [appointments,setAppointments] = useState([]);
    const navigate = useNavigate()
    const getPatients =  async () => {
        try{
            const response = await axios.get(`${serverURL}/private/doctor/getAllPatients`,{ withCredentials: true,})
            console.log(response.data);  // Log the data directly
            const patients = response.data;
            setPatients(patients);
        }catch (error) {
            // Log the entire error object for debugging
            console.error('Axios Error:', error);
    
            // Check if there's a response object with more details
            if (error.response) {
                console.error('Response Status:', error.response.status);
                console.error('Response Data:', error.response.data);
            }
    
        }
        
    }
    const getAppointments =  async () => {
      await axios({
            url: `${serverURL}/private/doctor/appointments`,
            method: 'get',
            withCredentials: true,
            }).then(
      (res) => { 
         const appointments = res.data
         console.log(appointments)
         setAppointments(appointments)
     }
      ); 
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
                    <input type="text" id="searchInput" placeholder="Search for patients..."/>
                    <button id="searchListener" onClick={search}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />   
                    </button>  
                </div>
                <div className={styles.dateFilter}>
                    <label>Appointments From</label>
                    <input type="date" id="FromDateInput"/>
                    <label>To</label>
                    <input type="date" id="ToDateInput"/>
                    <button id="filterListener" onClick={filter}>filter</button>
                </div>  
            </div>
            <div className={styles.Table}>
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
                    <tr>
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
                <button className={styles.backBtn} onClick={handleGoBack}>back</button>
            </div> 
        </div>  
    )
}
export default PatientsList;
import axios from 'axios';
import './PatientsList.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons' 
import { useNavigate } from "react-router-dom";
const { useState } = require("react");
const { useEffect } = require("react");

const PatientsList = () => { 
    const [patients,setPatients] = useState([]);
    const [appointments,setAppointments] = useState([]);
    const navigate = useNavigate()
    const currDoctorId = "654e4e8b0a311a1637fa44b5"; // should make api request to get current user
    const getPatients =  async () => {
         await axios.get(`http://localhost:4000/private/patients/getAll/${currDoctorId}`).then(
         (res) => { 
            const patients = res.data
            console.log(patients)
            setPatients(patients)
            console.log("entered here")
        }
         ); 
    }
    const getAppointments =  async () => {
      await axios.get(`http://localhost:4000/private/patients/appointments/${currDoctorId}`).then(
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
      <div class="container">
        <div class="filterContainer">
            <div class="search">
                <input type="text" id="searchInput" placeholder="Search for patients..."/>
                <button id="searchListener" onClick={search}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />   
                </button>  
            </div>
            <div class="dateFilter">
                <label>Appointments From</label>
                <input type="date" id="FromDateInput"/>
                <label>To</label>
                <input type="date" id="ToDateInput"/>
                <button id="filterListener" onClick={filter}>filter</button>
            </div>  
        </div>
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
        <button class="backBtn" onClick={handleGoBack}>back</button>
      </div>
    )
}
export default PatientsList;
import axios from 'axios'
import {React,useState,useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import SelectedPrescriptions from './SelectedPrescriptions'
const baseURL = process.env.REACT_APP_SERVER_URL

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    backgroundColor: '#f2f2f2',
  },
  tr: {
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  button: {
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  buttonHover: {
    '&:hover': {
      backgroundColor: '#0056b3',
    },
    td: {
      border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'center',
    },
  },
};
export default function ViewPrescriptions() {

    const[prescriptions,setPrescriptions]=useState([])
    const [uniqueDoctorNames,setUniqueDoctorNames]=useState([])
    const [filteredPrescriptions,setFilteredPrescriptions]= useState([]);
    const [selectedDoctor,setSelectedDoctor]= useState('');
    const [detailedPrescription,setdetailedPrescription]=useState('');
    const [selectedDate,setSelectedDate]= useState('');
    const[selectedFilled,setSelectedFilled]=useState('');
    const navigate = useNavigate()
    

    useEffect(()=>{
            axios.get(`${baseURL}/clinic/private/patient/prescription/viewprescription`,{withCredentials:true}).then((result)=>{
            setPrescriptions(result.data.prescriptions)
            setUniqueDoctorNames(result.data.uniqueDoctorNames)
          })
    },[])
    

    const filterPrescriptions = () => {
      const today = new Date().toISOString().split('T')[0];
      const newPrescriptions = prescriptions.filter((prescription) => prescription.createdAt.includes(today));
      const oldPrescriptions = prescriptions.filter((prescription) => !prescription.createdAt.includes(today));

      const doctorFilter = (prescription) => !selectedDoctor || prescription.doctor.name === selectedDoctor;
      const dateFilter = (prescription) => !selectedDate || prescription.createdAt.includes(selectedDate);
      const filledFilter = (prescription) => selectedFilled === '' || prescription.isFilled.toString() === selectedFilled;
        
      return {
        newPrescriptions: newPrescriptions.filter((prescription) => doctorFilter(prescription) && dateFilter(prescription) && filledFilter(prescription)),
        oldPrescriptions: oldPrescriptions.filter((prescription) => doctorFilter(prescription) && dateFilter(prescription) && filledFilter(prescription)),      };
  };
    // const gotoPrescriptionDetails = (prescriptionId) => {

    //   const data = { prescriptionId: prescriptionId };
    //   navigate('/prescriptions/selectedPrescription', { state: data });
    // };
    const handleDoctorChange = (event) =>
    {
      const selectedValue= event.target.value;
      setSelectedDoctor(selectedValue)
    }
    const detaildPrescription=(prescriptionId) =>
    {
      prescriptions.map((prescription)=>{

        if( prescription._id ===prescriptionId)
        {setdetailedPrescription(prescription);}
        
      })
    }

    const handleDateChange = (event) => {
      // Update the selectedDate state when the date input changes
      const selectedValue = event.target.value;
      setSelectedDate(selectedValue);
    }
    const handleFilterChange = (event) =>
    {
      const selectedValue= event.target.value;
      setSelectedFilled(selectedValue);
    }
  
  return (
    <div className="table-container">
      <h3>Prescriptions</h3>
  
      <select name="doctor" id="doctorDropdown" onChange={handleDoctorChange}>
      <option value="">- Select Doctor -</option>
        {uniqueDoctorNames.map((doctorName,index) => (
          <option key={index} value={doctorName}>
            {doctorName}
          </option>
        ))}
        </select>
  
      <input type="date" id="dateFilter" onChange={handleDateChange} />
  
      <select name="filled" id="isFilled" onChange={handleFilterChange}>
      <option value="">- Filled/Not Filled -</option>
        <option value="true">Filled</option>
        <option value="false">Not Filled</option>
      </select>
  
          <h3>New_Prescriptions</h3>
      <div>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tr}>
              <th style={styles.th}>Doctor Name</th>
              <th style={styles.th}>IsFilled</th>
              <th style={styles.th}>Date and time</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="newPrescriptionsTable">
            {filterPrescriptions().newPrescriptions.map((prescription, index) => (
              <tr style={styles.tr} key={index} id={`row-${index}`}>
                <td style={styles.td}>{prescription.doctor.name}</td>
                <td style={styles.td}>{prescription.isFilled.toString()}</td>
                <td style={styles.td}>{prescription.createdAt}</td>
                <td style={styles.td}>
                  <button
                    style={styles.button}
                    onClick={() => detaildPrescription(prescription._id)}
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      <div>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tr}>
              <th style={styles.th}>Doctor Name</th>
              <th style={styles.th}>IsFilled</th>
              <th style={styles.th}>Date and time</th>
              <th></th>
            </tr>
          </thead>
          <h3>Old_Prescriptions</h3>
          <tbody id="oldPrescriptionsTable">
            
            {filterPrescriptions().oldPrescriptions.map((prescription, index) => (
              <tr style={styles.tr} key={index} id={`row-${index}`}>
                <td style={styles.td}>{prescription.doctor.name}</td>
                <td style={styles.td}>{prescription.isFilled.toString()}</td>
                <td style={styles.td}>{prescription.createdAt}</td>
                <td style={styles.td}>
                  <button
                    style={styles.button}
                    onClick={() => detaildPrescription(prescription._id)}
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <SelectedPrescriptions prescription={detailedPrescription} />
        </div>
      </div>
    </div>
  );
}
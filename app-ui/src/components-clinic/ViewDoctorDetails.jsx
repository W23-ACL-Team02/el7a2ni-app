import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../css/newTable.css'
const baseURL = process.env.REACT_APP_SERVER_URL;

const ViewDoctorDetails = () => {
  const [doctorId,setDoctorId] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const [familyArray, setFamilyArray] = useState([]);
  const [patientUsername, setPatientUsername] = useState(familyArray.length > 0 ? familyArray[0].ID : null);
  const [doctorVar, setDoctorVar] = useState(null);
  const [selectedAppointmentStartTime, setSelectedAppointmentStartTime] = useState(null);
  const navigate = useNavigate()
  
  useEffect(() => {
    setDoctorId(localStorage.getItem('doctorId'));
    const fetchDoctorDetails = async () => {
      try {
        if (doctorId) {
          const response = await axios({
            method: 'get',
            url: `${baseURL}/clinic/private/patient/viewDoctorDetails/${doctorId}`,
            withCredentials: true,
          });
          setDoctorVar(response.data.doctor);
          setDiscountRate(response.data.discountRate);
          setFamilyArray(response.data.patNfamily);
          console.log(doctorVar , discountRate);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  const handleBooking = async (date, startTime, endTime) => {
    // Implement your booking logic here
    console.log(`Book Now clicked for ${date}, ${startTime} to ${endTime}`);
    setSelectedAppointmentStartTime(startTime);

    const data = {patientUsername,selectedAppointmentStartTime: startTime, doctor: doctorVar}
    navigate( "/appointment-payment", {state: data}); // new line
    // try {

      
  
      // const response = await axios.post(`${baseURL}/clinic/private/patient/bookAppointment`,
      //   {
      //     patientUsername: patientUsername,
      //     doctorUsername: doctorVar.username,
      //     timeSlotStartTime: selectedAppointmentStartTime,
      //   },
      //   {
      //     withCredentials: true,
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   }
      // );
  
    //   console.log('Response:', response.data);
  
    // } catch (error) {
    //   console.error(error.message);
    // }
  };

  return (
    <div style={{display:"flex", flexDirection:"column" ,alignItems:"center", justifyContent:"center", alignContent:"center", marginTop:"80px"}}>
      {/* <style>
        {`
          .doctor-details-container {
            font-family: 'Arial', sans-serif;
          }

          .time-slots-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          .time-slots-table th, .time-slots-table td {
            border: 1px solid #008000;
            padding: 8px;
            text-align: left;
            font-size: 14px;
          }

          .time-slots-table th {
            background-color: #008000;
            color: white;
          }

          .book-now-button {
            background-color: #4caf50;
            border: none;
            color: white;
            padding: 8px 16px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            cursor: pointer;
          }
        `}
      </style> */}
      <h1>Doctor {doctorVar?.name}'s details</h1>
      <p>Speciality: {doctorVar?.speciality}</p>
      <p>Session Price: {Math.round(doctorVar?.payRate * (1 - discountRate) *1.1)}€</p>
      <p>Graduated from: {doctorVar?.education.name} in {doctorVar?.education.endYear} </p>
      <p>Affiliated With: {doctorVar?.affiliation} </p>
      <h2>Time Slots: ({Math.round(doctorVar?.payRate * (1 - discountRate) *1.1)}€ per session)</h2>
      <div className="TableContainer" style={{width:"500px", height:"300px"}}>
        <table>
          <thead>
            <tr>
              <th>Actions</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {doctorVar?.timeSlots.map((timeSlot, index) => (
              <tr key={index}>
                <td>
                  <button style={{width:'200px',height:'70px'}}className="book-now-button" onClick={() => handleBooking(timeSlot.date, timeSlot.startTime, timeSlot.endTime)}>
                    Book Now!
                  </button>
                </td>
                <td>{new Date(timeSlot.date).toLocaleDateString('en-DE')}</td>
                <td>{new Date(timeSlot.startTime).toLocaleTimeString('en-DE', { hour: '2-digit', minute: '2-digit' })}</td>
                <td>{new Date(timeSlot.endTime).toLocaleTimeString('en-DE', { hour: '2-digit', minute: '2-digit' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {familyArray.length > 0 && (
        <div>
          <h2>Family Members:</h2>
          Selected Family member: 
            <select
              value={patientUsername}
              onChange={(e) => setPatientUsername(e.target.value)}
            >
              {familyArray.map((familyMember) => (
                <option key={familyMember.username} value={familyMember.username}>
                  {familyMember.name} / Discount Rate: {familyMember.discount}
                </option>
              ))}
            </select>
        </div>
      )}
      {selectedAppointmentStartTime && (
        <p>Selected Appointment Start Time: {new Date(selectedAppointmentStartTime).toLocaleTimeString('en-DE', { hour: '2-digit', minute: '2-digit' })}</p>
      )}
      {selectedAppointmentStartTime && (
        <p>Selected Appointment Start Time: {new Date(selectedAppointmentStartTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</p>
      )}
    </div>
    </div>
  );
};

export default ViewDoctorDetails;

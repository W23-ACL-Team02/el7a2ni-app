import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
//import '../css/cancelAppointment.css';
import '../css/addAdmin.css'
const baseURL = process.env.REACT_APP_SERVER_URL;
const PatientAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${baseURL}/clinic/private/patient/notCompletedPatientAppointments`,{withCredentials:true}); // Replace with your endpoint
        setAppointments(response.data.appointments);
        console.log(appointments)
      } catch (error) {
        console.error('Error fetching appointments: ', error);
      }
    };

    fetchAppointments();
  }, []);

  const handleReschedule = (appointmentId,doctorUsername) => {
    console.log(appointmentId)
   // window.location.href=`/rescheduleAppointment2?appointmentId=${appointmentId}`
   navigate(`/rescheduleAppointment2?appointmentId=${appointmentId}&doctorUsername=${doctorUsername}`);

  };
  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}.${month}.${year}`;
  };
  const formatTime = (time) => {
    const formattedTime = new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return formattedTime;
  };

  return (
    <div className="container">
      <div className="rectangle2">
        <h2>Your Appointments</h2>
        <div className="appointment-list">
          {appointments.map((appointment) => (
            (appointment.status !== 'cancelled' && appointment.status !== 'completed') && (
              <div key={appointment._id} className="appointment-container">
                <div className="rectangle">
                  <div className="medicine-info ">
                    <div className="details">
                      <p>Date: {formatDate(appointment.date)}</p>
                    </div>
                    <div className="details">
                      <p>Start: {formatTime(appointment.start)}</p>
                    </div>
                    <div className="details">
                      <p>End: {formatTime(appointment.end)}</p>
                    </div>
                    <div className="details">
                      <p>Doctor: {appointment.doctorUsername}</p>
                    </div>
                    
                    <div className="details">
                      <p>Status: {appointment.status}</p>
                    </div>
                    <button onClick={() => handleReschedule(appointment._id, appointment.doctorUsername)} className="submit-button">
                      Reschedule
                    </button>
                    <hr />
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
  
};

export default PatientAppointmentList;

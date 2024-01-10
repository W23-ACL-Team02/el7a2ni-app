import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import '../css/cancelAppointment.css';
const baseURL = process.env.REACT_APP_SERVER_URL;
const FamilyCancelList = () => {
const [appointments, setAppointments] = useState([]);
const [message, setMessage] = useState('');
const parameters = new URLSearchParams(window.location.search);
  const familyMember = parameters.get('member');



  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${baseURL}/clinic/private/patient/notCompletedFamilyAppointments`, {
        params: { familyMember },
        withCredentials: true,
      });
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Error fetching appointments: ', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [familyMember]); // 
  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.post(`${baseURL}/clinic/private/patient/cancelAppointmentForFamily`, {
        appointmentId,
        withCredentials: true,
      });

      setMessage('Appointment cancelled successfully.'); // Set success message
      // Refetch appointments to reflect the updated data after cancellation
      fetchAppointments();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setMessage(error.response.data.errors);
      } else {
        setMessage('An error occurred while cancelling the appointment.');
      }
    }
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
        <h2>Patient's Appointments</h2>
        <div className="medicines-list">
          {appointments.map(appointment => (
            (appointment.status !== 'completed') && (
              <div key={appointment._id} className="medicine-container">
                <div className="rectangle">
                  <div className="medicine-info">
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
                    {/* Add more appointment details as needed */}
                    <button onClick={() => handleCancelAppointment(appointment._id)} className="submit-button">
                      Cancel
                    </button>
                    <hr />
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
        {/* <p>{message}</p> */}
      </div>
    </div>
  );
    
};

export default FamilyCancelList;

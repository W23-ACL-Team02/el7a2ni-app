

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/addAdmin.css';

const FilterByStatus = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/clinic/private/user/filterAppointmentsByStatus', {withCredentials: true});
      setAppointments(response.data.unfilteredAppointments);
      setFilteredAppointments(response.data.filteredAppointments);
      setError('');
    } catch (error) {
      setError('Error fetching appointments.');
      console.error('Error fetching appointments:', error);
    }
  };

  const handleFilter = async () => {
    try {
      const response = await axios.get('http://localhost:3000/clinic/private/user/filterAppointmentsByStatus', {
        params: { status },
        withCredentials: true
      });
      setFilteredAppointments(response.data.filteredAppointments);
      setError('');
    } catch (error) {
      setError('Error filtering appointments.');
      console.error('Error filtering appointments:', error);
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
        <h2>Appointments</h2>
        {/* {error && <p>{error}</p>} */}
        <div className="input">
          <label htmlFor="status">Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
            <option value="">Select Status</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
        </div>
        
        
        <button onClick={handleFilter} className="submit-button">
          Filter
        </button>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
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
                    <p>Patient: {appointment.patientUsername}</p>
                  </div>
                  
                  <div className="details">
                    <p>Status: {appointment.status}</p>
                  </div>
                  {/* Add more appointment details as needed */}
                 
                  <hr />
                </div>
              </div>
              
            </div>
            ))
          ) : (
            <p>{appointments.length === 0 && "No appointments found."}</p>
          )}
      
      </div>
      
    </div>
  );
  
};

export default FilterByStatus;


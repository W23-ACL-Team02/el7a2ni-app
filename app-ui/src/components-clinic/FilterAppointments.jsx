

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/addAdmin.css';
const serverURL = process.env.REACT_APP_SERVER_URL;

const FilterAppointments = () => {
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
      const response = await axios.get(`${serverURL}/clinic/private/user/filterAppointments`, {withCredentials: true});
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
      const response = await axios.get(`${serverURL}/clinic/private/user/filterAppointments`, {
        params: { status, date },
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

  // return (
  //   <div>
  //     <h2>Appointments</h2>
  //     {/* {error && <p>{error}</p>} */}
  //     <div>
  //       <label htmlFor="status">Status:</label>
  //       <select value={status} onChange={(e) => setStatus(e.target.value)}>
  //         <option value="">Select Status</option>
  //         <option value="completed">Completed</option>
  //         <option value="upcoming">Upcoming</option>
  //         <option value="cancelled">Cancelled</option>
  //         <option value="rescheduled">Rescheduled</option>
  //       </select>
  //     </div>
  //     <div>
  //       <label htmlFor="date">Date:</label>
  //       <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
  //     </div>
  //     <button onClick={handleFilter}>Filter</button>
  //     <ul>
  //       {filteredAppointments.length > 0
  //         ? filteredAppointments.map(appointment => (
  //             <li key={appointment._id} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px 0' }}>
  //               <p><strong>Doctor:</strong> {appointment.doctorUsername}</p>
  //               <p><strong>Patient:</strong> {appointment.patientUsername}</p>
  //               <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
  //               <p><strong>Status:</strong> {appointment.status}</p>
  //               {/* Display other appointment details */}
  //             </li>
  //           ))
  //         : appointments.length === 0 && <p>No appointments found.</p>}
  //     </ul>
  //   </div>
  // );

  // return (
  //   <div>
  //     <h2>Appointments</h2>
  //     {/* {error && <p>{error}</p>} */}
  //     <div>
  //       <label htmlFor="status">Status:</label>
  //       <select value={status} onChange={(e) => setStatus(e.target.value)}>
  //         <option value="">Select Status</option>
  //         <option value="completed">Completed</option>
  //         <option value="upcoming">Upcoming</option>
  //         <option value="cancelled">Cancelled</option>
  //         <option value="rescheduled">Rescheduled</option>
  //       </select>
  //     </div>
  //     <div>
  //       <label htmlFor="date">Date:</label>
  //       <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
  //     </div>
  //     <button onClick={handleFilter}>Filter</button>
  //     <ul>
  //       {filteredAppointments.length > 0
  //         ? filteredAppointments.map(appointment => (
  //             <li key={appointment._id} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px 0' }}>
  //               <p><strong>Doctor:</strong> {appointment.doctorUsername}</p>
  //               <p><strong>Patient:</strong> {appointment.patientUsername}</p>
  //               <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
  //               <p><strong>Status:</strong> {appointment.status}</p>
  //               {/* Display other appointment details */}
  //             </li>
  //           ))
  //         : appointments.length === 0 && <p>No appointments found.</p>}
  //     </ul>
  //   </div>
  // );


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
        <div className="input">
          <label htmlFor="date">Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" />
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

export default FilterAppointments;


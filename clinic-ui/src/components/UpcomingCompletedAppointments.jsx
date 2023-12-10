import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpcomingCompletedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/private/user/upcomingCompletedAppointments', {withCredentials: true});
      setAppointments(response.data.filteredAppointments || []);
      setError('');
    } catch (error) {
      setError('Error fetching appointments. Please try again later.');
      console.error('Error fetching appointments:', error);
    }
  };

  // Function to format date as dd.mm.yyyy
  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div>
      <h2>Upcoming and Completed Appointments</h2>
      {error && <p className="error-message">{error}</p>}
      {appointments.length === 0 ? (
        <p>No upcoming or completed appointments found.</p>
      ) : (
        <ul className="appointment-list">
          {appointments.map(appointment => (
            <li key={appointment._id}  style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px 0' }}>
              <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
              <p><strong>Status:</strong> {appointment.status}</p>
              <p><strong>Doctor:</strong> {appointment.doctorUsername}</p>
              <p><strong>Patient:</strong> {appointment.patientUsername}</p>
              {/* Display other appointment details */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UpcomingCompletedAppointments;

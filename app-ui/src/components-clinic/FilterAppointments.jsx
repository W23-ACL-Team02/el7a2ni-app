

import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      const response = await axios.get('http://localhost:3000/private/user/filterAppointments', {withCredentials: true});
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
      const response = await axios.get('http://localhost:3000/private/user/filterAppointments', {
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

  return (
    <div>
      <h2>Appointments</h2>
      {error && <p>{error}</p>}
      <div>
        <label htmlFor="status">Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select Status</option>
          <option value="completed">Completed</option>
          <option value="upcoming">Upcoming</option>
          <option value="cancelled">Cancelled</option>
          <option value="rescheduled">Rescheduled</option>
        </select>
      </div>
      <div>
        <label htmlFor="date">Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <button onClick={handleFilter}>Filter</button>
      <ul>
        {filteredAppointments.length > 0
          ? filteredAppointments.map(appointment => (
              <li key={appointment._id} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px 0' }}>
                <p><strong>Doctor:</strong> {appointment.doctorUsername}</p>
                <p><strong>Patient:</strong> {appointment.patientUsername}</p>
                <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
                <p><strong>Status:</strong> {appointment.status}</p>
                {/* Display other appointment details */}
              </li>
            ))
          : appointments.length === 0 && <p>No appointments found.</p>}
      </ul>
    </div>
  );
};

export default FilterAppointments;

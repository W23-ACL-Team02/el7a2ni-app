import React, { useState } from 'react';
import axios from 'axios';
import '../css/addAdmin.css';
const AddTimeSlots = () => {
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const baseURL = process.env.REACT_APP_SERVER_URL; // Replace with your backend URL

  const handleAddTimeSlot = async () => {
    try {
      const response = await axios.post(`${baseURL}/clinic/private/doctor/addTimeSlots`, { date, start, end }, {withCredentials: true});
      console.log('Response:', response.data);
      setSuccessMessage('Time slot added successfully.'); // Set success message
      // Optionally, handle success actions like updating UI, etc.
    } catch (error) {
      setError('Error adding time slot.');
      console.error('Error adding time slot:', error);
      // Handle error state - show error message, log error, etc.
    }
  };

  
  return (
    <div className="container">
      <div className="rectangle2">
        <h2>Add Time Slot</h2>
        {error && <p>{error}</p>}
        {successMessage && <p>{successMessage}</p>}
        <div className="input">
          <label htmlFor="date"> Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="input">
          <label htmlFor="start"> Start:</label>
          <input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="input"
          />
        </div>
        <div className="input">
          <label htmlFor="end"> End:</label>
          <input
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="input"
          />
        </div>
        <button className="submit-button" onClick={handleAddTimeSlot} >
          Add Time Slot
        </button>
      </div>
    </div>
  );
  
};

export default AddTimeSlots;

import React, { useState } from 'react';
import axios from 'axios';

const AddTimeSlots = () => {
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const baseURL = 'http://localhost:3000'; // Replace with your backend URL

  const handleAddTimeSlot = async () => {
    try {
      const response = await axios.post(`${baseURL}/private/doctors/addTimeSlots`, { date, start, end }, {withCredentials: true});
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
    <div>
      <h2>Add Time Slot</h2>
      {error && <p>{error}</p>}
      {successMessage && <p>{successMessage}</p>}
      <label htmlFor="date"> Date:</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <br />
      <label htmlFor="start"> Start Time:</label>
      <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
      <br />
      <label htmlFor="end"> End Time:</label>
      <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
      <br />
      <button onClick={handleAddTimeSlot}>Add Time Slot</button>
    </div>
  );
};

export default AddTimeSlots;

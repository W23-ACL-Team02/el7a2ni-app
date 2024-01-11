// import React, { useState } from 'react';
// import axios from 'axios';
// import '../css/addAdmin.css'
// import { useParams } from 'react-router-dom';
// const baseURL = process.env.REACT_APP_SERVER_URL;


// const ReschedulePatientPage = () => {
//  // const { appointmentId } = useParams();

//   const [formData, setFormData] = useState({
//     newDate: '',
//     newStartTime: '',
//     newEndTime: ''
//   });
//   const [successMessage, setSuccessMessage] = useState('');
//   const parameters = new URLSearchParams(window.location.search);
//   const appointmentId = parameters.get('appointmentId');
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const rescheduleData = {
//         appointmentId,
//         newDate: formData.newDate,
//         newStartTime: formData.newStartTime,
//         newEndTime: formData.newEndTime
//       };
//       console.log(rescheduleData)

//       const response = await axios.post(`${baseURL}/clinic/private/patient/rescheduleAppointmentForFamily`,  rescheduleData ,{withCredentials: true }); // Replace with your endpoint
//       console.log(response.data); // Handle success message
//       setSuccessMessage('Appointment rescheduled successfully');
//     } catch (error) {
//       console.error('Error rescheduling appointment: ', error);

//       if (error.response && error.response.data) {
//         // If the server responded with an error message
//         console.error('Server error:', error.response.data);
//         // Handle the error message as per your application's requirements
//       } else {
//         // If there's a network error or any other error without a response data
//         console.error('Network error or something went wrong:', error.message);
//         // Handle the error message as per your application's requirements
//       }
//     }
//   }; // <- Add a closing brace for the handleSubmit function here
//   return (
//     <div className="container">
//     <div className="rectangle2">
//       <h2>Reschedule Appointment</h2>
//       <form onSubmit={handleSubmit} className="form">
//         <div className="input">
//           <label htmlFor="newDate">New Date:</label>
//           <input
//             type="date"
//             placeholder="New Date"
//             name="newDate"
//             value={formData.newDate}
//             onChange={handleChange}
//             className="input-field"
//           />
//         </div>
//         <div className="input">
//           <label htmlFor="newStartTime">Start Time:</label>
//           <input
//             type="time"
//             placeholder="New Start Time"
//             name="newStartTime"
//             value={formData.newStartTime}
//             onChange={handleChange}
//             className="input-field"
//           />
//         </div>
//         <div className="input">
//           <label htmlFor="newEndTime">End Time:</label>
//           <input
//             type="time"
//             placeholder="New End Time"
//             name="newEndTime"
//             value={formData.newEndTime}
//             onChange={handleChange}
//             className="input-field"
//           />
//         </div>
//         <button type="submit" className="submit-button">
//           Reschedule
//         </button>
//         {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
//       </form>
//     </div>
//     </div>
//   );
  
// };

// export default ReschedulePatientPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/addAdmin.css';
import { useParams } from 'react-router-dom';

const baseURL = process.env.REACT_APP_SERVER_URL;

const RescheduleFamilyPage = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    chosenSlot: '',
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const parameters = new URLSearchParams(window.location.search);
  const appointmentId = parameters.get('appointmentId');
  const doctorUsername = parameters.get('doctorUsername');

  useEffect(() => {
    // Fetch available slots logic (replace with your endpoint)
    const fetchAvailableSlots = async () => {
      try {
        const response = await axios.get(`${baseURL}/clinic/private/doctor/getAvailableTime`, {
          params: {
            doctorUsername: doctorUsername
          },
          withCredentials: true
        });
        console.log(response.data.availableTimeSlots)
       setAvailableSlots(response.data.availableTimeSlots); // Assuming response.data.availableSlots is an array of available slot objects
//console.log("avvv",availableSlots)
      } catch (error) {
        console.error('Error fetching available slots: ', error);
      }
    };

    fetchAvailableSlots();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.chosenSlot) {
        // Find the selected slot object using the slotId
        const selectedSlot = availableSlots.find((slot) => slot.slotId === formData.chosenSlot._id);
        console.log("selected",selectedSlot)

        if (selectedSlot) {
          const rescheduleData = {
            appointmentId,
            newDate: selectedSlot.date,
            newStartTime: selectedSlot.startTime,
            newEndTime: selectedSlot.endTime,
            doctorUsername,
          };
          
          console.log("rescheduleData",rescheduleData)

          const response = await axios.post(`${baseURL}/clinic/private/patient/rescheduleAppointmentForFamily`, rescheduleData, { withCredentials: true });
          setSuccessMessage('Appointment rescheduled successfully');
          console.log(response.data); // Handle success message
        } else {
          console.error('Selected slot not found');
          // Handle the case where the selected slot is not found
        }
      } else {
        console.error('No slot selected');
        // Handle the case where no slot is selected
      }
    } catch (error) {
      console.error('Error rescheduling appointment: ', error);
      // Error handling code
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
        <h2>Reschedule Appointment</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="input">
            <label htmlFor="chosenSlot">Available Slots:</label>
            <select
              name="chosenSlot"
              value={formData.chosenSlot} // Convert the slot object to a string for the value
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select a slot</option>
              {availableSlots.map((slot) => (
                <option key={slot.slotId} value={slot}>
                  {`${formatDate(slot.date)} - ${formatTime(slot.startTime)} to ${formatTime(slot.endTime)}`}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="submit-button" disabled={!formData.chosenSlot}>
            Reschedule
          </button>
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default RescheduleFamilyPage;


// // import React, { useState } from 'react';
// // import axios from 'axios';

// // const FilterAppointments = () => {
// //   const [status, setStatus] = useState('');
// //   const [date, setDate] = useState('');
// //   const [filteredAppointments, setFilteredAppointments] = useState([]);
// //   const [error, setError] = useState('');

// //   const baseURL = 'http://localhost:4000'; // Replace with your backend URL

// //   const handleFilterAppointments = async () => {
// //     try {
// //       const response = await axios.get(`${baseURL}/private/user/filterAppointments`, {
// //         params: { status, date }
// //       });
// //       console.log('Filtered Appointments:', response.data.filteredAppointments);
// //       setFilteredAppointments(response.data.filteredAppointments);
// //       console.log(response.data.filteredAppointments+" frontend")
// //       setError('');
// //     } catch (error) {
// //       setError('Error filtering appointments.');
// //       console.error('Error filtering appointments:', error);
// //       setFilteredAppointments([]);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Filter Appointments</h2>
// //       {error && <p>{error}</p>}
// //       <label htmlFor="status">Status:</label>
// //       <select value={status} onChange={(e) => setStatus(e.target.value)}>
// //         <option value="">Select Status</option>
// //         <option value="upcoming">Upcoming</option>
// //         <option value="completed">Completed</option>
// //         <option value="cancelled">Cancelled</option>
// //         <option value="rescheduled">Rescheduled</option>
// //       </select>
// //       <br />
// //       <label htmlFor="date">Date:</label>
// //       <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
// //       <br />
// //       <button onClick={handleFilterAppointments}>Filter Appointments</button>
// //       <br />
// //       {filteredAppointments.length > 0 ? (
// //         <div>
// //           <h3>Filtered Appointments:</h3>
// //           <ul>
// //             {filteredAppointments.map((appointment) => (
// //               <li key={appointment._id}>
// //                 {/* Display appointment details */}
// //                 {/* Modify this according to your appointment schema */}
// //                 <p>Date: {appointment.date}</p>
// //                 <p>Status: {appointment.status}</p>
// //                 {/* Display other relevant details */}
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       ) : (
// //         <p>No appointments found.</p>
// //       )}
// //     </div>  );
// // };

// // export default FilterAppointments;


// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // //import { filterAppointments } from '../../../src/controllers/appointmentController';

// // const FilterAppointments = () => {
// //   const [appointments, setAppointments] = useState([]);
// //   const [filteredAppointments, setFilteredAppointments] = useState([]);
// //   const [status, setStatus] = useState('');
// //   const [date, setDate] = useState('');
// //   const [error, setError] = useState('');

// //   useEffect(() => {
// //     // Fetch all appointments on component mount
// //     fetchAppointments();
// //   }, []);

// //   const fetchAppointments = async () => {
// //     try {
// //       const response = await axios.get('http://localhost:4000/private/user/allAppointments');
// //       setAppointments(response.data);
// //       setFilteredAppointments(response.data); // Initially, display all appointments
// //       setError('');
// //     } catch (error) {
// //       setError('Error fetching appointments.');
// //       console.error('Error fetching appointments:', error);
// //     }
// //   };

// //   const handleFilter = () => {
// //     let filtered = appointments;

// //     if (status) {
// //       filtered = filtered.filter(appointment => appointment.status === status);
// //     }

// //     if (date) {
// //       filtered = filtered.filter(appointment => {
// //         const appointmentDate = new Date(appointment.date).toLocaleDateString('en-US');
// //         return appointmentDate === date;
// //       });
// //     }

// //     setFilteredAppointments(filtered);
// //   };

// //   return (
// //     <div>
// //       <h2>All Appointments</h2>
// //       {error && <p>{error}</p>}
// //       <div>
// //         <label htmlFor="status">Status:</label>
// //         <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
// //       </div>
// //       <div>
// //         <label htmlFor="date">Date:</label>
// //         <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
// //       </div>
// //       <button onClick={handleFilter}>Filter</button>
// //       <ul>
// //         {filteredAppointments.map(appointment => (
// //           <li key={appointment._id}>
// //             <p>Date: {appointment.date}</p>
// //             <p>Status: {appointment.status}</p>
// //             <p>Doctor: {appointment.doctorUsername}</p>
// //             <p>Patient: {appointment.patientUsername}</p>

// //             {/* Display other appointment details */}
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default FilterAppointments;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const FilterAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [filteredAppointments, setFilteredAppointments] = useState([]);
//   const [status, setStatus] = useState('');
//   const [date, setDate] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       const response = await axios.get('http://localhost:4000/private/user/filterAppointments');
//       setAppointments(response.data.unfilteredAppointments);
//       setFilteredAppointments(response.data.filteredAppointments);
//       setError('');
//     } catch (error) {
//       setError('Error fetching appointments.');
//       console.error('Error fetching appointments:', error);
//     }
//   };

//   const handleFilter = async () => {
//     try {
//       const response = await axios.get('http://localhost:4000/private/user/filterAppointments', {
//         params: { status, date }
//       });
//       setFilteredAppointments(response.data.filteredAppointments);
//       setError('');
//     } catch (error) {
//       setError('Error filtering appointments.');
//       console.error('Error filtering appointments:', error);
//     }
//   };

//   const formatDate = (dateStr) => {
//     const dateObj = new Date(dateStr);
//     const day = String(dateObj.getDate()).padStart(2, '0');
//     const month = String(dateObj.getMonth() + 1).padStart(2, '0');
//     const year = dateObj.getFullYear();
//     return `${day}.${month}.${year}`;
//   };

//   return (
//     <div>
//       <h2>Appointments</h2>
//       {error && <p>{error}</p>}
//       <div>
//         <label htmlFor="status">Status:</label>
//         <select value={status} onChange={(e) => setStatus(e.target.value)}>
//           <option value="">Select Status</option>
//           <option value="completed">Completed</option>
//           <option value="upcoming">Upcoming</option>
//           <option value="cancelled">Cancelled</option>
//           <option value="rescheduled">Rescheduled</option>
//         </select>
//       </div>
//       <div>
//         <label htmlFor="date">Date:</label>
//         <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
//       </div>
//       <button onClick={handleFilter}>Filter</button>
//       <ul>
//         {filteredAppointments.length > 0
//           ? filteredAppointments.map(appointment => (
//               <li key={appointment._id} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px 0' }}>
//                 <p><strong>Doctor:</strong> {appointment.doctorUsername}</p>
//                 <p><strong>Patient:</strong> {appointment.patientUsername}</p>
//                 <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
//                 <p><strong>Status:</strong> {appointment.status}</p>
//                 {/* Display other appointment details */}
//               </li>
//             ))
//           : filteredAppointments.length === 0 && appointments.length === 0
//             ? <p>No appointments to display.</p>
//             : appointments.map(appointment => (
//                 <li key={appointment._id} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px 0' }}>
//                   <p><strong>Doctor:</strong> {appointment.doctorUsername}</p>
//                   <p><strong>Patient:</strong> {appointment.patientUsername}</p>
//                   <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
//                   <p><strong>Status:</strong> {appointment.status}</p>
//                   {/* Display other appointment details */}
//                 </li>
//               ))}
//       </ul>
//     </div>
//   );
// };

// export default FilterAppointments;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const FilterAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [filteredAppointments, setFilteredAppointments] = useState([]);
//   const [status, setStatus] = useState('');
//   const [date, setDate] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       const response = await axios.get('http://localhost:4000/private/user/filterAppointments');
//       setAppointments(response.data.unfilteredAppointments);
//       setFilteredAppointments(response.data.filteredAppointments);
//       setError('');
//     } catch (error) {
//       setError('Error fetching appointments.');
//       console.error('Error fetching appointments:', error);
//     }
//   };

//   const handleFilter = async () => {
//     try {
//       const response = await axios.get('http://localhost:4000/private/user/filterAppointments', {
//         params: { status, date }
//       });
//       setFilteredAppointments(response.data.filteredAppointments);
//       setError('');
//     } catch (error) {
//       setError('Error filtering appointments.');
//       console.error('Error filtering appointments:', error);
//     }
//   };

//   const formatDate = (dateStr) => {
//     const dateObj = new Date(dateStr);
//     const day = String(dateObj.getDate()).padStart(2, '0');
//     const month = String(dateObj.getMonth() + 1).padStart(2, '0');
//     const year = dateObj.getFullYear();
//     return `${day}.${month}.${year}`;
//   };

//   return (
//     <div>
//       <h2>Appointments</h2>
//       {error && <p>{error}</p>}
//       <div>
//         <label htmlFor="status">Status:</label>
//         <select value={status} onChange={(e) => setStatus(e.target.value)}>
//           <option value="">Select Status</option>
//           <option value="completed">Completed</option>
//           <option value="upcoming">Upcoming</option>
//           <option value="cancelled">Cancelled</option>
//           <option value="rescheduled">Rescheduled</option>
//         </select>
//       </div>
//       <div>
//         <label htmlFor="date">Date:</label>
//         <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
//       </div>
//       <button onClick={handleFilter}>Filter</button>
//       <ul>
//         {filteredAppointments.length > 0
//           ? filteredAppointments.map(appointment => (
//               <li key={appointment._id} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px 0' }}>
//                 <p><strong>Doctor:</strong> {appointment.doctorUsername}</p>
//                 <p><strong>Patient:</strong> {appointment.patientUsername}</p>
//                 <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
//                 <p><strong>Status:</strong> {appointment.status}</p>
//                 {/* Display other appointment details */}
//               </li>
//             ))
//           : <p>No filtered appointments found.</p>}
//       </ul>
//     </div>
//   );
// };

// export default FilterAppointments;


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


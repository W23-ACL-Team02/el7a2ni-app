import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientSearchDoctors = () => {

  const navigate = useNavigate();

  //input variables
  const [doctorname, setDoctorName] = useState('');
  const [docSpeciality, setDocSpeciality] = useState('');
  const [theDateTime, setTheDateTime] = useState('');
  //output variables
  const [doctorList, setDoctorList] = useState([]);
  const [discountRate, setDiscountRate] = useState(0);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {

        const response = await axios({ method: 'get',
        url: 'http://localhost:3000/private/patient/viewDoctors',
        withCredentials: true})
        
        setDoctorList(response.data.docs);
        setDiscountRate(response.data.discountRate);
        
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchDoctors();
  }, []);

  const handleSearch = async () => {

    try {
      console.log(doctorname, docSpeciality, theDateTime);

      const response = await axios({
        method: 'post',
        url: 'http://localhost:3000/private/patient/searchDoctors',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          docname: doctorname,
          speciality: docSpeciality,
          date: theDateTime,
        }),
      });

      setDoctorList(response.data.docs);
      setDiscountRate(response.data.discountRate);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDocView = (doctorId) => {
    localStorage.setItem('doctorId', doctorId);
    navigate('/viewdocdetails');
  };

  const specialities = ['General Practitioner', 'Cardiologist', 'Neurologist', 'Dermatologist', 'Surgeon', 'Ophthalmologist', 'Optometrist', 'Pediatrician', 'Family Medicine', 'Radiologist', 'Psychiatrist', 'Anesthesiologist'];

  return (
    <div>
      <h1>Search Doctors Page</h1>

      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
        <div style={{ marginRight: '10px' }}>
          <label>
            Doctor Name:
            <input type="text" value={doctorname} onChange={(e) => setDoctorName(e.target.value)} />
          </label>
        </div>
        <div style={{ marginRight: '10px' }}>
          <label>
            Speciality:
            <select value={docSpeciality} onChange={(e) => setDocSpeciality(e.target.value)}>
              <option value="">All Specialities</option>
              {specialities.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginRight: '10px' }}>
          <label>
            Date and Time:
            <input type="datetime-local" value={theDateTime} onChange={(e) => setTheDateTime(e.target.value)} />
          </label>
        </div>
        <div>
          <button onClick={handleSearch}>Search Doctors</button>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
  <thead>
    <tr style={{ border: '6px solid black' }}>
      <th style={{ border: '6px solid black', padding: '8px', textAlign: 'left', color: 'black' }}>View</th>
      <th style={{ border: '6px solid black', padding: '8px', textAlign: 'left', color: 'black' }}>Name</th>
      <th style={{ border: '6px solid black', padding: '8px', textAlign: 'left', color: 'black' }}>Speciality</th>
      <th style={{ border: '6px solid black', padding: '8px', textAlign: 'left', color: 'black' }}>Session Price</th>
    </tr>
  </thead>
  <tbody>
    {doctorList.map((doctor) => (
      <tr key={doctor._id} style={{ border: '6px solid black' }}>
        <td style={{ border: '6px solid black', padding: '8px', textAlign: 'left', color: 'black' }}>
        <button onClick={() => handleDocView(doctor._id)}>View Doctor's Details</button>
        </td>
        <td style={{ border: '6px solid black', padding: '8px', textAlign: 'left', color: 'black' }}>
          {doctor.name}
        </td>
        <td style={{ border: '6px solid black', padding: '8px', textAlign: 'left', color: 'black' }}>
          {doctor.speciality}
        </td>
        <td style={{ border: '6px solid black', padding: '8px', textAlign: 'left', color: 'black' }}>
          {Math.round(doctor.payRate * 1.1 * (1-discountRate))}€
        </td>
      </tr>
    ))}
  </tbody>
</table>



    </div>
  );
};

export default PatientSearchDoctors;

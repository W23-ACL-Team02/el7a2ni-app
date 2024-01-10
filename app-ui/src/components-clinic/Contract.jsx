import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const serverURL = process.env.REACT_APP_SERVER_URL;

const Contract = () => {
  const [doctor, setDoctor] = useState({});
  const [clinicMarkUp, setClinicMarkUp] = useState(1.1);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch doctor details when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverURL}/clinic/private/doctor/viewContract`, {withCredentials: true});
        const { doctor, clinicMarkUp } = response.data;
        console.log(response.data)
        console.log(clinicMarkUp)
        console.log(doctor)
        setDoctor(doctor);
        setClinicMarkUp(clinicMarkUp);
        console.log(doctor)
        console.log(clinicMarkUp)
        console.log(doctor)
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []); // Run only once when the component mounts

  const handleAcceptContract = async () => {
    try {
      //redirect to homepage
      await axios({ method: 'put',
      url: `${serverURL}/clinic/private/doctor/acceptContract`,
      withCredentials: true})
      // Redirect to homepage
      navigate('/home')
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <h2>Doctor Details</h2>
      <p>Name: {doctor.name}</p>
      <p>Email: {doctor.email}</p>
      <p>Speciality: {doctor.speciality}</p>
      <p>Hourly Rate: {Math.round(doctor.payRate)}€</p>
      <p>Patient Pays: {Math.round((doctor.payRate * clinicMarkUp))}€</p>
      <p>Clinic MarkUp: 10%</p>

      <button onClick={handleAcceptContract}>Accept Employment Contract(terms and conditions)</button>
    </div>
  );
};

export default Contract;

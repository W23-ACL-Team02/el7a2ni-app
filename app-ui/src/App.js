import { useState } from 'react';
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Login from './components-main/Login'
import ViewDoctorDetails from './components-clinic/ViewDoctorDetails'
import AppointmentPayment from './components-clinic/patient/AppointmentPayment/AppointmentPayment'
import PatientSearchDoctors from './components-clinic/PatientSearchDoctors'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}></Route> 
        <Route path='/viewdocdetails' element={<ViewDoctorDetails/>}></Route> 
        <Route path='/appointment-payment' element={<AppointmentPayment/>}></Route>
        <Route path='/doctors-list' element={<PatientSearchDoctors/>}></Route>  
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
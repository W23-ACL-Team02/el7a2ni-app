import { useState } from 'react';
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Login from './components-main/Login.jsx';
import PatientsList from './components-clinic/doctor/PatientsList/PatientsList.js'
import PatientDetails from './components-clinic/doctor/PatientDetails/PatientDetails.js'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        {/*  */}
          <Route path="/login" element={<Login />} />
          <Route path="/patientsList" element={<PatientsList />} />
          <Route path="/patient-details" element={<PatientDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
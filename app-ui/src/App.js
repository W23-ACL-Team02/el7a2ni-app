import { useState } from 'react';
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Login from '../src/components-main/Login';
import PatientsList from '../src/components-clinic/doctor/PatientsList'
import PatientDetails from '../src/components-clinic/doctor/PatientDetails'

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
          <Route path="/VideoCallRoom" element={<VideoCallRoom />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
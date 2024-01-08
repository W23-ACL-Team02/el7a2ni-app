import { useState } from 'react';
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

import PatientsList from './components-clinic/doctor/PatientsList/PatientsList.js';
import PatientDetails from './components-clinic/doctor/PatientDetails/PatientDetails.js';
import VideoCallRoom from './components-clinic/shared/VideoCallRoom/VideoCallRoom.js'
import Login from './components-clinic/Login.jsx'

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
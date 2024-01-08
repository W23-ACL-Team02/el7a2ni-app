import { useState } from 'react';
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Login from './components-main/Login.jsx';
import PatientsList from './components-clinic/doctor/PatientsList/PatientsList.js'
import PatientDetails from './components-clinic/doctor/PatientDetails/PatientDetails.js'
import AddPrescription from './components-clinic/doctor/addPrescription/Addprescription';
import ViewPrescriptions from './components-clinic/ViewPrescription';
import SelectedPrescriptions from './components-clinic/SelectedPrescriptions';
import VideoCallRoom from './components-clinic/shared/VideoCallRoom/VideoCallRoom.js'

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
          <Route path="/ViewPrescriptions" element={<ViewPrescriptions />} />
          <Route path="/SelectedPrescriptions" element={<SelectedPrescriptions />} />
          <Route path="/AddPrescription" element={<AddPrescription />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
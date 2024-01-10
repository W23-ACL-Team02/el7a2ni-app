import { useState } from 'react';
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import DoctorRespondFollowUp from './components-clinic/DoctorRespondFollowUp';
import FollowUp1 from './components-clinic/FollowUp1';
import FollowUp2 from './components-clinic/FollowUp2';
import PatientSearchDoctors from './components-clinic/PatientSearchDoctors';
import ViewDoctorDetails from './components-clinic/ViewDoctorDetails';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);



  return (
    <div className="App">
      <BrowserRouter>
      <Link to={'DoctorRespondFollowUp'}>Doctor Responds to Follow Up</Link>
      <br />
      <Link to={'FollowUp1'}>Patient Request Follow Up</Link>
      <br />
      <Link to={'PatientSearchDoctors'}>Patient searches the doctors</Link>


          <Routes>
          <Route path="/DoctorRespondFollowUp" element={<DoctorRespondFollowUp />} />
          <Route path="/FollowUp1" element={<FollowUp1 />} />
          <Route path="/FollowUp2" element={<FollowUp2 />} />
          <Route path="/PatientSearchDoctors" element={<PatientSearchDoctors />} />
          <Route path="/ViewDoctorDetails" element={<ViewDoctorDetails />} />
          
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
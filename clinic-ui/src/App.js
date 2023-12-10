import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

import Login from './components/Login';
import RegisterUser from './components/RegisterUser';
import Home from './components/Home';
import AddAdmin from './components/AddAdmin';
import RemoveUser from './components/RemoveUser';
import ManageDocuments from './components/ManageDocuments';
import AddTimeSlots from './components/AddTimeSlots';
import FilterAppointments from './components/FilterAppointments';
import UpcomingCompletedAppointments from './components/UpcomingCompletedAppointments';
import Logout from './components/Logout';
import HealthPackageManagement from './components/patient/healthPackageManagement/mainPage/mainPage';
import PatientHealthRecordsPage from './components/patient/healthRecords/mainPage/mainPage';
import DoctorHealthRecordsPage from './components/doctor/healthRecords/mainPage/mainPage';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
        <h2>PUBLIC</h2>
        <Link to={'login'}>Login</Link> <br/>
        <Link to={'register'}>Register</Link> <br/>
        <h2>PRIVATE</h2>
        <Link to={'home'}>Home</Link> <br/>
        <Link to={'logout'}>Logout</Link> <br/>
        <Link to={'addAdmin'}>Add Admin</Link> <br/>
        <Link to={'removeUser'}>Remove User</Link> <br/>
        <Link to={'manageDocuments'}>Manage Documents</Link> <br/>
        <Link to={'addTimeSlots'}>Add Time Slots</Link> <br/> 
        <Link to={'filterAppointments'}>Filter Appointments</Link> <br/> 
        <Link to={'appointments'}>Upcoming Completed Appointments</Link> <br/> 
        <Link to={'healthPackageManagement'}>Health Package Management</Link> <br/> 
        <Link to={'patientHealthRecords'}>Patient Health Records</Link> <br/> 
        <Link to={'doctorHealthRecords'}>Doctor Health Records</Link> <br/> 
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/home" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/addAdmin" element={<AddAdmin />} />
          <Route path="/removeUser" element={<RemoveUser />} />
          <Route path="/manageDocuments" element={<ManageDocuments />} />
          <Route path="/addTimeSlots" element={<AddTimeSlots />} />
          <Route path="/filterAppointments" element={<FilterAppointments />} />
          <Route path="/appointments" element={<UpcomingCompletedAppointments />} />
          <Route path="/healthPackageManagement" element={<HealthPackageManagement />} />
          <Route path="/patientHealthRecords" element={<PatientHealthRecordsPage />} />
          <Route path="/doctorHealthRecords" element={<DoctorHealthRecordsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
import { useState } from 'react';
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import CancelAppointmentDoctor from './pages/CancelAppointmentDoctor'; // Check if the path is correct
import CancelAppointmentPatient from './pages/CancelAppointmentPatient';

import SelectFamily from './pages/SelectFamily';
import RescheduleAppointmentPage from './pages/RescheduleAppointmentPage'
import DoctorAppointmentList from './pages/DoctorAppointmentList'
import PatientAppointmentList from './pages/PatientAppointmentList'
import ReschedulePatientPage from './pages/ReschedulePatientPage'
import RescheduleFamilyPage from './pages/RescheduleFamilyPage'
import FamilyAppointmentList from './pages/FamilyAppointmentList'
import SelectFamilyCancel from './pages/SelectFamilyCancel';
import FamilyCancelList from './pages/FamilyCancelList';
import AddAdminClinic from'./components-clinic/AddAdmin';
import AddAdminPharmacy from'./components-pharmacy/AddAdmin';
import RemoveUserPharmacy from './components-pharmacy/RemoveUser'
import RemoveUserClinic from './components-clinic/RemoveUser'
import UploadMedicineImage from './components-pharmacy/UploadMedImg';
import AddTimeSlots from './components-clinic/AddTimeSlots';
import FilterAppointments from './components-clinic/FilterAppointments';
import FilterByStatus from './components-clinic/FilterByStatus';
import UpcomingCompletedAppointments from './components-clinic/UpcomingCompletedAppointments';
function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
    
    <BrowserRouter>
        {/* <h2>PUBLIC</h2> */}
        {/* <Link to={'login'}>Login</Link> <br/>
        <Link to={'register'}>Register</Link> <br/> */}
        {/* <h2>PRIVATE</h2> */}
        {/* <Link to={'home'}>Home</Link> <br/>
        <Link to={'logout'}>Logout</Link> <br/>
        <Link to={'addAdmin'}>Add Admin</Link> <br/>
        <Link to={'removeUser'}>Remove User</Link> <br/>
        <Link to={'manageDocuments'}>Manage Documents</Link> <br/>
        <Link to={'addTimeSlots'}>Add Time Slots</Link> <br/> 
        <Link to={'filterAppointments'}>Filter Appointments</Link> <br/> 
        <Link to={'appointments'}>Upcoming Completed Appointments</Link> <br/>  */}
        {/* <Link to={'cancelPatientAppointment'}>Delete </Link> <br/>  */}
        <Routes>
          {/* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/home" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/addAdmin" element={<AddAdmin />} />
          <Route path="/removeUser" element={<RemoveUser />} />
          <Route path="/manageDocuments" element={<ManageDocuments />} />
          <Route path="/addTimeSlots" element={<AddTimeSlots />} />
          <Route path="/filterAppointments" element={<FilterAppointments />} />
          <Route path="/appointments" element={<UpcomingCompletedAppointments />} /> */}
          <Route path="/cancelPatientAppointment" element={<CancelAppointmentDoctor />} />
          
          <Route path="/cancelAppointment" element={<CancelAppointmentPatient />} />
          
          <Route path="/reschedulePatientAppointment" element={<DoctorAppointmentList />} />
          <Route path="/reschedulePatientAppointment2" element={<RescheduleAppointmentPage />} />
          
          <Route path="/rescheduleAppointment" element={<PatientAppointmentList />} />
          <Route path="/rescheduleAppointment2" element={<ReschedulePatientPage />} />

          <Route path="/rescheduleFamilyAppointment" element={< SelectFamily/>} />
          <Route path="/rescheduleFamilyAppointment2" element={<FamilyAppointmentList/>} />
          <Route path="/rescheduleFamilyAppointment3" element={<RescheduleFamilyPage/>} />

          <Route path="/cancelAppointmentForFamily" element={< SelectFamilyCancel/>} />
          <Route path="/cancelAppointmentForFamily2" element={< FamilyCancelList/>} />

          <Route path="/addAdminClinic" element={< AddAdminClinic/>} />
          <Route path="/addAdminPharmacy" element={< AddAdminPharmacy/>} />
          <Route path="/removeUserPharmacy" element={< RemoveUserPharmacy/>} />
          <Route path="/removeUserClinic" element={< RemoveUserClinic/>} />
          <Route path="/uploadMedImg" element={< UploadMedicineImage/>} />
          <Route path="/addTimeSlots" element={< AddTimeSlots/>} />
          <Route path="/filterAppointments" element={< FilterAppointments/>} />
          <Route path="/upcomingCompletedAppointments" element={< UpcomingCompletedAppointments/>} />
          <Route path="/filterAppointmentsByStatus" element={< FilterByStatus/>} />


          {/* <Route path="/cancelAppointmentForFamily" element={<CancelAppointmentFamily />} /> */}
          {/* <Route exact path="/" component={FirstPage} /> */}
          {/* <Route path="/cancelAppointmentForFamily" component={SelectFamily} /> */}




        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
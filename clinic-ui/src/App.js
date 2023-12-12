import {BrowserRouter, Route, Link, Routes} from 'react-router-dom'
import { useState } from 'react';
import './App.css';

import Login from './components/Login';
import RegisterUser from './components/RegisterUser';
import Home from './components/Home';
import HealthPackageManagement from './components/patient/healthPackageManagement/mainPage/mainPage';
import AddAdmin from './components/AddAdmin';
import RemoveUser from './components/RemoveUser';
import ManageDocuments from './components/ManageDocuments';
import AddTimeSlots from './components/AddTimeSlots';
import FilterAppointments from './components/FilterAppointments';
import UpcomingCompletedAppointments from './components/UpcomingCompletedAppointments';
import Logout from './components/Logout';
import PatientHealthRecordsPage from './components/patient/healthRecords/mainPage/mainPage';
import DoctorHealthRecordsPage from './components/doctor/healthRecords/mainPage/mainPage';
import PatientsList from './components/doctor/PatientsList/PatientsList.js';
import PatientDetails from './components/doctor/PatientDetails/PatientDetails.js';
import HealthPackagesPayment from './components/patient/HealthPackagesPayment/HealthPackagesPayment.js';
import CheckoutSuccess from './components/shared/PaymentSuccess.js';
import CheckoutFailed from './components/shared/PaymentFailed.js';
import AppointmentPayment from './components/patient/AppointmentPayment/AppointmentPayment.js';
import PendingDoctors from './components/admin/PendingDoctors.jsx';
import Contract from './components/Contract';
import PatientSearchDoctors from './components/PatientSearchDoctors';
import ViewDoctorDetails from './components/ViewDoctorDetails';
import ScheduleFollowUp from './components/ScheduleFollowUp';
import ViewPrescriptions from './pages/ViewPrescriptions';
import OTPVErification from './components/OTPVErification.jsx';
import VerifyEmail from './components/VerifyEmail.jsx';
import LinkFmailyMember from './pages/LinkFmailyMember';
import ViewFamilyMemebrs from './pages/ViewFamilyMemebrs';
import AddFamilyMembers from './pages/AddFamilyMembers'
import SelectedPrescriptions from './pages/SelectedPrescriptions';
import ChangePassword from './components/ChangePassword.jsx';
import ResetPassword from './components/ResetPassword.jsx';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
        <h2>PUBLIC</h2>
        <Link to={'login'}>Login</Link> <br/>
        <Link to={'register'}>Register</Link> <br/>
        <Link to={'VerifyEmail'}>Froget Password</Link> <br/>
        <h2>PRIVATE</h2>
        <Link to={'home'}>Home</Link> <br/>
        <Link to={'logout'}>Logout</Link> <br/>
        <Link to={'changePassword'}>ChangePassword</Link> <br/>
        <Link to={'addAdmin'}>Add Admin</Link> <br/>
        <Link to={'pendingDoctors'}>Admin Pending Doctors</Link> <br/>
        <Link to={'removeUser'}>Remove User</Link> <br/>
        <Link to={'manageDocuments'}>Manage Documents</Link> <br/>
        <Link to={'addTimeSlots'}>Add Time Slots</Link> <br/> 
        <Link to={'filterAppointments'}>Filter Appointments</Link> <br/> 
        <Link to={'appointments'}>Upcoming Completed Appointments</Link> <br/> 
        <Link to={'healthPackageManagement'}>Health Package Management</Link> <br/> 
        <Link to={'patientHealthRecords'}>Patient Health Records</Link> <br/> 
        {/* <Link to={'doctorHealthRecords'}>Doctor Health Records</Link> <br/>  */}
        <Link to={'patientsList'}>Patients List</Link> <br/> 
        {/* <Link to={'patientDetails'}>Patient Details</Link> <br/>  */}
        <Link to={'healthPackagesPayment'}>Health Packages Payment</Link> <br/> 
        <Link to={'checkoutSuccess'}>Checkout Success</Link> <br/> 
        <Link to={'checkoutFailed'}>Checkout Failed</Link> <br/> 
        <Link to={'appointmentPayment'}>Appointment Payment</Link> <br/> 
        <Link to={'searchdoctors'}>Patient Search Doctors</Link> <br/> 
        <Link to={'schedulefollowup'}>Doctor Schedules Follow Up</Link> <br/> 
        <Link to={'addFamilyMembers'}>Add Family Members</Link> <br/> 
        <Link to={'viewFamilyMembers'}>View Family Members</Link> <br/> 
        <Link to={'viewPrescriptions'}>View Prescriptions</Link> <br/>
        <Link to={'LinkFamilyMembers'}>Link familymember</Link> <br/>




        <Routes>
        {/*  */}
        <Route path="/contractpage" element={<Contract/>} />
        <Route path="/searchdoctors" element={<PatientSearchDoctors />} />
        <Route path="/viewdocdetails" element={<ViewDoctorDetails />} />
        <Route path="/schedulefollowup" element={<ScheduleFollowUp />} />
        {/*  */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/home" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/addAdmin" element={<AddAdmin />} />
          <Route path="/pendingDoctors" element={<PendingDoctors />} />
          <Route path="/removeUser" element={<RemoveUser />} />
          <Route path="/manageDocuments" element={<ManageDocuments />} />
          <Route path="/addTimeSlots" element={<AddTimeSlots />} />
          <Route path="/filterAppointments" element={<FilterAppointments />} />
          <Route path="/appointments" element={<UpcomingCompletedAppointments />} />
          <Route path="/healthPackageManagement" element={<HealthPackageManagement />} />
          <Route path="/patientHealthRecords" element={<PatientHealthRecordsPage />} />
          <Route path="/doctorHealthRecords" element={<DoctorHealthRecordsPage />} />
          <Route path="/patientsList" element={<PatientsList />} />
          <Route path="/patient-details" element={<PatientDetails />} />
          <Route path="/healthPackagesPayment" element={<HealthPackagesPayment />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/checkout-failed" element={<CheckoutFailed />} />
          <Route path="/appointmentPayment" element={<AppointmentPayment />} />
          
          <Route path='/viewFamilyMembers' element={<ViewFamilyMemebrs/>} /> 
          <Route path='/addFamilyMembers' element={<AddFamilyMembers/>} /> 
          <Route path='/viewPrescriptions' element={<ViewPrescriptions/>} />
          <Route path='prescriptions/selectedPrescription' element={<SelectedPrescriptions/>} />
          <Route path='/changePassword' element={<ChangePassword/>}/>
          <Route path='/VerifyEmail' element={<VerifyEmail/>} />
          <Route path='/OTPVerifcation' element={<OTPVErification/>} />
          <Route path='/ResetPassword' element={<ResetPassword/>} />
          <Route path='/LinkFamilyMembers' element={<LinkFmailyMember/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
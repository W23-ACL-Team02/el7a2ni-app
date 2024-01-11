import { useState } from 'react';
import React from 'react';
import './App.css';
import './css/general.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import MedicinePayment from './components-pharmacy/patient/MedicinePayment/MedicinePayment.js';
import CheckoutSuccess from './components-pharmacy/shared/PaymentSuccess.js';
import CheckoutFailed from './components-pharmacy/shared/PaymentFailed.js'; 
import Home from './components-pharmacy/Home';
import MedicineList from './components-pharmacy/pharmacist/MedicineList.jsx'; //for pharmacist only
//import MedicineListPatient from './components-pharmacy/MedicineList';
import MedicineListPharmacist from './components-pharmacy/MedicineListPharmacist.js';
import ViewCart from './components-pharmacy/ViewCart'
import Patients from './components-pharmacy/Patients';
import ViewPatient from './components-pharmacy/ViewPatient';
import Pharmacists from './components-pharmacy/Pharmacists';
import ViewPharmacist from './components-pharmacy/ViewPharmacist';
import PendingPharmacists from './components-pharmacy/PendingPharmacists';
import Orders from './components-pharmacy/Orders';
import ChooseAddress from './components-pharmacy/ChooseAddress'
import OrderDetails from './components-pharmacy/OrderDetails'
import AddAddress from './components-pharmacy/AddAddress';

import CancelAppointmentDoctor from './pages/CancelAppointmentDoctor'; // Check if the path is correct
import CancelAppointmentPatient from './pages/CancelAppointmentPatient';
import SelectFamily from './pages/SelectFamily';
import SelectFamilyCancel from './pages/SelectFamilyCancel';
//import RescheduleAppointmentPage from './pages/RescheduleAppointmentPage'
import RescheduleAppointment from './pages/RescheduleAppointment';
import DoctorAppointmentList from './pages/DoctorAppointmentList'
import PatientAppointmentList from './pages/PatientAppointmentList'
import ReschedulePatientPage from './pages/ReschedulePatientPage'
import RescheduleFamilyPage from './pages/RescheduleFamilyPage'
import FamilyAppointmentList from './pages/FamilyAppointmentList'
import FamilyCancelList from './pages/FamilyCancelList';
import AddAdminClinic from'./components-clinic/AddAdmin';
import AddAdminPharmacy from'./components-pharmacy/AddAdmin';
import RemoveUserPharmacy from './components-pharmacy/RemoveUser'
import RemoveUserClinic from './components-clinic/RemoveUser'
import AddTimeSlots from './components-clinic/AddTimeSlots';
import FilterAppointments from './components-clinic/FilterAppointments';
import FilterByStatus from './components-clinic/FilterByStatus';
import UpcomingCompletedAppointments from './components-clinic/UpcomingCompletedAppointments';
import axios from 'axios';

import Login from './components-main/Login'
import RegisterDoctor from './components-clinic/RegisterDoctor.jsx'
import RegisterPatient from './components-clinic/RegisterPatient.jsx'
import RegisterPharmacist from './components-pharmacy/RegisterPharmacist.jsx'
import Register from './components-clinic/RegisterUser.jsx'
import ChangePassword from './components-clinic/ChangePassword.jsx';
import ViewDoctorDetails from './components-clinic/ViewDoctorDetails'
import AppointmentPayment from './components-clinic/patient/AppointmentPayment/AppointmentPayment'
import PatientSearchDoctors from './components-clinic/PatientSearchDoctors'
import PatientsList from './components-clinic/doctor/PatientsList/PatientsList.js'
import PatientDetails from './components-clinic/doctor/PatientDetails/PatientDetails.js'
import AddPrescription from './components-clinic/doctor/addPrescription/Addprescription';
import ViewPrescriptions from './components-clinic/ViewPrescription';
import SelectedPrescriptions from './components-clinic/SelectedPrescriptions';
import ViewFamilyMembers from './components-clinic/patient/FamilyMembers/ViewFamilyMemebrs.jsx'
import AddFamilyMembers from './components-clinic/patient/FamilyMembers/AddFamilyMembers.jsx'
import LinkFamilyMember from './components-clinic/patient/FamilyMembers/LinkFmailyMember.jsx';
import VideoCallRoom from './components-clinic/shared/VideoCallRoom/VideoCallRoom.js'
import ViewAppointments from './components-clinic/FilterAppointments.jsx'
import VerifyEmail from './components-clinic/VerifyEmail.jsx';
import OTPVErification from './components-clinic/OTPVErification.jsx';
import ResetPassword from './components-clinic/ResetPassword.jsx'
import HealthPackagesPayment from './components-clinic/patient/HealthPackagesPayment/HealthPackagesPayment.js' 
import DoctorRespondFollowUp from './components-clinic/DoctorRespondFollowUp' 
import ScheduleFollowUp from './components-clinic/ScheduleFollowUp' 
import Contract from './components-clinic/Contract' 
import FollowUp1 from './components-clinic/FollowUp1.jsx' 
import FollowUp2 from './components-clinic/FollowUp2.jsx' 


import PatientHome from './components-main/PatientHome.jsx';
import AdminHome from './components-main/AdminHome.jsx';
import DoctorHome from './components-main/DoctorHome.jsx';
import PatientAccount from './components-main/PatientAccount.jsx'
import DoctorAccount from './components-main/DoctorAccount.jsx'
import HealthPackageManagement from './components-clinic/patient/healthPackageManagement/mainPage/mainPage.js'
import EditMedicine from './components-pharmacy/pharmacist/EditMedicine.jsx'
import AddMedicine from './components-pharmacy/pharmacist/AddMedicine.jsx'
import UploadMedicineImage from './components-pharmacy/UploadMedImg.jsx'
import EditMedicineAndView from './components-pharmacy/doctor/EditMedicineAndView.jsx';
import EditSelectedPrescriptions from './components-pharmacy/doctor/EditSelectedPrescriptions.jsx';
import DoctorHealthRecordsPage from './components-clinic/doctor/healthRecords/mainPage/mainPage.js';
import MedicineListPatient from './components-pharmacy/MedicineListPatient';
import ViewSalesReport from './components-pharmacy/ViewSalesReport';
import MedicineDet from './components-pharmacy/MedicineDet';
import Alternatives from './components-pharmacy/Alternatives';
import DoctorNavBar from './components-main/DoctorNavBar'
import PatientNavBar from './components-main/PatientNavBar'
import AdminNavBar from './components-main/AdminNavBar'
import NotificationPane from './components-main/notifications/NotificationPane.jsx'
// import PharmacistChat from './components-main/chat/PharmacistChat.jsx';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userType, setUserType] = useState('');


  return (
    <div className="App">
     
     {!loggedIn && 
      <BrowserRouter>
        <Routes> 
        <Route path="/VideoCallRoom" element={<VideoCallRoom />} /> {/* should not be here but its added to fix big */}
       <Route path="/changePassword" element={<ChangePassword/>}/>
       <Route path="/VerifyEmail" element={<VerifyEmail/>}/>
       <Route path="/OTPVerifcation" element={<OTPVErification/>}/>
       <Route path="/ResetPassword" element={<ResetPassword/>}/>
       <Route path="/Register" element={<Register />} />
       <Route path="/RegisterDoctor" element={<RegisterDoctor />} />
       <Route path="/RegisterPatient" element={<RegisterPatient />} />
       <Route path="/RegisterPharmacist" element={<RegisterPharmacist />} />
       <Route
                path="/login"
                element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} setUserType={setUserType} />}
              />
           </Routes>
    </BrowserRouter>
} 
{loggedIn && (
  <>
    <BrowserRouter>
    {userType === 'patient' && <PatientNavBar />}
    {userType === 'admin' && <AdminNavBar />}
    {userType === 'doctor' && <DoctorNavBar />}
        <Routes> 
        {userType == 'patient' && <Route path="/home" element={<PatientHome />} />}
        {userType == 'admin' &&  <Route path="/home" element={<AdminHome />} />}
        {userType == 'doctor' &&  <Route path="/home" element={<DoctorHome />} />}
        {userType == 'pharmacist' &&  <Route path="/home" element={<MedicineList />} />}
          <Route
            path="/login"
            element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} setUserType={setUserType} />}
          />
          {/* <Route path='/chat' element={<PharmacistChat userType={userType}/>}></Route> */}
          <Route path="/patientAccount" element={<PatientAccount/>}/>
          <Route path="/doctorAccount" element={<DoctorAccount/>}/>
          <Route path="/changePassword" element={<ChangePassword/>}/>
          <Route path="/viewMedicine" element={<MedicineList />} />
          <Route path="/medicineListPharmacist" element={<MedicineListPharmacist />} />
          <Route path="/medicine-payment" element={<MedicinePayment/>}/>
          <Route path="/HealthPackagesPayment" element={<HealthPackagesPayment/>}/>
          <Route path="/checkout-success" element={<CheckoutSuccess/>}/>
          <Route path="/checkout-failed" element={<CheckoutFailed/>}/>
          <Route path="/ViewCart" element={<ViewCart />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patient" element={<ViewPatient />} />
          <Route path="/pharmacists" element={<Pharmacists />} />
          <Route path="/pharmacist" element={<ViewPharmacist />} />
          <Route path="/pendingpharmacists" element={<PendingPharmacists />} />
          <Route path="/vieworders" element={<Orders />} />
          <Route path="/chooseaddress" element={<ChooseAddress />} />
          <Route path="/orderdetails" element={<OrderDetails />} />
          <Route path="/addaddress" element={<AddAddress />} />
          <Route path="/viewmedicinepatient" element={<MedicineListPatient/>} />
          <Route path="/login" loggedIn={loggedIn} element={<Login />} />
          <Route path="/home" element={<PatientHome />} />
          <Route path="/patientsList" element={<PatientsList />} />
          <Route path="/patient-details" element={<PatientDetails />} />
          <Route path="/VideoCallRoom" element={<VideoCallRoom />} />
          <Route path="/ViewPrescriptions" element={<ViewPrescriptions />} />
          <Route path="/SelectedPrescriptions" element={<SelectedPrescriptions />} />
          <Route path="/AddPrescription" element={<AddPrescription />} />
          <Route path='/doctors-list' element={<PatientSearchDoctors/>}></Route>  
          <Route path='/ViewDoctorDetails' element={<ViewDoctorDetails/>}></Route> 
          <Route path='/appointment-payment' element={<AppointmentPayment/>}></Route>
          <Route path='/healthPackages' element={<HealthPackageManagement/>}></Route>
          <Route path='/editMedicine' element={<EditMedicine/>}></Route>
          <Route path='/addMedicine' element={<AddMedicine/>}></Route>
          <Route path='/uploadMedicineImage' element={<UploadMedicineImage/>}></Route>
          <Route path='/doctorHealthRecords' element={<DoctorHealthRecordsPage/>}></Route>
          <Route path='/ViewFamilyMembers' element={<ViewFamilyMembers/>}></Route>
          <Route path='/AddFamilyMembers' element={<AddFamilyMembers/>}></Route>
          <Route path='/LinkFamilyMember' element={<LinkFamilyMember/>}></Route>
          <Route path='/DoctorRespondFollowUp' element={<DoctorRespondFollowUp/>}></Route>
          <Route path='/ScheduleFollowUp' element={<ScheduleFollowUp/>}></Route>
          <Route path='/Contract' element={<Contract/>}></Route>
          <Route path='/follow-up' element={<FollowUp1/>}></Route>
          <Route path='/FollowUp2' element={<FollowUp2/>}></Route>
          <Route path='/notifications' element={<NotificationPane/>}></Route>
          

          <Route path='/ViewAppointments' element={<ViewAppointments/>}></Route>
          <Route path='/AddTimeSlots' element={<AddTimeSlots/>}></Route>
  
          <Route path='/editMedicineAndView' element={<EditMedicineAndView/>}></Route>
          <Route path='/editSelectedPrescriptions' element={<EditSelectedPrescriptions/>}></Route>
          <Route path="/viewmedicinepatient" element={<MedicineListPatient/>} />
          <Route path="/ViewSalesReport" element={<ViewSalesReport/>}/>
          <Route path="/medicinedetails/:id" element={<MedicineDet/>}/>
          <Route path="/altMed" element={<Alternatives/>}/>
          <Route path="/cancelPatientAppointment" element={<CancelAppointmentDoctor />} />
          
          <Route path="/cancelAppointment" element={<CancelAppointmentPatient />} />
          
          <Route path="/reschedulePatientAppointment" element={<DoctorAppointmentList />} />
          <Route path="/reschedulePatientAppointment2" element={<RescheduleAppointment />} />
          
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
        </Routes>
      </BrowserRouter>
      </>
)}
          
    </div>
  );withCredentials: true
}

export default App;
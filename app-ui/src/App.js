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
import MedicineListPatient from './components-pharmacy/MedicineList';
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
import axios from 'axios';

import Login from './components-main/Login'
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
import AddTimeSlots from './components-clinic/AddTimeSlots.jsx';
import ViewAppointments from './components-clinic/FilterAppointments.jsx'
import VerifyEmail from './components-clinic/VerifyEmail.jsx';
import OTPVErification from './components-clinic/OTPVErification.jsx';
import ResetPassword from './components-clinic/ResetPassword.jsx'

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
import DoctorHealthRecordsPage from './components-clinic/doctor/healthRecords/mainPage/mainPage.js'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);



  return (
    <div className="App">
   <BrowserRouter>
        <Routes>
          <Route path="/home" element={<PatientHome />} />
          <Route path="/adminHome" element={<AdminHome />} />
          <Route path="/doctorHome" element={<DoctorHome />} />
          <Route path="/pharmacistHome" element={<MedicineList />} />
          <Route path="/patientAccount" element={<PatientAccount/>}/>
          <Route path="/doctorAccount" element={<DoctorAccount/>}/>
          <Route path="/changePassword" element={<ChangePassword/>}/>
          <Route path="/VerifyEmail" element={<VerifyEmail/>}/>
          <Route path="/OTPVErification" element={<OTPVErification/>}/>
          <Route path="/ResetPassword" element={<ResetPassword/>}/>
          <Route path="/viewMedicine" element={<MedicineList />} />
          <Route path="/medicineListPharmacist" element={<MedicineListPharmacist />} />
          <Route path="/medicine-payment" element={<MedicinePayment/>}/>
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
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<PatientHome />} />
          <Route path="/patientsList" element={<PatientsList />} />
          <Route path="/patient-details" element={<PatientDetails />} />
          <Route path="/VideoCallRoom" element={<VideoCallRoom />} />
          <Route path="/ViewPrescriptions" element={<ViewPrescriptions />} />
          <Route path="/SelectedPrescriptions" element={<SelectedPrescriptions />} />
          <Route path="/AddPrescription" element={<AddPrescription />} />
          <Route path='/doctors-list' element={<PatientSearchDoctors/>}></Route>  
          <Route path='/viewdocdetails' element={<ViewDoctorDetails/>}></Route> 
          <Route path='/appointment-payment' element={<AppointmentPayment/>}></Route>
          <Route path='/healthPackages' element={<HealthPackageManagement/>}></Route>
          <Route path='/editMedicine' element={<EditMedicine/>}></Route>
          <Route path='/addMedicine' element={<AddMedicine/>}></Route>
          <Route path='/uploadMedicineImage' element={<UploadMedicineImage/>}></Route>
          <Route path='/doctorHealthRecords' element={<DoctorHealthRecordsPage/>}></Route>
          <Route path='/ViewFamilyMembers' element={<ViewFamilyMembers/>}></Route>
          <Route path='/AddFamilyMembers' element={<AddFamilyMembers/>}></Route>
          <Route path='/LinkFamilyMember' element={<LinkFamilyMember/>}></Route>

          <Route path='/ViewAppointments' element={<ViewAppointments/>}></Route>
          <Route path='/AddTimeSlots' element={<AddTimeSlots/>}></Route>
          
          <Route path='/editMedicineAndView' element={<EditMedicineAndView/>}></Route>
          <Route path='/editSelectedPrescriptions' element={<EditSelectedPrescriptions/>}></Route>





        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
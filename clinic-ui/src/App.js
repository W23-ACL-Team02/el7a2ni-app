import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import PatientsList from './components/doctor/PatientsList/PatientsList.js';
import PatientDetails from './components/doctor/PatientDetails/PatientDetails.js';
import HealthPackagesCheckout from './components/patient/HealthPackagesCheckout/HealthPackagesCheckout.js';
import CheckoutSuccess from './components/shared/PaymentSuccess.js';
import CheckoutFailed from './components/shared/PaymentFailed.js';
import AppointmentCheckout from './components/patient/AppointmentCheckout/AppointmentCheckout.js';
import HealthPackageManagement from './components/patient/healthPackageManagement/mainPage/mainPage';
import Login from './components/Login';
import RegisterUser from './components/RegisterUser';
import Home from './components/Home';
import { useState } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterUser />} />
      <Route path="/home" element={<Home />} />
      <Route path="/patients-list" element={<PatientsList/>}/>
      <Route path="/patient-details" element={<PatientDetails/>}/>
      <Route path="/healthPackages-checkout" element={<HealthPackagesCheckout/>}/>
      <Route path="/appointment-checkout" element={<AppointmentCheckout/>}/>
      <Route path="/checkout-success" element={<CheckoutSuccess/>}/>
      <Route path="/checkout-failed" element={<CheckoutFailed/>}/>
      <Route path="/healthPackage-management" element={<HealthPackageManagement/>}/>
    </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;

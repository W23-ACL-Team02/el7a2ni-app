import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import MedicinePayment from './components/patient/MedicinePayment/MedicinePayment.js';
import CheckoutSuccess from './components/shared/PaymentSuccess.js';
import CheckoutFailed from './components/shared/PaymentFailed.js'; 
import UploadMedImg from './components/UploadMedImg';
import Login from './components/Login';
import RegisterUser from './components/RegisterUser';
import Home from './components/Home';
import AddAdmin from './components/AddAdmin';
import RemoveUser from './components/RemoveUser';
import MedicineList from './components/MedicineList';
import Logout from './components/Logout';
import Patients from './components/Patients';
import ViewPatient from './components/ViewPatient';
import Pharmacists from './components/Pharmacists';
import ViewPharmacist from './components/ViewPharmacist';
import PendingPharmacists from './components/PendingPharmacists';
import Orders from './components/Orders';
import ChooseAddress from './components/ChooseAddress'
import OrderDetails from './components/OrderDetails'
import AddAddress from './components/AddAddress'

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
        <Link to={'upload'}>Upload</Link> <br/>
        <Link to={'addAdmin'}>Add Admin</Link> <br/>
        <Link to={'removeUser'}>Remove User</Link> <br/>
        <Link to={'viewMedicine'}>View Medicine</Link> <br/>
        <Link to={'patients'}>View Patients' Information</Link> <br/>
        <Link to={'pharmacists'}>View Pharmacists' Information</Link> <br/>
        <Link to={'pendingpharmacists'}>View Pending Pharmacists' Information</Link> <br/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/home" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/upload" element={<UploadMedImg />} />
          <Route path="/addAdmin" element={<AddAdmin />} />
          <Route path="/removeUser" element={<RemoveUser />} />
          <Route path="/viewMedicine" element={<MedicineList />} />
          <Route path="/medicine-payment" element={<MedicinePayment/>}/>
          <Route path="/checkout-success" element={<CheckoutSuccess/>}/>
         <Route path="/checkout-failed" element={<CheckoutFailed/>}/>
          <Route path="/patients" element={<Patients />} />
          <Route path="/patient" element={<ViewPatient />} />
          <Route path="/pharmacists" element={<Pharmacists />} />
          <Route path="/pharmacist" element={<ViewPharmacist />} />
          <Route path="/pendingpharmacists" element={<PendingPharmacists />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
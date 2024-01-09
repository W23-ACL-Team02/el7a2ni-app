import { useState } from 'react';
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import MedicinePayment from './components-pharmacy/patient/MedicinePayment/MedicinePayment.js';
import CheckoutSuccess from './components-pharmacy/shared/PaymentSuccess.js';
import CheckoutFailed from './components-pharmacy/shared/PaymentFailed.js'; 
import Home from './components-pharmacy/Home';
import MedicineList from './components-pharmacy/MedicineListPharmacist'; //for pharmacist only
import MedicineListPatient from './components-pharmacy/MedicineList';
import ViewCart from './components-pharmacy/ViewCart'
import Patients from './components-pharmacy/Patients';
import ViewPatient from './components-pharmacy/ViewPatient';
import Pharmacists from './components-pharmacy/Pharmacists';
import ViewPharmacist from './components-pharmacy/ViewPharmacist';
import PendingPharmacists from './components-pharmacy/PendingPharmacists';
import Orders from './components-pharmacy/Orders';
import ChooseAddress from './components-pharmacy/ChooseAddress'
import OrderDetails from './components-pharmacy/OrderDetails'
import AddAddress from './components-pharmacy/AddAddress'
import axios from 'axios';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
   <BrowserRouter>
       



        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/viewMedicine" element={<MedicineList />} />
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
        </Routes>
      </BrowserRouter>
    
    </div>
  );
}

export default App;
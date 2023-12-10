import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import MedicinePayment from './components/patient/MedicinePayment/MedicinePayment.js';
import CheckoutSuccess from './components/shared/PaymentSuccess.js';
import CheckoutFailed from './components/shared/PaymentFailed.js'; 

function App() {
  return (
    <div className="App">
      <BrowserRouter>
    <Routes>
      <Route path="/medicine-payment" element={<MedicinePayment/>}/>
      <Route path="/checkout-success" element={<CheckoutSuccess/>}/>
      <Route path="/checkout-failed" element={<CheckoutFailed/>}/>
    </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;

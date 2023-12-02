import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import PatientsList from './components/doctor/PatientsList/PatientsList.js';
import PatientDetails from './components/doctor/PatientDetails/PatientDetails.js';
import HealthPackagesCheckout from './components/patient/HealthPackagesCheckout/HealthPackagesCheckout.js';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
    <Routes>
      <Route path="/patients-list" element={<PatientsList/>}/>
      <Route path="/patient-details" element={<PatientDetails/>}/>
      <Route path="/healthPackages-checkout" element={<HealthPackagesCheckout/>}/>
    </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;

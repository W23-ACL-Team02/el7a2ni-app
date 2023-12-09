import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ErrorBoundary from './components/ErrorBoundary'
import HealthPackageManagement from './components/patient/healthPackageManagement/mainPage/mainPage';
import PatientHealthRecordsPage from './components/patient/healthRecords/mainPage/mainPage';
import DoctorHealthRecordsPage from './components/doctor/healthRecords/mainPage/mainPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <ErrorBoundary>
      <DoctorHealthRecordsPage patientUsername='patient1'/>
    </ErrorBoundary>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

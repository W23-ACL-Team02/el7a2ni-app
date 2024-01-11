import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/viewcart.css';
const serverURL = process.env.REACT_APP_SERVER_URL;

const ViewSalesReport = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [medName, setMedName] = useState(''); // New state for medicine name
  const [salesReports, setSalesReports] = useState([]);
  const [error, setError] = useState('');

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleMedNameChange = (event) => {
    setMedName(event.target.value);
  };

  const handleViewSales = async () => {
    try {
      const response = await axios.get(`${serverURL}/pharmacy/private/medicine/getsalesreport`, {
        params: {
          month: selectedMonth,
        },
        withCredentials: true
      });

      setSalesReports(response.data.medicinesWithSales || []);
      setError('');
    } catch (error) {
      setError('Error fetching sales reports.');
      console.error('Error fetching sales reports:', error);
    }
  };

  const handleFilterByDate = async () => {
    try {
      //const formattedDate = selectedDate?.toISOString();
      
      const response = await axios.get(`${serverURL}/pharmacy/private/medicine/filterbydate`, {
        params: {
          dateString: selectedDate,
        },
        withCredentials: true
      });

      setSalesReports(response.data.salesReportsOnDate || []);
      setError('');
    } catch (error) {
      setError('Error fetching sales reports.');
      console.error('Error fetching sales reports:', error);
    }
  };

  const handleFilterByName = async () => {
    try {
        const response = await axios.get(`${serverURL}/pharmacy/private/medicine/filterbymedicine`, {
            params: {
              medname: medName,
            },
            withCredentials: true
          });

      setSalesReports(response.data.salesReport || []);
      setError('');
    } catch (error) {
      setError('Error fetching sales reports by name.');
      console.error('Error fetching sales reports by name:', error);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="container" id="maincontainer">
      <h1>View Sales Report</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ marginRight: '10px' }}>Select Month: </label>
        <select value={selectedMonth} onChange={handleMonthChange}>
          <option value="">Select a month</option>
          {months.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
        <button onClick={handleViewSales} id="button-id">
          View Sales
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <label style={{ marginRight: '10px' }}>Filter by Date: </label>
        <div>
          <label htmlFor="date">Date:</label>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="input-field" />
        </div>
        <button onClick={handleFilterByDate} id="button-id">
          Filter by Date
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <label style={{ marginRight: '10px' }}>Filter by Name: </label>
        <input type="text" value={medName} onChange={handleMedNameChange} />
        <button onClick={handleFilterByName} id="button-id">
          Filter by Name
        </button>
      </div>

      {error && <p>{error}</p>}

      <div>
      {salesReports.length === 0 ? (
  <p>No sales reports available for the selected month or date.</p>
) : (
  <div>
    {salesReports.map((report, index) => (
      <div key={index} className="medicine-container">
        <div className="rectangle">
          <div className="medicine-info">
            <img src={report.imageUrl} alt="Medicine" className="medicine-image" />
            <div className="details">
              <p className="name">{report.name}</p>
              {report.salesReport && report.salesReport.amount !== undefined ? (
                <>
                <p>report name: {report.salesReport.name}</p>
                  <p>Quantity: {report.salesReport.amount}</p>
                  <p>Price: {report.salesReport.price}</p>

                  <p>Date: {new Date(report.salesReport.Date).toLocaleDateString()}</p>
                </>
              ) : (
                <p>No sales report available for this medicine or missing information.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
)}

      </div>
    </div>
  );
};

export default ViewSalesReport;
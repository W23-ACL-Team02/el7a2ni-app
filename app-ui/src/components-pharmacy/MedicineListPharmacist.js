
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/medicinelistpharmacist.css';
const serverURL = process.env.REACT_APP_SERVER_URL

const MedicineListPharmacist = () => {
  const [expanded, setExpanded] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch all medicines on component mount
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
        const response = await axios.get(`${serverURL}/pharmacy/private/medicine/all`, {withCredentials: true});
      setMedicines(response.data);
      setError('');
    } catch (error) {
      setError('Error fetching medicines.');
      console.error('Error fetching medicines:', error);
    }
  };
  const handleArchive = async (medicineId) => {
    try {
      const response = await axios.put(`${serverURL}/pharmacy/private/pharmacist/medicine/archive`, {
        medicineId 
      }, {withCredentials: true});
      if (response && response.data && response.data.successes && response.data.successes.length > 0) {
        setMessage(response.data.successes[0]); // Display success message
      }
   //   console.log(response.data);
      // Optionally, you can display a success message or update the UI to reflect the change
    } catch (error) {
        if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
            setMessage(error.response.data.errors[0]); // Display error message
          }
    }
  };
  const [expandedMedicineId, setExpandedMedicineId] = useState([]);

  const toggleExpanded = (medicineId) => {
    setExpandedMedicineId(expandedMedicineId === medicineId ? null : medicineId);
  };

  const displayImage = (imageData) => {
    if (!imageData) {
      return null;
    }
    

    const imageType = typeof imageData === 'string' ? imageData.substring(5, imageData.indexOf(';')) : '';
    const imageSrc = `data:image/${imageType};base64,${imageData}`;

    // CSS styles for the image container
    const imageContainerStyle = {
      width: '80px',
      height: '80px',
      border: '1px solid #ccc',
      overflow: 'hidden',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 10px 10px 0',
    };

    // CSS styles for the image itself
    const imageStyle = {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'cover',
    };

    return (
      <div style={imageContainerStyle}>
        <img src={imageSrc} alt="Medicine" style={imageStyle} />
      </div>
    );
  };


  return (
    <div id="maincontainer">
      <h2>All Medicines</h2>
      {error && <p>{error}</p>}
      <div className="medicines-list">
        {medicines.map((medicine) => (
          <div className="medicine-container" key={medicine._id}>
          
            <div className={`rectangle ${expandedMedicineId === medicine._id ? 'expanded' : ''}`} onClick={() => toggleExpanded(medicine._id)}>
              <div className="medicine-info">
                <img src={medicine.imageUrl} alt="no image available" />
                <div className="details">
                  <p className="name">{medicine.name}</p>
               </div>
               <div className="details">
               <p> {medicine.category}</p>
               </div>
                <button id="button-id" onClick={() => handleArchive(medicine._id)}>{ medicine.archived && "Unarchive"
                  || !medicine.archived && "Archive" }</button>
              </div>
              {expandedMedicineId === medicine._id && (
                <div className="additionalContent">
                  <p>Price: {medicine.price}</p>
                  <p>Available Quantity: {medicine.quantity}</p>
                  <p>About:</p>
                  <p>{medicine.details}</p>
                </div>
              )}
            </div>
          </div>
       
        ))}
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MedicineListPharmacist;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import '../css/medcinelistpatient.css';
const serverURL = process.env.REACT_APP_SERVER_URL;

const MedicineList = () => {
  const [expandedMedicineId, setExpandedMedicineId] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [alternatives, setAlternatives] = useState([]);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [id, setID] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all medicines on component mount
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`${serverURL}/pharmacy/private/medicine/allunarchived`, {withCredentials: true});
      setMedicines(response.data);
      setError('');
    } catch (error) {
      setError('Error fetching medicines.');
      console.error('Error fetching medicines:', error);
    }
  };

  const handleAddToCart = async (medicineId) => {
    try {
      const response = await axios.post(`${serverURL}/pharmacy/private/patient/cart/addtocart`, {
        medicineId,
        quantity: 1,
      }, { withCredentials: true });

      //console.log(response.data);
      // Optionally, you can display a success message or update the UI to reflect the change
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleViewAlternatives = async (medicineId) => {
    try {
    //   const response = await axios.get(`${serverURL}/pharmacy/private/medicine/viewalternativemedicicne`, {
    //     params:{medicineId}
    //   });

    //  console.log("medicinealt,",response.data)
    console.log(medicineId)
    //  setID(medicineId);
    //  console.log("AFTERmedicinealt,",response.data)
      navigate(`/altMed?ids=${medicineId}`);
    //   const alternativesString = JSON.stringify(alternatives);

    //  window.location.href = `/altMed?alternatives=${encodeURIComponent(alternativesString)}`;
   // const alternatives = [/* your array of alternatives */];
// const alternativesString = JSON.stringify(alternatives);
// const encodedAlternatives = encodeURIComponent(alternativesString);

//      window.location.href = `/altMed?alternatives=${encodedAlternatives}`;

    //  setShowAlternatives(true);
    } catch (error) {
      console.error('Error fetching alternatives:', error);
    }
  };

  const toggleExpanded = (medicineId) => {
    setExpandedMedicineId(expandedMedicineId === medicineId ? null : medicineId);
    setShowAlternatives(false); // Close alternatives dropdown when toggling
  };

  const handleViewCart = () => {
    // Redirect to the chooseaddress page
    navigate('/ViewCart');
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
                <button className="action-button" onClick={() => handleAddToCart(medicine._id)}>
                  Add to Cart
                </button>
                <button className="action-button" onClick={() => handleViewAlternatives(medicine._id)}>
                  View Alternatives
                </button>
              </div>
              {alternatives.length > 0 && (
              <div className="medicine-containe">
                <p>Alternative Medicines:</p>
                <ul>
                  {alternatives.map((alternative) => (
                    <li key={alternative._id}>{alternative.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <button id="viewCartButton" onClick={handleViewCart}>
        View Cart
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MedicineList;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
const serverURL = process.env.REACT_APP_SERVER_URL

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch all medicines on component mount
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`${serverURL}/private/medicine/all`, {withCredentials: true});
      setMedicines(response.data); // Assuming response.data is an array of medicine objects
      setError('');
    } catch (error) {
      setError('Error fetching medicines.');
      console.error('Error fetching medicines:', error);
    }
  };


//     if (!imageData) {
//       return null; // Return null if image data is not available
//     }
  
//     const imageType = typeof imageData === 'string' ? imageData.substring(5, imageData.indexOf(';')) : '';
//     const imageSrc = `data:image/${imageType};base64,${imageData}`;
  
//     // CSS styles for the image container
//    const displayImage = (imageData) => {
//   if (!imageData) {
//     return null; // Return null if image data is not available
//   }

//   const imageType = typeof imageData === 'string' ? imageData.substring(5, imageData.indexOf(';')) : '';
//   const imageSrc = `data:image/${imageType};base64,${imageData}`;

//   // CSS styles for the image container
//   const displayImage = (imageData) => {
//     if (!imageData) {
//       return null; // Return null if image data is not available
//     }
  
//     const imageType = typeof imageData === 'string' ? imageData.substring(5, imageData.indexOf(';')) : '';
//     const imageSrc = `data:image/${imageType};base64,${imageData}`;
  
//     // CSS styles for the image container
//     const imageContainerStyle = {
//       width: '150px', // Adjust the width as needed
//       height: '150px', // Adjust the height as needed
//       border: '1px solid #ccc',
//       borderRadius: '50%', // To make the container round
//       overflow: 'hidden',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       margin: '10px',
//     };
  
//     // CSS styles for the image itself
//     const imageStyle = {
//       maxWidth: '100%', // Ensure the image doesn't exceed the container width
//       maxHeight: '100%', // Ensure the image doesn't exceed the container height
//       objectFit: 'cover', // Maintain aspect ratio and cover the container
//     };
  
//     return (
//       <div style={imageContainerStyle}>
//         <img src={imageSrc} alt="Medicine" style={imageStyle} />
//       </div>
//     );
//   };
  
const displayImage = (imageData) => {
    if (!imageData) {
      return null; // Return null if image data is not available
    }
  
    const imageType = typeof imageData === 'string' ? imageData.substring(5, imageData.indexOf(';')) : '';
    const imageSrc = `data:image/${imageType};base64,${imageData}`;
  
    // CSS styles for the image container
    const imageContainerStyle = {
      width: '80px', // Adjust the width as needed
      height: '80px', // Adjust the height as needed
      border: '1px solid #ccc',
      
      overflow: 'hidden',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 10px 10px 0', // Adjust margins for spacing between images and list items
    };
  
    // CSS styles for the image itself
    const imageStyle = {
      maxWidth: '100%', // Ensure the image doesn't exceed the container width
      maxHeight: '100%', // Ensure the image doesn't exceed the container height
      objectFit: 'cover', // Maintain aspect ratio and cover the container
    };
  
    return (
      <div style={imageContainerStyle}>
        <img src={imageSrc} alt="Medicine" style={imageStyle} />
      </div>
    );
  };
  
    

  return (
    <div>
      <h1>All Medicines</h1>
      {error && <p>{error}</p>}
      <div>
        {medicines.length === 0 ? (
          <p>No medicines available.</p>
        ) : (
          <div>
            {medicines.map(medicine => (
              <div key={medicine._id}>
                <p><strong>Name:</strong> {medicine.name}</p>
                <p><strong>Details:</strong> {medicine.details}</p>
                <p><strong>Category:</strong> {medicine.category}</p>
                <p><strong>Price:</strong> {medicine.price}</p>
                
                
                {displayImage(medicine.imageUrl)}
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineList;

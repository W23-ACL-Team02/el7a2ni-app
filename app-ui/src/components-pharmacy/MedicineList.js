
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const MedicineList = () => {
//   const [medicines, setMedicines] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     // Fetch all medicines on component mount
//     fetchMedicines();
//   }, []);

//   const fetchMedicines = async () => {
//     try {
//      // const response = await axios.get('http://localhost:3000/private/medicine/all', {withCredentials: true});
//      const response = await axios.get('http://localhost:3000/private/medicine/all');
//       setMedicines(response.data); // Assuming response.data is an array of medicine objects
//       setError('');
//     } catch (error) {
//       setError('Error fetching medicines.');
//       console.error('Error fetching medicines:', error);
//     }
//   };


// //     if (!imageData) {
// //       return null; // Return null if image data is not available
// //     }
  
// //     const imageType = typeof imageData === 'string' ? imageData.substring(5, imageData.indexOf(';')) : '';
// //     const imageSrc = `data:image/${imageType};base64,${imageData}`;
  
// //     // CSS styles for the image container
// //    const displayImage = (imageData) => {
// //   if (!imageData) {
// //     return null; // Return null if image data is not available
// //   }

// //   const imageType = typeof imageData === 'string' ? imageData.substring(5, imageData.indexOf(';')) : '';
// //   const imageSrc = `data:image/${imageType};base64,${imageData}`;

// //   // CSS styles for the image container
// //   const displayImage = (imageData) => {
// //     if (!imageData) {
// //       return null; // Return null if image data is not available
// //     }
  
// //     const imageType = typeof imageData === 'string' ? imageData.substring(5, imageData.indexOf(';')) : '';
// //     const imageSrc = `data:image/${imageType};base64,${imageData}`;
  
// //     // CSS styles for the image container
// //     const imageContainerStyle = {
// //       width: '150px', // Adjust the width as needed
// //       height: '150px', // Adjust the height as needed
// //       border: '1px solid #ccc',
// //       borderRadius: '50%', // To make the container round
// //       overflow: 'hidden',
// //       display: 'flex',
// //       alignItems: 'center',
// //       justifyContent: 'center',
// //       margin: '10px',
// //     };
  
// //     // CSS styles for the image itself
// //     const imageStyle = {
// //       maxWidth: '100%', // Ensure the image doesn't exceed the container width
// //       maxHeight: '100%', // Ensure the image doesn't exceed the container height
// //       objectFit: 'cover', // Maintain aspect ratio and cover the container
// //     };
  
// //     return (
// //       <div style={imageContainerStyle}>
// //         <img src={imageSrc} alt="Medicine" style={imageStyle} />
// //       </div>
// //     );
// //   };
  
// const displayImage = (imageData) => {
//     if (!imageData) {
//       return null; // Return null if image data is not available
//     }
  
//     const imageType = typeof imageData === 'string' ? imageData.substring(5, imageData.indexOf(';')) : '';
//     const imageSrc = `data:image/${imageType};base64,${imageData}`;
  
//     // CSS styles for the image container
//     const imageContainerStyle = {
//       width: '80px', // Adjust the width as needed
//       height: '80px', // Adjust the height as needed
//       border: '1px solid #ccc',
      
//       overflow: 'hidden',
//       display: 'inline-flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       margin: '0 10px 10px 0', // Adjust margins for spacing between images and list items
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
  
    

//   return (
//     <div>
//       <h1>All Medicines</h1>
//       {error && <p>{error}</p>}
//       <div>
//         {medicines.length === 0 ? (
//           <p>No medicines available.</p>
//         ) : (
//           <div>
//             {medicines.map(medicine => (
//               <div key={medicine._id}>
//                 <p><strong>Name:</strong> {medicine.name}</p>
//                 <p><strong>Details:</strong> {medicine.details}</p>
//                 <p><strong>Category:</strong> {medicine.category}</p>
//                 <p><strong>Price:</strong> {medicine.price}</p>
                
                
//                 {displayImage(medicine.imageUrl)}
//                 <hr />
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MedicineList;
// Assuming this component is part of your React frontend

import React, { useState, useEffect } from 'react';
import useNavigate from 'react-router-dom';;
import axios from 'axios';
const serverURL = process.env.REACT_APP_SERVER_URL

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [error, setError] = useState('');
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
        quantity: 1, // You can modify this to allow the user to input a quantity
      }, {withCredentials: true});

      console.log(response.data);
      // Optionally, you can display a success message or update the UI to reflect the change
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  const handleviewcart = () => {
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
    <div>
      <h1>All Medicines</h1>
      {error && <p>{error}</p>}
      <div>
        {medicines.length === 0 ? (
          <p>No medicines available.</p>
        ) : (
          <div>
            {medicines.map((medicine) => (
              <div key={medicine._id}>
                <p><strong>Name:</strong> {medicine.name}</p>
                <p><strong>Details:</strong> {medicine.details}</p>
                <p><strong>Category:</strong> {medicine.category}</p>
                <p><strong>Price:</strong> {medicine.price}</p>
                {displayImage(medicine.imageUrl)}
                {/* Add to Cart button */}
                <button onClick={() => handleAddToCart(medicine._id)}>Add to Cart</button>
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
      <button onClick={handleviewcart}>view cart</button>
    </div>
  );
};

export default MedicineList;



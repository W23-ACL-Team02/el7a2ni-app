// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../css/table.css';

// const serverURL = process.env.REACT_APP_SERVER_URL

// //import '../css/viewcart.css'; // Import the styles from the MedicineList page
// //import { useParams } from 'react-router-dom';




// const Alternatives = ({ match }) => {
// const [medicine, setMedicine] = useState(null);
  


//     // const [message, setMessage] = useState('');
//     // const parameters = new URLSearchParams(window.location.search);
//     // const alternatives = parameters.get('alternatives');
//     // Get the alternatives parameter from the URL
// // const urlParams = new URLSearchParams(window.location.search);
// // const alternativesString = urlParams.get('alternatives');

// // // Parse the string back into an array
// // const alternatives = JSON.parse(decodeURIComponent(alternativesString));

// // // Now 'alternatives' is your array
// // console.log(alternatives);
// const urlParams = new URLSearchParams(window.location.search);
// const alternativesString = urlParams.get('alternatives');
// const decodedAlternatives = decodeURIComponent(alternativesString);
// const alternatives = JSON.parse(decodedAlternatives);

// console.log(alternatives);

  
//     // const {id}= useParams;
//     // useEffect(() => {
//     //     const fetchData = async () => {
//     //       try {
//     //         const res = await axios.get(`${serverURL}/pharmacy/private/medicine/getmedstats`,{
//     //         params: {medicineId: medicineID}
//     //       });
//     //         setMedicines(res.data);
//     //       } catch (err) {
//     //         console.log(err);
//     //       }
//     //     };

  
//     //       const fetchData = async () => {
//     //         try {
//     //             const response = await axios.get(`${serverURL}/pharmacy/private/medicine/details`, {
//     //               params: {
//     //                 medicineId: match.params.id,
//     //               },
//     //             });
//     //             setMedicine(response.data.medicine);
//     //           } catch (error) {
//     //             console.error('Error fetching medicine details:', error);
//     //           }
//     //     };

//     //   useEffect(() => {
//     //     // Fetch all medicines on component mount
//     //     fetchData();
//     //   }, [match.params.id]);

//     //   const [expandedMedicineId, setExpandedMedicineId] = useState([]);
//     //   const toggleExpanded = (medicineId) => {
//     //     setExpandedMedicineId(expandedMedicineId === medicineId ? null : medicineId);
//     //   };   
//     // if (!medicine) {
//     //     return <p>Loading...</p>;
//     //   }
  
//       return(
//         <div>
//         {alternatives.length > 0 && (
//               <div className="medicine-containe">
//                 <p>Alternative Medicines:</p>
//                 <ul>
//                   {alternatives.map((alternative) => (
//                     <li key={alternative._id}>{alternative.name}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//         {/* Display other details */}
//       </div>
//     );
//   };
      

// export default Alternatives;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/medcinelistpatient.css'; // Assuming you have shared styles
const serverURL = process.env.REACT_APP_SERVER_URL;

const Alternatives = () => {
  const [alternatives, setAlternatives] = useState([]);
  const [id, setId] = useState('');

  useEffect(() => {
    // Fetch alternatives based on the 'id' from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const medicineId = urlParams.get('ids');

    // Update state with the 'id'
    setId(medicineId);

    // Fetch alternatives using 'id' and update state
    const fetchAlternatives = async () => {
      try {
        const response = await axios.get(`${serverURL}/pharmacy/private/medicine/viewalternativemedicicne`, {
          params: { medicineId },
          withCredentials: true
        });

        // Update state with alternatives
        console.log(response.data);
        setAlternatives(response.data.medResult);
        console.log("alt", alternatives);
      } catch (error) {
        console.error('Error fetching alternatives:', error);
      }
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
    // Call the fetchAlternatives function
    fetchAlternatives();
  }, []); // Add dependencies as needed

  return (
    <div id="maincontainer">
      <h2>Alternative Medicines</h2>
      <div className="medicines-list">
        {alternatives.map((alternative) => (
          <div className="medicine-container" key={alternative._id}>
            <div className="rectangle">
              <div className="medicine-info">
             
              <img src={alternative.imageUrl} alt="no image available" />
                <div className="details">
                  <p className="name">{alternative.name}</p>
                </div>
                <div className="details">
                  <p>{alternative.category}</p>
                  <p>{alternative.details}</p>
                  <p>{alternative.price}</p>
                  <p>{alternative.activeIngredients}</p>



                </div>
                {/* Add any other buttons or actions you need */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alternatives;

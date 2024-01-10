import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/table.css';

const serverURL = process.env.REACT_APP_SERVER_URL

//import '../css/viewcart.css'; // Import the styles from the MedicineList page
//import { useParams } from 'react-router-dom';




const MedicineDet = ({ match }) => {
    const [medicine, setMedicine] = useState(null);
  


    // const [message, setMessage] = useState('');
    const parameters = new URLSearchParams(window.location.search);
    const medicineId = parameters.get('id');
  
    // const {id}= useParams;
    // useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         const res = await axios.get(`${serverURL}/pharmacy/private/medicine/getmedstats`,{
    //         params: {medicineId: medicineID}
    //       });
    //         setMedicines(res.data);
    //       } catch (err) {
    //         console.log(err);
    //       }
    //     };

  
          const fetchData = async () => {
            try {
                const response = await axios.get(`${serverURL}/pharmacy/private/medicine/details`, {
                  params: {
                    medicineId: match.params.id,
                  },
                });
                setMedicine(response.data.medicine);
              } catch (error) {
                console.error('Error fetching medicine details:', error);
              }
        };

      useEffect(() => {
        // Fetch all medicines on component mount
        fetchData();
      }, [match.params.id]);

    //   const [expandedMedicineId, setExpandedMedicineId] = useState([]);
    //   const toggleExpanded = (medicineId) => {
    //     setExpandedMedicineId(expandedMedicineId === medicineId ? null : medicineId);
    //   };   
    if (!medicine) {
        return <p>Loading...</p>;
      }
  
      return(
        <div>
        <h2>{medicine.name}</h2>
        <p>Category: {medicine.category}</p>
        {/* Display other details */}
      </div>
    );
  };
      

export default MedicineDet;
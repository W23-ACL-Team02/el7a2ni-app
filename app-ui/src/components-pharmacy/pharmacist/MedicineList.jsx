import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import PharmacistNavBar from '../../components-main/PharmacistNavBar';
import '../../css/medicineList.css'
//const { useLocation } = require("react-router-dom")
const serverURL = process.env.REACT_APP_SERVER_URL

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicine, setFilteredMedicines] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch all medicines on component mount
    fetchMedicines('');
  }, []);

  const fetchMedicines = async (search) => {
    try {
      const response = await axios.get('http://localhost:3000/pharmacy/private/medicine/find', {params: {searchKey: search}, withCredentials: true});
      setMedicines(response.data.medicine); // Assuming response.data is an array of medicine objects
       console.log(response.data.medicine)
      setFilteredMedicines(response.data.medicine);
      const cats = response.data.categories // Assuming response.data is an array of medicine objects
      cats.unshift('All')
      setCategories(cats); // Assuming response.data is an array of medicine objects
    } catch (error) {
      setError('Error fetching medicines.');
      console.error('Error fetching medicines:', error);
    }
  };
  
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
  
  const filterMedicine = (event) =>{
    console.log('changed selecttino to ' + event.target.value)
    setSelectedCategory(event.target.value)
    if (event.target.value != 'All'){
      const filtered = medicines.filter((medicine) => medicine.category == event.target.value);
      setFilteredMedicines(filtered);
    }
    else{
      setFilteredMedicines(medicines);
    }
  }

  const edit = (event) => {
    // console.log(event)
    const data = {medicineId: event.target.value}
    // console.log('sending you to the edit...')
    // console.log(data)
    navigate( "/editMedicine", {state: { ...data }}); // new line
  }; 
  const handleKeyChange = (event) => {
    // console.log('changed search key to ' + event.target.value)
    fetchMedicines(event.target.value);
  };
  const handleArchive = async (medicineId) => {
    console.log('inside archive')
    try {
      const response = await axios.put(`${serverURL}/pharmacy/private/pharmacist/medicine/archive`, {
        medicineId: medicineId 
      }, {withCredentials: true});
      if (response && response.data && response.data.successes && response.data.successes.length > 0) {
        setMessage(response.data.successes[0]); // Display success message
      }
      console.log(response.data);
      // Optionally, you can display a success message or update the UI to reflect the change
    } catch (error) {
      console.log(error)
        if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
          setMessage(error.response.data.errors[0]); // Display error message
        }
    }
  };

  return (
    <div>
      <PharmacistNavBar />
      <p style={{fontSize: 30}}>All Medicines</p>
      {error && <p>{error}</p>}
      <div className='medicineList'>
        <input type="text" id="searchKey" onChange={handleKeyChange} />
        <select value={selectedCategory} onChange={filterMedicine}>
            {categories.map(category => (
              <option value={category}>{category}</option>
            ))}
            </select>
        {medicines.length === 0 ? (
          <p>No medicines available.</p>
        ) : (
          <div>
            <table>
              <th></th>
              <th>Name</th>
              <th>Details</th>
              <th>Active Ingredients</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              {filteredMedicine.map(medicine => (
                <tr key={medicine._id}>
                  <td>{displayImage(medicine.imageUrl)}</td>
                  <td>{medicine.name}</td>
                  <td>{medicine.details}</td>
                  <td>{medicine.activeIngredients}</td>
                  <td>{medicine.category}</td>
                  <td>{medicine.quantity}</td>
                  <td>{medicine.price}</td>
                  <td><button value={medicine._id} onClick={edit}>Edit</button></td>
                  <td><button value={medicine._id} onClick={() => {handleArchive(medicine._id)}}>Archive</button></td>
                </tr>
              ))}
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineList;

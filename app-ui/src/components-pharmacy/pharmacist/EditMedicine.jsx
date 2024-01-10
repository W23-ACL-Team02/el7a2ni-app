import React, { useEffect, useState } from 'react';
import axios from 'axios';
const { useLocation } = require("react-router-dom")
import Card from '../../components-main/Card'
import { useNavigate } from "react-router-dom";
import PharmacistNavBar from '../../components-main/PharmacistNavBar';

const serverURL = process.env.REACT_APP_SERVER_URL


const EditMedicine = () => {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [activeIngredients, setActiveIngredients] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [dosage, setDosage] = useState('');
  const [message, setMessage] = useState('');
  let { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicine();
    // console.log(state.medicineId)
  }, [])

  const fetchMedicine = async () => {
    try{
      const response = await axios.post(`${serverURL}/pharmacy/private/medicine/view`, {medicineId: state.medicineId}, {withCredentials: true});
      console.log(response)
      const medicine = response.data.medicine 
      setName(medicine.name);
      setDetails(medicine.details);
      setActiveIngredients(medicine.activeIngredients);
      setCategory(medicine.category);
      setQuantity(medicine.quantity);
      setPrice(medicine.price);
      setDosage(medicine.dosage);
    } catch (error){
      setMessage('Couldn\'t fetch original data')
    }
  }

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleDetailsChange = (event) => {
    setDetails(event.target.value);
  };
  const handleActiveIngredientsChange = (event) => {
    setActiveIngredients(event.target.value);
  };
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };
  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };
  const handleDosageChange = (event) => {
    setDosage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(`${serverURL}/pharmacy/private/pharmacist/medicine/edit`, {
        id: state.medicineId,
        name: name,
        details: details,
        activeIngredients: activeIngredients,
        category: category,
        quantity: quantity,
        price: price,
        dosage: dosage,
      }, {withCredentials: true});

      setMessage('Medicine edited successfully'); // Display success message
    } catch (error) {
      setMessage("Error in editing Medicine"); // Display error message
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
      <PharmacistNavBar />
      <button style={{height: 60, width: 120, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5, fontSize: 20}} onClick={() => {navigate(-1)}}>
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H6M12 5l-7 7 7 7"/></svg>      Back</button>
      <Card height={450} width={400}>
      <h2>Edit Medicine</h2>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: 20}}>
            <label htmlFor="name" style={{marginRight: 10, fontSize: 20}}>Name</label>
            <input type="text" id="name" value={name} onChange={handleNameChange} required />
          </div>
          <div style={{marginBottom: 20}}>
            <label htmlFor="details" style={{marginRight: 10, fontSize: 20}}>Details</label>
            <input type="text" id="details" value={details} onChange={handleDetailsChange} required />
          </div>
          <div style={{marginBottom: 20}}>
            <label htmlFor="activeIngredients" style={{marginRight: 10, fontSize: 20}}>Active Ingredients</label>
            <input type="text" id="activeIngredients" value={activeIngredients} onChange={handleActiveIngredientsChange} required />
          </div>
          <div style={{marginBottom: 20}}>
            <label htmlFor="category" style={{marginRight: 10, fontSize: 20}}>Category</label>
            <input type="text" id="category" value={category} onChange={handleCategoryChange} required />
          </div>
          <div style={{marginBottom: 20}}>
            <label htmlFor="quantity" style={{marginRight: 10, fontSize: 20}}>Quantity</label>
            <input type="number" id="quantity" min={1} value={quantity} onChange={handleQuantityChange} required />
          </div>
          <div style={{marginBottom: 20}}>
            <label htmlFor="price" style={{marginRight: 10, fontSize: 20}}>Price</label>
            <input type="price" id="price" value={price} onChange={handlePriceChange} required />
          </div>
          <div style={{marginBottom: 20}}>
            <label htmlFor="dosage" style={{marginRight: 10, fontSize: 20}}>Dosage</label>
            <input type="dosage" id="dosage" value={dosage} onChange={handleDosageChange} required />
          </div>
          <button style={{height: 60, width: 160, fontSize: 20}} onClick={() => {navigate('/uploadMedicineImage')}}>Edit Image</button>
          <button type="submit" style={{height: 60, width: 160, fontSize: 20}}>Edit Medicine</button>
        </form>
      </Card>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EditMedicine;

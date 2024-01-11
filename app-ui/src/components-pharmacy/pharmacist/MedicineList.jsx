import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import PharmacistNavBar from '../../components-main/PharmacistNavBar';
import ViewSalesReport from '../ViewSalesReport';
import '../../css/medicineList.css'
import Wallet from '../home/Wallet.jsx';
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
  const [user,setUser]= useState({});

  useEffect(() => {
    // Fetch all medicines on component mount
    fetchMedicines('');
    getCurrUser();
  }, []);

  const fetchMedicines = async (search) => {
    try {
      const response = await axios.get( serverURL + '/pharmacy/private/medicine/find', {params: {searchKey: search}, withCredentials: true});
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
  const getCurrUser =  async () => {
		const response = await axios.get(`${serverURL}/clinic/private/user/getSelfUser`, {withCredentials:true})
		const user = response.data;
		setUser(user);
		return user;  
	}	;
  
  const displayImage = (imageData) => {
    console.log('inside display image')
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
    // console.log('inside archive')
    setError()
    try {
      const response = await axios.put(`${serverURL}/pharmacy/private/pharmacist/medicine/archive`, {
        medicineId: medicineId 
      }, {withCredentials: true});
      if (response && response.data && response.data.successes && response.data.successes.length > 0) {
        setError(response.data.successes[0]); // Display success message
      }
      const filtered = filteredMedicine
      filtered.map(medicine => {
        if (medicineId == medicine._id){
          medicine.archived = !medicine.archived
        }
      })
      setFilteredMedicines(filtered)
      // console.log(response.data);
      // Optionally, you can display a success message or update the UI to reflect the change
    } catch (error) {
      console.log(error)
        if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
          setError(error.response.data.errors[0]); // Display error message
        }
    }
  };
  const handleRemove = async (medicineId) => {
    // console.log('inside archive')
    setError()
    try {
      const response = await axios.delete(`${serverURL}/pharmacy/private/pharmacist/medicine/remove`, 
      {withCredentials: true, data: {medicineId: medicineId }});
      if (response && response.data && response.data.successes && response.data.successes.length > 0) {
        setError(response.data.successes[0]); // Display success message
      }
      const filtered = filteredMedicine
      for (let index = 0; index < filtered.length; index++) {
        if (filtered[index]._id == medicineId){
          filtered.splice(index, 1)
          break;
        }
      }
      setFilteredMedicines(filtered)
      // console.log(response.data);
      // Optionally, you can display a success message or update the UI to reflect the change
    } catch (error) {
      console.log(error)
        if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
          setError(error.response.data.errors[0]); // Display error message
        }
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
             <div className='container-main'>
            <p>Balance: {user.wallet}</p>
        </div>
      <p style={{fontSize: 30}}>All Medicines</p>
      {error && <p>{error}</p>}
      <button style={{height: 70, width: 220, marginBottom: 20, borderRadius: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5, fontSize: 24}} onClick={() => {navigate('/addMedicine')}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Add Medicine</button>
      <div className='medicineList' style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{marginBottom:20}}>
          <input type="text" style={{marginRight: 15}} id="searchKey" placeholder='Search' onChange={handleKeyChange} />
          <select value={selectedCategory} onChange={filterMedicine}>
              {categories.map(category => (
                <option value={category}>{category}</option>
              ))}
          </select>
        </div>
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
              <th>Dosage</th>
              <th>Sales</th>
              <th></th>
              <th></th>
              <th></th>
              {filteredMedicine.map(medicine => 
                <tr key={medicine._id}>
                  <td style={{height: 80}}><img src={medicine.imageUrl} alt='no image' style={{height: 80}} /></td>
                  <td>{medicine.name}</td>
                  <td>{medicine.details}</td>
                  <td>{medicine.activeIngredients}</td>
                  <td>{medicine.category}</td>
                  <td>{medicine.quantity}</td>
                  <td>{medicine.price}</td>
                  <td>{medicine.dosage}</td>
                  <td>{medicine.sales}</td>
                  <td><button value={medicine._id} onClick={edit} style={{width: 140, display: 'flex', fontSize: 20}}>
                  <svg style={{marginRight: 7}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
                    Edit</button></td>
                  {medicine.archived && <td><button value={medicine._id} style={{width: 140}} onClick={() => handleArchive(medicine._id)}>
                  <svg style={{marginRight: 7}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="9" y1="14" x2="15" y2="14"></line></svg>
                  Unarchive</button></td>}
                  {!medicine.archived && <td><button value={medicine._id} style={{width: 140}} onClick={() => handleArchive(medicine._id)}>
                    <svg style={{marginRight: 7}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
                  Archive</button></td>}
                  <td><button value={medicine._id} style={{width: 140}} onClick={() => handleRemove(medicine._id)}>
                  <svg style={{marginRight: 7}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  Remove</button></td>
                </tr>
              )}
              
            </table>
          </div>
        )}
       <ViewSalesReport/>
      </div>
    </div>
  );
};

export default MedicineList;

import {React,useEffect,useState} from 'react'
import axios from 'axios';
export default function LinkFmailyMember() { 
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [relationship,setRelationship]=useState('');
    const [message, setMessage] = useState('');



    
    const handleChangePhoneNumber = (event) => {
        setPhoneNumber(event.target.value)
        };
    const handleChangeEmail = (event) => {
        setEmail(event.target.value)
        };
    const handleChangeRelationship = (event) => {
      setRelationship(event.target.value)
      };

        
  const handlesubmit= async (event) =>{
    if (!phoneNumber && !email) {
      setMessage('Please fill in at least one of the fields (Phone Number or Email)');
      return;
    }

    event.preventDefault();
    try {
      const response=axios.post("http://localhost:3000/clinic/private/family/linkFamilyMember",{phoneNumber,email,relationship},{withCredentials: true})
      .then((res)=>{
        setMessage('Linked family member successfully!');
      })      
    }catch(error)
    {
      setMessage('Failed to link family member.');
        console.log(error)
    }

  }
  return (
    <div>
        <h2>Link Family Member</h2>
        <form onSubmit={handlesubmit}>
            <div>
                <label for="phoneNumber">Phone Number:</label>
                <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="Enter phone number"  onChange={handleChangePhoneNumber}></input>
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="Enter email"  onChange={handleChangeEmail}></input>
            </div>
            <div>
          <label>Relationship:</label>
          <select id="relationship" name="relationship" onChange={handleChangeRelationship} required>
            <option value="">Select Relationship</option>
            <option value="Wife">Wife</option>
            <option value="Husband">Husband</option>
            <option value="Children">Children</option>
          </select>
        </div>
            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
        {message && <p>{message}</p>}
    </div>
  )
}
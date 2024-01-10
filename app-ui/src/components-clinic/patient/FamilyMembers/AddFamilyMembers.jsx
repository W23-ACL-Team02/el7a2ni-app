import React, { useState } from 'react'
import axios from 'axios';


export default function AddFamilyMembers() {
  
    const[familymember,setFamilyMember]=useState({
        name:'',
        nationalID: '',
        age:'',
        gender:'Male',
        relationship:'Children'

    });
    const [verificationMessage, setVerificationMessage] = useState('');


  const handlesubmit= async (event) =>{
    event.preventDefault();
    try {
      axios.post("http://localhost:3000/clinic/private/family/addFamily",familymember,{withCredentials: true})
      .then((res)=>{
        setVerificationMessage('add family member successfully')
      })
    }catch(error)
    {
        console.log(error)
    }

  }
    const handleChange = (event) => {
    // Update the data in state as the user types
    setFamilyMember({
      ...familymember,
      [event.target.name]: event.target.value,

    });
  };
  
    return (
    <div>
 
    <h2> Add family member </h2> 
    <form onSubmit={handlesubmit}>
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input className="form-control" type="text" name="name" placeholder="name" required autoFocus onChange={handleChange} />
            </div>
            <div className="form-group">
                <label htmlFor="nationalID">NationalID</label>
                <input className="form-control" type="text" name="nationalID" placeholder="nationalID" required onChange={handleChange}  />
            </div>
            <div className="form-group">
                <label htmlFor="age">Age</label>
                <input className="form-control" type="text" name="age" placeholder="age" required onChange={handleChange} />
            </div>
            <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select className="form-control" name="gender" required  onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="relationship">Relationship</label>
                <select className="form-control" name="relationship" required onChange={handleChange}>
                    <option value="Wife">Wife</option>
                    <option value="Husband">Husband</option>
                    <option value="Children">Children</option>
                </select>
            </div>
            <button className="btn btn-primary" type="submit">Submit</button>
            <div>
            {verificationMessage && <p>{verificationMessage}</p>}
            </div>
        </form>

        
    </div>
  )
}
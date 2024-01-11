import React, { useState } from 'react'
import PasswordValidityBox from '../components-pharmacy/PasswordValidityBox'
import { validatePassword } from '../functions/validatePassword'
 

const baseURL = process.env.REACT_APP_SERVER_URL

export default function RegisterDoctor() {
    const [password, setPassword] = useState("")

    return (
        // TODO Change backend call
        <form className='container-main' action={`${baseURL}/clinic/public/user/register/doctor`} method="POST" encType="multipart/form-data">
            <div class="form-group"><label for="username">Username</label><input class="form-control" type="text" name="username" placeholder="Username" required="required" autofocus="autofocus" /></div>
            <div class="form-group"><label for="name">Name</label><input class="form-control" type="text" name="name" placeholder="Name" required="required" /></div>
            <div class="form-group"><label for="email">Email</label><input class="form-control" type="email" name="email" placeholder="Email" required="required" /></div>
            <div class="form-group"><label for="password">Password</label><input class="form-control" type="password" name="password" required="required" onChange={e => setPassword(e.target.value)} /></div>
            <PasswordValidityBox password={password}></PasswordValidityBox>
            <div class="form-group"><label for="dateOfBirth">Date of Birth</label><input class="form-control" type="date" name="dateOfBirth" placeholder="Date of Birth" required="required" /></div>

            <div class="form-group">
            <label for="speciality">Speciality</label>
            <select class="form-control" name="speciality" required="required" autofocus="autofocus">
            <option value="">Select Speciality</option>
            <option value="General Practitioner">General Practitioner</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Surgeon">Surgeon</option>
            <option value="Ophthalmologist">Ophthalmologist</option>
            <option value="Optometrist">Optometrist</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Family Medicine">Family Medicine</option>
            <option value="Radiologist">Radiologist</option>
            <option value="Psychiatrist">Psychiatrist</option>
            <option value="Anesthesiologist">Anesthesiologist</option>


    
            </select>
            </div>

            <div class="form-group"><label for="payRate">Hourly Rate</label><input class="form-control" type="number" id="payRate" name="payRate" placeholder="0.00" step=".01" required="required" /></div>
            <div class="form-group"><label for="affiliation">Affiliation</label><input class="form-control" type="text" id="affiliation" name="affiliation" placeholder="Hospital Name" required="required" /></div>
            <p>Educational Background</p>
            <div class="form-group"><label for="education_name">Name</label><input class="form-control" type="text" id="education_name" name="education_name" placeholder="University's Name" required="required" /></div>
            <div class="form-group"><label for="education_end">Graduated on</label><input class="form-control" type="month" id="education_end" name="education_end" placeholder="End" required="required" /></div>
           
            <div className="form-group">
            <label for="idDocument">ID Document</label>
            <input type="file" name="idDocument" id="idDocument" required />
            </div>
            <div className="form-group">
            <label for="medicalDegree">Medical Degree</label>
            <input type="file" name="medicalDegree" id="medicalDegree" required />
            </div>
            <div className="form-group">
            <label for="medicalLicense">Medical License</label>
            <input type="file" name="medicalLicense" id="medicalLicense" required />
            </div>

            <button class="btn btn-primary" type="submit" disabled={!validatePassword(password)}>Register</button>
        </form>
    )
}

// import React, { useState } from 'react';
// import PasswordValidityBox from './PasswordValidityBox';
// import { validatePassword } from '../functions/validatePassword';
// import axios from 'axios';

// const baseURL = `http://localhost:4000`;

// export default function RegisterPharmacist() {
//     const [formData, setFormData] = useState({
//         username: '',
//         name: '',
//         email: '',
//         password: '',
//         dateOfBirth: '',
//         payRate: '',
//         affiliation: '',
//         educationName: '',
//         educationEnd: '',
//         idDocument: null,
//         pharmacyDegree: null,
//         workingLicense: null,
//     });

//     const handleInputChange = (event) => {
//         const { name, value } = event.target;
//         setFormData({ ...formData, [name]: value });
//     };

    // const handleFileChange = (event) => {
    //     const file = event.target.files[0];
    //     const name = event.target.name;

    //     setFormData({ ...formData, [name]: file });
    // };

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         const formDataToSend = new FormData();
//         Object.entries(formData).forEach(([key, value]) => {
//             formDataToSend.append(key, value);
//         });

//         try {
//             const response = await axios.post(`${baseURL}/public/user/register/pharmacist`, formDataToSend, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             console.log('Pharmacist registration successful:', response.data);
//         } catch (error) {
//             console.error('Error registering pharmacist:', error);
//         }
//     };

//     return (
//         <form className="container-main" onSubmit={handleSubmit}>
//             <input type="text" name="username" onChange={handleInputChange} />
//             <input type="text" name="name" onChange={handleInputChange} />
//             <input type="email" name="email" onChange={handleInputChange} />
//             <input type="password" name="password" onChange={handleInputChange} />
//             <input type="date" name="dateOfBirth" onChange={handleInputChange} />
//             <input type="number" name="payRate" onChange={handleInputChange} />
//             <input type="text" name="affiliation" onChange={handleInputChange} />
//             <input type="text" name="educationName" onChange={handleInputChange} />
//             <input type="month" name="educationEnd" onChange={handleInputChange} />

//             <input type="file" name="idDocument" onChange={handleFileChange} />
//             <input type="file" name="pharmacyDegree" onChange={handleFileChange} />
//             <input type="file" name="workingLicense" onChange={handleFileChange} />

//             <PasswordValidityBox password={formData.password} />

//             <button className="btn btn-primary" type="submit" disabled={!validatePassword(formData.password)}>
//                 Register
//             </button>
//         </form>
//     );
// }



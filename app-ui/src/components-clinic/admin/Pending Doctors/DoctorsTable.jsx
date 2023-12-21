import { useState } from "react";
import SingleDoctorView from './SingleDoctorView'

export default function DoctorsTable({doctors}) {
    const [selectedDoctor, setSelectedDoctor] = useState(false);
    const [doctor, setDoctor] = useState(null);

    const selectDoctor = (index = 0) => {
        setDoctor(doctors[index]);
        setSelectedDoctor(true);
    }

    if (doctors.length === 0) {
        return (
            <h2>No pending doctors.</h2>
        )
    }


    return(
        <div className='Container'>
          <div className='mt-3'> 
          <h3>Pending Doctors</h3>
          <table className='table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {
                doctors.map((doctor, index) => {
                //   return <tr key={doctor._id} >
                //     <td>{doctor.name}</td>
                //     <td>{doctor.email}</td>
                //     <td><button type="button" onClick={selectDoctor()}>View</button></td>
                //   </tr>
                    return <SingleDoctorView doctor={doctor} />
                })
              }
            </tbody>
          </table>
          </div>
          {/* View to accept a doctor */}
          {/* { selectedDoctor && <SingleDoctorView doctor={doctor} /> } */}
        </div>
    )    
}
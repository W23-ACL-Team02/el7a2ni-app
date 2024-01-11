import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const baseURL = process.env.REACT_APP_SERVER_URL;

const SelectFamily = ({ history }) => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [linkedfamilyMembers, setlinkedFamilyMembers] = useState([]);
  const [createdfamilyMembers, setcreatedFamilyMembers] = useState([]);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const response = await axios.get(`${baseURL}/clinic/private/family/viewfamilymember`); // Replace with your endpoint
        const { createdFamilyMembers, linkedFamilyMembers } = response.data;

        // Merge both types of family members into a single array
        //const allFamilyMembers = [...createdFamilyMembers, ...linkedFamilyMembers];
        console.log(createdFamilyMembers);
        console.log(linkedFamilyMembers);
        setlinkedFamilyMembers(linkedFamilyMembers);
        setcreatedFamilyMembers(createdFamilyMembers);
      } catch (error) {
        console.error('Error fetching family members:', error);
      }
    };

    fetchFamilyMembers();
  }, []);

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
   // history.push(/cancelFamily2/${selectedMember});
   // window.location.href=/rescheduleFamilyAppointment2?appointmentId=${appointmentId}
//    window.location.href=/rescheduleFamilyAppointment2?member=${member}
  };

//   const handleNext = () => {
//     if (selectedMember) {
//       history.push(/cancelFamily2/${selectedMember});
//     } else {
//       // Show a message or alert to select a member
//     }
//   };

  return (
    // <div>
    //   <h1>Select a Family Member</h1>
    //   <ul>
    //     {familyMembers.createdFamilyMembers && familyMembers.createdFamilyMembers.map((member) => (
    //       <li key={member._id} onClick={() => handleMemberSelect(member._id)}>
    //         {member.name} - Created
    //       </li>
    //     ))}
    //     {familyMembers.linkedFamilyMembers && familyMembers.linkedFamilyMembers.map((member) => (
    //       <li key={member.familyMemberData._id} onClick={() => handleMemberSelect(member.familyMemberData._id)}>
    //         {member.familyMemberData.name} - Linked ({member.relationship})
    //       </li>
    //     ))}
    //   </ul>
    //   <button onClick={handleNext}>Next</button>
    // </div>
    <div className="maincontainer">
      <h2>Select a Family Member</h2>

      <div className="family-members">
        <h3>Created Family Members</h3>
        {createdfamilyMembers.map(member => (
          <div key={member.id}>
            <button onClick={() => handleMemberSelect(member.name)}>
              {member.name}
            </button>
            <br /> {/* Line space between buttons */}
          </div>
        ))}
      </div>

      <div className="linked-family-members">
        <h3>Linked Family Members</h3>
        {linkedfamilyMembers.map(member => (
          <div key={member.id}>
            <button onClick={() => handleMemberSelect(member.familyMemberData.username)}>
              {member.familyMemberData.username}
            </button>
            <br /> {/* Line space between buttons */}
          </div>
        ))}
      </div>
      {/* <p>{message}</p> */}
    </div>
  );
};

export default SelectFamily;
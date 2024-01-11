import classes from './FamilyBar.module.css';
import SubscriptionComparisonCard from '../SubscriptionComparisonCard/SubscriptionComparisonCard.js';
import axios from 'axios';
const { useState, useEffect } = require("react");

export default function FamilyBar({members, cancelFunction}) {
  const [selectedMember, setSelectedMember] = useState('')
  const [selectedMemberEndDate, setSelectedMemberEndDate] = useState('')
  const [selectedMemberPackageName, setSelectedMemberPackageName] = useState('')
  const [selectedMemberPackageColor, setSelectedMemberPackageColor] = useState('')
  const [selectedMemberStatus, setSelectedMemberStatus] = useState('')
  if (members == null || members == undefined)
    return (null)

  function getDateFromIso(date){
    const realDate = new Date(date)
    return `${realDate.getDate()}/${realDate.getMonth()+1}/${realDate.getFullYear()}`
  }

  function Status() {
    // console.log('package color: ' + packageColor)
    return (
        <div className={classes.status}>
            <strong>Subscribed to <span style={{color: selectedMemberPackageColor}}>{selectedMemberPackageName}</span></strong>
        </div>
    );
  }

  function RenewalDate() {
    return (
      <div className={classes.renewalDate}>Ends on {getDateFromIso(selectedMemberEndDate)}</div>
    );
  }

  function Title({text}) {
    return (
        <div className={classes.title}>
            {text}
        </div>
    );
  }

  function handleMemberSelection(event) {
    changeSelectedMember(event.target.value);
  }
  function changeSelectedMember(name){
    var member;
    members.map((mem) => {
      if (name == mem.name){
        member = mem
      }
    })
    setSelectedMember(member.name)
    setSelectedMemberEndDate(member.endDate)
    setSelectedMemberPackageName(member.packageName)
    setSelectedMemberPackageColor(member.packageColor)
    setSelectedMemberStatus(member.status)
    console.log('changed selected to ')
    console.log(member)
  }

  function FamilyMemberSelector() {
    if (members.length != 0 && selectedMember == ''){
      changeSelectedMember(members[0].name)
    }
    return (
      <select className={classes.selector} value={selectedMember} onChange={handleMemberSelection}>
        {members.map((member) => (
          <option value={member.name} key={member._id}>{member.name}</option>
        ))}
        </select>
    );
  }
  function handleCancel() {
    cancelFunction(selectedMember)
    console.log('members after cancel')
    console.log(members)
    if (members.length > 1){
      console.log('set selected to ' + members[1].name)
      changeSelectedMember(members[1].name)
    }
  }
  


  return (
    <div className={classes.bar}>
      <div className={classes.row}>
        <Title text='Family'/>
        <FamilyMemberSelector />
      </div>
      <div className={classes.row}>
        <Status status={selectedMemberStatus} packageColor={selectedMemberPackageColor} packageName={selectedMemberPackageName}/>
        <RenewalDate renewalDate={selectedMemberEndDate}/>
        <button className={classes.commonButton} onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
}


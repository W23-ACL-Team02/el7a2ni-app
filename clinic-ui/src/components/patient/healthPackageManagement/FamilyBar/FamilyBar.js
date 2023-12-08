import classes from './FamilyBar.module.css';
import SubscriptionComparisonCard from '../SubscriptionComparisonCard/SubscriptionComparisonCard.js';
import axios from 'axios';
const { useState, useEffect } = require("react");

export default function ManagementBar(props) {
  // console.log(props)
  const details = props.details
  const linked = props.family?.linked
  const created = props.family?.created
    
  if (details == null || details == undefined)
    return (null)
  if (linked == null || linked == undefined)
    return (null)
  if (created == null || created == undefined)
    return (null)

  function getDateFromIso(date){
    const realDate = new Date(date)
    return `${realDate.getDate()}/${realDate.getMonth()}/${realDate.getFullYear()}`
  }

  function Status({status}) {
    return (
        <div className={classes.status}>
            Status: <strong>{status}</strong>
        </div>
    );
  }
  function RenewalDate({renewalDate}) {
    return (
      <div className={classes.renewalDate}>Ends on {getDateFromIso(renewalDate)}</div>
    );
  }
  function Title({text}) {
    return (
        <div className={classes.title}>
            {text}
        </div>
    );
  }
  function FamilyMemberSelector() {
    return (
      <select>
        {linked.map((member) => (
          <option key={member.id}>{member.name}</option>
        ))}
        {created.map((member) => (
          <option key={member.id}>{member.name}</option>
        ))}
        </select>
    );
  }

  return (
    <div className={classes.bar}>
      <div className={classes.row}>
        <Title text='Family'/>
        <FamilyMemberSelector />
      </div>
      <div className={classes.row}>
        <Status status={details?.subscription?.status} />
        <RenewalDate renewalDate={details?.subscription?.endDate}/>
        <button className={classes.commonButton}>Cancel</button>
      </div>
    </div>
  );
}


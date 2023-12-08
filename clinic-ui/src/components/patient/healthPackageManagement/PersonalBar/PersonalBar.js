import classes from './PersonalBar.module.css';
import SubscriptionComparisonCard from '../SubscriptionComparisonCard/SubscriptionComparisonCard.js';
import axios from 'axios';
const { useState, useEffect } = require("react");

export default function ManagementBar(props) {
  

    
  // console.log(props)
  const details = props.details
    
  if (details == null || details == undefined)
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

  return (
    <div className={classes.bar}>
      <div className={classes.row}>
        <Title text='Personal'/>
      </div>
      <div className={classes.row}>
        <Status status={details?.subscription?.status} />
        <RenewalDate renewalDate={details?.subscription?.endDate}/>
        <button className={classes.commonButton}>Cancel</button>
      </div>
    </div>
  );
}


import classes from './ManagementBar.module.css';
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

  function Status({status, renewalDate}) {
    return (
        <div className={classes.status}>
            Status: <strong>{status}</strong>
            <div className={classes.renewalDate} hidden={status !== 'Cancelled' && status !== 'Unsubscribed' ? '' : 'hidden'}>Next Renewal: {getDateFromIso(renewalDate)}</div>
        </div>
    );
  }

  return (
    <div className={classes.bar}>
      <Status status={details?.subscription?.status} renewalDate={details?.subscription?.endDate} />
    </div>
  );
}


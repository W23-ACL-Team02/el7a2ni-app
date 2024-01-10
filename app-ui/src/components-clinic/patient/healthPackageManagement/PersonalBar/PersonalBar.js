import classes from './PersonalBar.module.css';
import SubscriptionComparisonCard from '../SubscriptionComparisonCard/SubscriptionComparisonCard.js';
import axios from 'axios';
import '../CommonComponents.css'
const { useState, useEffect, useRef } = require("react");

export default function PersonalBar({details, cancelFunction}) {
    // console.log(props)    
    const [cancelSub, setCancelSub] = useState(false);
  if (details == null || details == undefined)
    return (null)

  function getDateFromIso(date){
    // console.log(date.substring(0,10))
    const realDate = new Date(date)
    return `${realDate.getDate()}/${realDate.getMonth()+1}/${realDate.getFullYear()}`
  }

  function Status({status, packageName, packageColor}) {
    // console.log('package color: ' + packageColor)
    return (
        <div className={classes.status}>
            <strong>{status}{status == 'Subscribed' && <span><span> to </span><span style={{color: packageColor}}>{packageName}</span></span>}</strong>
        </div>
    );
  }
  function RenewalDate({renewalDate}) {
    if (!renewalDate){
      return (null)
    }
    return (
      <div className={classes.renewalDate}>Ends on {getDateFromIso(renewalDate)}</div>
    );
  }
  function CancelButton({subscription}) {
    if (!subscription){
      return (null)
    }
    return (
      <button className='commonButton' onClick={() => {cancelFunction()}}>Cancel</button>
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
        <Status status={details?.subscription?.status} packageName={details?.package?.name} packageColor={details?.package?.color}/>
        {details?.subscription?.status != 'Unsubscribed' && <RenewalDate renewalDate={details?.subscription?.endDate}/>}
        {(details?.subscription?.status != 'Unsubscribed') && <CancelButton subscription={details?.subscription} />}
      </div>
    </div>
  );
}


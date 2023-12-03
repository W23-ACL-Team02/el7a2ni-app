import classes from './subscriptionComparisonCard.module.css';

export default function SubscriptionComparisonCard ({name, price, discountSession, discountMedicine, discountFamily, color}) {
  
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  price = numberWithCommas(price);

  return (
    <div className={classes.frame}>
      <div className={classes.name} style={{color: color}}>{name}</div>
      <div className={classes.price}>{price} EGP
          <div className={classes.peryear}>/year</div>
      </div>
      <div style={{justifyContent: 'space-evenly'}}>
        <div className={classes.textBlock}>
          {discountSession * 100}% Off<br></br>
          Appointments
        </div>
        <div className={classes.line}></div>
        <div className={classes.textBlock}>
        {discountMedicine * 100}% Off<br></br>
          Medicine
        </div>
        <div className={classes.line}></div>
        <div className={classes.textBlock}>
        {discountFamily * 100}% Off<br></br>
          Family Member Subscriptions
        </div>
      </div>
      <button className={classes.subscribeButton} style={{backgroundColor: color}}>Subscribe</button>
    </div>
  );
}

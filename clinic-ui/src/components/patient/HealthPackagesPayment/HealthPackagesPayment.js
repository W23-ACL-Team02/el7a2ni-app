import axios from 'axios';
import styles from './HealthPackagesPayment.module.css'
import StripeCheckout from 'react-stripe-checkout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard } from '@fortawesome/free-solid-svg-icons'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
const { useState , useEffect, useRef } = require("react");
const serverURL = process.env.REACT_APP_SERVER_URL;
const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

const HealthPackageCheckout = () => {
    const [currUser, setCurrUser] = useState([null])
    const [selectedHealthPackages,setselectedHealthPackages] = useState([]);
    const [SelectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const cardRef = useRef(null);
    const navigate = useNavigate()
    // let { state } = useLocation();
    // const healthPackages = state.healthPackages
    const selectedPackages = [{packageID: "655ffa2f8066173be32d7373", patientID: "6547b96606043724533eedbf", patientType: "self"},
{packageID: "655ffa2f8066173be32d7373", patientID: "6548f2293575471b2b1d3547", patientType: "created"}]

    const getCurrUser =  async () => {
        await axios.get(`${serverURL}/private/user/getSelfUser`, {withCredentials:true}).then(
        (res) => { 
           const currUser = res.data
           setCurrUser(currUser)
           console.log(currUser)
       }); 
    }

    const getAllSelectedHealthPackages =  async () => {
        await axios.get(`${serverURL}/private/payment/getAllSelectedHealthPackages`, {
            params: { packages: selectedPackages}, 
            withCredentials:true})
            .then(
            (res) => { 
                const selectedHealthPackages = res.data
                setselectedHealthPackages(selectedHealthPackages)
                console.log(selectedHealthPackages)
            }); 
    }

    const payByCard = async token => {
        try {
            const response = await axios({
                url: `${serverURL}/private/payment/payByCard`,
                method: 'post',
                data: {
                    amount: Math.ceil(selectedHealthPackages?.totalPrice * 100),
                    token,
                },
                withCredentials:true
            });
            if(response.data === "success"){
                console.log('your payment was successful')
                //call subscribe to health packages Api
                subscribeToHealthPackages()
                navigate("/checkout-success")
            }else{
                console.log('your payment was unsuccessful')
                //navigate to failed page
                navigate("/checkout-failed")
            }
        } catch (error) {
        console.log(error);
        }
    }

    const payByWallet = async () => {
        await axios.post(`${serverURL}/private/payment/payByWallet`, {totalPrice : selectedHealthPackages?.totalPrice}, {withCredentials:true})
            .then((res) =>{
                console.log(res)
                if(res.data === "success"){
                    console.log('your payment was successful')
                    //call subscribe to health packages Api
                    //subscribeToHealthPackages()
                    navigate("/checkout-success")
                }else{
                    console.log('your payment was unsuccessful')
                    //navigate to failed page
                    navigate("/checkout-failed")
                }
            }
        )
    }

    const onSelectedPaymentChange = (event) => {
        setSelectedPaymentMethod(event.target.value)
    }

    const handlePayment = (event) =>{
        event.preventDefault();
        console.log(SelectedPaymentMethod)  
            if(SelectedPaymentMethod === "wallet"){
                payByWallet()
            }else if(SelectedPaymentMethod === "card"){
                cardRef.current.click()
            }  
    }

    const subscribeToHealthPackages = async () => {
        const currUserSelectedPackage = selectedPackages.filter(p => p.patientID === currUser._id)[0] || null
        if(currUserSelectedPackage) {
            subscribeForCurrUser(currUserSelectedPackage.packageID) 
        }
    }

    const subscribeForCurrUser = async (packageID) => {
        await axios.post(`${serverURL}/private/patient/healthPackage/subscribe`, {
            data: {packageId : packageID},
            withCredentials:true})
            .then((res) => {
                if(res){
                    console.log("current user subscribed");
                }
            })
    }

    useEffect(() =>{ 
        getCurrUser();
        getAllSelectedHealthPackages();   
     }, []);
   

    return (
        <div className={styles.checkout_container}>
            <div className={styles.items}>
                {selectedHealthPackages?.totalPackages?.map((p) => (
                        <div>
                            <div>
                                <p>{p.packageName} subscription for {p.patientName}</p>
                                {p.appliedDiscount === 0
                                    ? <p>price : {p.packagePrice}</p> 
                                    : <p>price : {p.packagePrice}, applied discount: {p.appliedDiscount *100} %</p>
                                }    
                            </div>
                        </div>
                ))}
                <p>Total Price: {selectedHealthPackages?.totalPrice}</p>
            </div>
            <div className={styles.paymentOptions}>
                <div className={styles.title}>
                    <h4>Select a <span style={{color: "#6064b6",}} >Payment</span> method</h4>
                </div>
                
                <form onSubmit={handlePayment}>
                    <input type="radio" 
                           name="payment" 
                           id="card" 
                           value="card" 
                           onChange={onSelectedPaymentChange}
                           className={styles.cardRadio}/>
                    <input type="radio" 
                           name="payment" 
                           id="wallet" 
                           value="wallet" 
                           onChange={onSelectedPaymentChange}
                           className={styles.walletRadio}/>
               
                    <div className={styles.category}>
                        <label htmlFor="card" className={styles.cardMethod}>
                            <div className={styles.iconName}>
                                    <div className={styles.iconContainer}>
                                        <FontAwesomeIcon icon={faCreditCard} />
                                    </div>
                                    <span className={styles.name}>Credit or Debit Card</span>
                            </div>
                            <span className={styles.check}><FontAwesomeIcon icon={faCircleCheck} style={{color: "#6064b6",}} /></span>        
                        </label>
                        <label htmlFor="wallet" className={styles.walletMethod}>
                            <div className={styles.iconName}>
                                    <div className={styles.iconContainer}>
                                        <FontAwesomeIcon icon={faWallet} />
                                    </div>
                                    <span className={styles.name}>Wallet</span>
                            </div>
                            <span className={styles.check}><FontAwesomeIcon icon={faCircleCheck} style={{color: "#6064b6",}} /></span>        
                        </label>
                    </div>
                    <button type='submit' className={styles.payBtn}>Pay</button>
                </form>
                
                <StripeCheckout 
                    style={{ display: 'none' }}
                    stripeKey = {publishableKey}
                    label = "Credit and Debit Card"
                    name = "Pay With Credit Card"
                    billingAddress
                    amount = {Math.ceil(selectedHealthPackages?.totalPrice * 100)}
                    description = {`Your total is ${selectedHealthPackages?.totalPrice}`}
                    token = {payByCard}
                >
                    <button ref = {cardRef} style={{ display: 'none' }}>
                    </button>
                </StripeCheckout>
                            
            </div>
        </div>
    )
}

export default HealthPackageCheckout;
import axios from 'axios';
import styles from './HealthPackagesCheckout.module.css'
import StripeCheckout from 'react-stripe-checkout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard } from '@fortawesome/free-solid-svg-icons'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
const { useState } = require("react");
const { useEffect } = require("react");
const serverURL = process.env.REACT_APP_SERVER_URL;
const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

const HealthPackageCheckout = () => {
    const [currUser, setCurrUser] = useState(null)
    const [selectedHealthPackages,setselectedHealthPackages] = useState([]);
    const navigate = useNavigate()
    // let { state } = useLocation();
    // const healthPackages = state.healthPackages
    const selectedPackages = [{packageID: "655ffa2f8066173be32d7373", patientID: "6547b96606043724533eedbf"}]

    const getCurrUser =  async () => {
        await axios.get(`${serverURL}/private/user/getCurrUser`).then(
        (res) => { 
           const currUser = res.data
           setCurrUser(currUser)
           console.log(currUser)
       }); 
    }

    const getAllSelectedHealthPackages =  async () => {
        await axios.get(`${serverURL}/private/payment/getAllSelectedHealthPackages`, {params: { packages: selectedPackages }}).then(
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
                    amount: selectedHealthPackages?.totalPrice,
                    token,
                },
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
        await axios.post(`${serverURL}/private/payment/payByWallet`, {totalPrice : selectedHealthPackages?.totalPrice}).then(
            (res) =>{
                console.log(res)
                if(res.data === "success"){
                    console.log('your payment was successful')
                    //call subscribe to health packages Api
                    subscribeToHealthPackages()
                    navigate("/checkout-success")
                }else{
                    console.log('your payment was unsuccessful')
                    //navigate to failed page
                    navigate("/checkout-failed")
                }
            }
        )
    }

    const subscribeToHealthPackages = async () => {
        const currUserSelectedPackage = selectedPackages.filter(p => p.patientID === currUser._id)[0] || null
        if(currUserSelectedPackage) {
            subscribeForCurrUser(currUserSelectedPackage.packageID) 
        }
        
       const restOfPackages = currUserSelectedPackage ? selectedPackages.filter(p => p.patientID != currUser._id) : selectedPackages
       if(restOfPackages.length != 0){
            subscribeForFamily(restOfPackages) 
       }
    }

    const subscribeForCurrUser = async (packageID) => {
        await axios.post(`${serverURL}/private/patient/healthPackage/subscribe`, {packageId : packageID}).then((res) => {
            if(res){
                console.log("current user subscribed");
            }
        })
    }

    const subscribeForFamily = async (packages) => {
        
    }

    useEffect(() =>{ 
        getCurrUser();
        getAllSelectedHealthPackages();   
     }, []);
   

    return (
        <div className={styles.checkout_container}>
            <div className={styles.health_package_checkout_items}>
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
                <h2>Choose a Payment Method</h2>
                <StripeCheckout 
                    stripeKey = {publishableKey}
                    label = "Credit and Debit Card"
                    name = "Pay With Credit Card"
                    billingAddress
                    amount = {selectedHealthPackages?.totalPrice * 100}
                    description = {`Your total is ${selectedHealthPackages?.totalPrice}`}
                    token = {payByCard}
                >
                    <button className={styles.paymentOptionBtn}>
                        Credit and Debit Card
                        <FontAwesomeIcon className={styles.icon} icon={faCreditCard} />
                    </button>
                </StripeCheckout>
                <button className={styles.paymentOptionBtn} onClick={payByWallet}>
                    Wallet
                    <FontAwesomeIcon className={styles.icon} icon={faWallet} />
                </button>
            </div>
        </div>
    )
}

export default HealthPackageCheckout;
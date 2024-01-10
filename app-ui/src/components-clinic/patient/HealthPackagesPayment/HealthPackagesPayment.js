import axios from 'axios';
import styles from './HealthPackagesPayment.module.css'
import StripeCheckout from 'react-stripe-checkout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard } from '@fortawesome/free-solid-svg-icons'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useLocation } from "react-router-dom";
const { useState , useEffect, useRef } = require("react");
const serverURL = process.env.REACT_APP_SERVER_URL;
const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

const HealthPackageCheckout = () => {
    const [currUser, setCurrUser] = useState({})
    const [requiredPackages, setRequiredPackages] = useState([]);
    const [selectedHealthPackages,setselectedHealthPackages] = useState([]);
    const [SelectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [member, setMember] = useState({})
    const cardRef = useRef(null);
    const navigate = useNavigate()
    let { state } = useLocation();
    

    useEffect(() =>{ 
        const fetchData = async () =>{
            const user = await getCurrUser(); 
            setMember(state) 
            const packages = getRequiredPackages(user, state);
            getAllSelectedHealthPackages(packages);
        }

        fetchData();
     }, []);


     const getCurrUser =  async () => {
        const response = await axios.get(`${serverURL}/clinic/private/user/getSelfUser`, {withCredentials:true})
        const user = response.data;
        setCurrUser(user);
        return user;     
    }

    const getRequiredPackages = (user, member) => {
        if(member.selectedMember == "Myself"){
            const requiredPackages = [{packageID: member.packageId, patientID: user._id, patientType: member.type}]
            setRequiredPackages(requiredPackages)
            return requiredPackages;
        }else{
            const requiredPackages = [{packageID: member.packageId, patientID: member.patient._id,  patientType: member.type}]
            setRequiredPackages(requiredPackages)
            return requiredPackages;
        } 
    }
    //const selectedPackages = [{packageID: "655ffa2f8066173be32d7373", patientID: "6547b96606043724533eedbf", patientType: "self"},
//{packageID: "655ffa2f8066173be32d7373", patientID: "6548f2293575471b2b1d3547", patientType: "created"}]

    const getAllSelectedHealthPackages =  async (packages) => {
        await axios.get(`${serverURL}/clinic/private/payment/getAllSelectedHealthPackages`, {
            params: { packages: packages}, 
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
                url: `${serverURL}/clinic/private/payment/payByCard`,
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
                subscribe(requiredPackages[0].packageID);
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
        await axios.post(`${serverURL}/clinic/private/payment/payByWallet`, {totalPrice : selectedHealthPackages?.totalPrice}, {withCredentials:true})
            .then((res) =>{
                console.log(res)
                if(res.data === "success"){
                    console.log('your payment was successful')
                    //call subscribe to health packages Api
                    subscribe(requiredPackages[0].packageID);
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

    const subscribe = async (packageId) => {
        console.log('subscribing to package: ' + packageId)
        if (member.selectedMember == 'Myself'){
          await axios.post(`${serverURL}/clinic/private/patient/healthPackage/subscribe`, {packageId: packageId}, {withCredentials: true}).then(
          (res) => {
              console.log("subscribed for myself")
          }).catch((error) => {
            console.log(error);
          });
        }
        else{
            await axios.post(`${serverURL}/clinic/private/family/subscribe`, {packageId: packageId, memberId: member.packageID, memberType: member.type}, {withCredentials: true}).then(
            (res) => {
              console.log(res.data)
              // console.log('unsubbed array after subbing')
              // console.log(unsubscribedFamilyMembers)
            }).catch((error) => {
              console.log(error);
            });
          }
        }

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
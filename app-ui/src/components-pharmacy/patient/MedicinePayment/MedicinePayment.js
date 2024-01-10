import axios from 'axios';
import styles from './MedicinePayment.module.css'
import StripeCheckout from 'react-stripe-checkout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard, faWallet, faMoneyBill, faCircleCheck} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
const { useState, useEffect, useRef } = require("react");
const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const serverURL = process.env.REACT_APP_SERVER_URL

const MedicineCheckout = () => { 
    const [cart, setCart] = useState([]);
    const [selectedMedicine,setselectedMedicine] = useState([]);
    const [SelectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const cardRef = useRef(null);
    const navigate = useNavigate()

    useEffect(() =>{
        const fetchData = async () => {
            await getAllSelectedMedicine(); 
        } 
        
        fetchData();
     }, []);

    const getAllSelectedMedicine =  async () => {
    try{
        const response = await axios.get(`${serverURL}/pharmacy/private/payment/getAllSelectedMedicine`, {withCredentials:true}) 
        const selectedMedicine = response.data
        setselectedMedicine(selectedMedicine)
        console.log(selectedMedicine)
    }catch(error){
       console.log(error) 
    }        
}

    const payByCard = async token => {
        try {
            const response = await axios({
                url: `${serverURL}/pharmacy/private/payment/payByCard`,
                method: 'post',
                data: {
                    amount: selectedMedicine?.totalPrice *100,
                    token,
                },
                withCredentials:true
            });
            if(response.data === "success"){
                console.log('your payment was successful')
                placeOrder({COD:false})
                sendEmailwithReceipt()
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
        await axios.post(`${serverURL}/pharmacy/private/payment/payByWallet`, {totalPrice : selectedMedicine?.totalPrice}, {withCredentials:true}).then(
            (res) =>{
                console.log(res)
                if(res.data === "success"){
                    console.log('your payment was successful')
                    placeOrder({COD: false})
                    sendEmailwithReceipt()
                    navigate("/checkout-success")
                }else{
                    console.log('your payment was unsuccessful')
                    //navigate to failed page
                    navigate("/checkout-failed")
                }
            }
        )
    }

    const payByCash = async() => {
        placeOrder({COD: true})
        sendEmailwithReceipt()
        navigate("/checkout-success")
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
            }else if(SelectedPaymentMethod === "cash"){
                payByCash()
            }  
    }

    const placeOrder = async(COD) => {
        try{
            const response = await axios({
                method:'post',
                url:`${serverURL}/pharmacy/private/patient/order/placeOrder`,
                withCredentials:true,
                data: COD
            })
        }catch(error){
            console.log(error)
        }
    }

    const sendEmailwithReceipt = async() => {
        const subject = "order receipt"
        let html = `<table>
                        <thead>
                            <tr>
                                <td>item</td>
                                <td>quantity</td>
                                <td>price</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                         `
        
        selectedMedicine.totalMedicine.forEach(m => {
            html += `<td>${m.medicineName}</td>
                     <td>${m.medicineQuantity}</td> 
                     <td>${m.medicinePrice}</td>`
        })   
        
        html += `</tr>
                </tbody>  
                </table>
                <p>Total Price:${selectedMedicine.totalPrice}`
        
        try{
            await axios({
                method:'post',
                url:`${serverURL}/pharmacy/private/email/sendEmail`, 
                data: {subject, html},
                withCredentials: true })
                .then((res) => {
                console.log(res)
            })
        }catch(error){
            console.log(error)
        }        
    }
   

    return (
        <div className={styles.checkout_container}>
            <div className={styles.items}>
                {selectedMedicine?.totalMedicine?.map((m) => (
                        <div>
                            <div>
                                <p>item: {m.medicineName}, quantity: {m.medicineQuantity}, price: {m.medicinePrice}, applied discount: {m.appliedDiscount*100}%</p>
                            </div>
                        </div>
                ))}
                <p>Total Price: {selectedMedicine?.totalPrice}</p>
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
                    <input type="radio" 
                           name="payment" 
                           id="cash" 
                           value="cash" 
                           onChange={onSelectedPaymentChange}
                           className={styles.cashRadio}/>       
               
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
                        <label htmlFor="cash" className={styles.cashMethod}>
                            <div className={styles.iconName}>
                                    <div className={styles.iconContainer}>
                                        <FontAwesomeIcon icon={faMoneyBill} />
                                    </div>
                                    <span className={styles.name}>Cash</span>
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
                    amount = {Math.ceil(selectedMedicine?.totalPrice * 100)}
                    description = {`Your total is ${selectedMedicine?.totalPrice}`}
                    token = {payByCard}
                >
                    <button ref = {cardRef} style={{ display: 'none' }}>
                    </button>
                </StripeCheckout>
                            
            </div>
        </div>
    )
}

export default MedicineCheckout;
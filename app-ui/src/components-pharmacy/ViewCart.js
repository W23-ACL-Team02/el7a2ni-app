// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// //import '../css/orders.css';
// //show order details aka cart + address + total
// //button redirects to payment page



// function ViewCart(){
//   const [cart, setCart]= useState([]);
//  // const [address, setAddress]= useState([]);
//   const [total, setTotal]= useState([]);
//   //const params = new URLSearchParams(window.location.search);
//   //const id = params.get('id');
//   // const {id}= useParams;


//   useEffect(() => {
//     // const chooseAddress = async () => {
//     //     try{
//     //        await axios.post(`http://localhost:3000/private/patient/order/chooseaddress/${id}`);
//     //     }
//     //     catch(err){
//     //         console.log(err)
//     //     }
//     // }
//     const Viewcart = async () => {
//         try {
//             const res1 = await axios.get('http://localhost:3000/private/patient/cart/viewcart');
//             setCart(res1.data);
//            // console.log("address is set to ")
//             console.log(cart);
//           } catch (err) {
//             console.log(err);
//           }
//     }
//     const getTotal = async () => {
//         try {
//             const res = await axios.get('http://localhost:3000/private/patient/cart/gettotal');
//             setTotal(res.data);
//           } catch (err) {
//             console.log(err);
//           }
//     }
//     const Changequantity = async () => {
//       try {
//         const res2 = await axios.get('http://localhost:3000/private/patient/cart/editquantity'); //monika
//         setCart(res2.data);
//         console.log("cart is set to ")
//         console.log(cart);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     Viewcart()

    
//     // fetchData();
//    //getAddress();
//     Changequantity();
//     getTotal();

//   }, []);

//   return(

//     <div class="container" id="wrapper">
//     <h1>Your Order</h1>
//         {
//                 cart.map((item,index) => {
//                   return <div key={index}>
//         <div >
//          <h3>Medicine Names and Quantities: </h3>
//          </div>
//          <div >
//             <h4>{item.medicine.name}</h4>
//             <h4>{item.quantity}</h4>

//             </div>
//       </div>
                  
//  })
// }


//       <div >
//         <h3>Order Total:</h3>
//       </div>
//       <div >
//         {
//            <h3>{total}</h3>
//         }
//       </div>

//     </div>
//   );

// }


// export default ViewCart;
import axios from 'axios';
import React, { useEffect, useState } from 'react';
const serverURL = process.env.REACT_APP_SERVER_URL 

function ViewCart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState([]);
  const [quantity, setQuantity] = useState(1); // Initialize quantity state

  const handleDelete = async (medicineId, quantity) => {
    try {
      const res = await axios.post(`${serverURL}/pharmacy/private/patient/cart/deletefromcart`, {
        medicineId,
        quantity,
      }, {withCredentials: true});

      // Refresh the cart and total after deleting the item
      Viewcart();
      getTotal();

      console.log(res.data);
    } catch (error) {
      console.error(error.response.data.err);
    }
  };

  const handleChangeQuantity = async (medicineId, newQuantity) => {
    try {
      const res = await axios.put(`${serverURL}/pharmacy/private/patient/cart/editquantity`, {
        medicineId,
        quantity: newQuantity,
      }, {withCredentials: true});

      // Refresh the cart and total after changing the quantity
      Viewcart();
      getTotal();

      console.log(res.data);
    } catch (error) {
      console.error(error.response.data.error);
    }
  };

  const Viewcart = async () => {
    try {
      const res1 = await axios.get(`${serverURL}/pharmacy/private/patient/cart/viewcart`, {withCredentials: true});
      setCart(res1.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getTotal = async () => {
    try {
      const res = await axios.get(`${serverURL}/pharmacy/private/patient/order/gettotal`, {withCredentials: true});
      setTotal(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    Viewcart();
    getTotal();
  }, []);

  const handleCheckout = () => {
    // Redirect to the chooseaddress page
    window.location.href = '/chooseaddress';
  };

  return (
    <div className="container" id="cartwrapper">
      <h1>Your Order</h1>
      {cart.map((item, index) => (
        <div key={index}>
          <div>
            <h3>Medicine Names and Quantities: </h3>
          </div>
          <div>
            <h4>{item.medicine.name}</h4>
            <h4>{item.quantity}</h4>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <button onClick={() => handleChangeQuantity(item.medicine._id, quantity)}>
              Change Quantity
            </button>
            <button onClick={() => handleDelete(item.medicine._id, item.quantity)}>
              Delete
            </button>
          </div>
        </div>
      ))}
      <div>
        <h3>Order Total:</h3>
      </div>
      <div>
        <h3>{total}</h3>
      </div>
      {cart.length > 0 ? (
        <button onClick={handleCheckout}>Checkout</button>
      ) : (
        <p>Your cart is empty</p>
      )}
    </div>
  );
}

export default ViewCart;



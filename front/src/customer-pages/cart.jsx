import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./navbar";
import { loadStripe } from "@stripe/stripe-js";

function Cart(){
    const apiUrl = import.meta.env.VITE_SERVER_URL;
    const [products, setProducts] = useState([]);
    useEffect(()=>{
        const getProducts = async ()=>{
            const response = await axios.get(`${apiUrl}/customer/getcartproducts`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setProducts(response.data.products)
        }
        getProducts();
    },[])
    const makePayment = async ()=>{
        const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC;
        const stripe = await loadStripe(stripePublicKey);
        try {
            const response = await axios.post(`${apiUrl}/customer/payment`,{},{
                headers : {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            const sessionId = response.data.id || response.data.sessionId;

            if (!sessionId) {
              throw new Error("Session ID not found in response");
            }
            await stripe.redirectToCheckout({
              sessionId: sessionId,
            });
        } catch (error) {
            
        }
    }
    return(
        <>
            <Navbar />
            <div className="d-flex justify-content-center flex-wrap">
                {products.map((product, index) => (
                <div className="card m-2" style={{ width: "18rem" }} key={index}>
                    <img src={product.Product.photo} className="card-img-top" alt={product.Name} />
                    <div className="card-body">
                    <h5 className="card-title text-center">{product.Product.Name}</h5>
                    <p className="card-text text-center">{product.Product.Amount} {product.Product.Currency}</p>
                    </div>
                </div>
                ))}
            </div>
            <h4 className="text-center w-100 mb-3">
                Total: {products.reduce((acc, item) => acc + parseFloat(item.Product.Amount), 0).toFixed(2)} {products[0]?.Product.Currency || ''}
            </h4>
            <div className="text-center">
                <button className="btn btn-primary" onClick={makePayment}>Check Out</button>
            </div>
        </>
    )
}
export default Cart;
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./navbar";

function Profile() {
    const [orders, setOrders] = useState({ count: 0, rows: [] });
    const apiUrl = import.meta.env.VITE_SERVER_URL;
    const [file , setFile] = useState();
    useEffect(() => {
        const getCounts = async () => {
            try {
                const response = await axios.get(`${apiUrl}/customer/counts`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setOrders(response.data.ordersCount);
            } catch (error) {
                console.error(error);
            }
        };
        getCounts();
    }, []);

    const totalAmount = orders.rows.reduce((acc, order) => acc + parseFloat(order.totalAmount), 0).toFixed(2);
    const handleUpload = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("photo", file); 
        try {
            await axios.put(`${apiUrl}/customer/updateuserphoto`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            window.location.reload();
        } catch (error) {
            alert("Upload failed.");
        }
    }
    const cancelOrder = async (orderId)=>{
        try {
            await axios.delete(`${apiUrl}/customer/cancelorder/${orderId}`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            window.location.reload();
        } catch (error) {
            
        }
    }
    return (
        <>
            <Navbar />
            <div className="d-flex justify-content-center mb-5">
                <form>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" className="form-label">Update Photo</label>
                        <input type="file" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => setFile(e.target.files[0])}/>
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={handleUpload}>Submit</button>
                </form>
            </div>
            <div className="d-flex justify-content-center gap-5 mb-5">
                <div className="shadow p-3 fs-3 rounded">Total Amount: {totalAmount} JOD</div>
                <div className="shadow p-3 fs-3 rounded">Total Orders: {orders.count}</div>
            </div>
            <div>
                <h3 className="text-center mb-5">Purchase History</h3>
                <div className="d-flex justify-content-center">
                    <table className="table w-25">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">totalAmount</th>
                            <th scope="col">Order Date</th>
                            <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders.rows.map((order,index)=>(
                                    <tr>
                                        <td>{index+1}</td>
                                        <td>{order.totalAmount}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td><button className="btn btn-danger" onClick={()=>cancelOrder(order.ID)}>Cancel Order</button></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Profile;

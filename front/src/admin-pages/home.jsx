import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./navbar";
function AdminHome(){
    const [counts,setCounts] = useState(' ');
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_SERVER_URL;
    useEffect(()=>{
        const getCounts = async ()=>{
            try {
                const response = await axios.get(`${apiUrl}/admin/counts`,{
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                    }
                })
                setCounts(response.data)
            } catch (error) {
                if(error.response.status === 403){
                    navigate('/admin/login')
                }
            }
        }
        getCounts();
    },[])
    return(
        <>
            <NavBar />
            <div className="d-flex justify-content-center gap-5">
                <div className="p-5 shadow fs-2">
                    Total Customers: {counts.totalCustomers}
                </div>
                <div className="p-5 shadow fs-2">
                    Total Products: {counts.totalPropducts}
                </div>
                <div className="p-5 shadow fs-2">
                    Total Orders: {counts.totalOrders}
                </div>
            </div>
        </>
    )
}
export default AdminHome;
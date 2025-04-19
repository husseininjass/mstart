import NavBar from "./navbar";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Orders(){
    const apiUrl = import.meta.env.VITE_SERVER_URL;
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    useEffect(()=>{
        const getAllCustomers = async ()=>{
            try {
                const response = await axios.get(`${apiUrl}/admin/getallorders`, {
                    params: {
                      page,
                      search,
                    },
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                setOrders(response.data.orders);
            } catch (error) {
                if(error.response.status === 403){
                    navigate('/admin/login');
                }
            }
        }   
        getAllCustomers();
    },[page,search])
    const handlePageChange = (event, value) => {
        setPage(value);
    };
    const handleSearch = (e) => {
        e.preventDefault(); 
        const searchValue = e.target.elements.search.value.trim();
        setSearch(searchValue);
        setPage(1);
    };
    return(
        <>
            <NavBar />
            <form className="text-center mb-5" onSubmit={handleSearch}>
                <input type="search" placeholder="Search By Customer Name" name="search" className="w-25" />
                <button type="submit" className="btn btn-primary ms-2">Search</button>
            </form>
            <h3 className="text-center mb-5">Customer Table</h3>
            <div className="d-flex justify-content-center">
                
                <table className="table table-hover w-75">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Customer Name</th>
                            <th scope="col">Customer Email</th>
                            <th scope="col">Customer Phone</th>
                            <th scope="col">Order Date</th>
                            <th scope="col">Order Amount</th>
                            <th scope="col">Currency</th>
                            <th scope="col">Customer Photo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map((order,index)=>(
                                <tr>
                                    <th scope="row">{(page - 1) * 10 + index + 1}</th>
                                    <td>{order.Customer.Name}</td>
                                    <td>{order.Customer.Email}</td>
                                    <td>{order.Customer.Phone}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>{order.totalAmount}</td>
                                    <td>{order.currency}</td>
                                    <td><img src={order.Customer.Photo} alt="photo" width={'50px'} height={'50px'}/></td>

                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-center products-pagination mb-5">
                <Stack spacing={2}>
                <Pagination
                    count={10}
                    page={page}
                    variant="outlined"
                    shape="rounded"
                    onChange={handlePageChange}
                />
                </Stack>
            </div>
        </>
    )
}
export default Orders;
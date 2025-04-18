import NavBar from "./navbar";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Customers(){
    const apiUrl = import.meta.env.VITE_SERVER_URL;
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [customers, setCustomers] = useState([]);
    const navigate = useNavigate();
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    useEffect(()=>{
        const getAllCustomers = async ()=>{
            try {
                const response = await axios.get(`${apiUrl}/admin/customers`, {
                    params: {
                      page,
                      search,
                    },
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                setCustomers(response.data.customers);
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
    const handleSelected = (id) => {
        setSelectedCustomers((prev) =>
          prev.includes(id)
            ? prev.filter((item) => item !== id)
            : [...prev, id] 
        );
    };
    
      const deleteCustomers = async () => {
        if (selectedCustomers.length < 1) {
          return;
        }
        const customersIds = selectedCustomers.join(',');
        try {
          await axios.delete(`${apiUrl}/admin/deletecustomers/${customersIds}`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('adminToken')}`
            }
          });
          window.location.reload();
        } catch (error) {
            if(error.response.status === 403){
                navigate('/admin/login');
            }
        }
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
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Status</th>
                            <th scope="col">Gender</th>
                            <th scope="col">Date Of Birth</th>
                            <th scope="col">Photo</th>
                            <th scope="col">Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            customers.map((customer,index)=>(
                                <tr>
                                    <th scope="row">{(page - 1) * 10 + index + 1}</th>
                                    <td>{customer.Name}</td>
                                    <td>{customer.Email}</td>
                                    <td>{customer.Phone}</td>
                                    <td>{customer.Status}</td>
                                    <td>{customer.Gender}</td>
                                    <td>{new Date(customer.Date_Of_Birth).toLocaleDateString()}</td>
                                    <td><img src={customer.Photo} alt="" width={'50px'} height={'50px'}/></td>
                                    <td>
                                        <div className="form-check p-3">
                                            <input className="form-check-input" type="checkbox" id="flexCheckDefault" onChange={()=>handleSelected(customer.ID)}/>
                                            <label className="form-check-label" htmlFor="flexCheckDefault"></label>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div className="text-center mb-5"><button className="btn btn-danger" onClick={deleteCustomers}>Delete Selected Customers</button></div>
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
export default Customers;
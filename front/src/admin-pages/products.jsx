import NavBar from "./navbar";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Products(){
    const apiUrl = import.meta.env.VITE_SERVER_URL;
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    useEffect(()=>{
        const getAllCustomers = async ()=>{
            try {
                const response = await axios.get(`${apiUrl}/admin/products`, {
                    params: {
                      page,
                      search,
                    },
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                setProducts(response.data.products);
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
    const changeStatus = async (e,id)=>{
        const status = e.target.value;
        try {
            axios.patch(`${apiUrl}/product/updatestatus/${id}`,{status},{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            })
            window.location.reload();
        } catch (error) {
            if(error.response.status === 403){
                navigate('/admin/login');
            }
        }
    }
    return(
        <>
            <NavBar />
            <form className="text-center mb-5" onSubmit={handleSearch}>
                <input type="search" placeholder="Search By Product Name" name="search" className="w-25" />
                <button type="submit" className="btn btn-primary ms-2">Search</button>
            </form>
            <h3 className="text-center mb-5">Products Table</h3>
            <div className="d-flex justify-content-center mb-5">
                
                <table className="table table-hover w-75">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Status</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Currency</th>
                            <th scope="col">Photo</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((product,index)=>(
                                <tr>
                                    <th scope="row">{(page - 1) * 10 + index + 1}</th>
                                    <td>{product.Name}</td>
                                    <td>{product.Description}</td>
                                    <td>{product.Status}</td>
                                    <td>{product.Amount}</td>
                                    <td>{product.Currency}</td>
                                    <td><img src={product.photo} alt="photo" width={'50px'} height={'50px'}/></td>
                                    <td>
                                        <select name="status" id="status" onChange={(e) => changeStatus(e, product.ID)}>
                                            <option value="change status" disabled selected>Change Status</option>
                                            <option value="active">Active</option>
                                            <option value="In Active">Inactive</option>
                                            <option value="Expired">Expired</option>
                                            <option value="deleted">deleted</option>
                                        </select>
                                    </td>
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
export default Products;
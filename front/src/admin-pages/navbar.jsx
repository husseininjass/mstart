import { useNavigate } from "react-router-dom";
function NavBar(){
    const navigate = useNavigate();
    const logOut = ()=>{
        localStorage.removeItem('adminToken');
        navigate('/admin/login')
    }
    return(
        <>
            <div className="d-flex justify-content-center gap-5 mb-5">
                <div><a href="/" className="text-decoration-none fs-5">Home</a></div>
                <div><a href="/admin/customers" className="text-decoration-none fs-5">Customers</a></div>
                <div><a href="/admin/products" className="text-decoration-none fs-5">Products</a></div>
                <div><a href="" className="text-decoration-none fs-5" onClick={logOut}>Log Out</a></div>
            </div>
        </>
    )
}
export default NavBar;
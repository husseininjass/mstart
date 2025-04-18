function Navbar(){
    return(
        <>
        <div className="d-flex justify-content-center gap-5 mb-5">
            <div><a href="/" className="text-decoration-none fs-5">Home</a></div>
            <div><a href="/login" className="text-decoration-none fs-5">Login</a></div>
            <div><a href="/signup" className="text-decoration-none fs-5">Sign Up</a></div>
            <div><a href="#" className="text-decoration-none fs-5">Profile</a></div>
            <div><a href="/cart" className="text-decoration-none fs-5">Cart</a></div>
        </div>
        </>
    )
}
export default Navbar;
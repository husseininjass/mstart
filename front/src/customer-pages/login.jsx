import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
function Login() {
    const apiUrl = import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/customer/login`,formData)
            localStorage.setItem('token', response.data.token)
            navigate('/')
        } catch (error) {
            
        }
    };

    return (
        <div className="d-flex justify-content-center mt-5">
        <form className="w-25 text-center" onSubmit={handleSubmit}>
            <h3 className="mb-5">LogIn Form</h3>

            <div className="mb-3 text-start">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" name="email" onChange={handleChange} />
            </div>

            <div className="mb-3 text-start">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" name="password" onChange={handleChange} />
            </div>


            <button type="submit" className="btn btn-primary w-100">Login</button>
            <div><p>Don't you have an account? <a href="/signup">Sign Up</a></p></div>
        </form>
        </div>
    );
}

export default Login;

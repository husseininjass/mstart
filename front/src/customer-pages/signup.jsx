import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
function SignUp() {
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
            await axios.post(`${apiUrl}/customer/create`,formData)
            navigate('/login')
        } catch (error) {
            
        }
    };

    return (
        <div className="d-flex justify-content-center mt-5">
        <form className="w-25 text-center" onSubmit={handleSubmit}>
            <h3 className="mb-5">Sign Up Form</h3>

            <div className="mb-3 text-start">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" name="Name" onChange={handleChange} />
            </div>

            <div className="mb-3 text-start">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" name="Email" onChange={handleChange} />
            </div>

            <div className="mb-3 text-start">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" name="Password" onChange={handleChange} />
            </div>

            <div className="mb-3 text-start">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input type="tel" className="form-control" id="phone" name="Phone" onChange={handleChange} />
            </div>

            <div className="mb-3 text-start">
            <label htmlFor="dob" className="form-label">Date of Birth</label>
            <input type="date" className="form-control" id="dob" name="Date_Of_Birth"  onChange={handleChange} />
            </div>

            <div className="mb-4 text-start">
            <label htmlFor="gender" className="form-label">Gender</label>
            <select className="form-select" id="gender" name="Gender" onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            </div>

            <button type="submit" className="btn btn-primary w-100">Sign Up</button>
            <div><p>Already have an account? <a href="/login">Login</a></p></div>
        </form>
        </div>
    );
}

export default SignUp;

import React, { useState } from "react";
import "../styles/BusinessForm.css";

const BusinessForm = ({ onSubmit, onBack }) => {
    const [formData, setFormData] = useState({
        category: "",
        name: "",
        bank: "",
        area: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="business-form">
            <h2>Register Your Business</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Business Category:
                    <select name="category" onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="Grocery">Grocery</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Home Services">Home Services</option>
                    </select>
                </label>
                <label>
                    Business Name:
                    <input type="text" name="name" onChange={handleChange} required />
                </label>
                <label>
                    Bank Details:
                    <input type="text" name="bank" onChange={handleChange} required />
                </label>
                <label>
                    Service Area:
                    <input type="text" name="area" onChange={handleChange} required />
                </label>
                <button type="submit">Register</button>
                <button type="button" className="back-button" onClick={onBack}>
                    ← Back to Shopping
                </button>
            </form>
        </div>
    );
};

export default BusinessForm;

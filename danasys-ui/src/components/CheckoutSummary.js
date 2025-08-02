import React from "react";
import "../styles/CheckoutSummary.css";

const CheckoutSummary = ({ cart, totalItems, totalPrice, address, setAddress, onBack, onPay }) => {
    return (
        <div className="checkout-summary-wrapper">
            <h2>🧾 Order Summary</h2>
            <ul>
                {Object.values(cart).map((item) => (

                    <li key={item.id}>
                        <img src={item.image} alt={item.name} className="summary-image" />
                        × {item.quantity} = ₹{item.price * item.quantity}
                    </li>
                ))}
            </ul>

            <p><strong>Total Items:</strong> {totalItems}</p>
            <p><strong>Total Price:</strong> ₹{totalPrice}</p>

            <label htmlFor="address">📍 Delivery Address:</label>
            <textarea
                id="address"
                rows="3"
                placeholder="Enter delivery location"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />

            <div className="checkout-buttons">
                <button onClick={onBack} className="back-button">← Back</button>
                <button onClick={onPay} className="pay-button">Proceed to Payment</button>
            </div>
        </div>
    );
};

export default CheckoutSummary;

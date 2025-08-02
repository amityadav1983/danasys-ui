import React from "react";
import "../styles/MoreOptions.css"; // Optional for styles

const MoreOptions = ({ onClose, onDoBusinessClick }) => {
    return (
        <div className="more-options-page">
            <h2>🔧 More Options</h2>
            <ul className="options-list">
                <li onClick={onDoBusinessClick}>🧑‍💼 Do Business With Us</li>
                <li>🔗 See Your Network</li>
                <li>💰 Wallet Balance</li>
                <li>📦 Order History</li>
                <li>☎️ Customer Support</li>
            </ul>
            <button className="close-button" onClick={onClose}>Go Back</button>
        </div>
    );
};

export default MoreOptions;

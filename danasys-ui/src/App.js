import React, { useEffect, useState } from "react";
import "./styles/App.css";
import productsData from "./data/products.json";
import CheckoutSummary from "./components/CheckoutSummary";
import MoreOptions from "./components/MoreOptions";
import BusinessForm from "./components/BusinessForm";
import BusinessProductList from "./components/BusinessProductList";


const categories = ['Grocery', 'Vegetables', 'Dairy'];





function App() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('Grocery');

    const [showSummary, setShowSummary] = useState(false);
    const [address, setAddress] = useState('');

    const [showMoreOptions, setShowMoreOptions] = useState(false);

    const [showBusinessForm, setShowBusinessForm] = useState(false);
    const [isBusinessRegistered, setIsBusinessRegistered] = useState(false);
    const [showBusinessProducts, setShowBusinessProducts] = useState(false);


    useEffect(() => {
        setProducts(productsData);
    }, []);

    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const container = document.querySelector('.app-container');

        const handleScroll = () => {
            const currentScroll = container.scrollTop;

            if (currentScroll > lastScrollY && currentScroll > 100) {
                setIsHeaderVisible(false); // Scroll down → hide header
            } else {
                setIsHeaderVisible(true); // Scroll up → show header
            }

            setLastScrollY(currentScroll);
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);


    const goToHomePage = () => {
        setShowBusinessForm(false);
        setShowSummary(false);
        setShowMoreOptions(false);
        setShowBusinessProducts(false);
    };



    const addToCart = (product) => {
        setCart((prevCart) => {
            const quantity = prevCart[product.id]?.quantity || 0;
            return {
                ...prevCart,
                [product.id]: { ...product, quantity: quantity + 1 }
            };
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => {
            const updated = { ...prevCart };
            if (updated[productId].quantity === 1) {
                delete updated[productId];
            } else {
                updated[productId].quantity -= 1;
            }
            return updated;
        });
    };

    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = Object.values(cart).reduce((sum, item) => sum + item.quantity * item.price, 0);

    const filteredProducts = products.filter(
        (p) =>
            p.category === category &&
            p.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        setProducts(productsData);

        const registered = localStorage.getItem("isBusinessRegistered");
        if (registered === "true") {
            setIsBusinessRegistered(true);
        }
    }, []);

    useEffect(() => {
        const storedBusinessProducts = JSON.parse(localStorage.getItem('business-products')) || [];
        const mergedProducts = [...productsData, ...storedBusinessProducts];
        setProducts(mergedProducts);
    }, []);

    return (
        <div className="app-container">

            <header className={`app-header ${!isHeaderVisible ? 'hide-header' : ''}`}>
                <div className="header-left">
                    <h1 className="logo">🛒 Cost2Cost</h1>
                </div>
                <div className="header-center">
                    <div className="flash-sale-box">
                        sale
                    </div>
                </div>
                <div className="header-right">
                    <span className="user-icon">👤</span>
                </div>
            </header>


            {/* Category Filter */}
            < div className="category-bar" >
                {
                    categories.map((cat) => (
                        <button
                            key={cat}
                            className={cat === category ? 'active' : ''}
                            onClick={() => setCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))
                }
            </div >

            {/* Search Box */}
            < div className="search-bar" >
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div >

            <div className="scrollable-body">




                {showMoreOptions ? (
                    <MoreOptions
                        onClose={() => setShowMoreOptions(false)}
                        onDoBusinessClick={() => {
                            setShowMoreOptions(false);
                            setShowSummary(true)
                            if (isBusinessRegistered) {
                                setShowBusinessProducts(true);
                            } else {
                                setShowBusinessForm(true);
                            }
                        }}
                    />
                ) : showBusinessForm ? (
                    <BusinessForm onBack={goToHomePage}
                        onSubmit={(formData) => {
                            console.log("Registered Business:", formData);
                            setIsBusinessRegistered(true);
                            setShowBusinessForm(false);
                            setShowBusinessProducts(true);
                        }}
                    />
                ) : showBusinessProducts ? (
                    <BusinessProductList products={products.filter(p => p.category === 'Grocery')} />
                ) : showSummary ? (
                    <CheckoutSummary
                        cart={cart}
                        totalItems={totalItems}
                        totalPrice={totalPrice}
                        address={address}
                        setAddress={setAddress}
                        onBack={() => setShowSummary(false)}
                        onPay={() => alert(`Proceeding to payment\nAddress: ${address}`)}
                    />
                ) : (
                    <main className="product-list">
                        {filteredProducts.map((product) => {
                            const inCart = cart[product.id];
                            return (
                                <div className="product-card" key={product.id}>
                                    <img src={product.image} alt={product.name} className="product-image" />
                                    <h3>{product.name}</h3>
                                    <p>₹{product.price}</p>
                                    {!inCart ? (
                                        <button onClick={() => addToCart(product)}>Add to Cart</button>
                                    ) : (
                                        <div className="quantity-control">
                                            <button onClick={() => removeFromCart(product.id)}>-</button>
                                            <span>{inCart.quantity}</span>
                                            <button onClick={() => addToCart(product)}>+</button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </main>
                )}





            </div>

            {
                totalItems > 0 && !showSummary && !showMoreOptions && (
                    <div className="checkout-panel">
                        <h3 className="checkout-title">🛍 Your Cart</h3>
                        <div className="checkout-items">
                            {Object.values(cart).map((item) => (
                                <div className="checkout-item" key={item.id}>

                                    <div className="checkout-details">
                                        <span>{item.name}</span>
                                        <span>₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</span>
                                        <div className="quantity-control">
                                            <button onClick={() => removeFromCart(item.id)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => addToCart(item)}>+</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="checkout-summary">
                            <span>{totalItems} items</span>
                            <strong>Total: ₹{totalPrice}</strong>
                        </div>
                        <button
                            className="checkout-button"
                            onClick={() => setShowSummary(true)}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )
            }

            <footer className="app-footer">
                <nav className="footer-nav">
                    <button>Home</button>
                    <button>Cart</button>
                    <button>Wallet</button>
                    <button onClick={() => setShowMoreOptions(true)}>More</button>

                </nav>
            </footer>
        </div >
    );
}

export default App;
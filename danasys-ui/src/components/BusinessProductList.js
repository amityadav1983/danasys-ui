import React, { useEffect, useState } from "react";
import "../styles/BusinessProductList.css";

const LOCAL_KEY = "business-products";

const BusinessProductList = ({ products }) => {
    const [productList, setProductList] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        quantity: "",
        image: "",
        category: "Grocery",
    });

    const [mergedProducts, setMergedProducts] = useState([]);
    useEffect(() => {
        const storedBusinessProducts = JSON.parse(localStorage.getItem("business-products")) || [];
        const combined = [...products, ...storedBusinessProducts];
        setMergedProducts(combined);
    }, [products]);

    useEffect(() => {
        const localProducts = JSON.parse(localStorage.getItem("business-products")) || [];
        const combined = [...products, ...localProducts];
        setMergedProducts(combined);
    }, [products]);


    useEffect(() => {
        const stored = localStorage.getItem(LOCAL_KEY);
        if (stored) setProductList(JSON.parse(stored));
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(productList));
    }, [productList]);

    const handleQuantityChange = (index, newQty) => {
        const updatedList = [...productList];
        updatedList[index].quantity = newQty;
        setProductList(updatedList);
    };

    const handleNewProductChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddProduct = () => {
        if (!newProduct.name || !newProduct.price || !newProduct.image) return;
        const id = Date.now();
        setProductList((prev) => [...prev, { ...newProduct, id }]);
        setNewProduct({
            name: "",
            price: "",
            quantity: "",
            image: "",
            category: "Grocery",
        });
    };

    const handleDelete = (id) => {
        const filtered = productList.filter((p) => p.id !== id);
        setProductList(filtered);
    };

    return (
        <div className="business-products-container">
            <h2>📦 Your Business Products</h2>
            <div className="product-table">
                <div className="table-header">
                    <span>Image</span>
                    <span>Name</span>
                    <span>Price</span>
                    <span>Qty</span>
                    <span>Actions</span>
                </div>
                {mergedProducts.map((p, idx) => (
                    <div className="table-row" key={p.id}>
                        <img src={p.image} alt={p.name} className="preview" />
                        <span>{p.name}</span>
                        <span>₹{p.price}</span>
                        <input
                            type="number"
                            value={p.quantity || ""}
                            onChange={(e) => handleQuantityChange(idx, e.target.value)}
                        />
                        <button onClick={() => handleDelete(p.id)}>🗑 Delete</button>
                    </div>
                ))}
            </div>

            <div className="add-product-section">
                <h3>➕ Add New Product</h3>
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={handleNewProductChange}
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={handleNewProductChange}
                />
                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={newProduct.quantity}
                    onChange={handleNewProductChange}
                />
                <input
                    type="text"
                    name="image"
                    placeholder="Image URL"
                    value={newProduct.image}
                    onChange={handleNewProductChange}
                />
                <button onClick={handleAddProduct}>Add Product</button>
            </div>
        </div>
    );
};

export default BusinessProductList;

import React, { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  offerPrice: number;
  category: string;
  image?: string;
  quantity: number;
  description?: string;
  moreAbout?: string;
  status?: string;
  version?: number;
  starRating?: number;
  userBusinessProfileId?: number;
}

interface BusinessProductFormProps {
  onClose: () => void;
  product: Product | null;
  profileId: number | null;
  onSuccess: () => void;
}

const BusinessProductForm: React.FC<BusinessProductFormProps> = ({
  onClose,
  product,
  profileId,
  onSuccess,
}) => {
  const isUpdateMode = product !== null;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    offerPrice: "",
    quantity: "",
    description: "",
    moreAbout: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price?.toString() || "",
        offerPrice: product.offerPrice?.toString() || "",
        quantity: product.quantity?.toString() || "",
        description: product.description || "",
        moreAbout: product.moreAbout || "",
      });
      setFile(null);
    } else {
      setFormData({
        name: "",
        price: "",
        offerPrice: "",
        quantity: "",
        description: "",
        moreAbout: "",
      });
      setFile(null);
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!profileId) {
    alert("Please select a business profile first.");
    return;
  }
  setSubmitting(true);
  try {
    console.log("Sending userBusinessProfileId:", profileId);
    // Backend API ke hisaab se query params bana rahe hain
    const queryParams = new URLSearchParams({
      id: isUpdateMode && product ? String(product.id) : "0",
      name: formData.name,
      price: formData.price || "0",
      offerPrice: formData.offerPrice || "0",
      quantity: formData.quantity || "0",
      description: formData.description,
      image: file ? file.name : product?.image || "",
      moreAbout: formData.moreAbout,
      userBusinessProfileId: String(profileId),
      status: product?.status || "ACTIVE",
      version: String(product?.version || 0),
    });

    const formDataObj = new FormData();
    if (file) {
      formDataObj.append("file", file); // backend "file" key expect karta hai
    }

    let url = "";
    if (isUpdateMode && product) {
      url = `/api/product/updateProduct?${queryParams.toString()}`;
    } else {
      url = `/api/product/addProduct?${queryParams.toString()}`;
    }

    const res = await fetch(url, {
      method: "POST", // dono endpoints POST hain
      body: formDataObj, // file null ho to empty FormData bhej do
    });

    if (!res.ok) throw new Error(isUpdateMode ? "Failed to update product" : "Failed to add product");
    onSuccess();
  } catch (err: any) {
    alert(err.message || "Failed to save product");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6 space-y-6 my-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {isUpdateMode ? "Update Product" : "Add New Product"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-red-500 text-2xl"
          aria-label="Close form"
        >
          ✕
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6" id="product-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column - Product Info */}
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-4 text-gray-700">
                Product Details
              </h3>
              <div className="space-y-4">
                <InputField
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="MRP"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Offer Price"
                  name="offerPrice"
                  type="number"
                  value={formData.offerPrice}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Right Column - Extra Info */}
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-4 text-gray-700">
                Product Information
              </h3>
              <div className="space-y-4">
                <TextAreaField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
                <TextAreaField
                  label="More About Product"
                  name="moreAbout"
                  value={formData.moreAbout}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-4 text-gray-700">
                Upload Image
              </h3>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer p-2"
              />
              {file && (
                <p className="text-sm text-gray-500 mt-2">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting
              ? isUpdateMode
                ? "Updating..."
                : "Adding..."
              : isUpdateMode
              ? "Update"
              : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

/* Reusable InputField */
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) => (
  <label className="block text-sm">
    <span className="text-gray-600 font-medium">{label}</span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
    />
  </label>
);

/* Reusable TextAreaField */
const TextAreaField = ({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => (
  <label className="block text-sm">
    <span className="text-gray-600 font-medium">{label}</span>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={3}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
    />
  </label>
);

export default BusinessProductForm;

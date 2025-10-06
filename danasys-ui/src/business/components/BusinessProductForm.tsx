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
    categoryId: "", // added categoryId for dropdown
    description: "",
    moreAbout: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [categories, setCategories] = useState<{id: number; categoryName: string}[]>([]);

  useEffect(() => {
    // Fetch categories on mount
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/allRegisteredProductCategory');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price?.toString() || "",
        offerPrice: product.offerPrice?.toString() || "",
        quantity: product.quantity?.toString() || "",
        categoryId: "",
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
        categoryId: "",
        description: "",
        moreAbout: "",
      });
      setFile(null);
    }
  }, [product]);

  useEffect(() => {
    if (product && categories.length > 0) {
      const category = categories.find(cat => cat.categoryName === product.category);
      if (category) {
        setFormData(prev => ({
          ...prev,
          categoryId: String(category.id),
        }));
      }
    }
  }, [product, categories]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    const formDataObj = new FormData();
    formDataObj.append("id", isUpdateMode && product ? String(product.id) : "0");
    formDataObj.append("name", formData.name);
    formDataObj.append("price", formData.price || "0");
    formDataObj.append("offerPrice", formData.offerPrice || "0");
    formDataObj.append("quantity", formData.quantity || "0");
    formDataObj.append("category", formData.categoryId);
    formDataObj.append("description", formData.description);
    formDataObj.append("moreAbout", formData.moreAbout);
    formDataObj.append("userBusinessProfileId", String(profileId));
    formDataObj.append("status", product?.status || "ACTIVE");
    formDataObj.append("version", String(product?.version || 0));
    if (file) {
      formDataObj.append("file", file); // backend "file" key expect karta hai
    } else if (product?.image) {
      formDataObj.append("image", product.image);
    }

    let url = "";
    if (isUpdateMode && product) {
      url = `/api/product/updateProduct`;
    } else {
      url = `/api/product/addProduct`;
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
          <div className="space-y-6 relative">
            {(isUpdateMode && product?.image) || (!isUpdateMode) ? (
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full overflow-hidden border border-gray-300 cursor-pointer">
                <img
                  src={
                    file
                      ? URL.createObjectURL(file)
                      : isUpdateMode && product?.image
                      ? product.image
                      : "https://via.placeholder.com/80?text=Upload"
                  }
                  alt="Product image"
                  className="w-full h-full object-cover rounded-full"
                  onClick={() => document.getElementById('image-upload')?.click()}
                />
                <div
                  className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer flex items-center justify-center shadow-lg border-2 border-white"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  style={{ width: '28px', height: '28px' }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3h-1.586a1 1 0 00-.707.293l-1.414 1.414A1 1 0 0112.586 5H11a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1z"
                    />
                  </svg>
                </div>
              </div>
            ) : null}
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
        <label className="block text-sm">
          <span className="text-gray-600 font-medium">Category</span>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((cat: {id: number; categoryName: string}) => (
              <option key={cat.id} value={cat.id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </label>
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
            <div className="">
              {/* <h3 className="font-semibold text-lg mb-4 text-gray-700">
                Upload Image
              </h3> */}
              {isUpdateMode && product?.image && (
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full overflow-hidden border border-gray-300 cursor-pointer">
                  <img
                    src={product.image}
                    alt="Current product image"
                    className="w-full h-full object-cover rounded-full"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  />
                  <div
                    className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3h-1.586a1 1 0 00-.707.293l-1.414 1.414A1 1 0 0112.586 5H11a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1z"
                      />
                    </svg>
                  </div>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
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

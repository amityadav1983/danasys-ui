import React from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

interface Product {
  id: number;
  name: string;
  price: number;
  offerPrice: number;
  category: string;
  image: string;
  quantity: number;
  description?: string;
  moreAbout?: string;
  status?: string;
  version?: number;
  starRating?: number;
  userBusinessProfileId?: number;
}

interface BusinessProductListProps {
  filteredProducts: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleAddProduct: () => void;
  selectedProducts: number[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<number[]>>;
  editedProducts: Record<number, Product>;
  setEditedProducts: React.Dispatch<React.SetStateAction<Record<number, Product>>>;
  handleInlineChange: (
    productId: number,
    field: keyof Product,
    value: string | number
  ) => void;
  handleBulkUpdate: () => void;
  handleUpdateProduct: (product: Product) => void;
  handleDeleteProduct: (productId: number) => void;
  loadingProducts: boolean;
  showSearch?: boolean;
}

const BusinessProductList: React.FC<BusinessProductListProps> = ({
  filteredProducts,
  searchQuery,
  setSearchQuery,
  handleAddProduct,
  selectedProducts,
  setSelectedProducts,
  editedProducts,
  setEditedProducts,
  handleInlineChange,
  handleBulkUpdate,
  handleUpdateProduct,
  handleDeleteProduct,
  loadingProducts,
  showSearch = true,
}) => {
  const toggleSelectProduct = (product: Product) => {
    if (selectedProducts.includes(product.id)) {
      setSelectedProducts((prev) => prev.filter((id) => id !== product.id));
      const { [product.id]: _, ...rest } = editedProducts;
      setEditedProducts(rest);
    } else {
      setSelectedProducts((prev) => [...prev, product.id]);
      setEditedProducts((prev) => ({ ...prev, [product.id]: { ...product } }));
    }
  };

  // Helper function to format product name
  const formatProductName = (name: string) => {
    return name.replace(/-/g, ' ').replace(/\.jpg$/i, '');
  };

  return (
    <div>
      {/* ✅ Top bar search + Add Product */}
{showSearch && (
  <div className="flex justify-between items-center mb-4 gap-4">
    {/* Search Bar + Button */}
    <div className="flex items-center gap-2 w-full max-w-md">
      <input
        type="text"
        placeholder="Search by name or category"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={() => setSearchQuery(searchQuery)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Search
      </button>
    </div>

    {/* Desktop: + Add Product */}
    <button
      onClick={handleAddProduct}
      className="hidden md:block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
    >
      + Add Product
    </button>

    {/* Mobile: Floating + button */}
    {/* <button
      onClick={handleAddProduct}
      className="fixed bottom-6 right-6 md:hidden bg-green-600 text-white rounded-full w-14 h-14 text-3xl flex items-center justify-center shadow-lg hover:bg-green-700 transition"
    >
      +
    </button> */}
  </div>
)}



      {/* Add Button - Fixed Bottom Right for Mobile */}
      <button
        onClick={handleAddProduct}
        className="md:hidden fixed bottom-4 right-2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition z-10"
      >
        <FaPlus />
      </button>

      {/* Table */}
      {!loadingProducts && filteredProducts.length > 0 ? (
        <div className="w-full relative">
          {/* Desktop Header */}
          <div className="hidden md:grid md:grid-cols-6 font-semibold text-gray-700 px-5 py-3 bg-gray-100 rounded-t-xl border border-gray-200">
            <div></div>
            <div className="text-left">Image / Name</div>
            <div className="text-left">MRP</div>
            <div className="text-left">Offer Price</div>
            <div className="text-left">Quantity</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Desktop Rows */}
          <div className="hidden md:block space-y-3">
            {filteredProducts.map((product) => {
              const isSelected = selectedProducts.includes(product.id);
              const editable = editedProducts[product.id] || product;
              return (
                <div
                  key={product.id}
                  className="grid grid-cols-6 items-center px-5 py-4 bg-blue-50 rounded-xl border border-gray-200 shadow-sm"
                >
                  {/* Checkbox */}
                  <div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectProduct(product)}
                    />
                  </div>

                  {/* Image + Name */}
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt="Product"
                      className="h-10 w-10 rounded-full border object-cover"
                    />
                    <span className="font-medium text-gray-800">
                      {formatProductName(product.name)}
                    </span>
                  </div>

                  {/* MRP */}
                  <div>
                    {isSelected && selectedProducts.length > 1 ? (
                      <input
                        type="number"
                        value={editable.price}
                        onChange={(e) =>
                          handleInlineChange(
                            product.id,
                            "price",
                            Number(e.target.value)
                          )
                        }
                        className="border rounded px-2 py-1 w-20"
                      />
                    ) : (
                      <span>₹{product.price}</span>
                    )}
                  </div>

                  {/* Offer Price */}
                  <div>
                    {isSelected && selectedProducts.length > 1 ? (
                      <input
                        type="number"
                        value={editable.offerPrice}
                        onChange={(e) =>
                          handleInlineChange(
                            product.id,
                            "offerPrice",
                            Number(e.target.value)
                          )
                        }
                        className="border rounded px-2 py-1 w-20"
                      />
                    ) : (
                      <span>₹{product.offerPrice}</span>
                    )}
                  </div>

                  {/* Quantity */}
                  <div>
                    {isSelected && selectedProducts.length > 1 ? (
                      <input
                        type="number"
                        value={editable.quantity}
                        onChange={(e) =>
                          handleInlineChange(
                            product.id,
                            "quantity",
                            Number(e.target.value)
                          )
                        }
                        className="border rounded px-2 py-1 w-20"
                      />
                    ) : (
                      <span>{product.quantity}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleUpdateProduct(product)}
                      disabled={!isSelected || selectedProducts.length > 1}
                      className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full transition ${
                        !isSelected || selectedProducts.length > 1
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                      }`}
                    >
                      <FaEdit /> Update
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-full transition"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-3">
            {filteredProducts.map((product) => {
              const isSelected = selectedProducts.includes(product.id);
              const editable = editedProducts[product.id] || product;
              return (
                <div
                  key={product.id}
                  className="bg-blue-50 rounded-xl border border-gray-200 shadow-sm p-4 w-full min-h-40 transition-all duration-300 hover:bg-blue-100 hover:scale-[1.02] hover:shadow-md"
                >
                  {/* Top Row: Checkbox + Image + Name */}
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectProduct(product)}
                    />
                    <img
                      src={product.image}
                      alt="Product"
                      className="h-12 w-12 rounded-full border object-cover"
                    />
                    <span className="font-medium text-gray-800 flex-1">
                      {formatProductName(product.name)}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-gray-600">MRP</div>
                      {isSelected && selectedProducts.length > 1 ? (
                        <input
                          type="number"
                          value={editable.price}
                          onChange={(e) =>
                            handleInlineChange(
                              product.id,
                              "price",
                              Number(e.target.value)
                            )
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="font-bold">₹{product.price}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Offer Price</div>
                      {isSelected && selectedProducts.length > 1 ? (
                        <input
                          type="number"
                          value={editable.offerPrice}
                          onChange={(e) =>
                            handleInlineChange(
                              product.id,
                              "offerPrice",
                              Number(e.target.value)
                            )
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="font-bold">₹{product.offerPrice}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Quantity</div>
                      {isSelected && selectedProducts.length > 1 ? (
                        <input
                          type="number"
                          value={editable.quantity}
                          onChange={(e) =>
                            handleInlineChange(
                              product.id,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="font-bold">{product.quantity}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Category</div>
                      <div className="font-bold">{product.category}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleUpdateProduct(product)}
                      disabled={!isSelected || selectedProducts.length > 1}
                      className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition ${
                        !isSelected || selectedProducts.length > 1
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                      }`}
                    >
                      <FaEdit /> Update
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bulk Update Button */}
          {selectedProducts.length > 1 && (
            <div className="fixed bottom-6 right-6">
              <button
                onClick={handleBulkUpdate}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
              >
                Bulk Update ({selectedProducts.length})
              </button>
            </div>
          )}
        </div>
      ) : (
        !loadingProducts && <p>No products found.</p>
      )}
    </div>
  );
};

export default BusinessProductList;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Package, 
  Search, 
  Filter, 
  Download, 
  Edit3, 
  Trash2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isDeleting, setIsDeleting] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    setIsDeleting(id);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/product/${id}/update/`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product._id);
    setEditFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: product.price
    });
  };

  const handleEditChange = (e, field) => {
    setEditFormData({
      ...editFormData,
      [field]: e.target.value
    });
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/product/${id}/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });
      if (res.ok) {
        setProducts(products.map(p => p._id === id ? { ...p, ...editFormData } : p));
        setEditingProduct(null);
      } else {
        alert("Failed to update product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage products, pricing, and stock levels.</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
            <Download size={16} /> Export
          </button>
          <Link to="/dashboard/create-product" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 w-[35%]">Product Name</th>
                <th className="px-6 py-3 w-[20%]">Category</th>
                <th className="px-6 py-3 w-[15%] text-right">Price</th>
                <th className="px-6 py-3 w-[15%] text-center">Stock</th>
                <th className="px-6 py-3 w-[15%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentProducts.length > 0 ? (
                currentProducts.map((p) => {
                  const isLowStock = p.quantity <= 5;
                  const isEditing = editingProduct === p._id;

                  return (
                    <tr key={p._id} className={`hover:bg-gray-50 ${isEditing ? 'bg-indigo-50/30' : ''}`}>
                      <td className="px-6 py-3 text-sm">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editFormData.name}
                            onChange={(e) => handleEditChange(e, 'name')}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                          />
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                              <Package size={16} />
                            </div>
                            <span className="font-medium text-gray-900 truncate max-w-[200px]" title={p.name}>
                              {p.name}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        {isEditing ? (
                          <select
                            value={editFormData.category}
                            onChange={(e) => handleEditChange(e, 'category')}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                          >
                            <option value="Electronics">Electronics</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Clothing">Clothing</option>
                          </select>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {p.category}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm text-right font-medium">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editFormData.price}
                            onChange={(e) => handleEditChange(e, 'price')}
                            className="w-24 border border-gray-300 rounded px-2 py-1 text-sm text-right focus:ring-1 focus:ring-indigo-500 outline-none ml-auto"
                          />
                        ) : (
                          <span className="text-gray-900">Rs {parseFloat(p.price).toFixed(2)}</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editFormData.quantity}
                            onChange={(e) => handleEditChange(e, 'quantity')}
                            className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:ring-1 focus:ring-indigo-500 outline-none mx-auto"
                          />
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            <span className={`font-semibold ${isLowStock ? "text-rose-600" : "text-gray-700"}`}>
                              {p.quantity}
                            </span>
                            {isLowStock && <AlertCircle size={14} className="text-rose-500" title="Low Stock" />}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleUpdate(p._id)}
                              className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded transition-colors"
                            >
                              Save
                            </button>
                            <button 
                              onClick={() => setEditingProduct(null)}
                              className="text-xs font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleEditClick(p)}
                              className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                              title="Edit Product"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(p._id)}
                              disabled={isDeleting === p._id}
                              className={`text-gray-400 hover:text-rose-600 transition-colors p-1 ${isDeleting === p._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title="Delete Product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Package size={32} className="text-gray-400 mb-3" />
                      <p className="text-sm font-medium text-gray-900">No products found</p>
                      <p className="text-xs mt-1">Try adjusting your search or add a new product.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Showing <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-medium text-gray-900">{Math.min(indexOfLastItem, filteredProducts.length)}</span> of <span className="font-medium text-gray-900">{filteredProducts.length}</span> results
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 rounded text-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center px-2 text-sm font-medium text-gray-700">
                {currentPage} / {totalPages}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 rounded text-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Products;
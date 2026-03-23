import React, { useEffect, useState } from "react";
import { Plus, ShoppingCart, CheckCircle2 } from 'lucide-react';

export const CreateProduct = () => {
  const [product, setProduct] = useState({ name: '',  category: 'Electronics', quantity: 0, price: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');
    const token = localStorage.getItem("token");
    const uri = "http://127.0.0.1:8000/api/product/create/";

    try {
      const res = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(product)
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccessMsg('Product added successfully!');
        setProduct({ name: '', category: 'Electronics', quantity: 0, price: 0 });
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new item in your inventory.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {successMsg && (
          <div className="m-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-700">
            <CheckCircle2 size={18} />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreate}>
          <div className="p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Wireless Headphones"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={product.name} 
                  onChange={e => setProduct({...product, name: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={product.category} 
                  onChange={e => setProduct({...product, category: e.target.value})}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Clothing">Clothing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs)</label>
                <input 
                  type="number" 
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={product.price || ''} 
                  onChange={e => setProduct({...product, price:Number(e.target.value)})} 
                />
              </div>

              <div className="md:col-span-2 md:w-1/2 pr-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Quantity</label>
                <input 
                  type="number" 
                  min="0"
                  required
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={product.quantity || ''} 
                  onChange={e => setProduct({...product, quantity:Number(e.target.value)})} 
                />
              </div>
            </div>

          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button 
              disabled={isSubmitting}
              type="submit"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export const OrderProduct = () => {
  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [order, setOrder] = useState({
    customer_name: "",
    product_name: "",
    quantity: 1
  });

  const [pricePerUnit, setPricePerUnit] = useState(0);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const handleProductChange = (e) => {
    const selectedProduct = products.find(
      p => p.name === e.target.value
    );

    setOrder({
      ...order,
      product_name: e.target.value
    });

    if (selectedProduct) {
      setPricePerUnit(selectedProduct.price);
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');

    const token = localStorage.getItem("token");

    const orderData = {
      customer_name: order.customer_name || "Walk-in Customer",
      items: [
        {
          product_name: order.product_name,
          quantity: order.quantity
        }
      ]
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/order/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg("Order placed successfully!");
        setOrder({
          customer_name: "",
          product_name: "",
          quantity: 1
        });
        setPricePerUnit(0);
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        alert(data.error || "Failed to create order");
      }

    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = order.quantity * pricePerUnit;

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sale Order</h1>
        <p className="text-sm text-gray-500 mt-1">Process a new sale and update inventory automatically.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {successMsg && (
          <div className="m-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-700">
            <CheckCircle2 size={18} />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleOrder}>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={order.customer_name}
                  onChange={(e) => setOrder({...order, customer_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
                <select
                  value={order.product_name}
                  onChange={handleProductChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                >
                  <option value="" disabled>Select a product...</option>
                  {products.map(product => (
                    <option key={product._id} value={product.name}>
                      {product.name} ({product.quantity} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={order.quantity || ''}
                  onChange={(e) => setOrder({...order, quantity: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Order Summary Box */}
            <div className="mt-8 bg-gray-50 border border-gray-200 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Order Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rs {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              disabled={isSubmitting || !order.product_name}
              type="submit"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={16} />
              {isSubmitting ? 'Processing...' : 'Complete Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
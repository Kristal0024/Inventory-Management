import React, { useEffect, useState } from "react";
import { Search, Download, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/orders/")
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Error fetching orders:", err));
  }, []);

  const filteredOrders = orders.filter(o => 
    o.customer_name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage customer transactions.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="text-sm font-medium text-gray-500">
            Total Valid Orders: <span className="text-gray-900">{filteredOrders.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 w-[25%]">Order ID / Customer</th>
                <th className="px-6 py-3 w-[40%]">Items</th>
                <th className="px-6 py-3 w-[15%] text-right">Amount</th>
                <th className="px-6 py-3 w-[20%]">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentOrders.length > 0 ? (
                currentOrders.map((order, index) => {
                  const dateString = order.created_at.endsWith('Z') ? order.created_at : `${order.created_at}Z`;
                  const orderDate = new Date(dateString);
                  const formattedDate = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  const formattedTime = orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                  
                  const globalIndex = indexOfFirstItem + index;
                  const orderId = String(globalIndex + 1000).padStart(5, '0');

                  return (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-gray-500 mb-0.5">#{orderId}</span>
                          <span className="text-sm font-semibold text-gray-900">{order.customer_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {order.items.map((item, i) => (
                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                              {item.product_name} <span className="ml-1 text-gray-500">x{item.quantity}</span>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-semibold text-gray-900">
                            Rs {parseFloat(order.total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider mt-0.5">Paid</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} className="text-gray-400" />
                          <span>{formattedDate}</span>
                          <span className="text-gray-400 text-xs ml-1">{formattedTime}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <p className="text-sm">No orders found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredOrders.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Showing <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-medium text-gray-900">{Math.min(indexOfLastItem, filteredOrders.length)}</span> of <span className="font-medium text-gray-900">{filteredOrders.length}</span> results
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

export default Orders;
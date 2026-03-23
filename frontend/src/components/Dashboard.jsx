import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  LayoutDashboard,
  PlusCircle,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  Search,
  Menu,
  User
} from "lucide-react";
import Products from "./Products";
import Orders from "./Orders";
import { CreateProduct, OrderProduct } from "./ProductForms";
import Settings from "./Settings";
import Auth from "./Auth";

const data = [
  { name: "Jan", sales: 4000, orders: 240 },
  { name: "Feb", sales: 3000, orders: 139 },
  { name: "Mar", sales: 2000, orders: 980 },
  { name: "Apr", sales: 2780, orders: 390 },
  { name: "May", sales: 1890, orders: 480 },
  { name: "Jun", sales: 2390, orders: 380 },
];

const StatCard = ({ title, value, icon, trend, type }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {trend && (
        <p className={`text-sm mt-2 font-medium ${type === 'positive' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trend} 
          <span className="text-gray-400 ml-1 font-normal text-xs">vs last month</span>
        </p>
      )}
    </div>
    <div className={`p-4 rounded-xl ${
      type === 'positive' ? 'bg-emerald-50 text-emerald-600' :
      type === 'warning' ? 'bg-amber-50 text-amber-600' :
      'bg-indigo-50 text-indigo-600'
    }`}>
      {icon}
    </div>
  </div>
);

const DashboardHome = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0
  });

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/api/products/").then(res => res.json()),
      fetch("http://127.0.0.1:8000/api/orders/").then(res => res.json())
    ]).then(([productsData, ordersData]) => {
      setStats({
        products: productsData.length || 0,
        orders: ordersData.length || 0
      });
    }).catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Track your store's performance and inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/create-product" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <PlusCircle size={18} /> Add Product
          </Link>
          <Link to="/dashboard/create-order" className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <ShoppingCart size={18} /> New Order
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Products" 
          value={stats.products.toLocaleString()} 
          icon={<Package size={24} />} 
          trend="+12%"
          type="primary"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.orders.toLocaleString()} 
          icon={<ShoppingCart size={24} />} 
          trend="+5.2%"
          type="primary"
        />
        <StatCard 
          title="Total Revenue" 
          value="Rs 45,231" 
          icon={<TrendingUp size={24} />} 
          trend="+18%"
          type="positive"
        />
        <StatCard 
          title="Low Stock Items" 
          value="12" 
          icon={<AlertTriangle size={24} />} 
          trend="-2"
          type="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 outline-none">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} />
                <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="sales" fill="#4F46E5" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Order Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={3} dot={{r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ token, setToken }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
    { path: "/dashboard/products", name: "Inventory", icon: Package },
    { path: "/dashboard/create-product", name: "Add Product", icon: PlusCircle },
    { path: "/dashboard/orders", name: "Orders", icon: ShoppingCart },
    { path: "/dashboard/create-order", name: "Sale Order", icon: TrendingUp },
    { path: "/dashboard/settings", name: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* Sidebar - Clean Dark Theme */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0 border-r border-gray-800">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <div className="w-8 h-8 rounded bg-indigo-500 mr-3 flex items-center justify-center text-white font-bold">
            S
          </div>
          <h2 className="text-lg font-bold tracking-tight">StockMaster</h2>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                             (item.path === "/dashboard" && location.pathname === "/dashboard/");
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-indigo-600 text-white" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogOut}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <div className="relative w-64">
               <input 
                 type="text" 
                 placeholder="Search anything..." 
                 className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
               />
               <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
             </div>
          </div>
          <div className="flex items-center gap-4">
             <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
               <Bell size={20} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
             </button>
             <div className="h-8 w-px bg-gray-200 mx-1"></div>
             <button className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
               <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                 <User size={16} />
               </div>
               <div className="text-left hidden md:block">
                 <p className="text-sm font-bold text-gray-700 leading-tight">Admin</p>
               </div>
             </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50/50">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="products" element={<Products />} />
            <Route path="create-product" element={<CreateProduct />} />
            <Route path="orders" element={<Orders />} />
            <Route path="create-order" element={<OrderProduct />} />
            <Route path="settings" element={<Settings setToken={setToken} />} />
          </Routes>
        </main>

      </div>
    </div>
  );
};

export default Dashboard;

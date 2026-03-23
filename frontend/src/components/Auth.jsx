import React, { useState } from 'react';
import { Lock, Mail, User, ArrowRight, Package, TrendingUp, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Auth = ({ setToken }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isLogin
        ? "http://127.0.0.1:8000/auth/login/"       
        : "http://127.0.0.1:8000/auth/signup/";     

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Welcome back!", {
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          });
          navigate("/dashboard");
        } else {
          toast.success("Account created! Please log in.", {
            duration: 4000,
            style: {
              borderRadius: '10px',
              background: '#10b981',
              color: '#fff',
            },
          });
          setFormData({ email: "", password: "", username: "" });
          setIsLogin(true); 
        }
      } else {
        toast.error(data.error || "Authentication failed", {
          style: {
            borderRadius: '10px',
            background: '#ef4444',
            color: '#fff',
          },
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.", {
        style: {
          borderRadius: '10px',
          background: '#ef4444',
          color: '#fff',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Column - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden items-center justify-center p-12">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black z-0"></div>
        
        {/* Glassmorphic decorative elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl"></div>
        
        {/* Floating Card UI */}
        <div className="relative z-10 w-full max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
              <Package className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">StockMaster</span>
          </div>
          
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6 mt-12">
            Control your inventory<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">like never before.</span>
          </h1>
          
          <p className="text-indigo-100 text-lg mb-12 max-w-md leading-relaxed opacity-90">
            Streamline your operations, track assets in real-time, and make data-driven decisions with our enterprise-grade management system.
          </p>

          {/* Feature pills */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
              <TrendingUp size={16} className="text-purple-300" />
              <span className="text-white text-sm font-medium">Real-time Analytics</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
              <ShieldCheck size={16} className="text-indigo-300" />
              <span className="text-white text-sm font-medium">Enterprise Security</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          {/* Mobile Header (Only visible on small screens) */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
               <Package className="text-white" size={20} />
             </div>
             <span className="text-2xl font-bold text-gray-900 tracking-tight">StockMaster</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="mt-3 text-gray-500 mb-8">
              {isLogin ? 'Enter your details to access your dashboard.' : 'Start managing your inventory efficiently.'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    type="text" 
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400 font-medium text-gray-900 shadow-sm"
                    placeholder="Jane Doe"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  type="email" 
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400 font-medium text-gray-900 shadow-sm"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                {isLogin && <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">Forgot password?</a>}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  type="password" 
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400 font-medium text-gray-900 shadow-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full mt-8 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              {!isSubmitting && <ArrowRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-100 text-center text-sm font-medium">
            <span className="text-gray-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ email: '', password: '', username: '' });
              }}
              className="text-indigo-600 hover:text-indigo-800 font-bold ml-1.5 focus:outline-none"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>
          
          <p className="text-center text-xs font-medium text-gray-400 mt-12">
            © {new Date().getFullYear()} StockMaster Inc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
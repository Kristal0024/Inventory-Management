import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import PaymentVerify from './components/PaymentVerify';
import CustomerCheckout from './components/CustomerCheckout';
import { useState } from 'react';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard"/> : <Auth setToken={setToken}/>} />
          <Route path="/payment/verify" element={token ? <PaymentVerify /> : <Navigate to="/" />} />
          <Route path="/checkout/:orderId" element={<CustomerCheckout />} />
          {/* Dashboard now acts as a layout that handles its own sub-routes */}
          <Route path="/dashboard/*" element={token ? <Dashboard setToken={setToken}/> : <Navigate to="/"/>} />
          {/* Catch-all route to prevent blank pages */}
          <Route path="*" element={<Navigate to={token ? "/dashboard" : "/"} />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;

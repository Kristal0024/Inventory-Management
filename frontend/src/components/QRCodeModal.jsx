import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, Loader2, Smartphone, Scan } from 'lucide-react';

const QRCodeModal = ({ orderId, onClose, onPaymentSuccess }) => {
  const [paymentStatus, setPaymentStatus] = useState('Pending'); // Pending, Paid
  const [localIP, setLocalIP] = useState(window.location.hostname);
  
  // The URL that the customer's phone will load when they scan the QR
  const checkoutUrl = `http://${localIP}:5173/checkout/${orderId}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(checkoutUrl)}&size=250x250&bgcolor=ffffff`;

  useEffect(() => {
    // Polling logic: Check the order status every 2 seconds
    const interval = setInterval(async () => {
      try {
        const apiBase = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
          ? "http://127.0.0.1:8000"
          : `http://${window.location.hostname}:8000`;
          
        const response = await fetch(`${apiBase}/api/order/status/${orderId}/`);
        const data = await response.json();
        
        if (data.payment_status === 'Paid') {
          setPaymentStatus('Paid');
          clearInterval(interval);
          setTimeout(() => {
             onPaymentSuccess();
             onClose();
          }, 2000);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [orderId, onClose, onPaymentSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Scan size={18} className="text-green-600" /> eSewa Payment QR
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center text-center">
          {paymentStatus === 'Pending' ? (
            <>
              <div className="mb-6 p-4 bg-white border-4 border-green-500 rounded-xl shadow-inner shadow-green-100 hover:scale-105 transition-transform duration-200">
                <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" title="Click to test in browser">
                  <img src={qrImageUrl} alt="Payment QR Code" className="w-[200px] h-[200px]" />
                </a>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-900 font-semibold text-lg flex items-center justify-center gap-2">
                   Scan or Click to Pay
                </p>
                <p className="text-sm text-gray-500 max-w-[200px]">
                  Ask the customer to scan this QR code with their phone.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs font-bold uppercase tracking-wider">Waiting for payment...</span>
              </div>
            </>
          ) : (
            <div className="py-10 animate-bounce">
              <CheckCircle2 size={80} className="text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">Payment Success!</h3>
              <p className="text-gray-500 mt-2">Order has been marked as paid.</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-gray-50 border-t flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium">
          <Smartphone size={12} /> WORKS BEST ON SAME WI-FI NETWORK
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;

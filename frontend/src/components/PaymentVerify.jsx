import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your payment with eSewa...');

  useEffect(() => {
    const data = searchParams.get('data');
    if (!data) {
      setStatus('error');
      setMessage('Invalid payment response from eSewa.');
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/esewa/verify/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          setStatus('success');
          setMessage(result.message || 'Payment verified successfully!');
        } else {
          setStatus('error');
          setMessage(result.error || 'Payment verification failed.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Network error during verification.');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <Loader2 className="h-16 w-16 text-indigo-500 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Verifying Payment</h2>
            <p className="text-gray-500 mt-2">{message}</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Payment Successful!</h2>
            <p className="text-gray-500 mt-2">{message}</p>
            <button 
              onClick={() => navigate('/dashboard/orders')}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Return to Orders
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Payment Failed</h2>
            <p className="text-gray-500 mt-2">{message}</p>
            <button 
              onClick={() => navigate('/dashboard/orders')}
              className="mt-6 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Return to Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentVerify;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const CustomerCheckout = () => {
    const { orderId } = useParams();
    const [status, setStatus] = useState('Initiating payment gateway...');

    useEffect(() => {
        const initiateRealPayment = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/esewa/initiate/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ order_id: orderId })
                });
                
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to initiate payment");
                
                const form = document.createElement("form");
                form.setAttribute("method", "POST");
                form.setAttribute("action", data.esewa_url);
                
                const fields = [
                    "amount", "tax_amount", "total_amount", "transaction_uuid", "product_code",
                    "product_service_charge", "product_delivery_charge", "success_url", 
                    "failure_url", "signed_field_names", "signature"
                ];
                
                fields.forEach(field => {
                    const input = document.createElement("input");
                    input.setAttribute("type", "hidden");
                    input.setAttribute("name", field);
                    input.setAttribute("value", data[field]);
                    form.appendChild(input);
                });
                
                document.body.appendChild(form);
                form.submit();
            } catch (err) {
                setStatus('Error: ' + err.message);
            }
        };

        if (orderId) initiateRealPayment();
    }, [orderId]);

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white p-6">
            <div className="flex flex-col items-center gap-4">
                <Loader2 size={48} className="animate-spin text-green-500" />
                <h1 className="text-xl font-bold">Secure Checkout</h1>
                <p className="text-gray-400">{status}</p>
            </div>
            <div className="mt-12">
                <img src="https://esewa.com.np/common/images/esewa_logo.png" alt="eSewa" className="h-8 opacity-70" />
            </div>
        </div>
    );
};

export default CustomerCheckout;

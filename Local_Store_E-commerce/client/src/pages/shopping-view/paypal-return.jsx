import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";

function PaypalReturnPage() {
    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [status, setStatus] = useState("processing"); // "processing", "error"
    const [errorMessage, setErrorMessage] = useState("");
    
    useEffect(() => {
        console.log("All URL params:", Object.fromEntries(params.entries()));
        
        const paymentId = params.get('paymentId') || params.get('token') || params.get('payment_id');
        const payerId = params.get('PayerID') || params.get('payer_id');
        
        console.log("Resolved PaymentId:", paymentId, "PayerId:", payerId);
        
        if (paymentId && payerId) {
            const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));
            
            if (!orderId) {
                setStatus("error");
                setErrorMessage("Order information not found. Please contact customer support.");
                return;
            }
            
            dispatch(capturePayment({paymentId, payerId, orderId}))
                .then(data => {
                    if (data?.payload?.success) {
                        sessionStorage.removeItem('currentOrderId');
                        window.location.href = '/shop/payment-success';
                    } else {
                        setStatus("error");
                        setErrorMessage(data?.payload?.message || "Payment processing failed. Please try again.");
                    }
                })
                .catch(err => {
                    setStatus("error");
                    setErrorMessage("An unexpected error occurred. Please try again or contact support.");
                    console.error("Payment capture error:", err);
                });
        } else {
            setStatus("error");
            setErrorMessage("Missing payment information from PayPal. Please try again.");
        }
    }, [params, dispatch]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    {status === "processing" ? (
                        <div className="flex flex-col items-center">
                            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                            <CardTitle className="text-2xl font-bold">Processing Your Payment</CardTitle>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                            <CardTitle className="text-2xl font-bold text-red-600">Payment Processing Issue</CardTitle>
                        </div>
                    )}
                </CardHeader>
                
                <CardContent className="text-center">
                    {status === "processing" ? (
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                Please wait while we confirm your payment with PayPal.
                            </p>
                            <div className="relative pt-1">
                                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                                    <div className="w-full bg-blue-500 animate-pulse"></div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">
                                This usually takes just a few moments. Please don't close this window.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-gray-700">{errorMessage}</p>
                            <div className="bg-red-50 p-4 rounded-md border border-red-100">
                                <p className="text-sm text-gray-700">
                                    If you were charged but are seeing this message, please contact our 
                                    customer support with your order details.
                                </p>
                            </div>
                            <div className="flex justify-center mt-4">
                                <button 
                                    onClick={() => window.location.href = '/shop'}
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
                                >
                                    Return to Shop
                                </button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default PaypalReturnPage;
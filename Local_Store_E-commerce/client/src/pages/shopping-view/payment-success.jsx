import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ShoppingBag, Home } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="text-green-500 h-16 w-16" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-600">Payment Successful!</CardTitle>
          <p className="text-gray-500 mt-2">Thank you for your purchase</p>
        </CardHeader>
        
        <CardContent className="pb-6">
          <div className="bg-green-50 p-4 rounded-md border border-green-100 my-4">
            <p className="text-sm text-gray-700">
              We've sent a confirmation email with your order details to your registered email address.
            </p>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Order Number:</span>
              <span className="font-medium">#ORD-29876</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method:</span>
              <span className="font-medium">Credit Card</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3">
          <Button 
            className="w-full" 
            onClick={() => navigate('/shop/account')}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            View My Orders
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/')}
          >
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
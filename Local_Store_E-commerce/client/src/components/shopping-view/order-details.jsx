import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent, DialogTitle, DialogHeader } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Package, Calendar, CreditCard, Truck, MapPin } from "lucide-react";

function ShoppingOrderDetailsView({ orderDetails }) {
    const { user } = useSelector((state) => state.auth);

    // Helper function to determine status colors
    const getStatusStyles = (status) => {
        switch(status?.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'shipped':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'delivered':
                return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    return (
        <DialogContent
            className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-200 p-0"
            aria-describedby="order-dialog-description"
        >
            {/* Hidden description for screen readers */}
            <p id="order-dialog-description" className="sr-only">
                Detailed view of the selected order including summary, items, and shipping information.
            </p>

            <DialogHeader className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-gray-100">
                <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span>Order Details</span>
                    <Badge
                        className={`ml-2 py-1 px-3 text-xs font-medium rounded-full capitalize ${getStatusStyles(orderDetails?.orderStatus)}`}
                    >
                        {orderDetails?.orderStatus || "Processing"}
                    </Badge>
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">Order ID: {orderDetails?._id || "N/A"}</p>
            </DialogHeader>

            <div className="px-6 py-4 space-y-6">
                {/* Order Summary */}
                <section className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Order Summary
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between sm:flex-col sm:justify-start">
                            <span className="text-gray-500">Order Date</span>
                            <span className="font-medium text-gray-900">
                                {orderDetails?.orderDate
                                    ? new Date(orderDetails.orderDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })
                                    : "N/A"}
                            </span>
                        </div>
                        
                        <div className="flex justify-between sm:flex-col sm:justify-start">
                            <span className="text-gray-500">Total Amount</span>
                            <span className="font-medium text-gray-900">
                                {formatCurrency(orderDetails?.totalAmount)}
                            </span>
                        </div>
                        
                        <div className="flex justify-between sm:flex-col sm:justify-start">
                            <span className="text-gray-500">Payment Method</span>
                            <span className="font-medium text-gray-900 flex items-center gap-1">
                                <CreditCard className="w-3 h-3" />
                                {orderDetails?.paymentMethod || "N/A"}
                            </span>
                        </div>
                        
                        <div className="flex justify-between sm:flex-col sm:justify-start">
                            <span className="text-gray-500">Payment Status</span>
                            <span className="font-medium text-gray-900">
                                {orderDetails?.paymentStatus || "N/A"}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Order Items */}
                <section>
                    <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Order Items ({orderDetails?.cartItems?.length || 0})
                    </h3>
                    {orderDetails?.cartItems?.length > 0 ? (
                        <ul className="space-y-3">
                            {orderDetails.cartItems.map((item, index) => (
                                <li
                                    key={item._id || index}
                                    className="flex flex-col sm:flex-row justify-between gap-2 border border-gray-200 rounded-lg p-3 text-sm hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        {item.image ? (
                                            <img 
                                                src={item.image} 
                                                alt={item.title} 
                                                className="w-12 h-12 rounded object-cover border border-gray-200"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                                <Package className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                        <span className="font-medium text-gray-800">{item.title}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0 ml-0 sm:ml-2">
                                        <div className="px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                                            Qty: {item.quantity}
                                        </div>
                                        <div className="font-semibold text-gray-900">
                                            {formatCurrency(item.price)}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 p-4 text-center bg-gray-50 rounded-lg">
                            No items in this order.
                        </p>
                    )}
                </section>

                {/* Shipping Info */}
                <section>
                    <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Shipping Information
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <p className="text-gray-500 mb-1">Name</p>
                                <p className="font-medium">{user?.userName || "Customer"}</p>
                            </div>
                            
                            <div>
                                <p className="text-gray-500 mb-1">Phone</p>
                                <p className="font-medium">{orderDetails?.addressInfo?.phone || "N/A"}</p>
                            </div>
                            
                            <div className="sm:col-span-2">
                                <p className="text-gray-500 mb-1">Address</p>
                                <p className="font-medium flex items-start gap-1">
                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <span>
                                        {orderDetails?.addressInfo?.address || "N/A"}, 
                                        {orderDetails?.addressInfo?.city || "N/A"} - {orderDetails?.addressInfo?.pincode || "N/A"}
                                    </span>
                                </p>
                            </div>
                            
                            {orderDetails?.addressInfo?.notes && (
                                <div className="sm:col-span-2">
                                    <p className="text-gray-500 mb-1">Delivery Notes</p>
                                    <p className="italic text-gray-700">"{orderDetails.addressInfo.notes}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </DialogContent>
    );
}

export default ShoppingOrderDetailsView;
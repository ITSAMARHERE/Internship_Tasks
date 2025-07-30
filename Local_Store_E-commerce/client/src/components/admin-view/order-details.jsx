import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { toast } from "sonner";


const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;
    
    if (!status || status === "placeholder") {
      alert("Please select a status");
      return;
    }

    setIsLoading(true);

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast.success("Order Updated Successfuly");
      } else {
        console.error("Failed to update order status:", data);
      }
      setIsLoading(false);
    }).catch(error => {
      console.error("Error updating order status:", error);
      setIsLoading(false);
    });
  }

  // Helper function to get badge color based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "confirmed":
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "inProcess":
      case "inShipping":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "pending":
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Truncate long text with ellipsis
  const truncateText = (text, maxLength = 20) => {
    if (!text) return "N/A";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <DialogContent className="sm:max-w-[650px] bg-white rounded-2xl shadow-lg p-0 max-h-[90vh]">
      <div className="h-[80vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
            <Badge
              className={`py-1 px-3 text-xs font-medium rounded-full capitalize ${getStatusBadgeClass(orderDetails?.orderStatus)}`}
            >
              {orderDetails?.orderStatus || "N/A"}
            </Badge>
          </div>
          
          {/* Order Summary - Compact grid layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 bg-gray-50 p-3 rounded-lg">
            <div className="text-xs sm:text-sm">
              <span className="text-gray-500 block">Order ID</span>
              <span className="font-medium text-gray-800 truncate">{truncateText(orderDetails?._id, 10)}</span>
            </div>
            <div className="text-xs sm:text-sm">
              <span className="text-gray-500 block">Date</span>
              <span className="font-medium text-gray-800">
                {orderDetails?.orderDate
                  ? new Date(orderDetails.orderDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="text-xs sm:text-sm">
              <span className="text-gray-500 block">Total</span>
              <span className="font-medium text-gray-800">
                {orderDetails?.totalAmount !== undefined
                  ? `$${parseFloat(orderDetails.totalAmount).toFixed(2)}`
                  : "$0.00"}
              </span>
            </div>
            <div className="text-xs sm:text-sm">
              <span className="text-gray-500 block">Payment</span>
              <span className="font-medium text-gray-800">{orderDetails?.paymentMethod || "N/A"}</span>
            </div>
            <div className="text-xs sm:text-sm">
              <span className="text-gray-500 block">Payment Status</span>
              <span className="font-medium text-gray-800">{orderDetails?.paymentStatus || "N/A"}</span>
            </div>
          </div>

          {/* Order Items - More compact */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Items</h3>
            {orderDetails?.cartItems && orderDetails.cartItems.length > 0 ? (
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {orderDetails.cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-md px-3 py-2 text-xs sm:text-sm"
                  >
                    <div className="flex items-center">
                      <span className="mr-2">📦</span>
                      <span className="text-gray-700 truncate max-w-32 sm:max-w-44">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>x{item.quantity}</span>
                      <span className="text-gray-800 font-medium whitespace-nowrap">
                        ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">No items in this order.</p>
            )}
          </div>

          <Separator className="my-3" />

          {/* Shipping Info - Condensed */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Shipping Information</h3>
            {orderDetails?.addressInfo ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 bg-gray-50 border border-gray-100 rounded-md p-3 text-xs sm:text-sm">
                <div className="col-span-2">
                  <span className="text-gray-500">Name:</span>{" "}
                  <span className="text-gray-700">{user?.userName || "Customer"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Address:</span>{" "}
                  <span className="text-gray-700">{orderDetails?.addressInfo?.address || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-500">City:</span>{" "}
                  <span className="text-gray-700">{orderDetails?.addressInfo?.city || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-500">Pincode:</span>{" "}
                  <span className="text-gray-700">{orderDetails?.addressInfo?.pincode || "N/A"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Phone:</span>{" "}
                  <span className="text-gray-700">{orderDetails?.addressInfo?.phone || "N/A"}</span>
                </div>
                {orderDetails?.addressInfo?.notes && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Notes:</span>{" "}
                    <span className="text-gray-700">{orderDetails.addressInfo.notes}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">No shipping information available.</p>
            )}
          </div>

          {/* Status Update Form - Simplified */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Update Status</h3>
            <CommonForm
              formControls={[
                {
                  label: "Order Status",
                  name: "status",
                  componentType: "select",
                  options: [
                    { id: "placeholder", label: "Select a status" },
                    { id: "pending", label: "Pending" },
                    { id: "inProcess", label: "In Process" },
                    { id: "inShipping", label: "In Shipping" },
                    { id: "delivered", label: "Delivered" },
                    { id: "rejected", label: "Rejected" },
                  ],
                },
              ]}
              formData={formData}
              setFormData={setFormData}
              buttonText={isLoading ? "Updating..." : "Update"}
              isLoading={isLoading}
              onSubmit={handleUpdateStatus}
            />
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
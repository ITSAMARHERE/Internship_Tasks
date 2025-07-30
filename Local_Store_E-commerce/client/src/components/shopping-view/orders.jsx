import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId(user.id));
    }
  }, [dispatch, user?.id]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return dateString.split("T")[0];
  };

  const truncateId = (id) => {
    if (!id) return "-";
    return window.innerWidth < 640 ? `...${id.slice(-8)}` : id;
  };

  return (
    <Card className="border border-gray-300 shadow-md overflow-hidden">
      <CardHeader className="border-b border-gray-300 bg-gray-50 py-4">
        <CardTitle className="text-lg md:text-xl font-semibold text-gray-800">
          Order History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-gray-100">
              <TableRow className="border-b border-gray-300">
                <TableHead className="whitespace-nowrap px-3 py-3 text-gray-700 text-sm font-medium">Order ID</TableHead>
                <TableHead className="whitespace-nowrap px-3 py-3 text-gray-700 text-sm font-medium">Date</TableHead>
                <TableHead className="whitespace-nowrap px-3 py-3 text-gray-700 text-sm font-medium">Status</TableHead>
                <TableHead className="whitespace-nowrap px-3 py-3 text-gray-700 text-sm font-medium">Price</TableHead>
                <TableHead className="whitespace-nowrap px-3 py-3 text-gray-700 text-sm font-medium">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList && orderList.length > 0 ? (
                orderList.map((orderItem) => (
                  <TableRow key={orderItem._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <TableCell className="px-3 py-3 text-sm max-w-[120px] md:max-w-none truncate">
                      <span className="hidden sm:inline">{orderItem?._id}</span>
                      <span className="sm:hidden">{truncateId(orderItem?._id)}</span>
                    </TableCell>
                    <TableCell className="px-3 py-3 text-sm whitespace-nowrap">
                      {formatDate(orderItem?.orderDate)}
                    </TableCell>
                    <TableCell className="px-3 py-3">
                      <Badge
                        className={`py-1 px-2 text-xs whitespace-nowrap capitalize text-white ${
                          orderItem?.orderStatus === "confirmed"
                            ? "bg-green-500"
                            : orderItem?.orderStatus === "rejected"
                            ? "bg-red-600"
                            : "bg-black"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-3 py-3 text-sm font-medium whitespace-nowrap">
                      ${orderItem?.totalAmount}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-right">
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          onClick={() => {
                            setOpenDetailsDialog(true);
                            handleFetchOrderDetails(orderItem?._id);
                          }}
                          variant="outline"
                          size="sm"
                          className="text-xs sm:text-sm cursor-pointer hover:bg-gray-100"
                        >
                          Details
                        </Button>
                        <ShoppingOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-sm">No orders found.</p>
                      <p className="text-xs text-gray-400">Your order history will appear here</p>  
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
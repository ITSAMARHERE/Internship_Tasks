import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetails } from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const {orderList, orderDetails} = useSelector(state=>state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId){
    dispatch(getOrderDetailsForAdmin(getId))
  }

  useEffect(()=>{
    dispatch(getAllOrdersForAdmin())
  },[dispatch])

  console.log(orderDetails, "orderDetails");

  useEffect(()=>{
    if(orderDetails !== null) setOpenDetailsDialog(true)
  },[orderDetails])

  return (
    <Card className="w-full border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">All Orders</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table className="border border-gray-200 rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Order ID</TableHead>
              <TableHead className="min-w-[120px]">Order Date</TableHead>
              <TableHead className="min-w-[120px]">Order Status</TableHead>
              <TableHead className="min-w-[100px]">Order Price</TableHead>
              <TableHead className="text-right min-w-[120px]">
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow key={orderItem._id} className="border-b border-gray-300 hover:bg-gray-50">
                    <TableCell className="border-r border-gray-300 px-4 py-2">{orderItem?._id}</TableCell>
                    <TableCell className="border-r border-gray-300 px-4 py-2">{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell className="border-r border-gray-300 px-4 py-2">
                      <Badge
                        className={`py-1 px-3 capitalize text-white ${
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
                    <TableCell className="border-r border-gray-300 px-4 py-2">${orderItem?.totalAmount}</TableCell>
                    <TableCell className="px-4 py-2">
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
                          className="text-sm cursor-pointer"
                        >
                          View Details
                        </Button>
                        <AdminOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;

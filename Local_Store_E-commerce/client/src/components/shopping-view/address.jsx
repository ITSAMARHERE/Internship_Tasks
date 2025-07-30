import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { toast } from "sonner";
import { PlusCircle, Edit2 } from "lucide-react";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  const isFormValid = () =>
    Object.values(formData).every((val) => val.trim() !== "");

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch, user?.id]);

  const handleManageAddress = (event) => {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast("You can add max 3 addresses", {
        style: { background: "#ef4444", color: "white" },
      });
      return;
    }

    const payload = {
      userId: user?.id,
      ...(currentEditedId !== null
        ? { addressId: currentEditedId, formData }
        : { ...formData }),
    };

    const action =
      currentEditedId !== null
        ? editaAddress(payload)
        : addNewAddress(payload);

    dispatch(action).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast.success(
          currentEditedId !== null
            ? "Address updated successfully"
            : "Address added successfully"
        );
        setFormData(initialAddressFormData);
        setCurrentEditedId(null);
      }
    });
  };

  const handleDeleteAddress = (address) => {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: address._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast.success("Address deleted successfully");
      }
    });
  };

  const handleEditAddress = (address) => {
    setCurrentEditedId(address._id);
    setFormData({
      address: address?.address || "",
      city: address?.city || "",
      phone: address?.phone || "",
      pincode: address?.pincode || "",
      notes: address?.notes || "",
    });
    
    // Scroll to form section for better UX
    setTimeout(() => {
      document.getElementById("address-form").scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Address List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800">Your Addresses</h2>
          <span className="text-sm text-gray-500">
            {addressList?.length || 0}/3 addresses
          </span>
        </div>

        {/* Empty State */}
        {(!addressList || addressList.length === 0) && (
          <div className="flex flex-col items-center justify-center py-8 px-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 mb-2">No addresses found</p>
            <p className="text-sm text-gray-400 mb-4">Add an address to continue</p>
          </div>
        )}

        {/* Address Cards */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {addressList?.map((item) => (
            <div
              key={item._id}
              className="h-full"
            >
              <AddressCard
                selectedId={selectedId}
                addressInfo={item}
                handleEditAddress={handleEditAddress}
                handleDeleteAddress={handleDeleteAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Address Form */}
      <Card id="address-form" className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
          <div className="flex items-center gap-2">
            {currentEditedId ? (
              <Edit2 className="h-5 w-5 text-blue-600" />
            ) : (
              <PlusCircle className="h-5 w-5 text-blue-600" />
            )}
            <CardTitle className="text-xl font-semibold text-gray-800">
              {currentEditedId ? "Edit Address" : "Add New Address"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <CommonForm
            formControls={addressFormControls}
            formData={formData}
            setFormData={setFormData}
            buttonText={currentEditedId ? "Update Address" : "Save Address"}
            onSubmit={handleManageAddress}
            isBtnDisabled={!isFormValid()}
            buttonClassName="bg-blue-600 hover:bg-blue-700 text-white"
            inputClassName="focus:ring-blue-500 focus:border-blue-500"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default Address;
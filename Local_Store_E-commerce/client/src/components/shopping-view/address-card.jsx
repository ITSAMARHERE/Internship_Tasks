import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { MapPin, Edit, Trash2 } from "lucide-react";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer transition-all duration-300 h-full ${
        isSelected
          ? "border-2 border-gray-900 bg-gray-50"
          : "border border-gray-200 hover:border-gray-400"
      }`}
    >
      <CardContent className="p-4 flex flex-col h-40">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
          <div className="flex-1 text-sm text-gray-800">
            <div className="grid gap-1">
              <div>
                <span className="font-medium text-gray-700">Address:</span> {addressInfo?.address}
              </div>
              <div>
                <span className="font-medium text-gray-700">City:</span> {addressInfo?.city}
              </div>
              <div>
                <span className="font-medium text-gray-700">Pincode:</span> {addressInfo?.pincode}
              </div>
              <div>
                <span className="font-medium text-gray-700">Phone:</span> {addressInfo?.phone}
              </div>
              {addressInfo?.notes && (
                <div>
                  <span className="font-medium text-gray-700">Notes:</span> {addressInfo?.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-2 pt-0 flex justify-center gap-2 mt-6">



        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
        >
          <Edit className="h-4 w-4 " />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
        >
          <Trash2 className="h-4 w-4 " />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
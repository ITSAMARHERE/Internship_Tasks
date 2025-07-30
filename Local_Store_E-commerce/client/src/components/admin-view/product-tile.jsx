import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete
}) {
  return (
    <Card className="w-full max-w-md mx-auto border border-gray-200 rounded-2xl overflow-hidden transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg flex flex-col">
      
      {/* Image Section */}
      <div className="relative w-full">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-[220px] object-cover block rounded-t-2xl"
        />
      </div>

      {/* Content Section */}
      <CardContent className="p-4 flex-grow text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-1 truncate">
          {product?.title}
        </h2>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {product?.description}
        </p>

        <div className="flex justify-center items-center mt-2">
          <span className="text-md font-semibold text-primary">
            ${product?.price}
          </span>
        </div>
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="flex justify-between px-4 pb-4 mt-auto">
        <Button
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData(product);
          }}
          className="bg-gray-900 text-white hover:bg-gray-700 cursor-pointer"
        >
          Edit
        </Button>
        <Button
          onClick={() => handleDelete(product?._id)}
          className="bg-red-600 text-white hover:bg-red-500 cursor-pointer"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTile;

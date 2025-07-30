import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const initialFormData = {
    image: null,
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "",
};

function AdminProducts() {
    const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const [currentEditedId, setCurrentEditedId] = useState(null); // Track if editing or adding a new product
    const { productList } = useSelector(state => state.adminProducts);
    const dispatch = useDispatch();

    // Reset the form when adding a new product or editing
    const resetForm = () => {
        setFormData(initialFormData); // Reset form fields
        setUploadedImageUrl(''); // Clear image URL
        setImageFile(null); // Clear image file
        setImageLoadingState(false); // Reset loading state
    };

    // Handle the form submission
    function onSubmit(event) {
        event.preventDefault();

        currentEditedId !== null ?
            dispatch(editProduct({
                id: currentEditedId, // Ensure this is NOT undefined
                formData
            })).then((data) => {
                console.log(data, "edit");

                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setFormData(initialFormData);
                    setOpenCreateProductsDialog(false);
                    setCurrentEditedId(null);
                }
            }) :
            dispatch(addNewProduct({
                ...formData,
                image: uploadedImageUrl // Ensure the image is passed to the product data
            })).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setOpenCreateProductsDialog(false);
                    resetForm(); // Clear form data after submitting
                    toast.success("Product added successfully!");
                }
            });
    }

    // Open dialog and handle whether it's a new product or editing an existing one
    const handleOpenDialog = (product = null) => {
        setOpenCreateProductsDialog(true);
        if (product) {
            setCurrentEditedId(product.id);
            setFormData({
                title: product.title,
                description: product.description,
                category: product.category,
                brand: product.brand,
                price: product.price,
                salePrice: product.salePrice,
                totalStock: product.totalStock,
                image: product.image,
            });
            setUploadedImageUrl(product.image); // Set the image if editing an existing product
        } else {
            setCurrentEditedId(null); // For adding new product, reset edited ID
            resetForm(); // Reset form data when adding a new product
        }
    };

    function handleDelete(getCurrentProductId) {
        dispatch(deleteProduct(getCurrentProductId)).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
          }
        });
      }

    function isFormValid() {
        return Object.keys(formData).map(key => formData[key] !== '').every(item => item);
    }

    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    console.log(formData)

    return (
        <Fragment>
            {/* Add New Product Button */}
            <div className="mb-10 w-full flex justify-end"> {/* Increased margin-bottom for button visibility */}
                <Button
                    onClick={() => handleOpenDialog()} // Open dialog for adding new product
                    className="bg-black hover:bg-gray-800 cursor-pointer text-white px-6 py-3 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 border-none"
                >
                    + Add New Product
                </Button>
            </div>

            {/* Product Grid */}
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                {productList && productList.length > 0
                    ? productList.map(productItem => <AdminProductTile
                        setFormData={setFormData}
                        setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                        setCurrentEditedId={setCurrentEditedId}
                        product={productItem}
                        handleDelete={handleDelete}
                    />)
                    : <p className="text-center text-lg text-gray-500">No products available.</p>
                }
            </div>

            {/* Sidebar for Adding or Editing Products */}
            <Sheet open={openCreateProductsDialog} onOpenChange={setOpenCreateProductsDialog}>
                <SheetContent
                    side="right"
                    className="bg-white shadow-2xl w-[400px] p-6 rounded-lg h-full overflow-y-auto transition-all duration-500 border-none"
                >
                    {/* Header */}
                    <SheetHeader className="pb-4 sticky top-1 bg-white z-10">
                        <SheetTitle className="text-3xl font-semibold text-gray-800">
                            {currentEditedId !== null ?
                                'Edit Product' : 'Add New Product'
                            }
                        </SheetTitle>
                    </SheetHeader>

                    {/* Image Upload */}
                    <div className="mb-6">
                        <ProductImageUpload
                            imageFile={imageFile}
                            setImageFile={setImageFile}
                            uploadedImageUrl={uploadedImageUrl}
                            setUploadedImageUrl={setUploadedImageUrl}
                            setImageLoadingState={setImageLoadingState}
                            imageLoadingState={imageLoadingState}
                            isEditMode={currentEditedId !== null}
                        />
                        {/* Image Display with Improved Size */}
                        {uploadedImageUrl && (
                            <div className="mt-4 w-full flex justify-center">
                                <img
                                    src={uploadedImageUrl}
                                    alt="Uploaded"
                                    className="max-w-full h-auto rounded-lg shadow-md"
                                    style={{ maxWidth: "100%", maxHeight: "450px", objectFit: "contain" }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Form Section */}
                    <div className="py-6 space-y-4">
                        <CommonForm
                            onSubmit={onSubmit}
                            formData={formData}
                            setFormData={setFormData}
                            buttonText={currentEditedId !== null ? 'Edit' : 'Add'}
                            formControls={addProductFormElements}
                            isBtnDisabled={!isFormValid()}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </Fragment>
    );
}

export default AdminProducts;

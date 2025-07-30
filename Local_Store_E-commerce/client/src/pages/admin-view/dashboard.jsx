import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages, removeFeatureImage } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash } from "lucide-react";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList, isLoading } = useSelector((state) => state.commonFeature);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) return;
    
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  function handleDeleteImage(id) {
    if (confirm("Are you sure you want to delete this image?")) {
      setIsDeleting(true);
      dispatch(removeFeatureImage(id)).then(() => {
        dispatch(getFeatureImages()).finally(() => {
          setIsDeleting(false);
        });
      });
    }
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Feature Images Management</h1>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
         
          
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isCustomStyling={true}
          />
          
          <Button 
            onClick={handleUploadFeatureImage} 
            className="mt-5 w-full bg-blue-600 hover:bg-blue-700"
            disabled={!uploadedImageUrl || imageLoadingState || isLoading}
          >
            {imageLoadingState || isLoading ? "Processing..." : "Upload Image"}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center justify-between">
          <span>Feature Image Gallery</span>
          {isLoading && <span className="text-sm font-normal text-gray-500">Loading...</span>}
        </h2>
        
        {!featureImageList || featureImageList.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No feature images have been uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureImageList.map((featureImgItem) => (
              <div key={featureImgItem._id} className="relative group bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-all hover:shadow-md">
                <div className="h-64 overflow-hidden">
                  <img
                    src={featureImgItem.image}
                    alt="Feature Image"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3 flex justify-between items-center bg-gray-50">
                  <span className="text-sm text-gray-500 truncate">
                    {new Date(featureImgItem.createdAt).toLocaleDateString()}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteImage(featureImgItem._id)}
                    disabled={isDeleting || isLoading}
                  >
                    <Trash size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
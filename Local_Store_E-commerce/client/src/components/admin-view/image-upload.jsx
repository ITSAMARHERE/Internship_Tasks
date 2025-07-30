import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { useEffect, useRef } from "react";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";


function ProductImageUpload({ imageFile, setImageFile, uploadedImageUrl, setUploadedImageUrl,imageLoadingState,setImageLoadingState,isEditMode, isCustomStyling = false }) {
    const inputRef = useRef(null)

    function handleImageFileChange(event) {
        console.log(event.target.files, "event.target.files");
        const selectedFile = event.target.files?.[0];
        console.log(selectedFile);

        if (selectedFile) setImageFile(selectedFile);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) setImageFile(droppedFile);
    }

    function handleRemoveImage() {
        setImageFile(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    console.log(imageFile)

    async function uploadImageToCloudinary(){
        setImageLoadingState(true)
        const data = new FormData();
        data.append('my_file', imageFile)
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`, data);
        console.log(response, 'response');
        if(response.data?.success) {
            setUploadedImageUrl(response.data.result.url);
            setImageLoadingState(false);
        }
    }

    useEffect(() => {
        if(imageFile !== null) uploadImageToCloudinary()
    },[imageFile]);

    return (
        <div className={`w-full  ${isCustomStyling ? '' : 'max-w-md mx-auto'}`}>
            <Label className="text-lg font-semibold mb-2 block">
                Upload Image
            </Label>
            <div onDragOver={handleDragOver} onDrop={handleDrop}
             className={`${
                isEditMode ? "opacity-60" : ""
             }border-2, border-dashed rounded-lg p-4`}
            >
                <Input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    ref={inputRef}
                    onChange={handleImageFileChange}
                    disabled={isEditMode}
                />
                {
                    !imageFile ? (
                        <Label
                            htmlFor="image-upload"
                            className={`${
                                isEditMode? 'cursor-not-allowed' : ''
                            }
                             flex flex-col items-center justify-center h-36 w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition-all ease-in-out duration-200 shadow-sm`}
                        >
                            <UploadCloudIcon className="w-12 h-12 text-gray-500 mb-3" />
                            <span className="text-gray-700 font-medium">Click to Upload or Drag & Drop</span>
                            <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (max. 2MB)</span>
                        </Label>
                    ) : (
                        imageLoadingState ?
                        <Skeleton className="h-12 w-full bg-gray-200 rounded-lg" />
                        :
                        <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
                        {/* File Icon & Name */}
                        <div className="flex items-center space-x-3">
                            <FileIcon className="w-6 h-6 text-blue-600" />
                            <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{imageFile.name}</p>
                        </div>
                
                        {/* Remove Button */}
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-gray-500 hover:text-red-500 transition-all duration-200"
                            onClick={handleRemoveImage}
                        >
                            <XIcon className="w-5 h-5" />
                            <span className="sr-only">Remove File</span>
                        </Button>
                    </div>

                    )}
            </div>
        </div>
    );
}

export default ProductImageUpload;
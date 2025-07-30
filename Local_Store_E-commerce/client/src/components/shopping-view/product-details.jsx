import { StarIcon, ShoppingCartIcon, CheckCircleIcon, XCircleIcon, MessageSquareIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import StarRatingComponent from "../common/star.rating";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
    const [reviewMsg, setReviewMsg] = useState("");
    const [rating, setRating] = useState(0);
    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);
    const { reviews } = useSelector((state) => state.shopReview);

    function handleRatingChange(getRating) {
        setRating(getRating);
    }

    function handleAddToCart(getCurrentProductId, getTotalStock) {
        let getCartItems = cartItems.items || [];
        setIsAdding(true);

        if (getCartItems.length) {
            const indexOfCurrentItem = getCartItems.findIndex(
                (item) => item.productId === getCurrentProductId
            );
            if (indexOfCurrentItem > -1) {
                const getQuantity = getCartItems[indexOfCurrentItem].quantity;
                if (getQuantity + 1 > getTotalStock) {
                    toast({
                        title: `Only ${getQuantity} quantity can be added for this item`,
                        variant: "destructive",
                    });
                    setIsAdding(false);
                    return;
                }
            }
        }
        dispatch(
            addToCart({
                userId: user?.id,
                productId: getCurrentProductId,
                quantity: 1,
            })
        ).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id));
                toast.success("Product is added to cart");
            }
            setTimeout(() => setIsAdding(false), 500);
        });
    }

    function handleDialogClose() {
        setOpen(false);
        dispatch(setProductDetails());
        setRating(0);
        setReviewMsg("");
    }

    function handleAddReview() {
        setIsSubmitting(true);
        dispatch(
            addReview({
                productId: productDetails?._id,
                userId: user?.id,
                userName: user?.userName,
                reviewMessage: reviewMsg,
                reviewValue: rating,
            })
        ).then((data) => {
            if (data.payload.success) {
                setRating(0);
                setReviewMsg("");
                dispatch(getReviews(productDetails?._id));
                toast.success("Review added successfully!");
            }
            setTimeout(() => setIsSubmitting(false), 500);
        });
    }

    useEffect(() => {
        if (productDetails !== null) dispatch(getReviews(productDetails?._id));
    }, [productDetails]);

    const averageReview =
        reviews && reviews.length > 0
            ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
              reviews.length
            : 0;

    if (!productDetails) return null;

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="flex flex-col lg:flex-row bg-white p-0 rounded-xl shadow-lg border border-gray-200 max-w-[95vw] sm:max-w-[85vw] lg:max-w-[85vw] xl:max-w-[75vw] max-h-[90vh] overflow-hidden">
                {/* Image Section */}
                <div className="w-full lg:w-2/5 h-48 sm:h-64 lg:h-auto relative group">
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>
                    <img
                        src={productDetails?.image}
                        alt={productDetails?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {productDetails?.salePrice > 0 && (
                        <div className="absolute top-2 right-2">
                            <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                Sale
                            </span>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-3/5 flex flex-col p-4 lg:p-6 overflow-y-auto max-h-[60vh] lg:max-h-[80vh]">
                    <div className="flex justify-between items-start">
                        <h1 className="text-lg sm:text-xl font-bold text-gray-900 group">
                            {productDetails?.title}
                            <div className="h-0.5 w-0 group-hover:w-full bg-indigo-500 transition-all duration-300"></div>
                        </h1>
                        <div className="flex items-center gap-1 bg-gradient-to-r from-amber-100 to-yellow-100 px-2 py-0.5 rounded-full shadow-sm">
                            <StarIcon className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-medium">{averageReview.toFixed(1)}</span>
                        </div>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">{productDetails?.description}</p>
                    
                    <div className="flex flex-wrap gap-4 mt-3">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 uppercase tracking-wide">Price</span>
                            <div className="flex items-center gap-2">
                                <p
                                    className={`text-base sm:text-lg font-semibold relative ${
                                        productDetails?.salePrice > 0 ? "line-through text-gray-400" : "text-gray-900"
                                    }`}
                                >
                                    ${productDetails?.price}
                                </p>
                                {productDetails?.salePrice > 0 && (
                                    <p className="text-base sm:text-lg font-bold text-green-600 flex items-center">
                                        ${productDetails?.salePrice}
                                        <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                                            {Math.round((1 - productDetails?.salePrice / productDetails?.price) * 100)}% off
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 uppercase tracking-wide">Stock</span>
                            <span className={`text-xs sm:text-sm font-medium flex items-center gap-1 ${productDetails?.totalStock > 0 ? "text-green-600" : "text-red-500"}`}>
                                {productDetails?.totalStock > 0 ? (
                                    <>
                                        <CheckCircleIcon className="h-3 w-3" />
                                        {productDetails?.totalStock} available
                                    </>
                                ) : (
                                    <>
                                        <XCircleIcon className="h-3 w-3" />
                                        Out of stock
                                    </>
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    {productDetails?.totalStock === 0 ? (
                        <Button className="w-full mt-4 h-9 opacity-60 cursor-not-allowed bg-gray-300 hover:bg-gray-300 text-gray-700 text-sm" disabled>
                            Out of Stock
                        </Button>
                    ) : (
                        <Button
                            className="w-full mt-4 h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm relative overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg"
                            onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
                            disabled={isAdding}
                        >
                            <span className={`flex items-center justify-center gap-1.5 transition-transform duration-300 ${isAdding ? "-translate-y-8" : "translate-y-0"}`}>
                                <ShoppingCartIcon className="h-3.5 w-3.5" />
                                Add to Cart
                            </span>
                            <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isAdding ? "translate-y-0" : "translate-y-8"}`}>
                                Adding...
                            </span>
                        </Button>
                    )}

                    <Separator className="my-4" />

                    {/* Reviews Section */}
                    <div className="mt-2">
                        <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1">
                            <MessageSquareIcon className="h-3.5 w-3.5 text-indigo-500" />
                            <span>Customer Reviews</span>
                            <span className="text-xs text-gray-500 font-normal rounded-full bg-gray-100 px-1.5 py-0.5 ml-1">
                                {reviews?.length || 0}
                            </span>
                        </h2>
                        
                        <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {reviews && reviews.length > 0 ? (
                                reviews.map((reviewItem, idx) => (
                                    <div key={idx} className="flex gap-2 p-2 rounded-lg bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 transition-all duration-200 shadow-sm hover:shadow">
                                        <Avatar className="w-7 h-7 border ring-1 ring-white shadow-sm shrink-0">
                                            <AvatarFallback className="bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 text-xs">
                                                {reviewItem?.userName[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <h3 className="font-medium text-xs sm:text-sm text-gray-900">{reviewItem?.userName}</h3>
                                            <div className="flex gap-0.5 my-0.5">
                                                <StarRatingComponent rating={reviewItem?.reviewValue} />
                                            </div>
                                            <p className="text-xs text-gray-600 break-words">
                                                {reviewItem.reviewMessage}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 border border-dashed border-gray-200 rounded-lg bg-gray-50">
                                    <p className="text-xs text-gray-500">No reviews yet. Be the first to review this product!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Add Review Section */}
                    <div className="mt-4 flex flex-col gap-2 pt-2 border-t border-gray-200">
                        <Label className="text-xs sm:text-sm text-gray-700 font-medium flex items-center gap-1">
                            <StarIcon className="h-3.5 w-3.5 text-indigo-500" />
                            Write a Review
                        </Label>
                        <div className="flex gap-1 bg-gradient-to-r from-gray-50 to-gray-100 p-1.5 rounded-lg">
                            <StarRatingComponent
                                rating={rating}
                                handleRatingChange={handleRatingChange}
                            />
                            <span className="text-xs text-gray-500 self-center ml-1">
                                {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
                            </span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 items-end">
                            <Input
                                value={reviewMsg}
                                onChange={(e) => setReviewMsg(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-9 text-sm shadow-sm flex-grow"
                            />
                            <Button
                                onClick={handleAddReview}
                                disabled={reviewMsg.trim() === "" || rating === 0 || isSubmitting}
                                className="h-9 text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-300 relative overflow-hidden shadow-md w-full sm:w-auto"
                            >
                                <span className={`flex items-center justify-center transition-transform duration-300 ${isSubmitting ? "-translate-y-8" : "translate-y-0"}`}>
                                    Submit Review
                                </span>
                                <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isSubmitting ? "translate-y-0" : "translate-y-8"}`}>
                                    Submitting...
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ProductDetailsDialog;
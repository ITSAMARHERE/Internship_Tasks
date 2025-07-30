import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "sonner";

function UserCartItemsContent({ cartItem }) {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.shopCart);
    const { productList } = useSelector((state) => state.shopProducts);

    const handleUpdateQuantity = (getCartItem, typeOfAction) => {
        if(typeOfAction == 'plus'){
            let getCartItems = cartItems.items || [];

            if (getCartItems.length) {
                const indexOfCurrentCartItem = getCartItems.findIndex(item => item.productId === getCartItem?.productId);
                const getCurrentProductIndex = productList.findIndex(product=> product._id === getCartItem?.productId)
                const getTotalStock = productList[getCurrentProductIndex].totalStock
                if (indexOfCurrentCartItem > -1) {
                    const getQuantity = getCartItems[indexOfCurrentCartItem].quantity
                    if (getQuantity + 1 > getTotalStock) {
                        toast.error(`Only ${getQuantity} quantity can be added for this item`);
                        return;
                    }
                }
            } 
        }

        dispatch(
            updateCartQuantity({
                userId: user?.id,
                productId: getCartItem?.productId,
                quantity:
                    typeOfAction === "plus"
                        ? getCartItem?.quantity + 1
                        : getCartItem?.quantity - 1,
            })
        ).then((data) => {
            if (data?.payload?.success) {
                toast.success("Cart item is updated successfully");
            }
        });
    };

    const handleCartItemDelete = (getCartItem) => {
        dispatch(
            deleteCartItem({
                userId: user?.id,
                productId: getCartItem?.productId,
            })
        ).then((data) => {
            if (data?.payload?.success) {
                toast.success("Cart item is deleted successfully");
            }
        });
    };

    // Calculate price for display
    const itemPrice = cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price;
    const totalPrice = (itemPrice * cartItem?.quantity).toFixed(2);

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 md:p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-all duration-200">
            {/* Product Image with responsive sizing */}
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <img
                    src={cartItem?.image}
                    alt={cartItem?.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border flex-shrink-0"
                />
                
                {/* Title - visible on mobile, hidden on larger screens */}
                <div className="flex-1 min-w-0 sm:hidden">
                    <h3 className="font-medium text-base md:text-lg truncate">{cartItem?.title}</h3>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                        ${itemPrice.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Title - hidden on mobile, visible on larger screens */}
            <div className="hidden sm:block flex-1 min-w-0 px-2">
                <h3 className="font-medium text-base md:text-lg truncate">{cartItem?.title}</h3>
                <p className="text-sm text-gray-500 mt-1 hidden md:block">
                    ${itemPrice.toFixed(2)} each
                </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-1 mt-2 sm:mt-0">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-gray-50 hover:bg-gray-100"
                    disabled={cartItem?.quantity === 1}
                    onClick={() => handleUpdateQuantity(cartItem, "minus")}
                    aria-label="Decrease quantity"
                >
                    <Minus className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
                <span className="text-sm md:text-base font-medium w-8 text-center">{cartItem?.quantity}</span>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-gray-50 hover:bg-gray-100"
                    onClick={() => handleUpdateQuantity(cartItem, "plus")}
                    aria-label="Increase quantity"
                >
                    <Plus className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
            </div>

            {/* Price & Delete with better alignment */}
            <div className="flex justify-between items-center w-full sm:w-auto sm:flex-col sm:items-end mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <p className="font-semibold text-base md:text-lg text-black">
                    ${totalPrice}
                </p>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1 h-auto"
                    onClick={() => handleCartItemDelete(cartItem)}
                    aria-label="Remove from cart"
                >
                    <Trash className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
            </div>
        </div>
    );
}

export default UserCartItemsContent;
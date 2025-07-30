import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { ShoppingBag, ArrowRight } from "lucide-react";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
    const navigate = useNavigate();

    // Calculate total cart amount
    const totalCartAmount = cartItems && cartItems.length > 0 ? 
        cartItems.reduce((sum, currentItem) => sum + (
            currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price
        ) * currentItem?.quantity, 0) : 0;

    // Calculate total number of items
    const totalItems = cartItems && cartItems.length > 0 ?
        cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0;

    return (
        <SheetContent 
            className="sm:max-w-md md:max-w-lg w-full p-0 flex flex-col h-full border-l bg-white"
            aria-labelledby="cart-title" 
            aria-describedby="cart-description"
        >
            <SheetHeader className="px-4 pt-6 pb-4 border-b bg-white">
                <div className="flex items-center justify-between">
                    <SheetTitle id="cart-title" className="text-xl font-bold flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Your Cart
                        {totalItems > 0 && (
                            <span className="ml-2 text-sm font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                {totalItems} {totalItems === 1 ? 'item' : 'items'}
                            </span>
                        )}
                    </SheetTitle>
                </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto py-2 bg-white">
                <div id="cart-description" className="px-4 space-y-3">
                    {/* Check if cartItems are present and not empty */}
                    {cartItems && cartItems.length > 0 ? (
                        <div className="space-y-3 mt-2">
                            {cartItems.map((item, index) => (
                                <UserCartItemsContent key={index} cartItem={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center bg-white">
                            <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-gray-500 mb-2">Your cart is currently empty</p>
                            <Button 
                                variant="outline" 
                                onClick={() => setOpenCartSheet(false)}
                                className="mt-4"
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {cartItems && cartItems.length > 0 && (
                <SheetFooter className="border-t p-4 mt-auto space-y-4 bg-white">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span>${totalCartAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Shipping</span>
                            <span>Calculated at checkout</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-100">
                            <span className="font-bold text-lg">Total</span>
                            <span className="font-bold text-lg">${totalCartAmount.toFixed(2)}</span>
                        </div>
                    </div>
                    <Button
                        onClick={() => {
                            navigate('/shop/checkout');
                            setOpenCartSheet(false);
                        }}
                        className="w-full py-6 font-medium text-base flex items-center justify-center gap-2 hover:bg-gray-800"
                    >
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                    
                </SheetFooter>
            )}
        </SheetContent>
    );
}

export default UserCartWrapper;
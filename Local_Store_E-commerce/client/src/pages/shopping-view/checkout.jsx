import Address from '@/components/shopping-view/address';
import img from '../../assets/account.jpg';
import { useDispatch, useSelector } from 'react-redux';
import UserCartItemsContent from '@/components/shopping-view/cart-items-content';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { createNewOrder } from '@/store/shop/order-slice';
import { toast } from "sonner";
import { ShoppingBag, MapPin, CreditCard } from 'lucide-react';

function ShoppingCheckout() {
    const { cartItems } = useSelector(state => state.shopCart);
    const { user } = useSelector(state => state.auth);
    const { approvalURL } = useSelector(state => state.shopOrder);
    const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
    const [isPaymentStart, setIsPaymentStart] = useState(false);
    const dispatch = useDispatch();
    
    const totalCartAmount =
        cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.reduce(
                (sum, currentitem) =>
                    sum +
                    ((currentitem?.salePrice > 0 ? currentitem.salePrice : currentitem.price) *
                        currentitem.quantity),
                0
            )
            : 0;

    function handleInitiatePaypalPayment() {
        if(!cartItems.items || cartItems.items.length === 0){
            toast.error("Your cart is empty. Please add items to proceed", {
                variant: 'destructive'
            });
            return;
        }

        if(currentSelectedAddress === null){
            toast.error("Please select one address to proceed.", {
                variant: 'destructive'
            });
            return;
        }

        const orderData = {
            userId: user?.id,
            cartId: cartItems?._id,
            cartItems: cartItems.items.map(singleCartItem => ({
                productId: singleCartItem?.productId,
                title: singleCartItem?.title,
                image: singleCartItem?.image,
                price: singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price,
                quantity: singleCartItem?.quantity,
            })),
            addressInfo: {
                addressId: currentSelectedAddress?._id,
                address: currentSelectedAddress?.address,
                city: currentSelectedAddress?.city,
                pincode: currentSelectedAddress?.pincode,
                phone: currentSelectedAddress?.phone,
                notes: currentSelectedAddress?.notes,
            },
            orderStatus: 'pending',
            paymentMethod: 'paypal',
            paymentStatus: 'pending',
            totalAmount: totalCartAmount,
            orderDate: new Date(),
            orderUpdateDate: new Date(),
            paymentId: '',
            payerId: '',
        };

        dispatch(createNewOrder(orderData)).then((data) => {
            if(data?.payload?.success){
                setIsPaymentStart(true);
            } else {
                setIsPaymentStart(false);
            }
        });       
    }

    if(approvalURL){
        window.location.href = approvalURL;
    }

    return (
        <div className="flex flex-col bg-gray-50 min-h-screen">
            {/* Hero Section with Parallax Effect */}
            <div className="relative h-40 md:h-60 lg:h-72 w-full overflow-hidden">
                <div className="absolute inset-0 transform scale-110">
                    <img
                        src={img}
                        className="h-full w-full object-cover object-center transition-transform duration-500"
                        alt="Checkout Banner"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg">
                            Checkout
                        </h1>
                        <p className="text-gray-100 mt-2 max-w-md mx-auto">
                            Complete your purchase
                        </p>
                    </div>
                </div>
            </div>

            {/* Checkout Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Column - Address */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="text-blue-600" size={20} />
                                <h2 className="text-xl font-semibold">Shipping Address</h2>
                            </div>
                            <Address 
                                selectedId={currentSelectedAddress} 
                                setCurrentSelectedAddress={setCurrentSelectedAddress} 
                            />
                        </div>
                    </div>

                    {/* Right Column - Cart */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <ShoppingBag className="text-blue-600" size={20} />
                                <h2 className="text-xl font-semibold">Your Cart</h2>
                            </div>

                            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 pr-1">
                                {cartItems?.items?.length > 0 ? (
                                    <div className="space-y-4">
                                        {cartItems.items.map((item, index) => (
                                            <UserCartItemsContent key={index} cartItem={item} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <ShoppingBag className="mx-auto text-gray-300" size={48} />
                                        <p className="text-gray-500 mt-4">Your cart is empty.</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 space-y-3">
                                <div className="flex justify-between pt-4 border-t border-dashed text-lg font-semibold">
                                    <span>Total:</span>
                                    <span className="text-blue-600">${totalCartAmount.toFixed(2)}</span>
                                </div>

                                <div className="w-full">
                                    <Button
                                        onClick={handleInitiatePaypalPayment}
                                        disabled={isPaymentStart}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base py-2 rounded-md flex items-center justify-center gap-2 transition-all">
                                        <CreditCard size={18} />
                                        {isPaymentStart ? 'Processing Payment...' : 'Checkout with PayPal'}
                                    </Button>
                                </div>

                                <p className="text-xs text-center text-gray-500 mt-2">
                                    Your payment information is processed securely.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShoppingCheckout;
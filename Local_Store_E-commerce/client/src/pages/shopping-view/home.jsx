import { Button } from '@/components/ui/button'
import { Shirt, Baby, Watch, Footprints, ShoppingBag, Activity, TrendingUp, Flame, Gem, Star, Crown, ChevronLeft, ChevronRight, ArrowRight, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react";
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/products-slice'
import ShoppingProducTile from '@/components/shopping-view/product-tile'
import { useNavigate } from 'react-router-dom'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { toast } from "sonner";
import ProductDetailsDialog from '@/components/shopping-view/product-details'
import { getFeatureImages } from '@/store/common-slice';

const categoriesWithIcon = [
    { id: "men", label: "Men", icon: Shirt },
    { id: "women", label: "Women", icon: ShoppingBag },
    { id: "kids", label: "Kids", icon: Baby },
    { id: "accessories", label: "Accessories", icon: Watch },
    { id: "footwear", label: "Footwear", icon: Footprints },
];

const brandsWithIcon = [
    { id: "nike", label: "Nike", icon: Activity },
    { id: "adidas", label: "Adidas", icon: TrendingUp },
    { id: "puma", label: "Puma", icon: Flame },
    { id: "levi", label: "Levi's", icon: Gem },
    { id: "zara", label: "Zara", icon: Star },
    { id: "h&m", label: "H&M", icon: Crown },
];

function ShoppingHome() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { productList, productDetails } = useSelector((state) => state.shopProducts);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { featureImageList } = useSelector((state) => state.commonFeature);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState(false);
    const carouselRef = useRef(null);

    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleNavigateToListingPage = (item, section) => {
        sessionStorage.removeItem('filters');
        sessionStorage.setItem('filters', JSON.stringify({ [section]: [item.id] }));
        navigate('/shop/listing');
    };

    function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId));
    }

    function handleAddtoCart(getCurrentProductId) {
        dispatch(
            addToCart({
                userId: user?.id,
                productId: getCurrentProductId,
                quantity: 1,
            })
        ).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id));
                toast.success("Product added to cart");
            }
        });
    }

    const handleViewAllProducts = () => {
        navigate('/shop/listing');
    };

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        setIsNewsletterSubmitted(true);
        toast.success("Thanks for subscribing to our newsletter!");
    };

    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true);
    }, [productDetails]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % featureImageList.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [featureImageList]);

    useEffect(() => {
        dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: 'price-lowtohigh' }));
        dispatch(getFeatureImages());
    }, [dispatch]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

      
        handleResize();
     
        window.addEventListener('resize', handleResize);
        
      
        return () => window.removeEventListener('resize', handleResize);
    }, []);

  
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolling(window.scrollY > 50);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero Banner Carousel with Overlay Text */}
            <div className="relative w-full h-64 md:h-96 lg:h-[600px] overflow-hidden">
                {featureImageList && featureImageList.length > 0 ? featureImageList.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                        <img
                            src={slide?.image}
                            alt={`Banner ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24">
                            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 max-w-xl">
                                {slide?.title || "Season's New Arrivals"}
                            </h1>
                            <p className="text-sm md:text-base text-white/90 mb-6 max-w-md">
                                {slide?.description || "Discover the latest fashion trends and styles that define this season."}
                            </p>
                            <div>
                                <Button 
                                    className="bg-white text-gray-800 hover:bg-gray-100 shadow-lg" 
                                    onClick={handleViewAllProducts}
                                >
                                    Shop Now
                                </Button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">Loading carousel...</p>
                    </div>
                )}
                
                {/* Carousel Controls */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
                    {featureImageList && featureImageList.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? 'bg-white w-4' : 'bg-white/50'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
                
                <Button variant="outline" size="icon"
                    onClick={() => setCurrentSlide((currentSlide - 1 + featureImageList.length) % featureImageList.length)}
                    className="absolute top-1/2 left-2 md:left-6 transform -translate-y-1/2 bg-white/70 hover:bg-white shadow-md rounded-full"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
                </Button>
                <Button variant="outline" size="icon"
                    onClick={() => setCurrentSlide((currentSlide + 1) % featureImageList.length)}
                    className="absolute top-1/2 right-2 md:right-6 transform -translate-y-1/2 bg-white/70 hover:bg-white shadow-md rounded-full"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
                </Button>
            </div>

            {/* New Feature: Sale Banner */}
            <div className="bg-rose-600 py-3 text-white">
                <div className="container mx-auto px-4 text-center">
                    <p className="font-semibold">Summer Sale! ☀️ Up to 50% OFF on selected items. <span className="underline cursor-pointer" onClick={handleViewAllProducts}>Shop Now</span></p>
                </div>
            </div>

            {/* Categories - Enhanced with Hover Effects */}
            <section className={`py-10 md:py-16 bg-gray-50 transition-all ${isScrolling ? 'opacity-100' : 'opacity-95'}`}>
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl md:text-4xl font-bold text-gray-800">Shop by Category</h2>
                            <p className="text-gray-500 mt-1 hidden md:block">Find your style in our curated collections</p>
                        </div>
                        <Button 
                            variant="ghost" 
                            className="text-blue-600 hover:text-blue-800 font-medium hidden md:flex items-center"
                            onClick={() => navigate('/shop/listing')}
                        >
                            View All <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-6">
                        {categoriesWithIcon.map((item) => (
                            <Card
                                key={item.id}
                                onClick={() => handleNavigateToListingPage(item, 'category')}
                                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 bg-white overflow-hidden group"
                            >
                                <CardContent className="flex flex-col items-center p-6 relative">
                                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                        <item.icon className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <span className="font-medium text-gray-800 text-sm md:text-base group-hover:text-blue-600 transition-colors">{item.label}</span>
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    
                    <Button 
                        variant="ghost" 
                        className="mt-6 w-full text-blue-600 font-medium md:hidden flex items-center justify-center"
                        onClick={() => navigate('/shop/listing')}
                    >
                        View All Categories <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </section>

            {/* Brands - Enhanced UI */}
            <section className="py-10 md:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl md:text-4xl font-bold text-gray-800">Popular Brands</h2>
                            <p className="text-gray-500 mt-1 hidden md:block">Discover quality from brands you trust</p>
                        </div>
                        <Button 
                            variant="ghost" 
                            className="text-green-600 hover:text-green-800 font-medium hidden md:flex items-center"
                            onClick={() => navigate('/shop/listing')}
                        >
                            View All <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                    
                    <div 
                        ref={carouselRef}
                        className="flex overflow-x-auto pb-4 sm:grid sm:grid-cols-3 md:grid-cols-6 sm:gap-6 scrollbar-hide"
                    >
                        {brandsWithIcon.map((brand) => (
                            <Card
                                key={brand.id}
                                onClick={() => handleNavigateToListingPage(brand, 'brand')}
                                className="cursor-pointer hover:shadow-lg transition-all duration-300 flex-shrink-0 w-32 sm:w-full mx-2 sm:mx-0 first:ml-0 last:mr-0 sm:first:ml-0 sm:last:mr-0 border border-gray-200 bg-white group overflow-hidden"
                            >
                                <CardContent className="flex flex-col items-center p-4 md:p-6 relative">
                                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-all duration-300">
                                        <brand.icon className="w-8 h-8 text-green-600" />
                                    </div>
                                    <span className="font-medium text-gray-800 text-sm md:text-base group-hover:text-green-600 transition-colors">{brand.label}</span>
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    
                    <Button 
                        variant="ghost" 
                        className="mt-6 w-full text-green-600 font-medium md:hidden flex items-center justify-center"
                        onClick={() => navigate('/shop/listing')}
                    >
                        View All Brands <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-10 md:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl md:text-4xl font-bold text-gray-800">Featured Products</h2>
                            <p className="text-gray-500 mt-1 hidden md:block">Our selection of must-have items</p>
                        </div>
                        <Button 
                            variant="ghost" 
                            className="text-blue-600 hover:text-blue-800 font-medium hidden md:flex items-center"
                            onClick={handleViewAllProducts}
                        >
                            See More <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                    
                    {productList && productList.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                                {productList
                                    .slice(-4)
                                    .map((productItem, index) => (
                                        <ShoppingProducTile
                                            handleGetProductDetails={handleGetProductDetails}
                                            key={index}
                                            product={productItem}
                                            handleAddtoCart={handleAddtoCart}
                                        />
                                    ))
                                }
                            </div>
                            <div className="mt-8 flex justify-center md:hidden">
                                <Button 
                                    onClick={handleViewAllProducts}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
                                >
                                    View All Products
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="py-16 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                            <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="text-lg text-gray-500 mb-4">No featured products available</p>
                            <Button 
                                onClick={handleViewAllProducts}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Browse All Products
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* New: Call to Action Banner */}
            <section className="py-12 md:py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4">Join Our VIP Shoppers Club</h2>
                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">Get exclusive access to new arrivals, special offers and personalized recommendations.</p>
                    <Button 
                        className="bg-white text-blue-700 hover:bg-gray-100 font-medium px-8 py-6 text-lg shadow-xl"
                        onClick={() => toast.info("VIP Club feature coming soon!")}
                    >
                        Join Now
                    </Button>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-12 md:py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Subscribe to Our Newsletter</h2>
                        <p className="text-gray-600 mb-6">Stay updated with the latest trends, promotions and new arrivals.</p>
                        
                        {isNewsletterSubmitted ? (
                            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
                                <p className="font-medium">Thank you for subscribing!</p>
                                <p className="text-sm mt-1">You'll receive our newsletter with the latest fashion updates soon.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                                <input 
                                    type="email" 
                                    placeholder="Your email address" 
                                    className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <Button 
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Subscribe
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* New: Footer */}
            <footer className="bg-gray-900 text-white pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div>
                            <h3 className="text-xl font-bold mb-4">Fashion Store</h3>
                            <p className="text-gray-400 mb-6">Your destination for curated fashion and accessories from top brands around the world.</p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <Facebook size={20} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <Instagram size={20} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <Twitter size={20} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <Youtube size={20} />
                                </a>
                            </div>
                        </div>
                        
                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shop</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Categories</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Brands</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                            </ul>
                        </div>
                        
                        {/* Customer Service */}
                        <div>
                            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping & Returns</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Size Guide</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Order Tracking</a></li>
                            </ul>
                        </div>
                        
                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <MapPin size={18} className="text-gray-400 mr-2 mt-1 flex-shrink-0" />
                                    <span className="text-gray-400">123 Fashion Street, Kolkata, NY 10001</span>
                                </li>
                                <li className="flex items-center">
                                    <Phone size={18} className="text-gray-400 mr-2 flex-shrink-0" />
                                    <span className="text-gray-400">+1 (555) 123-4567</span>
                                </li>
                                <li className="flex items-center">
                                    <Mail size={18} className="text-gray-400 mr-2 flex-shrink-0" />
                                    <span className="text-gray-400">support@fashionstore.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    {/* Bottom Footer */}
                    <div className="mt-12 pt-8 border-t border-gray-800 text-center">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            
            <ProductDetailsDialog
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
                productDetails={productDetails}
            />
        </div>
    );
}

export default ShoppingHome;
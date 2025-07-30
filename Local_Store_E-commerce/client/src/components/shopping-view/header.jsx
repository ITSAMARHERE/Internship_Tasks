import { HousePlug, LogOut, Menu, ShoppingCart, UserCog, Search, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SheetTrigger, Sheet, SheetContent } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser, resetTokenAndCredentials } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeItem, setActiveItem] = useState('');

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem('filters')
    const currentFilter = getCurrentMenuItem.id !== 'home' && getCurrentMenuItem.id !== 'products' 
    && getCurrentMenuItem.id !== 'search'
     ?
      {
        category: [getCurrentMenuItem.id]
      } : null

    sessionStorage.setItem('filters', JSON.stringify(currentFilter));

    location.pathname.includes('listing') && currentFilter !== null ?
    setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`)) :

    navigate(getCurrentMenuItem.path)
  }

  useEffect(() => {
    // Set active menu item based on current path
    const currentPath = location.pathname.split('/').pop();
    setActiveItem(currentPath || 'home');
  }, [location.pathname]);

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          key={menuItem.id}
          className={`text-sm cursor-pointer font-medium relative group transition-all ${
            activeItem === menuItem.id ? 'text-blue-600' : 'text-gray-700'
          }`}
        >
          <span className="hover:text-blue-600 transition-colors duration-300 flex items-center gap-1">
            {menuItem.label}
            {menuItem.hasChildren && <ChevronDown className="w-3 h-3 opacity-70" />}
          </span>
          <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
            activeItem === menuItem.id ? 'w-full' : 'w-0 group-hover:w-full'
          }`}></span>
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector(state => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    // dispatch(logoutUser());
    dispatch(resetTokenAndCredentials())
    sessionStorage.clear()
    navigate("/auth/login");
  }

  function handleSearch() {
    // Navigate to search page
    const searchMenuItem = shoppingViewHeaderMenuItems.find(item => item.id === 'search');
    if (searchMenuItem) {
      sessionStorage.removeItem('filters');
      navigate(searchMenuItem.path);
    }
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user?.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      {/* Search button */}
      <Button
        onClick={handleSearch}
        size="icon"
        variant="ghost"
        className="relative hover:bg-gray-100 transition-all duration-200 rounded-full p-2"
      >
        <Search className="w-5 h-5 text-gray-700" />
        <span className="sr-only">Search</span>
      </Button>

      {/* Cart button */}
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          size="icon"
          className="relative bg-amber-50 hover:bg-gray-500 transition-all duration-200 rounded-full p-2"
        >
          <ShoppingCart className="w-5 h-5 text-gray-700" />
          {cartItems?.items?.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {cartItems?.items?.length}
            </span>
          )}
          <span className="sr-only">User cart</span>
        </Button>

        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : []} />
      </Sheet>

      {/* User Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-full pl-2 pr-4 py-1 transition-all duration-200">
            <Avatar className="h-8 w-8 bg-blue-600 hover:shadow-md transition-transform">
              <AvatarFallback className="bg-blue-600 text-white font-bold text-sm">
                {user?.userName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-700 hidden lg:inline-block font-medium">
              {user?.userName || "User"}
            </span>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="bottom"
          align="end"
          className="w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-2 mt-2"
        >
          <DropdownMenuLabel className="flex flex-col px-3 py-2 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-800">
              {user?.userName || "User"}
            </span>
            <span className="text-xs text-gray-500">
              {user?.email || "user@example.com"}
            </span>
          </DropdownMenuLabel>

          <div className="p-2">
            <DropdownMenuItem
              onClick={() => navigate("/shop/account")}
              className="cursor-pointer px-3 py-2.5 rounded-lg hover:bg-gray-100 flex items-center gap-2.5 text-gray-700 transition-colors"
            >
              <UserCog className="h-4 w-4 text-blue-600" />
              Account Settings
            </DropdownMenuItem>

            {/* <DropdownMenuItem
              className="cursor-pointer px-3 py-2.5 rounded-lg hover:bg-gray-100 flex items-center gap-2.5 text-gray-700 transition-colors"
            >
              <ShoppingCart className="h-4 w-4 text-blue-600" />
              My Orders
            </DropdownMenuItem> */}

            <DropdownMenuSeparator className="my-1.5" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer px-3 py-2.5 rounded-lg hover:bg-red-50 flex items-center gap-2.5 text-red-600 font-medium transition-colors"
            >
              <LogOut className="h-4 w-4 text-red-500" />
              Logout
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 w-full border-b border-gray-200 bg-white ${
      isScrolled ? 'shadow-md' : ''
    } transition-shadow duration-300`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link
          to="/shop/home"
          className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-300"
        >
          <HousePlug className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-gray-800 text-lg">Ecommerce</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-blue-50 rounded-full"
            >
              <Menu className="h-5 w-5 text-gray-700" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full max-w-xs bg-white shadow-md border-r border-gray-200 p-6"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <HousePlug className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-gray-800 text-lg">Ecommerce</span>
              </div>
              <MenuItems />
              <div className="mt-6 pt-6 border-t border-gray-100">
                <HeaderRightContent />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
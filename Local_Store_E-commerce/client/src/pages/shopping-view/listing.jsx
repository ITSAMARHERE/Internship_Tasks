import ProductFilter from "@/components/shopping-view/filter";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import { ArrowUpDownIcon, SlidersHorizontal, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShoppingProducTile from "@/components/shopping-view/product-tile";
import { useSearchParams } from "react-router-dom";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function createSearchParamsHelper(filterParams) {
    const queryParams = [];

    for (const [key, value] of Object.entries(filterParams)) {
        if (Array.isArray(value) && value.length > 0) {
            const paramValue = value.join(",");
            queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
        }
    }

    return queryParams.join("&");
}

function ShoppingListing() {
    const dispatch = useDispatch();
    const { productList, productDetails } = useSelector((state) => state.shopProducts);
    const { cartItems } = useSelector((state) => state.shopCart);
    const { user } = useSelector((state) => state.auth);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const categorySearchParam = searchParams.get('category');
    const activeFiltersCount = Object.values(filters).flat().length;

    function handleSort(value) {
        setSort(value);
    }

    function handleFilter(getSectionId, getCurrentOptions) {
        // If this is a "clearAll" action
        if (getSectionId === 'clearAll' && getCurrentOptions) {
            // Reset filters to the empty object provided
            setFilters({});
            sessionStorage.removeItem("filters");
            setSearchParams(new URLSearchParams());
            return;
        }
        
        let cpyFilters = { ...filters };
        const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

        if (indexOfCurrentSection === -1) {
            cpyFilters = {
                ...cpyFilters,
                [getSectionId]: [getCurrentOptions],
            };
        } else {
            const indexofCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOptions);

            if (indexofCurrentOption === -1) cpyFilters[getSectionId].push(getCurrentOptions);
            else cpyFilters[getSectionId].splice(indexofCurrentOption, 1);
        }

        setFilters(cpyFilters);
        sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
    }

    function clearAllFilters() {
        setFilters({});
        sessionStorage.removeItem("filters");
        setSearchParams(new URLSearchParams());
    }

    function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId));
    }

    function handleAddtoCart(getCurrentProductId, getTotalStock) {
        let getCartItems = cartItems.items || [];

        if (getCartItems.length) {
            const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === getCurrentProductId);
            if (indexOfCurrentItem > -1) {
                const getQuantity = getCartItems[indexOfCurrentItem].quantity;
                if (getQuantity + 1 > getTotalStock) {
                    toast.error(`Only ${getQuantity} quantity can be added for this item`);
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
                toast.success("Product added to cart");
            }
        });
    }

    useEffect(() => {
        setSort("price-lowtohigh");
        setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
    }, [categorySearchParam]);

    useEffect(() => {
        if (filters && Object.keys(filters).length > 0) {
            const createQueryString = createSearchParamsHelper(filters);
            setSearchParams(new URLSearchParams(createQueryString));
        }
    }, [filters]);

    useEffect(() => {
        if (filters !== null && sort !== null)
            dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }));
    }, [dispatch, sort, filters]);

    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true);
    }, [productDetails]);

    return (
        <>
            <div className="flex flex-col gap-4 p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
                {/* Mobile Filter Button */}
                <div className="md:hidden flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-medium text-gray-800">Products</h2>
                        {activeFiltersCount > 0 && (
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                            <SheetTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="flex items-center gap-1.5 text-sm"
                                >
                                    <SlidersHorizontal size={16} />
                                    Filters
                                    {activeFiltersCount > 0 && (
                                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium ml-1 w-5 h-5 rounded-full flex items-center justify-center">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0 bg-white">
                                <div className="flex items-center justify-between p-4 border-b bg-white">
                                    <h3 className="font-semibold">Filters</h3>
                                    {activeFiltersCount > 0 && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={clearAllFilters}
                                            className="text-xs h-8 flex items-center gap-1 text-gray-600"
                                        >
                                            <XCircle size={14} />
                                            Clear all
                                        </Button>
                                    )}
                                </div>
                                <div className="p-4 overflow-y-auto max-h-[85vh] bg-white">
                                    <ProductFilter filters={filters} handleFilter={handleFilter} />
                                </div>
                            </SheetContent>
                        </Sheet>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1.5 text-sm"
                                >
                                    <ArrowUpDownIcon size={16} />
                                    Sort
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-48 bg-white border shadow-lg rounded-lg"
                            >
                                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                                    {sortOptions.map((sortItem) => (
                                        <DropdownMenuRadioItem
                                            key={sortItem.id}
                                            value={sortItem.id}
                                        >
                                            {sortItem.label}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[280px_1fr] gap-4 md:gap-6">
                    {/* Desktop Sidebar Filter */}
                    <aside className="hidden md:block bg-white rounded-xl shadow-sm p-4 border border-gray-200 sticky top-4 h-fit max-h-[calc(100vh-40px)] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-800">Filters</h3>
                            {activeFiltersCount > 0 && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={clearAllFilters}
                                    className="text-xs h-7 flex items-center gap-1 text-gray-600 hover:text-gray-900"
                                >
                                    <XCircle size={14} />
                                    Clear all
                                </Button>
                            )}
                        </div>
                        <ProductFilter filters={filters} handleFilter={handleFilter} />
                    </aside>

                    {/* Product List Section */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
                        {/* Desktop Header */}
                        <div className="hidden md:flex md:items-center justify-between gap-4 p-4 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-semibold text-gray-800">All Products</h2>
                                {activeFiltersCount > 0 && (
                                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                        {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-600 text-sm">
                                    {productList?.length ?? 0} Products
                                </span>

                                {/* Sorting */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <ArrowUpDownIcon className="h-4 w-4" />
                                            Sort by
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-48 bg-white border shadow-lg rounded-lg"
                                    >
                                        <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                                            {sortOptions.map((sortItem) => (
                                                <DropdownMenuRadioItem
                                                    key={sortItem.id}
                                                    value={sortItem.id}
                                                >
                                                    {sortItem.label}
                                                </DropdownMenuRadioItem>
                                            ))}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 md:p-6">
                            {productList && productList.length > 0 ? (
                                productList.map((productItem, index) => (
                                    <div className="overflow-hidden flex flex-col rounded-lg border border-gray-200 shadow-sm">
                                        <ShoppingProducTile
                                            handleGetProductDetails={handleGetProductDetails}
                                            key={index}
                                            product={productItem}
                                            handleAddtoCart={handleAddtoCart}
                                            className="no-gap-card"
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-12 sm:py-16">
                                    <div className="text-center space-y-3">
                                        <p className="text-lg font-medium">No products found</p>
                                        <p className="text-sm text-gray-400">Try changing your filters or search criteria</p>
                                        {activeFiltersCount > 0 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={clearAllFilters}
                                                className="mt-2"
                                            >
                                                Clear all filters
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Product Details Dialog */}
                <ProductDetailsDialog
                    open={openDetailsDialog}
                    setOpen={setOpenDetailsDialog}
                    productDetails={productDetails}
                />
            </div>
        </>
    );
}

export default ShoppingListing;
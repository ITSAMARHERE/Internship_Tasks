import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Search, ShoppingBag, X, ArrowUpDown } from "lucide-react";

function SearchProducts() {
  const [keyword, setKeyword] = useState('');
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('relevance');
  const [sortedResults, setSortedResults] = useState([]);
  const searchInputRef = useRef(null);
  
  const dispatch = useDispatch();
  const { searchResults } = useSelector(state => state.shopSearch);
  const { productDetails } = useSelector(state => state.shopProducts);
  const { user } = useSelector(state => state.auth);
  const { cartItems } = useSelector(state => state.shopCart);
  
  useEffect(() => {
    // Get keyword and sort from URL on initial load
    const urlKeyword = searchParams.get('keyword');
    const urlSortBy = searchParams.get('sortBy');
    
    if (urlSortBy) {
      setSortBy(urlSortBy);
    }
    
    if (urlKeyword) {
      setKeyword(urlKeyword);
      dispatch(getSearchResults(urlKeyword));
    }
    
    // Focus search input on load
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let searchTimeout;
    
    if (keyword && keyword.trim() !== '' && keyword.trim().length > 2) {
      setIsSearching(true);
      searchTimeout = setTimeout(() => {
        // Update URL with search parameters
        updateSearchParams();
        
        dispatch(getSearchResults(keyword)).then(() => {
          setIsSearching(false);
        });
      }, 500); // Reduced debounce time for faster feedback
    } else if (keyword.trim() === '') {
      setSearchParams(new URLSearchParams());
      dispatch(resetSearchResults());
      setSortedResults([]);
    }
    
    return () => {
      clearTimeout(searchTimeout);
    };
  }, [keyword, dispatch]);

  // Apply sorting whenever searchResults or sorting settings change
  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      applySorting();
    }
  }, [searchResults, sortBy]);

  function updateSearchParams() {
    const params = new URLSearchParams();
    
    if (keyword) params.set('keyword', keyword);
    if (sortBy !== 'relevance') params.set('sortBy', sortBy);
    
    setSearchParams(params);
  }

  function applySorting() {
    try {
      // Make sure results is a valid array to avoid issues
      if (!Array.isArray(searchResults)) {
        console.error('Search results is not an array:', searchResults);
        setSortedResults([]);
        return;
      }
      
      let results = [...searchResults];
      
      // Apply sorting with error handling
      switch(sortBy) {
        case 'price-asc':
          results.sort((a, b) => {
            const priceA = a && typeof a.price === 'number' ? a.price : 0;
            const priceB = b && typeof b.price === 'number' ? b.price : 0;
            return priceA - priceB;
          });
          break;
        case 'price-desc':
          results.sort((a, b) => {
            const priceA = a && typeof a.price === 'number' ? a.price : 0;
            const priceB = b && typeof b.price === 'number' ? b.price : 0;
            return priceB - priceA;
          });
          break;
        case 'name-asc':
          results.sort((a, b) => {
            const nameA = a && a.name ? String(a.name) : '';
            const nameB = b && b.name ? String(b.name) : '';
            return nameA.localeCompare(nameB);
          });
          break;
        default:
          // Default to relevance - no sorting needed
          break;
      }
      
      setSortedResults(results);
    } catch (error) {
      console.error('Error sorting results:', error);
      setSortedResults(searchResults || []);
    }
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    
    let getCartItems = cartItems && cartItems.items ? cartItems.items : [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === getCurrentProductId);
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(`Only ${getTotalStock} items available in stock`);
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

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function clearSearch() {
    setKeyword('');
    setSortBy('relevance');
    dispatch(resetSearchResults());
    setSortedResults([]);
    setSearchParams(new URLSearchParams());
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }
  
  function handleSortChange(value) {
    setSortBy(value);
    updateSearchParams();
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);  
  }, [productDetails]);

  // Determine which results to display with error handling
  const displayedResults = sortBy !== 'relevance' && sortedResults.length > 0 
    ? sortedResults 
    : (searchResults || []);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-2xl relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-5 w-5 text-gray-400" />
            <Input
              ref={searchInputRef}
              value={keyword}
              name="keyword"
              onChange={(event) => setKeyword(event.target.value)}
              className="pl-10 py-6 border border-gray-300 pr-10 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search products (minimum 3 characters)..."
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  clearSearch();
                }
              }}
            />
            {keyword && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {isSearching ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse text-center">
            <div className="text-xl font-medium text-gray-600">Searching products...</div>
          </div>
        </div>
      ) : (
        <>
          {displayedResults && displayedResults.length > 0 ? (
            <>
              <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Search Results</h2>
                  <div className="text-sm text-gray-500 ml-3">
                    {displayedResults.length} products found
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-gray-500" />
                  <select 
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayedResults.map((item, index) => (
                  <ShoppingProductTile
                    key={item?.id || index}
                    handleAddtoCart={handleAddtoCart}
                    product={item}
                    handleGetProductDetails={handleGetProductDetails}
                  />
                ))}
              </div>
            </>
          ) : keyword.trim().length > 2 ? (
            <div className="text-center py-16">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">No products found</h1>
              <p className="text-gray-500 mb-6">We couldn't find any products matching "{keyword}"</p>
              <Button onClick={clearSearch} variant="outline">
                Clear Search
              </Button>
            </div>
          ) : keyword.trim().length > 0 ? (
            <div className="text-center py-12 text-gray-500">
              Continue typing to search (minimum 3 characters)
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Search Products</h1>
              <p className="text-gray-500">Type at least 3 characters to start searching</p>
            </div>
          )}
        </>
      )}

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;
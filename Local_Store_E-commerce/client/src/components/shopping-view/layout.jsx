import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import { useEffect } from "react";

function ShoppingLayout() {
    // Scroll to top on route changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Fixed header */}
            <ShoppingHeader />
            
            {/* Full-width main content with minimal top spacing */}
            <main className="flex-1 w-full py-1 sm:py-2">
                <Outlet />
            </main>
            
            {/* Simple footer */}
            <footer className="bg-white border-t border-gray-100 py-4 mt-auto">
                <div className="w-full px-4 sm:px-6">
                    <div className="text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} Your Store. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default ShoppingLayout;
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full lg:flex-row">
      {/* Mobile Header - Enhanced for mobile/tablet */}
      <div className="lg:hidden bg-gradient-to-r from-slate-900 to-black p-6 text-center rounded-b-xl shadow-lg">
        <div className="mb-4 animate-pulse">
          <svg className="h-12 w-12 mx-auto text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-200">
          Welcome to ECommerce Shopping
        </h1>
        <p className="text-gray-300 text-sm mt-2 mb-1">
          Your premium shopping destination
        </p>
        {/* Mobile indicator dots */}
        <div className="flex justify-center space-x-4 mt-4">
          <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
          <div className="w-2 h-2 rounded-full bg-white/30"></div>
          <div className="w-2 h-2 rounded-full bg-white/30"></div>
        </div>
      </div>

      {/* Left Panel - Brand/Welcome Section (Desktop only) */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-black w-1/2 px-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-white/10"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-md space-y-8 text-white text-center">
          <div className="mb-6">
            <svg className="h-12 w-12 mx-auto text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-200">
            Welcome to ECommerce Shopping
          </h1>
          <p className="text-gray-300 text-lg mt-4">
            Your one-stop destination for premium products and exceptional shopping experience.
          </p>
          <div className="pt-6">
            <div className="flex justify-center space-x-6 mt-8">
              <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
              <div className="w-3 h-3 rounded-full bg-white/30"></div>
              <div className="w-3 h-3 rounded-full bg-white/30"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form Content */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="w-full max-w-md space-y-6 relative">
          {/* Mobile back button - enhanced with better positioning and styling */}
          
          
          {/* Form content from router outlet */}
          <Outlet />
          
          {/* Mobile helper text - enhanced */}
          <div className="lg:hidden text-center mt-10 text-sm">
            <p className="text-gray-600 font-medium">Need help?</p>
            <p className="text-indigo-600 mt-1">Contact support</p>
            
            {/* Mobile footer with security badge */}
            <div className="mt-6 flex justify-center items-center">
              <svg className="h-4 w-4 text-gray-500 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs text-gray-500">Secure Authentication</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
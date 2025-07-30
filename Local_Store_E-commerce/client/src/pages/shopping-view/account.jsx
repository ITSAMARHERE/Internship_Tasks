import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative h-[260px] w-full">
        <img
          src={accImg}
          alt="Account Header"
          className="h-full w-full object-cover rounded-b-3xl shadow-md"
        />
        <div className="absolute inset-0 bg-black/20 rounded-b-3xl" />
        <div className="absolute bottom-4 left-6 text-white text-2xl font-semibold drop-shadow-lg">
          Welcome to Your Account
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
            Manage Your Activity
          </h2>

          {/* Tabs */}
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="bg-gray-100 rounded-xl p-1 flex gap-2">
              <TabsTrigger
                value="orders"
                className="flex-1 px-4 py-2 text-base font-medium rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow"
              >
                 Orders
              </TabsTrigger>
              <TabsTrigger
                value="address"
                className="flex-1 px-4 py-2 text-base font-medium rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow"
              >
                 Addresses
              </TabsTrigger>
            </TabsList>

            {/* Tabs Content */}
            <div className="mt-6">
              <TabsContent value="orders">
                <ShoppingOrders/>
              </TabsContent>
              <TabsContent value="address">
                <Address />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;

import {
    BadgeCheck,
    ChartNoAxesCombined,
    LayoutDashboard,
    ShoppingBasket,
  } from "lucide-react";
  import { Fragment } from "react";
  import { useNavigate } from "react-router-dom";
  import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
  
  const adminSidebarMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      id: "products",
      label: "Products",
      path: "/admin/products",
      icon: <ShoppingBasket />,
    },
    {
      id: "orders",
      label: "Orders",
      path: "/admin/orders",
      icon: <BadgeCheck />,
    },
  ];
  
  function MenuItems({ setOpen }) {
    const navigate = useNavigate();
  
    return (
      <nav className="mt-2 flex flex-col gap-1">
        {adminSidebarMenuItems.map((menuItem) => (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              if (setOpen) setOpen(false);
            }}
            className="flex cursor-pointer items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-black rounded-md"
          >
            {menuItem.icon}
            <span className="font-medium">{menuItem.label}</span>
          </div>
        ))}
      </nav>
    );
  }
  
  function AdminSideBar({ open, setOpen }) {
    const navigate = useNavigate();
  
    return (
      <Fragment>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-64 bg-white shadow-lg">
            <div className="flex flex-col h-full">
              <SheetHeader className="border-b border-gray-200 pb-4">
                <SheetTitle className="flex items-center gap-2 mt-5">
                  <ChartNoAxesCombined size={30} className="text-gray-700" />
                  <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                </SheetTitle>
              </SheetHeader>
              <MenuItems setOpen={setOpen} />
            </div>
          </SheetContent>
        </Sheet>
        <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white p-6 lg:flex">
          <div
            onClick={() => navigate("/admin/dashboard")}
            className="flex cursor-pointer items-center gap-2"
          >
            <ChartNoAxesCombined size={30} className="text-gray-700" />
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>
          <MenuItems />
        </aside>
      </Fragment>
    );
  }
  
  export default AdminSideBar;
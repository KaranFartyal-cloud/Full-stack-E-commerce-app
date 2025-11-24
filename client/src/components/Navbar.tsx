import React, { useEffect, useState } from "react";
import { Menu, X, ShoppingCart, User, Search } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import UserDropdown from "./UserDropdown";

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAppSelector((store) => store.user.user);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const NumOfItems = user?.cart.length;
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  const handlePress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navigate(`/products?search=${query}`);
    }
  };

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* TOP BAR */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold tracking-tight">
          ShopX
        </a>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex items-center w-1/2 bg-gray-100 px-4 py-2 rounded-full">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-transparent outline-none ml-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handlePress}
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <a href="/cart" className="relative">
            <ShoppingCart size={22} />
            {/* Cart Badge */}
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-1.5 rounded-full">
              {NumOfItems === 0 ? null : NumOfItems}
            </span>
          </a>

          {isLoggedIn ? (
            <UserDropdown open={open} setOpen={setOpen}>
              <User size={22} />
            </UserDropdown>
          ) : (
            <div className="flex items-center gap-4">
              <Link to={"/login"}>
                <Button variant={"ghost"}>Login</Button>
              </Link>

              <Link to={"/sign-up"}>
                <Button
                  className="  bg-blue-500
   hover:bg-blue-600
    transition-all duration-300
    hover:scale-105
    active:scale-95
    text-white"
                >
                  Sign-up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

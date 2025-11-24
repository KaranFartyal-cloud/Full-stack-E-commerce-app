import React from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* BRAND */}
          <div>
            <h2 className="text-2xl font-bold">ShopX</h2>
            <p className="mt-3 text-gray-600">
              Your one-stop shop for fashion, electronics, and more.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="text-gray-700 hover:text-black">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-700 hover:text-black">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-700 hover:text-black">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-700 hover:text-black">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* SHOP */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Shop</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="/men" className="hover:underline">
                  Men
                </a>
              </li>
              <li>
                <a href="/women" className="hover:underline">
                  Women
                </a>
              </li>
              <li>
                <a href="/electronics" className="hover:underline">
                  Electronics
                </a>
              </li>
              <li>
                <a href="/shoes" className="hover:underline">
                  Shoes
                </a>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:underline">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Newsletter</h3>
            <p className="text-gray-600">Subscribe for updates & discounts.</p>

            <div className="flex mt-4">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md outline-none"
              />
              <button className="px-5 bg-black text-white rounded-r-md hover:bg-gray-800 transition">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t mt-10 pt-6 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} ShopX. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

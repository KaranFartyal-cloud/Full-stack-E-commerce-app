import React, { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import axios from "axios";
import { useBackendUrl } from "@/context/BackendProvider";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useCart } from "@/hooks/useCart";
import { Spinner } from "../ui/spinner";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

type Product = {
  _id: string;
  name: string;
  price: number;
  photo: string[];
} | null;

const Home = () => {
  const backendUrl = useBackendUrl();
  const { addToCart } = useCart();
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loadingId, setLoadingId] = useState<string | undefined>();
  const user = useAppSelector((store) => store.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentProducts: () => void = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/product/get-recent-products`,
          { withCredentials: true }
        );

        setRecentProducts(data.products);
      } catch (error) {
        console.log(error);
        toast.error("something went wrong");
      }
    };

    fetchRecentProducts();
  }, []);

  const searchByCategory = async (category: string) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <div className="w-full">
      {/* ---------------- HERO ---------------- */}
      <section className="relative w-full h-[500px] bg-gray-900 text-white flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />

        <div className="relative text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold">Upgrade Your Style</h1>
          <p className="mt-4 text-lg md:text-xl opacity-90">
            Discover the best deals on fashion, electronics & more
          </p>
          <button className="mt-6 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition">
            Shop Now
          </button>
        </div>
      </section>

      {/* ---------------- CATEGORIES ---------------- */}
      <section className="w-3/4 mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Men", image: "./jacket.jpg" },
            { name: "Women", image: "./purse.jpg" },
            { name: "Electronics", image: "./electronics.jpg" },
            { name: "Shoes", image: "./shoes.jpg" },
          ].map((cat, index) => (
            <div
              onClick={() => searchByCategory(cat.name)}
              key={index}
              className="relative overflow-hidden rounded-xl group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 h-64"
            >
              {/* Image */}
              <img
                src={cat.image}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt=""
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition"></div>

              {/* Text */}
              <p className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white drop-shadow-xl tracking-wide group-hover:scale-110 transition">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- FEATURED PRODUCTS ---------------- */}
      <section className="w-3/4 mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/all" className="text-gray-600 hover:text-black">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recentProducts.map((p, index) => (
            <div
              key={index}
              className="border p-3 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden bg-white"
            >
              <img
                src={p?.photo[0]}
                alt={p?.name}
                className="w-full h-40 rounded-lg object-cover"
              />

              <div className="p-4">
                <h3 className="font-medium">{p?.name}</h3>
                <p className="text-gray-600 mt-1">${p?.price}</p>
                <Button
                  disabled={loadingId === p?._id}
                  onClick={async () => {
                    if (user) {
                      setLoadingId(p?._id);
                      await addToCart(p?._id);
                      setLoadingId(undefined);
                    } else {
                      toast.error("Please login to add to cart");
                    }
                  }}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loadingId === p?._id ? (
                    <Spinner className="w-4 h-4" />
                  ) : (
                    <>Add to Cart</>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

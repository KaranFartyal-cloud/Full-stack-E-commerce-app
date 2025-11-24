import { useBackendUrl } from "@/context/BackendProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

type Product = {
  _id: string;
  name: string;
  price: number;
  photo: string[];
  description: string;
};

const SearchProducts = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const navigate = useNavigate();
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = useBackendUrl();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (search) params.append("query", search);
        if (category) params.append("category", category);

        const { data } = await axios.get(
          `${backendUrl}/api/product/search?${params.toString()}`
        );

        setResults(data.products);
      } catch (error) {
        toast.error("Something went wrong");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category, backendUrl]);

  if (loading) {
    return (
      <div className="w-full py-20 text-center text-xl">
        Loading products...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Search results for: <span className="text-gray-600">{search}</span>
      </h1>

      {results.length === 0 ? (
        <p className="text-gray-600 text-lg">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {results.map((p) => (
            <div
              key={p._id}
              className="border rounded-lg shadow-sm hover:shadow-md transition overflow-hidden bg-white"
            >
              <img
                src={p.photo[0]}
                alt={p.name}
                className="w-full h-40 object-cover"
              />

              <div className="p-4">
                <h3 className="font-medium">{p.name}</h3>
                <p className="text-gray-600 mt-1">${p.price}</p>

                <button
                  className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchProducts;

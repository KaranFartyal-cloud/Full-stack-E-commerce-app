import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useBackendUrl } from "@/context/BackendProvider";
import ProductDetailsSkeleton from "../ui/ProductDetailsSkeleton";
import { useCart } from "@/hooks/useCart";
import { useAppSelector } from "@/redux/hooks";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  photo: string[];
  description: string;
  sellerId: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
};

const ProductDetails = () => {
  const { id } = useParams();
  const backendUrl = useBackendUrl();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | undefined>();
  const user = useAppSelector((store) => store.user.user);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          `${backendUrl}/api/product/product-page/${id}`
        );

        setProduct(data.product);
      } catch (error) {
        toast.error("Failed to fetch product");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) getProduct();
  }, [id, backendUrl]);

  if (loading) return <ProductDetailsSkeleton />;

  if (!product) {
    return <div className="text-center py-20 text-xl">Product not found.</div>;
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* LEFT - PRODUCT IMAGE */}
      <div>
        <img
          src={product.photo[0]}
          alt={product.name}
          className="w-full h-96 object-cover rounded-xl shadow-lg"
        />
      </div>

      {/* RIGHT - DETAILS */}
      <div>
        <h1 className="text-4xl font-bold">{product.name}</h1>

        <p className="text-2xl mt-3 text-gray-700 font-medium">
          ₹ {product.price}
        </p>

        <p className="text-gray-600 mt-6 leading-relaxed">
          {product.description}
        </p>

        <p className="mt-4 text-sm text-gray-500">
          Category: <span className="font-medium">{product.category}</span>
        </p>

        <div className="mt-4 text-sm">
          <p className="text-gray-500">
            Seller:{" "}
            <span className="font-semibold">{product.sellerId.name}</span>
          </p>
          <p className="text-gray-500">{product.sellerId.email}</p>
        </div>

        <Button
          className={`mt-8 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-all w-full `}
          disabled={loadingId === product._id}
          onClick={async () => {
            if (user) {
              setLoadingId(product?._id);
              await addToCart(product?._id);
              setLoadingId(undefined);
            } else {
              toast.error("Please login to add to cart");
            }
          }}
        >
          {loadingId && <Spinner />}
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductDetails;

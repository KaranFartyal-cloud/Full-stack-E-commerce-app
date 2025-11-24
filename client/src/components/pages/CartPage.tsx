import { Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBackendUrl } from "@/context/BackendProvider";
import axios from "axios";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { updateCart, type CartItem } from "@/redux/slices/user.slice";
import { toast } from "sonner";
import { Input } from "../ui/input";

const Cart = () => {
  const user = useAppSelector((store) => store.user.user);
  const { addToCart, removeFromCart, totalPrice, cart, setTotalPrice } =
    useCart();
  const navigate = useNavigate();
  const backendUrl = useBackendUrl();
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async () => {
    if (shippingAddress.trim().length === 0) {
      toast.warning("Please enter your shipping address");
      return;
    }
    try {
      setLoading(true);

      // 1. Create order
      const response = await axios.post(
        `${backendUrl}/api/payments/create-order`,
        { shippingAddress },
        { withCredentials: true }
      );

      const { order, orderId } = response.data; // order = Razorpay order

      // 2. Load Razorpay script
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!res) return alert("Failed to load Razorpay");

      // 3. Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount, // FIXED
        currency: order.currency, // FIXED
        name: "SHOP ex",
        description: "Order Payment",

        order_id: order.id, // FIXED — Razorpay order id, not MongoDB

        theme: { color: "#3399cc" },

        handler: async (response) => {
          const verify = await axios.post(
            `${backendUrl}/api/payments/verify-payment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId, // MongoDB order id
              shippingAddress,
            },
            { withCredentials: true } // FIXED
          );

          if (verify.data.success) {
            alert("Payment Successful!");
            dispatch(updateCart([]));
            setTotalPrice(0);
          } else {
            alert("Payment Verification Failed!");
          }
        },
      };

      // 4. Open Razorpay
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  if (user === null) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  const deleteFromCart = async (productId: string) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/product/cart/delete`,
        {
          productId,
        },
        { withCredentials: true }
      );

      if (data.success) {
        dispatch(updateCart(data.cart));
        setTotalPrice(
          data.cart?.reduce(
            (acc: number, curr: CartItem) =>
              acc + curr.product.price * curr.quantity,
            0
          )
        );
      }
    } catch (error) {
      toast.error("something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ---------------- CART ITEMS LIST ---------------- */}
        <div className="md:col-span-2 space-y-6">
          {cart?.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            cart?.map((item) => (
              <div
                key={item?._id}
                className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-4 shadow-sm gap-4 md:gap-0"
              >
                {/* LEFT — IMAGE + INFO */}
                <div className="flex items-center gap-4 w-full md:w-1/3">
                  <img
                    src={item.product.photo[0]}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />

                  <div>
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-gray-600 mt-1">${item.product.price}</p>
                  </div>
                </div>

                {/* MIDDLE — QUANTITY */}
                <div className="flex items-center gap-4 w-full md:w-1/3 justify-center">
                  <button
                    className="px-3 py-1 bg-gray-200 rounded"
                    onClick={() => removeFromCart(item.product._id)}
                  >
                    -
                  </button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button
                    className="px-3 py-1 bg-gray-200 rounded"
                    onClick={() => addToCart(item.product._id)}
                  >
                    +
                  </button>
                </div>

                {/* RIGHT — DELETE */}
                <div className="flex justify-end w-full md:w-1/3">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteFromCart(item.product._id)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ---------------- ORDER SUMMARY ---------------- */}
        <div className="border rounded-lg p-6 shadow-sm h-fit sticky top-20">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3 text-gray-700">
            {/* <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹100</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹100</span>
            </div> */}

            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>

          <Input
            placeholder="Enter your address"
            className="my-3"
            onChange={(e) => setShippingAddress(e.target.value)}
            value={shippingAddress}
          />

          <Button
            className="mt-6 w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
            onClick={initiatePayment}
            disabled={loading}
          >
            {loading && <Spinner />}
            Proceed to Checkout
          </Button>

          <h1></h1>
        </div>
      </div>
    </div>
  );
};

export default Cart;

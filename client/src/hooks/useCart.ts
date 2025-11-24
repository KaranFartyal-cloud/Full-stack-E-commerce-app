import { useBackendUrl } from "@/context/BackendProvider";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateCart, type CartItem } from "@/redux/slices/user.slice";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export const useCart = () => {
  const backendUrl = useBackendUrl();
  const dispatch = useAppDispatch();
  const user = useAppSelector((store) => store.user);
  const cart = user.user?.cart;
  const [totalPrice, setTotalPrice] = useState(
    cart?.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0)
  );
  const [loading, setLoading] = useState(false);
  const addToCart = async (productId: string | undefined) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/product/cart/add`,
        {
          productId,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(updateCart(data.cart));
      setTotalPrice(
        data.cart?.reduce(
          (acc: number, curr: CartItem) =>
            acc + curr.product.price * curr.quantity,
          0
        )
      );
    } catch (error) {
      toast.error("something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/product/cart/remove`,
        {
          productId,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(updateCart(data.cart));
      setTotalPrice(
        data.cart?.reduce(
          (acc: number, curr: CartItem) =>
            acc + curr.product.price * curr.quantity,
          0
        )
      );
    } catch (error) {
      toast.error("something went wrong");
      console.log(error);
    }
  };

  return { addToCart, removeFromCart, totalPrice, cart, loading, setTotalPrice };
};

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useBackendUrl } from "@/context/BackendProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PackageIcon, MapPin } from "lucide-react";

export interface Buyer {
  _id: string;
  name: string;
  email: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  photo: string[];
}

export interface OrderToDeliver {
  _id: string;
  amount: number;
  buyer: Buyer;
  product: Product;
  quantity: number;
  shippingAddress: string;
  status: string;
}

export interface OrdersResponse {
  success: boolean;
  orders: OrderToDeliver[];
}

const OrdersToDeliver = () => {
  const backendUrl = useBackendUrl();
  const [orders, setOrders] = useState<OrderToDeliver[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get<OrdersResponse>(
        `${backendUrl}/api/user/seller/orders-to-deliver`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-lg">
        Loading your delivery orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-10 text-center text-gray-600 text-lg">
        No orders to deliver yet.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <PackageIcon className="w-7 h-7" /> Orders You Need to Deliver
      </h1>

      <div className="space-y-6">
        {orders.map((item, index) => (
          <Card key={index} className="shadow-sm border rounded-xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">Order {index + 1}</h2>
                </div>
                <Badge>{item.status}</Badge>
              </div>

              {/* Product Information */}
              <div className="flex gap-4 items-center border-b pb-4">
                <img
                  src={item.product.photo[0]}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <h3 className="text-lg font-semibold">{item.product.name}</h3>
                  <p className="text-gray-700 text-sm">
                    Qty: {item.quantity} · ₹{item.product.price}
                  </p>
                </div>
              </div>

              {/* Shipping */}
              <div className="flex items-start gap-3 mt-4">
                <MapPin className="w-5 h-5 text-gray-600" />
                <p className="text-gray-700 text-sm leading-5">
                  {item.shippingAddress}
                </p>
              </div>

              {/* Mark as delivered */}
              <button className="mt-5 px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition">
                Mark as Delivered
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrdersToDeliver;

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import MainLayout from "./components/MainLayout";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import SignUp from "./components/pages/SignUp";
import NotFound from "./components/pages/NotFound";
import CartPage from "./components/pages/CartPage";
import SearchProducts from "./components/pages/SearchProducts";
import { Toaster } from "@/components/ui/sonner";
import Product from "./components/pages/Product";
import Orders from "./components/pages/Orders";

function App() {
  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/cart",
          element: (
            <ProtectedRoutes>
              <CartPage />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/products",
          element: <SearchProducts />,
        },
        {
          path: "/product/:id",
          element: <Product />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/sign-up",
      element: <SignUp />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <>
      <RouterProvider router={browserRouter} />

      <Toaster position="top-center" />
    </>
  );
}

export default App;

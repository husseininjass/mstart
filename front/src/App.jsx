import { createBrowserRouter,RouterProvider, useLocation } from "react-router-dom";
import Home from "./customer-pages/home";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import SignUp from "./customer-pages/signup";
import Login from "./customer-pages/login";
import AdminLogin from "./admin-pages/login";
import AdminHome from "./admin-pages/home";
import Customers from "./admin-pages/customers";
import Products from "./admin-pages/products";
import Cart from "./customer-pages/cart";
import Profile from "./customer-pages/profile";
import Orders from "./admin-pages/orders";
function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      children: [
        {
          path: '',
          element: <Home />
        },
        {
          path: 'signup',
          element: <SignUp />
        },
        {
          path: 'login',
          element: <Login />
        },
        {
          path: 'cart',
          element: <Cart />
        },
        {
          path: 'profile',
          element: <Profile />
        }
      ]
    },
    {
      path: "/admin",
      children: [
        {
          path: 'login',
          element: <AdminLogin />
        },
        {
          path: '',
          element: <AdminHome />
        },
        {
          path: 'customers',
          element: <Customers />
        },
        {
          path: 'products',
          element: <Products />
        },
        {
          path: 'orders',
          element: <Orders />
        }
      ]
    }
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App

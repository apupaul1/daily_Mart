import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import HomePage from "../pages/HomePage/HomePage/HomePage";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Regsiter/Register";
import PrivateRoute from "../routes/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import MyOrderList from "../pages/Dashboard/MyOrderList/MyOrderList";
import AddProduct from "../pages/Vendor/AddProduct";
import MyAddedProduct from "../pages/Vendor/MyAddedProduct/MyAddedProduct";
import AdvertisementForm from "../pages/Dashboard/AdvertisementForm/AdvertisementForm";
import MyAdvertisements from "../pages/Vendor/MyAdvertisements/MyAdvertisements";
import AllProducts from "../pages/AllProducts/AllProducts";
import ViewDetailsProduct from "../pages/ViewDetailsProduct/ViewDetailsProduct";
import ManageWatchlist from "../pages/Dashboard/User/ManageWatchlist/ManageWatchlist";
import Payment from "../pages/Dashboard/Payment/Payment";
import AllOrder from "../pages/Dashboard/AllOrder/AllOrder";
import AllProduct from "../pages/Dashboard/AllProduct/AllProduct";
import AllUsers from "../pages/Dashboard/AllUsers/AllUsers";
import AllAds from "../pages/Dashboard/AllAds/AllAds";
import PriceTrends from "../pages/Dashboard/PriceTrends/PriceTrends";
import UpdateProduct from "../pages/Vendor/UpdateProduct/UpdateProduct";
import Forbidden from "../pages/Forbidden/Forbidden";
import AdminRoute from "../routes/AdminRoute";
import VendorRoute from "../routes/VendorRoute";
import Dashboard from "../pages/Dashboard/DashboardHome/Dashboard";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import About from "../Shared/Footer/About/About";
import Contact from "../Shared/Footer/Contact/Contact";
import Terms from "../Shared/Footer/Terms/Terms";
import Blog from "../pages/Blog/Blog";
import MyProfile from "../pages/Dashboard/MyProfile/MyProfile";
import AllDiscountsPage from "../pages/AllDiscountsPage/AllDiscountsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "forbidden",
        Component: Forbidden,
      },
      {
        path: "allproducts",
        Component: AllProducts,
      },
      {
        path: "discount-product",
        Component: AllDiscountsPage,
      },
      {
        path: "blogs",
        Component: Blog,
      },
      {
        path: "details/:id",
        element: (
          <PrivateRoute>
            <ViewDetailsProduct></ViewDetailsProduct>{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "Aboutus",
        Component: About,
      },
      {
        path: "Contactus",
        Component: Contact,
      },
      {
        path: "TermsandConditions",
        Component: Terms,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        {" "}
        <DashboardLayout></DashboardLayout>{" "}
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "myorder",
        Component: MyOrderList,
      },
      {
        path: "myprofile",
        Component: MyProfile,
      },
      {
        path: "payment/:productId",
        Component: Payment,
      },
      {
        path: "addproduct",
        element: (
          <VendorRoute>
            <AddProduct></AddProduct>
          </VendorRoute>
        ),
      },
      {
        path: "my-products",
        element: (
          <VendorRoute>
            <MyAddedProduct></MyAddedProduct>
          </VendorRoute>
        ),
      },
      {
        path: "postadvertisement",
        element: (
          <VendorRoute>
            <AdvertisementForm></AdvertisementForm>
          </VendorRoute>
        ),
      },
      {
        path: "my-ads",
        element: (
          <VendorRoute>
            <MyAdvertisements></MyAdvertisements>
          </VendorRoute>
        ),
      },
      {
        path: "watchlist",
        Component: ManageWatchlist,
      },
      {
        path: "price-trends",
        Component: PriceTrends,
      },
      {
        path: "update-product/:id",
        Component: UpdateProduct,
      },
      {
        path: "all-orders",
        element: (
          <AdminRoute>
            <AllOrder></AllOrder>
          </AdminRoute>
        ),
      },
      {
        path: "all-products",
        element: (
          <AdminRoute>
            <AllProduct></AllProduct>
          </AdminRoute>
        ),
      },
      {
        path: "all-users",
        element: (
          <AdminRoute>
            <AllUsers></AllUsers>
          </AdminRoute>
        ),
      },
      {
        path: "all-ads",
        element: (
          <AdminRoute>
            <AllAds></AllAds>
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    Component: ErrorPage,
  },
]);

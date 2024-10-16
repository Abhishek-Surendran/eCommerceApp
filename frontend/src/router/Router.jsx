import {createBrowserRouter} from "react-router-dom";
import { UserLayout } from "../layout/UserLayout";
import { ErrorPage } from "../pages/user/ErrorPage";
import { Home } from "../pages/user/Home";
import { Product } from "../pages/user/Product";
import { ProductList } from "../pages/user/ProductList";
import { Cart } from "../pages/user/Cart";
import { SignupPage } from "../pages/shared/SignupPage";
import { LoginPage } from "../pages/shared/LoginPage";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <UserLayout/>,
      errorElement: <ErrorPage/>,
      children:[
        {
            path: "",
            element: <Home/>,
            errorElement: <ErrorPage/>,
        },
        {
            path: "product-list",
            element: <ProductList/>,
            errorElement: <ErrorPage/>,
        },
        {
            path: "product/:id",
            element: <Product/>,
            errorElement: <ErrorPage/>,
        },
        {
            path: "cart",
            element: <Cart/>,
            errorElement: <ErrorPage/>,
        },
        {
            path: "signup",
            element: <SignupPage/>,
            errorElement: <ErrorPage/>,
        },
        {
            path: "login",
            element: <LoginPage/>,
            errorElement: <ErrorPage/>,
        }
      ],
    },
  ]);
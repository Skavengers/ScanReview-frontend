import { createBrowserRouter } from "react-router-dom"
import App from "../App";
import Home from "../pages/home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import CartPage from "../pages/books/CartPage";
import SingleBook from "../pages/books/SingleBook";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import AdminLogin from "../components/AdminLogin";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ManageBooks from "../pages/dashboard/manageBooks/ManageBooks";
import AddBook from "../pages/dashboard/addBook/AddBook";
import UpdateBook from "../pages/dashboard/editBook/UpdateBook";
import CreateList from "../pages/list/ListPage";
import ListViewer from "../pages/list/ListViewer";
import SingleListViewer from "../pages/list/SingleListViewer";
const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "/",
                element: <Home />,
            },

            {
                path: "/about",
                element: <div>Créé par François CHEVALIER</div>
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/cart",
                element: <CartPage />
            },
            {
                path: "/tierList",
                element: "Tier List"
            },

            {
                path: "/books/:id",
                element: <SingleBook />
            },
            {
                path: "/subscription",
                element: ""
            },
            {
                path: "/lists",
                element: <ListViewer />
            },
            {
                path: "/create-list",
                element: <CreateList />
            },
            {
                path: "/lists/:id",
                element: <SingleListViewer />
            }
        ]
    },
    {
        path: "/admin",
        element: <AdminLogin/>
    },
    {
        path: "/dashboard",
        element: <AdminRoute><DashboardLayout/></AdminRoute>,
        children: [
            {
                path: "",
                element: <AdminRoute><Dashboard/></AdminRoute>
            },
            {
                path: "add-new-book",
                element: <AdminRoute><AddBook/></AdminRoute>
            },
            {
                path: "edit-book/:id",
                element: <AdminRoute><UpdateBook/></AdminRoute>
            },
            {
                path: "manage-books",
                element: <AdminRoute><ManageBooks/></AdminRoute>
            },

        ]
    }
]);

export default router;
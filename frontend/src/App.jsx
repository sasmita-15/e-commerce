import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/User/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Users from "./pages/Admin/Users";
import Orders from "./pages/User/Orders";
import Profile from "./pages/User/Profile";
import Product from "./pages/Admin/Product";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import CategoryProduct from "./pages/CategoryProduct";
import Cart from "./pages/Cart";
import AdminOrder from "./pages/Admin/AdminOrder";
import Layout from "./components/layouts/Layout";

const App = () => {
  const router = createBrowserRouter ([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/product/:slug', element: <ProductDetails /> },
        { path: '/categories', element: <Categories /> },
        { path: '/cart', element: <Cart /> },
        { path: '/category', element: <CategoryProduct /> },
        { path: '/search', element: <Search /> },
        {
          path: '/dashboard',
            element: <PrivateRoute />,
            children: [
              { path: '/dashboard/user', element: <Dashboard /> },
              { path: '/dashboard/user/orders', element: <Orders /> },
              { path: '/dashboard/user/profile', element: <Profile /> },
            ]
        },
        {
          path: '/dashboard',
          element: <AdminRoute />,
          children: [
            { path: '/dashboard/admin', element: <AdminDashboard /> },
            { path: '/dashboard/admin/create-category', element: <CreateCategory /> },
            { path: '/dashboard/admin/create-product', element: <CreateProduct /> },
            { path: '/dashboard/admin/product/:slug', element: <UpdateProduct /> },
            { path: '/dashboard/admin/products', element: <Product /> },
            { path: '/dashboard/admin/users', element: <Users /> },
            { path: '/dashboard/admin/orders', element: <AdminOrder /> },
          ]
        },
        { path: '/register', element: <Register /> },
        { path: '/forgot-password', element: <ForgotPassword /> },
        { path: '/login', element: <Login /> },
        { path: '/about', element: <About /> },
        { path: '/contact', element: <Contact /> },
        { path: '/policy', element: <Policy /> },
        { path: '*', element: <PageNotFound /> },
      ]
    }
  ])

  return <RouterProvider router = { router } />
}

export default App



















    // <>
    //   <Routes>
    //     <Route path="/" element={<Home />} />
    //     <Route path="/product/:slug" element={<ProductDetails />} />
    //     <Route path="/categories" element={<Categories />} />
    //     <Route path="/cart" element={<Cart />} />
    //     <Route path="/category/:slug" element={<CategoryProduct />} />
    //     <Route path="/search" element={<Search />} />
    //     <Route path="/dashboard" element={<PrivateRoute />}>
    //       <Route path="user" element={<Dashboard />} />
    //       <Route path="user/orders" element={<Orders />} />
    //       <Route path="user/profile" element={<Profile />} />
    //     </Route>
    //     <Route path="/dashboard" element={<AdminRoute />}>
    //       <Route path="admin" element={<AdminDashboard />} />
    //       <Route path="admin/create-category" element={<CreateCategory />} />
    //       <Route path="admin/create-product" element={<CreateProduct />} />
    //       <Route path="admin/product/:slug" element={<UpdateProduct />} />
    //       <Route path="admin/products" element={<Product />} />
    //       <Route path="admin/users" element={<Users />} />
    //       <Route path="admin/orders" element={<AdminOrder />} />
    //     </Route>
    //     <Route path="/register" element={<Register />} />
    //     <Route path="/forgot-password" element={<ForgotPassword />} />
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/about" element={<About />} />
    //     <Route path="/contact" element={<Contact />} />
    //     <Route path="/policy" element={<Policy />} />
    //     <Route path="*" element={<PageNotFound />} />
    //   </Routes>
    // </>


// import "bootstrap/dist/css/bootstrap.min.css"
// import "bootstrap/dist/js/bootstrap.bundle"
// import './App.css'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import Layout from './components/layouts/Layout'
// import Home from './pages/Home' 
// import Category from './pages/Category' 
// import Login from './pages/Auth/Login' 
// import Register from './pages/Auth/Register' 
// // import Admin from './pages/Admin' 
// import Cart from './pages/Cart' 
// import PageNotFound from './pages/PageNotFound' 

// // import { ToastContainer } from 'react-toastify'
// // import 'react-toastify/dist/ReactToastify.css'

// function App() {
//  const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Layout />,
//     children: [
//       { path: "/", element: <Home />}, 
//       { path: "/category", element: <Category />}, 
//       { path: "/login", element: <Login />}, 
//       { path: "/register", element: <Register />}, 
//       // { path: "/admin", element: <Admin />}, 
//       { path: "/cart", element: <Cart />}, 
//       { path: "*", element: <PageNotFound />}, 

//       // { path: "/addproduct", element: <AddProduct />},
//       // { path: "/productdetails/:id", element: <ProductDetails />},
//     ]
//   }
//  ])

//   return <RouterProvider router={router} />
// }

// export default App
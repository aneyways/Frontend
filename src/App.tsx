import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Auth from './pages/Auth/Auth';
import Cart from './pages/Cart/Cart';
import Quiz from './pages/Quiz/Quiz';
import NotFound from './pages/NotFound/NotFound';
import Checkout from './pages/Checkout/Checkout';
import Profile from './pages/Profile/Profile';
import Admin from './pages/Admin/Admin';
import Wishlist from './pages/Wishlist/Wishlist';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<Layout><Catalog /></Layout>} path="/catalog" />
        <Route element={<Layout><ProductDetails /></Layout>} path="/catalog/:id" />
        <Route element={<Layout><Auth /></Layout>} path="/auth" />
        <Route element={<Layout><Cart /></Layout>} path="/cart" />
        <Route element={<Layout><Quiz /></Layout>} path="/quiz" />
        <Route element={<Layout><Checkout /></Layout>} path="/checkout" />
        <Route element={<Layout><Profile /></Layout>} path="/profile" />
        <Route element={<Layout><Admin /></Layout>} path="/admin" />
        <Route element={<Layout><NotFound /></Layout>} path="*" />
        <Route element={<Layout><Wishlist /></Layout>} path="/wishlist" />
      </Routes>
    </BrowserRouter>
  );
}
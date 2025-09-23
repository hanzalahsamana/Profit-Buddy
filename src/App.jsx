import { Route, Routes, useLocation } from 'react-router-dom'
import './Styles/App.css'
import './Styles/Font.css'
import Home from './Pages/Home'
import Header from './Components/Layout/Header'
import ProductDetail from './Pages/ProductDetail'
import ThemeProvider from './Components/Layout/ThemeProvider'
import SellerProfile from './Pages/SellerProfile'
import CustomerSupport from './Components/Widgets/CustomerSupport'

import Authentication from './Pages/Authentication'
import PrivateRoutes from './AuthRouting/PrivateRoutes'
import PublicRoutes from './AuthRouting/PublicRoutes'
import UserProvider from './Components/Layout/UserProvider'
import History from './Pages/History'
import ResetPassword from './Pages/ResetPassword'
import Account from './Pages/Account'
import DeleteAccountPage from './Pages/DeleteAccount'
import VerifyEmailPage from './Pages/VerifyEmail'
import PaymentForm from './Components/Widgets/CheckoutForm'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Plans from './Pages/Plans'

function App() {
  const location = useLocation();
  const hideHeaderRoutes = ["/authentication", "/reset-password", "/account", "/verify", "/delete-account", "/checkout", "/plans"];
  const showHeader = !hideHeaderRoutes.some(route => location.pathname.startsWith(route));
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


  return (
    <ThemeProvider>
      <UserProvider>

        <div className="max-w-[1800px] min-h-screen bg-primary">
          {showHeader && <Header />}

          <Routes>
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify" element={<VerifyEmailPage />} />
            <Route path="/plans" element={<Plans />} />

            <Route element={<PublicRoutes />}>
              <Route path="/authentication" element={<Authentication />} />
            </Route>

            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Home />} />
              <Route path="/detail" element={<ProductDetail />} />
              <Route path="/sellerProfile" element={<SellerProfile />} />
              <Route path="/history" element={<History />} />
              <Route path="/account" element={<Account />} />
              <Route path="/delete-account" element={<DeleteAccountPage />} />
              <Route path="/checkout" element={<PaymentForm />} />
            </Route>
          </Routes>
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;

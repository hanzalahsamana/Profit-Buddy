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
import Profile from './Pages/Profile'
import ResetPassword from './Pages/ResetPassword'

function App() {
  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/register", "/authentication" , "/reset-password"];
  const showHeader = !hideHeaderRoutes.some(route => location.pathname.startsWith(route));

  return (
    <ThemeProvider>
      <UserProvider>

        <div className="max-w-[1800px] min-h-screen bg-primary">
          {showHeader && <Header />}

          <Routes>
            <Route element={<PublicRoutes />}>
              <Route path="/authentication" element={<Authentication />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Home />} />
              <Route path="/detail" element={<ProductDetail />} />
              <Route path="/sellerProfile" element={<SellerProfile />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;

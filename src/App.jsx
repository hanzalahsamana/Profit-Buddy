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

function App() {
  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/register", "/authentication"];
  const showHeader = !hideHeaderRoutes.some(route => location.pathname.startsWith(route));


  return (
    <ThemeProvider>
      <div className="max-w-[1800px] min-h-screen bg-primary">
        {showHeader && <Header />}

        <Routes>
          {/* <Route element={<PublicRoutes />}>
        <Route path="/authentication" element={<Authentication />} />
      </Route> */}

          {/* Private routes */}
          {/* <Route element={<PrivateRoutes />}> */}
          <Route path="/" element={<Home />} />
          <Route path="/detail" element={<ProductDetail />} />
          <Route path="/sellerProfile" element={<SellerProfile />} />
          {/* </Route> */}
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;

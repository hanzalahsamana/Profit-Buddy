import { Route, Routes } from 'react-router-dom'
import './Styles/App.css'
import './Styles/Font.css'
import Home from './Pages/Home'
import Header from './Components/Layout/Header'
import ProductDetail from './Pages/ProductDetail'
import ThemeProvider from './Components/Layout/ThemeProvider'

function App() {
  
  return (
    <ThemeProvider>
      <div className="max-w-[1800px] min-h-screen bg-primary">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail" element={<ProductDetail />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App

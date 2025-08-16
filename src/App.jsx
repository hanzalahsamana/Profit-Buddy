import { Route, Routes } from 'react-router-dom'
import './Styles/App.css'
import './Styles/Font.css'
import Home from './Pages/Home'
import Header from './Components/Layout/Header'
import { useSelector } from 'react-redux'

function App() {
  const { theme } = useSelector((state) => state.system)


  useSelector(() => {
    if(theme){
      document.documentElement.classList.add('dark');
    }else{
      document.documentElement.classList.remove('dark');
    }
  }, [theme])

  return (
    <div className='max-w-[1800px]'>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App

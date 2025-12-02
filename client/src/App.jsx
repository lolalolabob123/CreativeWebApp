import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import RestaurantList from './pages/RestaurantList';
import RestaurantMenu from './pages/RestaurantMenu';
import Register from './pages/Register';
import Login from './pages/Login';
import './styling/App.css';

function App() {
  const location = useLocation()

  const hideNavRoutes = ['/register', '/login']

  const shouldHideNav = hideNavRoutes.includes(location.pathname)

  return (
    <>
      {!shouldHideNav && (
        <nav style={{ display: 'flex', gap: '20px', marginBottom: '20px', justifyContent: 'center' }}>
          <Link to='/'>Home</Link>
          <Link to='/addRestaurant'>Add Restaurant</Link>
          <Link to='/restaurants'>View Restaurants</Link>
          <Link to='/register'>Register</Link>
          <Link to='/login'>Login</Link>
        </nav>
      )}

      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/addRestaurant' element={<> <RestaurantMenu /> </>}></Route>
        <Route path='/restaurants' element={<> <RestaurantList /> </>}></Route>
        <Route path='/register' element={<><Register /></>}></Route>
        <Route path='/login' element={<><Login></Login></>}></Route>
      </Routes>
    </>
  )
}

export default App

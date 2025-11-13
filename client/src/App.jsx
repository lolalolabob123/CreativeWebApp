import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import RestaurantList from './pages/RestaurantList';
import RestaurantMenu from './pages/RestaurantMenu';
import './styling/App.css';

function App() {
  return (
    <>
    <nav style={{display: 'flex', gap: '20px', marginBottom: '20px', justifyContent: 'center'}}>
        <Link to='/'>Home</Link>
        <Link to='/addRestaurant'>Add Restaurant</Link>
        <Link to='/restaurants'>View Restaurants</Link>
    </nav>

    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/addRestaurant' element={<> <RestaurantMenu/> </>}></Route>
      <Route path='/restaurants' element={<> <RestaurantList/> </>}></Route>
    </Routes>
    </>
  )
}

export default App

import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './contexts/UserContext'
import Home from './pages/Home';
import RestaurantList from './pages/RestaurantList';
import RestaurantMenu from './pages/RestaurantMenu';
import Register from './pages/Register';
import Login from './pages/Login';
import './styling/App.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser, loading } = useContext(UserContext);

  const hideNavRoutes = ['/register', '/login'];
  const shouldHideNav = hideNavRoutes.includes(location.pathname);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {!shouldHideNav && (
        <nav style={{ display: 'flex', gap: '20px', marginBottom: '20px', justifyContent: 'center' }}>
          <Link to='/'>Home</Link>
          <Link to='/restaurants'>View Restaurants</Link>
          {user?.business && <Link to='/addRestaurant'>Add Restaurant</Link>}
          {!user && (
            <>
              <Link to='/register'>Register</Link>
              <Link to='/login'>Login</Link>
            </>
          )}
          {user && (
            <button
              onClick={async () => {
                const res = await fetch('http://localhost:3000/logout', {
                  method: 'POST',
                  credentials: 'include'
                });
                const data = await res.json();
                if (data.success) {
                  setUser(null);
                  navigate('/login');
                } else {
                  alert('Logout Failed');
                }
              }}
            >
              Logout
            </button>
          )}
        </nav>
      )}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/addRestaurant' element={<RestaurantMenu />} />
        <Route path='/restaurants' element={<RestaurantList />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  );
}

export default App;

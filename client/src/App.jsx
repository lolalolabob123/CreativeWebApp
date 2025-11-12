import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <nav>
        <button onclick="window.location.href = '/'">Home</button>
        <button onclick="window.location.href = '/addRestaurant'">Add restaurant</button>
        <button onclick="window.location.href = '/restaurants'">View Restaurants</button>
    </nav>
    </>
  )
}

export default App

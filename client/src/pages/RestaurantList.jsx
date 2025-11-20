import { useState, useEffect } from 'react'
import '../styling/RestaurantList.css'
import { RiDeleteBin6Line } from "react-icons/ri";

export default function RestaurantList() {

    const [restaurants, setRestaurants] = useState([])

    useEffect(() => {
        fetchRestaurants()
    }, [])

    const fetchRestaurants = async () => {
        try {
            const res = await fetch('http://localhost:3000/getRestaurants')
            const data = await res.json()
            setRestaurants(data.restaurants)
        } catch (err) {
            console.error('Failed to load restaurants', err)
        }
    }

    function deleteRestaurant(id) {
        // Optimistically remove restaurant
        setRestaurants(prev => prev.filter(r => r._id !== id))

        fetch(`http://localhost:3000/deleteRestaurant/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to delete')
                return response.json()
            })
            .then(() => fetchRestaurants())
            .catch(err => {
                console.error(err)
                fetchRestaurants()
            })
    }

    return (
        <>
            <h2>Restaurant List</h2>
            {restaurants.length === 0 ? (
                <p>No restaurants found</p>
            ) : (
                <ul className="restaurant-list">
                    {restaurants.map(r => (
                        <li key={r._id} className="restaurant-item">
                            {r.imnage && (
                                <img
                                    src={`http://localhost:3000/uploads/${r.image}`}
                                    alt={r.name}
                                    className="restaurant-image"
                                />
                            )}
                            <div className='restaurant-info'>
                                <span className='restaurant-name'>{r.name}</span>
                                <button
                                    id='deleteBtn'
                                    onClick={() => deleteRestaurant(r._id)}
                                >  
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}

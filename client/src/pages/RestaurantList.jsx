import { useState, useEffect } from 'react'
import '../styling/RestaurantList.css'
import { RiDeleteBin6Line } from "react-icons/ri";

export default function RestaurantList() {

    const [restaurants, setRestaurants] = useState([])

    useEffect(() => {
        fetch('http://localhost:3000/getRestaurants')
            .then(res => res.json())
            .then(data => setRestaurants(data.restaurants))
            .catch(err => console.error('Failed to load restaurants', err))
    }, [])

    function deleteRestaurant(id) {
        setRestaurants(prev => prev.filter(r => r._id !== id))

        fetch(`http://localhost:3000/deleteRestaurant/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to delete')
                return response.json()
            })
            .then(() => loadRestaurants())
            .catch(err => {
                console.error(err)
                fetch('http://localhost:3000/getRestaurants')
                    .then(res => res.json())
                    .then(data => setRestaurants(data.restaurants))
            })
    }

    return (
        <>
            <h2>Restaurant List</h2>
            {restaurants.length === 0 ? (
                <p>No restaurants found</p>
            ) : (
                <ul>
                    {restaurants.map(r => (
                        <li key={r._id}>
                            {r.name}
                            <button
                                id='deleteBtn'
                                onClick={() => deleteRestaurant(r._id)}
                            >
                                <RiDeleteBin6Line />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}

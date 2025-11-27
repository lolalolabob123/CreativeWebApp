import { useState, useEffect } from 'react'
import '../styling/RestaurantList.css'
import { RiDeleteBin6Line } from "react-icons/ri";
import Modal from './Modal'

export default function RestaurantList() {

    const [restaurants, setRestaurants] = useState([])
    const [selectedRestaurant, setSelectedRestaurant] = useState(null)

    function openModal(restaurant) {
        setSelectedRestaurant(restaurant)
    }

    function closeModal() {
        setSelectedRestaurant(null)
    }

    useEffect(() => {
        fetchRestaurants()
    }, [])

    const fetchRestaurants = async () => {
        try {
            const res = await fetch('/getRestaurants')
            const data = await res.json()
            setRestaurants(data.restaurants)
        } catch (err) {
            console.error('Failed to load restaurants', err)
        }
    }

    function deleteRestaurant(id) {
        // Optimistically remove restaurant
        setRestaurants(prev => prev.filter(r => r._id !== id))

        fetch(`/deleteRestaurant/${id}`, {
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
                            {r.image && (
                                <img
                                    src={`http://localhost:3000/uploads/${r.image}`}
                                    alt={r.name}
                                    className="restaurant-image"
                                />
                            )}
                            <div className='restaurant-info'>
                                <span className='restaurant-name'>{r.name}</span>
                                <button onClick={() => openModal(r)}>
                                    View
                                </button>
                                <button
                                    id='deleteBtn'
                                    onClick={() => deleteRestaurant(r._id)}
                                >
                                    <RiDeleteBin6Line style={{ color: 'white', size: 20 }} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <Modal
                isOpen={!!selectedRestaurant}
                onClose={closeModal}
                name={selectedRestaurant?.name}
                image={selectedRestaurant?.image}
                restaurantId={selectedRestaurant?._id}
                onImageUpdate={(newImage) => {
                    setRestaurants(prev =>
                        prev.map(r => r._id === selectedRestaurant._id ? { ...r, image: newImage } : r)
                    );
                    setSelectedRestaurant(prev => prev ? { ...prev, image: newImage }: prev);
                }}
                onNameUpdate={(newName) => {
                    setRestaurants(prev => 
                        prev.map(r => r._id === selectedRestaurant._id ? {...r, name: newName} : r)
                    )
                    setSelectedRestaurant(prev => prev ? { ...prev, name: newName }: prev);
                }}
            />
        </>
    )
}

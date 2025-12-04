import { useState, useEffect } from 'react'
import '../styling/RestaurantList.css'
import { RiDeleteBin6Line } from "react-icons/ri";
import Modal from './Modal'

export default function RestaurantList() {
    const [user, setUser] = useState(null)
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
        setRestaurants(prev => prev.filter(r => r._id !== id))

        fetch(`/deleteRestaurant/${id}`, {
            method: 'DELETE',
            credentials: 'include'
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

    useEffect(() => {
        fetch('/user', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setUser(data))
    }, [])

async function donateToRestaurant(id) {
    const amount = prompt('Enter donation amount:')

    if (!amount || isNaN(amount) || amount <= 0) {
        alert('Invalid amount')
        return
    }

    const res = await fetch(`/donate/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: Number(amount) })
    })

    const data = await res.json()

    if (res.ok && data.restaurant) {
        setRestaurants(prev =>
            prev.map(r => r._id === id
                ? { 
                    ...r,
                    donationReached: data.restaurant.donationReached,
                    donationGoal: data.restaurant.donationGoal
                }
                : r
            )
        )
        alert('Thank you for your donation!')
    } else {
        alert(data.error || 'Donation failed')
    }
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
                                    src={`/uploads/${r.image}`}
                                    alt={r.name}
                                    className="restaurant-image"
                                />
                            )}
                            <div className='restaurant-info'>
                                <span className='restaurant-name'>{r.name}</span>
                                <div className='progress-wrapper'>
                                    <span className='progress-text'>${r.donationReached} / ${r.donationGoal}</span>
                                    <div className='progress-container'>
                                        <div
                                            className='progress-bar'
                                            style={{ width: `${Math.min((r.donationReached / r.donationGoal) * 100, 100)}%` }}
                                        >
                                        </div>
                                    </div>
                                </div>
                                {user && user.username && !user.business && (
                                    <button className='donate-btn'
                                        onClick={() => donateToRestaurant(r._id)}>
                                        Donate
                                    </button>
                                )}
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
                    setSelectedRestaurant(prev => prev ? { ...prev, image: newImage } : prev);
                    alert('Image Updated')
                }}
                onNameUpdate={(newName) => {
                    setRestaurants(prev =>
                        prev.map(r => r._id === selectedRestaurant._id ? { ...r, name: newName } : r)
                    )
                    setSelectedRestaurant(prev => prev ? { ...prev, name: newName } : prev);
                    alert('Name Updated')
                }}
            />
        </>
    )
}

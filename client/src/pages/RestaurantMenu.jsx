import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RestaurantMenu() {

    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const response = await fetch('http://localhost:3000/addRestaurant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        })

        if (response.ok) {
            const data = await response.json()
            setMessage(`Added Restaurant: ${data.restaurant.name}`)
            navigate('/restaurants')
        }
        else {
            setMessage('Failed to add restaurant')
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>Add a new Restaurant</h2>
                <label>Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required />
                <br />
                <button type="submit">Submit</button>
                <p>{message}</p>
            </form>
        </>
    )
}
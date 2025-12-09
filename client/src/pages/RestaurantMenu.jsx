import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styling/RestaurantMenu.css'

export default function RestaurantMenu() {
    const [name, setName] = useState('')
    const [image, setImage] = useState(null)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('name', name)
        if (image) formData.append('image', image)

        const response = await fetch('http://localhost:3000/addRestaurant', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        })

        const data = await response.json()

        if (response.ok && data.restaurant){
            setMessage(`Added Restaurant: ${data.restaurant.name}`)
            navigate('/restaurants')
        } else{
            setMessage(data.error || 'Failed to add restaurant')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add a new Restaurant</h2>
            
            <label>Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            <label>Image</label>
            <input
                type="file"
                className='custom-file-input'
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
            />
            
            <button type="submit">Submit</button>
            <p>{message}</p>
        </form>
    )
}

import { useState, useEffect } from 'react'

const CartModal = ({ isOpen, onClose }) => {
    const [cart, setCart] = useState([]);

    const fetchCart = async () => {
        try {
            const res = await fetch('http://localhost:3000/getCart', {
                credentials: 'include'
            })
            const data = await res.json()

            if (res.ok) {
                setCart(data.cart || [])
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffecrtt(() => {
        if (isOpen) {
            fetchCart()
        }
    }, [isOpen])

    if (!isOpen) return null;

    const removeItem = async (itemId) => {
        try {
            const res = await fetch('http://localhost:3000/removeFromCart', {}, {
                method: 'POST',
                credentials: 'include',
            })
            const data = await res.json()

            if (res.ok) {
                setCart(data.cart || [])
            }
        } catch (err) {
            console.error(err)
        }
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return(
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }} 
        onClick={onClose}>
            <div style={{
                background: 'white',
                color: 'black',
                padding: '20px',
                borderRadius: '10px',
                minWidth: '350px',
                maxWidth: '500px',
            }}
            onClick={(e) => e.stopPropagation()}>
                <h2>Your Cart</h2>

                {cart.length === 0 && <p>Your cart is empty.</p>}

                <ul style={{listStyle: 'none', padding: 0}}>
                    {cart.map(item => (
                        <li key={item.itemId} style={{marginBottom: '10px'}}>
                            <span>{item.name} (x{item.quantity}) - ${item.price * item.quantity}</span>

                            <button
                                style={{
                                    marginLeft: '10px',
                                    background: 'red',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '4px 8px',
                                    cursor: pointer
                                }}
                                onClick={() => removeItem(item.itemId)}
                                >
                                Remove
                                </button>
                            </li>
                    ))}
                </ul>

                <h3>Total: £{total}</h3>

                <button
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                    }}
                    onClick={onClose}
                    >
                    Close
                    </button>
            </div>
        </div>
    )
}

export default CartModal;
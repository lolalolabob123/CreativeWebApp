import { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import '../styling/Modal.css'

const Modal = ({ isOpen, onClose, name, image, restaurantId, onImageUpdate, onNameUpdate, canEdit}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [restaurantName, setRestaurantName] = useState('');
    const [activeTab, setActiveTab] = useState('info');
    const [menuItems, setMenuItems] = useState([]);
    const [newMenuItem, setNewMenuItem] = useState({ name: '', price: '' });

    const fetchMenuItems = async () => {
        if (!restaurantId) return;
        try {
            const res = await fetch(`http://localhost:3000/getMenuItems/${restaurantId}`);
            if (!res.ok) throw new Error('Failed to load menu');
            const data = await res.json();
            setMenuItems(data.menuItems || []);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        setPreview(image ? `http://localhost:3000/uploads/${image}` : '');
        setRestaurantName(name || '');
        setSelectedFile(null);
        fetchMenuItems();
    }, [image, name, restaurantId]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append('image', selectedFile);
        try {
            const res = await fetch(`/updateRestaurantImage/${restaurantId}`, { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            onImageUpdate(data.image);
            setPreview(`http://localhost:3000/uploads/${data.image}`);
            setSelectedFile(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleNameSave = async () => {
        try {
            const res = await fetch(`/updateRestaurantName/${restaurantId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: restaurantName })
            });
            if (!res.ok) throw new Error('Name update failed');
            const data = await res.json();
            onNameUpdate(data.name);
        } catch (err) {
            console.error(err);
        }
    };

    const addMenuItem = async () => {
        if (!newMenuItem.name || !newMenuItem.price) return alert('Please fill in all fields');
        try {
            const res = await fetch(`http://localhost:3000/addMenuItem/${restaurantId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMenuItem)
            })
            if (!res.ok) throw new Error('Failed to add menu item');
            const data = await res.json();
            setMenuItems(data.menuItems);
            setNewMenuItem({ name: '', price: '' });
        } catch (err) {
            console.error(err);
        }
    }

    const deleteMenuItem = async (itemId) => {
        try {
            const res = await fetch(`/deleteMenuItem/${restaurantId}/${itemId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete menu item');
            const data = await res.json();
            setMenuItems(data.menuItems);
        } catch (err) {
            console.error(err);
        }
    }

    const addToCart  = async (item) => {
        try {
            const res = await fetch('/addToCart', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    itemId: item_id,
                    name: item.name,
                    price: item.price
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to add to cart')
            }

            alert('Item added to cart')
        } catch(err) {
            console.error(err)
            alert('Could not add to cart')
        }
    }

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    minWidth: "300px",
                    maxWidth: "500px",
                    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
                    color: "black",
                    position: "relative"
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', marginBottom: '15px' }}>
                    <button onClick={() => setActiveTab('info')} style={{ flex: 1 }}>Info</button>
                    <button onClick={() => setActiveTab('menu')} style={{ flex: 1 }}>Menu</button>
                </div>

                {activeTab === 'info' && (
                    <>
                        {canEdit ? (
                            <>
                                <input
                                    type="text"
                                    value={restaurantName}
                                    onChange={(e) => setRestaurantName(e.target.value)}
                                    style={{ width: '80%', marginBottom: '10px', padding: '5px', marginRight: '100%' }}
                                />
                                <button onClick={handleNameSave}>Save Name</button>
                                {preview && (
                                    <img src={preview} alt={restaurantName} style={{ width: '100%', borderRadius: '10px', marginTop: '15px' }} />
                                )}
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: '10px' }} />
                                <button onClick={handleUpload}>Upload Image</button>
                            </>
                        ) : (
                            <>
                                <p>Name: {restaurantName}</p>
                                {preview && <img src={preview} alt={restaurantName} style={{ width: '100%', borderRadius: '10px', marginTop: '15px' }} />}
                            </>
                        )}
                    </>
                )}

                {activeTab === 'menu' && (
                    <>
                        <ul id="menu-list" style={{ listStyle: 'none' }}>
                            {menuItems.map(item => (
                                <li key={item._id} style={{ marginBottom: '8px' }}>
                                    {item.name} - ${item.price}
                                    {canEdit && (
                                        <button className="delete-btn" onClick={() => deleteMenuItem(item._id)}>
                                            <RiDeleteBin6Line color='white' size={24} />
                                        </button>
                                    )}

                                    {!canEdit && (
                                        <button onClick={() => addToCart(item)}>
                                            Add to Cart
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {canEdit && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Item name"
                                    value={newMenuItem.name}
                                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, name: e.target.value }))}
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={newMenuItem.price}
                                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, price: e.target.value }))}
                                />
                                <button onClick={addMenuItem}>Add Item</button>
                            </>
                        )}
                    </>
                )}

                <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px' }}>Close</button>
            </div>
        </div>
    );
};

export default Modal;

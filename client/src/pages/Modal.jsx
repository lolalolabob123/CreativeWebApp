import { useState, useEffect } from "react";

const Modal = ({ isOpen, onClose, name, image, restaurantId, onImageUpdate, onNameUpdate }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [restaurantName, setRestaurantName] = useState('');

    useEffect(() => {
        setPreview(image ? `http://localhost:3000/uploads/${image}` : '');
        setRestaurantName(name || '');
        setSelectedFile(null);
    }, [image, name]);

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
            const res = await fetch(`/updateRestaurantImage/${restaurantId}`, {
                method: 'POST',
                body: formData
            });

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
                <input
                    type="text"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                />
                <button onClick={handleNameSave}>Save Name</button>

                {preview && (
                    <img
                        src={preview}
                        alt={restaurantName}
                        style={{ width: '100%', borderRadius: '10px', marginTop: '15px' }}
                    />
                )}

                <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: '10px' }} />
                <button onClick={handleUpload}>Upload Image</button>

                <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px' }}>Close</button>
            </div>
        </div>
    );
};

export default Modal;

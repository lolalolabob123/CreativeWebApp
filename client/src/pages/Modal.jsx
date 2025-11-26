const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

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
            onClick={onClose} // close when clicking outside the popup
        >
            <div
                style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    minWidth: "300px",
                    maxWidth: "500px",
                    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
                    color: "black"
                }}
                onClick={(e) => e.stopPropagation()} // stop closing on inside click
            >
                {children}
            </div>
        </div>
    );
};
export default Modal;
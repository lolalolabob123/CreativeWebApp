const Modal = ({isOpen, onClose, children}) => {
    if (!isOpen) return null

    return (
        <div
            style={{
                justifyContent: "center",
                alignItems: 'center',
                position: "fixed",
                width: "50%",
                height: "100%",
                background: "rgba(255, 255, 255, 0.5)",
                borderColor: 'black',
                borderRadius: '10%',
                borderStyle: "solid"
            }}
        >
            <div>
                {children}
            </div>
        </div>
    )
}

export default Modal
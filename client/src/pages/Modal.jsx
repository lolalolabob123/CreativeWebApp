const Modal = ({isOpen, onClose, children}) => {
    if (!isOpen) return null

    return (
        <div
            onClick={onClose}
        >
            <div>
                {children}
            </div>
        </div>
    )
}

export default Modal
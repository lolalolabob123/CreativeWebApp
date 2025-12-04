import {createContext, useState, useEffect} from 'react'

export const UserContext = createContext()

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('http://localhost:3000/user', {credentials: 'include'})
        .then(res => res.json())
        .then(data => {
            if (data.username) setUser(data)
        })
    .finally(() => setLoading(false))
    }, [])

    return (
        <UserContext.Provider value={{user, setUser, loading}}>
            {children}
        </UserContext.Provider>
    )
}
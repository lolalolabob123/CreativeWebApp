import { useState } from 'react'
import {useNavigate, Link} from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../contexts/UserContext'

export default function Login(){
    const {setUser} = useContext(UserContext)
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        const res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({username, password})
        })

        const data = await res.json()

        if (data.success){
            const userRes = await fetch('http://localhost:3000/user', {
                credentials: 'include'
            })
            const userData = await userRes.json()

            setUser(userData)
            navigate('/')
        } else{
            alert(data.message || 'Login Failed')
        }
    }

    return(
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input type='text' value={username} onChange={(e) => setUsername(e.target.value)}/>

                <label>Password</label>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>

                <input type="submit" value='Login'/>
            </form>

            <Link to='/register'>Register</Link>
        </div>
    )
}
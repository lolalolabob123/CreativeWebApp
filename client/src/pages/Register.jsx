import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'


export default function Register() {
    const navigate = useNavigate()

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [business, setBusiness] = useState(false);

    async function handleSubmit(e){
        e.preventDefault()

        const res = await fetch('/register', {
            method: 'Post',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
                firstName,
                lastName,
                username,
                password,
                business,
            }),
        })

        const data = await res.json()

        if (data.success) {
            alert('Registered Successfully!')
            navigate('/login')
        } else{
            alert(data.message || 'Registration Failed!')
        }
    }

    return (
        <div>
            <h2>Register</h2>

            <form onSubmit={handleSubmit}>
                <label>First Name</label>
                <input type='text' id='firstName' value={firstName} onChange={(e) => setFirstName(e.target.value)}/><br />

                <label>Last Name</label>
                <input type='text' id='lastName' value={lastName} onChange={(e) => setLastName(e.target.value)}/><br />

                <label>Username</label>
                <input type='text' id='username' value={username} onChange={(e) => setUsername(e.target.value)}/><br />

                <label>Password</label>
                <input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)}/><br />

                <label>Business</label>
                <input type='checkbox' id='business' checked={business} onChange={(e) => setBusiness(e.target.checked)}/><br />

                <input type='submit' value='Register' />
            </form>

            <Link to='/login'>Login</Link>
        </div>
    )
}
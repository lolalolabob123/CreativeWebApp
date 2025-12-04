import { Link } from 'react-router-dom'

export default function Register() {
    return (
        <div>
            <h2>Register</h2>

            <form action='/register' method='POST'>
                <label>First Name</label>
                <input type='text' id='firstName' name='firstName' /><br />

                <label>Last Name</label>
                <input type='text' id='lastName' name='lastName' /><br />

                <label>Username</label>
                <input type='text' id='username' name='username' /><br />

                <label>Password</label>
                <input type='password' id='password' name='password' /><br />

                <label>Business</label>
                <input type='checkbox' id='business' name='business'/><br/>

                <input type='submit' value='Register'/>
            </form>

            <Link to='/login'>Login</Link>
        </div>
    )
}
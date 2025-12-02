import {Link} from 'react-router-dom'

export default function Login(){
    return(
        <div>
            <h2>Login</h2>
            <Link to='/register'>Register</Link>
        </div>
    )
}
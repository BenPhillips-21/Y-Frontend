import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/register.module.css'

const Register = ({registerToast, handleDemoLogin}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState('')
    const [error, setError] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = { username, password, confirmedPassword };
    
        try {
          const response = await fetch('http://localhost:3000/sign-up', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
          });
    
          if (!response.ok) {
            setError(true)
            throw new Error('Network response was not ok');
          }

          registerToast()
          navigate('/login');
        } catch (error) {
          console.error('Error:', error);
        }
      };

    return (
        <>
            <div className={styles.background}>
            <img id={styles.homeButton} src={'/Y.svg'}></img>
                <div className={styles.registerContainer}> 
                    <h1>Sign Up !</h1>
                    <form>
                        <label>Username:</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label>Password:</label>
                        <input 
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label>Confirm Password:</label>
                        <input 
                            type="password"
                            required
                            value={confirmedPassword}
                            onChange={(e) => setConfirmedPassword(e.target.value)}
                        />
                    </form>
                    <button onClick={(e) => handleSubmit(e)}>Submit</button>
                    <button onClick={() => navigate('/login')}>Already Registered?</button>
                    <button onClick={(e) => handleDemoLogin(e)}>Demo Login</button>
                    {error === true &&
                        <ul>
                            <li>Password must be at least 6 characters long</li>
                            <li>Password and confirmed password must match</li>
                        </ul>
                    }
                </div>
            </div>
        </>
    )
}

export default Register
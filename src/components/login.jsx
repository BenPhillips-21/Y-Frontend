import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/register.module.css'

const Login = ({JWT, setJWT, loginToast, handleDemoLogin}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = { username, password };
    
        try {
          const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
          });
    
          if (!response.ok) {
            setError(true)
            throw new Error('Network response was not ok');
          }

          let data = await response.json()
          setJWT(data.token)
          loginToast()
          navigate('/home')
        } catch (error) {
          console.error('Error:', error);
        }
      };

    return (
        <>
          <div className={styles.background}>
            <img id={styles.homeButton} src={'/Y.svg'}></img>
            <div className={styles.registerContainer}>
                <h1>Login !</h1>
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
                </form>
                <button onClick={(e) => handleSubmit(e)}>Submit</button>
                <button onClick={() => navigate('/register')}>Not Registered?</button>
                <button onClick={(e) => handleDemoLogin(e)}>Demo Login</button>
                {error === true &&
                    <ul>
                        <li>Username or password incorrect</li>
                    </ul>
                }
            </div>
            </div>
        </>
    )
}

export default Login
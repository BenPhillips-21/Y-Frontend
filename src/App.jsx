import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css'

import Navbar from './components/navbar.jsx'
import Redirect from './components/redirect.jsx'
import Home from './components/home.jsx'
import MyProfile from './components/myprofile.jsx'
import Register from './components/register.jsx'
import Login from './components/login.jsx'

function App() {
  const [JWT, setJWT] = useState()
  const [currentUser, setCurrentUser] = useState()

  console.log(JWT)

  const location = useLocation();
  const showNavbar = !['/register', '/login'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar JWT={JWT} setJWT={setJWT} currentUser={currentUser} setCurrentUser={setCurrentUser}/>}
        <Routes>
          <Route path='/' element={<Redirect />} />
          <Route path='/home' element={<Home JWT={JWT} setJWT={setJWT} currentUser={currentUser} setCurrentUser={setCurrentUser} postToast={postToast}/>}/>
          <Route path='/myprofile' element={<MyProfile JWT={JWT} setJWT={setJWT} currentUser={currentUser} setCurrentUser={setCurrentUser}/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login JWT={JWT} setJWT={setJWT}/>}/>
        </Routes>
    </>
  )
}

export default App

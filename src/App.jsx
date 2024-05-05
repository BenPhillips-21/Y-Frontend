import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import Navbar from './components/navbar.jsx'
import Redirect from './components/redirect.jsx'
import Home from './components/home.jsx'
import MyProfile from './components/myprofile.jsx'
import Register from './components/register.jsx'
import Login from './components/login.jsx'

function App() {
  const [JWT, setJWT] = useState()
  const [currentUser, setCurrentUser] = useState()
  const [otherUser, setOtherUser] = useState()

  const navigate = useNavigate()

  const postToast = () => toast.success('Post published successfully')
  const sentFriendToast = () => toast.success('Friend request sent')
  const deletePostToast = () => toast.success('Post deleted successfully')
  const createCommentToast = () => toast.success('Comment published successfully')
  const deleteCommentToast = () => toast.success('Comment deleted successfully')
  const registerToast = () => toast.success('Registered successfully')
  const loginToast = () => toast.success('Logged in successfully')
  const logoutToast = () => toast.success('Logged out successfully')
  const somethingWentWrong = (error) => toast.error(`Oh No! ${error}`)

  const headers = {
    'Authorization': `Bearer ${JWT}`,
    'Content-Type': 'application/json'
};

  const fetchCurrentUser = async () => {
    try {
        const response = await fetch('http://localhost:3000/myprofile', {
            method: 'GET',
            headers: headers,
            mode: 'cors'
        })

        if (response.ok) {
            const userData = await response.json()
            setCurrentUser(userData)
        } else {
            somethingWentWrong("Error retrieving user data")
            throw new Error ("Error retrieving user data")
        }
    } catch (err) {
        somethingWentWrong("Error fetching current user")
        throw new Error ("Error fetching current user", err)
    }
}

const fetchOtherUser = async (userid) => {
  try {
    const response = await fetch(`http://localhost:3000/getuser/${userid}`, {
        method: 'GET',
        headers: headers,
        mode: 'cors'
    })

    if (response.ok) {
        const userData = await response.json()
        setOtherUser(userData)
    } else {
        somethingWentWrong("Error retrieving user data")
        throw new Error ("Error retrieving user data")
    }
} catch (err) {
    somethingWentWrong("Error fetching current user")
    throw new Error ("Error fetching current user", err)
}
}

const handleVisitProfile = async (e, userid) => {
  e.preventDefault()
  try {
      fetchOtherUser(userid)
      navigate('/myprofile')
  } catch (err) {
      throw new Error('Error occurred trying to visit user profile', err)
  }
}

  const location = useLocation();
  const showNavbar = !['/register', '/login'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar fetchCurrentUser={fetchCurrentUser} fetchOtherUser={fetchOtherUser} logoutToast={logoutToast} handleVisitProfile={handleVisitProfile} JWT={JWT} setJWT={setJWT} otherUser={otherUser} setOtherUser={setOtherUser} currentUser={currentUser} setCurrentUser={setCurrentUser}/>}
        <Routes>
          <Route path='/' element={<Redirect />} />
          <Route path='/home' element={<Home fetchCurrentUser={fetchCurrentUser} fetchOtherUser={fetchOtherUser} handleVisitProfile={handleVisitProfile} JWT={JWT} setJWT={setJWT} otherUser={otherUser} setOtherUser={setOtherUser} currentUser={currentUser} setCurrentUser={setCurrentUser} postToast={postToast} sentFriendToast={sentFriendToast} deletePostToast={deletePostToast} createCommentToast={createCommentToast} deleteCommentToast={deleteCommentToast} somethingWentWrong={somethingWentWrong}/>}/>
          <Route path='/myprofile' element={<MyProfile fetchCurrentUser={fetchCurrentUser} fetchOtherUser={fetchOtherUser} handleVisitProfile={handleVisitProfile} JWT={JWT} setJWT={setJWT} otherUser={otherUser} setOtherUser={setOtherUser} currentUser={currentUser} setCurrentUser={setCurrentUser} postToast={postToast} deletePostToast={deletePostToast}/>}/>
          <Route path='/register' element={<Register registerToast={registerToast}/>}/>
          <Route path='/login' element={<Login JWT={JWT} setJWT={setJWT} loginToast={loginToast}/>}/>
        </Routes>
        <Toaster richColors/>
    </>
  )
}

export default App

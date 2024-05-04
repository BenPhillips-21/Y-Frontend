import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import { Toaster, toast } from 'sonner';

import Navbar from './components/navbar.jsx'
import Redirect from './components/redirect.jsx'
import Home from './components/home.jsx'
import MyProfile from './components/myprofile.jsx'
import Register from './components/register.jsx'
import Login from './components/login.jsx'

function App() {
  const [JWT, setJWT] = useState()
  const [currentUser, setCurrentUser] = useState()

  const postToast = () => toast.success('Post published Successfully')
  const sentFriendToast = () => toast.success('Friend request sent')
  const deletePostToast = () => toast.success('Post deleted successfully')
  const createCommentToast = () => toast.success('Comment published successfully')
  const deleteCommentToast = () => toast.success('Comment deleted successfully')
  const somethingWentWrong = (error) => toast.error(`Oh No! ${error}`)

  const location = useLocation();
  const showNavbar = !['/register', '/login'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar JWT={JWT} setJWT={setJWT} currentUser={currentUser} setCurrentUser={setCurrentUser}/>}
        <Routes>
          <Route path='/' element={<Redirect />} />
          <Route path='/home' element={<Home JWT={JWT} setJWT={setJWT} currentUser={currentUser} setCurrentUser={setCurrentUser} postToast={postToast} sentFriendToast={sentFriendToast} deletePostToast={deletePostToast} createCommentToast={createCommentToast} deleteCommentToast={deleteCommentToast} somethingWentWrong={somethingWentWrong}/>}/>
          <Route path='/myprofile' element={<MyProfile JWT={JWT} setJWT={setJWT} currentUser={currentUser} setCurrentUser={setCurrentUser} postToast={postToast} deletePostToast={deletePostToast}/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login JWT={JWT} setJWT={setJWT}/>}/>
        </Routes>
        <Toaster richColors/>
    </>
  )
}

export default App

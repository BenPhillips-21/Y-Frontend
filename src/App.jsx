import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import Navbar from './components/navbar.jsx'
import Redirect from './components/redirect.jsx'
import Home from './components/home.jsx'
import Profile from './components/profile.jsx'
import ProfileSettings from './components/profilesettings.jsx'
import Register from './components/register.jsx'
import Login from './components/login.jsx'

function App() {
  const [JWT, setJWT] = useState()
  const [currentUser, setCurrentUser] = useState()
  const [currentUserPostIDs, setCurrentUserPostIDs] = useState([])
  const [otherUser, setOtherUser] = useState()
  const [posts, setPosts] = useState([])

  const navigate = useNavigate()

  const postToast = () => toast.success('Post published successfully')
  const sentFriendToast = () => toast.success('Friend request sent')
  const deletePostToast = () => toast.success('Post deleted successfully')
  const postLikedToast = () => toast.success('Post liked successfully')
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

const [userFriendIDs, setUserFriendIDs] = useState([])
const [userFriendRequestIDs, setUserFriendRequestIDs] = useState([])
const [userSentFriendRequestIDs, setUserSentFriendRequestIDs] = useState([])

useEffect(() => {
    if (currentUser !== undefined) {
    let userFriends = currentUser.friends.map(friend => friend._id)
    setUserFriendIDs(userFriends)
    let userFriendRequests = currentUser.friendRequests.map(friendRequest => friendRequest._id)
    setUserFriendRequestIDs(userFriendRequests)
    let userSentFriendRequests = currentUser.sentFriendRequests.map(sentFriendRequest => sentFriendRequest)
    setUserSentFriendRequestIDs(userSentFriendRequests)
}
}, [currentUser])

  useEffect(() => {
    if (currentUser !== undefined) {
    let currentUserPosts = currentUser.posts.map(post => post._id);
    setCurrentUserPostIDs(currentUserPosts)
  }
  }, [currentUser])

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
      navigate('/profile')
  } catch (err) {
      throw new Error('Error occurred trying to visit user profile', err)
  }
}

const handleDemoLogin = async (e) => {
  e.preventDefault()
  
  try {
    const response = await fetch('http://localhost:3000/demologin', {
      method: 'GET',
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    let data = await response.json()
    setJWT(data.token)
    loginToast()
    navigate('/home')
  } catch (error) {
    console.error('Error:', error);
  }
}

const sendFriendRequest = async (e, userid) => {
  e.preventDefault()

  try {
      const response = await fetch(`http://localhost:3000/sendfriendrequest/${userid}`, {
          method: 'GET',
          headers: headers,
          mode: 'cors'
      }) 

      if (response.ok) {
          console.log("Friend request sent :D")
          fetchCurrentUser()
          sentFriendToast()
      } else {
          somethingWentWrong("Error sending friend request")
          throw new Error ("Error sending friend request")
      }
  } catch (err) {
      somethingWentWrong('Error occurred sending friend request')
      throw new Error ('Error occurred sending friend request')
  }
}

  const location = useLocation();
  const showNavbar = !['/register', '/login'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar headers={headers} fetchCurrentUser={fetchCurrentUser} fetchOtherUser={fetchOtherUser} logoutToast={logoutToast} handleVisitProfile={handleVisitProfile} JWT={JWT} setJWT={setJWT} otherUser={otherUser} setOtherUser={setOtherUser} currentUser={currentUser} setCurrentUser={setCurrentUser}/>}
        <Routes>
          <Route path='/' element={<Redirect />} />
          <Route path='/home' element={<Home headers={headers} userFriendIDs={userFriendIDs} userFriendRequestIDs={userFriendRequestIDs} userSentFriendRequestIDs={userSentFriendRequestIDs} sendFriendRequest={sendFriendRequest} currentUserPostIDs={currentUserPostIDs} posts={posts} setPosts={setPosts} fetchCurrentUser={fetchCurrentUser} fetchOtherUser={fetchOtherUser} handleVisitProfile={handleVisitProfile} JWT={JWT} setJWT={setJWT} otherUser={otherUser} setOtherUser={setOtherUser} currentUser={currentUser} setCurrentUser={setCurrentUser} postToast={postToast} sentFriendToast={sentFriendToast} deletePostToast={deletePostToast} createCommentToast={createCommentToast} deleteCommentToast={deleteCommentToast} somethingWentWrong={somethingWentWrong} postLikedToast={postLikedToast}/>}/>
          <Route path='/profile' element={<Profile headers={headers} userFriendIDs={userFriendIDs} userFriendRequestIDs={userFriendRequestIDs} userSentFriendRequestIDs={userSentFriendRequestIDs} sendFriendRequest={sendFriendRequest} fetchOtherUser={fetchOtherUser} navigate={navigate} currentUserPostIDs={currentUserPostIDs} createCommentToast={createCommentToast} deleteCommentToast={deleteCommentToast} posts={posts} setPosts={setPosts} fetchCurrentUser={fetchCurrentUser} fetchOtherUser={fetchOtherUser} handleVisitProfile={handleVisitProfile} JWT={JWT} setJWT={setJWT} otherUser={otherUser} setOtherUser={setOtherUser} currentUser={currentUser} setCurrentUser={setCurrentUser} postToast={postToast} deletePostToast={deletePostToast} somethingWentWrong={somethingWentWrong} postLikedToast={postLikedToast}/>}/>
          <Route path='/profilesettings' element={<ProfileSettings currentUser={currentUser} JWT={JWT} fetchCurrentUser={fetchCurrentUser} headers={headers}/>}/>
          <Route path='/register' element={<Register registerToast={registerToast} JWT={JWT} setJWT={setJWT} handleDemoLogin={handleDemoLogin}/>}/>
          <Route path='/login' element={<Login JWT={JWT} setJWT={setJWT} loginToast={loginToast} handleDemoLogin={handleDemoLogin}/>}/>
        </Routes>
        <Toaster richColors/>
    </>
  )
}

export default App

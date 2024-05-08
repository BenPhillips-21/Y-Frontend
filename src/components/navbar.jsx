import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/navbar.module.css'
import { Toaster, toast } from 'sonner';

const Navbar = ({headers, fetchCurrentUser, fetchOtherUser, logoutToast, handleVisitProfile, JWT, setJWT, otherUser, setOtherUser, currentUser, setCurrentUser}) => {
    const [openFriends, setOpenFriends] = useState(false)

    let navigate = useNavigate()

    const friendAccepted = () => toast.success('Friend Request Accepted')

    useEffect(() => {
        fetchCurrentUser()
    }, [JWT])

    console.log(currentUser, 'currentUser in navabar component')

    console.log(openFriends)

    const openFriendRequests = (e) => {
        e.preventDefault()
        setOpenFriends(!openFriends)
    }

    const acceptFriendRequest = async (e, userid) => {
        e.preventDefault()

        try {
            const response = await fetch(`http://localhost:3000/acceptfriendrequest/${userid}`, {
                method: 'GET',
                headers: headers,
                mode: 'cors'
            })

            if (response.ok) {
                friendAccepted()
                fetchCurrentUser()
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleMyProfileClick = async (e) => {
        e.preventDefault()
        setOtherUser('')
        navigate('/profile')
    }

    const handleLogout = async (e) => {
        e.preventDefault()
        setJWT()
        setCurrentUser()
        setOtherUser()
        logoutToast()
        navigate('/login')
    }


    return (
    <div className={styles.navContainer}>
        <Toaster richColors/>
        <nav className={styles.navbar}>
        <div className={styles.container}>
            <div className={styles.navbarContainer}>
                {/* <Link to="/home" className={styles.navbarLink}>Home</Link> */}
                <button id={styles.homeButtonStyling} onClick={() => navigate('/home')} className={styles.navbarLink}>Home</button>
            </div> 
                <div className={styles.navbarLinks}>
                    <button onClick={(e) => handleMyProfileClick(e)} className={styles.navbarLink}>My Profile</button>
                    <button onClick={(e) => openFriendRequests(e)} className={styles.navbarLink}>Friend Requests</button>
                    <button onClick={(e) => handleLogout(e)} className={styles.navbarLink}>Logout</button>
                </div>
                {openFriends && (
                    <div className={styles.friendRequestsDropdown}>
                        {currentUser.friendRequests.length > 0 ? currentUser.friendRequests.map((request, index) =>
                        <div className={styles.friendRequestInfo} key={index}>
                            <img src={request.profilePic.url}></img>
                            <p onClick={(e) => handleVisitProfile(e, request._id)}>{request.username}</p>
                            <button onClick={(e) => acceptFriendRequest(e, request._id)}>Accept Friend Request</button>
                        </div>
                    ) : <h2>No friend requests</h2>}
                    </div>
                )}
        </div>
        </nav>
    </div>
    );
};

export default Navbar
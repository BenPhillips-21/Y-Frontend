import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/navbar.module.css'
import { Toaster, toast } from 'sonner';

const Navbar = ({fetchCurrentUser, fetchOtherUser, logoutToast, handleVisitProfile, JWT, setJWT, otherUser, setOtherUser, currentUser, setCurrentUser}) => {
    const [openFriends, setOpenFriends] = useState(false)

    let navigate = useNavigate()

    const headers = {
        'Authorization': `Bearer ${JWT}`,
        'Content-Type': 'application/json'
    };

    const friendAccepted = () => toast.success('Friend Request Accepted')

    useEffect(() => {
        fetchCurrentUser()
    }, [JWT])

    console.log(currentUser, 'currentUser in navabar component')

    console.log(openFriends)

    const openFriendRequests = () => {
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
        navigate('/myprofile')
    }

    const handleLogout = async () => {
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
                <Link to="/home" className={styles.navbarLink}>Home</Link>
            </div>
                <div className={styles.navbarLinks}>
                    <button onClick={(e) => handleMyProfileClick(e)} style={{ backgroundColor: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }}  className={styles.navbarLink}>My Profile</button>
                    <button onClick={() => openFriendRequests()} style={{ backgroundColor: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }} className={styles.navbarLink}>Friend Requests</button>
                    <button onClick={() => handleLogout()} style={{ backgroundColor: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }} className={styles.navbarLink}>Logout</button>
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
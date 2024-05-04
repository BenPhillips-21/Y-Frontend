import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/navbar.module.css'
import { Toaster, toast } from 'sonner';

const Navbar = ({JWT, setJWT, currentUser, setCurrentUser}) => {
    const [openFriends, setOpenFriends] = useState(false)

    const headers = {
        'Authorization': `Bearer ${JWT}`,
        'Content-Type': 'application/json'
    };

    const friendAccepted = () => toast.success('Friend Request Accepted')

    useEffect(() => {
        fetchCurrentUser()
    }, [JWT])

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
                throw new Error ("Error retrieving user data")
            }
        } catch (err) {
            throw new Error ("Error fetching current user", err)
        }
    }

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

    return (
    <div className={styles.navContainer}>
        <Toaster richColors/>
        <nav className={styles.navbar}>
        <div className={styles.container}>
            <div className={styles.navbarContainer}>
                <Link to="/" className={styles.navbarLink}>Home</Link>
            </div>
                <div className={styles.navbarLinks}>
                    <Link to="/myprofile" className={styles.navbarLink}>My Profile</Link>
                    <button onClick={() => openFriendRequests()} style={{ backgroundColor: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }} className={styles.navbarLink}>Friend Requests</button>
                    <Link to="/logout" className={styles.navbarLink}>Logout</Link>
                </div>
                {openFriends && (
                    <div className={styles.friendRequestsDropdown}>
                        {currentUser.friendRequests.length > 0 ? currentUser.friendRequests.map((request, index) =>
                        <div className={styles.friendRequestInfo} key={index}>
                            <img src={request.profilePic.url}></img>
                            <p>{request.username}</p>
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
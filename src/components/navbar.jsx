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
                <img id={styles.homeButton} src={'/Y.svg'} onClick={() => navigate('/home')} className={styles.navbarLink}></img>
            </div> 
                <div className={styles.navbarLinks}>
                    {currentUser && (
                    <div className={styles.pfpAndName}>
                    <img id={styles.myProfilePic} onClick={(e) => handleMyProfileClick(e)} className={styles.navbarLink} src={currentUser.profilePic.url}></img>
                    <p onClick={(e) => handleMyProfileClick(e)} id={styles.myProfileUsername} className={styles.navbarLink}>{currentUser.username}</p>
                    </div>
                    )}
                    <div className={styles.friendRequestNav}>
                        {currentUser && 
                        <p>{currentUser.friendRequests.length}</p>}
                        <img onClick={(e) => openFriendRequests(e)} className={styles.navbarLink} src='/friendRequests.svg'/>
                    </div>
                    <img onClick={() => navigate('/profilesettings')} className={styles.navbarLink} src='/settingsGear.svg'></img>
                    <img onClick={(e) => handleLogout(e)} className={styles.navbarLink} src='/logout.svg'></img>
                </div>
                {openFriends && (
                    <div className={styles.friendRequestsDropdown}>
                        {currentUser.friendRequests.length > 0 ? currentUser.friendRequests.map((request, index) =>
                        <div className={styles.friendRequestInfo} key={index}>
                            <img src={request.profilePic.url}></img>
                            <p onClick={(e) => handleVisitProfile(e, request._id)}>{request.username}</p>
                            <img id={styles.addFriendButton} onClick={(e) => acceptFriendRequest(e, request._id)} src='/addFriend.svg'></img>
                        </div>
                    ) : <h3>No friend requests</h3>}
                    </div>
                )}
        </div>
        </nav>
    </div>
    );
};

export default Navbar
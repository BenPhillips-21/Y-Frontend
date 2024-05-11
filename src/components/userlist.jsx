import React, { useState, useEffect } from 'react';
import styles from '../styles/home.module.css';

const UserList = ({allUsers, userFriendIDs, userFriendRequestIDs, userSentFriendRequestIDs, currentUser, handleVisitProfile, sendFriendRequest}) => {

    return (
        <>
            <div className={styles.userListContainer}>
                {allUsers.some(user => !userFriendIDs.includes(user._id) && !userFriendRequestIDs.includes(user._id) && !userSentFriendRequestIDs.includes(user._id) && currentUser._id !== user._id) 
                && (<h2>Other Users</h2>)}
                {allUsers.map((user, index) => 
                <div className={styles.userListContainer} key={index}>
                    {!userFriendIDs.includes(user._id) &&
                    !userFriendRequestIDs.includes(user._id) &&
                    !userSentFriendRequestIDs.includes(user._id) &&
                    currentUser._id !== user._id && (
                        <div className={styles.userPicAndName}>
                            <img src={user.profilePic.url} alt={user.username} />
                            <p id={styles.userName} onClick={(e) => handleVisitProfile(e, user._id)}>{user.username}</p>
                            <img id={styles.addFriendButton} onClick={(e) => sendFriendRequest(e, user._id)} src='/addFriend.svg'></img>
                        </div>
                    )}
                </div>
                )}
            </div>
        </>
    )
}

export default UserList
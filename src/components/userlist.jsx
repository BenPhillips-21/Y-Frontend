import React, { useState, useEffect } from 'react';
import styles from '../styles/home.module.css';

const UserList = ({allUsers, isOpen, userFriendIDs, userFriendRequestIDs, userSentFriendRequestIDs, currentUser, handleVisitProfile, sendFriendRequest}) => {

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    return (
    <>
        <div className={styles.userListContainer}>
            {allUsers.some(user => 
                !userFriendIDs.includes(user._id) && 
                !userFriendRequestIDs.includes(user._id) && 
                !userSentFriendRequestIDs.includes(user._id) && 
                currentUser._id !== user._id
            ) && !isOpen && (<h2>Other Users</h2>)}

            {shuffleArray(allUsers
                .filter(user => 
                    !userFriendIDs.includes(user._id) &&
                    !userFriendRequestIDs.includes(user._id) &&
                    !userSentFriendRequestIDs.includes(user._id) &&
                    currentUser._id !== user._id
                ))
                .slice(0, 10)
                .map((user, index) => (
                    <div className={styles.userListContainer} key={index}>
                        <div className={styles.userPicAndName}>
                            <img src={user.profilePic.url} alt={user.username} />
                            <p id={styles.userName} onClick={(e) => handleVisitProfile(e, user._id)}>{user.username}</p>
                            <img id={styles.addFriendButton} onClick={(e) => sendFriendRequest(e, user._id)} src='/addFriend.svg' />
                        </div>
                    </div>
                ))}
        </div>
    </>
    )
}

export default UserList
import React, { useState, useEffect } from 'react';
import styles from '../styles/home.module.css';
import Post from './post.jsx'
import PostBox from './postbox.jsx'
import Spinner from './spinner.jsx'

const Home = ({ headers, userFriendIDs, userFriendRequestIDs, userSentFriendRequestIDs, sendFriendRequest, currentUserPostIDs, posts, setPosts, fetchCurrentUser, fetchOtherUser, handleVisitProfile, JWT, setJWT, otherUser, setOtherUser, currentUser, setCurrentUser, postToast, sentFriendToast, deletePostToast, createCommentToast, deleteCommentToast, somethingWentWrong, postLikedToast }) => {
    const [allUsers, setAllUsers] = useState([])
    const [showSpinner, setShowSpinner] = useState(true)

    useEffect(() => {
        setOtherUser('')
    }, [])

    useEffect(() => {
        fetchPosts()
        fetchCurrentUser()
        fetchAllUsers()
    }, [JWT])

    const fetchAllUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/getallusers', {
                method: 'GET',
                headers: headers,
                mode: 'cors'
            })

            if (response.ok) {
                let allUsersData = await response.json()
                setAllUsers(allUsersData)
            } else {
                somethingWentWrong('error occurred fetching all users')
                throw new Error ('error occurred fetching all users')
            }
        } catch (err) {
            somethingWentWrong('error fetching all users')
            throw new Error ('error fetching all users', err)
        }
    }

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:3000/getposts', {
                method: 'GET',
                headers: headers,
                mode: 'cors'
            });

            if (response.ok) {
                const data = await response.json();
                setPosts(data); 
                setShowSpinner(false)
            } else {
                somethingWentWrong('Failed to fetch posts')
                throw new Error('Failed to fetch posts');
            }
        } catch (error) {
            somethingWentWrong('Error fetching posts')
            console.error('Error fetching posts:', error);
        }
    };

    return (
        <div className={styles.homeContainer}>
            <div className={styles.postFatherContainer}>
                <div className={styles.postBox}>
                    <PostBox headers={headers}JWT={JWT}fetchPosts={fetchPosts}fetchCurrentUser={fetchCurrentUser}postToast={postToast}somethingWentWrong={somethingWentWrong}/>
                </div>
                    {
                        showSpinner && <Spinner />
                    }
                <div className={styles.postsContainer}>
                    {posts.length > 0 ? posts.map((post, index) => (
                        <Post key={index}currentUserPostIDs={currentUserPostIDs}headers={headers}post={post}index={index}currentUser={currentUser}deletePostToast={deletePostToast}JWT={JWT}posts={posts}setPosts={setPosts}somethingWentWrong={somethingWentWrong}deletePostToast={deletePostToast}createCommentToast={createCommentToast}deleteCommentToast={deleteCommentToast} postLikedToast={postLikedToast}handleVisitProfile={handleVisitProfile}/>
                    )) : <h1>Add some friends to see some content!</h1>}
                </div>
            </div>
            {currentUser && (
                <div className={styles.userListContainer}>
                           {allUsers.some(user => !userFriendIDs.includes(user._id) && !userFriendRequestIDs.includes(user._id) && !userSentFriendRequestIDs.includes(user._id) && currentUser._id !== user._id) 
                           && (<h2>Other Users</h2>)}
                    {allUsers.map((user, index) => (
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
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;

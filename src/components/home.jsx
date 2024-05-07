import React, { useState, useEffect } from 'react';
import styles from '../styles/home.module.css';
import Post from './post.jsx'
import PostBox from './postbox.jsx'

const Home = ({ headers, posts, setPosts, fetchCurrentUser, fetchOtherUser, handleVisitProfile, JWT, setJWT, otherUser, setOtherUser, currentUser, setCurrentUser, postToast, sentFriendToast, deletePostToast, createCommentToast, deleteCommentToast, somethingWentWrong }) => {
    const [allUsers, setAllUsers] = useState([])
    const [currentUserPostIDs, setCurrentUserPostIDs] = useState([])
    const [userFriendIDs, setUserFriendIDs] = useState([])
    const [userFriendRequestIDs, setUserFriendRequestIDs] = useState([])
    const [userSentFriendRequestIDs, setUserSentFriendRequestIDs] = useState([])

    useEffect(() => {
        if (currentUser !== undefined) {
        let currentUserPosts = currentUser.posts.map(post => post._id);
        setCurrentUserPostIDs(currentUserPosts)
        let userFriends = currentUser.friends.map(friend => friend._id)
        setUserFriendIDs(userFriends)
        let userFriendRequests = currentUser.friendRequests.map(friendRequest => friendRequest._id)
        setUserFriendRequestIDs(userFriendRequests)
        let userSentFriendRequests = currentUser.sentFriendRequests.map(sentFriendRequest => sentFriendRequest)
        setUserSentFriendRequestIDs(userSentFriendRequests)
    }
    }, [currentUser])

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
            } else {
                somethingWentWrong('Failed to fetch posts')
                throw new Error('Failed to fetch posts');
            }
        } catch (error) {
            somethingWentWrong('Error fetching posts')
            console.error('Error fetching posts:', error);
        }
    };

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

    return (
        <div className={styles.homeContainer}>
            <div className={styles.postFatherContainer}>
                <div className={styles.postBox}>
                    <PostBox headers={headers}fetchPosts={fetchPosts}fetchCurrentUser={fetchCurrentUser}postToast={postToast}somethingWentWrong={somethingWentWrong}/>
                </div>
                <div className={styles.postsContainer}>
                    {posts.map((post, index) => (
                        <Post key={index}currentUserPostIDs={currentUserPostIDs}headers={headers}post={post}index={index}currentUser={currentUser}deletePostToast={deletePostToast}JWT={JWT}posts={posts}setPosts={setPosts}somethingWentWrong={somethingWentWrong}deletePostToast={deletePostToast}createCommentToast={createCommentToast}deleteCommentToast={deleteCommentToast}/>
                    ))}
                </div>
            </div>
            {currentUser && (
                <div className={styles.userListContainer}>
                    <h1>New Users</h1>
                    {allUsers.map((user, index) => (
                        <div className={styles.userListContainer} key={index}>
                                {!userFriendIDs.includes(user._id) &&
                                !userFriendRequestIDs.includes(user._id) &&
                                !userSentFriendRequestIDs.includes(user._id) &&
                                currentUser._id !== user._id && (
                                    <div className={styles.userPicAndName}>
                                        <img src={user.profilePic.url} alt={user.username} />
                                        <p onClick={(e) => handleVisitProfile(e, user._id)}>{user.username}</p>
                                        <button onClick={(e) => sendFriendRequest(e, user._id)}>Add Friend</button>
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

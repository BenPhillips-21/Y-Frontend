import React, { useState, useEffect } from 'react';
import styles from '../styles/home.module.css';
import Post from './post.jsx'

const Home = ({ fetchCurrentUser, fetchOtherUser, handleVisitProfile, JWT, setJWT, otherUser, setOtherUser, currentUser, setCurrentUser, postToast, sentFriendToast, deletePostToast, createCommentToast, deleteCommentToast, somethingWentWrong }) => {
    const [posts, setPosts] = useState([])
    const [commentSection, setCommentSection] = useState([])
    const [commenting, setCommenting] = useState([])
    const [comment, setComment] = useState('')
    const [post, setPost] = useState('')
    const [allUsers, setAllUsers] = useState([])

    const headers = {
        'Authorization': `Bearer ${JWT}`,
        'Content-Type': 'application/json'
    };

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

    const handleMakePost = async (e) => {
        e.preventDefault()

        try {
            const postBodyRequest = {
                postContent: post
            };
    
            const response = await fetch('http://localhost:3000/createpost/', {
                method: 'POST',
                headers: headers,
                mode: 'cors',
                body: JSON.stringify(postBodyRequest)
            });
    
            if (response.ok) {
                fetchPosts() 
                fetchCurrentUser()
                setPost('')
                postToast()
            } else {
                somethingWentWrong('Failed to create post')
                console.error('Failed to create post')
            }
        } catch (err) {
            console.error('An error occurred making the post', err);
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
            <h2>Home Component</h2>
            <div className={styles.postBox}>
            <form>
                <input
                    type="text"
                    required
                    value={post}
                    onChange={(e) => setPost(e.target.value)}
                />
            </form>
            <button onClick={(e) => handleMakePost(e)}>Post</button>
            </div>
            <div className={styles.postsContainer}>
                {posts.map((post, index) => (
                    <Post post={post} index={index} currentUser={currentUser} deletePostToast={deletePostToast} JWT={JWT} setPosts={setPosts} somethingWentWrong={somethingWentWrong} deletePostToast={deletePostToast} commenting={commenting} setCommenting={setCommenting} commentSection={commentSection} setCommentSection={setCommentSection} comment={comment} setComment={setComment} createCommentToast={createCommentToast} deleteCommentToast={deleteCommentToast} />
                ))}
            </div>
            </div>
            {currentUser &&
            <div className={styles.userListContainer}>
                <h1>New Users</h1>
                {allUsers.map((user, index) => (
                    <div className={styles.userListContainer} key={index}>
                        {(!currentUser.friends.includes(user._id) && !currentUser.friendRequests.includes(user._id) && !currentUser.sentFriendRequests.includes(user._id) && currentUser._id !== user._id) &&
                        // not a friend AND not in friend requests AND not in sentfriendrequests AND not the current user
                        <div className={styles.userPicAndName}>   
                            <img src={user.profilePic.url}></img>
                            <p onClick={(e) => handleVisitProfile(e, user._id)}>{user.username}</p>
                            <button onClick={(e) => sendFriendRequest(e, user._id)}>Add Friend</button>
                        </div>}
                    </div>
                ))}
            </div>}
        </div>
    );
};

export default Home;

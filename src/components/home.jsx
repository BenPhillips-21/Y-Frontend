import React, { useState, useEffect } from 'react';
import styles from '../styles/home.module.css';
import Post from './post.jsx'
import PostBox from './postbox.jsx'
import Spinner from './spinner.jsx'
import UserList from './userlist.jsx'

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
              <PostBox headers={headers} JWT={JWT} fetchPosts={fetchPosts} fetchCurrentUser={fetchCurrentUser} postToast={postToast} somethingWentWrong={somethingWentWrong} />
              <button id={styles.otherUsersButton}>Other Users</button>
            </div>
            {showSpinner && <Spinner />}
            <div className={styles.postsContainer}>
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <Post key={index} currentUserPostIDs={currentUserPostIDs} headers={headers} post={post} index={index} currentUser={currentUser} deletePostToast={deletePostToast} JWT={JWT} posts={posts} setPosts={setPosts} somethingWentWrong={somethingWentWrong} createCommentToast={createCommentToast} deleteCommentToast={deleteCommentToast} postLikedToast={postLikedToast} handleVisitProfile={handleVisitProfile} />
                ))
              ) : (
                <h1>Add some friends to see some content!</h1>
              )}
            </div>
          </div>
          {currentUser && (
            <UserList allUsers={allUsers} userFriendIDs={userFriendIDs} userFriendRequestIDs={userFriendRequestIDs} userSentFriendRequestIDs={userSentFriendRequestIDs} currentUser={currentUser} handleVisitProfile={handleVisitProfile} sendFriendRequest={sendFriendRequest} />
          )}
        </div>
      );
    };

export default Home;

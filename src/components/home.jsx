import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import styles from '../styles/home.module.css';
// import { Toaster, toast } from 'sonner';

const Home = ({ fetchCurrentUser, JWT, setJWT, currentUser, setCurrentUser, postToast, sentFriendToast, deletePostToast, createCommentToast, deleteCommentToast, somethingWentWrong }) => {
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

    const handleMakePost = async () => {
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

    const handleDeletePost = async (e, postid) => {
        e.preventDefault()

        try {
            const response = await fetch(`http://localhost:3000/deletepost/${postid}`, {
                method: 'GET',
                headers: headers,
                mode: 'cors'
            })
            
            if (response.ok) {
                fetchPosts() 
                deletePostToast()   
            } else {
                somethingWentWrong("Failed to like post")
                throw new Error("Failed to like post")
            }

        } catch (err) {
            somethingWentWrong('Error occurred deleting post')
            throw new Error ('Error occurred deleting post', err)
        }
    }
    

    const handleLike = async (postid) => {
        try {
            const response = await fetch(`http://localhost:3000/likepost/${postid}`, {
                method: 'GET',
                headers: headers,
                mode: 'cors'
            })

            if (response.ok) {
                fetchPosts()    
            } else {
                somethingWentWrong("Failed to like post")
                throw new Error("Failed to like post")
            }
        } catch (err) {
            somethingWentWrong('Error liking post')
            console.error('Error liking post...', err)
        }
    }

    const handleAddCommentClick = async (postid) => {
        const isInArray = commenting.includes(postid)

        if (isInArray) {
            const newArray = commenting.filter(item => item !== postid)
            setCommenting(newArray)
        } else {
            const updatedCommenting = [...commenting, postid]
            setCommenting(updatedCommenting)
        }
    }

    const handleCommentClick = async (postid) => {
        const isInArray = commentSection.includes(postid)

        if (isInArray) {
            const newArray = commentSection.filter(item => item !== postid)
            setCommentSection(newArray)
        } else {
            const updatedCommentSection = [...commentSection, postid]
            setCommentSection(updatedCommentSection)
        }
    }

    const handleAddComment = async (e, postid) => {
        e.preventDefault()
        try {
        let commentPostBody = {
            "commentContent": comment
        }

        const response = await fetch(`http://localhost:3000/postcomment/${postid}`, {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            body: JSON.stringify(commentPostBody)
        })

        if (response.ok) {
            fetchPosts()
            setComment('')
            createCommentToast()
        }

        } catch (err) {
            somethingWentWrong("Error occurred adding comment")
            throw new Error ("Error occurred adding comment", err)
        }
    }

    const handleDeleteComment = async (e, postid, commentid) => {
        e.preventDefault()
    
        try {
            const response = await fetch(`http://localhost:3000/deletecomment/${postid}/${commentid}`, {
                method: 'GET', 
                headers: headers,
                mode: 'cors'
            });
    
            if (response.ok) {
                console.log('Comment deleted successfully')
                fetchPosts()
                deleteCommentToast()
            } else {
                somethingWentWrong('Error occurred deleting comment')
                console.log('Error occurred deleting comment')
            }
        } catch (error) {
            somethingWentWrong('Error deleting comment')
            throw new Error('Error deleting comment', error)
        }
    };
    

    const formatDate = (date) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
      }

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
                    <div className={styles.postContainer} key={index}>
                        <div className={styles.postHeader}>
                            <div className={styles.nameAndDateContainer}>
                                <img src={post.poster.profilePic.url}></img>
                                <p>{post.poster.username}</p>
                                <p>{formatDate(post.dateSent)}</p>
                            </div>
                            {(currentUser.posts.includes(post._id) || currentUser.admin === true) && 
                            <div className={styles.deleteContainer}>
                                <button onClick={(e) => handleDeletePost(e, post._id)}>Delete</button>
                            </div>}
                        </div>
                        <div className={styles.postBody}>
                            <p>{post.postContent}</p>
                        </div>
                        <div className={styles.postInfo}>
                            <p>{post.likes.length} Likes</p>
                            <p onClick={() => handleCommentClick(post._id)}>{post.comments.length} Comments</p>
                        </div>
                        <div className={styles.postFooter}>
                            <div className={styles.likeButtonContainer}>
                                <button onClick={() => handleLike(post._id)} id={styles.buttonStyling}>Like</button>
                            </div>
                            <div className={styles.commentButtonContainer}>
                                <button onClick={() => handleAddCommentClick(post._id)} id={styles.buttonStyling}>Comment</button>
                            </div>
                        </div>
                        {commentSection.includes(post._id) && 
                        <div className={styles.commentSection}>
                            {post.comments.map((comment, index) => (
                                <div className={styles.commentContainer} key={index}>
                                    <div className={styles.commentInfo}>
                                        <div className={styles.nameAndDateContainer}>
                                            <img src={comment.commenter.profilePic.url}></img>
                                            <p>{comment.commenter.username}</p>
                                            <p>{formatDate(comment.dateSent)}</p>
                                        </div>
                                        {currentUser._id === comment.commenter._id && 
                                        <div className={styles.deleteContainer}>
                                            <button onClick={(e) => handleDeleteComment(e, post._id, comment._id)}>Delete</button>
                                        </div>}
                                    </div>
                                <div className={styles.commentBody}>
                                    <p>{comment.commentContent}</p>
                                </div>
                                </div>
                            ))}
                        </div>}
                        {commenting.includes(post._id) && 
                            <div className={styles.commentBox}>
                            <form>
                                    <input
                                        type="text"
                                        required
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </form>
                                <button onClick={(e) => handleAddComment(e, post._id)}>Post</button>
                            </div>}
                    </div>
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
                            <p>{user.username}</p>
                            <button onClick={(e) => sendFriendRequest(e, user._id)}>Add Friend</button>
                        </div>}
                    </div>
                ))}
            </div>}
        </div>
    );
};

export default Home;

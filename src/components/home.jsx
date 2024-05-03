import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import styles from '../styles/home.module.css';

const Home = ({ JWT, setJWT }) => {
    const [posts, setPosts] = useState([])
    const [commentSection, setCommentSection] = useState([])
    const [commenting, setCommenting] = useState([])
    const [comment, setComment] = useState('')
    const [post, setPost] = useState('')
    const [currentUser, setCurrentUser] = useState()

    const headers = {
        'Authorization': `Bearer ${JWT}`,
        'Content-Type': 'application/json'
    };

    useEffect(() => {
        fetchPosts()
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
                throw new Error('Failed to fetch posts');
            }
        } catch (error) {
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
                fetchPosts(); 
                setPost(''); 
            } else {
                console.error('Failed to create post');
            }
        } catch (err) {
            console.error('An error occurred making the post', err);
        }
    };
    

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
                throw new Error("Failed to like post")
            }
        } catch (err) {
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
        }

        } catch (err) {
            throw new Error ("Error occurred adding comment", err)
        }
    }

    const formatDate = (date) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
      }

    console.log(currentUser)
    //  if current user posts array includes post._id && button
    //   delete button should only appear if the currentUser is an admin or the owner of the post :)

    return (
        <div>
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
                                <p>{post.poster.username}</p>
                                <p>{formatDate(post.dateSent)}</p>
                            </div>
                            {currentUser.posts.includes(post._id) && 
                            <div className={styles.deleteContainer}>
                                <button>Delete</button>
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
                                        <p>{comment.commenter.username}</p>
                                        <p>{formatDate(comment.dateSent)}</p>
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
    );
};

export default Home;

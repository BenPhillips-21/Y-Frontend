import React, {useEffect, useState} from 'react';
import styles from '../styles/post.module.css'; 
import { formatDistanceToNow } from 'date-fns';

const Post = ({post, index, fetchOtherUser, profile, currentUserPostIDs, currentUser, fetchCurrentUser, JWT, posts, setPosts, somethingWentWrong, deletePostToast, createCommentToast, deleteCommentToast, headers, postLikedToast}) => {
    const [commentSection, setCommentSection] = useState([])
    const [commenting, setCommenting] = useState([])
    const [comment, setComment] = useState('')

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
                if (profile !== undefined) {
                    profile._id.toString() === currentUser._id.toString() ? fetchCurrentUser() : fetchOtherUser(profile._id)
                } 
                postLikedToast()
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
            if (profile !== undefined) {
                profile._id.toString() === currentUser._id.toString() ? fetchCurrentUser() : fetchOtherUser(profile._id)
            } 
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

    return (
            <div className={styles.postContainer} key={index}>
                <div className={styles.postHeader}>
                    <div className={styles.headerContainer}>
                        <div className={styles.pfpContainer}>
                            <img src={post.poster.profilePic.url}></img>
                        </div>
                        <div className={styles.nameAndDateContainer}>
                            <p onClick={(e) => handleVisitProfile(e, post.poster._id)}>{post.poster.username}</p>
                            <p>{formatDate(post.dateSent)}</p>
                        </div>
                    </div>
                    {currentUserPostIDs.includes(post._id) && 
                    <div className={styles.deleteContainer}>
                        <button onClick={(e) => handleDeletePost(e, post._id)}>
                            <img src="/trash.svg" alt="Trash Can Icon"></img>
                        </button>
                    </div>
                    }
                </div>
                <div className={styles.postBody}>
                    {post.postContent && <p>{post.postContent}</p>}
                    {post.image && <img src={post.image.url}></img>}
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
                            <div className={styles.headerContainer}>
                                <div className={styles.nameAndDateContainer}>
                                    <img id={styles.commenterPfp} src={comment.commenter.profilePic.url}></img>
                                    <p id={styles.commenterUsernameStyling}>{comment.commenter.username}</p>
                                    <p id={styles.commentDateSentStyling}>{formatDate(comment.dateSent)}</p>
                                </div>
                                {currentUser._id === comment.commenter._id && 
                                <div className={styles.deleteContainer}>
                                        <img onClick={(e) => handleDeleteComment(e, post._id, comment._id)} src="/trash.svg" alt="Trash Can Icon"></img>
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
                            <textarea
                                type="text"
                                required
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </form>
                        <button onClick={(e) => handleAddComment(e, post._id)}>Post</button>
                    </div>}
            </div>
    )
}

export default Post
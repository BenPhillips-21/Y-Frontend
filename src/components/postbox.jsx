import React, {useEffect, useState} from 'react';
import styles from '../styles/postbox.module.css'

const PostBox = ({headers, fetchPosts, fetchCurrentUser, postToast, somethingWentWrong}) => {
    const [post, setPost] = useState('')

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
                fetchPosts ? fetchPosts() : ''
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

    const handleFormSubmit = (e) => {
        e.preventDefault(); 
    };

    return (
        <>
            <form className={styles.postBoxForm} onSubmit={handleFormSubmit}>
                <textarea
                    type="text"
                    required
                    placeholder="What's on your mind?"
                    value={post}
                    onChange={(e) => setPost(e.target.value)}
                />
                <button onClick={(e) => handleMakePost(e)}>Post</button>
            </form>
        </>
    )
}

export default PostBox
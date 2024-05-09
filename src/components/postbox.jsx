import React, {useEffect, useState} from 'react';
import styles from '../styles/postbox.module.css'

const PostBox = ({headers, JWT, fetchPosts, fetchCurrentUser, postToast, somethingWentWrong}) => {
    const [post, setPost] = useState('')
    const [attachingImage, setAttachingImage] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)

    const handleMakePost = async (e) => {
        e.preventDefault()

        try {
            if (selectedImage === null) {
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
        } else {
            let image = selectedImage
            const formData = new FormData()
            formData.append('image', image)
            formData.append('postContent', post)
            try {
                const response = await fetch('http://localhost:3000/createpost/', {
                    method: 'POST',
                    headers: { 
                        'Authorization': `Bearer ${JWT}`
                    },
                    mode: 'cors',
                    body: formData
                })
    
                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(`${errorData}`)
                }  
                
                fetchPosts ? fetchPosts() : ''
                setSelectedImage(null)
                setAttachingImage(false)
                setPost('')
                fetchCurrentUser()
                postToast()
            } catch (err) {
                throw new Error(`${err}`)
            }
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
                {attachingImage && 
                <form>
                    <input type="file" accept="image/*" onChange={(e) => setSelectedImage(e.target.files[0])} />
                </form>}
                <button id={styles.postBoxPostButton} onClick={(e) => handleMakePost(e)}>Post</button>
                <button id={styles.attachImageButton} onClick={() => setAttachingImage(!attachingImage)}>Attach Image</button>
            </form>
        </>
    )
}

export default PostBox
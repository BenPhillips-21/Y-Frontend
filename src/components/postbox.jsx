import React, {useEffect, useState} from 'react';

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

    const handleFormSubmit = (e) => {
        e.preventDefault(); 
    };

    return (
        <>
            <form onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    required
                    value={post}
                    onChange={(e) => setPost(e.target.value)}
                />
            </form>
            <button onClick={(e) => handleMakePost(e)}>Post</button>
        </>
    )
}

export default PostBox
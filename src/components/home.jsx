import React, { useState, useEffect } from 'react';

const Home = ({ JWT, setJWT }) => {
    const [posts, setPosts] = useState([]);

    const headers = {
        'Authorization': `Bearer ${JWT}`,
        'Content-Type': 'application/json'
    };

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

    useEffect(() => {
        fetchPosts();
    }, [JWT]); 

    return (
        <div>
            <h2>Home Component</h2>
            {posts.map((post, index) => (
                <p key={index}>{post.postContent}</p>
            ))}
        </div>
    );
};

export default Home;

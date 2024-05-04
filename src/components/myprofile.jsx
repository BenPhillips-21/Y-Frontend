import React, {useState} from 'react';
import styles from '../styles/myprofile.module.css'; 
import { Toaster, toast } from 'sonner';

const MyProfile = ({ JWT, setJWT, currentUser, setCurrentUser }) => {
    const [post, setPost] = useState('')

    const postToast = () => toast.success('Post published Successfully')
    const somethingWentWrong = (error) => toast.error(`Oh No! ${error}`)

    console.log(currentUser);

    const headers = {
        'Authorization': `Bearer ${JWT}`,
        'Content-Type': 'application/json'
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

    return (
        <div className={styles.fatherContainer}>
            <div className={styles.profileHeader}>
                <img src={currentUser.profilePic.url}></img>
                <h2>{currentUser.username}</h2>
            </div>
            <div className={styles.profileBodyContainer}>
                <div className={styles.aboutMeAndFriendsContainer}>
                    <div className={styles.aboutMeContainer}>
                        <h3>About Me</h3>
                        <p>{currentUser.bio}</p>
                    </div>
                    <div className={styles.friendsContainer}>
                        <h3>Friends</h3>
                        {currentUser.friends.map((friend, index) => (
                            <div key={index} className={styles.friendCard}>
                                <p>{friend.username}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.profilePostsContainer}>
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
                    <div className={styles.myPostsContainer}>
                        {currentUser.posts.map((post, index) => (
                            <div key={index} className={styles.postCard}>
                                <p>{post.postContent}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Toaster richColors/>
        </div>
    );
};

export default MyProfile;
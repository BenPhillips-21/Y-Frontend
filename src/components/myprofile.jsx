import React, {useEffect, useState} from 'react';
import styles from '../styles/myprofile.module.css'; 

const MyProfile = ({ fetchCurrentUser, fetchOtherUser, handleVisitProfile, JWT, setJWT, otherUser, setOtherUser, currentUser, setCurrentUser, postToast, deletePostToast,  }) => {
    const [post, setPost] = useState('')
    const [profile, setProfile] = useState()
    const [friends, setFriends] = useState()

    useEffect(() => {
        if (otherUser) {
            setProfile(otherUser)  
        } else {
            setProfile(currentUser) 
        }
    }, [otherUser]);

    useEffect(() => {
        if (profile && profile.friends) {
            let friendsArray = profile.friends.map(friend => friend._id);
            setFriends(friendsArray);
        }
    }, [profile])
    
    console.log(friends, 'friends array!!!!')
    const somethingWentWrong = (error) => toast.error(`Oh No! ${error}`)

    const headers = {
        'Authorization': `Bearer ${JWT}`,
        'Content-Type': 'application/json'
    };
    console.log(currentUser, 'current user');
    console.log(otherUser, 'profile visiting')
    console.log(profile, 'profile!!!!!')
    
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

    return (
        <div className={styles.fatherContainer}>
            <div className={styles.profileHeader}>
                <div className={styles.profilePicAndName}>
                    {profile && <img src={profile.profilePic.url}></img>}
                    {profile && <h2>{profile.username}</h2>}
                </div>
                {profile && profile._id !== currentUser._id &&
                <div className={styles.friendsOrNotBox}>
                    {friends.includes(currentUser._id) ? <h3>Friends</h3> : <h3>Enemies</h3>}
                </div>}
            </div>
            <div className={styles.profileBodyContainer}>
                <div className={styles.aboutMeAndFriendsContainer}>
                    <div className={styles.aboutMeContainer}>
                        <h3>About Me</h3>
                        {profile && <p>{profile.bio}</p>}
                    </div>
                    <div className={styles.friendsContainer}>
                        <h3>Friends</h3>
                        {profile && profile.friends.map((friend, index) => (
                            <div key={index} className={styles.friendCard}>
                                <p onClick={(e) => handleVisitProfile(e, friend._id)}>{friend.username}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.profilePostsContainer}>
                    {profile && profile._id === currentUser._id && 
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
                    </div>}
                    <div className={styles.myPostsContainer}>
                        {profile && profile.posts.map((post, index) => (
                            <div key={index} className={styles.postCard}>
                                <p>{post.postContent}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
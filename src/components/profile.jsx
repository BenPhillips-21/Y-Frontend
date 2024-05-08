import React, {useEffect, useState} from 'react';
import styles from '../styles/myprofile.module.css'; 
import Post from './post.jsx'
import PostBox from './postbox.jsx'

const Profile = ({ headers, currentUserPostIDs, navigate, posts, setPosts, createCommentToast, deleteCommentToast, fetchCurrentUser, fetchOtherUser, handleVisitProfile, JWT, setJWT, otherUser, setOtherUser, currentUser, setCurrentUser, postToast, deletePostToast,  }) => {
    const [post, setPost] = useState('')
    const [profile, setProfile] = useState()
    const [friends, setFriends] = useState()

    useEffect(() => {
        if (otherUser) {
            setProfile(otherUser)  
        } else {
            setProfile(currentUser) 
        }
    }, [otherUser, currentUser]);

    useEffect(() => {
        if (profile && profile.friends) {
            let friendsArray = profile.friends.map(friend => friend._id);
            setFriends(friendsArray);
        }
    }, [profile])
    
    const somethingWentWrong = (error) => toast.error(`Oh No! ${error}`)
    
    const handleMakePost = async (e) => {
        e.preventDefault();

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
                    <h3>Friends</h3>
                    {friends.includes(currentUser._id) ? <img src='/tick.svg'></img> : <img src='/cross.svg'></img>}
                </div>}
            </div>
            <div className={styles.profileBodyContainer}>
                <div className={styles.aboutMeAndFriendsContainer}>
                    <div className={styles.aboutMeContainer}>
                        <div className={styles.headingAndEditing}>
                            <h3>About Me</h3>
                            <img onClick={() => navigate('/profilesettings')}src='/editIcon.svg'></img>
                        </div>
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
                        <PostBox headers={headers} fetchCurrentUser={fetchCurrentUser} postToast={postToast} somethingWentWrong={somethingWentWrong}/>
                    </div>
                    }
                    <div className={styles.myPostsContainer}>
                        {profile && profile.posts.map((post, index) => (
                            <Post headers={headers} currentUserPostIDs={currentUserPostIDs} post={post} index={index} currentUser={currentUser} deletePostToast={deletePostToast} JWT={JWT} setPosts={setPosts} somethingWentWrong={somethingWentWrong} deletePostToast={deletePostToast} createCommentToast={createCommentToast} deleteCommentToast={deleteCommentToast} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
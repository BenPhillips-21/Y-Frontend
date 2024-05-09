import React, {useEffect, useState} from 'react';
import styles from '../styles/myprofile.module.css'; 
import Post from './post.jsx'
import PostBox from './postbox.jsx'

const Profile = ({ headers, userFriendIDs, userFriendRequestIDs, userSentFriendRequestIDs, sendFriendRequest, currentUserPostIDs, navigate, posts, setPosts, createCommentToast, deleteCommentToast, fetchCurrentUser, fetchOtherUser, handleVisitProfile, JWT, setJWT, otherUser, setOtherUser, currentUser, setCurrentUser, postToast, deletePostToast, somethingWentWrong, postLikedToast }) => {
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
                    {!friends.includes(currentUser._id) && !userFriendRequestIDs.includes(profile._id) && !userSentFriendRequestIDs.includes(profile._id) && <img id={styles.addFriendButton} onClick={(e) => sendFriendRequest(e, profile._id)} src='/addFriend.svg'></img>}
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
                        <PostBox headers={headers} JWT={JWT} fetchCurrentUser={fetchCurrentUser} postToast={postToast} somethingWentWrong={somethingWentWrong}/>
                    </div>
                    }
                    <div className={styles.myPostsContainer}>
                        {profile && profile.posts.map((post, index) => (
                            <Post headers={headers} fetchOtherUser={fetchOtherUser} profile={profile} currentUserPostIDs={currentUserPostIDs} post={post} index={index} currentUser={currentUser} deletePostToast={deletePostToast} JWT={JWT} setPosts={setPosts} somethingWentWrong={somethingWentWrong} deletePostToast={deletePostToast} createCommentToast={createCommentToast} deleteCommentToast={deleteCommentToast} fetchCurrentUser={fetchCurrentUser} postLikedToast={postLikedToast}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
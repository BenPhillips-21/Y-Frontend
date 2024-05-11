import React, {useEffect, useState} from 'react';
import styles from '../styles/profile.module.css'; 
import Post from './post.jsx'
import PostBox from './postbox.jsx'
import Spinner from './spinner.jsx'

const Profile = ({ headers, userFriendIDs, userFriendRequestIDs, userSentFriendRequestIDs, sendFriendRequest, currentUserPostIDs, navigate, posts, setPosts, createCommentToast, deleteCommentToast, fetchCurrentUser, fetchOtherUser, handleVisitProfile, JWT, setJWT, otherUser, setOtherUser, currentUser, setCurrentUser, postToast, deletePostToast, somethingWentWrong, postLikedToast }) => {
    const [post, setPost] = useState('')
    const [profile, setProfile] = useState()
    const [friends, setFriends] = useState()
    const [showSpinner, setShowSpinner] = useState(true)

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
            setShowSpinner(false) 
        }
    }, [profile])

    return (
        <div className={styles.fatherContainer}>
            <div className={styles.sonContainer}>
            <div className={styles.profileHeader}>
                <div className={styles.profilePicAndName}>
                    {profile && <img src={profile.profilePic.url}></img>}
                    {profile && <h2>{profile.username}</h2>}
                </div>
                {profile && profile._id !== currentUser._id && (
                    <div className={styles.friendsOrNotBox}>
                        {userSentFriendRequestIDs.includes(profile._id) ? (
                            <p>Friend Request Sent</p>
                        ) : (
                            <>
                                <h2>Friends</h2>
                                {friends.includes(currentUser._id) ? (
                                    <img src='/tick.svg' alt="Tick Icon" />
                                ) : (
                                    <img src='/cross.svg' alt="Cross Icon" />
                                )}
                                {!friends.includes(currentUser._id) &&
                                    !userFriendRequestIDs.includes(profile._id) &&
                                    !userSentFriendRequestIDs.includes(profile._id) && (
                                        <img
                                            id={styles.addFriendButton}
                                            onClick={(e) => sendFriendRequest(e, profile._id)}
                                            src='/addFriend.svg'
                                            alt="Add Friend Icon"
                                        />
                                    )}
                            </>
                        )}
                    </div>
                )}
            </div>
            <div className={styles.profileBodyContainer}>
                <div className={styles.aboutMeAndFriendsContainer}>
                    <div className={styles.aboutMeContainer}>
                        <div className={styles.headingAndEditing}>
                            <h3>About Me</h3>
                            {profile && profile._id === currentUser._id && <img onClick={() => navigate('/profilesettings')}src='/editIcon.svg'></img>}
                        </div>
                        <div className={styles.profileBioContainer}>
                            {profile && <p>{profile.bio}</p>}
                        </div>
                    </div>
                    <div className={styles.friendsContainer}>
                        <div className={styles.friendsContainerHeader}>
                            <h3>Friends</h3>
                        </div>
                        {profile && profile.friends.map((friend, index) => (
                            <div key={index} className={styles.friendCard}>
                                <img src={friend.profilePic.url}></img>
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
                    {
                        showSpinner && <Spinner />
                    }
                    <div className={styles.myPostsContainer}>
                        {profile && profile.posts.length > 0 ? profile.posts.map((post, index) => (
                            <Post headers={headers} fetchOtherUser={fetchOtherUser} profile={profile} currentUserPostIDs={currentUserPostIDs} post={post} index={index} currentUser={currentUser} deletePostToast={deletePostToast} JWT={JWT} setPosts={setPosts} somethingWentWrong={somethingWentWrong} deletePostToast={deletePostToast} createCommentToast={createCommentToast} deleteCommentToast={deleteCommentToast} fetchCurrentUser={fetchCurrentUser} postLikedToast={postLikedToast}/>
                        )) : <h1>This User Has No Posts!</h1>}
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default Profile;
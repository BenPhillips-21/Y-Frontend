import React, {useEffect, useState} from 'react';
import styles from '../styles/profilesettings.module.css'

const ProfileSettings = ({currentUser, JWT, fetchCurrentUser, headers}) => {
    const [changingPfp, setChangingPfp] = useState()
    const [selectedImage, setSelectedImage] = useState(null)
    const [bio, setBio] = useState('')
    const [username, setUsername] = useState('')

    const handlePfpChange = async (e) => {
        e.preventDefault()        
        let image = selectedImage
        const formData = new FormData()
        formData.append('image', image)
        try {
            const response = await fetch('http://localhost:3000/updateprofilepicture', {
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
            
            setSelectedImage(null)
            setChangingPfp(false)
            fetchCurrentUser()
        } catch (err) {
            throw new Error(`${err}`)
        }
    }

    const handleUpdateBio = async (e) => {
        e.preventDefault()
        let bioRequestBody = {
            bio: bio
        }
        try {
            const response = await fetch('http://localhost:3000/updatebio', {
                method: 'POST',
                headers: headers,
                mode: 'cors',
                body: JSON.stringify(bioRequestBody)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(`${errorData}`)
            }

            setBio('')
            fetchCurrentUser()
        } catch (err) {
            throw new Error(`${err}`)
        }
    }

    const handleUpdateUsername = async (e) => {
        e.preventDefault()
        
        let usernameRequestBody = {
            username: username
        }
        try {
            const response = await fetch('http://localhost:3000/updateusername', {
                method: 'POST',
                headers: headers,
                mode: 'cors',
                body: JSON.stringify(usernameRequestBody)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(`${errorData}`)
            }

            setUsername('')
            fetchCurrentUser()
        } catch (err) {
            throw new Error(`${err}`) 
        }
    }

    return (
        <>
        <div className={styles.settingsOuterContainer}>
            <div className={styles.settingsInnerContainer}>
                <div className={styles.pfpSettingsContainer}>
                    <h1>Settings</h1>
                    <div className={styles.updateUsernameContainer}>
                        <h2>Username</h2>
                        <input
                        type="text"
                        placeholder={currentUser.username}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        ></input>
                        <button onClick={handleUpdateUsername}>Update</button>
                    </div>
                    <div className={styles.pfpHeading}>
                        <h2>Profile Picture</h2>
                    </div>
                    <div className={styles.pfpChange}>
                        <img src={currentUser.profilePic.url}></img>
                        <button onClick={() => setChangingPfp(!changingPfp)}>Change</button>
                    </div>
                </div>
                {changingPfp && 
                <div className={styles.pfpInputBox}>
                    <form>
                        <input type="file" accept="image/*" onChange={(e) => setSelectedImage(e.target.files[0])} />
                        <button onClick={handlePfpChange}>Submit</button>
                    </form>
                </div>
                }
                <div className={styles.bioSettingsContainer}>
                    <h2>About Me</h2>
                    <textarea
                    type="text"
                    placeholder={currentUser.bio}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    />
                    <button onClick={handleUpdateBio}>Update</button>
                </div>
            </div>
        </div>
        </> 
    )
}

export default ProfileSettings
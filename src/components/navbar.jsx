import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/navbar.module.css'

const Navbar = ({JWT, setJWT}) => {
    return (
    <div className={styles.navContainer}>
        <nav className={styles.navbar}>
        <div className={styles.container}>
            <div className={styles.navbarContainer}>
                <Link to="/" className={styles.navbarLink}>Home</Link>
            </div>
                <div className={styles.navbarLinks}>
                    <Link to="/myprofile" className={styles.navbarLink}>My Profile</Link>
                    <Link to="/friendrequests" className={styles.navbarLink}>Friend Requests</Link>
                    <Link to="/logout" className={styles.navbarLink}>Logout</Link>
                </div>
        </div>
        </nav>
    </div>
    );
};

export default Navbar
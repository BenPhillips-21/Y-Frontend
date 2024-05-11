import styles from '../styles/spinner.module.css';

const Spinner = () => {
    return (
    <>
        <div className={styles.rollingContainer}>
            {<img id={styles.rolling} src='/rolling.svg'></img>}
        </div>
    </>
    )
}

export default Spinner
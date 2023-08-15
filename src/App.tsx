import { Messenger } from './components/Messenger';
import styles from './App.module.scss';

function App() {
    return (
        <div className={styles.root}>
            <div className={styles.main}>
                <h1 className={styles.title}>Bot Chat</h1>
                <h2 className={styles.subtitle}>AI-based service</h2>
                <Messenger />
            </div>
        </div>
    );
}

export default App;

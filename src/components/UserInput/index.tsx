import { ChangeEvent, KeyboardEvent, useState } from 'react';

import sendIcon from './assets/send-icon.svg';
import styles from './index.module.scss';

type Props = {
    onSendMessageClick: (message: string) => void;
};

export const UserInput = ({ onSendMessageClick }: Props) => {
    const [message, setMessage] = useState('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const sendMessage = () => {
        if (!message) {
            return;
        }

        onSendMessageClick(message);
        setMessage('');
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className={styles.wrapper}>
            <input
                className={styles.input}
                placeholder="Start typing here..."
                value={message}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />

            <button className={styles.sendButton} title="Send message" onClick={sendMessage}>
                <img src={sendIcon} alt="send message" />
            </button>
        </div>
    );
};

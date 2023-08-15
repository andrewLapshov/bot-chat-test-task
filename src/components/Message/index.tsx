import cls from 'classnames';

import robotAvatar from '../../assets/robot.svg';
import { DotsTyping } from '../DotsTyping';
import { Message as MessageType } from '../../types';
import styles from './index.module.scss';

type Props = {
    message: MessageType;
    onStopTyping: VoidFunction;
};

export const Message = ({
    message: { text, isMine, isFetching, isCanceled },
    onStopTyping,
}: Props) => {
    return (
        <div
            className={cls(styles.root, {
                [styles.root_mine]: isMine,
            })}
        >
            <div className={cls(styles.author, isMine ? styles.author_mine : styles.author_bot)}>
                {!isMine ? (
                    <img
                        src={robotAvatar}
                        alt="user avatar"
                        className={cls(styles.avatar, isMine && styles.avatar_mine)}
                    />
                ) : (
                    'T'
                )}
            </div>

            <div className={styles.content}>
                <div
                    className={cls(
                        styles.message,
                        isMine ? styles[`message_mine`] : styles[`message_bot`],
                    )}
                >
                    {text}
                    {isFetching && <DotsTyping />}
                </div>
            </div>

            <div className={styles.adjacent}>
                {!isMine && isFetching && (
                    <button className={styles.stopTyping} onClick={onStopTyping}>
                        Stop
                    </button>
                )}
                {isCanceled && <span className={styles.canceledMessage}>Canceled</span>}
            </div>
        </div>
    );
};

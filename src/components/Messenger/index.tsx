import { useCallback, useEffect, useRef, useState } from 'react';
import cls from 'classnames';
import { v4 } from 'uuid';

import { abortRequest, sendMessage } from '../../api';

import { Message } from '../Message';
import { UserInput } from '../UserInput';
import downIcon from './assets/down-icon.svg';

import styles from './index.module.scss';
import { Messages } from '../../types';

export const Messenger = () => {
    const [messages, setMessages] = useState<Messages>({ ids: [], messagesData: {} });
    const [isScrollBottomShown, setIsScrollBottomShown] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);
    const messagesHistoryRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        if (messagesHistoryRef.current) {
            messagesHistoryRef.current.scrollTop =
                messagesHistoryRef.current.scrollHeight - messagesHistoryRef.current.clientHeight;
        }
    }, []);

    const updateMessage = (id: string) => (message: string, isFetching?: boolean) => {
        setMessages((messages) => {
            if (!messages.messagesData[id]) {
                return messages;
            }

            return {
                ...messages,
                messagesData: {
                    ...messages.messagesData,
                    [id]: {
                        ...messages.messagesData[id],
                        text: messages.messagesData[id].text + message,
                        isFetching,
                    },
                },
            };
        });
    };

    const addMessage = async (message: string) => {
        const mineId = v4();
        const botId = v4();

        setMessages((messages) => ({
            ids: [...messages.ids, mineId, botId],
            messagesData: {
                ...messages.messagesData,
                [mineId]: { text: message, isMine: true },
                [botId]: { text: '', isMine: false, isFetching: true },
            },
        }));

        await sendMessage(botId, message, updateMessage(botId));
    };

    const cancelMessage = (id: string) => () => {
        abortRequest(id);
        setMessages((messages) => ({
            ...messages,
            messagesData: {
                ...messages.messagesData,
                [id]: { ...messages.messagesData[id], isFetching: false, isCanceled: true },
            },
        }));
    };

    const handleScroll = () => {
        if (messagesHistoryRef.current) {
            setIsScrollBottomShown(
                messagesHistoryRef.current.scrollHeight - messagesHistoryRef.current.scrollTop >
                    messagesHistoryRef.current.clientHeight + 200,
            );
        }
    };

    const handleBottomScrollButtonClick = () => {
        bottomRef.current?.scrollIntoView();
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const renderScrollButton = () => {
        return (
            <div
                className={cls({
                    [styles.scrollButton]: true,
                    [styles.scrollButton_hidden]: !isScrollBottomShown,
                })}
            >
                <div
                    className={styles.scrollButtonContent}
                    onMouseDown={handleBottomScrollButtonClick}
                >
                    <img
                        src={downIcon}
                        alt="back to beginning"
                        className={styles.scrollButtonIcon}
                    />
                    <div className={styles.scrollButtonCircle} />
                </div>
            </div>
        );
    };

    return (
        <>
            <div className={styles.root}>
                <div
                    ref={messagesHistoryRef}
                    className={styles.messageHistory}
                    onScroll={handleScroll}
                >
                    {!!messages.ids.length && (
                        <div className={styles.messageHistoryWrapper}>
                            {messages.ids.map((id) => (
                                <Message
                                    key={id}
                                    message={messages.messagesData[id]}
                                    onStopTyping={cancelMessage(id)}
                                />
                            ))}
                        </div>
                    )}

                    {!messages.ids.length && (
                        <div className={styles.emptyWrapper}>
                            <span className={styles.emptyText}>Пока сообщений нет</span>
                        </div>
                    )}

                    {renderScrollButton()}
                    <div ref={bottomRef} />
                </div>
            </div>

            <UserInput onSendMessageClick={addMessage} />
        </>
    );
};

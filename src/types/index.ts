export type Message = {
    text: string;
    isMine: boolean;
    isFetching?: boolean;
    isCanceled?: boolean;
};

export type Messages = {
    ids: string[];
    messagesData: { [key: string]: Message };
};

export type MessageChunk = {
    status: 'content' | 'done';
    value: string | null;
};

const requestControllers: { [key: string]: AbortController } = {};

export const abortRequest = (id: string) => {
    if (requestControllers[id]) {
        requestControllers[id].abort();
    }
};

export const sendMessage = async (
    id: string,
    message = 'Hello',
    onUpdateMessage: (message: string, isFetching?: boolean) => void,
) => {
    const controller = new AbortController();

    requestControllers[id] = controller;

    return fetch('http://185.46.8.130/api/v1/chat/send-message', {
        method: 'POST',
        body: JSON.stringify({ message }),
        headers: {
            Accept: 'application/json, text/plain, */*', // indicates which files we are able to understand
            'Content-Type': 'application/json', // indicates what the server actually sent
        },
        signal: controller.signal,
    })
        .then(function (response) {
            const reader = response.body?.getReader();

            let uncompletedChunk: string | null = null;

            function parseChunks() {
                if (!reader) {
                    return;
                }

                reader.read().then(function (result) {
                    if (result.done) {
                        return;
                    }

                    const data = new TextDecoder('utf-8').decode(result.value);
                    const dataArray = data.split(/(?=\{)/g);

                    if (uncompletedChunk) {
                        dataArray[0] = uncompletedChunk + dataArray[0];
                        uncompletedChunk = null;
                    }

                    if (dataArray.at(-1)?.at(-1) !== '}') {
                        uncompletedChunk = dataArray.pop() ?? null;
                    }

                    const dataArrayParsed = dataArray.map(
                        (data) => JSON.parse(data) as MessageChunk,
                    );

                    const botMessage = dataArrayParsed.reduce<string>((acc, { status, value }) => {
                        return status !== 'done' && value ? acc + value : acc;
                    }, '');

                    const isDone = dataArrayParsed.at(-1)?.status === 'done';

                    onUpdateMessage(botMessage, !isDone);

                    parseChunks();
                });
            }

            parseChunks();
        })
        .then(() => {
            delete requestControllers[id];
        })
        .catch((error) => {
            console.error(error);
        });
};

export const getHostUrl = (): string => {
    const currentHost = window.location.host;
const currentProtocol = window.location.protocol;
    // return `${currentProtocol}//${currentHost}`
    return "http://127.0.0.1:4000"
}


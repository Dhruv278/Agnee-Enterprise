export const getHostUrl = (): string => {
    const currentHost = window.location.host;
const currentProtocol = window.location.protocol;
    return `${currentProtocol}//${currentHost}`
}


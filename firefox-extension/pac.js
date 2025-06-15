const WHITE_LIST = [
    'youtube.com',
    'googlevideo.com',
    'ytimg.com',
    'ggpht.com',
    'youtu.be',
];

function FindProxyForURL(url, host) {
    const shortHost = host.replace(/(.+)\.([^.]+\.[^.]+$)/, '$2');
    if (WHITE_LIST.includes(shortHost)) return PROXY;
    return "DIRECT";
}

const PROXIES = [
    // PLACE YOUR PROXIES HERE
    // format: "PROXY <ip>:<port>"
];

chrome.runtime.onInstalled.addListener(async (details) => {
    chrome.storage.local.set({ proxyIndex: 0 });
    setProxy(0);
    console.log("Initialize the extension");
});

chrome.management.onEnabled.addListener(info => {
    chrome.storage.local.get("proxyIndex").then(res => {
        setProxy(res.proxyIndex);
    });
});

chrome.management.onDisabled.addListener(info => {
    chrome.proxy.settings.clear({});
});

chrome.action.onClicked.addListener(tab => {
    chrome.storage.local.get("proxyIndex").then(result => {
        result.proxyIndex += 1;
        if (result.proxyIndex >= PROXIES.length) result.proxyIndex = 0;
        chrome.storage.local.set({ proxyIndex: result.proxyIndex });
        setProxy(result.proxyIndex);
    });
});

function setProxy(proxyIndex) {
    fetch("pac.js").then(res => res.text()).then(text => {
        chrome.proxy.settings.set({
            scope: "regular",
            value: {
                mode: "pac_script",
                pacScript: {
                    data: `const PROXY = '${PROXIES[proxyIndex]}';` + text,
                }
            }
        });
    });

    chrome.action.setTitle({ title: "Proxy #" + proxyIndex });
}

const PROXIES = [
    // PLACE YOUR PROXIES HERE
    // format: "PROXY <ip>:<port>"
];

browser.runtime.onInstalled.addListener(async (details) => {
    browser.storage.local.set({ proxyIndex: 0 });
    setProxy(0);
    console.log("Initialize the extension");
});

browser.management.onEnabled.addListener(info => {
    browser.storage.local.get("proxyIndex").then(res => {
        setProxy(res.proxyIndex);
    });
});

browser.management.onDisabled.addListener(info => {
    browser.proxy.settings.clear({});
});

browser.action.onClicked.addListener(tab => {
    browser.storage.local.get("proxyIndex").then(result => {
        result.proxyIndex += 1;
        if (result.proxyIndex >= PROXIES.length) result.proxyIndex = 0;
        browser.storage.local.set({ proxyIndex: result.proxyIndex });
        setProxy(result.proxyIndex);
    });
});

function setProxy(proxyIndex) {
    fetch("pac.js").then(res => res.text()).then(text => {
        const pacScriptWithProxy = `const PROXY = '${PROXIES[proxyIndex]}';\n` + text;
        const blob = new Blob([pacScriptWithProxy]);
        browser.proxy.settings.set({
            scope: "regular",
            value: {
                proxyType: "autoConfig",
                autoConfigUrl: URL.createObjectURL(blob)
            }
        });
    });

    browser.action.setTitle({ title: "Proxy #" + proxyIndex });
}

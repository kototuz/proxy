export const ProxyType = {
    PAC_SCRIPT: 0,
    MANUAL:     1,
};

export async function trySetProxy() {
    const storage = await browser.storage.local.get();
    if (!storage.enabled) return;

    switch (storage.proxyType) {
        case ProxyType.PAC_SCRIPT:
            const pacScriptBase = await (await fetch("pac.js")).text();
            const pacScript = `const PROXY = "PROXY ${storage.proxy}";\n` + pacScriptBase;
            const blob = new Blob([pacScript], { type: "application/x-ns-proxy-autoconfig" });
            browser.proxy.settings.set({
                scope: "regular",
                value: {
                    proxyType: "autoConfig",
                    autoConfigUrl: URL.createObjectURL(blob)
                }
            });
            break;

        case ProxyType.MANUAL:
            browser.proxy.settings.set({
                scope: "regular",
                value: {
                    proxyType: "manual",
                    http: "http://" + storage.proxy,
                    httpProxyAll: true,
                }
            });
            break;

        default:
            console.error("unreachable");
    }
}

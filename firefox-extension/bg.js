import { trySetProxy, ProxyType } from "./set_proxy.js";

browser.runtime.onStartup.addListener(() => trySetProxy());

browser.runtime.onInstalled.addListener(() => {
    browser.storage.local.set({
        enabled: true,
        proxyType: ProxyType.PAC_SCRIPT,
    });
});

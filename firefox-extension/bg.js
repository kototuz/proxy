browser.storage.local.get("pacScript").then(data => {
    browser.proxy.settings.set({
        scope: "regular",
        value: {
            proxyType: "autoConfig",
            autoConfigUrl: URL.createObjectURL(new Blob([data.pacScript], { type: "application/x-ns-proxy-autoconfig" }))
        }
browser.runtime.onStartup.addListener(() => {
    browser.storage.local.get("pacScript").then(data => {
        browser.proxy.settings.set({
            scope: "regular",
            value: {
                proxyType: "autoConfig",
                autoConfigUrl: URL.createObjectURL(new Blob([data.pacScript], { type: "application/x-ns-proxy-autoconfig" }))
            }
        });
    });
});

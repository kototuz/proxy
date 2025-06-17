browser.runtime.onStartup.addListener(async () => {
    const storage = await browser.storage.local.get();
    if (!storage.enabled) return;

    const url = URL.createObjectURL(new Blob([storage.pacScript], { type: "application/x-ns-proxy-autoconfig" }));
    browser.proxy.settings.set({
        scope: "regular",
        value: {
            proxyType: "autoConfig",
            autoConfigUrl: url
        }
    });
});

browser.runtime.onInstalled.addListener(() => {
    browser.storage.local.set({ enabled: true });
});

import { trySetProxy } from "./set_proxy.js";

function createProxyElement(proxy, id) {
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "proxy";
    input.id = id;

    const label = document.createElement("label");
    label.textContent = proxy;
    label.for = id;

    const div = document.createElement("div");
    div.appendChild(input);
    div.appendChild(label);

    return div;
}

(async () => {
    const proxies = await (await fetch("proxies.json")).json();
    const storage = await browser.storage.local.get();

    const proxyList = document.getElementById("proxies");
    proxies.forEach((el, i) => {
        proxyList.appendChild(createProxyElement(el, i+""));
    });
    if (storage.proxyId !== undefined) {
        proxyList[storage.proxyId].checked = true;
    }
    proxyList.addEventListener("input", async (details) => {
        const proxy = details.target.parentElement.lastChild.textContent;
        const proxyId = parseInt(details.target.id);
        await browser.storage.local.set({ proxy: proxy, proxyId: proxyId });
        trySetProxy();
    });

    const enableDisableBtn = document.getElementById("enable-disable");
    var enabled = storage.enabled;
    enableDisableBtn.textContent = enabled ? "Disable" : "Enable";
    enableDisableBtn.addEventListener("click", async () => {
        if (enabled) {
            enableDisableBtn.textContent = "Enable";
            enabled = !enabled;
            browser.storage.local.set({ enabled: enabled });
            browser.proxy.settings.clear({});
        } else {
            enableDisableBtn.textContent = "Disable";
            enabled = !enabled;
            await browser.storage.local.set({ enabled: enabled });
            trySetProxy();
        }
    });

    const proxyTypeSelect = document.getElementById("proxy-type");
    proxyTypeSelect.selectedIndex = storage.proxyType;
    proxyTypeSelect.addEventListener("change", async () => {
        await browser.storage.local.set({ proxyType: proxyTypeSelect.selectedIndex });
        trySetProxy();
    });
})();

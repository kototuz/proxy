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

function setPacScript(pacScript) {
    const url = URL.createObjectURL(new Blob([pacScript], { type: "application/x-ns-proxy-autoconfig" }));
    browser.proxy.settings.set({
        scope: "regular",
        value: {
            proxyType: "autoConfig",
            autoConfigUrl: url
        }
    });
}

async function setPacScriptWithProxy(proxy) {
    const pacScript = await (await fetch("pac.js")).text();
    const pacScriptWithProxy = `const PROXY = '${proxy}';\n` + pacScript;
    await browser.storage.local.set({ pacScript: pacScriptWithProxy });

    const enabled = await (await browser.storage.local.get("enabled")).enabled;
    if (enabled) setPacScript(pacScriptWithProxy);
}

(async () => {
    const PROXIES = await (await fetch("proxies.json")).json();

    const proxyList = document.getElementById("proxies");
    PROXIES.forEach((el, i) => {
        proxyList.appendChild(createProxyElement(el, i+""));
    });

    const currentProxyId = (await browser.storage.local.get("proxyId")).proxyId;
    if (currentProxyId !== undefined) {
        proxyList[currentProxyId].checked = true;
    }

    proxyList.addEventListener("input", details => {
        const proxy = details.target.parentElement.lastChild.textContent;
        setPacScriptWithProxy(proxy);

        const proxyId = parseInt(details.target.id);
        browser.storage.local.set({ proxyId: proxyId });
    });

    const enableDisableBtn = document.getElementById("enable-disable");
    var enabled = (await browser.storage.local.get("enabled")).enabled;
    enableDisableBtn.textContent = enabled ? "Disable" : "Enable";
    enableDisableBtn.addEventListener("click", () => {
        if (enabled) {
            enableDisableBtn.textContent = "Enable";
            browser.proxy.settings.clear({});
        } else {
            enableDisableBtn.textContent = "Disable";
            browser.storage.local.get("pacScript").then(resp => {
                setPacScript(resp.pacScript);
            });
        }

        enabled = !enabled;
        browser.storage.local.set({ enabled: enabled });
    });
})();

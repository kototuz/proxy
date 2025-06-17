const PROXIES = [
    // PLACE YOUR PROXIES HERE
    // format: "PROXY <ip>:<port>"
];

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

async function setPacScriptWithProxy(proxy) {
    const pacScript = await (await fetch("pac.js")).text();
    const pacScriptWithProxy = `const PROXY = '${proxy}';\n` + pacScript;
    await browser.storage.local.set({ pacScript: pacScriptWithProxy });

    const url = URL.createObjectURL(new Blob([pacScriptWithProxy], { type: "application/x-ns-proxy-autoconfig" }));
    browser.proxy.settings.set({
        scope: "regular",
        value: {
            proxyType: "autoConfig",
            autoConfigUrl: url
        }
    });
}

(async () => {
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
    enableDisableBtn.addEventListener("click", () => {
        if (enableDisableBtn.textContent === "Disable") {
            browser.proxy.settings.clear({});
            enableDisableBtn.textContent = "Enable";
        } else {
            browser.storage.local.get("proxyId").then(resp => {
                setPacScriptWithProxy(PROXIES[resp.proxyId]);
                enableDisableBtn.textContent = "Disable";
            });
        }
    });
})();

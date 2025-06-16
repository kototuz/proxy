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

function setPacScriptWithProxy(proxy) {
    fetch("pac.js").then(res => res.text()).then(text => {
        const pacScriptWithProxy = `const PROXY = '${proxy}';\n` + text;
        const blob = new Blob([pacScriptWithProxy]);
        browser.proxy.settings.set({
            scope: "regular",
            value: {
                proxyType: "autoConfig",
                autoConfigUrl: URL.createObjectURL(blob)
            }
        });
    });
}

(async () => {
    const proxyList = document.getElementById("proxies");
    PROXIES.forEach((el, i) => {
        proxyList.appendChild(createProxyElement(el, i+""));
    });

    const currentProxyId = (await browser.storage.local.get("proxyId")).proxyId;
    proxyList[currentProxyId].checked = true;

    proxyList.addEventListener("input", details => {
        const proxy = details.target.parentElement.lastChild.textContent;
        setPacScriptWithProxy(proxy);

        const proxyId = parseInt(details.target.id);
        browser.storage.local.set({ proxyId: proxyId });
    });
})();

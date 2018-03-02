
function translateNode(node) {
    let msgId = node.dataset["msgid"] || node.id;
    let msg = browser.i18n.getMessage(msgId);
    
    if (node.nodeName === "INPUT" && node.type === "button")
        node.value = msg;
    else
        node.textContent = msg;
}
let nodes = document.querySelectorAll("[data-msgid]");
for (node of nodes) {
    translateNode(node);
}

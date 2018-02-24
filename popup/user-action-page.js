let log = console.log;
let error = console.error;
log("Ask before download, page start!");
let doc = document;
let win = window;

let gSendResponse = null;

function splitURL(url) {
    let i = url.indexOf("?");
    let param;
    var left;
    if (i > -1) {
        left = url.substring(0, i);
        param = url.substring(i);
    } else if((i = url.indexOf('#')) > -1) {
        left = url.substring(0, i);
        param = url.substring(i);
    } else {
        left = url;
    }
    i = left.lastIndexOf('/') + 1;
    let schem_auth_dir = left.substring(0, i);
    let file_name = left.substring(i);
    //log("splitURL ", schem_auth_dir, file_name, param);
    return [ schem_auth_dir, file_name, param ];
}

function handleMessage(request, sender, sendResponse) {
    log("handleMessage ", request, sender, sendResponse);
    if (request.action === "download") {
        let file_name;
        [ , file_name, ] = splitURL(request.url);
        doc.querySelector("#tab-name").textContent = request.tabName;
        doc.querySelector("#tab-uri").textContent = request.originUrl;
        doc.querySelector("#file-name").textContent = decodeURIComponent(request.fileName || file_name);
        doc.querySelector("#file-uri").textContent = request.url;
        doc.querySelector("#host-name").textContent = (new URL(request.originUrl)).hostname;
    }
    if (gSendResponse)
        log("*** Last confirm not made by user.");
    gSendResponse = sendResponse;

    function handleTabClose(tabId, removeInfo) {
        if (tabId == request.targetTabId) {
            console.log("Tab: " + tabId + " is closing");
            console.log("Window ID: " + removeInfo.windowId);
            console.log("Window is closing: " + removeInfo.isWindowClosing);
            sendResponse({
                cancel: true
            });
        }
    }
    browser.tabs.onRemoved.addListener(handleTabClose);

    log("handleMessage exit");
    return true;
}

function handleUserAction(e) {
    let reject = e.target.id !== "btn-allow";
    let resp = {};
    resp.cancel = reject;

    if (gSendResponse) {
        log("Send user action response ", resp);
        gSendResponse(resp);
    } else {
        log("Not sending user action resp, gSendResponse is ", gSendResponse);
    }
    gSendResponse = null;
    browser.tabs.getCurrent().then((tab) => {
        browser.tabs.remove(tab.id);
    });
}


doc.querySelector("#btn-reject").addEventListener("click", handleUserAction);
doc.querySelector("#btn-allow").addEventListener("click", handleUserAction);
browser.runtime.onMessage.addListener(handleMessage);

log("Ask before download, page end!");


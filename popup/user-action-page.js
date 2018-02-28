var log = console.log;
var error = console.error;

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
    } else if ((i = url.indexOf('#')) > -1) {
        left = url.substring(0, i);
        param = url.substring(i);
    } else {
        left = url;
    }
    i = left.lastIndexOf('/') + 1;
    let schem_auth_dir = left.substring(0, i);
    let file_name = left.substring(i);
    //log("splitURL ", schem_auth_dir, file_name, param);
    return [schem_auth_dir, file_name, param];
}

const SIZE_STEP = 1<<10;
const SIZE_GB = 1<<30;
const SIZE_MB = 1<<20;
const SIZE_KB = 1<<10;
function humanReadableSize(size) {
    size = parseInt(size);
    if (isNaN(size))
        return "unknown";
    let gb = Math.floor(size / SIZE_GB);
    size -= gb * SIZE_GB;
    let mb = Math.floor(size / SIZE_MB);
    size -= mb * SIZE_MB;
    let kb = Math.floor(size / SIZE_KB);
    size -= kb * SIZE_KB;

    let ret = "";
    if (gb)
        ret = gb + "." + Math.floor((mb/SIZE_STEP)*100) + " GB";
    else if (mb)
        ret = mb + "." + Math.floor((kb/SIZE_STEP)*100) + " MB";
    else
        ret = kb + "." + Math.floor((size/SIZE_STEP)*100) + " KB";
    return ret;
}

function rootHostName(host) {
    let r0 = host.split('.');
    if (r0.length <= 2)
        return host;
    return r0[r0.length-2] + "." + r0[r0.length-1];
}

function getFileExt(name) {
    let i = name.lastIndexOf('.');
    if (i < 0)
        return;
    return name.substring(i+1);
}

function handleMessage(request, sender, sendResponse) {
    log("handleMessage ", request, sender, sendResponse);
    if (request.action === "download") {
        let file_name;
        [, file_name,] = splitURL(request.url);
        let originUrl = new URL(request.originUrl || request.url);

        doc.querySelector("#tab-name").textContent = request.tabName;
        doc.querySelector("#tab-uri").textContent = request.originUrl;
        doc.querySelector("#file-name").textContent = decodeURIComponent(request.fileName || file_name);
        doc.querySelector("#file-uri").textContent = request.url;
        doc.querySelector("#file-size").textContent = humanReadableSize(request.fileSize);

        doc.querySelector("#host-name").textContent = originUrl.hostname;
        doc.querySelector("#host-name-radio").value = originUrl.hostname;
        doc.querySelector("#root-host-name").textContent = rootHostName(originUrl.hostname);
        doc.querySelector("#root-host-name-radio").value = rootHostName(originUrl.hostname);
        doc.querySelector("#mime-type-div").style.display = request.mimeType ? "block" : "none";
        doc.querySelector("#mime-type").textContent = request.mimeType;
        doc.querySelector("#mime-type-check").value = request.mimeType;
        let ext = getFileExt(request.fileName || file_name);
        doc.querySelector("#file-ext-div").style.display = ext ? "block" : "none";
        doc.querySelector("#file-ext").textContent = ext;
        doc.querySelector("#file-ext-check").value = ext;
    }
    if (gSendResponse)
        log("*** Last confirm not made by user.");
    gSendResponse = sendResponse;

    /*
    function handleTabClose(tabId, removeInfo) {
        if (tabId == request.targetTabId) {
            console.log("Tab: " + tabId + " is closing");
            console.log("Window ID: " + removeInfo.windowId);
            console.log("Window is closing: " + removeInfo.isWindowClosing);
            handleUserAction();
        }
    }
    browser.tabs.onRemoved.addListener(handleTabClose);
    */
    log("handleMessage exit");

    return true;  // ask the sender to wait for response
}

function handleRememberChoice(e) {
    let node = e.target;
    doc.querySelector("#remember-choice-div").style.display = node.checked ? "block" : "none";
}

function handleUserAction(e) {
    if (gSendResponse) {
        let resp = {};
        let reject;
        try {
            reject = e.target.id !== "btn-allow";
        } catch (ex) {
            reject = true;
        }
        resp.cancel = reject;
        if (doc.querySelector("#remember-choice").checked) {
            let remember = { action: reject ? "reject" : "allow" };
            let form = document.querySelector("form#remember-choice-div");
            var data = new FormData(form);
            for (const entry of data) {
                if (entry[1])
                    remember[entry[0]] = entry[1];
            }
            log("remember ", remember);
            resp.remember = remember;
        }
        log("Send user action response ", resp);
        gSendResponse(resp);
    } else {
        log("Not sending user action resp, gSendResponse is ", gSendResponse);
    }
    gSendResponse = null;
    if (e.type !== "beforeunload") {
        browser.tabs.getCurrent().then((tab) => {
            browser.tabs.remove(tab.id);
        });
    }
}

doc.querySelector("#remember-choice").addEventListener("change", handleRememberChoice);

doc.querySelector("#btn-reject").addEventListener("click", handleUserAction);
doc.querySelector("#btn-allow").addEventListener("click", handleUserAction);

browser.runtime.onMessage.addListener(handleMessage);

window.addEventListener("beforeunload", function (event) {
    log(event);
    handleUserAction(event);
});

log("Ask before download, page end!");


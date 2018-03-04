log("Ask before download, page start!");

let gSendResponse = null;

function handleMessage(request, sender, sendResponse) {
    log("handleMessage ", request, sender, sendResponse);
    if (request.action === "download") {
        let file_name;
        [, file_name,] = splitURL(request.url);
        let originUrl = new URL(request.originUrl || request.url);

        doc.querySelector("#tab-name").textContent = request.tabName;
        doc.querySelector("#tab-uri").textContent = request.originUrl;
        try {
            doc.querySelector("#file-name").textContent = decodeURIComponent(request.fileName || file_name);
        } catch (e) { }
        doc.querySelector("#file-uri").textContent = request.url;
        doc.querySelector("#file-size").textContent = humanReadableSize(request.fileSize);

        doc.querySelector("#host-name").textContent = originUrl.hostname;
        doc.querySelector("#host-name-radio").value = originUrl.hostname;
        let wildHostname = wildSubHostname(originUrl.hostname);
        doc.querySelector("#wild-host-name").textContent = wildHostname;
        doc.querySelector("#wild-host-name-radio").value = wildHostname;

        doc.querySelector("#mime-type").textContent = request.mimeType;
        doc.querySelector("#mime-type-check").value = request.mimeType;
        if (!request.mimeType) {
            doc.querySelector("#mime-type-div").style.display =  "none";
        }

        let ext = getFileExt(request.fileName || file_name);
        doc.querySelector("#file-ext").textContent = ext;
        doc.querySelector("#file-ext-check").value = ext;
        doc.querySelector("#file-ext-check").checked = request.mimeType === MIME_STREAM;
        if (!ext) {
            doc.querySelector("#file-ext-div").style.display = "none";
        }
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
    let userChoiceMade = e.type !== "beforeunload";

    if (gSendResponse) {
        let response = {};
        let reject;
        try {
            reject = e.target.id !== "btn-allow";
        } catch (ex) {
            reject = true;
        }
        response.cancel = reject;
        if (userChoiceMade && doc.querySelector("#remember-choice").checked) {
            let remember = { action: reject ? "reject" : "allow" };
            let form = document.querySelector("form#remember-choice-div");
            var data = new FormData(form);
            for (const entry of data) {
                if (entry[1])
                    remember[entry[0]] = entry[1];
            }
            log("remember ", remember);
            response.remember = remember;
        }
        log("Send user action response ", response);
        gSendResponse(response);
    } else {
        log("Not sending user action response, gSendResponse is ", gSendResponse);
    }

    gSendResponse = null;
    
    if (userChoiceMade) {
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


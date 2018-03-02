
log("Ask before download, start!");

function onError(error) {
    console.error("xxx-Error: ", error);
}

function handleConnected(port) {
    log("handleConnected", port);
}
browser.runtime.onConnect.addListener(handleConnected);

function mimeTypeTextToList(text) {
    let list = {};
    let lines = text.split('\n');
    for (var l of lines) {
        let r0 = l.replace(/^\s*|\s*$|\s*;\s*$/g, "")
        if (r0.startsWith('#') || r0.length === 0)
            continue;
        r0 = r0.split(/\s+/g);
        //log("splited ", r0);
        let mime = r0[0];
        let exts = r0.slice(1).map(x => new RegExp("\\." + x + '\\b'));
        list[mime] = exts;
    }
    return list;
}

var mimeTypeWhiteList = mimeTypeTextToList(mimeTypeWhiteListText);
log("mimeTypeWhiteList ", mimeTypeWhiteList);

var mimeTypeBlackList = mimeTypeTextToList(mimeTypeBlackListText);
log("mimeTypeBlackList ", mimeTypeBlackList);

function procConentType(type) {
    let r0 = type;
    if (/;|\s/.test(r0)) {
        r0 = r0.split(/;|\s/);
        r0 = r0[0];
        //log("procConentType: ", type, "=>", r0);
    }
    return r0;
}

const MIME_STREAM = "application/octet-stream";

function checkBlackList(blackList, request, type) {
    let url = request.url;
    let exts = blackList[type];
    /*
    if (type && type.indexOf("mp4") > -1) {
        log("type ", type, "exts ", exts);
    }
    */
    if (exts && type !== MIME_STREAM)
        return true;
    if (!exts)
        return;
    /* Check ext for octet-stream */
    for (let ext of exts) {
        //log("ext ", ext);
        if (ext.test(url)) {
            log("checkBlackList Match ", type, ext);
            return true;
        }
    }

}

function inMimeTypeWhiteList(whiteList, type) {
    if (type in whiteList) {
        log("ContentType ", type, " in white list");
        return true;
    }
}

var userMemList = {};
storage.get("userMemList").then((item) => {
    log("storage get item ", item);
    userMemList = item["userMemList"] || {};
}, onError);

function handleRememberChoice(mem) {
    if (!mem["host-name"] || !mem["action"])
        return
    let r0 = {};
    let hostname = mem["host-name"];
    r0["action"] = mem["action"];
    //if (mem["host-name"])
    //    r0["host-name"] = new RegExp(mem["host-name"].replace(".", "\\.") + "$");
    r0["mime-type"] = mem["mime-type"];
    if (mem["file-ext"])
        r0["file-ext"] = new RegExp("\\."+mem["file-ext"]+"\\b");
    //log("typeof file-ext", typeof mem["file-ext"]);

    if (!userMemList[hostname])
        userMemList[hostname] = [];
    userMemList[hostname].push(r0);
    //log("userMemList", userMemList);
    storage.set({ userMemList }).then(() => {
        log("storage set ok.", hostname, ":", r0);
    }, onError);
}


function rootHostName(host) {
    let r0 = host.split('.');
    if (r0.length <= 2)
        return host;
    return r0[r0.length-2] + "." + r0[r0.length-1];
}

function checkUserMemList(list, request, type) {
    let originUrl = new URL(request.originUrl || request.url);
    let hostname = originUrl.hostname;
    let rootHostname = "*." + rootHostName(hostname);
    let rs = [];
    rs = rs.concat(list[hostname]);
    if (hostname !== rootHostname)
        rs = rs.concat(list[rootHostname]);
    if (rs.length === 0)
        return;
    //log("mem rules:", rs)
    for (let r of rs) {
        if (!r)
            continue;
        if (r["mime-type"] && r["mime-type"] !== type)
            continue;
        if (r["file-ext"] && !r["file-ext"].test(request.url))
            continue;
        //log("userMemList match ", r);
        return { cancel: r["action"] === "reject" };
    }
}

function popupUserActionPage(request, msg, sendResponse) {
    let retryCount = 25;
    function sendMsgToConentScript() {
        function handleResponse(resp) {
            log("handleResponse", resp);
            if (resp.remember) {
                handleRememberChoice(resp.remember);
                delete resp.remember;
            }
            sendResponse(resp);
        }

        function reSend(error) {
            log("reSend due to error ", error);
            if (retryCount-- > 0)
                setTimeout(sendMsgToConentScript, 200);
            else
                sendResponse({ cancel: true });
        }
        // log("sendMessage to popup window for url ", msg.url);
        /*
        browser.runtime.sendMessage(msg)
            .then(handleResponse)
            .catch(reSend);
            */
        browser.tabs.sendMessage(msg.targetTabId, msg)
            .then(handleResponse)
            .catch(reSend);
    }

    function userActionPagePopedUp(tab) {
        log("confirm tab opened!");
        msg.targetTabId = tab.id;
        setTimeout(sendMsgToConentScript, 200);
    }

    let url = browser.extension.getURL("popup/user-action-page.html");
    browser.tabs.create({
        url: url,
        active: true,
        index: msg.tabIndex + 1,
        //openerTabId: msg.tabId,
    }).then(userActionPagePopedUp).catch(onError);
}

function getContentInfo(request) {
    let respHdr = request.responseHeaders;
    let info = {};
    //log("resp headers ", respHdr);
    for (let i = respHdr.length - 1; i >= 0; i--) {
        let name = respHdr[i].name.toLowerCase();
        let value = respHdr[i].value;
        if (name === "content-disposition"
            && value.indexOf("attachment") > -1) {
            //log("Filename ", value);
            info.contentIsAttachment = true;
            try {
                if (value.indexOf("filename*") < 0) {
                    info.fileName = value.split("filename=")[1].replace(/^['"]*|['"]*$/g, '');
                } else {
                    let ms = value.match(/filename\*\s*=\s*([^'"]+)\s*([^;]+)/g);
                    if (!ms)
                        info.fileName = '';
                    else {
                        log("filename*", ms);
                        info.fileName = ms[2];
                        if (ms[1] && ms[1].toLowerCase() === "utf-8")
                            info.fileName = decodeURIComponent(info.fileName);
                    }
                }
            } catch (e) { }
        } else if (name === "content-type") {
            //log("Content Type ", value);
            info.contentType = procConentType(value);
        } else if (name === "content-length") {
            info.contentLength = value;
        }
    }

    return info
}

const SIZE_MB = 1<<20;
const SIZE_LARGE_STREAM = 10<<20;

function isLargeOctetStream(contentType, fileSize){
    if (contentType !== "application/octet-stream")
        return false;
    
    fileSize = parseInt(fileSize);
    if (isNaN(fileSize))
        return false;
    if (fileSize >= SIZE_LARGE_STREAM) {
        log("large octet-stream, size > ", SIZE_LARGE_STREAM / SIZE_MB);
        return true;
    }
}

function filterRequest(request) {
    //log("filterRequest");
    /* Maybe only process 200 and 206 is enough */
    if (!(request.statusCode >= 200 && request.statusCode < 300)) {
        return {};
    }

    let respHdr = getContentInfo(request);
    let url = request.url;
    let contentType = respHdr.contentType;

    /*
    log("url ", url);
    log("request ", request);
    log("contentType ", contentType);
    log("userMemList ", userMemList);
    */
    let r0;
    try {
        r0 = checkUserMemList(userMemList, request, contentType);
    } catch (e) { }
    if (typeof r0 === "object") {
        return r0;
    }
    if (respHdr.contentIsAttachment && !inMimeTypeWhiteList(mimeTypeWhiteList, contentType)
        || checkBlackList(mimeTypeBlackList, request, contentType)
        || isLargeOctetStream(contentType, respHdr.contentLength)) {
        log("\n\n");
        error("!!!!! Block ", url);
        //error("           of request ", request);
        log("IsAttachment ", respHdr.contentIsAttachment);
        if (respHdr.contentIsAttachment)
            log("fileName ", respHdr.fileName);
        log("contentType ", contentType);

        try {
            var asyncCancel = new Promise((resolve, reject) => {
                //log("+++ In promise");
                let msg = {
                    action: "download",
                    url: url,
                    fileName: respHdr.fileName,
                    fileSize: respHdr.contentLength,
                    mimeType: contentType,
                    originUrl: request.originUrl || request.url,
                    tabName: "No Tab Name",
                };
                //notifyUserConfirm(msg, null, resolve);
                browser.tabs.get(request.tabId).then((tab) => {
                    msg.tabName = tab.title;
                    msg.tabId = tab.id;
                    msg.tabIndex = tab.index;
                    
                    popupUserActionPage(request, msg, resolve);
                });

            });
            return asyncCancel;
        } catch (e) {
            log(e);
        }
    }
}

browser.webRequest.onHeadersReceived.addListener(
    filterRequest,
    { urls: ["<all_urls>"] }, //, types: ["other"] 
    ["blocking", "responseHeaders"]
);

function handleInstalled(details) {
    log("Install reason: ", details.reason);
    let locale = browser.i18n.getUILanguage();
    log("locale: ", locale);
    browser.runtime.getPlatformInfo().then((info) => {
        if (info.os !== browser.runtime.PlatformOs.ANDROID) {
            browser.tabs.create({
                url: browser.extension.getURL("popup/on-install.html"),
            });
        }
    });
}

browser.runtime.onInstalled.addListener(handleInstalled);

log("Ask before download, done!");

/*
function logURL(requestDetails) {
    console.log("Loading: " + requestDetails.url);
}

browser.webRequest.onBeforeRequest.addListener(
    logURL,
    { urls: ["<all_urls>"] }
);
*/

/*
function notifyUserConfirm(request, sender, sendResponse) {
    log("notifyUserConfirm enter");
    var downloadNotification = "download-notification";
    var buttons = [
        {
            "title": "Allow"
        }, {
            "title": "Reject"
        }
    ];
    browser.notifications.create(downloadNotification + request.url, {
        "type": "basic",
        "iconUrl": browser.extension.getURL("icons/icon-96.png"),
        "title": "Need your action!",
        "message": `Tab:\n  ${request.host}\nWant to download:\n  ${request.url}\n\n`,
        //"buttons": buttons // Firefox doesn't support buttons
    });
    browser.notifications.onButtonClicked.addListener((id, index) => {
        browser.notifications.clear(id);
        console.log("You chose: button[" + id + "]:" + buttons[index].title);
    });
    browser.notifications.onClicked.addListener((notifId) => {
        log("User allowed download", notifId);
        sendResponse({});
    });
    browser.notifications.onClosed.addListener((notifId) => {
        log("User rejected download", notifId);
        sendResponse({ cancel: true });
    });
    log("notifyUserConfirm exit");
}
*/



//var pattern = "http*://*/*";
//let urlPrefix = /(https?|ftp):\/\/[^\/]+\/.*/;
// log("concat regex", new RegExp(urlPrefix.source + /\.apk\b/.source));


//var targetPage = "http*://*/*";
/*
var uaAndroidFF = "Mozilla/5.0 (Android 4.4; Mobile; rv:58.0) Gecko/58.0 Firefox/58.0";
var uaWin64FF = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0";
var uaReplace = uaAndroidFF;

function rewriteUserAgentHeader(e) {
    for (var header of e.requestHeaders) {
        if (header.name.toLowerCase() == "user-agent") {
            header.value = uaReplace;
        }
    }
    return { requestHeaders: e.requestHeaders };
}

browser.webRequest.onBeforeSendHeaders.addListener(
    rewriteUserAgentHeader,
    { urls: ["<all_urls>"] },
    ["blocking", "requestHeaders"]
);

console.log("ask before download start")
function onCanceled() {
    console.log(`Paused download`);
}

function onError(error) {
    console.log(`xxError: ${error}`);
}
function handleCreated(item) {
    //log(item.url);
    chrome.downloads.pause(item.id, onCanceled);
    //browser.downloads.pause(item.id).then(onCanceled, onError);
    log("created item", item.id, item.url, item.bytesReceived, " / ", item.totalBytes);
    return true;
}

function handleChanged(changes) {
    log("item changed", changes);
    browser.downloads.search({ id: changes.id }).then((items) => {
        for (var item of items) {
            log("created item", item.id, item.url, item.bytesReceived, " / ", item.totalBytes);
        }
    });
}

browser.downloads.onCreated.addListener(handleCreated);
browser.downloads.onChanged.addListener(handleChanged);
*/



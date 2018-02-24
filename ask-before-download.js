let log = console.log;
let error = console.error;
log("Ask before download, start!");

function onError(error) {
    console.error("Error: ", error);
}

function handleConnected(port) {
    log("handleConnected", port);
}
browser.runtime.onConnect.addListener(handleConnected);

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

// block list draft
var blockMimeTypeText = `
# Derived from:
# https://github.com/h5bp/server-configs-nginx/blob/master/mime.types
#
# License:
# Copyright (c) Nginx Server Configs

# Permission is hereby granted, free of charge, to any person obtaining a copy of
# this software and associated documentation files (the "Software"), to deal in
# the Software without restriction, including without limitation the rights to
# use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
# of the Software, and to permit persons to whom the Software is furnished to do
# so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
# Ask Before Download

application/vnd.android.package-archive   apk;

# Need to remove css html images

# Media files

audio/midi                            mid midi kar;
audio/mp4                             aac f4a f4b m4a;
audio/mpeg                            mp3;
audio/ogg                             oga ogg opus;
audio/x-realaudio                     ra;
audio/x-wav                           wav;

video/3gpp                            3gp 3gpp;
video/mp4                             f4p f4v m4v mp4;
video/mpeg                            mpeg mpg;
video/ogg                             ogv;
video/quicktime                       mov;
video/webm                            webm;
video/x-flv                           flv;
video/x-mng                           mng;
video/x-ms-asf                        asf asx;
video/x-ms-wmv                        wmv;
video/x-msvideo                       avi;

# Microsoft Office

application/msword                                                         doc;
application/vnd.ms-excel                                                   xls;
application/vnd.ms-powerpoint                                              ppt;
application/vnd.openxmlformats-officedocument.wordprocessingml.document    docx;
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet          xlsx;
application/vnd.openxmlformats-officedocument.presentationml.presentation  pptx;

# Other

application/java-archive              ear jar war;
application/mac-binhex40              hqx;
application/octet-stream              bin deb dll dmg exe img iso msi msm msp safariextz;
application/pdf                       pdf;
application/postscript                ai eps ps;
application/rtf                       rtf;
application/vnd.google-earth.kml+xml  kml;
application/vnd.google-earth.kmz      kmz;
application/vnd.wap.wmlc              wmlc;
application/x-7z-compressed           7z;
application/x-bb-appworld             bbaw;
application/x-bittorrent              torrent;
application/x-chrome-extension        crx;
application/x-cocoa                   cco;
application/x-java-archive-diff       jardiff;
application/x-java-jnlp-file          jnlp;
application/x-makeself                run;
application/x-opera-extension         oex;
application/x-perl                    pl pm;
application/x-pilot                   pdb prc;
application/x-rar-compressed          rar;
application/x-redhat-package-manager  rpm;
application/x-sea                     sea;
application/x-shockwave-flash         swf;
application/x-stuffit                 sit;
application/x-tcl                     tcl tk;
application/x-x509-ca-cert            crt der pem;
application/x-xpinstall               xpi;
# application/xhtml+xml                 xhtml;
# application/xslt+xml                  xsl;
application/zip                       zip;

`
    ;

var mimeTypeWhiteListText = `
# Data interchange

application/atom+xml                  atom;
application/json                      json map topojson;
application/ld+json                   jsonld;
application/rss+xml                   rss;
application/vnd.geo+json              geojson;
application/xml                       rdf xml;


# JavaScript

# Normalize to standard type.
# https://tools.ietf.org/html/rfc4329#section-7.2
application/javascript                js;


# Manifest files

application/manifest+json             webmanifest;
application/x-web-app-manifest+json   webapp;
text/cache-manifest appcache;

# Media files

image/bmp                             bmp;
image/gif                             gif;
image/jpeg                            jpeg jpg;
image/jxr                             jxr hdp wdp;
image/png                             png;
image/svg+xml                         svg svgz;
image/tiff                            tif tiff;
image/vnd.wap.wbmp                    wbmp;
image/webp                            webp;
image/x-jng jng;

# Serving '.ico' image files with a different media type
# prevents Internet Explorer from displaying then as images:
# https://github.com/h5bp/html5-boilerplate/commit/37b5fec090d00f38de64b591bcddcb205aadf8ee

image/x-icon cur ico;

# Web fonts

application/font-woff                 woff;
application/font-woff2                woff2;
application/vnd.ms-fontobject         eot;

# Browsers usually ignore the font media types and simply sniff
# the bytes to figure out the font type.
# https://mimesniff.spec.whatwg.org/#matching-a-font-type-pattern
#
# However, Blink and WebKit based browsers will show a warning
# in the console if the following font types are served with any
# other media types.

application/x-font-ttf                ttc ttf;
font/opentype                         otf;

# Other

application/xhtml+xml                 xhtml;
application/xslt+xml                  xsl;

text/css                              css;
text/csv                              csv;
text/html                             htm html shtml;
text/markdown                         md;
text/mathml                           mml;
text/plain                            txt;
text/vcard                            vcard vcf;
text/vnd.rim.location.xloc            xloc;
text/vnd.sun.j2me.app-descriptor      jad;
text/vnd.wap.wml                      wml;
text/vtt                              vtt;
text/x-component htc;
`;

var mimeTypeWhiteList = mimeTypeTextToList(mimeTypeWhiteListText);
log("mimeTypeWhiteList ", mimeTypeWhiteList);


function mimeTypeTextToList(text) {
    let list = [];
    let lines = text.split('\n');
    for (var l of lines) {
        let r0 = l.replace(/^\s*|\s*$|\s*;\s*$/g, "")
        if (r0.startsWith('#') || r0.length === 0)
            continue;
        r0 = r0.split(/\s+/g);
        log("splited ", r0);
        list.push({
            mime: r0[0],
            exts: r0.slice(1).map(x => new RegExp("\\." + x + '\\b'))
        });
    }
    return list;
}

var blockMimeTypeList = mimeTypeTextToList(blockMimeTypeText);
log("blockMimeTypeList ", blockMimeTypeList);

function checkBlockRules(rlist, request, type) {
    let url = request.url;
    for (let r0 of rlist) {
        if (type === r0.mime) {
            for (let ext of r0.exts) {
                //log("ext ", ext);
                if (ext.test(url)) {
                    log("checkBlockRules Match ", r0.mime, ext);
                    return true;
                }
            }
        }
    }
}

function inMimeTypeWhiteList(whiteList, type) {
    for (var w of whiteList) {
        if (type.startsWith(w.mime)) {
            log("ContentType ", type, " in white list");
            return true;
        }
    }
}

function popupUserActionPage(request, msg, sendResponse) {
    let retryCount = 25;
    function sendMsgToConentScript() {
        function handleResponse(resp) {
            log("handleResponse", resp);
            sendResponse(resp);
        }

        function reSend(error) {
            log("reSend due to error ", error);
            if (retryCount-- > 0)
                setTimeout(sendMsgToConentScript, 200);
            else
                sendResponse({ cancel: true });
        }
        log("sendMessage to popup window for url ", msg.url);
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
    log("user action page: ", url);
    browser.tabs.create({
        url: url,
        active: true,
        index: msg.tabIndex + 1,
        //openerTabId: msg.tabId,
    }).then(userActionPagePopedUp).catch(onError);
}


//var pattern = "http*://*/*";
//let urlPrefix = /(https?|ftp):\/\/[^\/]+\/.*/;
// log("concat regex", new RegExp(urlPrefix.source + /\.apk\b/.source));

function getContentInfo(request) {
    let respHdr = request.responseHeaders;
    let contentIsAttachment;
    let fileName;
    let contentType;
    //log("resp headers ", respHdr);
    for (let i = respHdr.length - 1; i >= 0; i--) {
        if (respHdr[i].name.toLowerCase() === "content-disposition"
            && respHdr[i].value.indexOf("attachment") > -1) {
            log("Filename ", respHdr[i].value);
            contentIsAttachment = true;
            fileName = respHdr[i].value;
            try {
                fileName = fileName.split("filename=")[1];
            } catch (e) { }
        } else if (respHdr[i].name.toLowerCase() === "content-type") {
            log("Content Type ", respHdr[i].value);
            contentType = respHdr[i].value;
        }
    }

    return [contentIsAttachment, fileName, contentType];
}

function filterReq(request) {
    if (request.statusCode !== 200) {
        return {};
    }
    let contentIsAttachment, fileName, contentType;
    [ contentIsAttachment, fileName, contentType ] = getContentInfo(request);

    let url = request.url;
    if (contentIsAttachment && !inMimeTypeWhiteList(mimeTypeWhiteList, contentType)
        || checkBlockRules(blockMimeTypeList, request, contentType)) {
        log("\n\n");
        log("contentIsAttachment ", contentIsAttachment);
        log("contentType ", contentType);
        error("!!!!! Block ", url);
        error("           of request ", request);

        try {
            var asyncCancel = new Promise((resolve, reject) => {
                log("+++ In promise");
                let msg = {
                    action: "download",
                    url: url,
                    fileName: fileName,
                    originUrl: request.originUrl,
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
    filterReq,
    { urls: ["<all_urls>"] }, //, types: ["other"] 
    ["blocking", "responseHeaders"]
);

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
    console.log(`Error: ${error}`);
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


function handleInstalled(details) {
    console.log(details.reason);
    if (browser.runtime.PlatformOs !== "android") {
        browser.tabs.create({
            url: browser.extension.getURL("popup/on-install.html"),
        });
    }
}

browser.runtime.onInstalled.addListener(handleInstalled);

log("Ask before download, done!");

const log = console.log;
const error = console.error;

let doc = document;
let win = window;

const storage = browser.storage.local;

function onError(error) {
    console.error("xxx-Error: ", error);
}

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

const MIME_STREAM = "application/octet-stream";
const SIZE_LARGE_STREAM = 10*SIZE_MB;

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

function rootHostname(host) {
    let r0 = host.split('.');
    if (r0.length <= 2)
        return host;
    return r0[r0.length-2] + "." + r0[r0.length-1];
}

function wildSubHostname(host) {
    return "*." + rootHostname(host);
}

function getFileExt(name) {
    let i = name.lastIndexOf('.');
    if (i < 0)
        return '';
    return name.substring(i+1);
}

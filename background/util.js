
const log = console.log;
const error = console.error;

let doc = document;
let win = window;

const storage = browser.storage.local;

function onError(error) {
    console.error("xxx-Error: ", error);
}

function rootHostName(host) {
    let r0 = host.split('.');
    if (r0.length <= 2)
        return host;
    return r0[r0.length-2] + "." + r0[r0.length-1];
}

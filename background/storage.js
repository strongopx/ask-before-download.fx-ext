
var userMemList = {};

function userMemListLoad(next) {
    storage.get("userMemList").then((item) => {
        log("storage get item ", item);
        userMemList = item["userMemList"] || {};
        if (next)
            next(userMemList);
    }, onError);
}
function userMemListAdd(hostname, item) {
    if (!userMemList[hostname])
        userMemList[hostname] = [];

    userMemList[hostname].push(item);
    //log("userMemList", userMemList);
    storage.set({ userMemList }).then(() => {
        log("storage set ok.", hostname, ":", item);
    }, onError);
}

function userMemListRemove(hostname, item) {
    let ruleList = userMemList[hostname];
    if (!ruleList)
        return;
    for (let i = 0; i < ruleList.length; i++) {
        let e = ruleList[i];
        if (e["action"] == item["action"] &&
            e["mime-type"] == item["mime-type"] &&
            e["file-ext"] == item["file-ext"]) {
            log("userMemListRemove found match.")
            ruleList.splice(i, 1);
            break;
        }
    }
    if (ruleList.length == 0)
        delete userMemList[hostname];
    //log("userMemList", userMemList);
    storage.set({ userMemList }).then(() => {
        log("storage set ok.", hostname, ":", item);
    }, onError);
    return ruleList.length == 0;
}

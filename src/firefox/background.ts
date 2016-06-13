/// <reference path="../../typings/chrome/chrome.d.ts" />

chrome.runtime.onMessage.addListener(function (message : any, _ : any, callback : any) {
    if (!message)
        return;
    if (message.operation == "get" && message.key) {
        chrome.storage.local.get(message.key, callback);
    } else if (message.operation == "set" && message.items) {
        chrome.storage.local.set(message.items, callback);
    }
});
/// <reference path="../../typings/chrome/chrome.d.ts" />
/// <reference path="../storage-proxy-interface.ts" />

/** Just a pass-through. */
class ChromeStorageProxy implements StorageProxyInterface {

    get(key : string, callback : (items: { [key: string]: any }) => void) : void {
        chrome.storage.local.get(key, callback);
    }

    set(items: Object, callback?: () => void) : void {
        chrome.storage.local.set(items, callback);
    }

}
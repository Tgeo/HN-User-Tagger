/// <reference path="../../typings/chrome/chrome.d.ts" />
/// <reference path="../storage-proxy-interface.ts" />

/** Firefox WebExtension based extensions do not support calling storage API
 * directly from content scripts. This proxies our storage.local.get operation
 * into a background script which DOES support calling the storage API.
 */
class FirefoxStorageProxy implements StorageProxyInterface {

    get(key : string, callback : (items: { [key: string]: any }) => void) : void {
        chrome.runtime.sendMessage({
            "operation": "get",
            "key": key
        }, callback);
    }

    set(items: Object, callback?: () => void) : void {
        chrome.runtime.sendMessage({
            "operation": "set",
            "items": items
        }, callback);
    }

}
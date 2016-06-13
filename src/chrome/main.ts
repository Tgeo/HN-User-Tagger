/// <reference path="../user-tagger.ts" />
/// <reference path="chrome-storage-proxy.ts" />

var storageProxy = new ChromeStorageProxy();
var tagger = new UserTagger(storageProxy);
tagger.initialize();
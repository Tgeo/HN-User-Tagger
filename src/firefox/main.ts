/// <reference path="../user-tagger.ts" />
/// <reference path="firefox-storage-proxy.ts" />

var storageProxy = new FirefoxStorageProxy();
var tagger = new UserTagger(storageProxy);
tagger.initialize();
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/chrome/chrome.d.ts" />
/// <reference path="storage-proxy-interface.ts" />

const addTag = "◁ add tag";
const viewTag = "◀ view tag";
const closeTag = "◁ close tag";
const tagSaved = "✅ tag saved!";

class UserTagger {
    
    storageProxy: StorageProxyInterface;

    constructor(storageProxy : StorageProxyInterface) {
        this.storageProxy = storageProxy;
    }

    public initialize() {
        this.storageProxy.get("tags", (tagsObject) => {
            // Get the existing tags.
            let allTags = tagsObject["tags"];
            console.log("Tags from storage", JSON.stringify(allTags));

            let userElements = $("td.default div span.comhead");
            userElements.each((_, elem) => {
                let userElem = $(elem);
                let userLink = userElem.children("a:first");
                let userid = userLink.text();

                let linkText = addTag;
                if (allTags && userid && allTags[userid])
                    linkText = viewTag;

                let tagUserLink = $('<a href="#" class="tagUserLink" style="margin-left:3px">' + linkText + '</a>');
                tagUserLink.on("click", { userid: userid, element: elem }, (event) => {
                    this.toggleUserTagForm(event);
                    return false; // Prevent the page from resetting to scrollTop = 0. (href="#").
                });
                userLink.after(tagUserLink);
            });
        });
    }
    
    private toggleUserTagForm(event: JQueryEventObject) {
        let userid = $('#userid').val();
        if (userid && userid == event.data.userid) {
            // Nothing to do -- they clicked the link while the form was open. Close it.
            this.removeTagForm();
            this.tryUpdateTagUserLinkText(closeTag);
            return;
        }

        // Remove any existing tag forms. Multiple forms would cause issues.
        this.removeTagForm();

        this.storageProxy.get("tags", (tagsObject) => {
            let allTags = tagsObject["tags"];
            let existingTag = "";
            if (allTags && allTags[event.data.userid])
                existingTag = allTags[event.data.userid];

            // Create the tag form.
            let tagForm = $('<form id="tagForm"><input id="userid" type="hidden" value="' +
                event.data.userid +
                '"></input><textarea id="tag" rows="5">' +
                existingTag +
                '</textarea><br /><input type="submit" value="OK"></input></form>');
            tagForm.submit((event) => this.addTagToUser(event)); // Add the submit handler.

            // Add the form under the user element.
            let userElem = $(event.data.element);
            userElem.append(tagForm);
            this.tryUpdateTagUserLinkText(closeTag);
        });
    }

    private addTagToUser(event: JQueryEventObject) {
        event.preventDefault();
        // Get the values from the form.    
        let tag = $('#tag').val();
        let userid = $('#userid').val();
        if (!userid)
            return;

        this.storageProxy.get("tags", (tagsObject) => {
            // Get the existing tags.
            let allTags = tagsObject["tags"];
            if (!allTags)
                allTags = {}; // This must be the first tag.  

            // Add (or replace) the tag for the user.
            allTags[userid] = tag;

            // Save all tags.
            this.storageProxy.set({ tags: allTags }, () => {
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError);
                    alert("Tag save unsuccessful: " + chrome.runtime.lastError);
                } else {
                    console.log("Tag save was successful");
                    this.tryUpdateTagUserLinkText(tagSaved);
                    this.removeTagForm();
                }
            });
        });
    }

    private removeTagForm() {
        $('#tagForm').remove();
    }

    private tryUpdateTagUserLinkText(newText: string) {
        let tagForm = $('#tagForm');
        if (!tagForm)
            return;

        let tagUserLink = tagForm.parent().children('.tagUserLink').first();
        if (tagUserLink) {
            tagUserLink.text(newText);
        }
    }
}
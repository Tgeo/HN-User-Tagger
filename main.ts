(() => {

    // ◀
    // ◁
    // ✅
    
    enum TagUserText {
        AddTag,
        ViewTag,
        TagSaved
    }
    
    class UserTag {        
        
        userName : string;
        tagUserText : TagUserText;
        
        constructor(userName: string) {
            this.userName = userName;
            this.tagUserText = TagUserText.AddTag;
        }
        
        
        
    }
    
    
    
    chrome.storage.local.get("tags", function(tagsObject) {
        
        // Get the existing tags.
        let allTags = tagsObject["tags"];
        console.log("Tags from storage", JSON.stringify(allTags));
        
        let userElements = $("td.default div span.comhead");
        userElements.each(function(_, elem) { 
                   
            let userElem = $(elem);
            let userLink = userElem.children("a:first");
            let userid = userLink.text();
            
            let linkText = "◁ add tag";
            if (allTags && userid && allTags[userid])
                linkText = "◀ view tag";
            
            let tagUserLink = $('<a href="#" class="tagUserLink" style="margin-left:3px">' + linkText + '</a>');
            tagUserLink.on("click", { userid: userid, element: elem }, function(event) {
                toggleUserTagForm(event);
                return false; // Prevent the page from resetting to scrollTop = 0. (href="#").
            });
            userLink.after(tagUserLink);
        });
    });

    function toggleUserTagForm(event : JQueryEventObject) {
        
        let userid = $('#userid').val();
        if (userid && userid == event.data.userid) {
            // Nothing to do -- they clicked the link while the form was open. Close it.
            removeTagForm();
            tryUpdateTagUserLinkText('◁ close tag');
            return;
        }
        
        // Remove any existing tag forms. Multiple forms would cause issues.
        removeTagForm();
                        
        chrome.storage.local.get("tags", function(tagsObject) {
            
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
            tagForm.submit(addTagToUser); // Add the submit handler.
            
            // Add the form under the user element.
            let userElem = $(event.data.element);
            userElem.append(tagForm);            
            tryUpdateTagUserLinkText('◁ close tag');
        });
    }
    
    function addTagToUser(event : JQueryEventObject) {
        
        event.preventDefault();    
        // Get the values from the form.    
        let tag = $('#tag').val();
        let userid = $('#userid').val();
        if (!userid)
            return;
                
        chrome.storage.local.get("tags", function(tagsObject) {    
            
            // Get the existing tags.
            let allTags = tagsObject["tags"];            
            if (!allTags)
                allTags = {}; // This must be the first tag.  
                
            // Add (or replace) the tag for the user.
            allTags[userid] = tag;
            
            // Save all tags.
            chrome.storage.local.set({ tags: allTags }, function() {
                
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError);
                    alert("Tag save unsuccessful: " + chrome.runtime.lastError);
                } else {
                    console.log("Tag save was successful");
                    tryUpdateTagUserLinkText('✅ tag saved!');
                    removeTagForm();
                }
            });
        });        
    }
    
    function removeTagForm() {
        $('#tagForm').remove();
    }
    
    function tryUpdateTagUserLinkText(newText : string) {
        
        let tagForm = $('#tagForm');
        if (!tagForm)
            return;
        
        let tagUserLink = tagForm.parent().children('.tagUserLink').first();
        if (tagUserLink) {
            tagUserLink.text(newText);
        }
    }

})();

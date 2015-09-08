//
// Call Add Domain 
// Function on mobile_viewer.js
//

function addDomain(info, tab) {
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "functiontoInvoke": "whiteList"
        });
    });
}

//
// Call Remove Domain
// Function on mobile_viewer.js
//
function removeDomain(info, tab) {
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "functiontoInvoke": "blackList"
        });
    });
}


//
// Call Open Mobile Viewer Function
//
function openMobileViewer(info, tab) {
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "functiontoInvoke": "openMobileViewer"
        });
    });
}

//
// Add Domain Button
//
chrome.contextMenus.create({
    "title": "Add Domain",
    "contexts": ["page", "selection", "image", "link", "video"],
    "onclick" : addDomain
});


//
// Remove Domain Button
//
chrome.contextMenus.create({
    "title": "Remove Domain",
    "contexts": ["page", "selection", "image", "link", "video"],
    "onclick" : removeDomain
});


//
// Open the viewer
//
chrome.contextMenus.create({
    "title": "Open Flexer",
    "contexts": ["page", "selection", "image", "link", "video"],
    "onclick" : openMobileViewer
});

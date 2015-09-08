$(document).ready(function() {

    //
    // CONTEXT MENU OPTIONS
    //
    chrome.extension.onMessage.addListener(function (message, sender, callback) {
        // Add DOMAIN
        if (message.functiontoInvoke == "whiteList") {
            addToWhiteList();
        }
        // Remove DOMAIN
        if (message.functiontoInvoke == "blackList") {
            removeFromWhiteList();
        }
        // OPEN VIEWER
        if (message.functiontoInvoke == "openMobileViewer") {
            if(mobileViewerExtension.called) {
                $('#chrome-extension-mobile-viewer').addClass('open');
            } else {
                alert('You must add this domain first to use Flexer on this page.');
            }
        }
    });


    //
    // ADD TO WHITE LIST
    //
    function addToWhiteList(url) {
        
        chrome.storage.sync.get('mobileWhiteList', function(obj) {

            var pageUrl = document.domain;
            var mobileWhiteList = obj.hasOwnProperty('mobileWhiteList') ? obj.mobileWhiteList : [];

            mobileWhiteList.push(pageUrl);

            chrome.storage.sync.set({'mobileWhiteList': mobileWhiteList}, function() {
                if (chrome.runtime.lastError)
                    console.log(chrome.runtime.lastError);
                else
                    alert('This domain can now use Flexer. Refresh page to get started.');
            });

        });
    }


    //
    // REMOVE FROM WHITE LIST
    //
    function removeFromWhiteList(url) {
        chrome.storage.sync.get({mobileWhiteList: []}, function(data) {
            var pageUrl = document.domain;

            for(var i = data.mobileWhiteList.length-1; i >= 0; i--) {
                if(data.mobileWhiteList[i] === document.domain) {
                    data.mobileWhiteList.splice(i, 1);
                }
            }
            
            
            chrome.storage.sync.set(data, function() {
                if (chrome.runtime.lastError)
                    console.log(chrome.runtime.lastError);
                else
                    alert('Domain removed.');
            });
        });
    }
    
    
    
    //
    // CHECK TO SEE IF USER
    // ADDED URL TO WHITE-LIST
    //
    chrome.storage.sync.get(null, function (data) {
        for(var i = 0; i < data.mobileWhiteList.length; i++) {
            if(data.mobileWhiteList[i] ==  document.domain) {
                mobileViewerExtension();
            } 
        }
        console.info(data.mobileWhiteList)
    });

   
    

    //
    // ADD THE MOBILE VIEWER
    //
    function mobileViewerExtension() {
        mobileViewerExtension.called = true;
        
        $('body').append('<div id="chrome-extension-mobile-viewer"></div>');

        var mobileViewer    = $('#chrome-extension-mobile-viewer');
        var mobileViewerURL = chrome.extension.getURL("html/mobile_viewer.html");

        
        function loadMobileViewer() {
            mobileViewer.load(mobileViewerURL);
        }
        loadMobileViewer();

        var currentURL = window.location.href;
        var loadIframe = $('.extension-mobile-viewer').attr('src', currentURL);

        $.ajax({
            url:loadMobileViewer(),
            success:function(){
                $('.extension-mobile-viewer').attr('src', currentURL);
                typeChange();
            }
        })



        
        ///////////////////
        // KEY COMBINATIONS
        ///////////////////
        function handleKeyDown(e) {
            var ctrlPressed=0;
            var shiftPressed=0;
            var evt = (e==null ? event:e);


            shiftPressed=evt.shiftKey;
            ctrlPressed =evt.ctrlKey;
            self.status=""
                +  "shiftKey="+shiftPressed 
                +", ctrlKey=" +ctrlPressed 

            //
            // CTRL + SHIFT + M
            // TOGGLES MOBILE VIEW
            //
            if (document.activeElement == document.body && evt.keyCode==77) {
                mobileViewer.toggleClass('open');
            }
            
            //
            // CTRL + SHIFT + R
            // RELOADS IFRAME
            //
            if (document.activeElement == document.body && evt.keyCode==82) {
                $( 'iframe#mobile-extension-viewer-device' ).attr( 'src', function ( i, val ) { return val; });
            }

            //
            // ESCAPE PRESS
            // CLOSES MOBILE VIEWER
            //
            if (evt.keyCode == 27) { 
                closeMobileViewer();
            }       

            //
            // CTRL + SHIFT + J
            // SHOWS FIRST PHONE DEVICE
            //
            if (document.activeElement == document.body && evt.keyCode == 74) {
                $("select#mobile-extension-device").val("Phone").change();
            }
            
            //
            // CTRL + SHIFT + K
            // SHOWS FIRST TABLET DEVICE
            //
            if (document.activeElement == document.body && evt.keyCode == 75) {
                $("select#mobile-extension-device").val("Tablet").change();
            }

            //
            // CTRL + SHIFT + L
            // TOGGLES LANDSCAPE VIEW
            //
            if (document.activeElement == document.body && evt.keyCode == 76) { 
                $('#mobile-extension-viewer-device').toggleClass('landscape');
            }
            
            return true;
        }
        document.onkeydown = handleKeyDown;



        
        //////////////////////
        // CLOSE MOBILE VIEWER
        //////////////////////
        function closeMobileViewer() {
            mobileViewer.removeClass('open');        
        }

        //
        // Close on close button click
        //
        $('body').on('click', 'h4#close-ext-mobile-viewer', function() {
            closeMobileViewer();
        });

        
        //
        // Change models if
        // device type changes
        //
        $('body').on('change', '#chrome-extension-mobile-viewer select#mobile-extension-device', function() {
            typeChange();
            deviceChange();
        });

        function typeChange() {
            var deviceType      = $('#chrome-extension-mobile-viewer select#mobile-extension-device').find(':selected').data('type');
            var deviceTypeMatch = $('select#mobile-extension-device-model option[data-device='+deviceType+']');
            
            $('select#mobile-extension-device-model option').not(deviceTypeMatch).hide().attr('selected', false);
            deviceTypeMatch.show().first().attr('selected', true);
        }

        
        //
        // Change the iframe size
        // based on the selected model
        //
        $('body').on('change', '#chrome-extension-mobile-viewer select#mobile-extension-device-model', function() {
            deviceChange();
        });
        function deviceChange() {
            var deviceModel = $('#chrome-extension-mobile-viewer select#mobile-extension-device-model').find(':selected').data('model');
            $('#mobile-extension-viewer-device').attr('data-model', deviceModel);
        }


    }
});

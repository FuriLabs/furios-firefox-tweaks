{
    // We can't load file:// URIs from this context, but we can preload modules and patch them before they're used
    var HOOKS = {};
    HOOKS["resource:///modules/PanelMultiView.sys.mjs"] = function(module) {
        const PanelMultiView = module.PanelMultiView;
        PanelMultiView.prototype._calculateMaxHeight = function(event) {
            return document.documentElement.clientHeight - 100;
        }
    };

    if (window && window.ChromeUtils && !ChromeUtils.defineESModuleGetters_orig)
    {
        ChromeUtils.defineESModuleGetters_orig = ChromeUtils.defineESModuleGetters;
        ChromeUtils.defineESModuleGetters = function(target, properties) {
            for (var prop in properties) {
                if (HOOKS[properties[prop]]) {
                    HOOKS[properties[prop]](ChromeUtils.importESModule(properties[prop]));
                }
            }
            return ChromeUtils.defineESModuleGetters_orig(target, properties);
        }
    }
}

if (document)
{
    document.addEventListener('DOMContentLoaded', () => {
        const browser = document.getElementById('browser');
        if (!browser) {
            return;
        }
        
        // When the user touches the browser, get stuff out of the way
        browser.addEventListener('touchstart', () => {
            gURLBar.blur();
        }, { passive: true });

        const titleBar = document.getElementById('titlebar');
        if (titleBar) {
            titleBar.addEventListener('touchstart', () => {
                gURLBar.blur();
            }, { passive: true });
        }

        // Disable the popover attribute on the URL bar and ensure it's
        // position: relative so it doesn't freak out
        const urlbar = document.getElementById('urlbar');
        if (urlbar) {
            urlbar.removeAttribute('popover');
            urlbar.style.position = 'relative';
        }
    });
}

// Load JS into tabs. Used to deeply customize about: pages etc
{
   var INJECT_JS = {};
   INJECT_JS["about:preferences"] = "file:///usr/share/furios-firefox-tweaks/overrides/pages/preferences.js";

   const tryInject = function(target) {
       const baseUri = target.baseURI;
       if (baseUri !== target.location.href) return;

       const uri = new URL(baseUri);
       const cleanString = uri.protocol + uri.hostname + uri.pathname;

       if (INJECT_JS[cleanString]) {
           const innerDoc = target.documentElement.parentNode;   // ??? documentElement should be the root node
                                                                 // so wtf is parentNode in this case?
           const script = innerDoc.createElement('script');
           script.src = INJECT_JS[cleanString];
           innerDoc.head.appendChild(script);
       }
   }

   document.addEventListener('DOMWindowCreated', function(event) {
       const target = event.target;

       if (target instanceof HTMLDocument) {
           tryInject(target);
       }

       // Also watch for navigation events
       const window = event.target.defaultView;
       if (window) {
           window.addEventListener('DOMContentLoaded', function(e) {
               tryInject(window.document);
           });
       }
   });
}

// Hook HTTP requests and spoof user-agents
// Kind of like the webcompat stuff, but works on privileged pages
// Used to fix things like Sync login, extension store, YouTube fullscreen, Google login, etc
{
    const FIREFOX_DESKTOP_UA = "Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0";
    const CHROME_ANDROID_UA = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.6834.79 Mobile Safari/537.36";
    const UA_SPOOF = {
        // Fix Google login not trusting the browser
        "https?://accounts.google.com": FIREFOX_DESKTOP_UA,
        // Fix Google Search showing up as the old layout
        "https?://(www.)?google.*/": CHROME_ANDROID_UA,
        // Fix Sync login not completing
        "https?://accounts.firefox.com": FIREFOX_DESKTOP_UA,
        // Fix YouTube fullscreen acting weird
        "https?://youtube.com": CHROME_ANDROID_UA,
        "https?://m.youtube.com": CHROME_ANDROID_UA,
        // Fix Firefox extension store thinking we're on Android
        "https?://addons.mozilla.org": FIREFOX_DESKTOP_UA,
        "https?://drive.google.com": CHROME_ANDROID_UA,
        // Fix Google Maps search bar not being interactive
        "https?://(www.)?google.com/maps": FIREFOX_DESKTOP_UA,
        "https?://maps.google.com": FIREFOX_DESKTOP_UA,
    };

    const requestObserver = {
        observe: function(subject, topic, data) {
            if (topic == "http-on-modify-request") {
                const httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
                const uri = httpChannel.URI.spec;

                for (const [pattern, ua] of Object.entries(UA_SPOOF)) {
                    if (new RegExp(pattern).test(uri)) {
                        httpChannel.setRequestHeader("User-Agent", ua, false);
                        break;
                    }
                }
            }
        }
    };

    const observerService = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
    observerService.addObserver(requestObserver, "http-on-modify-request", false);
}

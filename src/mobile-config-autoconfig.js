// Copyright 2022 Arnaud Ferraris, Oliver Smith
// SPDX-License-Identifier: MPL-2.0

// This is a Firefox autoconfig file:
// https://support.mozilla.org/en-US/kb/customizing-firefox-using-autoconfig

// Import custom userChrome.css on startup or new profile creation
const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/FileUtils.jsm");

// Create <profile>/chrome/ directory if not already present
var chromeDir = Services.dirsvc.get("ProfD", Ci.nsIFile);
chromeDir.append("chrome");
if (!chromeDir.exists()) {
    chromeDir.create(Ci.nsIFile.DIRECTORY_TYPE, FileUtils.PERMS_DIRECTORY);
}

// Create nsIFile objects for userChrome.css in <profile>/chrome/ and in /etc/
var chromeFile = chromeDir.clone();
chromeFile.append("userChrome.css");
var defaultChrome = new FileUtils.File("/etc/mobile-config-firefox/userChrome.css");

// Remove the existing userChrome.css if older than the installed one
if (chromeFile.exists() && defaultChrome.exists() &&
    chromeFile.lastModifiedTime < defaultChrome.lastModifiedTime) {
    chromeFile.remove(false);
}

// Copy userChrome.css to <profile>/chrome/
if (!chromeFile.exists()) {
    defaultChrome.copyTo(chromeDir, "userChrome.css");
}

// Create nsIFile objects for userContent.css in <profile>/chrome/ and in /etc/
var contentFile = chromeDir.clone();
contentFile.append("userContent.css");
var defaultContent = new FileUtils.File("/etc/mobile-config-firefox/userContent.css");

// Remove the existing userContent.css if older than the installed one
if (contentFile.exists() && defaultContent.exists() &&
    contentFile.lastModifiedTime < defaultContent.lastModifiedTime) {
    contentFile.remove(false);
}

// Copy userContent.css to <profile>/chrome/
if (!contentFile.exists()) {
    defaultContent.copyTo(chromeDir, "userContent.css");
}

// Select a mobile user agent for firefox (same as tor browser on android)
defaultPref('general.useragent.override', 'Mozilla/5.0 (Android 10; Mobile; rv:91.0) Gecko/91.0 Firefox/91.0');

// Do not suggest facebook, ebay, reddit etc. in the urlbar. Same as
// Settings -> Privacy & Security -> Address Bar -> Shortcuts. As side-effect,
// the urlbar results are not immediatelly opened once clicking the urlbar.
defaultPref('browser.urlbar.suggest.topsites', false);

// Do not suggest search engines. Even though amazon is removed via
// policies.json, it gets installed shortly after the browser is opened. With
// this option, at least there is no big "Search with Amazon" message in the
// urlbar results as soon as typing the letter "a".
defaultPref('browser.urlbar.suggest.engines', false);

// Show about:home in new tabs, so it's not just a weird looking completely
// empty page.
defaultPref('browser.newtabpage.enabled', true);

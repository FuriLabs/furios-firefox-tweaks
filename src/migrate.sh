#!/bin/bash

if [ -d "$HOME/.mozilla/firefox" ] && ls "$HOME/.mozilla/firefox/"*.default-release >/dev/null 2>&1; then
    echo "Firefox (non-ESR) already used. No changes needed."
    exit 0
fi

# Check if Firefox ESR has been used
if [ -d "$HOME/.mozilla/firefox" ] && ls "$HOME/.mozilla/firefox/"*.default-esr >/dev/null 2>&1; then
    echo "User has opened Firefox ESR before. Migrating to Firefox (non-ESR)."

    # Kill running Firefox ESR instances
    killall firefox-esr

    # Create a new default-release profile
    firefox --headless --createprofile default-release

    # Copy ESR profile data to the new release profile
    DEFAULT_ESR_PROFILE=$(ls -d "$HOME/.mozilla/firefox/"*.default-esr)
    DEFAULT_RELEASE_PROFILE=$(ls -d "$HOME/.mozilla/firefox/"*.default-release)

    # Bail if we can't find the profiles
    if [ -z "$DEFAULT_ESR_PROFILE" ] || [ -z "$DEFAULT_RELEASE_PROFILE" ]; then
        echo "Could not find ESR or release profile. Exiting."
        exit 1
    fi

    cp -va "$DEFAULT_ESR_PROFILE"/* "$DEFAULT_RELEASE_PROFILE"/

    # Hardcoding this isn't ideal, but can't be arsed figuring out how to calculate cityhash
    CITYHASH=4F96D1932A9F858E
    NEW_PROFILE_BASENAME=$(basename "$DEFAULT_RELEASE_PROFILE")

    echo "[${CITYHASH}]" >> "$HOME/.mozilla/firefox/installs.ini"
    echo "Default=$NEW_PROFILE_BASENAME" >> "$HOME/.mozilla/firefox/installs.ini"
    echo "Locked=1" >> "$HOME/.mozilla/firefox/installs.ini"
    echo "[Install${CITYHASH}]" >> "$HOME/.mozilla/firefox/profiles.ini"
    echo "Default=$NEW_PROFILE_BASENAME" >> "$HOME/.mozilla/firefox/profiles.ini"
    echo "Locked=1" >> "$HOME/.mozilla/firefox/profiles.ini"

    echo "Migration complete. Profile path: $DEFAULT_RELEASE_PROFILE"
fi

# Hide ESR from app drawer
mkdir -p "$HOME/.local/share/applications"
cp -v /usr/share/applications/firefox-esr.desktop "$HOME/.local/share/applications/"
echo "Hidden=true" >> "$HOME/.local/share/applications/firefox-esr.desktop"

# Replace firefox-esr.desktop with firefox.desktop in docked apps
DEFAULT_DOCKED_APPS="['org.gnome.Calls.desktop', 'sm.puri.Chatty.desktop', 'firefox-esr.desktop', 'org.gnome.Settings.desktop']"
CURRENT_DOCKED_APPS=$(dconf read /sm/puri/phosh/favorites)
if [ -z "$CURRENT_DOCKED_APPS" ]; then
    CURRENT_DOCKED_APPS=$DEFAULT_DOCKED_APPS
fi

NEW_DOCKED_APPS=$(echo "$CURRENT_DOCKED_APPS" | sed "s/firefox-esr.desktop/firefox.desktop/g")
XDG_RUNTIME_DIR=/run/user/32011 dconf write /sm/puri/phosh/favorites "$NEW_DOCKED_APPS"

# Update default web browser if necessary
DEFAULT_BROWSER=$(xdg-settings get default-web-browser)
if [ "$DEFAULT_BROWSER" = "firefox-esr.desktop" ]; then
    echo "User's default browser was Firefox ESR. Updating to Firefox (non-ESR)."
    xdg-settings set default-web-browser firefox.desktop
fi

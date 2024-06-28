/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{
  const areTopTabsEnabled = function() {
    return Services.prefs.getBoolPref("furi.topTabs", false);
  };

  class MozPanel extends MozElements.MozElementMixin(XULPopupElement) {
    static get markup() {
      return `<html:slot part="content" style="display: none !important"/>`;
    }
    constructor() {
      super();

      this._prevFocus = 0;
      this._fadeTimer = null;

      this.attachShadow({ mode: "open" });

      this.addEventListener("popupshowing", this);
      this.addEventListener("popupshown", this);
      this.addEventListener("popuphiding", this);
      this.addEventListener("popuphidden", this);
      this.addEventListener("popuppositioned", this);
    }

    connectedCallback() {
      // Create shadow DOM lazily if a panel is hidden. It helps to reduce
      // cycles on startup.
      if (!this.hidden) {
        this.ensureInitialized();
      }

      this.setAttribute("flip", "none");
      if (!this.hasAttribute("side")) {
        this.setAttribute("side", areTopTabsEnabled() ? "top" : "bottom");
      }
      if (!this.hasAttribute("position")) {
        this.setAttribute("position", areTopTabsEnabled() ? "bottomleft topleft" : "bottomleft bottomleft");
      }
      this.setAttribute("consumeoutsideclicks", "true");

      // Whenever the window is resized, ensure we reposition ourselves relative to the new size
      let previousHeight = window.innerHeight;
      const resizeObserver = new ResizeObserver(() => {
        if (window.innerHeight !== previousHeight) {
          if (this.getAttribute("panelopen") && !areTopTabsEnabled()) {
            const newY = this.screenY - (previousHeight - window.innerHeight);
            this.moveToAnchor(null, "before_start", 0, newY, true);
            this.moveTo(0, newY);
          }
          previousHeight = window.innerHeight;
        }
      });
      resizeObserver.observe(document.documentElement);
    }

    ensureInitialized() {
      // As an optimization, we don't slot contents if the panel is [hidden] in
      // connectedCallback this means we can avoid running this code at startup
      // and only need to do it when a panel is about to be shown.  We then
      // override the `hidden` setter and `removeAttribute` and call this
      // function if the node is about to be shown.
      if (this.shadowRoot.firstChild) {
        return;
      }

      this.shadowRoot.appendChild(this.constructor.fragment);
      if (this.hasAttribute("neverhidden")) {
        this.panelContent.style.display = "";
      }
    }

    get panelContent() {
      return this.shadowRoot.querySelector("[part=content]");
    }

    get hidden() {
      return super.hidden;
    }

    set hidden(v) {
      if (!v) {
        this.ensureInitialized();
      }
      super.hidden = v;
    }

    removeAttribute(name) {
      if (name == "hidden") {
        this.ensureInitialized();
      }
      super.removeAttribute(name);
    }

    get isArrowPanel() {
      return this.getAttribute("type") == "arrow";
    }

    get noOpenOnAnchor() {
      return this.hasAttribute("no-open-on-anchor");
    }

    _setSideAttribute(event) {
      if (!this.isArrowPanel || !event.isAnchored) {
        return;
      }

      let position = event.alignmentPosition;
      if (position.indexOf("start_") == 0 || position.indexOf("end_") == 0) {
        // The assigned side stays the same regardless of direction.
        let isRTL = window.getComputedStyle(this).direction == "rtl";

        if (position.indexOf("start_") == 0) {
          this.setAttribute("side", isRTL ? "left" : "right");
        } else {
          this.setAttribute("side", isRTL ? "right" : "left");
        }
      } else if (
        position.indexOf("before_") == 0 ||
        position.indexOf("after_") == 0
      ) {
        if (position.indexOf("before_") == 0) {
          this.setAttribute("side", "bottom");
        } else {
          this.setAttribute("side", "top");
        }
      }

      // This method isn't implemented by panel.js, but it can be added to
      // individual instances that need to show an arrow.
      this.setArrowPosition?.(event);
    }

    on_popupshowing(event) {
      this.setAttribute("remote", "true");
      if (event.target == this) {
        this.panelContent.style.display = "";
      }
      if (this.isArrowPanel && event.target == this) {
        if (this.anchorNode && !this.noOpenOnAnchor) {
          let anchorRoot =
            this.anchorNode.closest("toolbarbutton, .anchor-root") ||
            this.anchorNode;
          anchorRoot.setAttribute("open", "true");
        }

        if (this.getAttribute("animate") != "false") {
          this.setAttribute("animate", "open");
          // the animating attribute prevents user interaction during transition
          // it is removed when popupshown fires
          this.setAttribute("animating", "true");
        }

        // set fading
        var fade = this.getAttribute("fade");
        var fadeDelay = 0;
        if (fade == "fast") {
          fadeDelay = 1;
        } else if (fade == "slow") {
          fadeDelay = 4000;
        }

        if (fadeDelay != 0) {
          this._fadeTimer = setTimeout(
            () => this.hidePopup(true),
            fadeDelay,
            this
          );
        }
      }

      // Capture the previous focus before has a chance to get set inside the panel
      try {
        this._prevFocus = Cu.getWeakReference(
          document.commandDispatcher.focusedElement
        );
        if (!this._prevFocus.get()) {
          this._prevFocus = Cu.getWeakReference(document.activeElement);
        }
      } catch (ex) {
        this._prevFocus = Cu.getWeakReference(document.activeElement);
      }
    }

    on_popupshown(event) {
      if (this.isArrowPanel && event.target == this) {
        this.removeAttribute("animating");
        this.setAttribute("panelopen", "true");
      }

      // Fire event for accessibility APIs
      let alertEvent = document.createEvent("Events");
      alertEvent.initEvent("AlertActive", true, true);
      this.dispatchEvent(alertEvent);
    }

    on_popuphiding(event) {
      if (this.isArrowPanel && event.target == this) {
        let animate = this.getAttribute("animate") != "false";

        if (this._fadeTimer) {
          clearTimeout(this._fadeTimer);
          if (animate) {
            this.setAttribute("animate", "fade");
          }
        } else if (animate) {
          this.setAttribute("animate", "cancel");
        }

        if (this.anchorNode && !this.noOpenOnAnchor) {
          let anchorRoot =
            this.anchorNode.closest("toolbarbutton, .anchor-root") ||
            this.anchorNode;
          anchorRoot.removeAttribute("open");
        }
      }

      try {
        this._currentFocus = document.commandDispatcher.focusedElement;
      } catch (e) {
        this._currentFocus = document.activeElement;
      }
    }

    on_popuphidden(event) {
      if (event.target == this && !this.hasAttribute("neverhidden")) {
        this.panelContent.style.setProperty("display", "none", "important");
      }
      if (this.isArrowPanel && event.target == this) {
        this.removeAttribute("panelopen");
        if (this.getAttribute("animate") != "false") {
          this.removeAttribute("animate");
        }
      }

      function doFocus() {
        // Focus was set on an element inside this panel,
        // so we need to move it back to where it was previously.
        // Elements can use refocused-by-panel to change their focus behaviour
        // when re-focused by a panel hiding.
        prevFocus.setAttribute("refocused-by-panel", true);
        try {
          let fm = Services.focus;
          fm.setFocus(prevFocus, fm.FLAG_NOSCROLL);
        } catch (e) {
          prevFocus.focus();
        }
        prevFocus.removeAttribute("refocused-by-panel");
      }
      var currentFocus = this._currentFocus;
      var prevFocus = this._prevFocus ? this._prevFocus.get() : null;
      this._currentFocus = null;
      this._prevFocus = null;

      // Avoid changing focus if focus changed while we hide the popup
      // (This can happen e.g. if the popup is hiding as a result of a
      // click/keypress that focused something)
      let nowFocus;
      try {
        nowFocus = document.commandDispatcher.focusedElement;
      } catch (e) {
        nowFocus = document.activeElement;
      }
      if (nowFocus && nowFocus != currentFocus) {
        return;
      }

      if (prevFocus && this.getAttribute("norestorefocus") != "true") {
        // Try to restore focus
        try {
          if (document.commandDispatcher.focusedWindow != window) {
            // Focus has already been set to a window outside of this panel
            return;
          }
        } catch (ex) {}

        if (!currentFocus) {
          doFocus();
          return;
        }
        while (currentFocus) {
          if (currentFocus == this) {
            doFocus();
            return;
          }
          currentFocus = currentFocus.parentNode;
        }
      }
    }

    on_popuppositioned(event) {
      if (event.target == this) {
        this._setSideAttribute(event);
      }
    }

    // We don't want to fully rely on anchors because they don't correctly position or size the panel
    // when it's bottom aligned. So we implement our own anchor logic here, which will be called from
    // a global observer. We also don't really care about the anchor itself, so we use absolute positioning.

    getPanelY() {
      if (!this.children.length) return 0;
      const contentHeight = Array.from(this.children).reduce(function(acc, el) { return acc + el.scrollHeight }, 0);
      return areTopTabsEnabled() ? 88 : document.documentElement.clientHeight - contentHeight - 104;
    }

    fixPanelPosition() {
      // if (areTopTabsEnabled()) return 0;
      if (!this.children.length) return 0;
      // ??? We need to call moveToAnchor, even if element is null, for moveTo to work
      // Why?!
      const y = this.getPanelY()
      this.moveToAnchor(null, "before_start", 0, y, true);
      this.moveTo(
        0,
        y
      );
    }

    openPopup(anchor, position, x, y, isContextMenu, attributesOverride) {
      // if (areTopTabsEnabled()) return super.openPopup(anchor, position, x, y, isContextMenu, attributesOverride);
      super.openPopupAtScreen(0, this.getPanelY(), isContextMenu, attributesOverride);
      this.fixPanelPosition();
    }
  }

  customElements.define("panel", MozPanel);
}

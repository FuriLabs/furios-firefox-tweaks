// Copyright 2022 Oliver Smith, Martijn Braam
// SPDX-License-Identifier: MPL-2.0

// Set up autoconfig (we use it to copy/update userChrome.css into profile dir)
pref('general.config.filename', 'mobile-config-autoconfig.js');
pref('general.config.obscure_value', 0);
pref('general.config.sandbox_enabled', false);

// Enable android-style pinch-to-zoom
pref('dom.w3c.touch_events.enabled', true);
pref('apz.allow_zooming', true);
pref('apz.allow_double_tap_zooming', true);

// Enable legacy touch event APIs, as some websites use this to check for mobile compatibility
// and Firefox on Android behaves the same way
pref('dom.w3c_touch_events.legacy_apis.enabled', true);

// Save vertical space by hiding the titlebar
pref('browser.tabs.inTitlebar', 1);

// Allow UI customizations with userChrome.css and userContent.css
pref('toolkit.legacyUserProfileCustomizations.stylesheets', true);

// Select the entire URL with one click
pref('browser.urlbar.clickSelectsAll', true);

// Snap touches to nearest interactive elemetn
pref('ui.mouse.radius.bottommm', 2);
pref('ui.mouse.radius.enabled', true);
pref('ui.mouse.radius.leftmm', 4);
pref('ui.mouse.radius.rightmm', 4);
pref('ui.mouse.radius.topmm', 2);
pref('ui.touch.radius.bottommm', 2);
pref('ui.touch.radius.enabled', true);
pref('ui.touch.radius.leftmm', 4);
pref('ui.touch.radius.rightmm', 4);
pref('ui.touch.radius.topmm', 2);

// WebGL tweaks
pref('webgl.default-antialias', false);
pref('webgl.enable-debug-renderer-info', false);
pref('webgl.force-enabled', true);
pref('webgl.msaa-samples', 1);
pref('widget.dmabuf-webgl.enabled', false);

// Improvements for touch gestures (zoom, etc)
pref('apz.allow_double_tap_zooming', false);
pref('apz.drag.enabled', false);
pref('apz.drag.initial.enabled', false);
pref('apz.drag.touch.enabled', false);
pref('apz.gtk.pangesture.enabled', false);
pref('apz.one_touch_pinch.enabled', true);
pref('apz.windows.check_for_pan_gesture_conversion', false);
pref('apz.zoom-to-focused-input.enabled', false);

// Responsiveness tweaks; prioritize user interaction
pref('content.sink.interactive_parse_time', 500);
pref('content.sink.perf_parse_time', 2000);
pref('content.sink.interactive_time', 7500000);
pref('content.sink.initial_perf_time', 500);


// Temporary workaround: don't throttle offscreen animations. This fixes the
// animations in the app menu being slow. Should be fixed properly in the future.
pref('dom.animations.offscreen-throttling', false);

// Use lowp precision for blitting
pref('gfx.blithelper.precision', 0);

// More misc rendering performance tweaks
pref('gfx.canvas.accelerated.aa-stroke.enabled', true);
pref('gfx.canvas.accelerated.force-enabled', true);
pref('gfx.canvas.accelerated.max-surface-size', 2048);
pref('gfx.canvas.accelerated.stroke-to-fill-path', true);
pref('gfx.content.skia-font-cache-size', 16);

// WebRender tweaks
pref('gfx.webrender.all', true);
pref('gfx.webrender.blob-tile-size', 128);
pref('gfx.webrender.compositor', true);
pref('gfx.webrender.compositor.force-enabled', true);
pref('gfx.webrender.fallback.software', false);
pref('gfx.webrender.force-disabled', false);
pref("gfx.webrender.enabled", true);
pref("gfx.webrender.force-partial-present", true);
pref("gfx.webrender.multithreading", true);
pref("gfx.webrender.prefer-robustness", false);
pref('gfx.webrender.low-quality-pinch-zoom', true);
pref('gfx.webrender.max-shared-surface-size', 2048);
pref('gfx.webrender.precache-shaders', true);
pref('gfx.webrender.allow-partial-present-buffer-age', false);
pref("gfx.webrender.program-binary-disk", true);
pref("gfx.webrender.scissored-cache-clears.enabled", true);
pref("gfx.webrender.scissored-cache-clears.force-enabled", true);
pref('gfx.will-change.ignore-opacity', false);

pref('layers.acceleration.disabled', false);
pref('layers.acceleration.force-enabled', true);
pref('gfx.webrender.multithreading', true);
pref('dom.animations.mainthread-synchronization-with-geometric-animations', true);
pref('webgl.cgl.multithreaded', true);
pref("webgl.out-of-process.async-present", true);
pref("webgl.out-of-process.async-present.force-sync", true);
pref("layers.gpu-process.enabled", true);
pref("layers.offmainthreadcomposition.force-disabled", false);
pref("layout.framevisibility.numscrollportheights", 2);
pref("layout.scrollbars.always-layerize-track", true);

pref("gfx.canvas.accelerated.async-present", false);
pref("gfx.content.always-paint", true);
pref("gfx.display.max-frame-rate", 120);



// JS performance finetuning. TODO: are these really improving performance?
// Some of these are kinda security related, so might be good to reduce.

// Prerender up to 2x our viewport size while transforming. Improves appmenu further.
pref('layout.animation.prerender.partial', true);
pref('layout.animation.prerender.viewport-ratio-limit', '2');

// Reuse stacking contexts
pref('layout.display-list.retain.sc', false);

pref('layout.lower_priority_refresh_driver_during_load', false);

// Don't throttle iframe layout calculations.
pref('layout.throttle_in_process_iframes', false);

// Disable backdrop-filter - it's usually used for blurs and is very slow right now.
pref('layout.css.backdrop-filter.enabled', false);

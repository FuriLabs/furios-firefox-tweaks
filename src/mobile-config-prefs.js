// Copyright 2022 Oliver Smith, Martijn Braam
// SPDX-License-Identifier: MPL-2.0

// Set up autoconfig (we use it to copy/update userChrome.css into profile dir)
pref('general.config.filename', 'mobile-config-autoconfig.js');
pref('general.config.obscure_value', 0);
pref('general.config.sandbox_enabled', false);

// Enable android-style pinch-to-zoom
pref('dom.w3c.touch_events.enabled', true);
pref('apz.allow_zooming', true);
pref('apz.allow_double_tap_zooming', false);

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

pref('webgl.cgl.multithreaded', true);
pref('webgl.out-of-process.async-present', true);

pref('webgl.msaa-samples', 0);
pref('webgl.out-of-process.shmem-size', 1000000);
pref('webgl.power-preference-override', 2);

pref('gl.use-tls-is-current', 1);


// Improvements for touch gestures (zoom, etc)
pref('apz.gtk.pangesture.enabled', false);
pref('apz.one_touch_pinch.enabled', true);
pref('apz.content_response_timeout', 1000);
pref('apz.drag.enabled', false);
pref('apz.drag.touch.enabled', false);
pref('apz.enlarge_displayport_when_clipped', true);

// Responsiveness tweaks; prioritize user interaction
pref('content.max.deflected.tokens', 64);
pref('content.max.tokenizing.time', 10000);

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
pref('gfx.webrender.enabled', true);
pref('gfx.webrender.force-enabled', true);
pref('gfx.webrender.multithreading', true);
pref('gfx.webrender.prefer-robustness', false);
pref('gfx.webrender.low-quality-pinch-zoom', true);
pref('gfx.webrender.max-shared-surface-size', 2048);
pref('gfx.webrender.precache-shaders', true);
pref('gfx.webrender.allow-partial-present-buffer-age', false);
pref('gfx.webrender.program-binary-disk', true);
pref('gfx.webrender.scissored-cache-clears.enabled', true);
pref('gfx.webrender.scissored-cache-clears.force-enabled', true);
pref('gfx.will-change.ignore-opacity', true);
pref('gfx.webrender.batched-texture-uploads', true);
pref('gfx.webrender.enable-subpixel-aa', false);
pref('gfx.webrender.late-scenebuild-threshold', 2);
pref('gfx.webrender.svg-filter-effects.also-convert-css-filters', false);
pref('gfx.webrender.wait-gpu-finished.disabled', true);
pref('dom.animations.mainthread-synchronization-with-geometric-animations', false);
pref('layers.gpu-process.enabled', true);
pref('layers.offmainthreadcomposition.force-disabled', false);
pref('layers.force-shmem-tiles', true);
pref('layers.offmainthreadcomposition.frame-rate', 120);
pref('layout.scrollbars.always-layerize-track', false);

pref('gfx.display.max-frame-rate', 120);

pref('gfx.canvas.remote.max-spin-count', 30);
pref('gfx.device-reset.limit', 1000);
pref('gfx.font_rendering.ahem_antialias_none', true);
pref('gfx.text.subpixel-position.force-disabled', true);
pref('gfx.work-around-driver-bugs', false);


// Reuse stacking contexts
pref('layout.display-list.retain.sc', true);

pref('layout.lower_priority_refresh_driver_during_load', false);

// Don't throttle iframe layout calculations.
pref('layout.throttle_in_process_iframes', false);

// Disable backdrop-filter - it's usually used for blurs and is very slow right now.
pref('layout.css.backdrop-filter.enabled', false);

// CSS performance tweaks
pref('layout.css.report_errors', false);
pref('layout.css.stylo-local-work-queue.in-main-thread', 8);
pref('layout.css.stylo-local-work-queue.in-worker', 32);
pref('layout.css.stylo-threads', 4);
pref('layout.css.zoom.enabled', false);

// Framerate tweaks - these are very aggressive, but we want to prioritize responsiveness
pref('layout.extra-tick.minimum-ms', 1);
pref('layout.frame_rate', 0);
pref('layout.framevisibility.amountscrollbeforeupdatehorizontal', 0);
pref('layout.framevisibility.amountscrollbeforeupdatevertical', 0);
pref('layout.idle_period.required_quiescent_frames', 2);
pref('layout.idle_period.time_limit', 0);
pref('layout.keep_ticking_after_load_ms', 5000);
pref('idle_period.during_page_load.min', 2);
pref('idle_period.min', 1);
pref('nglayout.initialpaint.delay', 0);
pref('nglayout.initialpaint.delay_in_oopif', 0);
pref('timer.minimum_firing_delay_tolerance_ms', '1');
pref('timer.maximum_firing_delay_tolerance_ms', '2');

// Don't snap to pixels while scrolling, can feel jerky especially at >1x scale
pref('layout.scroll.disable-pixel-alignment', true);

// Fix icon coloring
pref('svg.context-properties.content.enabled', true);

// Disable caret browsing, can be confusing on mobile
pref('accessibility.browsewithcaret_shortcut.enabled', false);
pref('accessibility.typeaheadfind', false);
pref('accessibility.accesskeycausesactivation', false);
pref('accessibility.tabfocus', 0);
pref('accessibility.tabfocus_applies_to_xul', true);
pref('accessibility.typeaheadfind.flashBar', 0);

// Improve text editing experience
pref('editor.password.mask_delay', 1200);
pref('editor.word_select.delete_space_after_doubleclick_selection', true);

// Download without asking
pref('browser.download.folderList', 1);
pref('browser.download.useDownloadDir', true);

// Directly open PDFs
pref('browser.download.open_pdf_attachments_inline', true);
pref('pdfjs.handleOctetStream', true);

// Keep a couple processes alive to improve responsiveness
pref('dom.ipc.keepProcessesAlive.extension', 1);
pref('dom.ipc.keepProcessesAlive.web', 1);

// Allow webpush notifications to open stuff even if they take a bit to start up
pref('dom.serviceWorkers.disable_open_click_delay', 100000);

// Improve caret usability
pref('layout.accessiblecaret.caret_shown_when_long_tapping_on_empty_content', false);
pref('layout.accessiblecaret.extend_selection_for_phone_number', true);
pref('layout.accessiblecaret.script_change_update_mode', 1);

// Not super sure what these actually do; stole from Fennec
pref('image.cache.size', 1048576); // bytes
pref('media.video-queue.default-size', 3);
pref('media.video-queue.send-to-compositor-size', 1);
pref('network.http.http2.default-hpack-buffer', 4096);
pref('network.http.http2.push-allowance', 32768);
pref('network.http.keep-alive.timeout', 109);
pref('network.tickle-wifi.enabled', true);

// Restart the GPU process when it crashes instead of giving up the ghost
pref('layers.gpu-process.max_restarts', 64);
pref('layers.gpu-process.stable.frame-threshold', 1);
pref('layers.gpu-process.stable.min-uptime-ms', 1);

// Correctly calculate vsync rate even if idle -- fixes hitch when interacting after a few seconds
pref('widget.wayland.vsync.keep-firing-at-idle', true);

// Disable pointer lock API, causes crash if no mouse is connected
pref('full-screen-api.pointer-lock.enabled', false);
pref('dom.pointer-lock.enabled', false);
pref('widget.gtk.grab-pointer', 0);
pref('widget.disable-swipe-tracker', true);

// Self explanatory
pref('browser.tabs.unloadOnLowMemory', true);
pref('dom.maxHardwareConcurrency', 16);
pref('dom.min_timeout_value', 2);
pref('dom.ipc.processPrelaunch.lowmem_mb', 1024);
pref('nglayout.enable_drag_images', false);

// Privacy: disable captive portal detection
pref('captivedetect.canonicalContent', '');
pref('captivedetect.canonicalURL', '');
pref('captivedetect.maxRetryCount', 0);
pref('captivedetect.pollingTime', 30000000);

// Don't put things in the selection clipboard - can end up making the clipboard unusable
pref('clipboard.autocopy', false);

// Disable spectre mitigrations. (TODO: is this making a performance difference?)
pref('javascript.options.spectre.index_masking', false);
pref('javascript.options.spectre.jit_to_cxx_calls', true);
pref('javascript.options.spectre.object_mitigations', false);
pref('javascript.options.spectre.string_mitigations', false);
pref('javascript.options.spectre.value_masking', false);

// Disable screen sharing, not supported yet
pref('media.getusermedia.screensharing.enabled', false);

// Stop complaining about speech-dispatcher
pref('media.webspeech.synth.dont_notify_on_error', true);
pref('narrate.enabled', false);
pref('messaging-system.askForFeedback', false);

// Disable middle mouse button in case it gets accidentally triggered
pref('middlemouse.paste', false);
pref('middlemouse.scrollbarPosition', false);
pref('network.captive-portal-service.enabled', false);
pref('network.connectivity-service.enabled', false);

// Prioritize things we need to render the page
pref('network.fetchpriority.enabled', true);
pref('network.http.speculative-parallel-limit', 0);
pref('page_load.deprioritization_period', 1);

// Use new bounding box calculation. Need to benchmark this.
pref('svg.new-getBBox.enabled', true);

// If the user puts a finger down on an element and we think the user
// might be executing a pan gesture, how long do we wait before
// tentatively deciding the gesture is actually a tap and activating
// the target element?
pref('ui.touch_activation.delay_ms', 15);

// If the user has clicked an element, how long do we keep the
// :active state before it is cleared by the mouse sequences
// fired after a touchstart/touchend.
pref('ui.touch_activation.duration_ms', 1);

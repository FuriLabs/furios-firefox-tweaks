# Copyright 2023 Oliver Smith
# Copyright 2024 Bardia Moshiri
# SPDX-License-Identifier: MPL-2.0

HEADER_FILE := src/common/header.css
USERCHROME_FILES := $(HEADER_FILE) $(sort $(wildcard src/userChrome/*.css))
USERCONTENT_FILES := $(HEADER_FILE) $(sort $(wildcard src/userContent/*.css))

USERCHROME_FILES += src/firefox-gnome-theme/userChrome.css
USERCONTENT_FILES += src/firefox-gnome-theme/userContent.css

PREFIX ?= /usr
DESTDIR :=
FIREFOX_DIR := $(PREFIX)/lib/firefox
FIREFOX_CONFIG_DIR := /etc/firefox
FIREFOX_MOBILE_CONFIG_DIR := $(PREFIX)/share/furios-firefox-tweaks

all: out/userChrome.files out/userContent.files

clean:
	rm -rf out
out:
	mkdir out

out/userChrome.files: $(USERCHROME_FILES) out
	for i in $(USERCHROME_FILES); do \
        echo "$$i" | cut -d/ -f 2-; \
    done > $@

out/userContent.files: $(USERCONTENT_FILES) out
	for i in $(USERCONTENT_FILES); do \
        echo "$$i" | cut -d/ -f 2-; \
    done > $@

install: all
	src/prepare_install.sh "$(FIREFOX_DIR)" "$(DESTDIR)"
	install -Dm644 src/policies.json \
		"$(DESTDIR)/$(FIREFOX_CONFIG_DIR)/policies/policies.json"
	install -Dm644 src/mobile-config-prefs.js \
		"$(DESTDIR)/$(FIREFOX_DIR)/defaults/pref/mobile-config-prefs.js"
	install -Dm644 src/mobile-config-autoconfig.js \
		"$(DESTDIR)/$(FIREFOX_DIR)/mobile-config-autoconfig.js"
	install -Dm644 "out/userChrome.files" \
		-t "$(DESTDIR)/$(FIREFOX_MOBILE_CONFIG_DIR)"
	install -Dm644 "out/userContent.files" \
		-t "$(DESTDIR)/$(FIREFOX_MOBILE_CONFIG_DIR)"
	install -Dm644 "src/userChrome.js" \
		-t "$(DESTDIR)/$(FIREFOX_MOBILE_CONFIG_DIR)"

	# Disable crash reporter by writing src/99-firefox-crash-reporter.sh to /etc/profile.d
	install -Dm755 src/99-firefox-crash-reporter.sh \
		"$(DESTDIR)/etc/profile.d/99-firefox-crash-reporter.sh"

	# Install ESR -> release migration script
	install -Dm755 src/migrate.sh "$(DESTDIR)/$(FIREFOX_MOBILE_CONFIG_DIR)/migrate.sh"

	# Ensure DESTDIR is an absolute path \
	DESTDIR=$$(realpath "$(DESTDIR)"); \
	walk_dir() { \
		echo "1 = $$1" ; \
		for i in "$$1"/*; do \
			echo "i = $$i"; \
			if [ -d "$$i" ]; then \
				echo "Installing directory: $$i"; \
				walk_dir "$$i"; \
			else \
				install_path="furios-firefox-tweaks/$$(realpath --relative-to=src $$i)"; \
				echo "Installing file: $$i to $$DESTDIR/$(FIREFOX_MOBILE_CONFIG_DIR)/$$install_path"; \
				install -Dm644 "$$i" -t "$$DESTDIR/$(FIREFOX_MOBILE_CONFIG_DIR)/$$(dirname "$$install_path")"; \
			fi; \
		done; \
	}; \
	cd src; \
	for dir in common userChrome userContent firefox-gnome-theme overrides; do \
		walk_dir "$$dir"; \
	done; \
	cd ..
	install -Dm644 io.furios.furios_firefox_tweaks.metainfo.xml \
		"$(DESTDIR)/$(PREFIX)/share/metainfo/io.furios.furios_firefox_tweaks.metainfo.xml"

uninstall:
	src/prepare_uninstall.sh "$(FIREFOX_DIR)" "$(DESTDIR)"
	rm -fv "$(DESTDIR)/$(FIREFOX_CONFIG_DIR)/policies/policies.json"
	rm -fv "$(DESTDIR)/$(FIREFOX_DIR)/defaults/pref/mobile-config-prefs.js"
	rm -fv "$(DESTDIR)/$(FIREFOX_DIR)/mobile-config-autoconfig.js"
	rm -rfv "$(DESTDIR)/$(FIREFOX_MOBILE_CONFIG_DIR)"
	rm -fv "$(DESTDIR)/$(PREFIX)/share/metainfo/io.furios.furios_firefox_tweaks.metainfo.xml"

.PHONY: all clean install uninstall

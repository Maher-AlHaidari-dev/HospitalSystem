"use strict";

/* =========================================================
   MediCore HMS
   Mobile Navigation Menu
   ========================================================= */

(function () {

    function getMenu() {
        return document.getElementById("mobileMenu");
    }

    function getOverlay() {
        return document.getElementById("mobileMenuOverlay");
    }

    function getButton() {
        return document.getElementById("mobileMenuButton");
    }


    /* =====================================================
       OPEN MENU
       ===================================================== */

    window.openMobileMenu = function () {

        const menu = getMenu();
        const overlay = getOverlay();
        const button = getButton();

        if (!menu || !overlay) {
            return;
        }

        menu.classList.add("active");
        overlay.classList.add("active");

        menu.setAttribute("aria-hidden", "false");

        if (button) {
            button.setAttribute("aria-expanded", "true");
        }

        document.body.style.overflow = "hidden";
    };


    /* =====================================================
       CLOSE MENU
       ===================================================== */

    window.closeMobileMenu = function () {

        const menu = getMenu();
        const overlay = getOverlay();
        const button = getButton();

        if (!menu || !overlay) {
            return;
        }

        menu.classList.remove("active");
        overlay.classList.remove("active");

        menu.setAttribute("aria-hidden", "true");

        if (button) {
            button.setAttribute("aria-expanded", "false");
        }

        document.body.style.overflow = "";
    };


    /* =====================================================
       TOGGLE MENU
       ===================================================== */

    window.toggleMobileMenu = function () {

        const menu = getMenu();

        if (!menu) {
            return;
        }

        if (menu.classList.contains("active")) {

            closeMobileMenu();

        } else {

            openMobileMenu();

        }
    };


    /* =====================================================
       CLOSE WITH ESC
       ===================================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeMobileMenu();
        }

    });


    /* =====================================================
       CLOSE AFTER NAVIGATION
       ===================================================== */

    document.addEventListener("click", function (event) {

        const link = event.target.closest(
            ".mobile-menu nav a"
        );

        if (link) {
            closeMobileMenu();
        }

    });


    /* =====================================================
       RESET WHEN RETURNING TO DESKTOP
       ===================================================== */

    window.addEventListener("resize", function () {

        if (window.innerWidth > 767) {
            closeMobileMenu();
        }

    });

})();
"use strict";

/* =========================================================
   MediCore HMS
   SETTINGS PAGE
   Responsive + Translation Safe
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------------------------------------------
       1. تجهيز القائمة للجوال
       --------------------------------------------------------- */
    ensureSettingsMobileMenu();


    /* ---------------------------------------------------------
       2. تطبيق اللغة الحالية
       --------------------------------------------------------- */
    initializeSettingsLanguage();


    /* ---------------------------------------------------------
       3. عناصر الصفحة
       --------------------------------------------------------- */

    const profileForm =
        document.getElementById(
            "profileForm"
        );

    const inputFullName =
        document.getElementById(
            "adminName"
        );

    const inputEmail =
        document.getElementById(
            "adminEmail"
        );

    const inputRole =
        document.getElementById(
            "adminRoleInput"
        );

    const chkReminders =
        document.getElementById(
            "reminderToggle"
        );

    const btnSaveSettings =
        profileForm
            ? profileForm.querySelector(
                'button[type="submit"]'
            )
            : null;


    /* ---------------------------------------------------------
       4. تحميل بيانات المستخدم
       --------------------------------------------------------- */

    loadUserSettings(
        inputFullName,
        inputEmail,
        inputRole,
        chkReminders
    );


    /* ---------------------------------------------------------
       5. حفظ الإعدادات
       --------------------------------------------------------- */

    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            async (e) => {

                e.preventDefault();


                const updatedProfile = {

                    fullName:
                        inputFullName
                            ? inputFullName.value.trim()
                            : "",

                    email:
                        inputEmail
                            ? inputEmail.value.trim()
                            : "",

                    appointmentReminders:
                        chkReminders
                            ? chkReminders.checked
                            : false
                };


                try {

                    if (btnSaveSettings) {
                        btnSaveSettings.disabled =
                            true;
                    }


                    const response =
                        await CONFIG.request(
                            "/settings/profile",
                            {
                                method: "PUT",
                                body:
                                    JSON.stringify(
                                        updatedProfile
                                    )
                            }
                        );


                    if (
                        response &&
                        response.user
                    ) {

                        const currentUser =
                            JSON.parse(
                                localStorage.getItem(
                                    "user_info"
                                ) || "{}"
                            );


                        const newUserData = {

                            ...currentUser,

                            fullName:
                                response.user.fullName,

                            email:
                                response.user.email,

                            role:
                                response.user.role
                        };


                        localStorage.setItem(
                            "user_info",
                            JSON.stringify(
                                newUserData
                            )
                        );
                    }


                    if (chkReminders) {

                        localStorage.setItem(
                            "pref_reminders",
                            String(
                                chkReminders.checked
                            )
                        );
                    }


                    alert(
                        typeof CONFIG.t === "function"
                            ? CONFIG.t(
                                "msgSaveSuccess"
                            )
                            : (
                                getSettingsLanguage() === "ar"
                                    ? "تم حفظ الإعدادات بنجاح"
                                    : "Settings saved successfully"
                            )
                    );

                } catch (error) {

                    alert(
                        error.message ||
                        (
                            getSettingsLanguage() === "ar"
                                ? "حدث خطأ أثناء حفظ الإعدادات"
                                : "An error occurred while saving settings"
                        )
                    );

                } finally {

                    if (btnSaveSettings) {
                        btnSaveSettings.disabled =
                            false;
                    }
                }
            }
        );
    }
});


/* =========================================================
   LANGUAGE
   ========================================================= */

function getSettingsLanguage() {

    return (
        localStorage.getItem("app_lang") ||
        CONFIG.LANG ||
        "ar"
    );
}


function initializeSettingsLanguage() {

    const lang =
        getSettingsLanguage();

    CONFIG.LANG =
        lang;


    document.documentElement.lang =
        lang;

    document.documentElement.dir =
        lang === "en"
            ? "ltr"
            : "rtl";


    if (
        typeof CONFIG.applyTranslations ===
        "function"
    ) {

        CONFIG.applyTranslations(
            lang
        );
    }


    updateSettingsLanguageButton();
    updateSettingsMobileLanguage();
}


/*
 * هذه هي الدالة الوحيدة المسؤولة عن زر اللغة
 * في صفحة الإعدادات.
 *
 * وبالتالي onclick="toggleLanguage()"
 * الموجود في HTML سيعمل بشكل صحيح.
 */
function toggleLanguage() {

    const currentLang =
        getSettingsLanguage();

    const newLang =
        currentLang === "ar"
            ? "en"
            : "ar";


    CONFIG.LANG =
        newLang;


    localStorage.setItem(
        "app_lang",
        newLang
    );


    document.documentElement.lang =
        newLang;

    document.documentElement.dir =
        newLang === "en"
            ? "ltr"
            : "rtl";


    if (
        typeof CONFIG.applyTranslations ===
        "function"
    ) {

        CONFIG.applyTranslations(
            newLang
        );
    }


    updateSettingsLanguageButton();
    updateSettingsMobileLanguage();
}


function updateSettingsLanguageButton() {

    const btn =
        document.getElementById(
            "langToggleBtn"
        );

    if (!btn) return;


    btn.textContent =
        getSettingsLanguage() === "ar"
            ? "EN"
            : "عربي";
}


/* =========================================================
   LOAD USER SETTINGS
   ========================================================= */

async function loadUserSettings(
    inputFullName,
    inputEmail,
    inputRole,
    chkReminders
) {

    try {

        const data =
            await CONFIG.request(
                "/settings/profile",
                {
                    method: "GET"
                }
            );


        if (data) {

            if (inputFullName) {

                inputFullName.value =
                    data.fullName || "";
            }


            if (inputEmail) {

                inputEmail.value =
                    data.email || "";
            }


            if (inputRole) {

                inputRole.value =
                    data.role === "Admin"
                        ? CONFIG.t("adminRole")
                        : (
                            data.role ||
                            CONFIG.t("adminRole")
                        );
            }


            if (chkReminders) {

                chkReminders.checked =
                    !!data.appointmentReminders;
            }


            /*
             * تحديث LocalStorage
             */
            try {

                const currentUser =
                    JSON.parse(
                        localStorage.getItem(
                            "user_info"
                        ) || "{}"
                    );


                currentUser.fullName =
                    data.fullName;

                currentUser.email =
                    data.email;

                currentUser.role =
                    data.role;


                localStorage.setItem(
                    "user_info",
                    JSON.stringify(
                        currentUser
                    )
                );

            } catch (storageError) {

                console.error(
                    "Error updating user_info:",
                    storageError
                );
            }


            localStorage.setItem(
                "pref_reminders",
                String(
                    !!data.appointmentReminders
                )
            );
        }

    } catch (error) {

        console.error(
            "Failed to load profile from server:",
            error
        );


        /*
         * fallback من LocalStorage
         */
        const userInfoRaw =
            localStorage.getItem(
                "user_info"
            );


        if (userInfoRaw) {

            try {

                const user =
                    JSON.parse(
                        userInfoRaw
                    );


                if (inputFullName) {

                    inputFullName.value =
                        user.fullName || "";
                }


                if (inputEmail) {

                    inputEmail.value =
                        user.email || "";
                }


                if (inputRole) {

                    inputRole.value =
                        user.role ||
                        (
                            typeof CONFIG.t ===
                            "function"
                                ? CONFIG.t(
                                    "adminRole"
                                )
                                : "Administrator"
                        );
                }

            } catch (e) {

                console.error(
                    "Error parsing user_info:",
                    e
                );
            }
        }


        const savedReminders =
            localStorage.getItem(
                "pref_reminders"
            );


        if (
            chkReminders &&
            savedReminders !== null
        ) {

            chkReminders.checked =
                savedReminders === "true";
        }
    }
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function ensureSettingsMobileMenu() {

    const header =
        document.querySelector(
            ".responsive-header"
        );

    if (!header) return;


    let button =
        document.getElementById(
            "mobileMenuButton"
        );

    let menu =
        document.getElementById(
            "mobileMenu"
        );

    let overlay =
        document.getElementById(
            "mobileMenuOverlay"
        );


    /* ---------------------------------------------------------
       Mobile Header Top
       --------------------------------------------------------- */

    let headerTop =
        header.querySelector(
            ".mobile-header-top"
        );


    if (!headerTop) {

        headerTop =
            document.createElement("div");

        headerTop.className =
            "mobile-header-top hidden";

        header.insertBefore(
            headerTop,
            header.firstChild
        );
    }


    /* ---------------------------------------------------------
       Menu Button
       --------------------------------------------------------- */

    if (!button) {

        button =
            document.createElement("button");

        button.id =
            "mobileMenuButton";

        button.type =
            "button";

        button.className =
            "mobile-menu-button";

        button.setAttribute(
            "aria-controls",
            "mobileMenu"
        );

        button.setAttribute(
            "aria-expanded",
            "false"
        );

        button.setAttribute(
            "aria-label",
            "Open menu"
        );

        button.innerHTML =
            '<i class="fa-solid fa-bars"></i>';

        headerTop.appendChild(
            button
        );
    }


    /* ---------------------------------------------------------
       Overlay
       --------------------------------------------------------- */

    if (!overlay) {

        overlay =
            document.createElement("div");

        overlay.id =
            "mobileMenuOverlay";

        overlay.className =
            "mobile-menu-overlay";

        document.body.appendChild(
            overlay
        );
    }


    /* ---------------------------------------------------------
       Drawer
       --------------------------------------------------------- */

    if (!menu) {

        menu =
            document.createElement("aside");

        menu.id =
            "mobileMenu";

        menu.className =
            "mobile-menu";

        menu.setAttribute(
            "aria-hidden",
            "true"
        );


        const currentPage =
            window.location.pathname
                .split("/")
                .pop() ||
            "settings.html";


        const links = [

            [
                "dashboard.html",
                "fa-gauge-high",
                "لوحة التحكم",
                "Dashboard"
            ],

            [
                "patients.html",
                "fa-user-injured",
                "المرضى",
                "Patients"
            ],

            [
                "appointments.html",
                "fa-calendar-check",
                "المواعيد",
                "Appointments"
            ],

            [
                "medical-records.html",
                "fa-file-medical",
                "السجلات الطبية",
                "Medical Records"
            ],

            [
                "invoices.html",
                "fa-file-invoice-dollar",
                "الفواتير",
                "Invoices"
            ],

            [
                "reports.html",
                "fa-chart-column",
                "التقارير",
                "Reports"
            ],

            [
                "settings.html",
                "fa-gear",
                "الإعدادات",
                "Settings"
            ]
        ];


        menu.innerHTML = `

            <div class="mobile-menu-header">

                <div class="mobile-menu-brand">

                    <div class="mobile-menu-brand-icon">
                        <i class="fa-solid fa-heart-pulse"></i>
                    </div>

                    <span>
                        MediCore HMS
                    </span>

                </div>


                <button
                    type="button"
                    class="mobile-menu-close"
                    aria-label="Close menu">

                    <i class="fa-solid fa-xmark"></i>

                </button>

            </div>


            <nav>

                ${links.map(link => `

                    <a
                        href="${link[0]}"
                        class="${currentPage === link[0] ? "active" : ""}">

                        <i class="fa-solid ${link[1]}"></i>

                        <span
                            data-mobile-ar="${link[2]}"
                            data-mobile-en="${link[3]}">
                            ${
                                getSettingsLanguage() === "ar"
                                    ? link[2]
                                    : link[3]
                            }
                        </span>

                    </a>

                `).join("")}

            </nav>


            <div class="mobile-menu-user">

                <div class="mobile-menu-user-avatar">
                    <i class="fa-solid fa-user"></i>
                </div>

                <div class="mobile-menu-user-info">

                    <strong>
                        MediCore HMS
                    </strong>

                    <span>
                        Administrator
                    </span>

                </div>

            </div>
        `;


        document.body.appendChild(
            menu
        );
    }


    /* ---------------------------------------------------------
       Events
       --------------------------------------------------------- */

    button.onclick =
        () => {

            menu.classList.toggle(
                "active"
            );

            overlay.classList.toggle(
                "active"
            );


            const active =
                menu.classList.contains(
                    "active"
                );


            menu.setAttribute(
                "aria-hidden",
                String(!active)
            );


            button.setAttribute(
                "aria-expanded",
                String(active)
            );


            document.body.style.overflow =
                active
                    ? "hidden"
                    : "";
        };


    overlay.onclick =
        closeSettingsMobileMenu;


    const closeButton =
        menu.querySelector(
            ".mobile-menu-close"
        );


    if (closeButton) {

        closeButton.onclick =
            closeSettingsMobileMenu;
    }


    menu
        .querySelectorAll(
            "nav a"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                closeSettingsMobileMenu
            );
        });


    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth >
                767
            ) {

                closeSettingsMobileMenu();
            }
        }
    );
}


function closeSettingsMobileMenu() {

    const menu =
        document.getElementById(
            "mobileMenu"
        );

    const overlay =
        document.getElementById(
            "mobileMenuOverlay"
        );

    const button =
        document.getElementById(
            "mobileMenuButton"
        );


    if (menu) {

        menu.classList.remove(
            "active"
        );

        menu.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    if (overlay) {

        overlay.classList.remove(
            "active"
        );
    }


    if (button) {

        button.setAttribute(
            "aria-expanded",
            "false"
        );
    }


    document.body.style.overflow = "";
}


function updateSettingsMobileLanguage() {

    const lang =
        getSettingsLanguage();


    document
        .querySelectorAll(
            "#mobileMenu [data-mobile-ar]"
        )
        .forEach(element => {

            element.textContent =
                lang === "ar"
                    ? element.dataset.mobileAr
                    : element.dataset.mobileEn;
        });
}
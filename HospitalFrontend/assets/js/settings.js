"use strict";

/* =========================================================
   MediCore HMS
   SETTINGS PAGE
   Responsive + Translation Safe
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeSettingsPage();

});


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeSettingsPage() {

    const lang =
        typeof CONFIG !== "undefined" && CONFIG.LANG
            ? CONFIG.LANG
            : localStorage.getItem("app_lang") || "ar";

    if (
        typeof CONFIG !== "undefined" &&
        typeof CONFIG.applyTranslations === "function"
    ) {
        CONFIG.applyTranslations(lang);
    }

    updateSettingsLanguageButton();

    const profileForm =
        document.getElementById("profileForm");

    const inputFullName =
        document.getElementById("adminName");

    const inputEmail =
        document.getElementById("adminEmail");

    const inputRole =
        document.getElementById("adminRoleInput");

    const chkReminders =
        document.getElementById("reminderToggle");

    const btnSaveSettings =
        profileForm
            ? profileForm.querySelector('button[type="submit"]')
            : null;


    /* ---------------------------------------------------------
       Load user profile
       --------------------------------------------------------- */

    loadUserSettings(
        inputFullName,
        inputEmail,
        inputRole,
        chkReminders
    );


    /* ---------------------------------------------------------
       Save profile
       --------------------------------------------------------- */

    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

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


                if (
                    !updatedProfile.fullName ||
                    !updatedProfile.email
                ) {

                    alert(
                        getSettingsLanguage() === "ar"
                            ? "يرجى إدخال الاسم والبريد الإلكتروني."
                            : "Please enter the name and email address."
                    );

                    return;
                }


                try {

                    if (btnSaveSettings) {
                        btnSaveSettings.disabled = true;
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


                    /* -------------------------------------------------
                       Update local user information
                       ------------------------------------------------- */

                    if (
                        response &&
                        response.user
                    ) {

                        let currentUser = {};

                        try {

                            currentUser =
                                JSON.parse(
                                    localStorage.getItem(
                                        "user_info"
                                    ) || "{}"
                                );

                        } catch (storageError) {

                            console.warn(
                                "Unable to parse existing user_info:",
                                storageError
                            );

                        }


                        const newUserData = {

                            ...currentUser,

                            fullName:
                                response.user.fullName ||
                                updatedProfile.fullName,

                            email:
                                response.user.email ||
                                updatedProfile.email,

                            role:
                                response.user.role ||
                                currentUser.role ||
                                "Admin"

                        };


                        localStorage.setItem(
                            "user_info",
                            JSON.stringify(
                                newUserData
                            )
                        );

                    }


                    /* -------------------------------------------------
                       Save reminder preference locally
                       ------------------------------------------------- */

                    if (chkReminders) {

                        localStorage.setItem(
                            "pref_reminders",
                            String(
                                chkReminders.checked
                            )
                        );

                    }


                    /* -------------------------------------------------
                       Success
                       ------------------------------------------------- */

                    alert(
                        typeof CONFIG.t === "function"
                            ? CONFIG.t("msgSaveSuccess")
                            : (
                                getSettingsLanguage() === "ar"
                                    ? "تم حفظ التغييرات بنجاح!"
                                    : "Changes saved successfully!"
                            )
                    );


                    /* -------------------------------------------------
                       Refresh displayed user data
                       ------------------------------------------------- */

                    await loadUserSettings(
                        inputFullName,
                        inputEmail,
                        inputRole,
                        chkReminders
                    );


                } catch (error) {

                    console.error(
                        "Failed to save settings:",
                        error
                    );


                    alert(
                        error &&
                        error.message
                            ? error.message
                            : (
                                getSettingsLanguage() === "ar"
                                    ? "حدث خطأ أثناء حفظ الإعدادات."
                                    : "An error occurred while saving settings."
                            )
                    );


                } finally {

                    if (btnSaveSettings) {
                        btnSaveSettings.disabled = false;
                    }

                }

            }
        );

    }

}


/* =========================================================
   LANGUAGE
   ========================================================= */

function getSettingsLanguage() {

    const lang =
        (
            typeof CONFIG !== "undefined"
                ? CONFIG.LANG
                : null
        ) ||
        localStorage.getItem("app_lang") ||
        "ar";


    return lang === "en"
        ? "en"
        : "ar";
}


/* =========================================================
   LANGUAGE BUTTON
   ========================================================= */

function updateSettingsLanguageButton() {

    const btn =
        document.getElementById(
            "langToggleBtn"
        );

    if (!btn) return;


    const lang =
        getSettingsLanguage();


    const label =
        document.getElementById(
            "currentLangLabel"
        );


    if (label) {

        label.textContent =
            lang === "ar"
                ? "EN"
                : "عربي";

    } else {

        btn.textContent =
            lang === "ar"
                ? "EN"
                : "عربي";

    }

}


/* =========================================================
   REFRESH AFTER GLOBAL LANGUAGE CHANGE
   ========================================================= */

window.refreshSettingsLanguage =
    function () {

        updateSettingsLanguageButton();

    };


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

            /* -------------------------------------------------
               Full name
               ------------------------------------------------- */

            if (inputFullName) {

                inputFullName.value =
                    data.fullName || "";

            }


            /* -------------------------------------------------
               Email
               ------------------------------------------------- */

            if (inputEmail) {

                inputEmail.value =
                    data.email || "";

            }


            /* -------------------------------------------------
               Role
               ------------------------------------------------- */

            if (inputRole) {

                if (data.role === "Admin") {

                    inputRole.value =
                        typeof CONFIG.t === "function"
                            ? CONFIG.t("adminRole")
                            : "System Admin";

                } else {

                    inputRole.value =
                        data.role ||
                        (
                            typeof CONFIG.t === "function"
                                ? CONFIG.t("adminRole")
                                : "System Admin"
                        );

                }

            }


            /* -------------------------------------------------
               Appointment reminders
               ------------------------------------------------- */

            if (chkReminders) {

                chkReminders.checked =
                    !!data.appointmentReminders;

            }


            /* -------------------------------------------------
               Update localStorage
               ------------------------------------------------- */

            try {

                const currentUser =
                    JSON.parse(
                        localStorage.getItem(
                            "user_info"
                        ) || "{}"
                    );


                currentUser.fullName =
                    data.fullName ||
                    currentUser.fullName ||
                    "";

                currentUser.email =
                    data.email ||
                    currentUser.email ||
                    "";

                currentUser.role =
                    data.role ||
                    currentUser.role ||
                    "Admin";


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

            return;

        }

    } catch (error) {

        console.error(
            "Failed to load profile from server:",
            error
        );

    }


    /* =========================================================
       FALLBACK TO LOCAL STORAGE
       ========================================================= */

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
                    user.role === "Admin"
                        ? (
                            typeof CONFIG.t === "function"
                                ? CONFIG.t("adminRole")
                                : "System Admin"
                        )
                        : (
                            user.role ||
                            (
                                typeof CONFIG.t === "function"
                                    ? CONFIG.t("adminRole")
                                    : "System Admin"
                            )
                        );

            }

        } catch (error) {

            console.error(
                "Error parsing user_info:",
                error
            );

        }

    }


    /* ---------------------------------------------------------
       Reminder fallback
       --------------------------------------------------------- */

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


/* =========================================================
   REMINDER TOGGLE
   ========================================================= */

function toggleReminders(checked) {

    localStorage.setItem(
        "pref_reminders",
        String(!!checked)
    );

}
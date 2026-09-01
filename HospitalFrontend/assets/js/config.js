/* =========================================================
   MediCore HMS
   Global Configuration + Arabic / English Translation
   ========================================================= */

(function () {
    "use strict";


    /* =========================================================
       1. CONFIGURATION
       ========================================================= */

    const CONFIG = {
      API_BASE_URL: 'https://hospitalsystem-production-80cc.up.railway.app',
        appName: "MediCore HMS",

        defaultLanguage: "ar",

        supportedLanguages: ["ar", "en"],

        storageKey: "medicore_language"

    };


    /* =========================================================
       2. TRANSLATIONS
       ========================================================= */

    const translations = {

        /* =====================================================
           ARABIC
           ===================================================== */

        ar: {

            /* -------------------------------------------------
               General
               ------------------------------------------------- */

            appName: "MediCore HMS",

            english: "English",
            arabic: "العربية",

            logout: "تسجيل الخروج",

            search: "بحث",

            cancel: "إلغاء",

            save: "حفظ",

            edit: "تعديل",

            delete: "حذف",

            view: "عرض",

            close: "إغلاق",

            actions: "إجراءات",

            status: "الحالة",

            loading: "جاري التحميل...",

            noData: "لا توجد بيانات",

            confirm: "تأكيد",

            yes: "نعم",

            no: "لا",


            /* -------------------------------------------------
               Navigation
               ------------------------------------------------- */

            nav: {

                dashboard: "لوحة التحكم",

                patients: "إدارة المرضى",

                appointments: "المواعيد",

                medicalRecords: "السجلات الطبية",

                invoices: "الفواتير",

                reports: "التقارير",

                settings: "الإعدادات"

            },


            /* -------------------------------------------------
               Alternative navigation keys
               لدعم الصفحات القديمة
               ------------------------------------------------- */

            navDashboard: "لوحة التحكم",

            navPatients: "إدارة المرضى",

            navAppointments: "المواعيد",

            navMedicalRecords: "السجلات الطبية",

            navInvoices: "الفواتير",

            navReports: "التقارير",

            navSettings: "الإعدادات",


            /* -------------------------------------------------
               User
               ------------------------------------------------- */

            user: {

                role: "إدارة النظام"

            },


            /* -------------------------------------------------
               Header
               ------------------------------------------------- */

            header: {

                searchPlaceholder:
                    "البحث عن مريض بالاسم، البريد أو المعرّف (PID)..."

            },


            searchPlaceholder:
                "البحث عن مريض، موعد، أو طبيب...",


            /* -------------------------------------------------
               Dashboard
               ------------------------------------------------- */

            dashboard: {

                title: "لوحة التحكم",

                subtitle:
                    "نظرة عامة على أداء وإحصائيات النظام.",

                totalPatients: "إجمالي المرضى",

                appointments: "المواعيد",

                doctors: "الأطباء",

                revenue: "الإيرادات",

                recentAppointments: "أحدث المواعيد",

                recentPatients: "أحدث المرضى",

                statistics: "الإحصائيات"

            },


            /* -------------------------------------------------
               Patients
               ------------------------------------------------- */

            patients: {

                title: "سجلات المرضى",

                subtitle:
                    "تسجيل، تصفية، ومتابعة الملفات الطبية الشاملة لكافة المرضى.",

                btnRegister:
                    "تسجيل مريض جديد"

            },


            /* -------------------------------------------------
               Patient Form
               ------------------------------------------------- */

            form: {

                header:
                    "نموذج تسجيل مريض جديد",

                fullName:
                    "الاسم الكامل *",

                fullNamePlaceholder:
                    "مثال: أحمد السيد",

                dob:
                    "تاريخ الميلاد *",

                gender:
                    "الجنس *",

                contact:
                    "رقم التواصل *",

                contactPlaceholder:
                    "+967 7XX XXX XXX",

                email:
                    "البريد الإلكتروني",

                emailPlaceholder:
                    "patient@example.com",

                status:
                    "الحالة",

                address:
                    "العنوان",

                addressPlaceholder:
                    "المدينة، الدولة",

                medicalHistory:
                    "السجل الطبي",

                historyPlaceholder:
                    "الحساسية، الأمراض المزمنة، العمليات السابقة...",

                cancel:
                    "إلغاء",

                save:
                    "حفظ بيانات المريض"

            },


            /* -------------------------------------------------
               Gender
               ------------------------------------------------- */

            gender: {

                male: "ذكر",

                female: "أنثى"

            },


            /* -------------------------------------------------
               Patient Status
               ------------------------------------------------- */

            status: {

                active: "نشط",

                inactive: "غير نشط"

            },


            /* -------------------------------------------------
               Patients Table
               ------------------------------------------------- */

            table: {

                pid: "معرّف المريض",

                name: "اسم المريض",

                ageGender: "العمر / الجنس",

                contact: "رقم التواصل",

                registered: "تاريخ التسجيل",

                status: "الحالة",

                actions: "إجراءات",

                filterPlaceholder:
                    "البحث باسم المريض، PID، أو رقم التواصل..."

            },


            /* -------------------------------------------------
               Appointments
               ------------------------------------------------- */

            appointmentsTitle:
                "إدارة المواعيد - MediCore HMS",

            appointmentsHeader:
                "المواعيد والحجوزات",

            appointmentsSubHeader:
                "جدولة، بحث، وإدارة مواعيد العيادات الخارجية والعمليات بشكل لحظي.",

            newAppointmentTitle:
                "حجز موعد جديد",

            btnSubmitAppointment:
                "تأكيد وحفظ الموعد",

            filterPlaceholder:
                "تصفية المواعيد حسب الاسم، القسم...",

            appointment: {

                patient:
                    "المريض",

                doctor:
                    "الطبيب",

                department:
                    "القسم",

                date:
                    "الموعد",

                status:
                    "الحالة",

                actions:
                    "إجراءات"

            },


            /* -------------------------------------------------
               Appointment Form
               ------------------------------------------------- */

            appointmentForm: {

                patientName:
                    "اسم المريض",

                doctorName:
                    "الطبيب المعالج",

                department:
                    "القسم / العيادة",

                date:
                    "تاريخ ووقت الموعد",

                notes:
                    "ملاحظات إضافية",

                notesPlaceholder:
                    "أدخل أي ملاحظات إضافية..."

            },


            /* -------------------------------------------------
               Departments
               ------------------------------------------------- */

            departments: {

                internal:
                    "العيادة الباطنية",

                orthopedics:
                    "عيادة العظام",

                pediatrics:
                    "عيادة الأطفال",

                dental:
                    "عيادة الأسنان"

            },


            /* -------------------------------------------------
               Medical Records
               ------------------------------------------------- */

            medicalRecords: {

                title:
                    "السجلات الطبية",

                subtitle:
                    "إدارة ومتابعة السجلات الطبية للمرضى.",

                patient:
                    "المريض",

                diagnosis:
                    "التشخيص",

                doctor:
                    "الطبيب",

                date:
                    "التاريخ",

                actions:
                    "إجراءات"

            },


            /* -------------------------------------------------
               Invoices
               ------------------------------------------------- */

            invoices: {

                title:
                    "الفواتير",

                subtitle:
                    "إدارة الفواتير والمدفوعات.",

                invoiceNumber:
                    "رقم الفاتورة",

                patient:
                    "المريض",

                amount:
                    "المبلغ",

                date:
                    "التاريخ",

                status:
                    "الحالة",

                actions:
                    "إجراءات"

            },


            /* -------------------------------------------------
               Reports
               ------------------------------------------------- */

            reports: {

                title:
                    "التقارير",

                subtitle:
                    "عرض وتحليل تقارير النظام.",

                patients:
                    "تقارير المرضى",

                appointments:
                    "تقارير المواعيد",

                financial:
                    "التقارير المالية"

            },


            /* -------------------------------------------------
               Settings
               ------------------------------------------------- */

            settings: {

                title:
                    "الإعدادات",

                subtitle:
                    "إدارة إعدادات النظام والتفضيلات.",

                language:
                    "لغة النظام",

                notifications:
                    "الإشعارات",

                security:
                    "الأمان",

                save:
                    "حفظ الإعدادات"

            }

        },


        /* =====================================================
           ENGLISH
           ===================================================== */

        en: {

            /* -------------------------------------------------
               General
               ------------------------------------------------- */

            appName: "MediCore HMS",

            english: "English",

            arabic: "العربية",

            logout: "Logout",

            search: "Search",

            cancel: "Cancel",

            save: "Save",

            edit: "Edit",

            delete: "Delete",

            view: "View",

            close: "Close",

            actions: "Actions",

            status: "Status",

            loading: "Loading...",

            noData: "No data available",

            confirm: "Confirm",

            yes: "Yes",

            no: "No",


            /* -------------------------------------------------
               Navigation
               ------------------------------------------------- */

            nav: {

                dashboard: "Dashboard",

                patients: "Patients",

                appointments: "Appointments",

                medicalRecords: "Medical Records",

                invoices: "Invoices",

                reports: "Reports",

                settings: "Settings"

            },


            /* -------------------------------------------------
               Alternative navigation keys
               ------------------------------------------------- */

            navDashboard: "Dashboard",

            navPatients: "Patients",

            navAppointments: "Appointments",

            navMedicalRecords: "Medical Records",

            navInvoices: "Invoices",

            navReports: "Reports",

            navSettings: "Settings",


            /* -------------------------------------------------
               User
               ------------------------------------------------- */

            user: {

                role: "System Administration"

            },


            /* -------------------------------------------------
               Header
               ------------------------------------------------- */

            header: {

                searchPlaceholder:
                    "Search by patient name, email or PID..."

            },


            searchPlaceholder:
                "Search for a patient, appointment, or doctor...",


            /* -------------------------------------------------
               Dashboard
               ------------------------------------------------- */

            dashboard: {

                title: "Dashboard",

                subtitle:
                    "Overview of system performance and statistics.",

                totalPatients: "Total Patients",

                appointments: "Appointments",

                doctors: "Doctors",

                revenue: "Revenue",

                recentAppointments:
                    "Recent Appointments",

                recentPatients:
                    "Recent Patients",

                statistics:
                    "Statistics"

            },


            /* -------------------------------------------------
               Patients
               ------------------------------------------------- */

            patients: {

                title: "Patient Records",

                subtitle:
                    "Register, filter, and manage comprehensive medical records for all patients.",

                btnRegister:
                    "Register New Patient"

            },


            /* -------------------------------------------------
               Patient Form
               ------------------------------------------------- */

            form: {

                header:
                    "New Patient Registration Form",

                fullName:
                    "Full Name *",

                fullNamePlaceholder:
                    "Example: Ahmed Al-Sayed",

                dob:
                    "Date of Birth *",

                gender:
                    "Gender *",

                contact:
                    "Contact Number *",

                contactPlaceholder:
                    "+967 7XX XXX XXX",

                email:
                    "Email Address",

                emailPlaceholder:
                    "patient@example.com",

                status:
                    "Status",

                address:
                    "Address",

                addressPlaceholder:
                    "City, Country",

                medicalHistory:
                    "Medical History",

                historyPlaceholder:
                    "Allergies, chronic diseases, previous surgeries...",

                cancel:
                    "Cancel",

                save:
                    "Save Patient Data"

            },


            /* -------------------------------------------------
               Gender
               ------------------------------------------------- */

            gender: {

                male: "Male",

                female: "Female"

            },


            /* -------------------------------------------------
               Status
               ------------------------------------------------- */

            status: {

                active: "Active",

                inactive: "Inactive"

            },


            /* -------------------------------------------------
               Patients Table
               ------------------------------------------------- */

            table: {

                pid: "Patient ID",

                name: "Name",

                ageGender: "Age / Gender",

                contact: "Contact",

                registered: "Registered",

                status: "Status",

                actions: "Actions",

                filterPlaceholder:
                    "Search by patient name, PID, or contact number..."

            },


            /* -------------------------------------------------
               Appointments
               ------------------------------------------------- */

            appointmentsTitle:
                "Appointment Management - MediCore HMS",

            appointmentsHeader:
                "Appointments & Bookings",

            appointmentsSubHeader:
                "Schedule, search, and manage outpatient and procedure appointments in real time.",

            newAppointmentTitle:
                "Book New Appointment",

            btnSubmitAppointment:
                "Confirm & Save Appointment",

            filterPlaceholder:
                "Filter appointments by name, department...",

            appointment: {

                patient:
                    "Patient",

                doctor:
                    "Doctor",

                department:
                    "Department",

                date:
                    "Appointment",

                status:
                    "Status",

                actions:
                    "Actions"

            },


            /* -------------------------------------------------
               Appointment Form
               ------------------------------------------------- */

            appointmentForm: {

                patientName:
                    "Patient Name",

                doctorName:
                    "Attending Doctor",

                department:
                    "Department / Clinic",

                date:
                    "Appointment Date & Time",

                notes:
                    "Additional Notes",

                notesPlaceholder:
                    "Enter any additional notes..."

            },


            /* -------------------------------------------------
               Departments
               ------------------------------------------------- */

            departments: {

                internal:
                    "Internal Medicine",

                orthopedics:
                    "Orthopedics Clinic",

                pediatrics:
                    "Pediatrics Clinic",

                dental:
                    "Dental Clinic"

            },


            /* -------------------------------------------------
               Medical Records
               ------------------------------------------------- */

            medicalRecords: {

                title:
                    "Medical Records",

                subtitle:
                    "Manage and review patient medical records.",

                patient:
                    "Patient",

                diagnosis:
                    "Diagnosis",

                doctor:
                    "Doctor",

                date:
                    "Date",

                actions:
                    "Actions"

            },


            /* -------------------------------------------------
               Invoices
               ------------------------------------------------- */

            invoices: {

                title:
                    "Invoices",

                subtitle:
                    "Manage invoices and payments.",

                invoiceNumber:
                    "Invoice Number",

                patient:
                    "Patient",

                amount:
                    "Amount",

                date:
                    "Date",

                status:
                    "Status",

                actions:
                    "Actions"

            },


            /* -------------------------------------------------
               Reports
               ------------------------------------------------- */

            reports: {

                title:
                    "Reports",

                subtitle:
                    "View and analyze system reports.",

                patients:
                    "Patient Reports",

                appointments:
                    "Appointment Reports",

                financial:
                    "Financial Reports"

            },


            /* -------------------------------------------------
               Settings
               ------------------------------------------------- */

            settings: {

                title:
                    "Settings",

                subtitle:
                    "Manage system settings and preferences.",

                language:
                    "System Language",

                notifications:
                    "Notifications",

                security:
                    "Security",

                save:
                    "Save Settings"

            }

        }

    };


    /* =========================================================
       3. GET CURRENT LANGUAGE
       ========================================================= */

    function getCurrentLanguage() {

        const savedLanguage =
            localStorage.getItem(CONFIG.storageKey);

        if (
            savedLanguage &&
            CONFIG.supportedLanguages.includes(savedLanguage)
        ) {
            return savedLanguage;
        }

        return CONFIG.defaultLanguage;
    }


    /* =========================================================
       4. GET TRANSLATION BY KEY
       يدعم:
       nav.dashboard
       patients.title
       navDashboard
       appointmentsTitle
       ========================================================= */

    function getTranslation(key, language) {

        const lang =
            language || getCurrentLanguage();

        const dictionary =
            translations[lang];

        if (!dictionary) {
            return key;
        }

        const parts =
            key.split(".");

        let value =
            dictionary;

        for (const part of parts) {

            if (
                value &&
                Object.prototype.hasOwnProperty.call(value, part)
            ) {
                value = value[part];
            } else {
                return key;
            }

        }

        return typeof value === "string"
            ? value
            : key;
    }


    /* =========================================================
       5. TRANSLATE PAGE
       ========================================================= */

    function applyTranslations(language) {

        const lang =
            language || getCurrentLanguage();

        const dictionary =
            translations[lang];

        if (!dictionary) {
            return;
        }


        /* ---------------------------------------------
           Text
           --------------------------------------------- */

        document
            .querySelectorAll("[data-i18n]")
            .forEach(element => {

                const key =
                    element.getAttribute("data-i18n");

                const translated =
                    getTranslation(key, lang);

                if (translated !== key) {

                    element.textContent =
                        translated;

                }

            });


        /* ---------------------------------------------
           Placeholder
           --------------------------------------------- */

        document
            .querySelectorAll("[data-i18n-placeholder]")
            .forEach(element => {

                const key =
                    element.getAttribute(
                        "data-i18n-placeholder"
                    );

                const translated =
                    getTranslation(key, lang);

                if (translated !== key) {

                    element.placeholder =
                        translated;

                }

            });


        /* ---------------------------------------------
           Title attribute
           --------------------------------------------- */

        document
            .querySelectorAll("[data-i18n-title]")
            .forEach(element => {

                const key =
                    element.getAttribute(
                        "data-i18n-title"
                    );

                const translated =
                    getTranslation(key, lang);

                if (translated !== key) {

                    element.title =
                        translated;

                }

            });


        /* ---------------------------------------------
           HTML direction
           --------------------------------------------- */

        const html =
            document.documentElement;

        if (lang === "ar") {

            html.lang = "ar";

            html.dir = "rtl";

        } else {

            html.lang = "en";

            html.dir = "ltr";

        }


        /* ---------------------------------------------
           Language button
           --------------------------------------------- */

        updateLanguageButton(lang);


        /* ---------------------------------------------
           Page title
           --------------------------------------------- */

        updatePageTitle(lang);


        /* ---------------------------------------------
           Custom event
           --------------------------------------------- */

        document.dispatchEvent(
            new CustomEvent(
                "languageChanged",
                {
                    detail: {
                        language: lang
                    }
                }
            )
        );

    }


    /* =========================================================
       6. UPDATE LANGUAGE BUTTON
       ========================================================= */

    function updateLanguageButton(language) {

        const buttonText =
            document.getElementById("currentLangLabel");

        const oldButtonText =
            document.getElementById("langBtnText");


        /*
         * عند عرض العربية:
         * الزر يعرض English
         *
         * عند عرض الإنجليزية:
         * الزر يعرض العربية
         */

        const text =
            language === "ar"
                ? "English"
                : "العربية";


        if (buttonText) {

            buttonText.textContent =
                text;

        }


        if (oldButtonText) {

            oldButtonText.textContent =
                text;

        }

    }


    /* =========================================================
       7. UPDATE PAGE TITLE
       ========================================================= */

    function updatePageTitle(language) {

        const title =
            document.querySelector("title[data-i18n]");

        if (!title) {
            return;
        }

        const key =
            title.getAttribute("data-i18n");

        const translated =
            getTranslation(key, language);

        if (translated !== key) {

            document.title =
                translated;

        }

    }


    /* =========================================================
       8. SWITCH LANGUAGE
       ========================================================= */

    function switchLanguage() {

        const current =
            getCurrentLanguage();

        const next =
            current === "ar"
                ? "en"
                : "ar";

        localStorage.setItem(
            CONFIG.storageKey,
            next
        );

        applyTranslations(next);

    }


    /* =========================================================
       9. TOGGLE LANGUAGE
       يدعم الصفحات التي تستخدم:
       toggleLanguage()
       والصفحات التي تستخدم:
       switchLanguage()
       ========================================================= */

    function toggleLanguage() {

        switchLanguage();

    }


    /* =========================================================
       10. INITIALIZE
       ========================================================= */

    function initializeLanguage() {

        const language =
            getCurrentLanguage();

        applyTranslations(language);

    }


    /* =========================================================
       11. GLOBAL API
       ========================================================= */

    window.MediCoreConfig = CONFIG;

    window.translations =
        translations;

    window.getCurrentLanguage =
        getCurrentLanguage;

    window.getTranslation =
        getTranslation;

    window.applyTranslations =
        applyTranslations;

    window.switchLanguage =
        switchLanguage;

    window.toggleLanguage =
        toggleLanguage;


    /* =========================================================
       12. START AFTER DOM READY
       ========================================================= */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initializeLanguage
        );

    } else {

        initializeLanguage();

    }


})();
"use strict";

/* =========================================================
   MediCore HMS
   GLOBAL CONFIGURATION
   API + AUTH + TRANSLATIONS + LANGUAGE SYSTEM
   ========================================================= */

const CONFIG = {

    /* =========================================================
       API
       ========================================================= */

    API_BASE_URL:
        'https://hospitalsystem-production-80cc.up.railway.app',


    /* =========================================================
       LANGUAGE
       ========================================================= */

    LANG:
        localStorage.getItem('app_lang') || 'ar',


    /* =========================================================
       TRANSLATIONS
       ========================================================= */

    translations: {

        /* =====================================================
           ARABIC
           ===================================================== */

        ar: {

            /* ---------- Page Titles ---------- */

            appointmentsTitle:
                "إدارة المواعيد - MediCore HMS",

            patientsTitle:
                "إدارة المرضى - MediCore HMS",

            invoicesTitle:
                "الفواتير والمدفوعات - MediCore HMS",

            medicalRecordsTitle:
                "السجلات الطبية - MediCore HMS",

            dashboardTitle:
                "لوحة التحكم - MediCore HMS",

            settingsTitle:
                "الإعدادات - MediCore HMS",


            /* ---------- Navigation ---------- */

            navDashboard:
                "لوحة التحكم",

            navPatients:
                "إدارة المرضى",

            navAppointments:
                "المواعيد",

            navInvoices:
                "الفواتير والمدفوعات",

            navReports:
                "التقارير",

            navSettings:
                "الإعدادات",

            navMedicalRecords:
                "السجلات الطبية",

            adminRole:
                "إدارة النظام",

            logout:
                "تسجيل الخروج",


            /* ---------- Header ---------- */

            searchPlaceholder:
                "البحث عن مريض، موعد، أو طبيب...",

            filterPlaceholder:
                "تصفية العناصر حسب الاسم، القسم...",


            /* =================================================
               PATIENTS
               ================================================= */

            patientsHeader:
                "إدارة المرضى",

            patientsSubHeader:
                "تسجيل، بحث، ومتابعة الملفات الشخصية والتاريخ الطبي للمرضى.",

            btnNewPatient:
                "مريض جديد",

            thPatientName:
                "اسم المريض",

            thPhone:
                "رقم الهاتف",

            thAge:
                "العمر",

            thGender:
                "الجنس",

            thBloodGroup:
                "فصيلة الدم",

            loadingPatients:
                "جاري تحميل بيانات المرضى...",

            errorFetchPatients:
                "فشل جلب بيانات المرضى من السيرفر",

            noPatientsFound:
                "لا توجد ملفات مرضى مسجلة حالياً",

            modalNewPatientTitle:
                "تسجيل مريض جديد",

            btnSavePatient:
                "حفظ بيانات المريض",

            genderMale:
                "ذكر",

            genderFemale:
                "أنثى",


            /* ---------- Patients alternative keys ---------- */

            "patients.title":
                "إدارة المرضى - MediCore HMS",

            "patients.subtitle":
                "تسجيل، بحث، ومتابعة الملفات الشخصية والتاريخ الطبي للمرضى.",

            "patients.btnRegister":
                "تسجيل مريض جديد",


            /* =================================================
               APPOINTMENTS
               ================================================= */

            appointmentsHeader:
                "المواعيد والحجوزات",

            appointmentsSubHeader:
                "جدولة، بحث، وإدارة مواعيد العيادات الخارجية والعمليات بشكل لحظي.",

            thPatient:
                "المريض",

            thDoctor:
                "الطبيب",

            thDepartment:
                "القسم",

            thAppointmentDate:
                "الموعد",

            thStatus:
                "الحالة",

            thActions:
                "إجراءات",

            newAppointmentTitle:
                "حجز موعد جديد",

            lblPatientName:
                "اسم المريض",

            lblDoctorName:
                "الطبيب المعالج",

            lblDepartment:
                "القسم / العيادة",

            lblAppointmentDate:
                "تاريخ ووقت الموعد",

            lblNotes:
                "ملاحظات إضافية",

            btnSubmitAppointment:
                "تأكيد وحفظ الموعد",

            deptInternal:
                "العيادة الباطنية",

            deptOrtho:
                "عيادة العظام",

            deptPediatrics:
                "عيادة الأطفال",

            deptDental:
                "عيادة الأسنان",

            loadingAppointments:
                "جاري تحميل المواعيد...",

            errorFetchAppointments:
                "فشل جلب المواعيد من السيرفر",

            noAppointmentsFound:
                "لا توجد مواعيد مسجلة حالياً",

            btnCancelAppointment:
                "إلغاء",

            statusConfirmed:
                "مؤكد",

            statusCancelled:
                "ملغى",

            statusPending:
                "قيد الانتظار",


            /* =================================================
               MEDICAL RECORDS
               ================================================= */

            recordsHeader:
                "السجلات الطبية",

            recordsSubHeader:
                "سجلات المرضى المركزية والمؤرخة مع صلاحيات الوصول والتدقيق الشامل.",

            btnNewRecord:
                "سجل جديد",

            recordsDiagnosis:
                "التشخيص",

            recordsPrescription:
                "الوصفة الطبية",

            recordsNotes:
                "ملاحظات",

            loadingRecords:
                "جاري تحميل السجلات الطبية...",

            errorFetchRecords:
                "فشل جلب السجلات الطبية من السيرفر",

            noRecordsFound:
                "لا توجد سجلات طبية مسجلة حالياً",

            modalNewRecordTitle:
                "إضافة سجل طبي جديد",

            btnSaveRecord:
                "حفظ السجل",


            /* ---------- Medical Records alternative keys ---------- */

            "records.title":
                "السجلات الطبية - MediCore HMS",

            "records.subtitle":
                "سجلات المرضى المركزية والمؤرخة مع صلاحيات الوصول والتدقيق الشامل.",


            /* =================================================
               INVOICES
               ================================================= */

            invoicesHeader:
                "الفواتير والمدفوعات",

            invoicesSubHeader:
                "إنشاء الفواتير، تطبيق الضرائب والخصومات، ومتابعة المدفوعات.",

            btnNewInvoice:
                "فاتورة جديدة",

            thInvoiceId:
                "معرف الفاتورة",

            thIssuedDate:
                "تاريخ الإصدار",

            thDueDate:
                "تاريخ الاستحقاق",

            thTotalAmount:
                "الإجمالي",

            thPaidAmount:
                "المدفوع",

            statusPaid:
                "مدفوع",

            statusPartial:
                "جزئي",

            btnRecordPayment:
                "تسجيل دفعة",

            loadingInvoices:
                "جاري تحميل الفواتير...",

            errorFetchInvoices:
                "فشل جلب الفواتير من السيرفر",

            noInvoicesFound:
                "لا توجد فواتير مسجلة حالياً",


            /* =================================================
               DASHBOARD
               ================================================= */

            welcomeBack:
                "مرحباً بعودتك",

            greetingAdmin:
                "مساء الخير، المدير.",

            greetingSub:
                "إليك نظرة عامة على ما يحدث في المستشفى اليوم.",

            kpiTotalPatients:
                "إجمالي المرضى",

            kpiTodaysAppointments:
                "مواعيد اليوم",

            kpiPendingBills:
                "الفواتير المعلقة",

            kpiRevenueCollected:
                "الإيرادات المحصلة",

            kpiRevenueSub:
                "هذا الشهر",

            chartPatientIntakeTitle:
                "تسجيل المرضى — آخر 7 أيام",

            chartPatientIntakeSub:
                "تسجيلات المرضى الجدد يومياً",

            chartDeptTitle:
                "المواعيد حسب القسم",

            chartDeptSub:
                "التوزيع عبر التخصصات",


            /* =================================================
               SETTINGS
               ================================================= */

            settingsHeader:
                "الإعدادات",

            settingsSubHeader:
                "إدارة الملف الشخصي، التنبيهات، وتفضيلات بيئة العمل.",

            sectionProfile:
                "الملف الشخصي",

            lblName:
                "الاسم الكامل",

            lblEmail:
                "البريد الإلكتروني",

            lblRole:
                "الدور الوظيفي",

            btnSave:
                "حفظ التغييرات",

            sectionNotifications:
                "التنبيهات",

            lblAppointmentReminders:
                "تذكيرات المواعيد",

            subAppointmentReminders:
                "إرسال تذكيرات عبر البريد الإلكتروني و SMS للمرضى.",

            msgSaveSuccess:
                "تم حفظ التغييرات بنجاح!",


            /* =================================================
               FORMS
               ================================================= */

            formHeader:
                "تسجيل مريض جديد",

            formFullName:
                "الاسم الكامل",

            formFullNamePlaceholder:
                "أدخل الاسم الكامل",

            formDob:
                "تاريخ الميلاد",

            formGender:
                "الجنس",

            formContact:
                "رقم الهاتف",

            formContactPlaceholder:
                "أدخل رقم الهاتف",

            formEmail:
                "البريد الإلكتروني",

            formEmailPlaceholder:
                "أدخل البريد الإلكتروني",

            formStatus:
                "الحالة",

            formAddress:
                "العنوان",

            formAddressPlaceholder:
                "أدخل العنوان",

            formMedicalHistory:
                "التاريخ الطبي",

            formHistoryPlaceholder:
                "أدخل التاريخ الطبي",

            formCancel:
                "إلغاء",

            formSave:
                "حفظ",

            "form.header":
                "تسجيل مريض جديد",

            "form.fullName":
                "الاسم الكامل",

            "form.fullNamePlaceholder":
                "أدخل الاسم الكامل",

            "form.dob":
                "تاريخ الميلاد",

            "form.gender":
                "الجنس",

            "form.contact":
                "رقم الهاتف",

            "form.contactPlaceholder":
                "أدخل رقم الهاتف",

            "form.email":
                "البريد الإلكتروني",

            "form.emailPlaceholder":
                "أدخل البريد الإلكتروني",

            "form.status":
                "الحالة",

            "form.address":
                "العنوان",

            "form.addressPlaceholder":
                "أدخل العنوان",

            "form.medicalHistory":
                "التاريخ الطبي",

            "form.historyPlaceholder":
                "أدخل التاريخ الطبي",

            "form.cancel":
                "إلغاء",

            "form.save":
                "حفظ",


            /* =================================================
               TABLE
               ================================================= */

            "table.filterPlaceholder":
                "تصفية العناصر حسب الاسم، القسم...",

            "table.pid":
                "المعرّف",

            "table.name":
                "الاسم",

            "table.ageGender":
                "العمر والجنس",

            "table.contact":
                "رقم الاتصال",

            "table.registered":
                "تاريخ التسجيل",

            "table.status":
                "الحالة",

            "table.actions":
                "إجراءات",


            /* =================================================
               STATUS
               ================================================= */

            statusActive:
                "نشط",

            statusInactive:
                "غير نشط",


            /* =================================================
               AUTHENTICATION
               ================================================= */

            loginTitle:
                "تسجيل الدخول - MediCore HMS",

            registerTitle:
                "إنشاء حساب - MediCore HMS",

            authWelcomeBack:
                "مرحباً بعودتك",

            authLoginSub:
                "أدخل بياناتك للوصول إلى نظام إدارة المستشفى.",

            authRegisterHeader:
                "إنشاء حساب جديد",

            authRegisterSub:
                "قم بتعبئة البيانات للتسجيل في النظام.",

            lblFullName:
                "الاسم الكامل",

            lblPassword:
                "كلمة المرور",

            lblConfirmPassword:
                "تأكيد كلمة المرور",

            lblRoleSelect:
                "نوع الحساب",

            roleAdmin:
                "إدارة النظام (System Admin)",

            roleDoctor:
                "طبيب (Doctor)",

            roleReceptionist:
                "موظف استقبال (Receptionist)",

            btnLoginSubmit:
                "تسجيل الدخول",

            btnRegisterSubmit:
                "إنشاء الحساب",

            noAccount:
                "ليس لديك حساب؟",

            hasAccount:
                "لديك حساب بالفعل؟",

            linkRegister:
                "إنشاء حساب جديد",

            linkLogin:
                "تسجيل الدخول",

            errPasswordMismatch:
                "كلمتا المرور غير متطابقتين",

            errWeakPassword:
                "كلمة المرور يجب أن تحتوى على 8 خانات على الأقل وتتضمن حرفاً كبيراً ورقماً ورمزاً",

            msgLoginSuccess:
                "تم تسجيل الدخول بنجاح!",

            msgRegisterSuccess:
                "تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن."
        },


        /* =====================================================
           ENGLISH
           ===================================================== */

        en: {

            /* ---------- Page Titles ---------- */

            appointmentsTitle:
                "Appointments - MediCore HMS",

            patientsTitle:
                "Patients - MediCore HMS",

            invoicesTitle:
                "Billing & Payments - MediCore HMS",

            medicalRecordsTitle:
                "Medical Records - MediCore HMS",

            dashboardTitle:
                "Dashboard - MediCore HMS",

            settingsTitle:
                "Settings - MediCore HMS",


            /* ---------- Navigation ---------- */

            navDashboard:
                "Dashboard",

            navPatients:
                "Patients",

            navAppointments:
                "Appointments",

            navInvoices:
                "Billing & Payments",

            navReports:
                "Reports",

            navSettings:
                "Settings",

            navMedicalRecords:
                "Medical Records",

            adminRole:
                "System Admin",

            logout:
                "Logout",


            /* ---------- Header ---------- */

            searchPlaceholder:
                "Search patient, appointment, or doctor...",

            filterPlaceholder:
                "Filter items by name, department...",


            /* =================================================
               PATIENTS
               ================================================= */

            patientsHeader:
                "Patient Management",

            patientsSubHeader:
                "Register, search, and manage patient profiles and medical history.",

            btnNewPatient:
                "New Patient",

            thPatientName:
                "Patient Name",

            thPhone:
                "Phone Number",

            thAge:
                "Age",

            thGender:
                "Gender",

            thBloodGroup:
                "Blood Group",

            loadingPatients:
                "Loading patients...",

            errorFetchPatients:
                "Failed to fetch patients from server",

            noPatientsFound:
                "No patient records found",

            modalNewPatientTitle:
                "Register New Patient",

            btnSavePatient:
                "Save Patient",

            genderMale:
                "Male",

            genderFemale:
                "Female",


            /* ---------- Patients alternative keys ---------- */

            "patients.title":
                "Patients - MediCore HMS",

            "patients.subtitle":
                "Register, search, and manage patient profiles and medical history.",

            "patients.btnRegister":
                "Register New Patient",


            /* =================================================
               APPOINTMENTS
               ================================================= */

            appointmentsHeader:
                "Appointments & Bookings",

            appointmentsSubHeader:
                "Real-time scheduling, search, and management for clinics and operations.",

            thPatient:
                "Patient",

            thDoctor:
                "Doctor",

            thDepartment:
                "Department",

            thAppointmentDate:
                "Date & Time",

            thStatus:
                "Status",

            thActions:
                "Actions",

            newAppointmentTitle:
                "Book New Appointment",

            lblPatientName:
                "Patient Name",

            lblDoctorName:
                "Doctor Name",

            lblDepartment:
                "Department / Clinic",

            lblAppointmentDate:
                "Appointment Date & Time",

            lblNotes:
                "Additional Notes",

            btnSubmitAppointment:
                "Confirm & Save",

            deptInternal:
                "Internal Medicine",

            deptOrtho:
                "Orthopedics",

            deptPediatrics:
                "Pediatrics",

            deptDental:
                "Dental Clinic",

            loadingAppointments:
                "Loading appointments...",

            errorFetchAppointments:
                "Failed to fetch appointments from server",

            noAppointmentsFound:
                "No appointments recorded yet",

            btnCancelAppointment:
                "Cancel",

            statusConfirmed:
                "Confirmed",

            statusCancelled:
                "Cancelled",

            statusPending:
                "Pending",


            /* =================================================
               MEDICAL RECORDS
               ================================================= */

            recordsHeader:
                "Medical Records",

            recordsSubHeader:
                "Centralized, versioned patient records with role-based access and full audit.",

            btnNewRecord:
                "New record",

            recordsDiagnosis:
                "DIAGNOSIS",

            recordsPrescription:
                "PRESCRIPTION",

            recordsNotes:
                "NOTES",

            loadingRecords:
                "Loading medical records...",

            errorFetchRecords:
                "Failed to fetch medical records from server",

            noRecordsFound:
                "No medical records recorded yet",

            modalNewRecordTitle:
                "Add New Medical Record",

            btnSaveRecord:
                "Save Record",


            "records.title":
                "Medical Records - MediCore HMS",

            "records.subtitle":
                "Centralized, versioned patient records with role-based access and full audit.",


            /* =================================================
               INVOICES
               ================================================= */

            invoicesHeader:
                "Billing & Payments",

            invoicesSubHeader:
                "Generate invoices, apply taxes and discounts, and track payments.",

            btnNewInvoice:
                "New invoice",

            thInvoiceId:
                "Invoice ID",

            thIssuedDate:
                "Issued",

            thDueDate:
                "Due",

            thTotalAmount:
                "Total",

            thPaidAmount:
                "Paid",

            statusPaid:
                "Paid",

            statusPartial:
                "Partial",

            btnRecordPayment:
                "Record payment",

            loadingInvoices:
                "Loading invoices...",

            errorFetchInvoices:
                "Failed to fetch invoices from server",

            noInvoicesFound:
                "No invoices recorded yet",


            /* =================================================
               DASHBOARD
               ================================================= */

            welcomeBack:
                "Welcome back",

            greetingAdmin:
                "Good evening, Admin.",

            greetingSub:
                "Here is what is happening across the hospital today.",

            kpiTotalPatients:
                "TOTAL PATIENTS",

            kpiTodaysAppointments:
                "TODAY'S APPOINTMENTS",

            kpiPendingBills:
                "PENDING BILLS",

            kpiRevenueCollected:
                "REVENUE COLLECTED",

            kpiRevenueSub:
                "This month",

            chartPatientIntakeTitle:
                "Patient intake — last 7 days",

            chartPatientIntakeSub:
                "New patient registrations per day",

            chartDeptTitle:
                "Appointments by Department",

            chartDeptSub:
                "Distribution across specialties",


            /* =================================================
               SETTINGS
               ================================================= */

            settingsHeader:
                "Settings",

            settingsSubHeader:
                "Manage your profile, notifications, and workspace preferences.",

            sectionProfile:
                "Profile",

            lblName:
                "Full Name",

            lblEmail:
                "Email Address",

            lblRole:
                "Role",

            btnSave:
                "Save changes",

            sectionNotifications:
                "Notifications",

            lblAppointmentReminders:
                "Appointment reminders",

            subAppointmentReminders:
                "Send Email + SMS reminders to patients.",

            msgSaveSuccess:
                "Changes saved successfully!",


            /* =================================================
               FORMS
               ================================================= */

            formHeader:
                "Register New Patient",

            formFullName:
                "Full Name",

            formFullNamePlaceholder:
                "Enter full name",

            formDob:
                "Date of Birth",

            formGender:
                "Gender",

            formContact:
                "Phone Number",

            formContactPlaceholder:
                "Enter phone number",

            formEmail:
                "Email Address",

            formEmailPlaceholder:
                "Enter email address",

            formStatus:
                "Status",

            formAddress:
                "Address",

            formAddressPlaceholder:
                "Enter address",

            formMedicalHistory:
                "Medical History",

            formHistoryPlaceholder:
                "Enter medical history",

            formCancel:
                "Cancel",

            formSave:
                "Save",


            "form.header":
                "Register New Patient",

            "form.fullName":
                "Full Name",

            "form.fullNamePlaceholder":
                "Enter full name",

            "form.dob":
                "Date of Birth",

            "form.gender":
                "Gender",

            "form.contact":
                "Phone Number",

            "form.contactPlaceholder":
                "Enter phone number",

            "form.email":
                "Email Address",

            "form.emailPlaceholder":
                "Enter email address",

            "form.status":
                "Status",

            "form.address":
                "Address",

            "form.addressPlaceholder":
                "Enter address",

            "form.medicalHistory":
                "Medical History",

            "form.historyPlaceholder":
                "Enter medical history",

            "form.cancel":
                "Cancel",

            "form.save":
                "Save",


            /* =================================================
               TABLE
               ================================================= */

            "table.filterPlaceholder":
                "Filter items by name, department...",

            "table.pid":
                "ID",

            "table.name":
                "Name",

            "table.ageGender":
                "Age & Gender",

            "table.contact":
                "Contact",

            "table.registered":
                "Registered",

            "table.status":
                "Status",

            "table.actions":
                "Actions",


            /* =================================================
               STATUS
               ================================================= */

            statusActive:
                "Active",

            statusInactive:
                "Inactive",


            /* =================================================
               AUTHENTICATION
               ================================================= */

            loginTitle:
                "Login - MediCore HMS",

            registerTitle:
                "Register - MediCore HMS",

            authWelcomeBack:
                "Welcome back",

            authLoginSub:
                "Enter your credentials to access the hospital management system.",

            authRegisterHeader:
                "Create an Account",

            authRegisterSub:
                "Fill in the details below to register.",

            lblFullName:
                "Full Name",

            lblPassword:
                "Password",

            lblConfirmPassword:
                "Confirm Password",

            lblRoleSelect:
                "Account Role",

            roleAdmin:
                "System Admin",

            roleDoctor:
                "Doctor",

            roleReceptionist:
                "Receptionist",

            btnLoginSubmit:
                "Sign In",

            btnRegisterSubmit:
                "Create Account",

            noAccount:
                "Don't have an account?",

            hasAccount:
                "Already have an account?",

            linkRegister:
                "Sign up",

            linkLogin:
                "Sign in",

            errPasswordMismatch:
                "Passwords do not match",

            errWeakPassword:
                "Password must be at least 8 characters, include uppercase, number, and special character",

            msgLoginSuccess:
                "Login successful!",

            msgRegisterSuccess:
                "Account created successfully! You can now log in."
        }
    },


    /* =========================================================
       TRANSLATION HELPER
       ========================================================= */

    t(key) {

        const dictionary =
            this.translations[this.LANG] ||
            this.translations.ar;

        return dictionary[key] || key;
    },


    /* =========================================================
       APPLY TRANSLATIONS
       ========================================================= */

    applyTranslations(lang = this.LANG) {

        /* حماية من لغة غير موجودة */
        if (!this.translations[lang]) {
            lang = 'ar';
        }


        this.LANG = lang;

        localStorage.setItem(
            'app_lang',
            lang
        );


        /* ---------- HTML direction ---------- */

        document.documentElement.lang =
            lang;

        document.documentElement.dir =
            lang === 'ar'
                ? 'rtl'
                : 'ltr';


        /* ---------- Dictionary ---------- */

        const dictionary =
            this.translations[lang];


        /* ---------- Normal text ---------- */

        document
            .querySelectorAll('[data-i18n]')
            .forEach(element => {

                const key =
                    element.getAttribute(
                        'data-i18n'
                    );

                if (
                    key &&
                    Object.prototype.hasOwnProperty.call(
                        dictionary,
                        key
                    )
                ) {

                    element.textContent =
                        dictionary[key];
                }
            });


        /* ---------- Placeholders ---------- */

        document
            .querySelectorAll(
                '[data-i18n-placeholder]'
            )
            .forEach(element => {

                const key =
                    element.getAttribute(
                        'data-i18n-placeholder'
                    );

                if (
                    key &&
                    Object.prototype.hasOwnProperty.call(
                        dictionary,
                        key
                    )
                ) {

                    element.placeholder =
                        dictionary[key];
                }
            });


        /* ---------- Page title ---------- */

        const titleElement =
            document.querySelector(
                'title[data-i18n]'
            );

        if (titleElement) {

            const titleKey =
                titleElement.getAttribute(
                    'data-i18n'
                );

            if (
                titleKey &&
                Object.prototype.hasOwnProperty.call(
                    dictionary,
                    titleKey
                )
            ) {

                titleElement.textContent =
                    dictionary[titleKey];
            }
        }


        /* ---------- Language button ---------- */

        updateLanguageButton();
    },


    /* =========================================================
       SAFE ELEMENT CREATOR
       ========================================================= */

    createSafeElement(
        tag,
        textContent,
        className = ''
    ) {

        const element =
            document.createElement(tag);


        if (
            textContent !== undefined &&
            textContent !== null
        ) {

            element.textContent =
                textContent;
        }


        if (className) {
            element.className =
                className;
        }


        return element;
    },


    /* =========================================================
       API REQUEST
       ========================================================= */

    async request(
        endpoint,
        options = {}
    ) {

        /* ---------- Authentication ---------- */

        const token =
            localStorage.getItem('auth_token') ||
            localStorage.getItem('token') ||
            localStorage.getItem('authToken') ||
            localStorage.getItem('jwt');


        /* ---------- Headers ---------- */

        const headers = {

            'Content-Type':
                'application/json',

            'Accept':
                'application/json',

            ...(token
                ? {
                    'Authorization':
                        `Bearer ${token}`
                }
                : {}),

            ...options.headers
        };


        /* ---------- Base URL ---------- */

        const baseUrl =
            this.API_BASE_URL
                .replace(/\/+$/, '');


        /* ---------- Endpoint ---------- */

        let cleanEndpoint =
            endpoint.startsWith('/')
                ? endpoint
                : `/${endpoint}`;


        /* =====================================================
           SMART API ROUTING

           لا نغير أي endpoint موجود.
           فقط نضيف /api للمسارات التي كانت مصممة لذلك.
           ===================================================== */

        if (
            (
                cleanEndpoint.startsWith('/invoices') ||
                cleanEndpoint.startsWith('/settings') ||
                cleanEndpoint.startsWith('/medical-records') ||
                cleanEndpoint.startsWith('/records')
            ) &&
            !cleanEndpoint.startsWith('/api')
        ) {

            cleanEndpoint =
                `/api${cleanEndpoint}`;
        }


        /* ---------- Final URL ---------- */

        const url =
            `${baseUrl}${cleanEndpoint}`;


        try {

            const response =
                await fetch(
                    url,
                    {
                        ...options,
                        headers
                    }
                );


            /* ---------- HTTP Error ---------- */

            if (!response.ok) {

                const errText =
                    await response.text();


                let err = {};


                try {

                    err =
                        JSON.parse(errText);

                } catch {

                    err = {
                        message:
                            errText ||
                            'حدث خطأ في النظام'
                    };
                }


                const errorObj =
                    new Error(
                        err.title ||
                        err.message ||
                        `خطأ في الخادم (${response.status})`
                    );


                errorObj.status =
                    response.status;


                console.error(
                    `API Error [${response.status}] at ${url}:`,
                    err
                );


                throw errorObj;
            }


            /* ---------- Empty Response ---------- */

            if (response.status === 204) {
                return null;
            }


            /* ---------- JSON Response ---------- */

            return await response.json();

        } catch (error) {

            console.error(
                `Network or Server Request Failed for: ${url}`,
                error
            );

            throw error;
        }
    }
};


/* =========================================================
   LANGUAGE BUTTON
   ========================================================= */

function updateLanguageButton() {

    const langLabel =
        document.getElementById(
            'currentLangLabel'
        );


    if (!langLabel) {
        return;
    }


    const currentLang =
        CONFIG.LANG ||
        document.documentElement.lang ||
        'ar';


    langLabel.textContent =
        currentLang === 'ar'
            ? 'English'
            : 'العربية';
}


/* =========================================================
   GLOBAL LANGUAGE TOGGLE
   ========================================================= */

function toggleLanguage() {

    const currentLang =
        CONFIG.LANG ||
        document.documentElement.lang ||
        'ar';


    const newLang =
        currentLang === 'ar'
            ? 'en'
            : 'ar';


    CONFIG.applyTranslations(
        newLang
    );


    /*
     * بعض الصفحات مثل appointments.js
     * تحتاج إعادة رسم البيانات بعد تغيير اللغة.
     *
     * إذا كانت الدالة موجودة نستدعيها،
     * وإذا لم تكن موجودة لا يحدث أي خطأ.
     */

    if (
        typeof renderAppointmentsTable ===
        'function' &&
        typeof cacheAppointments !==
        'undefined'
    ) {

        renderAppointmentsTable(
            cacheAppointments
        );
    }


    if (
        typeof renderPatientsTable ===
        'function' &&
        typeof cachePatients !==
        'undefined'
    ) {

        renderPatientsTable(
            cachePatients
        );
    }


    if (
        typeof renderRecords ===
        'function'
    ) {

        try {
            renderRecords();
        } catch (error) {
            console.warn(
                'Unable to refresh medical records after language change:',
                error
            );
        }
    }
}


/* =========================================================
   INITIAL LANGUAGE
   ========================================================= */

function initializeLanguage() {

    const savedLang =
        localStorage.getItem(
            'app_lang'
        ) || 'ar';


    CONFIG.applyTranslations(
        savedLang
    );


    updateLanguageButton();
}


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
    'DOMContentLoaded',
    () => {

        initializeLanguage();

    }
);
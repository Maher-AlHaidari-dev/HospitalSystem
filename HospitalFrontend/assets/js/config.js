const CONFIG = {
    API_BASE_URL: 'https://hospitalsystem-production-80cc.up.railway.app',

    // حالة اللغة الحالية
    LANG: localStorage.getItem('app_lang') || 'ar',

    translations: {
        ar: {
            // الملاحة العامة والصفحات
            appointmentsTitle: "إدارة المواعيد - MediCore HMS",
            patientsTitle: "إدارة المرضى - MediCore HMS",
            invoicesTitle: "الفواتير والمدفوعات - MediCore HMS",
            medicalRecordsTitle: "السجلات الطبية - MediCore HMS",
            dashboardTitle: "لوحة التحكم - MediCore HMS",
            settingsTitle: "الإعدادات - MediCore HMS",
            
            navDashboard: "لوحة التحكم",
            navPatients: "إدارة المرضى",
            navAppointments: "المواعيد",
            navInvoices: "الفواتير والمدفوعات",
            navReports: "التقارير",
            navSettings: "الإعدادات",
            navMedicalRecords: "السجلات الطبية",
            adminRole: "إدارة النظام",
            searchPlaceholder: "البحث عن مريض، موعد، أو طبيب...",
            filterPlaceholder: "تصفية العناصر حسب الاسم، القسم...",
            
            // صفحة المرضى (Patients)
            patientsHeader: "إدارة المرضى",
            patientsSubHeader: "تسجيل، بحث، ومتابعة الملفات الشخصية والتاريخ الطبي للمرضى.",
            btnNewPatient: "مريض جديد",
            thPatientName: "اسم المريض",
            thPhone: "رقم الهاتف",
            thAge: "العمر",
            thGender: "الجنس",
            thBloodGroup: "فصيلة الدم",
            loadingPatients: "جاري تحميل بيانات المرضى...",
            errorFetchPatients: "فشل جلب بيانات المرضى من السيرفر",
            noPatientsFound: "لا توجد ملفات مرضى مسجلة حالياً",
            modalNewPatientTitle: "تسجيل مريض جديد",
            btnSavePatient: "حفظ بيانات المريض",
            genderMale: "ذكر",
            genderFemale: "أنثى",

            // صفحة المواعيد
            appointmentsHeader: "المواعيد والحجوزات",
            appointmentsSubHeader: "جدولة، بحث، وإدارة مواعيد العيادات الخارجية والعمليات بشكل لحظي.",
            thPatient: "المريض",
            thDoctor: "الطبيب",
            thDepartment: "القسم",
            thAppointmentDate: "الموعد",
            thStatus: "الحالة",
            thActions: "إجراءات",
            newAppointmentTitle: "حجز موعد جديد",
            lblPatientName: "اسم المريض",
            lblDoctorName: "الطبيب المعالج",
            lblDepartment: "القسم / العيادة",
            lblAppointmentDate: "تاريخ ووقت الموعد",
            lblNotes: "ملاحظات إضافية",
            btnSubmitAppointment: "تأكيد وحفظ الموعد",
            deptInternal: "العيادة الباطنية",
            deptOrtho: "عيادة العظام",
            deptPediatrics: "عيادة الأطفال",
            deptDental: "عيادة الأسنان",
            loadingAppointments: "جاري تحميل المواعيد...",
            errorFetchAppointments: "فشل جلب المواعيد من السيرفر",
            noAppointmentsFound: "لا توجد مواعيد مسجلة حالياً",
            btnCancelAppointment: "إلغاء",
            statusConfirmed: "مؤكد",
            statusCancelled: "ملغى",
            statusPending: "قيد الانتظار",

            // صفحة لوحة التحكم
            welcomeBack: "مرحباً بعودتك",
            greetingAdmin: "مساء الخير، المدير.",
            greetingSub: "إليك نظرة عامة على ما يحدث في المستشفى اليوم.",
            kpiTotalPatients: "إجمالي المرضى",
            kpiTodaysAppointments: "مواعيد اليوم",
            kpiPendingBills: "الفواتير المعلقة",
            kpiRevenueCollected: "الإيرادات المحصلة",
            kpiRevenueSub: "هذا الشهر",
            chartPatientIntakeTitle: "تسجيل المرضى — آخر 7 أيام",
            chartPatientIntakeSub: "تسجيلات المرضى الجدد يومياً",
            chartDeptTitle: "المواعيد حسب القسم",
            chartDeptSub: "التوزيع عبر التخصصات",

            // صفحة الفواتير والمدفوعات
            invoicesHeader: "الفواتير والمدفوعات",
            invoicesSubHeader: "إنشاء الفواتير، تطبيق الضرائب والخصومات، ومتابعة المدفوعات.",
            btnNewInvoice: "فاتورة جديدة",
            thInvoiceId: "معرف الفاتورة",
            thIssuedDate: "تاريخ الإصدار",
            thDueDate: "تاريخ الاستحقاق",
            thTotalAmount: "الإجمالي",
            thPaidAmount: "المدفوع",
            statusPaid: "مدفوع",
            statusPartial: "جزئي",
            btnRecordPayment: "تسجيل دفعة",
            loadingInvoices: "جاري تحميل الفواتير...",
            errorFetchInvoices: "فشل جلب الفواتير من السيرفر",
            noInvoicesFound: "لا توجد فواتير مسجلة حالياً",

            // صفحة السجلات الطبية
            recordsHeader: "السجلات الطبية",
            recordsSubHeader: "سجلات المرضى المركزية والمؤرخة مع صلاحيات الوصول والتدقيق الشامل.",
            btnNewRecord: "سجل جديد",
            recordsDiagnosis: "التشخيص",
            recordsPrescription: "الوصفة الطبية",
            recordsNotes: "ملاحظات",
            loadingRecords: "جاري تحميل السجلات الطبية...",
            errorFetchRecords: "فشل جلب السجلات الطبية من السيرفر",
            noRecordsFound: "لا توجد سجلات طبية مسجلة حالياً",
            modalNewRecordTitle: "إضافة سجل طبي جديد",
            btnSaveRecord: "حفظ السجل",

            // صفحة الإعدادات
            settingsHeader: "الإعدادات",
            settingsSubHeader: "إدارة الملف الشخصي، التنبيهات، وتفضيلات بيئة العمل.",
            sectionProfile: "الملف الشخصي",
            lblName: "الاسم الكامل",
            lblEmail: "البريد الإلكتروني",
            lblRole: "الدور الوظيفي",
            btnSave: "حفظ التغييرات",
            sectionNotifications: "التنبيهات",
            lblAppointmentReminders: "تذكيرات المواعيد",
            subAppointmentReminders: "إرسال تذكيرات عبر البريد الإلكتروني و SMS للمرضى.",
            msgSaveSuccess: "تم حفظ التغييرات بنجاح!",

            // صفحات الحسابات والأمان
            loginTitle: "تسجيل الدخول - MediCore HMS",
            registerTitle: "إنشاء حساب - MediCore HMS",
            authWelcomeBack: "مرحباً بعودتك",
            authLoginSub: "أدخل بياناتك للوصول إلى نظام إدارة المستشفى.",
            authRegisterHeader: "إنشاء حساب جديد",
            authRegisterSub: "قم بتعبئة البيانات للتسجيل في النظام.",
            lblFullName: "الاسم الكامل",
            lblPassword: "كلمة المرور",
            lblConfirmPassword: "تأكيد كلمة المرور",
            lblRoleSelect: "نوع الحساب",
            roleAdmin: "إدارة النظام (System Admin)",
            roleDoctor: "طبيب (Doctor)",
            roleReceptionist: "موظف استقبال (Receptionist)",
            btnLoginSubmit: "تسجيل الدخول",
            btnRegisterSubmit: "إنشاء الحساب",
            noAccount: "ليس لديك حساب؟",
            hasAccount: "لديك حساب بالفعل؟",
            linkRegister: "إنشاء حساب جديد",
            linkLogin: "تسجيل الدخول",
            errPasswordMismatch: "كلمتا المرور غير متطابقتين",
            errWeakPassword: "كلمة المرور يجب أن تحتوى على 8 خانات على الأقل وتتضمن حرفاً كبيراً ورقماً ورمزاً",
            msgLoginSuccess: "تم تسجيل الدخول بنجاح!",
            msgRegisterSuccess: "تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن."
        },

        en: {
            appointmentsTitle: "Appointments - MediCore HMS",
            patientsTitle: "Patients - MediCore HMS",
            invoicesTitle: "Billing & Payments - MediCore HMS",
            medicalRecordsTitle: "Medical Records - MediCore HMS",
            dashboardTitle: "Dashboard - MediCore HMS",
            settingsTitle: "Settings - MediCore HMS",

            navDashboard: "Dashboard",
            navPatients: "Patients",
            navAppointments: "Appointments",
            navInvoices: "Billing & Payments",
            navReports: "Reports",
            navSettings: "Settings",
            navMedicalRecords: "Medical Records",
            adminRole: "System Admin",
            searchPlaceholder: "Search patient, appointment, or doctor...",
            filterPlaceholder: "Filter items by name, department...",
            
            patientsHeader: "Patient Management",
            patientsSubHeader: "Register, search, and manage patient profiles and medical history.",
            btnNewPatient: "New Patient",
            thPatientName: "Patient Name",
            thPhone: "Phone Number",
            thAge: "Age",
            thGender: "Gender",
            thBloodGroup: "Blood Group",
            loadingPatients: "Loading patients...",
            errorFetchPatients: "Failed to fetch patients from server",
            noPatientsFound: "No patient records found",
            modalNewPatientTitle: "Register New Patient",
            btnSavePatient: "Save Patient",
            genderMale: "Male",
            genderFemale: "Female",

            appointmentsHeader: "Appointments & Bookings",
            appointmentsSubHeader: "Real-time scheduling, search, and management for clinics and operations.",
            thPatient: "Patient",
            thDoctor: "Doctor",
            thDepartment: "Department",
            thAppointmentDate: "Date & Time",
            thStatus: "Status",
            thActions: "Actions",
            newAppointmentTitle: "Book New Appointment",
            lblPatientName: "Patient Name",
            lblDoctorName: "Doctor Name",
            lblDepartment: "Department / Clinic",
            lblAppointmentDate: "Appointment Date & Time",
            lblNotes: "Additional Notes",
            btnSubmitAppointment: "Confirm & Save",
            deptInternal: "Internal Medicine",
            deptOrtho: "Orthopedics",
            deptPediatrics: "Pediatrics",
            deptDental: "Dental Clinic",
            loadingAppointments: "Loading appointments...",
            errorFetchAppointments: "Failed to fetch appointments from server",
            noAppointmentsFound: "No appointments recorded yet",
            btnCancelAppointment: "Cancel",
            statusConfirmed: "Confirmed",
            statusCancelled: "Cancelled",
            statusPending: "Pending",

            welcomeBack: "Welcome back",
            greetingAdmin: "Good evening, Admin.",
            greetingSub: "Here is what is happening across the hospital today.",
            kpiTotalPatients: "TOTAL PATIENTS",
            kpiTodaysAppointments: "TODAY'S APPOINTMENTS",
            kpiPendingBills: "PENDING BILLS",
            kpiRevenueCollected: "REVENUE COLLECTED",
            kpiRevenueSub: "This month",
            chartPatientIntakeTitle: "Patient intake — last 7 days",
            chartPatientIntakeSub: "New patient registrations per day",
            chartDeptTitle: "Appointments by Department",
            chartDeptSub: "Distribution across specialties",

            invoicesHeader: "Billing & Payments",
            invoicesSubHeader: "Generate invoices, apply taxes and discounts, and track payments.",
            btnNewInvoice: "New invoice",
            thInvoiceId: "Invoice ID",
            thIssuedDate: "Issued",
            thDueDate: "Due",
            thTotalAmount: "Total",
            thPaidAmount: "Paid",
            statusPaid: "Paid",
            statusPartial: "Partial",
            btnRecordPayment: "Record payment",
            loadingInvoices: "Loading invoices...",
            errorFetchInvoices: "Failed to fetch invoices from server",
            noInvoicesFound: "No invoices recorded yet",

            recordsHeader: "Medical Records",
            recordsSubHeader: "Centralized, versioned patient records with role-based access and full audit.",
            btnNewRecord: "New record",
            recordsDiagnosis: "DIAGNOSIS",
            recordsPrescription: "PRESCRIPTION",
            recordsNotes: "NOTES",
            loadingRecords: "Loading medical records...",
            errorFetchRecords: "Failed to fetch medical records from server",
            noRecordsFound: "No medical records recorded yet",
            modalNewRecordTitle: "Add New Medical Record",
            btnSaveRecord: "Save Record",

            settingsHeader: "Settings",
            settingsSubHeader: "Manage your profile, notifications, and workspace preferences.",
            sectionProfile: "Profile",
            lblName: "Full Name",
            lblEmail: "Email Address",
            lblRole: "Role",
            btnSave: "Save changes",
            sectionNotifications: "Notifications",
            lblAppointmentReminders: "Appointment reminders",
            subAppointmentReminders: "Send Email + SMS reminders to patients.",
            msgSaveSuccess: "Changes saved successfully!",

            loginTitle: "Login - MediCore HMS",
            registerTitle: "Register - MediCore HMS",
            authWelcomeBack: "Welcome back",
            authLoginSub: "Enter your credentials to access the hospital management system.",
            authRegisterHeader: "Create an Account",
            authRegisterSub: "Fill in the details below to register.",
            lblFullName: "Full Name",
            lblPassword: "Password",
            lblConfirmPassword: "Confirm Password",
            lblRoleSelect: "Account Role",
            roleAdmin: "System Admin",
            roleDoctor: "Doctor",
            roleReceptionist: "Receptionist",
            btnLoginSubmit: "Sign In",
            btnRegisterSubmit: "Create Account",
            noAccount: "Don't have an account?",
            hasAccount: "Already have an account?",
            linkRegister: "Sign up",
            linkLogin: "Sign in",
            errPasswordMismatch: "Passwords do not match",
            errWeakPassword: "Password must be at least 8 characters, include uppercase, number, and special character",
            msgLoginSuccess: "Login successful!",
            msgRegisterSuccess: "Account created successfully! You can now log in."
        }
    },

    t(key) {
        const dictionary = this.translations[this.LANG] || this.translations['ar'];
        return dictionary[key] || key;
    },

    applyTranslations(lang = this.LANG) {
        this.LANG = lang;
        localStorage.setItem('app_lang', lang);

        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;

        const dictionary = this.translations[lang] || this.translations['ar'];
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dictionary[key]) {
                el.textContent = dictionary[key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dictionary[key]) {
                el.placeholder = dictionary[key];
            }
        });
    },

    createSafeElement(tag, textContent, className = '') {
        const element = document.createElement(tag);
        if (textContent !== undefined && textContent !== null) {
            element.textContent = textContent;
        }
        if (className) {
            element.className = className;
        }
        return element;
    },

    async request(endpoint, options = {}) {
        const token = localStorage.getItem('auth_token') || 
                    localStorage.getItem('token') || 
                    localStorage.getItem('authToken') || 
                    localStorage.getItem('jwt');

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers
        };

        const baseUrl = this.API_BASE_URL.replace(/\/+$/, '');
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const url = `${baseUrl}${cleanEndpoint}`;

        try {
            const response = await fetch(url, { ...options, headers });
            
            if (!response.ok) {
                const errText = await response.text();
                let err = {};
                try {
                    err = JSON.parse(errText);
                } catch {
                    err = { message: errText || 'حدث خطأ في النظام' };
                }
                const errorObj = new Error(err.title || err.message || `خطأ في الخادم (${response.status})`);
                errorObj.status = response.status;
                console.error(`API Error [${response.status}] at ${url}:`, err);
                throw errorObj;
            }

            return response.status !== 204 ? await response.json() : null;
        } catch (error) {
            console.error(`Network or Server Request Failed for: ${url}`, error);
            throw error;
        }
    }
};
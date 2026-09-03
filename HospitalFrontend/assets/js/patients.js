"use strict";

/* =========================================================
   MediCore HMS
   PATIENTS PAGE
   Responsive + Mobile Menu + Translation Safe
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------------------------------------------
       1. تجهيز القائمة الجانبية للجوال
       --------------------------------------------------------- */
    ensureMobileMenu();

    /* ---------------------------------------------------------
       2. تحميل قائمة المرضى
       --------------------------------------------------------- */
    loadPatients();

    /* ---------------------------------------------------------
       3. نموذج إضافة مريض
       --------------------------------------------------------- */
    const patientForm = document.getElementById("patientForm");

    if (patientForm) {
        patientForm.addEventListener("submit", handleAddPatient);
    }

    /* ---------------------------------------------------------
       4. أزرار النموذج
       --------------------------------------------------------- */
    const toggleFormBtn = document.getElementById("toggleFormBtn");
    const cancelFormBtn = document.getElementById("cancelFormBtn");

    if (toggleFormBtn) {
        toggleFormBtn.addEventListener("click", toggleFormVisibility);
    }

    if (cancelFormBtn) {
        cancelFormBtn.addEventListener("click", toggleFormVisibility);
    }

    /* ---------------------------------------------------------
       5. البحث
       --------------------------------------------------------- */
    const tableSearchInput = document.getElementById("tableSearchInput");
    const globalSearchInput = document.getElementById("globalSearchInput");

    if (tableSearchInput) {
        tableSearchInput.addEventListener("input", (e) => {
            filterPatients(e.target.value);
        });
    }

    if (globalSearchInput) {
        globalSearchInput.addEventListener("input", (e) => {
            filterPatients(e.target.value);
        });
    }

    /* ---------------------------------------------------------
       6. زر اللغة
       --------------------------------------------------------- */
    setupPatientsLanguageButton();
});


/* =========================================================
   PATIENT CACHE
   ========================================================= */

let allPatientsCache = [];


/* =========================================================
   LANGUAGE
   ========================================================= */

function getCurrentLanguage() {
    return (
        localStorage.getItem("app_lang") ||
        (window.CONFIG && CONFIG.LANG) ||
        "ar"
    );
}


function setupPatientsLanguageButton() {

    const langBtn = document.getElementById("langToggleBtn");

    if (!langBtn) return;

    /*
     * إذا كان config.js يوفر toggleLanguage
     * لا نضيف Listener آخر حتى لا يحدث تبديل مزدوج.
     */
    if (typeof window.toggleLanguage === "function") {

        updatePatientsLanguageButton();

        return;
    }

    /*
     * fallback آمن في حال عدم وجود toggleLanguage
     */
    langBtn.addEventListener("click", togglePatientsLanguage);

    updatePatientsLanguageButton();
}


function togglePatientsLanguage() {

    const currentLang = getCurrentLanguage();
    const newLang = currentLang === "ar" ? "en" : "ar";

    localStorage.setItem("app_lang", newLang);

    if (window.CONFIG) {
        CONFIG.LANG = newLang;

        if (typeof CONFIG.applyTranslations === "function") {
            CONFIG.applyTranslations(newLang);
        }
    }

    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";

    updatePatientsLanguageButton();

    renderPatientsTable(allPatientsCache);
}


function updatePatientsLanguageButton() {

    const btn = document.getElementById("langToggleBtn");

    if (!btn) return;

    btn.textContent = getCurrentLanguage() === "ar"
        ? "EN"
        : "عربي";
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function ensureMobileMenu() {

    /*
     * إذا كانت الصفحة تحتوي بالفعل على القائمة
     * لا ننشئ نسخة ثانية.
     */
    let menu = document.getElementById("mobileMenu");
    let overlay = document.getElementById("mobileMenuOverlay");
    let button = document.getElementById("mobileMenuButton");

    const responsiveHeader =
        document.querySelector(".responsive-header");

    if (!responsiveHeader) return;


    /* ---------------------------------------------------------
       زر الثلاث نقاط / القائمة
       --------------------------------------------------------- */

    if (!button) {

        let headerTop =
            responsiveHeader.querySelector(".mobile-header-top");

        if (!headerTop) {

            headerTop = document.createElement("div");
            headerTop.className = "mobile-header-top hidden";

            responsiveHeader.insertBefore(
                headerTop,
                responsiveHeader.firstChild
            );
        }

        button = document.createElement("button");

        button.id = "mobileMenuButton";
        button.type = "button";
        button.className = "mobile-menu-button";
        button.setAttribute("aria-label", "Open menu");
        button.setAttribute("aria-controls", "mobileMenu");
        button.setAttribute("aria-expanded", "false");

        button.innerHTML =
            '<i class="fa-solid fa-bars" aria-hidden="true"></i>';

        button.addEventListener("click", () => {

            if (typeof window.toggleMobileMenu === "function") {
                window.toggleMobileMenu();
            } else {

                const currentMenu =
                    document.getElementById("mobileMenu");

                const currentOverlay =
                    document.getElementById("mobileMenuOverlay");

                if (!currentMenu || !currentOverlay) return;

                currentMenu.classList.toggle("active");
                currentOverlay.classList.toggle("active");

                const isActive =
                    currentMenu.classList.contains("active");

                button.setAttribute(
                    "aria-expanded",
                    String(isActive)
                );

                document.body.style.overflow =
                    isActive ? "hidden" : "";
            }
        });

        headerTop.appendChild(button);
    }


    /* ---------------------------------------------------------
       Overlay
       --------------------------------------------------------- */

    if (!overlay) {

        overlay = document.createElement("div");

        overlay.id = "mobileMenuOverlay";
        overlay.className = "mobile-menu-overlay";

        overlay.addEventListener("click", () => {

            if (typeof window.closeMobileMenu === "function") {
                window.closeMobileMenu();
            } else {

                overlay.classList.remove("active");

                if (menu) {
                    menu.classList.remove("active");
                }

                document.body.style.overflow = "";
            }
        });

        document.body.appendChild(overlay);
    }


    /* ---------------------------------------------------------
       Mobile Drawer
       --------------------------------------------------------- */

    if (!menu) {

        menu = document.createElement("aside");

        menu.id = "mobileMenu";
        menu.className = "mobile-menu";
        menu.setAttribute("aria-hidden", "true");

        const currentPage =
            window.location.pathname.split("/").pop() ||
            "patients.html";

        const links = [
            ["dashboard.html", "fa-gauge-high", "لوحة التحكم", "Dashboard"],
            ["patients.html", "fa-user-injured", "المرضى", "Patients"],
            ["appointments.html", "fa-calendar-check", "المواعيد", "Appointments"],
            ["medical-records.html", "fa-file-medical", "السجلات الطبية", "Medical Records"],
            ["invoices.html", "fa-file-invoice-dollar", "الفواتير", "Invoices"],
            ["reports.html", "fa-chart-column", "التقارير", "Reports"],
            ["settings.html", "fa-gear", "الإعدادات", "Settings"]
        ];

        menu.innerHTML = `
            <div class="mobile-menu-header">
                <div class="mobile-menu-brand">
                    <div class="mobile-menu-brand-icon">
                        <i class="fa-solid fa-heart-pulse"></i>
                    </div>
                    <span>MediCore HMS</span>
                </div>

                <button
                    type="button"
                    class="mobile-menu-close"
                    aria-label="Close menu"
                    onclick="closeMobileMenu()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <nav aria-label="Mobile navigation">
                ${links.map(link => {

                    const isActive =
                        currentPage === link[0];

                    return `
                        <a
                            href="${link[0]}"
                            class="${isActive ? "active" : ""}">
                            <i class="fa-solid ${link[1]}"></i>
                            <span data-mobile-ar="${link[2]}"
                                  data-mobile-en="${link[3]}">
                                ${getCurrentLanguage() === "ar"
                                    ? link[2]
                                    : link[3]}
                            </span>
                        </a>
                    `;
                }).join("")}
            </nav>

            <div class="mobile-menu-user">
                <div class="mobile-menu-user-avatar">
                    <i class="fa-solid fa-user"></i>
                </div>

                <div class="mobile-menu-user-info">
                    <strong>MediCore HMS</strong>
                    <span>Administrator</span>
                </div>
            </div>
        `;

        document.body.appendChild(menu);
    }
}


/* =========================================================
   FORM VISIBILITY
   ========================================================= */

function toggleFormVisibility() {

    const card = document.getElementById("patientFormCard");
    const btnText = document.getElementById("toggleBtnText");

    if (!card) return;

    const isLangAr =
        getCurrentLanguage() === "ar";

    const isHidden =
        card.classList.contains("hidden");

    if (isHidden) {

        card.classList.remove("hidden");

        if (btnText) {
            btnText.textContent =
                isLangAr
                    ? "إغلاق النموذج"
                    : "Hide Form";
        }

    } else {

        card.classList.add("hidden");

        if (btnText) {
            btnText.textContent =
                isLangAr
                    ? "تسجيل مريض جديد"
                    : "Register New Patient";
        }
    }
}


/* =========================================================
   LOAD PATIENTS
   ========================================================= */

async function loadPatients() {

    const tableBody =
        document.getElementById("patientsTableBody");

    if (!tableBody) return;

    const isLangAr =
        getCurrentLanguage() === "ar";

    tableBody.replaceChildren();

    const loadingRow =
        document.createElement("tr");

    const loadingText =
        isLangAr
            ? "جاري تحميل قائمة المرضى..."
            : "Loading patients list...";

    const loadingTd =
        CONFIG.createSafeElement(
            "td",
            loadingText,
            "py-8 text-center text-slate-400 font-medium"
        );

    loadingTd.colSpan = 7;

    loadingRow.appendChild(loadingTd);
    tableBody.appendChild(loadingRow);


    try {

        const patients =
            await CONFIG.request("/api/Patients");

        allPatientsCache =
            Array.isArray(patients)
                ? patients
                : (patients ? [patients] : []);

        renderPatientsTable(allPatientsCache);

    } catch (error) {

        console.error(
            "Error loading patients:",
            error
        );

        tableBody.replaceChildren();

        const errorRow =
            document.createElement("tr");

        const errorText =
            isLangAr
                ? "فشل جلب بيانات المرضى من السيرفر"
                : "Failed to fetch patients from server";

        const errorTd =
            CONFIG.createSafeElement(
                "td",
                errorText,
                "py-8 text-center text-rose-500 font-bold"
            );

        errorTd.colSpan = 7;

        errorRow.appendChild(errorTd);
        tableBody.appendChild(errorRow);
    }
}


/* =========================================================
   RENDER PATIENTS
   ========================================================= */

function renderPatientsTable(patients) {

    const tableBody =
        document.getElementById("patientsTableBody");

    if (!tableBody) return;

    const isLangAr =
        getCurrentLanguage() === "ar";

    tableBody.replaceChildren();

    if (
        !patients ||
        !Array.isArray(patients) ||
        patients.length === 0
    ) {

        const emptyRow =
            document.createElement("tr");

        const emptyText =
            isLangAr
                ? "لا يوجد مرضى مسجلون في النظام حالياً"
                : "No patients registered in the system currently";

        const emptyTd =
            CONFIG.createSafeElement(
                "td",
                emptyText,
                "py-8 text-center text-slate-400 font-medium"
            );

        emptyTd.colSpan = 7;

        emptyRow.appendChild(emptyTd);
        tableBody.appendChild(emptyRow);

        return;
    }

    patients.forEach(patient => {

        const row =
            createPatientRow(patient);

        tableBody.appendChild(row);
    });
}


/* =========================================================
   CREATE PATIENT ROW
   ========================================================= */

function createPatientRow(patient) {

    const tr =
        document.createElement("tr");

    tr.className =
        "hover:bg-slate-50/80 transition duration-150";

    const isLangAr =
        getCurrentLanguage() === "ar";


    const pidText =
        generatePatientID(
            patient.id,
            patient.createdAt
        );

    tr.appendChild(
        CONFIG.createSafeElement(
            "td",
            pidText,
            "py-3.5 px-3 font-mono text-[11px] text-slate-500 font-semibold"
        )
    );


    const defaultName =
        isLangAr
            ? "بدون اسم"
            : "Unnamed";

    tr.appendChild(
        CONFIG.createSafeElement(
            "td",
            patient.name || defaultName,
            "py-3.5 px-3 font-bold text-slate-900"
        )
    );


    let genderLabel =
        isLangAr
            ? "ذكر"
            : "Male";

    if (
        patient.gender === "أنثى" ||
        patient.gender === "Female"
    ) {
        genderLabel =
            isLangAr
                ? "أنثى"
                : "Female";
    }


    const ageGenderText =
        `${patient.age || 0} · ${genderLabel}`;

    tr.appendChild(
        CONFIG.createSafeElement(
            "td",
            ageGenderText,
            "py-3.5 px-3 text-slate-600"
        )
    );


    tr.appendChild(
        CONFIG.createSafeElement(
            "td",
            patient.phoneNumber || "-",
            "py-3.5 px-3 font-mono text-[11px] text-slate-600"
        )
    );


    const locale =
        isLangAr
            ? "ar-EG"
            : "en-US";

    const regDate =
        patient.createdAt
            ? new Date(patient.createdAt)
                .toLocaleDateString(
                    locale,
                    {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    }
                )
            : "-";

    tr.appendChild(
        CONFIG.createSafeElement(
            "td",
            regDate,
            "py-3.5 px-3 text-slate-500 text-[11px]"
        )
    );


    const statusTd =
        document.createElement("td");

    statusTd.className =
        "py-3.5 px-3";

    const isInactive =
        patient.status === "غير نشط" ||
        patient.status === "Inactive";


    const badgeClass =
        isInactive
            ? "bg-slate-100 text-slate-600 border border-slate-200"
            : "bg-emerald-50 text-emerald-600 border border-emerald-200/60";


    const badgeText =
        isInactive
            ? (isLangAr ? "غير نشط" : "Inactive")
            : (isLangAr ? "نشط" : "Active");


    statusTd.appendChild(
        CONFIG.createSafeElement(
            "span",
            badgeText,
            `inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeClass}`
        )
    );

    tr.appendChild(statusTd);


    const actionsTd =
        document.createElement("td");

    actionsTd.className =
        "py-3.5 px-3 text-center";


    const deleteBtn =
        CONFIG.createSafeElement(
            "button",
            isLangAr ? "حذف" : "Delete",
            "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer"
        );

    deleteBtn.addEventListener(
        "click",
        () => deletePatient(patient.id)
    );

    actionsTd.appendChild(deleteBtn);
    tr.appendChild(actionsTd);

    return tr;
}


/* =========================================================
   PATIENT ID
   ========================================================= */

function generatePatientID(id, createdAtStr) {

    const dateObj =
        createdAtStr
            ? new Date(createdAtStr)
            : new Date();

    const yyyy =
        dateObj.getFullYear();

    const mm =
        String(dateObj.getMonth() + 1)
            .padStart(2, "0");

    const dd =
        String(dateObj.getDate())
            .padStart(2, "0");

    const paddedId =
        String(id)
            .padStart(4, "0");

    return `PID-${yyyy}${mm}${dd}-${paddedId}`;
}


/* =========================================================
   ADD PATIENT
   ========================================================= */

async function handleAddPatient(e) {

    e.preventDefault();

    const fullName =
        document.getElementById("fullName").value.trim();

    const dateOfBirth =
        document.getElementById("dateOfBirth").value;

    const gender =
        document.getElementById("gender").value;

    const contactNumber =
        document.getElementById("contactNumber").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const status =
        document.getElementById("status").value;

    const address =
        document.getElementById("address").value.trim();

    const medicalHistory =
        document.getElementById("medicalHistory").value.trim();


    let age = 0;

    if (dateOfBirth) {

        const birthDate =
            new Date(dateOfBirth);

        const today =
            new Date();

        age =
            today.getFullYear() -
            birthDate.getFullYear();

        const m =
            today.getMonth() -
            birthDate.getMonth();

        if (
            m < 0 ||
            (
                m === 0 &&
                today.getDate() <
                birthDate.getDate()
            )
        ) {
            age--;
        }

        if (age < 0) {
            age = 0;
        }
    }


    const payload = {

        name: fullName,

        dateOfBirth:
            dateOfBirth
                ? dateOfBirth
                : null,

        age: age,

        gender: gender,

        phoneNumber:
            contactNumber,

        email:
            email || null,

        status: status,

        address:
            address || null,

        medicalHistory:
            medicalHistory || null
    };


    try {

        await CONFIG.request(
            "/api/Patients",
            {
                method: "POST",
                body: JSON.stringify(payload)
            }
        );

        document
            .getElementById("patientForm")
            .reset();

        toggleFormVisibility();

        await loadPatients();

    } catch (error) {

        const isLangAr =
            getCurrentLanguage() === "ar";

        const msg =
            isLangAr
                ? "فشل تسجيل المريض: " +
                  (
                      error.message ||
                      "حدث خطأ أثناء التواصل مع السيرفر"
                  )
                : "Failed to register patient: " +
                  (
                      error.message ||
                      "An error occurred while connecting to the server"
                  );

        alert(msg);
    }
}


/* =========================================================
   DELETE PATIENT
   ========================================================= */

async function deletePatient(id) {

    const isLangAr =
        getCurrentLanguage() === "ar";

    const confirmMsg =
        isLangAr
            ? "هل أنت متأكد من إلغاء وحذف سجل هذا المريض نهائياً؟"
            : "Are you sure you want to permanently delete this patient record?";


    if (!confirm(confirmMsg)) {
        return;
    }


    try {

        await CONFIG.request(
            `/api/Patients/${id}`,
            {
                method: "DELETE"
            }
        );

        await loadPatients();

    } catch (error) {

        const failMsg =
            isLangAr
                ? (
                    error.message ||
                    "فشل عملية الحذف"
                )
                : (
                    error.message ||
                    "Delete operation failed"
                );

        alert(failMsg);
    }
}


/* =========================================================
   FILTER
   ========================================================= */

function filterPatients(queryText) {

    const query =
        (queryText || "")
            .toLowerCase()
            .trim();


    if (!query) {

        renderPatientsTable(
            allPatientsCache
        );

        return;
    }


    const filtered =
        allPatientsCache.filter(p => {

            const pid =
                generatePatientID(
                    p.id,
                    p.createdAt
                ).toLowerCase();

            const name =
                (p.name || "").toLowerCase();

            const phone =
                (p.phoneNumber || "").toLowerCase();

            const email =
                (p.email || "").toLowerCase();


            return (
                name.includes(query) ||
                phone.includes(query) ||
                pid.includes(query) ||
                email.includes(query)
            );
        });


    renderPatientsTable(filtered);
}
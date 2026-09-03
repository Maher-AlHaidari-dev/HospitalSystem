"use strict";

/* =========================================================
   MediCore HMS
   DASHBOARD
   Statistics + Charts + User Profile
   ========================================================= */

let patientIntakeChartInstance = null;
let deptChartInstance = null;


/* =========================================================
   LANGUAGE
   ========================================================= */

function getCurrentLanguage() {
    return (
        (typeof CONFIG !== "undefined" && CONFIG.LANG) ||
        localStorage.getItem("app_lang") ||
        "ar"
    );
}


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    /*
     * config.js already initializes the language.
     * We only make sure the dashboard is synchronized.
     */

    const currentLang = getCurrentLanguage();

    if (
        typeof CONFIG !== "undefined" &&
        typeof CONFIG.applyTranslations === "function"
    ) {
        CONFIG.applyTranslations(currentLang);
    }

    updateDashboardLanguage();

    loadAdminProfileInfo();

    await loadDashboardStats();

});


/* =========================================================
   DASHBOARD LANGUAGE SYNC
   ========================================================= */

function updateDashboardLanguage() {

    const lang = getCurrentLanguage();

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    const langButton =
        document.getElementById("langToggleBtn");

    if (langButton) {
        langButton.textContent =
            lang === "ar"
                ? "EN"
                : "عربي";
    }

}


/* =========================================================
   ADMIN PROFILE
   ========================================================= */

function loadAdminProfileInfo() {

    const userInfoString =
        localStorage.getItem("user_info");

    if (!userInfoString) {

        /*
         * لا نحول المستخدم تلقائياً إذا كانت الصفحة
         * فتحت قبل اكتمال بيانات الجلسة.
         */

        return;
    }

    try {

        const user =
            JSON.parse(userInfoString);

        const emailEl =
            document.getElementById("adminEmail");

        if (emailEl && user.email) {
            emailEl.textContent =
                user.email;
        }


        const greetingEl =
            document.getElementById("adminGreetingTitle");

        if (
            greetingEl &&
            user.fullName
        ) {

            const lang =
                getCurrentLanguage();

            greetingEl.textContent =
                lang === "ar"
                    ? `مرحباً، ${user.fullName}.`
                    : `Welcome, ${user.fullName}.`;
        }


        const mobileAdminName =
            document.getElementById("mobileAdminName");

        if (
            mobileAdminName &&
            user.fullName
        ) {

            mobileAdminName.textContent =
                user.fullName;
        }

    } catch (error) {

        console.error(
            "Failed to parse user info from localStorage:",
            error
        );

    }

}


/* =========================================================
   GLOBAL LANGUAGE TOGGLE COMPATIBILITY
   =========================================================
   config.js owns the actual toggleLanguage() function.
   This helper only refreshes dashboard-specific content.
   ========================================================= */

window.refreshDashboardLanguage = function () {

    updateDashboardLanguage();

    loadAdminProfileInfo();

    loadDashboardStats();

};


/* =========================================================
   DASHBOARD STATISTICS
   ========================================================= */

async function loadDashboardStats() {

    let stats = null;

    try {

        if (
            typeof CONFIG !== "undefined" &&
            typeof CONFIG.request === "function"
        ) {

            /*
             * Keep the existing backend endpoint.
             */

            stats =
                await CONFIG.request(
                    "api/dashboard/stats"
                );
        }

    } catch (error) {

        console.warn(
            "Dashboard API request failed. Using fallback values:",
            error
        );

    }


    const lang =
        getCurrentLanguage();

    /*
     * Fallback values are kept exactly as the previous
     * dashboard behavior to avoid an empty dashboard
     * when the API is temporarily unavailable.
     */

    const totalPatients =
        (
            stats &&
            stats.totalPatients !== undefined &&
            stats.totalPatients > 0
        )
            ? stats.totalPatients
            : 248;


    const todaysAppointments =
        (
            stats &&
            stats.todaysAppointments !== undefined
        )
            ? stats.todaysAppointments
            : 14;


    const pendingBillsCount =
        (
            stats &&
            stats.pendingBillsCount !== undefined
        )
            ? stats.pendingBillsCount
            : 5;


    const totalRevenue =
        (
            stats &&
            stats.totalRevenue !== undefined &&
            stats.totalRevenue > 0
        )
            ? stats.totalRevenue
            : 12850.00;


    const pendingAmount =
        (
            stats &&
            stats.pendingAmount !== undefined &&
            stats.pendingAmount > 0
        )
            ? stats.pendingAmount
            : 1390.00;


    /* =====================================================
       UPDATE KPI VALUES
       ===================================================== */

    const totalPatientsEl =
        document.getElementById(
            "kpiTotalPatientsVal"
        );

    if (totalPatientsEl) {
        totalPatientsEl.textContent =
            totalPatients;
    }


    const appointmentsEl =
        document.getElementById(
            "kpiTodaysAppointmentsVal"
        );

    if (appointmentsEl) {
        appointmentsEl.textContent =
            todaysAppointments;
    }


    const pendingBillsEl =
        document.getElementById(
            "kpiPendingBillsVal"
        );

    if (pendingBillsEl) {
        pendingBillsEl.textContent =
            pendingBillsCount;
    }


    const revenueEl =
        document.getElementById(
            "kpiRevenueCollectedVal"
        );

    if (revenueEl) {

        revenueEl.textContent =
            `$${Number(totalRevenue).toFixed(2)}`;

    }


    /* =====================================================
       KPI SUBTEXT
       ===================================================== */

    const patientGrowthEl =
        document.getElementById(
            "kpiTotalPatientsSub"
        );

    if (patientGrowthEl) {

        patientGrowthEl.textContent =
            (
                stats &&
                stats.patientGrowth
            )
                ? stats.patientGrowth
                : (
                    lang === "ar"
                        ? "+12% مقارنة بالشهر الماضي"
                        : "+12% compared to last month"
                );

    }


    const scheduledEl =
        document.getElementById(
            "kpiTodaysAppointmentsSub"
        );

    if (scheduledEl) {

        const scheduled =
            (
                stats &&
                stats.totalScheduled
            )
                ? stats.totalScheduled
                : 18;

        scheduledEl.textContent =
            `${scheduled} ${
                lang === "ar"
                    ? "إجمالي المجدول"
                    : "total scheduled"
            }`;

    }


    const pendingAmountEl =
        document.getElementById(
            "kpiPendingBillsSub"
        );

    if (pendingAmountEl) {

        pendingAmountEl.textContent =
            `$${Number(pendingAmount).toFixed(2)} ${
                lang === "ar"
                    ? "المتبقي"
                    : "outstanding"
            }`;

    }


    /* =====================================================
       PATIENT INTAKE CHART
       ===================================================== */

    const patientIntakeData =
        (
            stats &&
            stats.patientIntakeData
        )
            ? stats.patientIntakeData
            : {
                labels: [
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun",
                    "Mon"
                ],
                counts: [
                    3,
                    5,
                    4,
                    7,
                    6,
                    8,
                    5
                ]
            };


    renderPatientIntakeChart(
        patientIntakeData
    );


    /* =====================================================
       DEPARTMENT CHART
       ===================================================== */

    const departmentData =
        (
            stats &&
            stats.appointmentsByDept
        )
            ? stats.appointmentsByDept
            : [

                {
                    department:
                        lang === "ar"
                            ? "العيادة الباطنية"
                            : "Internal Clinic",
                    count: 8
                },

                {
                    department:
                        lang === "ar"
                            ? "عيادة العظام"
                            : "Orthopedic Clinic",
                    count: 6
                },

                {
                    department:
                        lang === "ar"
                            ? "عيادة الأطفال"
                            : "Pediatric Clinic",
                    count: 4
                }

            ];


    renderDeptChart(
        departmentData
    );

}


/* =========================================================
   PATIENT INTAKE CHART
   ========================================================= */

function renderPatientIntakeChart(data) {

    const canvasEl =
        document.getElementById(
            "patientIntakeChart"
        );

    if (!canvasEl) {
        return;
    }


    if (
        typeof Chart === "undefined"
    ) {

        console.warn(
            "Chart.js is not loaded."
        );

        return;
    }


    const ctx =
        canvasEl.getContext("2d");


    if (
        patientIntakeChartInstance
    ) {

        patientIntakeChartInstance.destroy();

        patientIntakeChartInstance =
            null;
    }


    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            250
        );

    gradient.addColorStop(
        0,
        "rgba(0, 168, 150, 0.25)"
    );

    gradient.addColorStop(
        1,
        "rgba(0, 168, 150, 0)"
    );


    patientIntakeChartInstance =
        new Chart(
            ctx,
            {
                type: "line",

                data: {

                    labels:
                        Array.isArray(data?.labels)
                            ? data.labels
                            : [],

                    datasets: [

                        {

                            data:
                                Array.isArray(data?.counts)
                                    ? data.counts
                                    : [],

                            borderColor:
                                "#00A896",

                            borderWidth:
                                2.5,

                            fill:
                                true,

                            backgroundColor:
                                gradient,

                            tension:
                                0.4,

                            pointRadius:
                                3,

                            pointBackgroundColor:
                                "#00A896",

                            pointHoverRadius:
                                6

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {
                            display: false
                        }

                    },

                    scales: {

                        x: {

                            grid: {
                                display: false
                            }

                        },

                        y: {

                            min: 0,

                            max: 10,

                            ticks: {
                                stepSize: 2
                            }

                        }

                    }

                }

            }
        );

}


/* =========================================================
   DEPARTMENT CHART
   ========================================================= */

function renderDeptChart(
    deptData
) {

    const canvasEl =
        document.getElementById(
            "deptChart"
        );

    if (!canvasEl) {
        return;
    }


    if (
        typeof Chart === "undefined"
    ) {
        return;
    }


    const ctx =
        canvasEl.getContext("2d");


    if (
        deptChartInstance
    ) {

        deptChartInstance.destroy();

        deptChartInstance =
            null;
    }


    const safeData =
        Array.isArray(deptData)
            ? deptData
            : [];


    const labels =
        safeData.map(
            item =>
                item?.department || ""
        );


    const counts =
        safeData.map(
            item =>
                Number(item?.count || 0)
        );


    deptChartInstance =
        new Chart(
            ctx,
            {

                type: "bar",

                data: {

                    labels,

                    datasets: [

                        {

                            data: counts,

                            backgroundColor:
                                "#00A896",

                            borderRadius:
                                6,

                            barThickness:
                                22

                        }

                    ]

                },

                options: {

                    indexAxis:
                        "y",

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {
                            display: false
                        }

                    },

                    scales: {

                        x: {
                            display: false
                        },

                        y: {

                            grid: {
                                display: false
                            }

                        }

                    }

                }

            }
        );

}
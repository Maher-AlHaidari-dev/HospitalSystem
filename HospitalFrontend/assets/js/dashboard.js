let currentLang = localStorage.getItem('appLang') || 'ar';
let patientIntakeChartInstance = null;
let deptChartInstance = null;

// التحميل الأولي للوحة التحكم وعرض بيانات المستخدم المسجل
document.addEventListener('DOMContentLoaded', async () => {
    updateLayoutDirection(currentLang);
    
    if (typeof CONFIG !== 'undefined' && CONFIG.applyTranslations) {
        CONFIG.applyTranslations(currentLang);
    }

    // جلب وعرض بيانات الأدمن الحالي من التخزين المحلي
    loadAdminProfileInfo();

    // جلب إحصائيات لوحة التحكم من السيرفر
    await loadDashboardStats();
});

// وظيفة لجلب بيانات الأدمن وعرضها في الـ Header والترحيب
function loadAdminProfileInfo() {
    const userInfoString = localStorage.getItem('user_info');
    
    if (userInfoString) {
        try {
            const user = JSON.parse(userInfoString);
            
            // تحديث البريد الإلكتروني في الهيدر
            const emailEl = document.getElementById('adminEmail');
            if (emailEl && user.email) {
                emailEl.textContent = user.email;
            }

            // تحديث اسم المستخدم في عنوان الترحيب إن وجد الاسم
            const greetingEl = document.getElementById('adminGreetingTitle');
            if (greetingEl && user.fullName) {
                greetingEl.textContent = currentLang === 'ar' ? `مرحباً، ${user.fullName}.` : `Welcome, ${user.fullName}.`;
            }
        } catch (e) {
            console.error('Failed to parse user info from localStorage', e);
        }
    } else {
        // في حال لم يتم تسجيل الدخول، يتم تحويله لصفحة الدخول حمايةً للنظام
        window.location.href = 'login.html';
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('appLang', currentLang);
    updateLayoutDirection(currentLang);
    
    if (typeof CONFIG !== 'undefined' && CONFIG.applyTranslations) {
        CONFIG.applyTranslations(currentLang);
    }
    
    // إعادة تحديث اسم الأدمن للغة الجديدة إذا لزم الأمر
    loadAdminProfileInfo();
    loadDashboardStats();
}

function updateLayoutDirection(lang) {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) langBtn.textContent = lang === 'ar' ? 'EN' : 'عربي';
}

async function loadDashboardStats() {
    try {
        const stats = await CONFIG.request('api/dashboard/stats');
        
        if (stats) {
            document.getElementById('kpiTotalPatientsVal').textContent = stats.totalPatients;
            document.getElementById('kpiTodaysAppointmentsVal').textContent = stats.todaysAppointments;
            document.getElementById('kpiPendingBillsVal').textContent = stats.pendingBillsCount;
            document.getElementById('kpiRevenueCollectedVal').textContent = `$${stats.totalRevenue.toFixed(2)}`;

            document.getElementById('kpiTotalPatientsSub').textContent = stats.patientGrowth;
            document.getElementById('kpiTodaysAppointmentsSub').textContent = `${stats.totalScheduled} ${currentLang === 'ar' ? 'إجمالي المجدول' : 'total scheduled'}`;
            document.getElementById('kpiPendingBillsSub').textContent = `$${stats.pendingAmount.toFixed(2)} ${currentLang === 'ar' ? 'المتبقي' : 'outstanding'}`;

            renderPatientIntakeChart(stats.patientIntakeData);
            renderDeptChart(stats.appointmentsByDept);
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

function renderPatientIntakeChart(data) {
    const ctx = document.getElementById('patientIntakeChart').getContext('2d');
    
    if (patientIntakeChartInstance) {
        patientIntakeChartInstance.destroy();
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(0, 168, 150, 0.25)');
    gradient.addColorStop(1, 'rgba(0, 168, 150, 0.0)');

    patientIntakeChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.counts,
                borderColor: '#00A896',
                borderWidth: 2.5,
                fill: true,
                backgroundColor: gradient,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#00A896',
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false } },
                y: { min: 0, max: 8, ticks: { stepSize: 2 } }
            }
        }
    });
}

function renderDeptChart(deptData) {
    const ctx = document.getElementById('deptChart').getContext('2d');

    if (deptChartInstance) {
        deptChartInstance.destroy();
    }

    const labels = deptData.map(d => d.department);
    const counts = deptData.map(d => d.count);

    deptChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: '#00A896',
                borderRadius: 6,
                barThickness: 22
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: { grid: { display: false } }
            }
        }
    });
}
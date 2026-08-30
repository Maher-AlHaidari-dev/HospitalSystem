document.addEventListener('DOMContentLoaded', () => {
    loadAppointments();

    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAddAppointment);
    }

    const tableSearchInput = document.getElementById('tableSearchInput');
    if (tableSearchInput) {
        tableSearchInput.addEventListener('input', (e) => filterAppointments(e.target.value));
    }

    const globalSearchInput = document.getElementById('globalSearchInput');
    if (globalSearchInput) {
        globalSearchInput.addEventListener('input', (e) => {
            if (tableSearchInput) tableSearchInput.value = e.target.value;
            filterAppointments(e.target.value);
        });
    }

    const langToggleBtn = document.getElementById('langToggleBtn');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', toggleLanguage);
    }
});

let cacheAppointments = [];

// دالة مساعد لجلب توكن المصادقة من الـ LocalStorage
function getAuthHeaders(additionalHeaders = {}) {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('jwt');
    const headers = { ...additionalHeaders };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

// دالة للتعامل مع أخطاء المصادقة
function handleAuthError(error) {
    if (error && (error.status === 401 || error.message?.includes('401') || error.message?.includes('Unauthorized'))) {
        alert('انتهت صلاحية الجلسة أو لم يتم تسجيل الدخول، يرجى تسجيل الدخول من جديد.');
        window.location.href = 'login.html'; // أو صفحة الدخول الخاصة بك
    }
}

async function loadAppointments() {
    const tbody = document.getElementById('appointmentsTableBody');
    if (!tbody) return;

    const currentLang = document.documentElement.lang || 'ar';
    const dict = CONFIG.translations[currentLang] || CONFIG.translations['ar'];

    tbody.replaceChildren();
    const trLoading = document.createElement('tr');
    const tdLoading = CONFIG.createSafeElement('td', dict.loadingAppointments, 'py-8 text-center text-slate-400 font-medium');
    tdLoading.setAttribute('data-i18n', 'loadingAppointments');
    tdLoading.colSpan = 7;
    trLoading.appendChild(tdLoading);
    tbody.appendChild(trLoading);

    try {
        const appointments = await CONFIG.request('/Appointments', {
            headers: getAuthHeaders()
        });
        cacheAppointments = appointments || [];
        renderAppointmentsTable(cacheAppointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        handleAuthError(error);
        
        tbody.replaceChildren();
        const trError = document.createElement('tr');
        const tdError = CONFIG.createSafeElement('td', dict.errorFetchAppointments, 'py-8 text-center text-rose-500 font-bold');
        tdError.setAttribute('data-i18n', 'errorFetchAppointments');
        tdError.colSpan = 7;
        trError.appendChild(tdError);
        tbody.appendChild(trError);
    }
}

function renderAppointmentsTable(appointments) {
    const tbody = document.getElementById('appointmentsTableBody');
    if (!tbody) return;

    const currentLang = document.documentElement.lang || 'ar';
    const dict = CONFIG.translations[currentLang] || CONFIG.translations['ar'];

    tbody.replaceChildren();

    if (!appointments || appointments.length === 0) {
        const trEmpty = document.createElement('tr');
        const tdEmpty = CONFIG.createSafeElement('td', dict.noAppointmentsFound, 'py-8 text-center text-slate-400 font-medium');
        tdEmpty.setAttribute('data-i18n', 'noAppointmentsFound');
        tdEmpty.colSpan = 7;
        trEmpty.appendChild(tdEmpty);
        tbody.appendChild(trEmpty);
        return;
    }

    appointments.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50/80 transition duration-150';

        tr.appendChild(CONFIG.createSafeElement('td', (index + 1).toString(), 'py-3.5 px-3 font-mono text-[11px] text-slate-500'));
        tr.appendChild(CONFIG.createSafeElement('td', item.patientName, 'py-3.5 px-3 font-bold text-slate-900'));
        tr.appendChild(CONFIG.createSafeElement('td', item.doctorName, 'py-3.5 px-3 text-slate-700'));
        tr.appendChild(CONFIG.createSafeElement('td', item.department, 'py-3.5 px-3 text-slate-600'));
        
        const locale = currentLang === 'en' ? 'en-US' : 'ar-YE';
        const appDate = item.appointmentDate ? new Date(item.appointmentDate).toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' }) : '-';
        tr.appendChild(CONFIG.createSafeElement('td', appDate, 'py-3.5 px-3 text-slate-500 text-[11px]'));

        const statusTd = document.createElement('td');
        statusTd.className = 'py-3.5 px-3';
        
        let rawStatus = item.status || 'مؤكد';
        let translatedStatus = rawStatus;
        let statusClasses = 'bg-emerald-50 text-emerald-600 border-emerald-200/60';

        if (rawStatus === 'مؤكد' || rawStatus === 'Confirmed') {
            translatedStatus = dict.statusConfirmed;
        } else if (rawStatus === 'ملغى' || rawStatus === 'Cancelled') {
            translatedStatus = dict.statusCancelled;
            statusClasses = 'bg-rose-50 text-rose-600 border-rose-200/60';
        } else if (rawStatus === 'قيد الانتظار' || rawStatus === 'Pending') {
            translatedStatus = dict.statusPending;
            statusClasses = 'bg-amber-50 text-amber-600 border-amber-200/60';
        }

        statusTd.appendChild(CONFIG.createSafeElement('span', translatedStatus, `inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusClasses}`));
        tr.appendChild(statusTd);

        const actionsTd = document.createElement('td');
        actionsTd.className = 'py-3.5 px-3 text-center';
        const deleteBtn = CONFIG.createSafeElement('button', dict.btnCancelAppointment, 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer');
        deleteBtn.setAttribute('data-i18n', 'btnCancelAppointment');
        deleteBtn.addEventListener('click', () => deleteAppointment(item.id));
        actionsTd.appendChild(deleteBtn);
        tr.appendChild(actionsTd);

        tbody.appendChild(tr);
    });
}

async function handleAddAppointment(e) {
    e.preventDefault();

    const payload = {
        patientName: document.getElementById('patientName').value.trim(),
        doctorName: document.getElementById('doctorName').value.trim(),
        department: document.getElementById('department').value,
        appointmentDate: document.getElementById('appointmentDate').value,
        notes: document.getElementById('notes').value.trim() || null,
        status: "مؤكد"
    };

    try {
        await CONFIG.request('/Appointments', {
            method: 'POST',
            headers: getAuthHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(payload)
        });

        document.getElementById('appointmentForm').reset();
        await loadAppointments();
    } catch (error) {
        handleAuthError(error);
        alert('حدث خطأ أثناء حفظ الموعد: ' + (error.message || 'خطأ في الاتصال'));
    }
}

async function deleteAppointment(id) {
    const currentLang = document.documentElement.lang || 'ar';
    const msg = currentLang === 'en' ? 'Are you sure you want to cancel this appointment?' : 'هل أنت متأكد من إلغاء هذا الموعد؟';
    if (!confirm(msg)) return;

    try {
        await CONFIG.request(`/Appointments/${id}`, { 
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        await loadAppointments();
    } catch (error) {
        handleAuthError(error);
        alert(error.message || 'فشل إلغاء الموعد');
    }
}

function filterAppointments(queryText) {
    const query = (queryText || '').toLowerCase().trim();
    const filtered = cacheAppointments.filter(a => 
        (a.patientName || '').toLowerCase().includes(query) || 
        (a.doctorName || '').toLowerCase().includes(query) ||
        (a.department || '').toLowerCase().includes(query)
    );
    renderAppointmentsTable(filtered);
}

function toggleLanguage() {
    const currentLang = document.documentElement.lang;
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    
    const langLabel = document.getElementById('currentLangLabel');
    if (langLabel) {
        langLabel.textContent = newLang === 'ar' ? 'English' : 'العربية';
    }

    if (typeof CONFIG !== 'undefined' && typeof CONFIG.applyTranslations === 'function') {
        CONFIG.applyTranslations(newLang);
    }

    renderAppointmentsTable(cacheAppointments);
}
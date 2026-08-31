document.addEventListener('DOMContentLoaded', () => {
    // 1. تحميل قائمة المرضى من الباك إند
    loadPatients();

    // 2. إعداد مستمعات الأحداث (Event Listeners)
    const patientForm = document.getElementById('patientForm');
    if (patientForm) {
        patientForm.addEventListener('submit', handleAddPatient);
    }

    const toggleFormBtn = document.getElementById('toggleFormBtn');
    const cancelFormBtn = document.getElementById('cancelFormBtn');
    if (toggleFormBtn) toggleFormBtn.addEventListener('click', toggleFormVisibility);
    if (cancelFormBtn) cancelFormBtn.addEventListener('click', toggleFormVisibility);

    // تصفية نتائج الجدول لحظياً بالبحث
    const tableSearchInput = document.getElementById('tableSearchInput');
    const globalSearchInput = document.getElementById('globalSearchInput');
    
    if (tableSearchInput) {
        tableSearchInput.addEventListener('input', (e) => filterPatients(e.target.value));
    }
    if (globalSearchInput) {
        globalSearchInput.addEventListener('input', (e) => filterPatients(e.target.value));
    }
});

let allPatientsCache = [];

// جلب اللغة الحالية للنظام
function getCurrentLanguage() {
    return localStorage.getItem('app_lang') || 'ar';
}

// إظهار وإخفاء نموذج إضافة مريض
function toggleFormVisibility() {
    const card = document.getElementById('patientFormCard');
    const btnText = document.getElementById('toggleBtnText');
    if (!card) return;

    const isLangAr = getCurrentLanguage() === 'ar';
    const isHidden = card.classList.contains('hidden');

    if (isHidden) {
        card.classList.remove('hidden');
        if (btnText) btnText.textContent = isLangAr ? 'إغلاق النموذج' : 'Hide Form';
    } else {
        card.classList.add('hidden');
        if (btnText) btnText.textContent = isLangAr ? 'تسجيل مريض جديد' : 'Register New Patient';
    }
}

// تحميل المرضى آمن مع معالجة المصفوفات
async function loadPatients() {
    const tableBody = document.getElementById('patientsTableBody');
    if (!tableBody) return;

    const isLangAr = getCurrentLanguage() === 'ar';
    tableBody.replaceChildren();

    const loadingRow = document.createElement('tr');
    const loadingText = isLangAr ? 'جاري تحميل قائمة المرضى...' : 'Loading patients list...';
    const loadingTd = CONFIG.createSafeElement('td', loadingText, 'py-8 text-center text-slate-400 font-medium');
    loadingTd.colSpan = 7;
    loadingRow.appendChild(loadingTd);
    tableBody.appendChild(loadingRow);

    try {
        const patients = await CONFIG.request('/api/Patients');
        // التأكد من أن النتيجة مصفوفة دائماً
        allPatientsCache = Array.isArray(patients) ? patients : (patients ? [patients] : []);
        renderPatientsTable(allPatientsCache);
    } catch (error) {
        console.error('Error loading patients:', error);
        tableBody.replaceChildren();
        const errorRow = document.createElement('tr');
        const errorText = isLangAr ? 'فشل جلب بيانات المرضى من السيرفر' : 'Failed to fetch patients from server';
        const errorTd = CONFIG.createSafeElement('td', errorText, 'py-8 text-center text-rose-500 font-bold');
        errorTd.colSpan = 7;
        errorRow.appendChild(errorTd);
        tableBody.appendChild(errorRow);
    }
}

// طباعة الصفوف في الجدول
function renderPatientsTable(patients) {
    const tableBody = document.getElementById('patientsTableBody');
    if (!tableBody) return;

    const isLangAr = getCurrentLanguage() === 'ar';
    tableBody.replaceChildren();

    if (!patients || !Array.isArray(patients) || patients.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyText = isLangAr ? 'لا يوجد مرضى مسجلون في النظام حالياً' : 'No patients registered in the system currently';
        const emptyTd = CONFIG.createSafeElement('td', emptyText, 'py-8 text-center text-slate-400 font-medium');
        emptyTd.colSpan = 7;
        emptyRow.appendChild(emptyTd);
        tableBody.appendChild(emptyRow);
        return;
    }

    patients.forEach(patient => {
        const row = createPatientRow(patient);
        tableBody.appendChild(row);
    });
     const emailEl = document.getElementById('adminEmail');
            if (emailEl && user.email) {
                emailEl.textContent = user.email;
            }
}

// إنشاء صف المريض
function createPatientRow(patient) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50/80 transition duration-150';

    const lang = getCurrentLanguage();
    const isLangAr = lang === 'ar';

    // 1. Patient ID
    const pidText = generatePatientID(patient.id, patient.createdAt);
    tr.appendChild(CONFIG.createSafeElement('td', pidText, 'py-3.5 px-3 font-mono text-[11px] text-slate-500 font-semibold'));
    
    // 2. Name
    const defaultName = isLangAr ? 'بدون اسم' : 'Unnamed';
    tr.appendChild(CONFIG.createSafeElement('td', patient.name || defaultName, 'py-3.5 px-3 font-bold text-slate-900'));

    // 3. Age / Gender
    let genderLabel = isLangAr ? 'ذكر' : 'Male';
    if (patient.gender === 'أنثى' || patient.gender === 'Female') {
        genderLabel = isLangAr ? 'أنثى' : 'Female';
    }
    const ageGenderText = `${patient.age || 0} · ${genderLabel}`;
    tr.appendChild(CONFIG.createSafeElement('td', ageGenderText, 'py-3.5 px-3 text-slate-600'));

    // 4. Contact Phone
    tr.appendChild(CONFIG.createSafeElement('td', patient.phoneNumber || '-', 'py-3.5 px-3 font-mono text-[11px] text-slate-600'));

    // 5. Registered Date
    const locale = isLangAr ? 'ar-EG' : 'en-US';
    const regDate = patient.createdAt ? new Date(patient.createdAt).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' }) : '-';
    tr.appendChild(CONFIG.createSafeElement('td', regDate, 'py-3.5 px-3 text-slate-500 text-[11px]'));

    // 6. Status Badge
    const statusTd = document.createElement('td');
    statusTd.className = 'py-3.5 px-3';
    const isInactive = patient.status === 'غير نشط' || patient.status === 'Inactive';
    
    const badgeClass = isInactive 
        ? 'bg-slate-100 text-slate-600 border border-slate-200' 
        : 'bg-emerald-50 text-emerald-600 border border-emerald-200/60';
        
    let badgeText = isInactive ? 'Inactive' : 'Active';
    if (isLangAr) {
        badgeText = isInactive ? 'غير نشط' : 'نشط';
    }

    statusTd.appendChild(CONFIG.createSafeElement('span', badgeText, `inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeClass}`));
    tr.appendChild(statusTd);

    // 7. Actions Button
    const actionsTd = document.createElement('td');
    actionsTd.className = 'py-3.5 px-3 text-center';

    const btnText = isLangAr ? 'حذف' : 'Delete';
    const deleteBtn = CONFIG.createSafeElement(
        'button',
        btnText,
        'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer'
    );
    deleteBtn.addEventListener('click', () => deletePatient(patient.id));

    actionsTd.appendChild(deleteBtn);
    tr.appendChild(actionsTd);

    return tr;
}

// توليد PID
function generatePatientID(id, createdAtStr) {
    const dateObj = createdAtStr ? new Date(createdAtStr) : new Date();
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const paddedId = String(id).padStart(4, '0');
    return `PID-${yyyy}${mm}${dd}-${paddedId}`;
}

// حفظ مريض جديد
async function handleAddPatient(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const gender = document.getElementById('gender').value;
    const contactNumber = document.getElementById('contactNumber').value.trim();
    const email = document.getElementById('email').value.trim();
    const status = document.getElementById('status').value;
    const address = document.getElementById('address').value.trim();
    const medicalHistory = document.getElementById('medicalHistory').value.trim();

    let age = 0;
    if (dateOfBirth) {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 0) age = 0;
    }

    const payload = {
        name: fullName,
        dateOfBirth: dateOfBirth ? dateOfBirth : null, // إرسال null إذا كان فارغاً لمنع خطأ السيرفر
        age: age,
        gender: gender,
        phoneNumber: contactNumber,
        email: email || null,
        status: status,
        address: address || null,
        medicalHistory: medicalHistory || null
    };

    try {
        // تم تصحيح المسار ليصبح مطابقاً للباك إند /api/Patients
        await CONFIG.request('/api/Patients', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        document.getElementById('patientForm').reset();
        toggleFormVisibility();
        await loadPatients();
    } catch (error) {
        const isLangAr = getCurrentLanguage() === 'ar';
        const msg = isLangAr 
            ? 'فشل تسجيل المريض: ' + (error.message || 'حدث خطأ أثناء التواصل مع السيرفر')
            : 'Failed to register patient: ' + (error.message || 'An error occurred while connecting to the server');
        alert(msg);
    }
}

// حذف سجل المريض
async function deletePatient(id) {
    const isLangAr = getCurrentLanguage() === 'ar';
    const confirmMsg = isLangAr 
        ? 'هل أنت متأكد من إلغاء وحذف سجل هذا المريض نهائياً؟' 
        : 'Are you sure you want to permanently delete this patient record?';

    if (!confirm(confirmMsg)) return;

    try {
        // تم تصحيح مسار الحذف ليطابق /api/Patients/{id}
        await CONFIG.request(`/api/Patients/${id}`, { method: 'DELETE' });
        await loadPatients();
    } catch (error) {
        const failMsg = isLangAr 
            ? (error.message || 'فشل عملية الحذف') 
            : (error.message || 'Delete operation failed');
        alert(failMsg);
    }
}

// فلترة المرضى
function filterPatients(queryText) {
    const query = (queryText || '').toLowerCase().trim();
    if (!query) {
        renderPatientsTable(allPatientsCache);
        return;
    }

    const filtered = allPatientsCache.filter(p => {
        const pid = generatePatientID(p.id, p.createdAt).toLowerCase();
        const name = (p.name || '').toLowerCase();
        const phone = (p.phoneNumber || '').toLowerCase();
        const email = (p.email || '').toLowerCase();
        
        return name.includes(query) || phone.includes(query) || pid.includes(query) || email.includes(query);
    });
    
    renderPatientsTable(filtered);
}
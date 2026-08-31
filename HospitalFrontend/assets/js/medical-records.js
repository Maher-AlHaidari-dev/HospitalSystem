// Global state for medical records
let allRecords = [];

// Initialize page on DOM load
document.addEventListener('DOMContentLoaded', async () => {
    // Apply initial translations from CONFIG
    if (typeof CONFIG !== 'undefined' && CONFIG.applyTranslations) {
        CONFIG.applyTranslations();
        
        // Update language toggle button text if available
        const langBtn = document.getElementById('langToggleBtn');
        if (langBtn) {
            langBtn.textContent = CONFIG.LANG === 'ar' ? 'EN' : 'AR';
        }
    }
    
    // Fetch records from backend server
    await fetchMedicalRecords();
});

// Toggle Language function compatible with header button
function toggleLanguage() {
    if (typeof CONFIG !== 'undefined') {
        const newLang = CONFIG.LANG === 'ar' ? 'en' : 'ar';
        CONFIG.applyTranslations(newLang);
        const btn = document.getElementById('langToggleBtn');
        if (btn) {
            btn.textContent = newLang === 'ar' ? 'EN' : 'AR';
        }
        renderRecords(allRecords);
    }
}

// Toggle Modal visibility
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.toggle('hidden');
    }
}

// Fetch medical records from the backend API using CONFIG.request
async function fetchMedicalRecords() {
    const grid = document.getElementById('recordsGrid');
    if (!grid) return;

    const loadingText = typeof CONFIG !== 'undefined' ? CONFIG.t('loadingRecords') : 'جاري تحميل السجلات الطبية...';
    grid.innerHTML = `
        <div class="col-span-full py-12 text-center text-slate-400 text-sm bg-white rounded-xl border border-slate-200">
            <i class="fa-solid fa-spinner fa-spin text-2xl mb-2 text-teal-500"></i>
            <p>${loadingText}</p>
        </div>
    `;

    try {
        // CONFIG.request automatically handles token, headers, and /api prefix
        const response = await CONFIG.request('/medical-records');
        
        // Handle different response structures (array or wrapped object)
        allRecords = Array.isArray(response) ? response : (response.data || response.records || []);
        renderRecords(allRecords);
    } catch (error) {
        console.error("Failed to fetch medical records:", error);
        const errorText = typeof CONFIG !== 'undefined' ? CONFIG.t('errorFetchRecords') : 'فشل جلب السجلات الطبية من السيرفر';
        grid.innerHTML = `
            <div class="col-span-full py-12 text-center text-rose-500 text-sm bg-white rounded-xl border border-slate-200 space-y-2">
                <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
                <p>${errorText}</p>
                <button onclick="fetchMedicalRecords()" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition">إعادة المحاولة</button>
            </div>
        `;
    }
}

// Render records into the grid UI
function renderRecords(records) {
    const grid = document.getElementById('recordsGrid');
    if (!grid) return;

    if (!records || records.length === 0) {
        const noFoundText = typeof CONFIG !== 'undefined' ? CONFIG.t('noRecordsFound') : 'لا توجد سجلات طبية مسجلة حالياً';
        grid.innerHTML = `
            <div class="col-span-full py-12 text-center text-slate-400 text-sm bg-white rounded-xl border border-slate-200 space-y-2">
                <i class="fa-solid fa-folder-open text-3xl text-slate-300"></i>
                <p>${noFoundText}</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = records.map(record => {
        const pName = record.patientName || record.patient_name || 'مريض غير محدد';
        const dName = record.doctorName || record.doctor_name || 'طبيب غير محدد';
        const diag = record.diagnosis || 'لا يوجد تشخيص';
        const presc = record.prescription || 'لا توجد وصفة';
        const notes = record.notes || '';
        const dateStr = record.createdAt || record.created_at || record.date || '';
        const recordId = record.id || record._id;

        return `
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                        <h4 class="font-bold text-slate-800 text-base flex items-center gap-2">
                            <i class="fa-solid fa-user-injured text-teal-600 text-sm"></i>
                            ${escapeHtml(pName)}
                        </h4>
                        <span class="text-xs px-2.5 py-1 bg-teal-50 text-teal-600 font-semibold rounded-full">
                            ${escapeHtml(dName)}
                        </span>
                    </div>
                    <div class="text-xs space-y-2 text-slate-600">
                        <p><strong class="text-slate-700">${typeof CONFIG !== 'undefined' ? CONFIG.t('recordsDiagnosis') : 'التشخيص'}:</strong> ${escapeHtml(diag)}</p>
                        <p><strong class="text-slate-700">${typeof CONFIG !== 'undefined' ? CONFIG.t('recordsPrescription') : 'الوصفة الطبية'}:</strong> ${escapeHtml(presc)}</p>
                        ${notes ? `<p><strong class="text-slate-700">${typeof CONFIG !== 'undefined' ? CONFIG.t('recordsNotes') : 'ملاحظات'}:</strong> ${escapeHtml(notes)}</p>` : ''}
                    </div>
                </div>
                <div class="flex justify-between items-center pt-3 border-t border-slate-50 text-[10px] text-slate-400 mt-2">
                    <span>${dateStr ? new Date(dateStr).toLocaleDateString() : ''}</span>
                    ${recordId ? `
                        <button onclick="deleteRecord('${recordId}')" class="text-rose-500 hover:text-rose-700 transition flex items-center gap-1 font-medium">
                            <i class="fa-solid fa-trash-can"></i> حذف
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Live search filter function
function filterRecords() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    if (!query) {
        renderRecords(allRecords);
        return;
    }

    const filtered = allRecords.filter(r => {
        const pName = (r.patientName || r.patient_name || '').toLowerCase();
        const dName = (r.doctorName || r.doctor_name || '').toLowerCase();
        const diag = (r.diagnosis || '').toLowerCase();
        return pName.includes(query) || dName.includes(query) || diag.includes(query);
    });

    renderRecords(filtered);
}

// Handle creating a new medical record via API POST request
async function handleCreateRecord(event) {
    event.preventDefault();

    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const payload = {
        patientName: document.getElementById('recPatientName').value.trim(),
        doctorName: document.getElementById('recDoctorName').value.trim(),
        diagnosis: document.getElementById('recDiagnosis').value.trim(),
        prescription: document.getElementById('recPrescription').value.trim(),
        notes: document.getElementById('recNotes').value.trim()
    };

    try {
        // Send POST request to backend using CONFIG.request
        await CONFIG.request('/medical-records', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        // Close modal and reset form
        toggleModal('newRecordModal');
        document.getElementById('createRecordForm').reset();

        // Refresh records list from server
        await fetchMedicalRecords();
    } catch (error) {
        console.error("Failed to create medical record:", error);
        alert(error.message || "فشل حفظ السجل الطبي على الخادم.");
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}

// Handle deleting a medical record via API DELETE request
async function deleteRecord(id) {
    if (!confirm('هل أنت متأكد من حذف هذا السجل الطبي نهائياً؟')) return;

    try {
        await CONFIG.request(`/medical-records/${id}`, {
            method: 'DELETE'
        });
        // Refresh records list
        await fetchMedicalRecords();
    } catch (error) {
        console.error("Failed to delete record:", error);
        alert(error.message || "فشل حذف السجل الطبي من الخادم.");
    }
}

// Security utility to prevent XSS injection
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
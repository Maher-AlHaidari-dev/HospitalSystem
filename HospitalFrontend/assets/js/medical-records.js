document.addEventListener('DOMContentLoaded', async () => {
    // 1. تطبيق لغة الواجهة المحفوظة
    CONFIG.applyTranslations(CONFIG.LANG);

    // 2. عناصر الصفحة
    const tableBody = document.getElementById('medicalRecordsTableBody');
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('newRecordModal');
    const btnOpenModal = document.getElementById('btnOpenNewRecordModal');
    const newRecordForm = document.getElementById('newRecordForm');

    let allRecords = [];

    // 3. دالة جلب وعرض السجلات الطبية
    async function fetchMedicalRecords() {
        try {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">${CONFIG.t('loadingRecords')}</td></tr>`;
            
            // استخدام CONFIG.request لجلب البيانات مع التوكن والمسار الصحيح تلقائياً
            const response = await CONFIG.request('/medical-records');
            
            // دعم استجابة الـ API سواء كانت مصفوفة مباشرة أو داخل كائن مفتاحي
            allRecords = Array.isArray(response) ? response : (response.data || response.records || []);

            renderRecords(allRecords);
        } catch (error) {
            console.error('Failed to load medical records:', error);
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">${CONFIG.t('errorFetchRecords')}</td></tr>`;
        }
    }

    // 4. دالة رسم الجدول
    function renderRecords(records) {
        if (!records || records.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">${CONFIG.t('noRecordsFound')}</td></tr>`;
            return;
        }

        tableBody.innerHTML = '';
        records.forEach(record => {
            const tr = document.createElement('tr');
            
            const tdPatient = document.createElement('td');
            tdPatient.textContent = record.patient_name || record.patientName || '-';

            const tdDiagnosis = document.createElement('td');
            tdDiagnosis.textContent = record.diagnosis || '-';

            const tdPrescription = document.createElement('td');
            tdPrescription.textContent = record.prescription || '-';

            const tdNotes = document.createElement('td');
            tdNotes.textContent = record.notes || '-';

            const tdActions = document.createElement('td');
            const btnView = document.createElement('button');
            btnView.className = 'btn-sm';
            btnView.textContent = CONFIG.LANG === 'ar' ? 'عرض التفاصيل' : 'View Details';
            btnView.addEventListener('click', () => {
                alert(`${CONFIG.t('recordsDiagnosis')}: ${record.diagnosis}\n${CONFIG.t('recordsPrescription')}: ${record.prescription}`);
            });
            tdActions.appendChild(btnView);

            tr.appendChild(tdPatient);
            tr.appendChild(tdDiagnosis);
            tr.appendChild(tdPrescription);
            tr.appendChild(tdNotes);
            tr.appendChild(tdActions);

            tableBody.appendChild(tr);
        });
    }

    // 5. البحث الحي داخل السجلات
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = allRecords.filter(r => 
                (r.patient_name && r.patient_name.toLowerCase().includes(query)) ||
                (r.diagnosis && r.diagnosis.toLowerCase().includes(query))
            );
            renderRecords(filtered);
        });
    }

    // 6. التحكم بنافذة الإضافة (Modal)
    if (btnOpenModal && modal) {
        btnOpenModal.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }

    // 7. إرسال نموذج إضافة سجل جديد
    if (newRecordForm) {
        newRecordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newRecordData = {
                patient_name: document.getElementById('recordPatientName').value,
                diagnosis: document.getElementById('recordDiagnosis').value,
                prescription: document.getElementById('recordPrescription').value,
                notes: document.getElementById('recordNotes').value
            };

            try {
                await CONFIG.request('/medical-records', {
                    method: 'POST',
                    body: JSON.stringify(newRecordData)
                });
                modal.style.display = 'none';
                newRecordForm.reset();
                fetchMedicalRecords(); // إعادة تحميل الجدول
            } catch (error) {
                alert(error.message || 'فشل حفظ السجل الطبي');
            }
        });
    }

    // تنفيذ الجلب عند تحميل الصفحة
    fetchMedicalRecords();
});
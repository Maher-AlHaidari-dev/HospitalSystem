document.addEventListener('DOMContentLoaded', () => {
    CONFIG.applyTranslations(CONFIG.LANG);
    updateLangBtnText();
    fetchMedicalRecords();
});

// تبديل اللغة باستخدام دالة CONFIG الرسمية
function toggleLanguage() {
    const nextLang = CONFIG.LANG === 'ar' ? 'en' : 'ar';
    CONFIG.applyTranslations(nextLang);
    updateLangBtnText();
    renderRecords(cachedRecords);
}

function updateLangBtnText() {
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
        langBtn.textContent = CONFIG.LANG === 'ar' ? 'EN' : 'عربي';
    }
}

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.toggle('hidden');
}

const defaultRecords = [
    {
        id: 1,
        version: 'v2',
        patientName: 'Ahmed Al-Sayed',
        doctorName: 'Dr. Sarah Ahmed',
        date: '2026-07-16',
        diagnosis: 'Stable hypertension',
        prescription: 'Amlodipine 5mg, once daily.',
        notes: 'Blood pressure controlled. Follow up in 3 months.'
    },
    {
        id: 2,
        version: 'v1',
        patientName: 'John Peterson',
        doctorName: 'Dr. James Miller',
        date: '2026-08-01',
        diagnosis: 'Type 2 Diabetes — controlled',
        prescription: 'Metformin 500mg twice daily. Continue diet plan.',
        notes: 'HbA1c 6.8. Improving.'
    }
];

let cachedRecords = [];

async function fetchMedicalRecords() {
    const grid = document.getElementById('recordsGrid');
    if (!grid) return;

    try {
        const records = await CONFIG.request('/medical-records');
        cachedRecords = records;
        renderRecords(records);
    } catch (error) {
        let localData = localStorage.getItem('demo_medical_records');
        if (!localData) {
            localStorage.setItem('demo_medical_records', JSON.stringify(defaultRecords));
            localData = JSON.stringify(defaultRecords);
        }
        cachedRecords = JSON.parse(localData);
        renderRecords(cachedRecords);
    }
}

function renderRecords(records) {
    const grid = document.getElementById('recordsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const isAr = CONFIG.LANG === 'ar';

    if (!records || records.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
                ${CONFIG.t('noRecordsFound')}
            </div>
        `;
        return;
    }

    const locale = isAr ? 'ar-YE' : 'en-US';

    records.forEach(rec => {
        const formattedDate = new Date(rec.date).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });

        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition space-y-4';
        
        card.innerHTML = `
            <div class="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                    <h3 class="font-bold text-slate-800 text-base">${CONFIG.createSafeElement('span', rec.patientName).textContent}</h3>
                    <p class="text-xs text-slate-400 mt-0.5">${CONFIG.createSafeElement('span', rec.doctorName).textContent} · ${formattedDate}</p>
                </div>
                <span class="px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded">
                    ${CONFIG.createSafeElement('span', rec.version || 'v1').textContent}
                </span>
            </div>

            <div class="space-y-3 text-xs">
                <div>
                    <span class="block uppercase font-bold text-[10px] tracking-wider text-slate-400 mb-0.5">
                        ${CONFIG.t('recordsDiagnosis')}
                    </span>
                    <p class="font-medium text-slate-700">${CONFIG.createSafeElement('span', rec.diagnosis).textContent}</p>
                </div>

                <div>
                    <span class="block uppercase font-bold text-[10px] tracking-wider text-slate-400 mb-0.5">
                        ${CONFIG.t('recordsPrescription')}
                    </span>
                    <p class="font-medium text-slate-700">${CONFIG.createSafeElement('span', rec.prescription).textContent}</p>
                </div>

                <div>
                    <span class="block uppercase font-bold text-[10px] tracking-wider text-slate-400 mb-0.5">
                        ${CONFIG.t('recordsNotes')}
                    </span>
                    <p class="text-slate-500">${CONFIG.createSafeElement('span', rec.notes || '-').textContent}</p>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

async function handleCreateRecord(event) {
    event.preventDefault();

    const patientName = document.getElementById('recPatientName').value.trim();
    const doctorName = document.getElementById('recDoctorName').value.trim();
    const diagnosis = document.getElementById('recDiagnosis').value.trim();
    const prescription = document.getElementById('recPrescription').value.trim();
    const notes = document.getElementById('recNotes').value.trim();

    if (!patientName || !doctorName || !diagnosis || !prescription) {
        alert(CONFIG.LANG === 'ar' ? 'يرجى ملء كافة الحقول المطلوبة' : 'Please fill out all required fields');
        return;
    }

    const newRecord = {
        id: Date.now(),
        version: 'v1',
        patientName,
        doctorName,
        date: new Date().toISOString().split('T')[0],
        diagnosis,
        prescription,
        notes
    };

    try {
        await CONFIG.request('/medical-records', {
            method: 'POST',
            body: JSON.stringify(newRecord)
        });
    } catch (error) {
        let localData = JSON.parse(localStorage.getItem('demo_medical_records') || JSON.stringify(defaultRecords));
        localData.unshift(newRecord);
        localStorage.setItem('demo_medical_records', JSON.stringify(localData));
    }

    toggleModal('newRecordModal');
    document.getElementById('createRecordForm').reset();
    fetchMedicalRecords();
}

function filterRecords() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    if (!query) {
        renderRecords(cachedRecords);
        return;
    }

    const filtered = cachedRecords.filter(rec => 
        rec.patientName.toLowerCase().includes(query) ||
        rec.doctorName.toLowerCase().includes(query) ||
        rec.diagnosis.toLowerCase().includes(query)
    );

    renderRecords(filtered);
}
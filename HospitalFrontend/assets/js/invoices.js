document.addEventListener('DOMContentLoaded', () => {
    applyCurrentLanguage();
    fetchInvoices();
});

function toggleLanguage() {
    const currentLang = CONFIG.LANG || 'ar';
    CONFIG.LANG = currentLang === 'ar' ? 'en' : 'ar';
    
    applyCurrentLanguage();
    fetchInvoices();
}

function applyCurrentLanguage() {
    const isEn = CONFIG.LANG === 'en';
    document.documentElement.dir = isEn ? 'ltr' : 'rtl';
    document.documentElement.lang = CONFIG.LANG || 'ar';

    if (typeof CONFIG.applyTranslations === 'function') {
        CONFIG.applyTranslations(CONFIG.LANG);
    }

    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
        langBtn.textContent = isEn ? 'عربي' : 'EN';
    }
}

function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.toggle('hidden');
}

// تم حذف بيانات demo_invoices الوهمية نهائياً لضمان التعامل الحصري مع السيرفر الحقيقي

async function fetchInvoices() {
    const tableBody = document.getElementById('invoicesTableBody');
    if (!tableBody) return;

    const isEn = CONFIG.LANG === 'en';

    try {
        const invoices = await CONFIG.request('/invoices');
        renderInvoices(invoices);
    } catch (error) {
        console.error('Failed to fetch invoices from server:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-6 text-rose-500 font-medium">
                    ${isEn ? 'Failed to load invoices from server.' : 'فشل تحميل الفواتير من الخادم الحقيقي.'}
                </td>
            </tr>
        `;
    }
}

function renderInvoices(invoices) {
    const tableBody = document.getElementById('invoicesTableBody');
    tableBody.innerHTML = '';

    const isEn = CONFIG.LANG === 'en';

    if (!invoices || invoices.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-6 text-slate-400">
                    ${isEn ? 'No invoices found' : 'لا توجد فواتير حالياً'}
                </td>
            </tr>
        `;
        return;
    }

    const locale = isEn ? 'en-US' : 'ar-YE';

    invoices.forEach(inv => {
        let statusBadgeClass = '';
        let statusLabel = '';

        if (inv.status === 'Paid') {
            statusBadgeClass = 'bg-emerald-100 text-emerald-700';
            statusLabel = isEn ? 'Paid' : 'مدفوع';
        } else if (inv.status === 'Partial') {
            statusBadgeClass = 'bg-amber-100 text-amber-700';
            statusLabel = isEn ? 'Partially Paid' : 'مدفوع جزئياً';
        } else {
            statusBadgeClass = 'bg-rose-100 text-rose-700';
            statusLabel = isEn ? 'Pending' : 'معلق';
        }

        const safePatientName = escapeHTML(inv.patientName);
        const safeInvNumber = escapeHTML(inv.invoiceNumber);

        const row = document.createElement('tr');
        row.className = 'border-b border-slate-100 hover:bg-slate-50 transition';
        row.innerHTML = `
            <td class="py-3.5 px-6 font-mono font-medium text-slate-700">${safeInvNumber}</td>
            <td class="py-3.5 px-6 font-semibold text-slate-800">${safePatientName}</td>
            <td class="py-3.5 px-6 text-slate-500">${new Date(inv.issuedDate).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
            <td class="py-3.5 px-6 text-slate-500">${new Date(inv.dueDate).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
            <td class="py-3.5 px-6 font-bold text-slate-800">$${Number(inv.totalAmount).toFixed(2)}</td>
            <td class="py-3.5 px-6 text-slate-600">$${Number(inv.paidAmount).toFixed(2)}</td>
            <td class="py-3.5 px-6"><span class="px-2.5 py-1 text-[11px] font-semibold ${statusBadgeClass} rounded-full">${statusLabel}</span></td>
            <td class="py-3.5 px-6 text-center">
                ${inv.status !== 'Paid' ? `<button onclick="recordPayment(${inv.id})" class="px-3 py-1 text-xs border border-slate-200 rounded-lg hover:bg-slate-100 font-medium text-slate-700 transition">${isEn ? 'Record Payment' : 'تسجيل دفع'}</button>` : ''}
            </td>
        `;

        tableBody.appendChild(row);
    });
}

async function handleCreateInvoice(event) {
    event.preventDefault();
    const isEn = CONFIG.LANG === 'en';
    
    const patientNameInput = document.getElementById('invPatientName').value.trim();
    const totalAmountInput = parseFloat(document.getElementById('invTotalAmount').value);
    const dueDateInput = document.getElementById('invDueDate').value;

    if (!patientNameInput || isNaN(totalAmountInput) || totalAmountInput <= 0 || !dueDateInput) {
        alert(isEn ? 'Please fill all fields accurately' : 'يرجى إدخال بيانات صحيحة ومكتملة');
        return;
    }

    const newInvoiceObj = {
        invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
        patientName: patientNameInput,
        totalAmount: totalAmountInput,
        paidAmount: 0,
        dueDate: dueDateInput,
        issuedDate: new Date().toISOString().split('T')[0],
        status: 'Pending'
    };

    try {
        await CONFIG.request('/invoices', {
            method: 'POST',
            body: JSON.stringify(newInvoiceObj)
        });
        toggleModal('newInvoiceModal');
        document.getElementById('createInvoiceForm').reset();
        fetchInvoices();
    } catch (error) {
        console.error('Failed to create invoice on server:', error);
        alert(isEn ? 'Failed to save invoice to server.' : 'فشل حفظ الفاتورة في السيرفر.');
    }
}

async function recordPayment(invoiceId) {
    const isEn = CONFIG.LANG === 'en';
    const amountStr = prompt(isEn ? 'Enter paid amount:' : 'أدخل المبلغ المالي المدفوع:');
    if (!amountStr) return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
        alert(isEn ? 'Please enter a valid amount' : 'يرجى إدخال مبلغ صحيح');
        return;
    }

    try {
        await CONFIG.request(`/invoices/${invoiceId}/pay`, {
            method: 'POST',
            body: JSON.stringify(amount)
        });
        fetchInvoices();
    } catch (error) {
        console.error('Failed to record payment on server:', error);
        alert(isEn ? 'Failed to record payment on server.' : 'فشل تسجيل الدفعة في السيرفر.');
    }
}
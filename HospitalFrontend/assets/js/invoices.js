"use strict";

/* =========================================================
   MediCore HMS
   INVOICES PAGE
   Real API + Responsive + Translation Safe
   ========================================================= */


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    fetchInvoices();

});


/* =========================================================
   LANGUAGE HELPER
   ========================================================= */

function getInvoicesLanguage() {

    if (
        typeof CONFIG !== "undefined" &&
        (CONFIG.LANG === "ar" || CONFIG.LANG === "en")
    ) {
        return CONFIG.LANG;
    }


    const savedLang =
        localStorage.getItem("app_lang");


    return savedLang === "en"
        ? "en"
        : "ar";
}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    if (
        value === undefined ||
        value === null
    ) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   MODAL
   ========================================================= */

function toggleModal(modalId) {

    const modal =
        document.getElementById(modalId);


    if (!modal) return;


    modal.classList.toggle("hidden");


    const isHidden =
        modal.classList.contains("hidden");


    if (!isHidden) {

        document.body.style.overflow =
            "hidden";

    } else {

        document.body.style.overflow =
            "";

    }

}


/* =========================================================
   FETCH INVOICES
   ========================================================= */

async function fetchInvoices() {

    const tableBody =
        document.getElementById(
            "invoicesTableBody"
        );


    if (!tableBody) return;


    const lang =
        getInvoicesLanguage();

    const isEn =
        lang === "en";


    tableBody.innerHTML = `
        <tr>
            <td
                colspan="8"
                class="text-center py-10 text-slate-400"
            >
                <div class="flex flex-col items-center justify-center gap-2">
                    <i class="fa-solid fa-spinner fa-spin text-[#00A896] text-lg"></i>
                    <span>
                        ${
                            isEn
                                ? "Loading invoices..."
                                : "جاري تحميل الفواتير..."
                        }
                    </span>
                </div>
            </td>
        </tr>
    `;


    try {

        const invoices =
            await CONFIG.request(
                "/invoices"
            );


        renderInvoices(
            Array.isArray(invoices)
                ? invoices
                : []
        );


    } catch (error) {

        console.error(
            "Failed to fetch invoices from server:",
            error
        );


        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="text-center py-10"
                >
                    <div class="flex flex-col items-center gap-2">
                        <i class="fa-solid fa-triangle-exclamation text-rose-500 text-xl"></i>

                        <span class="text-rose-500 font-medium">
                            ${
                                isEn
                                    ? "Failed to load invoices from server."
                                    : "فشل تحميل الفواتير من الخادم."
                            }
                        </span>
                    </div>
                </td>
            </tr>
        `;

    }

}


/* =========================================================
   RENDER INVOICES
   ========================================================= */

function renderInvoices(invoices) {

    const tableBody =
        document.getElementById(
            "invoicesTableBody"
        );


    if (!tableBody) return;


    tableBody.innerHTML = "";


    const lang =
        getInvoicesLanguage();

    const isEn =
        lang === "en";


    /* ---------------------------------------------------------
       Empty state
       --------------------------------------------------------- */

    if (
        !Array.isArray(invoices) ||
        invoices.length === 0
    ) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="text-center py-12 text-slate-400"
                >
                    <div class="flex flex-col items-center gap-2">
                        <i class="fa-solid fa-file-invoice text-slate-300 text-2xl"></i>

                        <span>
                            ${
                                isEn
                                    ? "No invoices found"
                                    : "لا توجد فواتير حالياً"
                            }
                        </span>
                    </div>
                </td>
            </tr>
        `;

        return;

    }


    const locale =
        isEn
            ? "en-US"
            : "ar-YE";


    invoices.forEach(
        (invoice) => {

            if (!invoice) return;


            /* -------------------------------------------------
               Status
               ------------------------------------------------- */

            let statusBadgeClass =
                "bg-rose-100 text-rose-700";

            let statusLabel =
                isEn
                    ? "Pending"
                    : "معلق";


            if (
                invoice.status === "Paid"
            ) {

                statusBadgeClass =
                    "bg-emerald-100 text-emerald-700";

                statusLabel =
                    isEn
                        ? "Paid"
                        : "مدفوع";

            } else if (
                invoice.status === "Partial"
            ) {

                statusBadgeClass =
                    "bg-amber-100 text-amber-700";

                statusLabel =
                    isEn
                        ? "Partially Paid"
                        : "مدفوع جزئياً";

            }


            /* -------------------------------------------------
               Safe values
               ------------------------------------------------- */

            const safePatientName =
                escapeHTML(
                    invoice.patientName
                );


            const safeInvoiceNumber =
                escapeHTML(
                    invoice.invoiceNumber
                );


            const totalAmount =
                Number(
                    invoice.totalAmount
                ) || 0;


            const paidAmount =
                Number(
                    invoice.paidAmount
                ) || 0;


            /* -------------------------------------------------
               Dates
               ------------------------------------------------- */

            let issuedDate = "—";
            let dueDate = "—";


            try {

                if (invoice.issuedDate) {

                    issuedDate =
                        new Date(
                            invoice.issuedDate
                        ).toLocaleDateString(
                            locale,
                            {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                            }
                        );

                }

            } catch (error) {

                issuedDate = "—";

            }


            try {

                if (invoice.dueDate) {

                    dueDate =
                        new Date(
                            invoice.dueDate
                        ).toLocaleDateString(
                            locale,
                            {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                            }
                        );

                }

            } catch (error) {

                dueDate = "—";

            }


            /* -------------------------------------------------
               Row
               ------------------------------------------------- */

            const row =
                document.createElement(
                    "tr"
                );


            row.className =
                "border-b border-slate-100 hover:bg-slate-50 transition";


            row.innerHTML = `

                <td class="py-4 px-6 font-mono font-medium text-slate-700">
                    ${safeInvoiceNumber}
                </td>


                <td class="py-4 px-6 font-semibold text-slate-800">
                    ${safePatientName}
                </td>


                <td class="py-4 px-6 text-slate-500">
                    ${issuedDate}
                </td>


                <td class="py-4 px-6 text-slate-500">
                    ${dueDate}
                </td>


                <td class="py-4 px-6 font-bold text-slate-800">
                    $${totalAmount.toFixed(2)}
                </td>


                <td class="py-4 px-6 text-slate-600">
                    $${paidAmount.toFixed(2)}
                </td>


                <td class="py-4 px-6">

                    <span
                        class="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold ${statusBadgeClass} rounded-full"
                    >
                        ${statusLabel}
                    </span>

                </td>


                <td class="py-4 px-6 text-center">

                    ${
                        invoice.status !== "Paid"
                            ? `
                                <button
                                    type="button"
                                    onclick="recordPayment(${Number(invoice.id)})"
                                    class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg hover:bg-slate-100 font-medium text-slate-700 transition"
                                >
                                    <i class="fa-solid fa-money-bill-transfer text-[10px]"></i>

                                    ${
                                        isEn
                                            ? "Record Payment"
                                            : "تسجيل دفعة"
                                    }
                                </button>
                              `
                            : `
                                <span class="text-slate-300">
                                    —
                                </span>
                              `
                    }

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   CREATE INVOICE
   ========================================================= */

async function handleCreateInvoice(event) {

    event.preventDefault();


    const isEn =
        getInvoicesLanguage() === "en";


    const patientInput =
        document.getElementById(
            "invPatientName"
        );


    const totalInput =
        document.getElementById(
            "invTotalAmount"
        );


    const dueDateInput =
        document.getElementById(
            "invDueDate"
        );


    const patientName =
        patientInput
            ? patientInput.value.trim()
            : "";


    const totalAmount =
        totalInput
            ? parseFloat(
                totalInput.value
            )
            : NaN;


    const dueDate =
        dueDateInput
            ? dueDateInput.value
            : "";


    if (
        !patientName ||
        Number.isNaN(totalAmount) ||
        totalAmount <= 0 ||
        !dueDate
    ) {

        alert(
            isEn
                ? "Please fill all fields accurately."
                : "يرجى إدخال جميع البيانات بشكل صحيح."
        );

        return;

    }


    const newInvoiceObj = {

        invoiceNumber:
            `INV-2026-${Math.floor(
                100 +
                Math.random() *
                900
            )}`,

        patientName:
            patientName,

        totalAmount:
            totalAmount,

        paidAmount:
            0,

        dueDate:
            dueDate,

        issuedDate:
            new Date()
                .toISOString()
                .split("T")[0],

        status:
            "Pending"

    };


    const submitButton =
        event.submitter ||
        document.querySelector(
            "#createInvoiceForm button[type='submit']"
        );


    try {

        if (submitButton) {
            submitButton.disabled = true;
        }


        await CONFIG.request(
            "/invoices",
            {
                method: "POST",

                body:
                    JSON.stringify(
                        newInvoiceObj
                    )
            }
        );


        const modal =
            document.getElementById(
                "newInvoiceModal"
            );


        if (modal) {
            modal.classList.add("hidden");
        }


        document.body.style.overflow =
            "";


        const form =
            document.getElementById(
                "createInvoiceForm"
            );


        if (form) {
            form.reset();
        }


        await fetchInvoices();


    } catch (error) {

        console.error(
            "Failed to create invoice on server:",
            error
        );


        alert(
            isEn
                ? "Failed to save invoice to server."
                : "فشل حفظ الفاتورة في السيرفر."
        );


    } finally {

        if (submitButton) {
            submitButton.disabled = false;
        }

    }

}


/* =========================================================
   RECORD PAYMENT
   ========================================================= */

async function recordPayment(invoiceId) {

    const isEn =
        getInvoicesLanguage() === "en";


    if (
        invoiceId === undefined ||
        invoiceId === null ||
        Number.isNaN(
            Number(invoiceId)
        )
    ) {
        return;
    }


    const amountStr =
        prompt(
            isEn
                ? "Enter paid amount:"
                : "أدخل المبلغ المالي المدفوع:"
        );


    if (
        amountStr === null ||
        amountStr.trim() === ""
    ) {
        return;
    }


    const amount =
        parseFloat(
            amountStr
        );


    if (
        Number.isNaN(amount) ||
        amount <= 0
    ) {

        alert(
            isEn
                ? "Please enter a valid amount."
                : "يرجى إدخال مبلغ صحيح."
        );

        return;

    }


    try {

        await CONFIG.request(
            `/invoices/${Number(invoiceId)}/pay`,
            {
                method: "POST",

                body:
                    JSON.stringify(
                        amount
                    )
            }
        );


        await fetchInvoices();


    } catch (error) {

        console.error(
            "Failed to record payment on server:",
            error
        );


        alert(
            isEn
                ? "Failed to record payment on server."
                : "فشل تسجيل الدفعة في السيرفر."
        );

    }

}
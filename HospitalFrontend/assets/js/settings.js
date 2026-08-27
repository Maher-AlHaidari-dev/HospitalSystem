document.addEventListener('DOMContentLoaded', () => {
    // 1. تطبيق الترجمة الأولية وضبط الاتجاه
    CONFIG.applyTranslations();
    updateLangBtnText();

    // 2. عناصر الصفحة
    const profileForm = document.getElementById('profileForm');
    const inputFullName = document.getElementById('fullName');
    const inputEmail = document.getElementById('email');
    const inputRole = document.getElementById('role');
    const chkReminders = document.getElementById('appointmentReminders');
    const btnSaveSettings = document.getElementById('btnSaveSettings');
    const langToggleBtn = document.getElementById('langToggleBtn');

    // 3. تحديث نص زر اللغة (AR / EN)
    function updateLangBtnText() {
        const langText = document.getElementById('langText');
        if (langText) {
            langText.textContent = CONFIG.LANG === 'ar' ? 'EN' : 'AR';
        }
    }

    // 4. جلب وتعبئة البيانات الحالية
    function loadUserSettings() {
        const userInfoRaw = localStorage.getItem('user_info');
        if (userInfoRaw) {
            try {
                const user = JSON.parse(userInfoRaw);
                if (inputFullName) inputFullName.value = user.fullName || '';
                if (inputEmail) inputEmail.value = user.email || '';
                if (inputRole) inputRole.value = user.role || CONFIG.t('adminRole');
            } catch (e) {
                console.error('Error parsing user_info:', e);
            }
        }

        const savedReminders = localStorage.getItem('pref_reminders');
        if (chkReminders && savedReminders !== null) {
            chkReminders.checked = savedReminders === 'true';
        }
    }

    // 5. حفظ التغييرات وإرسالها للسيرفر
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const updatedProfile = {
                fullName: inputFullName?.value.trim(),
                email: inputEmail?.value.trim(),
                appointmentReminders: chkReminders ? chkReminders.checked : false
            };

            try {
                if (btnSaveSettings) btnSaveSettings.disabled = true;

                await CONFIG.request('/settings/profile', {
                    method: 'PUT',
                    body: JSON.stringify(updatedProfile)
                });

                const currentUser = JSON.parse(localStorage.getItem('user_info') || '{}');
                const newUserData = { ...currentUser, fullName: updatedProfile.fullName, email: updatedProfile.email };
                
                localStorage.setItem('user_info', JSON.stringify(newUserData));
                if (chkReminders) {
                    localStorage.setItem('pref_reminders', chkReminders.checked);
                }

                alert(CONFIG.t('msgSaveSuccess'));
            } catch (error) {
                alert(error.message || 'حدث خطأ أثناء حفظ الإعدادات');
            } finally {
                if (btnSaveSettings) btnSaveSettings.disabled = false;
            }
        });
    }

    // 6. زر تبديل اللغة وإعادة الترجكة اللحظية
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const newLang = CONFIG.LANG === 'ar' ? 'en' : 'ar';
            CONFIG.applyTranslations(newLang);
            updateLangBtnText();
        });
    }

    // التحميل الأولي عند فتح الصفحة
    loadUserSettings();
});
document.addEventListener('DOMContentLoaded', () => {
    // 1. تطبيق الترجمة الأولية وضبط الاتجاه
    CONFIG.applyTranslations();
    updateLangBtnText();

    // 2. عناصر الصفحة (مطابقة لملف الـ HTML)
    const profileForm = document.getElementById('profileForm');
    const inputFullName = document.getElementById('adminName');
    const inputEmail = document.getElementById('adminEmail');
    const inputRole = document.getElementById('adminRoleInput');
    const chkReminders = document.getElementById('reminderToggle');
    const btnSaveSettings = profileForm ? profileForm.querySelector('button[type="submit"]') : null;
    const langToggleBtn = document.getElementById('langToggleBtn');

    // 3. تحديث نص زر اللغة (AR / EN)
    function updateLangBtnText() {
        const langText = document.getElementById('langToggleBtn');
        if (langText) {
            langText.textContent = CONFIG.LANG === 'ar' ? 'EN' : 'AR';
        }
    }

    // 4. جلب وتعبئة البيانات من السيرفر (GET: /api/settings/profile)
    async function loadUserSettings() {
        try {
            const data = await CONFIG.request('/settings/profile', {
                method: 'GET'
            });

            if (data) {
                if (inputFullName) inputFullName.value = data.fullName || '';
                if (inputEmail) inputEmail.value = data.email || '';
                
                if (inputRole) {
                    inputRole.value = data.role === 'Admin' ? CONFIG.t('adminRole') : (data.role || CONFIG.t('adminRole'));
                }
                
                if (chkReminders) {
                    chkReminders.checked = !!data.appointmentReminders;
                }

                // تحديث التخزين المحلي كاحتياط
                const currentUser = JSON.parse(localStorage.getItem('user_info') || '{}');
                currentUser.fullName = data.fullName;
                currentUser.email = data.email;
                currentUser.role = data.role;
                localStorage.setItem('user_info', JSON.stringify(currentUser));
                localStorage.setItem('pref_reminders', !!data.appointmentReminders);
            }
        } catch (error) {
            console.error('Failed to load profile from server:', error);
            // الاعتماد على التخزين المحلي في حال عدم الاتصال المؤقت
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
    }

    // 5. وظيفة حفظ التغييرات وإرسالها للسيرفر (PUT: /api/settings/profile)
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const updatedProfile = {
                fullName: inputFullName ? inputFullName.value.trim() : '',
                email: inputEmail ? inputEmail.value.trim() : '',
                appointmentReminders: chkReminders ? chkReminders.checked : false
            };

            try {
                if (btnSaveSettings) btnSaveSettings.disabled = true;

                const response = await CONFIG.request('/settings/profile', {
                    method: 'PUT',
                    body: JSON.stringify(updatedProfile)
                });

                if (response && response.user) {
                    const currentUser = JSON.parse(localStorage.getItem('user_info') || '{}');
                    const newUserData = { 
                        ...currentUser, 
                        fullName: response.user.fullName, 
                        email: response.user.email,
                        role: response.user.role 
                    };
                    localStorage.setItem('user_info', JSON.stringify(newUserData));
                }

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

    // 6. زر تبديل اللغة وإعادة الترجمة اللحظية
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const newLang = CONFIG.LANG === 'ar' ? 'en' : 'ar';
            CONFIG.applyTranslations(newLang);
            updateLangBtnText();
        });
    }

    // التنفيذ الأولي عند تحميل الصفحة
    loadUserSettings();
});
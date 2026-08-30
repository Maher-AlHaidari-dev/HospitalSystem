document.addEventListener('DOMContentLoaded', () => {
    // 1. تطبيق الترجمة الأولية وضبط اتجاه الصفحة
    if (typeof CONFIG !== 'undefined' && typeof CONFIG.applyTranslations === 'function') {
        CONFIG.applyTranslations();
    }
    updateLangBtnText();

    // 2. عناصر نموذج تسجيل الدخول
    const loginForm = document.getElementById('loginForm');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');

    // 3. عناصر نموذج إنشاء الحساب
    const registerForm = document.getElementById('registerForm');
    const regFullNameInput = document.getElementById('regFullName');
    const regEmailInput = document.getElementById('regEmail');
    const regPasswordInput = document.getElementById('regPassword');
    const regConfirmPasswordInput = document.getElementById('regConfirmPassword');
    const regRoleSelect = document.getElementById('regRole');

    // 4. زر تبديل اللغة
    const langToggleBtn = document.getElementById('langToggleBtn');

    // تحديث نص زر اللغة (AR / EN)
    function updateLangBtnText() {
        const langText = document.getElementById('langText');
        if (langText && typeof CONFIG !== 'undefined') {
            langText.textContent = CONFIG.LANG === 'ar' ? 'EN' : 'AR';
        }
    }

    // --- تسجيل الدخول (Login) ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const payload = {
                email: loginEmailInput?.value.trim(),
                password: loginPasswordInput?.value
            };

            const submitBtn = loginForm.querySelector('button[type="submit"]');

            try {
                if (submitBtn) submitBtn.disabled = true;

                // إرسال طلب تسجيل الدخول إلى AuthController في الـ Backend مع إضافة api/
                const response = await CONFIG.request('/api/auth/login', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });

                if (response && response.token) {
                    // حفظ JWT Token وبيانات المستخدم في التخزين المحلي
                    localStorage.setItem('auth_token', response.token);
                    localStorage.setItem('user_info', JSON.stringify(response.user));

                    alert(CONFIG.t('msgLoginSuccess') || 'تم تسجيل الدخول بنجاح');
                    
                    // التوجيه إلى لوحة التحكم الرئيسية
                    window.location.href = 'dashboard.html';
                }
            } catch (error) {
                alert(error.message || 'فشل تسجيل الدخول، تحقق من البيانات');
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    // --- إنشاء حساب جديد (Register) ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const password = regPasswordInput?.value;
            const confirmPassword = regConfirmPasswordInput?.value;

            // التحقق من تطابق كلمتي المرور
            if (password !== confirmPassword) {
                alert(CONFIG.t('errPasswordMismatch') || 'كلمتا المرور غير متطابقتين');
                return;
            }

            const payload = {
                fullName: regFullNameInput?.value.trim(),
                email: regEmailInput?.value.trim(),
                password: password,
                role: regRoleSelect?.value || 'Doctor'
            };

            const submitBtn = registerForm.querySelector('button[type="submit"]');

            try {
                if (submitBtn) submitBtn.disabled = true;

                // إرسال طلب إنشاء الحساب إلى AuthController في الـ Backend مع إضافة api/
                await CONFIG.request('/api/auth/register', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });

                alert(CONFIG.t('msgRegisterSuccess') || 'تم إنشاء الحساب بنجاح');
                
                // التوجيه إلى صفحة تسجيل الدخول
                window.location.href = 'login.html';
            } catch (error) {
                alert(error.message || 'فشل إنشاء الحساب');
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    // --- زر تبديل اللغة ---
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const newLang = CONFIG.LANG === 'ar' ? 'en' : 'ar';
            CONFIG.applyTranslations(newLang);
            updateLangBtnText();
        });
    }
});
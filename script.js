// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // Phone number formatting for Kazakhstan
    const phoneInput = document.getElementById('phone');

    if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');

        // Start with +7
        if (value.length > 0) {
            if (value[0] === '8') {
                value = '7' + value.substring(1);
            } else if (value[0] !== '7') {
                value = '7' + value;
            }
        }

        // Format: +7 (XXX) XXX-XX-XX
        let formattedValue = '+7';

        if (value.length > 1) {
            formattedValue += ' (' + value.substring(1, 4);
        }
        if (value.length >= 5) {
            formattedValue += ') ' + value.substring(4, 7);
        }
        if (value.length >= 8) {
            formattedValue += '-' + value.substring(7, 9);
        }
        if (value.length >= 10) {
            formattedValue += '-' + value.substring(9, 11);
        }

        e.target.value = formattedValue;
    });

    // Set initial placeholder
    phoneInput.addEventListener('focus', function(e) {
        if (e.target.value === '') {
            e.target.value = '+7 (';
        }
    });

    phoneInput.addEventListener('blur', function(e) {
        if (e.target.value === '+7 (' || e.target.value === '+7') {
            e.target.value = '';
        }
    });
    }

    // Smooth scroll for CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            const formSection = document.getElementById('form');
            if (formSection) {
                formSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Form submission handler
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        let phoneValue = document.getElementById('phone').value;

        // Convert +7 to 8 format
        phoneValue = phoneValue.replace('+7', '8');

        const formData = {
            studentName: document.getElementById('studentName').value,
            schoolName: document.getElementById('schoolName').value,
            grade: document.getElementById('grade').value,
            language: document.getElementById('language').value,
            phone: phoneValue
        };

        // Validate phone number (must be complete)
        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (phoneDigits.length !== 11) {
            alert('Пожалуйста, введите полный номер телефона');
            return;
        }

        // Disable submit button to prevent double submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';

        // IMPORTANT: Replace this URL with your Google Apps Script Web App URL
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwzhxXQDArqotuEmifDNqKDfGX3hksvEpDPyv7jM-6fiPY8lx36StRKPENpl1FfU9w/exec';

        // Send data to Google Sheets
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(() => {
            // Store form data for RIASEC test
            sessionStorage.setItem('studentName', formData.studentName);
            sessionStorage.setItem('studentPhone', formData.phone);
            sessionStorage.setItem('studentGrade', formData.grade);

            // Show success message
            alert('Спасибо за вашу заявку! Сейчас вы пройдете профориентационный тест.');

            // Redirect to RIASEC test
            window.location.href = 'riasec-test.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Произошла ошибка. Пожалуйста, попробуйте еще раз.');
        })
        .finally(() => {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = 'Получить бесплатно';
        });
    });
    }

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const sections = document.querySelectorAll('.logos-section, .images-section, .form-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

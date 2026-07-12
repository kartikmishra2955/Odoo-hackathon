/* ==========================================
   ASSETFLOW - LOGIN & SIGNUP JAVASCRIPT
   Client-Side Validation & Form Handling
   ========================================== */

// ==========================================
// GLOBAL VARIABLES & CONSTANTS
// ==========================================

const TAB_BUTTONS = document.querySelectorAll('.tab-btn');
const FORM_CONTAINERS = document.querySelectorAll('.form-container');
const LOGIN_FORM = document.getElementById('loginForm');
const SIGNUP_FORM = document.getElementById('signupForm');
const SWITCH_FORM_LINKS = document.querySelectorAll('.switch-form-link');

// Validation regex patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const NAME_MIN_LENGTH = 2;

// ==========================================
// TAB NAVIGATION
// ==========================================

/**
 * Initialize tab navigation
 * Handles switching between Login and Signup forms
 */
function initTabs() {
    TAB_BUTTONS.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });

    SWITCH_FORM_LINKS.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(link.dataset.tab);
        });
    });
}

/**
 * Switch active tab and form
 * @param {string} tabName - The tab to switch to ('login' or 'signup')
 */
function switchTab(tabName) {
    // Update active tab button
    TAB_BUTTONS.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update active form container
    FORM_CONTAINERS.forEach(container => {
        container.classList.toggle('active', container.id === `${tabName}-form`);
    });

    // Reset forms and clear messages
    if (tabName === 'login') {
        LOGIN_FORM.reset();
        clearAllErrorMessages('login');
    } else {
        SIGNUP_FORM.reset();
        clearAllErrorMessages('signup');
    }
}

// ==========================================
// PASSWORD VISIBILITY TOGGLE
// ==========================================

/**
 * Toggle password field visibility
 * @param {string} inputId - The ID of the password input field
 */
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

// ==========================================
// VALIDATION FUNCTIONS
// ==========================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
function validateEmail(email) {
    return EMAIL_REGEX.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and message
 */
function validatePassword(password) {
    if (password.length < MIN_PASSWORD_LENGTH) {
        return {
            isValid: false,
            message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
        };
    }
    return { isValid: true, message: '' };
}

/**
 * Validate name format
 * @param {string} name - Name to validate
 * @returns {object} Validation result with isValid and message
 */
function validateName(name) {
    const trimmedName = name.trim();
    if (trimmedName.length < NAME_MIN_LENGTH) {
        return {
            isValid: false,
            message: 'Name must be at least 2 characters long'
        };
    }
    // Check if name contains only letters, spaces, and hyphens
    if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) {
        return {
            isValid: false,
            message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
        };
    }
    return { isValid: true, message: '' };
}

/**
 * Show error message for a field
 * @param {string} fieldId - The ID of the error message element
 * @param {string} message - The error message to display
 */
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

/**
 * Clear error message for a field
 * @param {string} fieldId - The ID of the error message element
 */
function clearError(fieldId) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

/**
 * Clear all error messages for a form
 * @param {string} formType - 'login' or 'signup'
 */
function clearAllErrorMessages(formType) {
    const errorElements = document.querySelectorAll(`#${formType}-form .error-message`);
    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.remove('show');
    });
}

// ==========================================
// LOGIN FORM VALIDATION & SUBMISSION
// ==========================================

/**
 * Validate login form
 * @returns {boolean} True if form is valid
 */
function validateLoginForm() {
    clearAllErrorMessages('login');
    let isValid = true;

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    // Validate email
    if (!email) {
        showError('login-email-error', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('login-email-error', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate password
    if (!password) {
        showError('login-password-error', 'Password is required');
        isValid = false;
    } else if (password.length < 1) {
        showError('login-password-error', 'Password is required');
        isValid = false;
    }

    return isValid;
}

/**
 * Handle login form submission
 * @param {Event} e - Form submit event
 */
LOGIN_FORM.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateLoginForm()) {
        return;
    }

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const rememberMe = document.querySelector('input[name="remember-me"]').checked;

    const statusElement = document.getElementById('login-status');
    const submitBtn = LOGIN_FORM.querySelector('.submit-btn');

    try {
        // Show loading state
        statusElement.textContent = 'Signing in...';
        statusElement.classList.add('show', 'loading');
        submitBtn.disabled = true;

        // ==========================================
        // BACKEND API INTEGRATION POINT
        // ==========================================
        // Replace the following with your actual backend API call:
        // 
        // Example using fetch:
        // const response = await fetch('YOUR_BACKEND_URL/api/auth/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         // Add any authentication headers if needed
        //     },
        //     body: JSON.stringify({
        //         email: email,
        //         password: password,
        //         rememberMe: rememberMe
        //     })
        // });
        //
        // const data = await response.json();
        //
        // if (!response.ok) {
        //     throw new Error(data.message || 'Login failed');
        // }
        //
        // // Store session token/JWT in localStorage or sessionStorage
        // localStorage.setItem('authToken', data.token);
        // localStorage.setItem('userEmail', email);
        //
        // // Redirect to dashboard
        // window.location.href = '/dashboard';
        // ==========================================

        // Simulated API call (remove in production)
        await simulateApiCall(1500);

        // Success response
        statusElement.textContent = '✓ Login successful! Redirecting...';
        statusElement.classList.remove('loading');
        statusElement.classList.add('success');

        // Simulated redirect (replace with actual backend response)
        setTimeout(() => {
            console.log('Redirect to dashboard with credentials:', { email, rememberMe });
            // window.location.href = '/dashboard';
        }, 1500);

    } catch (error) {
        statusElement.textContent = `✕ ${error.message || 'Login failed. Please try again.'}`;
        statusElement.classList.remove('loading');
        statusElement.classList.add('error', 'show');
        console.error('Login error:', error);

    } finally {
        submitBtn.disabled = false;
    }
});

// ==========================================
// SIGNUP FORM VALIDATION & SUBMISSION
// ==========================================

/**
 * Validate signup form
 * @returns {boolean} True if form is valid
 */
function validateSignupForm() {
    clearAllErrorMessages('signup');
    let isValid = true;

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const termsAccepted = document.querySelector('input[name="terms"]').checked;

    // Validate name
    if (!name) {
        showError('signup-name-error', 'Full name is required');
        isValid = false;
    } else {
        const nameValidation = validateName(name);
        if (!nameValidation.isValid) {
            showError('signup-name-error', nameValidation.message);
            isValid = false;
        }
    }

    // Validate email
    if (!email) {
        showError('signup-email-error', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('signup-email-error', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate password
    if (!password) {
        showError('signup-password-error', 'Password is required');
        isValid = false;
    } else {
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            showError('signup-password-error', passwordValidation.message);
            isValid = false;
        }
    }

    // Validate password confirmation
    if (!confirmPassword) {
        showError('signup-confirm-password-error', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('signup-confirm-password-error', 'Passwords do not match');
        isValid = false;
    }

    // Validate terms acceptance
    if (!termsAccepted) {
        showError('signup-terms-error', 'You must accept the Terms of Service and Privacy Policy');
        isValid = false;
    }

    return isValid;
}

/**
 * Handle signup form submission
 * @param {Event} e - Form submit event
 */
SIGNUP_FORM.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateSignupForm()) {
        return;
    }

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    const statusElement = document.getElementById('signup-status');
    const submitBtn = SIGNUP_FORM.querySelector('.submit-btn');

    try {
        // Show loading state
        statusElement.textContent = 'Creating your account...';
        statusElement.classList.add('show', 'loading');
        submitBtn.disabled = true;

        // ==========================================
        // BACKEND API INTEGRATION POINT
        // ==========================================
        // Replace the following with your actual backend API call:
        //
        // Example using fetch:
        // const response = await fetch('YOUR_BACKEND_URL/api/auth/signup', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         name: name,
        //         email: email,
        //         password: password,
        //         role: 'Employee'  // Default role as per requirements
        //     })
        // });
        //
        // const data = await response.json();
        //
        // if (!response.ok) {
        //     throw new Error(data.message || 'Signup failed');
        // }
        //
        // // Optional: Automatically log in the user
        // localStorage.setItem('authToken', data.token);
        //
        // // Redirect to onboarding or dashboard
        // window.location.href = '/onboarding';
        // ==========================================

        // Simulated API call (remove in production)
        await simulateApiCall(2000);

        // Success response
        statusElement.textContent = '✓ Account created successfully! Logging you in...';
        statusElement.classList.remove('loading');
        statusElement.classList.add('success');

        // Simulated redirect (replace with actual backend response)
        setTimeout(() => {
            console.log('Account created with:', { name, email, role: 'Employee' });
            // window.location.href = '/onboarding';
        }, 1500);

    } catch (error) {
        statusElement.textContent = `✕ ${error.message || 'Signup failed. Please try again.'}`;
        statusElement.classList.remove('loading');
        statusElement.classList.add('error', 'show');
        console.error('Signup error:', error);

    } finally {
        submitBtn.disabled = false;
    }
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Simulate API call with delay (for development/testing)
 * Remove this function when implementing real backend API
 * @param {number} delay - Delay in milliseconds
 * @returns {Promise}
 */
function simulateApiCall(delay) {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    });
}

// ==========================================
// INITIALIZE ON PAGE LOAD
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    console.log('AssetFlow Login & Signup Page Initialized');
});

// ==========================================
// FORGOT PASSWORD HANDLER (Placeholder)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordLink = document.querySelector('.forgot-password-link');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Forgot Password functionality will be implemented.\nYou will be redirected to a password reset page.');
            // Replace with actual forgot password flow:
            // window.location.href = '/forgot-password';
        });
    }
});

// ==========================================
// REAL-TIME VALIDATION (Optional Enhancement)
// ==========================================

/**
 * Add real-time email validation
 */
document.addEventListener('DOMContentLoaded', () => {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', () => {
            const formType = input.closest('.form-container').id.split('-')[0];
            if (input.value.trim() && !validateEmail(input.value)) {
                showError(`${formType}-${input.name}-error`, 'Please enter a valid email address');
            } else {
                clearError(`${formType}-${input.name}-error`);
            }
        });
    });
});

/**
 * Add real-time password confirmation check for signup
 */
document.addEventListener('DOMContentLoaded', () => {
    const confirmPasswordInput = document.getElementById('signup-confirm-password');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', () => {
            const password = document.getElementById('signup-password').value;
            if (confirmPasswordInput.value && password !== confirmPasswordInput.value) {
                showError('signup-confirm-password-error', 'Passwords do not match');
            } else {
                clearError('signup-confirm-password-error');
            }
        });
    }
});

// ======== Handle Page Switch ========
// Show registration page when clicking on "Sign Up"
document.getElementById('showRegister').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('registerPage').style.display = 'block';
    document.getElementById('response').innerHTML = ''; // Clear response when switching
});

// Show login page when clicking on "Login"
document.getElementById('showLogin').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('registerPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('response').innerHTML = ''; // Clear response when switching
});

// ======== Handle Registration ========
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            }),
        });

        const data = await response.json();
        if (response.status === 201) {
            document.getElementById('response').innerHTML = `✅ ${data.message}`;
            // Redirect to login after successful registration
            setTimeout(() => {
                document.getElementById('registerPage').style.display = 'none';
                document.getElementById('loginPage').style.display = 'block';
                document.getElementById('response').innerHTML = ''; // Clear response after switch
            }, 1500);
        } else {
            document.getElementById('response').innerHTML = `❌ ${data.error}`;
        }
    } catch (error) {
        document.getElementById('response').innerHTML = `❌ Error: Unable to connect to server.`;
    }
});

// ======== Handle Login ========
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        const data = await response.json();

        if (response.status === 200) {
            document.getElementById('response').innerHTML = `✅ Login successful. Welcome, ${data.username || 'User'}!`;
            setTimeout(() => {
                window.location.href = 'dashboard.html'; // Redirect to dashboard after login
            }, 1000);
        } else if (response.status === 404) {
            document.getElementById('response').innerHTML = `❌ User not available!`;
        } else {
            document.getElementById('response').innerHTML = `❌ ${data.error}`;
        }
    } catch (error) {
        document.getElementById('response').innerHTML = `❌ Error: Unable to connect to server.`;
    }
});

// ======== Handle Admin Login ========
if (document.getElementById('adminLoginForm')) {
    document.getElementById('adminLoginForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

        // Check default admin credentials
        if (username === 'admin' && password === 'admin@123') {
            localStorage.setItem('adminLoggedIn', 'true');
            document.getElementById('response').innerHTML = `✅ Admin login successful.`;
            setTimeout(() => {
                window.location.href = 'dashboard-admin.html';
            }, 1000);
        } else {
            document.getElementById('response').innerHTML = `❌ Invalid admin credentials!`;
        }
    });
}

// ======== Redirect to /admin if route is accessed ========
if (window.location.pathname === '/admin') {
    window.location.href = 'admin.html';
}

// ======== Redirect if Admin Not Logged In ========
if (window.location.pathname === '/dashboard-admin.html' && !localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'admin.html';
}

// ======== Admin Logout ========
function adminLogout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'admin.html';
}

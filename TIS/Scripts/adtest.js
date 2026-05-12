/* adtest.js — AD Test Page scripts
   Place this file in your project's Scripts/ folder.
   The view references it as: ~/Scripts/adtest.js
--------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function () {

    var btnTest = document.getElementById('btn-test');
    var btnSearch = document.getElementById('btn-search');
    var usernameEl = document.getElementById('username-input');
    var btnUpdateMobile = document.getElementById('btn-update-mobile');
    var mobileUsernameEl = document.getElementById('mobile-username-input');
    var mobileNumberEl = document.getElementById('mobile-number-input');

    /* ── Event listeners ──────────────────────────────────────────── */
    btnTest.addEventListener('click', testConnection);
    btnSearch.addEventListener('click', searchUser);
    usernameEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { searchUser(); }
    });

    btnUpdateMobile.addEventListener('click', updateMobile);
    mobileNumberEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { updateMobile(); }
    });

    /* ── Helpers ──────────────────────────────────────────────────── */
    function setLoading(btnId, spinnerId, loading) {
        document.getElementById(btnId).disabled = loading;
        var sp = document.getElementById(spinnerId);
        if (loading) {
            sp.classList.add('active');
        } else {
            sp.classList.remove('active');
        }
    }

    function escHtml(str) {
        if (!str) { return ''; }
        return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /* ── Test Connection ──────────────────────────────────────────── */
    function testConnection() {
        setLoading('btn-test', 'conn-spinner', true);

        var statusEl = document.getElementById('conn-status');
        var msgEl = document.getElementById('conn-msg');
        statusEl.className = '';

        // URL is written by Razor into data-url on the button — no inline script needed
        var url = btnTest.getAttribute('data-url');

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                msgEl.textContent = data.message;
                statusEl.className = 'visible ' + (data.success ? 'success' : 'fail');
            })
            .catch(function (err) {
                msgEl.textContent = 'FAIL — Network error: ' + err.message;
                statusEl.className = 'visible fail';
            })
            .finally(function () { setLoading('btn-test', 'conn-spinner', false); });
    }

    /* ── Search User ──────────────────────────────────────────────── */
    function searchUser() {
        var username = usernameEl.value.trim();
        var box = document.getElementById('result-box');
        box.innerHTML = '';

        if (!username) {
            box.innerHTML = '<div class="error-msg">&#9888;&#65039; Please enter a username before searching.</div>';
            return;
        }

        setLoading('btn-search', 'search-spinner', true);

        // URL is written by Razor into data-url on the button — no inline script needed
        var url = btnSearch.getAttribute('data-url');

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'username=' + encodeURIComponent(username)
        })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (!data.success) {
                    box.innerHTML = '<div class="error-msg">&#9888;&#65039; ' + escHtml(data.message) + '</div>';
                    return;
                }
                var d = data.data;
                box.innerHTML =
                    '<table class="result-table">' +
                    '<tr><td>Employee Name</td><td>' + (escHtml(d.displayName) || '<span class="no-data">&mdash;</span>') + '</td></tr>' +
                    '<tr><td>Email Address</td><td>' + (escHtml(d.email) || '<span class="no-data">&mdash;</span>') + '</td></tr>' +
                    '<tr><td>Department</td><td>' + (escHtml(d.department) || '<span class="no-data">&mdash;</span>') + '</td></tr>' +
                    '<tr><td>Employee Number</td><td>' + (escHtml(d.employeeNumber) || '<span class="no-data">&mdash;</span>') + '</td></tr>' +
                    '<tr><td>Username</td><td>' + (escHtml(d.samAccount) || '<span class="no-data">&mdash;</span>') + '</td></tr>' +
                    '</table>';
            })
            .catch(function (err) {
                box.innerHTML = '<div class="error-msg">&#9888;&#65039; Network error: ' + escHtml(err.message) + '</div>';
            })
            .finally(function () { setLoading('btn-search', 'search-spinner', false); });
    }

    /* ── Update Mobile Number ─────────────────────────────────────── */
    function updateMobile() {
        var username = mobileUsernameEl.value.trim();
        var mobileNumber = mobileNumberEl.value.trim();

        var statusEl = document.getElementById('mobile-status');
        var msgEl = document.getElementById('mobile-msg');
        statusEl.className = '';

        if (!username) {
            msgEl.textContent = '⚠️ Please enter a username.';
            statusEl.className = 'visible fail';
            return;
        }
        if (!mobileNumber) {
            msgEl.textContent = '⚠️ Please enter a mobile number.';
            statusEl.className = 'visible fail';
            return;
        }

        setLoading('btn-update-mobile', 'update-spinner', true);

        var url = btnUpdateMobile.getAttribute('data-url');

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'username=' + encodeURIComponent(username) +
                '&mobileNumber=' + encodeURIComponent(mobileNumber)
        })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                msgEl.textContent = data.message;
                statusEl.className = 'visible ' + (data.success ? 'success' : 'fail');
            })
            .catch(function (err) {
                msgEl.textContent = 'FAIL — Network error: ' + escHtml(err.message);
                statusEl.className = 'visible fail';
            })
            .finally(function () { setLoading('btn-update-mobile', 'update-spinner', false); });
    }

}); // end DOMContentLoaded

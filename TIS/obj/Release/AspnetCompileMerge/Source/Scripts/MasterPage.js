
// Login Modal Functionality
let employeeData = [];
let filteredData = [];


$(document).ready(function () {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNavSidebar = document.getElementById('mobileNavSidebar');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavClose = document.getElementById('mobileNavClose');


    mobileMenuToggle.addEventListener('click', openMobileMenu);
    mobileNavClose.addEventListener('click', closeMobileMenu);
    mobileNavOverlay.addEventListener('click', closeMobileMenu);


    // Mobile Submenu Toggle
    document.querySelectorAll('.mobile-submenu-toggle').forEach(toggle => {
        toggle.addEventListener('click', function () {
            const submenu = this.nextElementSibling;
            this.classList.toggle('active');
            submenu.classList.toggle('active');
        });
    });



    // Desktop and Mobile Login Buttons
    document.getElementById('btnLoginAs').addEventListener('click', openLoginModal);
    document.getElementById('mobileLoginBtn').addEventListener('click', openLoginModal);
    document.getElementById('modalClose').addEventListener('click', closeLoginModal);
    document.getElementById('modalOverlay').addEventListener('click', function (e) {
        if (e.target === this) {
            closeLoginModal();
        }
    });

    // Search Functionality
    document.getElementById('searchInput').addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        filterEmployees(searchTerm);
    });
});

function openMobileMenu() {
    mobileNavSidebar.classList.add('active');
    mobileNavOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileNavSidebar.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    document.body.style.overflow = '';
}



function openLoginModal() {
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('modalContainer').classList.add('active');
    document.body.style.overflow = 'hidden';
    loadEmployees();
    closeMobileMenu(); // Close mobile menu if open
}

function closeLoginModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.getElementById('modalContainer').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('searchInput').value = '';
}


function loadEmployees() {

    $.ajax({
        type: "GET",
        url: "../../Ajax/getEmployees",
        success: function (result) {
            employeeData = result.EmpList;
            filteredData = employeeData;
            renderGrid(filteredData);
        },
        error: function () {
            $('#gridBody').html('<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-text">Failed to load employees. Please try again.</div></div>');
        }
    });

}

function filterEmployees(searchTerm) {
    if (!searchTerm) {
        filteredData = employeeData;
    } else {
        filteredData = employeeData.filter(emp => {
            return (emp.UserName && emp.UserName.toLowerCase().includes(searchTerm)) ||
                (emp.EmpName && emp.EmpName.toLowerCase().includes(searchTerm)) ||
                (emp.EmpNo && emp.EmpNo.toLowerCase().includes(searchTerm));
        });
    }
    renderGrid(filteredData);
}

function renderGrid(data) {
    const gridBody = document.getElementById('gridBody');
    gridBody.innerHTML = '';

    if (data.length === 0) {
        gridBody.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔍</div>' +
            '<div class="empty-state-text">No employees found</div></div>';
        return;
    }

    data.forEach(function (emp) {
        const row = document.createElement('div');
        row.className = 'grid-row';
        row.innerHTML = `
    <div class="grid-cell" data-label="Username">${emp.UserName || ''}</div>
    <div class="grid-cell" data-label="Employee Name">${emp.EmpName || ''}</div>
    <div class="grid-cell" data-label="Employee No">${emp.EmpNo || ''}</div>
    `;

        row.addEventListener('click', function () {
            selectEmployee(emp.UserName);
        });

        gridBody.appendChild(row);
    });
}

function selectEmployee(username) {
    console.log('Selected employee:', username);
    //alert('Login as: ' + username + '\n\nIn production, this will set the session.');
    closeLoginModal();

    debugger;
    fetch('../../User/SetSession?Username=' + encodeURIComponent(username))
        .then(response => response.json())
        .then(result => {
            debugger;
            window.location.href = '../../User/Analyse';
        })
        .catch(error => {
            alert('Failed to set session. Please try again.');
        });

}

// Close modals on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        if (document.getElementById('modalContainer').classList.contains('active')) {
            closeLoginModal();
        }
        if (mobileNavSidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    }
});

// Prevent body scroll when modals are open
window.addEventListener('resize', function () {
    if (window.innerWidth > 991) {
        closeMobileMenu();
    }
});

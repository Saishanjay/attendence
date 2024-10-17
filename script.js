let token = '';

// Function to handle user login
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        
        if (response.ok) {
            token = data.token;
            document.getElementById('attendance-section').style.display = 'block';
            alert('Login successful!');
            fetchAttendanceRecords();
        } else {
            alert('Login failed: ' + data.message);
        }
    } catch (error) {
        alert('Error logging in: ' + error.message);
    }
}

// Function to mark attendance (present or absent)
async function markAttendance(status) {
    try {
        const response = await fetch('http://localhost:5000/mark-attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        if (response.ok) {
            alert('Attendance marked as ' + status);
            fetchAttendanceRecords();
        } else {
            alert('Error marking attendance');
        }
    } catch (error) {
        alert('Error marking attendance: ' + error.message);
    }
}

// Function to fetch attendance records and display them
async function fetchAttendanceRecords() {
    try {
        const response = await fetch('http://localhost:5000/attendance', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const records = await response.json();
        const recordsContainer = document.getElementById('attendance-records');
        recordsContainer.innerHTML = '';

        records.forEach(record => {
            const recordDiv = document.createElement('div');
            recordDiv.className = 'record';
            recordDiv.textContent = `${record.date}: ${record.status}`;
            recordsContainer.appendChild(recordDiv);
        });
    } catch (error) {
        alert('Error fetching attendance records: ' + error.message);
    }
}

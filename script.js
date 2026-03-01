const API_URL = "https://script.google.com/macros/s/AKfycbzbPNczxmRTMd-_Jok0fVAqps_WQdFfrM1Ke-l-3qNEY_WILILzezLfqk1Gv2vSruDBng/exec";

async function fetchData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // ១. បង្ហាញទិន្នន័យគ្រូ
        const teacherBody = document.getElementById('teacher-body');
        teacherBody.innerHTML = ""; // លុបទិន្នន័យចាស់ចោលសិន
        
        let totalBudget = 0;
        data.teachers.forEach(t => {
            let row = `<tr>
                <td><b>${t.ឈ្មោះគ្រូ || '---'}</b></td>
                <td>${t.ចំនួនសិស្ស || 0}</td>
                <td>${t.ថវិកាសរុប || 0}</td>
                <td style="color:blue;">${t.ប្រាក់បំប៉ន || 0}</td>
            </tr>`;
            teacherBody.innerHTML += row;
            totalBudget += parseFloat(String(t.ថវិកាសរុប).replace(/,/g, '')) || 0;
        });

        document.getElementById('total-teachers').innerText = data.teachers.length + " នាក់";
        document.getElementById('total-budget').innerText = totalBudget.toLocaleString() + " ៛";

        // ២. បង្ហាញទិន្នន័យសិស្ស
        const studentContainer = document.getElementById('student-container');
        studentContainer.innerHTML = data.students.map(s => `
            <div class="card" style="margin-bottom:10px; text-align:left; display:flex; justify-content:space-between;">
                <span>${s.ឈ្មោះសិស្ស}</span>
                <span style="color:#666;">ថ្នាក់ទី ${s.ថ្នាក់}</span>
            </div>
        `).join('');

    } catch (e) {
        console.error("Error:", e);
    }
}

function showPage(pageId, element) {
    // ប្តូរទំព័រ
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId + '-section').classList.add('active');
    
    // ប្តូរពណ៌ប៊ូតុង Nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    element.classList.add('active');
    
    // លាក់ Header បើនៅទំព័រគណនី ដើម្បីឱ្យមើលទៅដូច App
    document.getElementById('app-header').style.display = (pageId === 'account') ? 'none' : 'block';
}

function switchData(type) {
    document.getElementById('teacher-table-container').style.display = (type === 'teachers') ? 'block' : 'none';
    document.getElementById('student-container').style.display = (type === 'students') ? 'block' : 'none';
    
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

window.onload = fetchData;

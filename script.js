// ជំនួស URL ខាងក្រោមនេះជាមួយ URL ដែលបានមកពី Google Apps Script របស់អ្នក
const API_URL = "https://script.google.com/macros/s/AKfycbzbPNczxmRTMd-_Jok0fVAqps_WQdFfrM1Ke-l-3qNEY_WILILzezLfqk1Gv2vSruDBng/exec";

async function fetchData() {
    const tableBody = document.getElementById('teacher-table-body');
    const totalTeachersEl = document.getElementById('total-teachers');
    const totalBudgetEl = document.getElementById('total-budget');

    // បង្ហាញ Loading ពេលកំពុងទាញទិន្នន័យ
    tableBody.innerHTML = "<tr><td colspan='4'>កំពុងទាញទិន្នន័យ...</td></tr>";

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // ១. បង្ហាញទិន្នន័យគ្រូ (Teachers)
        if (data.teachers && data.teachers.length > 0) {
            tableBody.innerHTML = data.teachers.map(t => `
                <tr>
                    <td><b>${t.ឈ្មោះគ្រូ || t.Name}</b></td>
                    <td>${t.ចំនួនសិស្ស || 0} នាក់</td>
                    <td>${t.ថវិកាសរុប || 0} ៛</td>
                    <td style="color: #1a73e8; font-weight: bold;">${t.ប្រាក់បំប៉ន || 0} ៛</td>
                </tr>
            `).join('');

            // បច្ចុប្បន្នភាពកាតសរុបខាងលើ
            totalTeachersEl.innerText = `${data.teachers.length} នាក់`;
            
            // គណនាសរុបថវិកា (បើក្នុង Sheet មាន Column ឈ្មោះ 'ថវិកាសរុប')
            let sum = data.teachers.reduce((acc, curr) => acc + (parseFloat(curr.ថវិកាសរុប) || 0), 0);
            totalBudgetEl.innerText = sum.toLocaleString() + " ៛";
        }

        // ២. បង្ហាញទិន្នន័យសិស្ស (Students)
        const studentList = document.getElementById('student-list');
        if (data.students) {
            studentList.innerHTML = data.students.map(s => `
                <div class="card" style="margin-bottom: 10px; text-align: left;">
                    <div style="display: flex; justify-content: space-between;">
                        <span><b>${s.ឈ្មោះសិស្ស || 'មិនស្គាល់'}</b></span>
                        <span class="status-badge">${s.ស្ថានភាព || 'រៀន'}</span>
                    </div>
                    <small>ថ្នាក់ទី៖ ${s.ថ្នាក់ || 'N/A'}</small>
                </div>
            `).join('');
        }

    } catch (error) {
        tableBody.innerHTML = "<tr><td colspan='4' style='color:red;'>ការទាញទិន្នន័យមានបញ្ហា!</td></tr>";
        console.error("Error fetching data:", error);
    }
}

function showTab(tab) {
    document.getElementById('teachers-section').style.display = (tab === 'teachers') ? 'block' : 'none';
    document.getElementById('students-section').style.display = (tab === 'students') ? 'block' : 'none';
    
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// ហៅឱ្យដំណើរការពេលបើក Web ដំបូង
window.onload = fetchData;
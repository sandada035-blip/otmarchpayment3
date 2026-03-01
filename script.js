const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzbPNczxmRTMd-_Jok0fVAqps_WQdFfrM1Ke-l-3qNEY_WILILzezLfqk1Gv2vSruDBng/exec"; 
let globalData = { teachers: [], students: [] };

async function loadAllData() {
    const listElement = document.getElementById('data-list');
    
    try {
        const res = await fetch(SCRIPT_URL);
        globalData = await res.json();
        
        // ១. បង្ហាញទិន្នន័យគ្រូដំបូង
        renderTeachers();
        
        // ២. គណនាស្ថិតិសរុប (ប្រើឈ្មោះ "ថវិកាប្រមូលបាន" តាម Google Sheet)
        document.getElementById('total-teachers').innerText = globalData.teachers.length + " នាក់";
        
        let total = globalData.teachers.reduce((sum, t) => {
            // លុបពាក្យ KHR ឬសញ្ញាផ្សេងៗចេញមុននឹងបូកលេខ
            let value = String(t['ថវិកាប្រមូលបាន'] || 0).replace(/[^\d]/g, '');
            return sum + (parseInt(value) || 0);
        }, 0);
        
        document.getElementById('total-budget').innerText = total.toLocaleString() + " ៛";
        
    } catch (err) {
        listElement.innerHTML = `<p style="color:red; text-align:center;">ការតភ្ជាប់មានបញ្ហា!</p>`;
    }
}

function renderTeachers() {
    const container = document.getElementById('data-list');
    if (!globalData.teachers.length) return;

    container.innerHTML = globalData.teachers.map(t => `
        <div class="data-row">
            <div class="data-info">
                <b>${t['ឈ្មោះគ្រូ'] || 'មិនស្គាល់ឈ្មោះ'}</b>
                <span>ចំនួនសិស្ស: ${t['ចំនួនសិស្ស'] || 0} នាក់</span>
            </div>
            <div class="data-val">
                ${t['ថវិកាគ្រូ 80%'] || 0}
                <small style="display:block; font-size:10px; color:#64748b;">(៨០%)</small>
            </div>
        </div>
    `).join('');
}

function renderStudents() {
    const container = document.getElementById('data-list');
    if (!globalData.students.length) return;

    container.innerHTML = globalData.students.map(s => `
        <div class="data-row">
            <div class="data-info">
                <b>${s['ឈ្មោះសិស្ស'] || 'សិស្ស'}</b>
                <span>ថ្នាក់ទី ${s['ថ្នាក់'] || '...'}</span>
            </div>
            <div class="data-val" style="font-size: 0.8rem; color:#64748b;">
                គ្រូបង្គោល: ${s['ឈ្មោះគ្រូ'] || 'N/A'}
            </div>
        </div>
    `).join('');
}

function switchContent(type, btn) {
    document.querySelectorAll('.tab-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    type === 'teachers' ? renderTeachers() : renderStudents();
}

function navigate(page, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page + '-page').classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

window.onload = loadAllData;

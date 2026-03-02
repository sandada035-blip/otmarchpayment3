const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz8egbJLZlZM7Nbv55r0uyMyRon8xE0kSl1logxqg8DJyuYBtNYG3KKGtty-0HMGZzObQ/exec"; 
let globalData = { teachers: [], students: [] };
let currentView = 'teachers';

async function loadAllData() {
    try {
        const res = await fetch(SCRIPT_URL);
        globalData = await res.json();
        
        // បង្ហាញចំនួនគ្រូសរុប
        document.getElementById('total-teachers').innerText = globalData.teachers.length + " នាក់";
        
        // គណនាថវិកាសរុបដោយឆ្កឹះយកតែលេខ (ដោះស្រាយបញ្ហាជាប់អក្សរ KHR)
        let total = globalData.teachers.reduce((sum, t) => {
            let val = String(t['ថវិកាប្រមូលបាន'] || "0").replace(/[^\d]/g, '');
            return sum + (parseInt(val) || 0);
        }, 0);
        document.getElementById('total-budget').innerText = total.toLocaleString() + " ៛";
        
        renderTeachers();
    } catch (err) {
        document.getElementById('data-list').innerHTML = "ការតភ្ជាប់មានបញ្ហា!";
    }
}

// បង្ហាញទិន្នន័យគ្រូ (១០០%, ៨០%, ២០%)
function renderTeachers(filter = "") {
    currentView = 'teachers';
    const container = document.getElementById('data-list');
    const filtered = globalData.teachers.filter(t => (t['ឈ្មោះគ្រូ'] || "").toLowerCase().includes(filter.toLowerCase()));

    container.innerHTML = filtered.map(t => `
        <div class="data-row">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <b>${t['ឈ្មោះគ្រូ']}</b>
                <span class="badge" style="background:#e0e7ff; color:#4338ca;">${t['ចំនួនសិស្ស']} សិស្ស</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
                <div class="box-val" style="background:#f1f5f9; text-align:center; border-radius:10px; padding:5px;">
                    <small style="font-size:10px; color:#64748b;">១០០%</small><br><b>${t['ថវិកាប្រមូលបាន']}</b>
                </div>
                <div class="box-val" style="background:#e0f2fe; text-align:center; border-radius:10px; padding:5px; color:#0369a1;">
                    <small style="font-size:10px;">៨០%</small><br><b>${t['ថវិកាគ្រូ 80%']}</b>
                </div>
                <div class="box-val" style="background:#fef2f2; text-align:center; border-radius:10px; padding:5px; color:#b91c1c;">
                    <small style="font-size:10px;">២០%</small><br><b>${t['ថវិកាសាលា20%']}</b>
                </div>
            </div>
        </div>
    `).join('');
}

// បង្ហាញទិន្នន័យសិស្ស (តម្លៃសិក្សា, ៨០%, ២០%)
function renderStudents(filter = "") {
    currentView = 'students';
    const container = document.getElementById('data-list');
    const filtered = globalData.students.filter(s => (s['ឈ្មោះសិស្ស'] || "").toLowerCase().includes(filter.toLowerCase()));

    container.innerHTML = filtered.map(s => `
        <div class="data-row" style="border-left: 5px solid #6366f1;">
            <div style="display: flex; justify-content: space-between;">
                <div><b>${s['ឈ្មោះសិស្ស']}</b><br><small>ថ្នាក់: ${s['ថ្នាក់']} | គ្រូ: ${s['ឈ្មោះគ្រូ']}</small></div>
                <div style="text-align:right;"><small>សិក្សា</small><br><b>${s['តម្លៃសិក្សា']}</b></div>
            </div>
            <div style="display: flex; gap: 15px; border-top: 1px dashed #eee; margin-top:8px; padding-top:8px;">
                <div style="flex:1;"><small>គ្រូ ៨០%:</small> <span style="color:#16a34a; font-weight:bold;">${s['ថវិកាគ្រូ 80%']}</span></div>
                <div style="flex:1;"><small>សិស្ស ២០%:</small> <span style="color:#ea580c; font-weight:bold;">${s['ថវិកាសិស្ស 20%']}</span></div>
            </div>
        </div>
    `).join('');
}

// មុខងារប្តូរទំព័រធំ (ទិន្នន័យ vs គណនី)
function navigate(pageId, btn) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId + '-page').classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function switchContent(type, btn) {
    document.getElementById('search-input').value = "";
    document.querySelectorAll('.tab-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    type === 'teachers' ? renderTeachers() : renderStudents();
}

function handleSearch() {
    const q = document.getElementById('search-input').value;
    currentView === 'teachers' ? renderTeachers(q) : renderStudents(q);
}

window.onload = loadAllData;


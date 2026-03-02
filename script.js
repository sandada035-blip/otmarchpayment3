const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzkruguofcfE8_RulcgD79XtIyrYkqYIsUb1C4C99XnMZsUrfws2PKb3rGk9Ype6P8b6A/exec"; 
let globalData = { teachers: [], students: [] };
let currentView = 'teachers';

async function loadAllData() {
    try {
        const res = await fetch(SCRIPT_URL);
        globalData = await res.json();
        
        // បង្ហាញស្ថិតិ (៤ នាក់ និង ៥៨០,០០០ ៛)
        document.getElementById('total-teachers').innerText = globalData.teachers.length + " នាក់";
        let total = globalData.teachers.reduce((sum, t) => {
            let val = String(t['ថវិកាប្រមូលបាន'] || "0").replace(/[^\d]/g, '');
            return sum + (parseInt(val) || 0);
        }, 0);
        document.getElementById('total-budget').innerText = total.toLocaleString() + " ៛";
        
        renderTeachers(); // បង្ហាញគ្រូដំបូងគេ
    } catch (err) {
        document.getElementById('data-list').innerHTML = "ការតភ្ជាប់មានបញ្ហា!";
    }
}

// បង្ហាញតែទិន្នន័យគ្រូ (១០០%, ៨០%, ២០%)
function renderTeachers(filter = "") {
    currentView = 'teachers';
    const container = document.getElementById('data-list');
    const filtered = globalData.teachers.filter(t => (t['ឈ្មោះគ្រូ'] || "").toLowerCase().includes(filter.toLowerCase()));

    container.innerHTML = filtered.map(t => `
        <div class="data-row">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <b>${t['ឈ្មោះគ្រូ']}</b>
                <span class="badge" style="background:#e0e7ff; color:#4338ca;">${t['ចំនួនសិស្ស']} សិស្ស</span>
            </div>
            <div class="grid-3" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
                <div class="box-val" style="background:#f1f5f9;"><small>១០០%</small><br><b>${t['ថវិកាប្រមូលបាន']}</b></div>
                <div class="box-val" style="background:#e0f2fe; color:#0369a1;"><small>៨០%</small><br><b>${t['ថវិកាគ្រូ 80%']}</b></div>
                <div class="box-val" style="background:#fef2f2; color:#b91c1c;"><small>២០%</small><br><b>${t['ថវិកាសាលា20%']}</b></div>
            </div>
        </div>
    `).join('');
}

// បង្ហាញតែទិន្នន័យសិស្ស (តម្លៃសិក្សា, ៨០%, ២០%)
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
            <div style="display: flex; gap: 20px; border-top: 1px dashed #eee; margin-top:10px; padding-top:10px;">
                <div><small>គ្រូ ៨០%:</small> <span style="color:#16a34a; font-weight:bold;">${s['ថវិកាគ្រូ 80%']}</span></div>
                <div><small>សិស្ស ២០%:</small> <span style="color:#ea580c; font-weight:bold;">${s['ថវិកាសិស្ស 20%']}</span></div>
            </div>
        </div>
    `).join('');
}

// មុខងារប្តូរទំព័រធំ (ទិន្នន័យ vs គណនី)
function navigate(pageId, btn) {
    // លាក់គ្រប់ទំព័រ រួចបង្ហាញតែទំព័រដែលជ្រើសរើស
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId + '-page').classList.add('active');
    
    // ប្តូរពណ៌ប៊ូតុង Nav
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// មុខងារប្តូរ Tab ក្នុងទំព័រទិន្នន័យ
function switchContent(type, btn) {
    document.getElementById('search-input').value = "";
    document.querySelectorAll('.tab-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    if (type === 'teachers') {
        renderTeachers();
    } else {
        renderStudents();
    }
}

function handleSearch() {
    const q = document.getElementById('search-input').value;
    currentView === 'teachers' ? renderTeachers(q) : renderStudents(q);
}

window.onload = loadAllData;


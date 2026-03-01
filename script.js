const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzkruguofcfE8_RulcgD79XtIyrYkqYIsUb1C4C99XnMZsUrfws2PKb3rGk9Ype6P8b6A/exec"; 
let globalData = { teachers: [], students: [] };

async function loadAllData() {
    const listElement = document.getElementById('data-list');
    listElement.innerHTML = '<div style="text-align:center; padding:20px;">កំពុងទាញទិន្នន័យ...</div>';
    
    try {
        const res = await fetch(SCRIPT_URL);
        globalData = await res.json();
        
        // ១. បច្ចុប្បន្នភាពស្ថិតិសរុប (Statistics)
        // បង្ហាញចំនួនគ្រូសរុប
        document.getElementById('total-teachers').innerText = globalData.teachers.length + " នាក់";
        
        // គណនាថវិកាសរុបពី Column "ថវិកាប្រមូលបាន"
        let total = globalData.teachers.reduce((sum, t) => {
            let value = String(t['ថវិកាប្រមូលបាន'] || "0").replace(/[^\d]/g, '');
            return sum + (parseInt(value) || 0);
        }, 0);
        document.getElementById('total-budget').innerText = total.toLocaleString() + " ៛";
        
        // ២. បង្ហាញទិន្នន័យគ្រូជាលំនាំដើម
        renderTeachers();
        
    } catch (err) {
        console.error(err);
        listElement.innerHTML = `<p style="color:red; text-align:center; padding:20px;">ការតភ្ជាប់មានបញ្ហា! សូមពិនិត្យមើលការ Deploy លើ Google Sheets របស់អ្នក។</p>`;
    }
}

// មុខងារបង្ហាញទិន្នន័យគ្រូ (តាម Data Sheet)
function renderTeachers() {
    const container = document.getElementById('data-list');
    if (!globalData.teachers.length) return;

    container.innerHTML = globalData.teachers.map(t => `
        <div class="data-row">
            <div class="data-info">
                <b style="font-size: 1rem; color: #1e293b;">${t['ឈ្មោះគ្រូ'] || 'មិនស្គាល់ឈ្មោះ'}</b>
                <span style="font-size: 0.8rem; color: #64748b;">ចំនួនសិស្ស: ${t['ចំនួនសិស្ស'] || 0} នាក់</span>
            </div>
            <div class="data-val" style="text-align: right;">
                <span style="color: #6366f1; font-weight: bold;">${t['ថវិកាគ្រូ 80%'] || '0 ៛'}</span>
                <small style="display:block; font-size:10px; color:#94a3b8;">ប្រាក់បំប៉ន (៨០%)</small>
            </div>
        </div>
    `).join('');
}

// មុខងារបង្ហាញទិន្នន័យសិស្ស (តាម Students Sheet)
function renderStudents() {
    const container = document.getElementById('data-list');
    if (!globalData.students.length) return;

    container.innerHTML = globalData.students.map(s => `
        <div class="data-row" style="border-left: 4px solid #6366f1; margin-bottom: 8px; background: #f8fafc;">
            <div class="data-info">
                <b style="font-size: 0.95rem;">${s['ឈ្មោះសិស្ស'] || 'សិស្ស'}</b>
                <span style="font-size: 0.8rem; color: #64748b;">ថ្នាក់ទី ${s['ថ្នាក់'] || '...'}</span>
            </div>
            <div class="data-val" style="text-align: right;">
                <small style="color: #94a3b8; font-size: 10px;">គ្រូបង្គោល</small>
                <div style="font-size: 0.85rem; font-weight: 500;">${s['ឈ្មោះគ្រូ'] || 'N/A'}</div>
            </div>
        </div>
    `).join('');
}

// មុខងារប្តូរ Tab
function switchContent(type, btn) {
    document.querySelectorAll('.tab-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    type === 'teachers' ? renderTeachers() : renderStudents();
}

// មុខងារប្តូរទំព័រ (Navigation)
function navigate(page, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page + '-page').classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

window.onload = loadAllData;


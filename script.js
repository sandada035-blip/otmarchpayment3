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

function renderTeachers() {
    const container = document.getElementById('data-list');
    if (!globalData.teachers.length) return;

    container.innerHTML = globalData.teachers.map(t => `
        <div class="data-row" style="flex-direction: column; align-items: flex-start; gap: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; width: 100%;">
                <b style="font-size: 1.1rem; color: #1e293b;">${t['ឈ្មោះគ្រូ'] || 'មិនស្គាល់ឈ្មោះ'}</b>
                <span class="badge" style="background: #e0e7ff; color: #4338ca;">${t['ចំនួនសិស្ស'] || 0} នាក់</span>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; width: 100%; margin-top: 5px;">
                <div style="text-align: center; background: #f1f5f9; padding: 8px; border-radius: 10px;">
                    <small style="display: block; color: #64748b; font-size: 10px;">សរុប (១០០%)</small>
                    <b style="color: #1e293b; font-size: 0.85rem;">${t['ថវិកាប្រមូលបាន'] || '0 ៛'}</b>
                </div>
                <div style="text-align: center; background: #e0f2fe; padding: 8px; border-radius: 10px;">
                    <small style="display: block; color: #0369a1; font-size: 10px;">គ្រូ (៨០%)</small>
                    <b style="color: #0284c7; font-size: 0.85rem;">${t['ថវិកាគ្រូ 80%'] || '0 ៛'}</b>
                </div>
                <div style="text-align: center; background: #fef2f2; padding: 8px; border-radius: 10px;">
                    <small style="display: block; color: #b91c1c; font-size: 10px;">សាលា (២០%)</small>
                    <b style="color: #dc2626; font-size: 0.85rem;">${t['ថវិកាសាលា20%'] || '0 ៛'}</b>
                </div>
            </div>
        </div>
    `).join('');
}

function renderStudents() {
    const container = document.getElementById('data-list');
    if (!globalData.students.length) return;

    container.innerHTML = globalData.students.map(s => `
        <div class="data-row" style="flex-direction: column; align-items: flex-start; gap: 8px; padding: 15px; border-left: 5px solid #6366f1;">
            <div style="display: flex; justify-content: space-between; width: 100%;">
                <div>
                    <b style="font-size: 1rem;">${s['ឈ្មោះសិស្ស'] || 'សិស្ស'}</b>
                    <div style="font-size: 0.75rem; color: #64748b;">ថ្នាក់ទី: ${s['ថ្នាក់'] || '...'} | គ្រូ: ${s['ឈ្មោះគ្រូ'] || 'N/A'}</div>
                </div>
                <div style="text-align: right;">
                    <small style="display: block; color: #64748b; font-size: 10px;">តម្លៃសិក្សា</small>
                    <b style="color: #1e293b;">${s['តម្លៃសិក្សា'] || '0 ៛'}</b>
                </div>
            </div>
            
            <div style="display: flex; gap: 15px; width: 100%; border-top: 1px dashed #e2e8f0; pt-2; margin-top: 5px; padding-top: 8px;">
                <div style="flex: 1;">
                    <small style="display: block; color: #64748b; font-size: 9px;">គ្រូ (៨០%)</small>
                    <span style="color: #16a34a; font-weight: bold; font-size: 0.85rem;">${s['ថវិកាគ្រូ 80%'] || '0 ៛'}</span>
                </div>
                <div style="flex: 1;">
                    <small style="display: block; color: #64748b; font-size: 9px;">សិស្ស (២០%)</small>
                    <span style="color: #ea580c; font-weight: bold; font-size: 0.85rem;">${s['ថវិកាសិស្ស 20%'] || '0 ៛'}</span>
                </div>
            </div>
        </div>
    `).join('');
}



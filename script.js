const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzkruguofcfE8_RulcgD79XtIyrYkqYIsUb1C4C99XnMZsUrfws2PKb3rGk9Ype6P8b6A/exec"; 
let currentView = 'teachers'; // សម្រាប់ចំណាំថាបច្ចុប្បន្នកំពុងមើល "គ្រូ" ឬ "សិស្ស"

// មុខងារចម្រោះទិន្នន័យពេលស្វែងរក
function handleSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    if (currentView === 'teachers') {
        renderTeachers(query);
    } else {
        renderStudents(query);
    }
}

// កែសម្រួលមុខងារបង្ហាញគ្រូ (បន្ថែម Filter)
function renderTeachers(filter = "") {
    currentView = 'teachers';
    const container = document.getElementById('data-list');
    
    // ចម្រោះយកតែឈ្មោះដែលត្រូវនឹងការស្វែងរក
    const filteredData = globalData.teachers.filter(t => 
        (t['ឈ្មោះគ្រូ'] || "").toLowerCase().includes(filter)
    );

    container.innerHTML = filteredData.map(t => `
        <div class="data-row" style="flex-direction: column; align-items: flex-start; gap: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; width: 100%;">
                <b style="font-size: 1.1rem; color: #1e293b;">${t['ឈ្មោះគ្រូ'] || 'មិនស្គាល់'}</b>
                <span class="badge" style="background: #e0e7ff; color: #4338ca; padding: 2px 10px; border-radius: 10px; font-size: 0.8rem;">${t['ចំនួនសិស្ស'] || 0} នាក់</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; width: 100%;">
                <div style="text-align: center; background: #f1f5f9; padding: 8px; border-radius: 10px;">
                    <small style="display: block; color: #64748b; font-size: 9px;">សរុប (១០០%)</small>
                    <b style="font-size: 0.8rem;">${t['ថវិកាប្រមូលបាន'] || '0 ៛'}</b>
                </div>
                <div style="text-align: center; background: #e0f2fe; padding: 8px; border-radius: 10px;">
                    <small style="display: block; color: #0369a1; font-size: 9px;">គ្រូ (៨០%)</small>
                    <b style="color: #0284c7; font-size: 0.8rem;">${t['ថវិកាគ្រូ 80%'] || '0 ៛'}</b>
                </div>
                <div style="text-align: center; background: #fef2f2; padding: 8px; border-radius: 10px;">
                    <small style="display: block; color: #b91c1c; font-size: 9px;">សាលា (២០%)</small>
                    <b style="color: #dc2626; font-size: 0.8rem;">${t['ថវិកាសាលា20%'] || '0 ៛'}</b>
                </div>
            </div>
        </div>
    `).join('');
}

// កែសម្រួលមុខងារបង្ហាញសិស្ស (បន្ថែម Filter)
function renderStudents(filter = "") {
    currentView = 'students';
    const container = document.getElementById('data-list');
    
    const filteredData = globalData.students.filter(s => 
        (s['ឈ្មោះសិស្ស'] || "").toLowerCase().includes(filter)
    );

    container.innerHTML = filteredData.map(s => `
        <div class="data-row" style="flex-direction: column; align-items: flex-start; gap: 8px; padding: 15px; border-left: 5px solid #6366f1;">
            <div style="display: flex; justify-content: space-between; width: 100%;">
                <div>
                    <b style="font-size: 1rem;">${s['ឈ្មោះសិស្ស'] || 'សិស្ស'}</b>
                    <div style="font-size: 0.75rem; color: #64748b;">ថ្នាក់: ${s['ថ្នាក់'] || '...'} | គ្រូ: ${s['ឈ្មោះគ្រូ'] || 'N/A'}</div>
                </div>
                <div style="text-align: right;">
                    <small style="display: block; color: #64748b; font-size: 9px;">តម្លៃសិក្សា</small>
                    <b style="font-size: 0.9rem;">${s['តម្លៃសិក្សា'] || '0 ៛'}</b>
                </div>
            </div>
            <div style="display: flex; gap: 10px; width: 100%; border-top: 1px dashed #e2e8f0; padding-top: 8px; margin-top: 5px;">
                <div style="flex: 1;">
                    <small style="display: block; color: #64748b; font-size: 9px;">គ្រូ (៨០%)</small>
                    <span style="color: #16a34a; font-weight: bold; font-size: 0.8rem;">${s['ថវិកាគ្រូ 80%'] || '0 ៛'}</span>
                </div>
                <div style="flex: 1;">
                    <small style="display: block; color: #64748b; font-size: 9px;">សិស្ស (២០%)</small>
                    <span style="color: #ea580c; font-weight: bold; font-size: 0.8rem;">${s['ថវិកាសិស្ស 20%'] || '0 ៛'}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// កែសម្រួលមុខងារ switchContent ដើម្បីសម្អាត Search Box ពេលប្តូរ Tab
function switchContent(type, btn) {
    document.getElementById('search-input').value = ""; // លុបអក្សរក្នុង Search box ចេញ
    document.querySelectorAll('.tab-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    type === 'teachers' ? renderTeachers() : renderStudents();
}

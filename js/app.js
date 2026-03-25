document.addEventListener('DOMContentLoaded', () => {
    
    // Elements
    const dateInput = document.getElementById('date-input');
    const contentSelect = document.getElementById('content-select');
    const courseSelect = document.getElementById('course-select');
    
    const printBtn = document.getElementById('btn-print');
    
    // Resources Toggle
    const resToggleBtn = document.getElementById('toggle-resources');
    const resPane = document.getElementById('resources-pane');
    const resCloseBtn = document.getElementById('close-res');
    
    // File Dropzone Elements
    const dropzone = document.getElementById('dz');
    const fileInput = document.getElementById('fi');
    const fileList = document.getElementById('fl');
    
    // Initialize Date
    if(dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    
    // Resources Pane Logic
    if(resToggleBtn && resPane) {
      resToggleBtn.addEventListener('click', () => {
        resPane.classList.toggle('hidden');
      });
    }
    if(resCloseBtn && resPane) {
      resCloseBtn.addEventListener('click', () => {
        resPane.classList.add('hidden');
      });
    }
    
    // Print Logic
    if(printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
    
    // Populate Content Dropdown based on data.js map
    if (typeof subjectMappings !== 'undefined' && contentSelect) {
      Object.keys(subjectMappings).forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        contentSelect.appendChild(option);
      });
    }
    
    // Content selection change populates Course dropdown
    if(contentSelect && courseSelect) {
      contentSelect.addEventListener('change', (e) => {
        const selectedContent = e.target.value;
        courseSelect.innerHTML = '<option disabled selected value="">Select Course</option>';
        
        if (selectedContent && subjectMappings[selectedContent]) {
          courseSelect.disabled = false;
          subjectMappings[selectedContent].forEach(course => {
            const option = document.createElement('option');
            option.value = course;
            option.textContent = course;
            courseSelect.appendChild(option);
          });
        } else {
          courseSelect.disabled = true;
        }
      });
    }
    
    // File Upload Logic
    let uploadedFiles = [];
    
    if(dropzone && fileInput) {
      dropzone.addEventListener('click', () => {
        fileInput.click();
      });
      
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
      });
      
      function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => {
          dropzone.classList.add('dragover');
        }, false);
      });
      
      ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => {
          dropzone.classList.remove('dragover');
        }, false);
      });
      
      dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
      });
      
      fileInput.addEventListener('change', function() {
        handleFiles(this.files);
      });
    }
    
    function handleFiles(files) {
      uploadedFiles = [...uploadedFiles, ...files];
      renderFileList();
    }
    
    function renderFileList() {
      if(!fileList) return;
      fileList.innerHTML = '';
      
      uploadedFiles.forEach((file, index) => {
        const li = document.createElement('li');
        li.className = 'file-item';
        
        li.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-file-alt" style="color:var(--primary)"></i>
            <span style="font-weight: 500; font-size: 0.9em;">${file.name}</span>
          </div>
          <button type="button" class="remove-file" data-index="${index}" title="Remove file">
            <i class="fas fa-times-circle"></i>
          </button>
        `;
        fileList.appendChild(li);
      });
      
      document.querySelectorAll('.remove-file').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-index'));
          uploadedFiles.splice(idx, 1);
          renderFileList();
        });
      });
    }
  });

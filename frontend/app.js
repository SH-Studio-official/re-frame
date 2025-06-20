// Случайный фон для .background
(function() {
  const bgCount = 4;
  const bgNum = Math.floor(Math.random() * bgCount) + 1;
  document.querySelector('.background').style.backgroundImage = `url('../assets/bg-${bgNum}.jpg')`;
})();

const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const previewBlock = document.getElementById('previewBlock');
const previewImg = document.getElementById('previewImg');
const previewText = document.getElementById('previewText');
const activeFormat = document.getElementById('activeFormat');
const activeFormatIcon = document.getElementById('activeFormatIcon');
const activeFormatText = document.getElementById('activeFormatText');

let selectedFiles = [];
let selectedForConvert = [];
let conversionResults = [];
let selectedForDownload = [];

const formatIcons = {
  PNG: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='1.5'><path stroke-linecap='round' stroke-linejoin='round' d='M3 16.5V7.5A2.25 2.25 0 0 1 5.25 5.25h13.5A2.25 2.25 0 0 1 21 7.5v9a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 16.5z'/><path stroke-linecap='round' stroke-linejoin='round' d='M3 16.5l4.5-4.5a2.25 2.25 0 0 1 3.18 0l4.32 4.32a2.25 2.25 0 0 0 3.18 0L21 16.5'/><circle cx='8.25' cy='8.25' r='1.25'/></svg>`,
  JPG: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='1.5'><path stroke-linecap='round' stroke-linejoin='round' d='M2.25 19.5V7.5A2.25 2.25 0 0 1 4.5 5.25h2.379a1.5 1.5 0 0 0 1.06-.44l.621-.62A1.5 1.5 0 0 1 9.56 3.75h4.88a1.5 1.5 0 0 1 1.06.44l.621.62a1.5 1.5 0 0 0 1.06.44H19.5a2.25 2.25 0 0 1 2.25 2.25v12a2.25 2.25 0 0 1-2.25 2.25H4.5A2.25 2.25 0 0 1 2.25 19.5z'/><circle cx='12' cy='13.5' r='3.75'/></svg>`,
  WEBP: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='1.5'><circle cx='12' cy='12' r='9'/><path stroke-linecap='round' stroke-linejoin='round' d='M2.25 12h19.5M12 2.25c2.25 3.75 2.25 15.75 0 19.5M12 2.25c-2.25 3.75-2.25 15.75 0 19.5'/></svg>`,
  SVG: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='1.5'><path stroke-linecap='round' stroke-linejoin='round' d='M16.862 3.487a2.25 2.25 0 0 1 3.182 3.182l-12.75 12.75a2.25 2.25 0 0 1-1.06.59l-4.5 1.125a.75.75 0 0 1-.91-.91l1.125-4.5a2.25 2.25 0 0 1 .59-1.06l12.75-12.75z'/></svg>`,
  ICO: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='1.5'><rect x='3' y='5' width='18' height='14' rx='2'/><path stroke-linecap='round' stroke-linejoin='round' d='M3 9h18'/></svg>`,
  HEIC: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 1000 1000" stroke="currentColor" stroke-width="60" stroke-linecap="round" stroke-linejoin="round"><path d="M878 697C878 697 878 697 878 697C873 711 868 725 862 739C849 770 832 799 814 826C788 862 767 887 751 901C727 924 700 936 671 936C651 936 626 930 597 919C568 907 542 901 518 901C492 901 465 907 436 919C407 930 383 937 365 937C338 938 310 926 283 901C266 886 244 860 218 823C190 784 167 738 149 686C130 630 120 576 120 523C120 463 133 411 159 367C180 332 207 304 241 284C275 264 312 253 352 253C374 253 402 259 438 273C473 286 496 293 506 293C513 293 538 285 581 269C621 255 656 249 683 251C759 257 816 287 854 341C786 382 753 439 753 513C754 570 775 618 816 656C834 674 855 687 878 697M688 55C688 55 688 55 688 55C688 100 672 142 639 181C600 227 552 254 500 250C499 245 499 239 499 233C499 190 518 143 551 106C568 87 589 71 615 58C640 45 665 38 688 37C688 43 688 49 688 55"/></svg>`,
  AVIF: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v-.447a2.25 2.25 0 0 0 .11-.132l4.47-4.47a2.25 2.25 0 0 1 1.34-.521 2.25 2.25 0 0 1 2.249 2.249v.447m0 0c1.33-.044 2.653.225 3.878.741a2.244 2.244 0 0 1 1.424 2.28l-.348 2.087a2.244 2.244 0 0 1-1.424 2.28A18.03 18.03 0 0 1 12 20.94v-5.714c0-.168.011-.336.032-.502M9 17.25H7.5c-.621 0-1.125-.504-1.125-1.125V4.5c0-.621.504-1.125 1.125-1.125h8.25c.621 0 1.125.504 1.125 1.125V6a2.25 2.25 0 0 1-1.125 1.948m0 0a2.25 2.25 0 0 1-2.249 2.249m0 0a2.25 2.25 0 0 0-1.34.521m-4.47 4.47L9 17.25"/></svg>`,
  // ... остальные иконки ...
};

activeFormatIcon.innerHTML = formatIcons[activeFormatText.textContent] || formatIcons['PNG'];

// Helper function to truncate file names
function truncateFileName(fileName, sizeInBytes, maxLength = 55) {
  const fileSize = sizeInBytes ? ` (${Math.round(sizeInBytes/1024)} КБ)` : '';
  if (fileName.length + fileSize.length <= maxLength) {
    return fileName + fileSize;
  }
  const charsToShow = maxLength - fileSize.length - 3; // 3 for "..."
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  
  if (charsToShow < 1) { // Not enough space even for "..." + size
    return "..." + fileSize;
  }

  return `${fileName.substring(0, frontChars)}...${fileName.substring(fileName.length - backChars)}${fileSize}`;
}

function updateMainPanel() {
  if (!selectedFiles.length) {
    dropZone.style.display = '';
    previewBlock.style.display = 'none';
    renderDropZoneContent();
    updateActions(false);
  } else {
    dropZone.style.display = 'none';
    previewBlock.style.display = '';
    renderPreviewBlockContent();
    updateActions(true);
  }
}

function updateActions(showReload) {
  const actions = document.querySelector('.actions');
  // Очищаем все кроме формата и кнопки конвертации
  while (actions.children.length > 3) actions.removeChild(actions.lastChild);
  // Кнопка скачивания результатов
  if (conversionResults.length) {
    let dlBtn = document.createElement('button');
    dlBtn.className = 'glass-btn accent';
    dlBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><rect x="6" y="12" width="12" height="6" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v8m0 0l-3-3m3 3l3-3"/></svg>Выгрузить`;
    dlBtn.disabled = conversionResults.length > 1 ? !selectedForDownload.length : !!conversionResults[0].error;
    dlBtn.onclick = async () => {
      if (conversionResults.length === 1) {
        const res = conversionResults[0];
        if (!res.error) {
          const r = await window.electronAPI.downloadFile(res.path, res.name);
          if (r && r.error) alert('Ошибка сохранения: ' + r.error);
          if (r && r.path) window.electronAPI.openFolder && window.electronAPI.openFolder(r.path);
        }
      } else {
        // Скачивание нескольких файлов — один диалог выбора папки
        const filesToSave = selectedForDownload.filter(f => !f.error).map(f => ({ path: f.path, name: f.name }));
        if (!filesToSave.length) return;
        const r = await window.electronAPI.downloadMultipleFiles(filesToSave);
        if (r && r.error) alert('Ошибка сохранения: ' + r.error);
        // Проводник откроется автоматически через main.js
      }
    };
    actions.appendChild(dlBtn);
  }
  // Кнопка загрузить другие файлы (последняя)
  let reloadBtn = document.createElement('button');
  reloadBtn.className = 'glass-btn';
  reloadBtn.title = 'Загрузить другие файлы';
  reloadBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12a7.5 7.5 0 1 1 2.1 5.3"/><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12V7.5m0 4.5h4.5"/></svg>`;
  reloadBtn.onclick = () => {
    selectedFiles = [];
    selectedForConvert = [];
    conversionResults = [];
    selectedForDownload = [];
    clearResultsBlock();
    updateMainPanel();
  };
  actions.appendChild(reloadBtn);
}

function renderDropZoneContent() {
  dropZone.innerHTML = '';
  const p = document.createElement('p');
  p.innerHTML = 'Перетащите файлы сюда или <label class="file-label"><input type="file" hidden id="fileInput" multiple>выберите файлы</label>';
  dropZone.appendChild(p);
  p.querySelector('input[type="file"]').addEventListener('change', (e) => {
    selectedFiles = Array.from(e.target.files);
    updateMainPanel();
  });
  dropZone.ondragover = (e) => { e.preventDefault(); dropZone.classList.add('hover'); };
  dropZone.ondragleave = (e) => { dropZone.classList.remove('hover'); };
  dropZone.ondrop = (e) => {
    e.preventDefault();
    dropZone.classList.remove('hover');
    selectedFiles = Array.from(e.dataTransfer.files);
    updateMainPanel();
  };
}

function renderPreviewBlockContent() {
  previewBlock.innerHTML = '';
  // --- Список файлов ---
  const list = document.createElement('div');
  list.style.display = 'flex';
  list.style.flexDirection = 'column';
  list.style.width = '100%';
  list.style.gap = '0.5em';
  selectedForConvert = selectedFiles.length === 1 ? [selectedFiles[0]] : [];
  selectedFiles.forEach((file, idx) => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '1em';
    row.style.padding = '0.3em 0.7em';
    row.style.borderRadius = '8px';
    row.style.background = 'rgba(255,255,255,0.04)';
    row.style.justifyContent = 'space-between';
    // Левая часть: миниатюра/иконка + текст
    const left = document.createElement('div');
    left.style.display = 'flex';
    left.style.alignItems = 'center';
    left.style.gap = '1em';
    const fileNameLower = file.name.toLowerCase();
    if (file.type.startsWith('image/') || fileNameLower.endsWith('.ico')) {
      const img = document.createElement('img');
      img.style.maxWidth = '48px';
      img.style.maxHeight = '48px';
      img.style.borderRadius = '8px';
      img.style.boxShadow = '0 1px 4px rgba(30,34,60,0.13)';
      img.style.background = '#222';
      img.style.objectFit = 'contain';
      const reader = new FileReader();
      reader.onload = function(e) { img.src = e.target.result; };
      reader.readAsDataURL(file);
      left.appendChild(img);
    } else {
      const icon = document.createElement('div');
      icon.style.width = '48px';
      icon.style.height = '48px';
      icon.style.borderRadius = '8px';
      icon.style.background = '#222';
      icon.style.display = 'flex';
      icon.style.alignItems = 'center';
      icon.style.justifyContent = 'center';
      icon.innerHTML = '<svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#fff" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>';
      left.appendChild(icon);
    }
    const text = document.createElement('span');
    text.textContent = truncateFileName(file.name, file.size);
    text.style.color = 'var(--color-text-secondary)';
    text.style.fontSize = '1.02em';
    text.style.overflow = 'hidden';
    text.style.textOverflow = 'ellipsis';
    text.style.whiteSpace = 'nowrap';
    left.appendChild(text);
    row.appendChild(left);
    // Чекбокс только если файлов больше одного (справа)
    if (selectedFiles.length > 1) {
      const checkboxWrap = document.createElement('label');
      checkboxWrap.className = 'preview-checkbox';
      checkboxWrap.style.marginLeft = 'auto';
      checkboxWrap.style.alignSelf = 'center';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = false;
      checkbox.addEventListener('change', (e) => {
        if (checkbox.checked) {
          selectedForConvert.push(file);
        } else {
          selectedForConvert = selectedForConvert.filter(f => f !== file);
        }
      });
      const custom = document.createElement('span');
      custom.className = 'custom-checkbox';
      custom.innerHTML = '<svg viewBox="0 0 20 20" fill="none" stroke-width="2"><polyline points="5 11 9 15 15 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      checkboxWrap.appendChild(checkbox);
      checkboxWrap.appendChild(custom);
      row.appendChild(checkboxWrap);
    }
    list.appendChild(row);
  });
  previewBlock.appendChild(list);
}

// При старте
updateMainPanel();

// Модальное окно: выбор формата
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelector('.modal-formats').classList.remove('open');
  }
});
document.querySelector('.modal-formats').addEventListener('click', function(e) {
  if (e.target === this) this.classList.remove('open');
});
document.querySelectorAll('.format-icon').forEach(icon => {
  icon.addEventListener('click', function() {
    document.querySelectorAll('.format-icon').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
    document.querySelector('.modal-formats').classList.remove('open');
    const format = this.getAttribute('data-format');
    activeFormatText.textContent = format;
    activeFormatIcon.innerHTML = formatIcons[format] || formatIcons['PNG'];
  });
});

// showPreview теперь принимает второй аргумент — контейнер для предпросмотра
function showPreview(files, container) {
  if (!files || files.length === 0) {
    if (container) container.innerHTML = '';
    return;
  }
  container = container || previewBlock;
  container.innerHTML = '';
  const list = document.createElement('div');
  list.style.display = 'flex';
  list.style.flexDirection = 'column';
  list.style.width = '100%';
  list.style.gap = '0.5em';
  selectedForConvert = files.length === 1 ? [files[0]] : [];
  files.forEach((file, idx) => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '1em';
    row.style.padding = '0.3em 0.7em';
    row.style.borderRadius = '8px';
    row.style.background = 'rgba(255,255,255,0.04)';
    row.style.justifyContent = 'space-between';
    // Левая часть: миниатюра/иконка + текст
    const left = document.createElement('div');
    left.style.display = 'flex';
    left.style.alignItems = 'center';
    left.style.gap = '1em';
    const fileNameLower = file.name.toLowerCase();
    if (file.type.startsWith('image/') || fileNameLower.endsWith('.ico')) {
      const img = document.createElement('img');
      img.style.maxWidth = '48px';
      img.style.maxHeight = '48px';
      img.style.borderRadius = '8px';
      img.style.boxShadow = '0 1px 4px rgba(30,34,60,0.13)';
      img.style.background = '#222';
      img.style.objectFit = 'contain';
      const reader = new FileReader();
      reader.onload = function(e) {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      left.appendChild(img);
    } else {
      const icon = document.createElement('div');
      icon.style.width = '48px';
      icon.style.height = '48px';
      icon.style.borderRadius = '8px';
      icon.style.background = '#222';
      icon.style.display = 'flex';
      icon.style.alignItems = 'center';
      icon.style.justifyContent = 'center';
      icon.innerHTML = '<svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#fff" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>';
      left.appendChild(icon);
    }
    const text = document.createElement('span');
    text.textContent = truncateFileName(file.name, file.size);
    text.style.color = 'var(--color-text-secondary)';
    text.style.fontSize = '1.02em';
    text.style.overflow = 'hidden';
    text.style.textOverflow = 'ellipsis';
    text.style.whiteSpace = 'nowrap';
    left.appendChild(text);
    row.appendChild(left);
    // Чекбокс только если файлов больше одного (справа)
    if (files.length > 1) {
      const checkboxWrap = document.createElement('label');
      checkboxWrap.className = 'preview-checkbox';
      checkboxWrap.style.marginLeft = 'auto';
      checkboxWrap.style.alignSelf = 'center';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = false;
      checkbox.addEventListener('change', (e) => {
        if (checkbox.checked) {
          selectedForConvert.push(file);
        } else {
          selectedForConvert = selectedForConvert.filter(f => f !== file);
        }
      });
      const custom = document.createElement('span');
      custom.className = 'custom-checkbox';
      custom.innerHTML = '<svg viewBox="0 0 20 20" fill="none" stroke-width="2"><polyline points="5 11 9 15 15 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      checkboxWrap.appendChild(checkbox);
      checkboxWrap.appendChild(custom);
      row.appendChild(checkboxWrap);
    }
    list.appendChild(row);
  });
  container.appendChild(list);
}

function clearResultsBlock() {
  conversionResults = [];
  selectedForDownload = [];
  const old = document.getElementById('resultsBlock');
  if (old) old.remove();
  updateActions(); // чтобы скрыть кнопку скачивания
}

// --- Звуковая обратная связь ---
function playSound(type) {
  let src = '';
  if (type === 'success') src = '../assets/success.mp3';
  if (type === 'error') src = '../assets/error.mp3';
  if (!src) return;
  const audio = new Audio(src);
  audio.volume = 0.5;
  audio.play();
}

function showResultsBlock(results) {
  conversionResults = results;
  selectedForDownload = results.length === 1 ? [results[0]] : [];
  let block = document.getElementById('resultsBlock');
  if (block) block.remove();
  block = document.createElement('div');
  block.id = 'resultsBlock';
  block.className = 'preview glass-panel';
  block.innerHTML = '<b style="color:var(--color-text-main);font-size:1.2em;">Результаты конвертации</b>';
  // --- Список файлов ---
  const list = document.createElement('div');
  list.style.display = 'flex';
  list.style.flexDirection = 'column';
  list.style.width = '100%';
  list.style.gap = '0.5em';
  let hasError = false;
  results.forEach((res, idx) => {
    if (res.error) hasError = true;
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '1em';
    row.style.padding = '0.3em 0.7em';
    row.style.borderRadius = '8px';
    row.style.background = 'rgba(255,255,255,0.04)';
    row.style.justifyContent = 'space-between';
    // Левая часть: миниатюра/иконка + текст
    const left = document.createElement('div');
    left.style.display = 'flex';
    left.style.alignItems = 'center';
    left.style.gap = '1em';
    if (!res.error && (res.thumbnail || (typeof res.path === 'string' && res.path && res.name.match(/\.(png|jpg|jpeg|webp|gif|tiff|avif|ico)$/i)))) {
      const img = document.createElement('img');
      img.style.maxWidth = '48px';
      img.style.maxHeight = '48px';
      img.style.borderRadius = '8px';
      img.style.boxShadow = '0 1px 4px rgba(30,34,60,0.13)';
      img.style.background = '#222';
      img.style.objectFit = 'contain';
      if (res.thumbnail) {
        img.src = res.thumbnail;
      } else if (typeof res.path === 'string' && res.path) {
        img.src = 'file://' + res.path;
      } else {
        img.src = '';
      }
      left.appendChild(img);
    } else {
      const icon = document.createElement('div');
      icon.style.width = '48px';
      icon.style.height = '48px';
      icon.style.borderRadius = '8px';
      icon.style.background = '#222';
      icon.style.display = 'flex';
      icon.style.alignItems = 'center';
      icon.style.justifyContent = 'center';
      icon.innerHTML = '<svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#fff" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>';
      left.appendChild(icon);
    }
    const text = document.createElement('span');
    text.textContent = truncateFileName(res.name, res.size);
    text.style.color = res.error ? '#e66' : 'var(--color-text-secondary)';
    text.style.fontSize = '1.02em';
    text.style.overflow = 'hidden';
    text.style.textOverflow = 'ellipsis';
    text.style.whiteSpace = 'nowrap';
    left.appendChild(text);
    row.appendChild(left);
    // Чекбокс только если файлов больше одного и нет ошибки
    if (results.length > 1 && !res.error) {
      const checkboxWrap = document.createElement('label');
      checkboxWrap.className = 'preview-checkbox';
      checkboxWrap.style.marginLeft = 'auto';
      checkboxWrap.style.alignSelf = 'center';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = selectedForDownload.includes(res);
      checkbox.addEventListener('change', (e) => {
        if (checkbox.checked) {
          selectedForDownload.push(res);
        } else {
          selectedForDownload = selectedForDownload.filter(f => f !== res);
        }
        updateActions();
      });
      const custom = document.createElement('span');
      custom.className = 'custom-checkbox';
      custom.innerHTML = '<svg viewBox="0 0 20 20" fill="none" stroke-width="2"><polyline points="5 11 9 15 15 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      checkboxWrap.appendChild(checkbox);
      checkboxWrap.appendChild(custom);
      row.appendChild(checkboxWrap);
    }
    list.appendChild(row);
  });
  block.appendChild(list);
  // Вставляем блок после preview
  previewBlock.parentNode.insertBefore(block, previewBlock.nextSibling);
  updateActions();
  // --- Воспроизведение звука ---
  if (hasError) playSound('error');
  else playSound('success');
}

// Очищаем результаты при добавлении новых файлов
function onFilesChanged() {
  clearResultsBlock();
  updateMainPanel();
}

let progressBarMinDuration = 1000; // 1 секунда

function showHeaderProgressBar() {
  const bar = document.getElementById('header-progress-bar');
  if (!bar) return;
  let inner = bar.querySelector('.header-progress-inner');
  if (!inner) {
    inner = document.createElement('div');
    inner.className = 'header-progress-inner';
    // Добавляем 7 точек
    for (let i = 0; i < 7; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      inner.appendChild(dot);
    }
    bar.appendChild(inner);
  }
  inner.classList.remove('hide');
  inner.dataset.start = Date.now();
}

function finishHeaderProgressBar() {
  const bar = document.getElementById('header-progress-bar');
  if (!bar) return;
  const inner = bar.querySelector('.header-progress-inner');
  if (!inner) return;
  const start = parseInt(inner.dataset.start || '0', 10);
  const elapsed = Date.now() - start;
  const delay = Math.max(progressBarMinDuration - elapsed, 0);
  setTimeout(() => {
    inner.classList.add('hide');
    setTimeout(() => { if (inner.parentNode) inner.parentNode.removeChild(inner); }, 350);
  }, delay);
}

// Навешиваем обработчик на существующую кнопку 'Конвертировать' после загрузки DOM
window.addEventListener('DOMContentLoaded', () => {
  // Скрыть лоадинг-экран после загрузки
  setTimeout(() => {
    const loading = document.getElementById('loadingScreen');
    if (loading) loading.classList.add('hide');
  }, 1800);
  const actions = document.querySelector('.actions');
  const convertBtn = actions.querySelector('#convertBtn');
  if (convertBtn) {
    const iconHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/></svg>`;
    convertBtn.innerHTML = iconHTML + 'Конвертировать';
    convertBtn.addEventListener('click', async () => {
      if (!selectedFiles.length) return;
      showHeaderProgressBar();
      convertBtn.disabled = true;
      convertBtn.innerHTML = iconHTML + 'Конвертация...';
      // Собираем файлы для конвертации
      const filesToConvert = (selectedFiles.length === 1 ? selectedFiles : selectedForConvert.length ? selectedForConvert : selectedFiles);
      if (!filesToConvert.length) {
        convertBtn.disabled = false;
        convertBtn.innerHTML = iconHTML + 'Конвертировать';
        return;
      }
      // Читаем содержимое файлов
      const fileBuffers = await Promise.all(filesToConvert.map(f => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: f.name, buffer: Array.from(new Uint8Array(reader.result)) });
        reader.onerror = reject;
        reader.readAsArrayBuffer(f);
      })));
      // Получаем формат
      const format = activeFormatText.textContent.trim().toLowerCase();
      // Отправляем на конвертацию
      let results = [];
      try {
        results = await window.electronAPI.convertFiles(fileBuffers, format);
      } catch (e) {
        finishHeaderProgressBar();
        alert('Ошибка конвертации: ' + e.message);
        convertBtn.disabled = false;
        convertBtn.innerHTML = iconHTML + 'Конвертировать';
        return;
      }
      // Показываем результаты
      showResultsBlock(results);
      finishHeaderProgressBar();
      convertBtn.disabled = false;
      convertBtn.innerHTML = iconHTML + 'Конвертировать';
    });
  }
  const removeBgBtn = actions.querySelector('#removeBgBtn');
  if (removeBgBtn) {
    const iconHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <circle cx="6" cy="18" r="2"/>
      <circle cx="6" cy="6" r="2"/>
      <path stroke-linecap="round" stroke-linejoin="round" d="M20 4L8.12 15.88M14.47 14.48L20 20"/>
    </svg>`;
    removeBgBtn.innerHTML = iconHTML + 'Удалить фон';
    removeBgBtn.addEventListener('click', async () => {
      if (!selectedFiles.length) return;
      showHeaderProgressBar();
      removeBgBtn.disabled = true;
      removeBgBtn.innerHTML = iconHTML + 'Удаление...';
      // Только изображения
      const filesToProcess = selectedFiles.filter(f => f.type.startsWith('image/'));
      if (!filesToProcess.length) {
        removeBgBtn.disabled = false;
        removeBgBtn.innerHTML = iconHTML + 'Удалить фон';
        finishHeaderProgressBar();
        alert('Выберите хотя бы одно изображение для удаления фона.');
        return;
      }
      // Читаем содержимое файлов
      const fileBuffers = await Promise.all(filesToProcess.map(f => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: f.name, buffer: Array.from(new Uint8Array(reader.result)) });
        reader.onerror = reject;
        reader.readAsArrayBuffer(f);
      })));
      let results = [];
      try {
        results = await window.electronAPI.removeBg(fileBuffers);
      } catch (e) {
        finishHeaderProgressBar();
        alert('Ошибка удаления фона: ' + e.message);
        removeBgBtn.disabled = false;
        removeBgBtn.innerHTML = iconHTML + 'Удалить фон';
        return;
      }
      showResultsBlock(results);
      finishHeaderProgressBar();
      removeBgBtn.disabled = false;
      removeBgBtn.innerHTML = iconHTML + 'Удалить фон';
    });
  }
  const shStudioFooter = document.getElementById('shStudioFooter');
  if (shStudioFooter && window.electronAPI && window.electronAPI.openExternal) {
    shStudioFooter.style.cursor = 'pointer';
    shStudioFooter.title = 'Перейти на сайт SH Studio';
    shStudioFooter.addEventListener('click', () => {
      window.electronAPI.openExternal('https://annjtt.github.io/sh-studio/');
    });
  }
  // --- Клик по всей зоне drag&drop ---
  if (dropZone) {
    dropZone.addEventListener('click', (e) => {
      // Не срабатывает, если клик по input или по label/file-label или по ссылке внутри label
      if (
        e.target.tagName.toLowerCase() === 'input' ||
        e.target.classList.contains('file-label') ||
        e.target.closest('.file-label')
      ) return;
      const fileInput = dropZone.querySelector('input[type="file"]');
      if (fileInput) fileInput.click();
    });
  }
}); 

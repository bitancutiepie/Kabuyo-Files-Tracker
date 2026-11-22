const KEY = 'kabuyo-project-files-v3';

const DEFAULT_FILES = [
  {
    id: 1, 
    n: 'KaBuyo Web Application (Live Hosted on Render)', 
    u: 'https://kabuyo.onrender.com/index.html?fbclid=IwY2xjawVvuNNleHRuA2FlbQIxMABwZG9mBWJyaWQRMTFVOVBDU1lNREVycW5WeXhzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEfoGFgGQPxcKmWm9tBe8iDD6-WQrEBoVwf-_NxyWyvRpb4zj1la4pL8h8rqEU_aem_Omw18D-Km5vE9bPG0_2c1A', 
    s: 'General', 
    t: 'link'
  },
  {
    id: 2, 
    n: 'KaBuyo PRD - WST & SIA Context', 
    u: 'https://docs.google.com/document/d/1UNaU8BjhKk9IyfQGoLWE3mnrTIqw3FkG1VRyV7fHmiU/edit?tab=t.szsan2jjiips#heading=h.syv5jt9q85t', 
    s: 'SIA', 
    t: 'doc'
  },
  {
    id: 3, 
    n: 'KaBuyo QA - Tester To-Do Tracker', 
    u: 'https://docs.google.com/spreadsheets/d/1Z_BExJWuvXf3tdD2QiSI1pexEN1AkJJtVIy_FQvdg6Y/edit?usp=sharing', 
    s: 'WST', 
    t: 'sheet'
  },
  {
    id: 4, 
    n: 'SIA Final Project Guidelines (BatStateU CICS)', 
    u: './docs/SIA_Final_Project_Guidelines.pdf', 
    s: 'SIA', 
    t: 'pdf'
  },
  {
    id: 5, 
    n: 'IT312 SIA Project Study & Documentation Template', 
    u: './docs/IT312_SIA_Project_Documentation_Template.pdf', 
    s: 'SIA', 
    t: 'pdf'
  }
];

let files = [...DEFAULT_FILES];
let fs = 'All'; // Subject filter
let ft = 'All'; // Type filter
let searchQuery = '';

const $ = id => document.getElementById(id);
const esc = s => (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const typeLabels = {
  pdf: 'PDF Document',
  doc: 'Google Doc',
  sheet: 'Google Sheet',
  slide: 'Slide Deck',
  link: 'Live Web App'
};

function toast(msg) {
  const t = $('toast');
  const m = $('toastMsg');
  if (!t || !m) return;
  m.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

function chips(el, opts, cur, fn, countFn) {
  if (!el) return;
  el.innerHTML = opts.map(o => {
    const isAct = o[0] === cur;
    const cnt = countFn ? countFn(o[0]) : '';
    return `<button type="button" class="chip ${isAct ? 'on' : ''}" data-v="${o[0]}">
      ${I[o[2]] || ''}${o[1]}${cnt !== '' ? `<small>${cnt}</small>` : ''}
    </button>`;
  }).join('');
  
  el.querySelectorAll('.chip').forEach(b => {
    b.onclick = () => {
      fn(b.dataset.v);
      render();
    };
  });
}

function render() {
  // Update subject chips
  chips($('subjects'), 
    [['All','All','all'], ['SIA','SIA','SIA'], ['WST','WST','WST'], ['General','General','General']], 
    fs, 
    v => fs = v,
    v => files.filter(f => (v === 'All' || f.s === v) && (ft === 'All' || f.t === ft)).length
  );

  // Update type chips
  chips($('types'), 
    [['All','All','all'], ['pdf','PDFs','pdf'], ['doc','Docs','doc'], ['sheet','Sheets','sheet'], ['slide','Slides','slide'], ['link','Links','link']], 
    ft, 
    v => ft = v,
    v => files.filter(f => (v === 'All' || f.t === v) && (fs === 'All' || f.s === fs)).length
  );

  // Filter items
  const q = searchQuery.toLowerCase().trim();
  const rows = files.filter(f => {
    const matchSub = (fs === 'All' || f.s === fs);
    const matchType = (ft === 'All' || f.t === ft);
    const matchQuery = !q || f.n.toLowerCase().includes(q) || (f.s && f.s.toLowerCase().includes(q)) || (f.u && f.u.toLowerCase().includes(q));
    return matchSub && matchType && matchQuery;
  });

  const listEl = $('list');
  if (!listEl) return;

  if (!rows.length) {
    listEl.innerHTML = `
      <div class="glass empty">
        ${I.inbox}
        <div>No matching project files found.</div>
        <div style="font-size:12px;margin-top:6px;opacity:.65">Add a new link below or clear your search/filters.</div>
      </div>`;
    return;
  }

  listEl.innerHTML = rows.map((f, idx) => {
    const iconType = I[f.t] ? f.t : 'link';
    const typeLabel = typeLabels[f.t] || 'External Link';
    const subClass = `tag-${f.s || 'General'}`;
    const isPdf = f.t === 'pdf';

    return `
    <div class="glass item-wrapper" style="--delay:${idx}" id="item-${f.id}">
      <div style="display:flex;align-items:center;width:100%">
        <a class="item ${isPdf ? 'pdf-trigger' : ''}" style="flex:1;min-width:0;" href="${esc(f.u)}" ${isPdf ? `data-id="${f.id}"` : 'target="_blank" rel="noopener noreferrer"'} title="${isPdf ? 'Preview ' + esc(f.n) : 'Open ' + esc(f.n)}">
          <div class="ico ${iconType}">${I[iconType]}</div>
          <div class="info">
            <div class="name">${esc(f.n)}</div>
            <div class="meta-row">
              <span class="meta">${typeLabel}</span>
              <span class="meta-dot"></span>
              <span class="tag ${subClass}">${I[f.s] || I.all}${esc(f.s || 'General')}</span>
            </div>
          </div>
          <span class="out-arrow" title="${isPdf ? 'Preview' : 'Open in new tab'}">${isPdf ? I.eye : I.out}</span>
        </a>

        <div class="item-actions">
          ${isPdf ? `
          <button class="preview-btn" data-id="${f.id}" aria-label="Preview ${esc(f.n)}" title="Preview in built-in viewer">
            ${I.eye} Preview
          </button>` : ''}
          <button class="action-btn copy-btn" data-url="${esc(f.u)}" aria-label="Copy link" title="Copy Link">
            ${I.copy}
          </button>
          <button class="del-btn" data-id="${f.id}" aria-label="Remove ${esc(f.n)}" title="Remove File">
            ${I.trash}
          </button>
        </div>
      </div>
    </div>`;
  }).join('');

  // Attach PDF preview handlers
  document.querySelectorAll('.pdf-trigger, .preview-btn').forEach(el => {
    el.onclick = e => {
      e.preventDefault();
      const id = el.dataset.id;
      const file = files.find(item => item.id == id);
      if (file) openPdfModal(file);
    };
  });

  // Attach delete handlers with smooth exit animation
  document.querySelectorAll('.del-btn').forEach(btn => {
    btn.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.dataset.id;
      const wrap = $(`item-${id}`);
      if (wrap) {
        wrap.classList.add('removing');
        setTimeout(() => {
          files = files.filter(f => f.id != id);
          save();
          render();
          toast('File removed');
        }, 220);
      } else {
        files = files.filter(f => f.id != id);
        save();
        render();
      }
    };
  });

  // Attach copy button handlers
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.onclick = async e => {
      e.preventDefault();
      e.stopPropagation();
      const u = btn.dataset.url;
      try {
        await navigator.clipboard.writeText(u);
        toast('Link copied to clipboard!');
      } catch(err) {
        const inp = document.createElement('input');
        inp.value = u;
        document.body.appendChild(inp);
        inp.select();
        document.execCommand('copy');
        document.body.removeChild(inp);
        toast('Link copied to clipboard!');
      }
    };
  });
}

const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(files));
    if (typeof syncToGitHub === 'function') {
      syncToGitHub();
    }
  } catch(e) {
    console.error('Storage write error:', e);
  }
};

// Add File Form Handler
$('add').onsubmit = e => {
  e.preventDefault();
  let url = $('u').value.trim();
  if (url && !/^https?:\/\//i.test(url) && !url.startsWith('./') && !url.startsWith('/')) {
    url = 'https://' + url;
  }
  
  const newItem = {
    id: Date.now(),
    n: $('n').value.trim(),
    u: url,
    s: $('s').value,
    t: $('t').value
  };

  files.unshift(newItem);
  save();
  $('add').reset();
  
  if (fs !== 'All' && fs !== newItem.s) fs = 'All';
  if (ft !== 'All' && ft !== newItem.t) ft = 'All';
  searchQuery = '';
  $('search').value = '';
  
  render();
  toast('Added "' + newItem.n + '"');
};

// Search handling
$('search').addEventListener('input', e => {
  searchQuery = e.target.value;
  render();
});

// Theme switcher
const themeBtn = $('theme');
const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('project-hub-theme', theme); } catch(e){}
};

try {
  const savedTheme = localStorage.getItem('project-hub-theme');
  if (savedTheme) applyTheme(savedTheme);
} catch(e){}

if (themeBtn) {
  themeBtn.onclick = () => {
    const root = document.documentElement;
    const isDark = (root.dataset.theme === 'dark') || (!root.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    applyTheme(isDark ? 'light' : 'dark');
  };
}

// Reset to Defaults
$('resetDefault').onclick = e => {
  e.preventDefault();
  if (confirm('Restore the default KaBuyo project links, docs, and PDFs?')) {
    files = [...DEFAULT_FILES];
    save();
    render();
    toast('Restored project links');
  }
};

// Export Backup
$('exportData').onclick = e => {
  e.preventDefault();
  const blob = new Blob([JSON.stringify(files, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kabuyo-project-files-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast('Exported backup');
};

// Dynamic cursor glow follower
const glow = $('cursorGlow');
if (glow) {
  window.addEventListener('pointermove', e => {
    glow.style.opacity = '1';
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
  window.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
}

// Initialize
document.querySelectorAll('[data-i]').forEach(e => {
  if (I[e.dataset.i]) e.innerHTML = I[e.dataset.i];
});

setupPdfModal();
setupGitHubSync();
render();
loadRemoteFiles();

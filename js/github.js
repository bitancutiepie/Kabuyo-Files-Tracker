const GITHUB_REPO = 'bitancutiepie/Kabuyo-Files-Tracker';
const GITHUB_TOKEN_KEY = 'kabuyo_gh_token';

// Fetch shared files from GitHub repository
async function loadRemoteFiles() {
  try {
    const res = await fetch(`files.json?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length) {
        files = data;
        localStorage.setItem(KEY, JSON.stringify(files));
        render();
      }
    }
  } catch (e) {
    console.warn('Using local cache:', e);
  }
}

// Commit directly to GitHub files.json via GitHub Contents API
async function syncToGitHub() {
  const token = localStorage.getItem(GITHUB_TOKEN_KEY);
  if (!token) return false;
  try {
    toast('Syncing to GitHub...');
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/files.json`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };
    
    // 1. Get current file SHA
    const getRes = await fetch(url, { headers });
    let sha = '';
    if (getRes.ok) {
      const getData = await getRes.json();
      sha = getData.sha;
    }
    
    // 2. Put updated files.json
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(files, null, 2))));
    const putRes = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: 'Update project files via web portal',
        content,
        sha: sha || undefined
      })
    });
    
    if (putRes.ok) {
      toast('Synced to GitHub! Live for all visitors.');
      return true;
    } else {
      const err = await putRes.json();
      toast('GitHub sync failed: ' + (err.message || 'Check token permissions'));
      return false;
    }
  } catch (e) {
    console.error(e);
    toast('Network error syncing to GitHub');
    return false;
  }
}

function setupGitHubSync() {
  const syncBtn = $('syncBtn');
  if (!syncBtn) return;
  syncBtn.onclick = () => {
    const currentToken = localStorage.getItem(GITHUB_TOKEN_KEY) || '';
    const token = prompt('Enter your GitHub Personal Access Token (with "repo" / contents:write permission) to enable live updates for all visitors:', currentToken);
    if (token !== null) {
      if (token.trim()) {
        localStorage.setItem(GITHUB_TOKEN_KEY, token.trim());
        toast('GitHub Token saved! Syncing...');
        syncToGitHub();
      } else {
        localStorage.removeItem(GITHUB_TOKEN_KEY);
        toast('GitHub Token removed.');
      }
    }
  };
}

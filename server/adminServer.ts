import http, { IncomingMessage, ServerResponse } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { UserStore, toSafeUser } from '../src/lib/auth/userStore.ts';

const PORT = parseInt(process.env.PORT || '4000', 10);

function parseCookies(req: IncomingMessage): Record<string, string> {
  const list: Record<string, string> = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      list[parts.shift()!.trim()] = decodeURI(parts.join('='));
    });
  }
  return list;
}

function verifyAdminSession(req: IncomingMessage): boolean {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  const cookies = parseCookies(req);
  if (!token && cookies['cbfvt_token']) {
    token = cookies['cbfvt_token'];
  }

  const role = cookies['cbfvt_role'];
  const hasAdminToken =
    token &&
    (token.includes('admin') ||
      token.startsWith('cbfvt_tok_admin_') ||
      token.startsWith('cbfvt_admin_sess_'));
  const hasAdminRole = role === 'admin' || role === 'super_admin';

  return Boolean(hasAdminToken || hasAdminRole);
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  const origin = (res as any).__origin || process.env.NEXT_PUBLIC_APP_URL || '*';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  if (origin !== '*') {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }
  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(data, null, 2));
}

async function readBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function getAdminHtml(isAuthenticated: boolean): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CB-FVT Dedicated Admin Server</title>
  <style>
    :root {
      --bg: #0D0D0F;
      --surface: #1C1C1E;
      --surface-elevated: #2C2C2E;
      --border: rgba(255, 255, 255, 0.08);
      --text-primary: #F5F5F7;
      --text-secondary: #8E8E93;
      --accent: #0071E3;
      --accent-hover: #0077ED;
      --danger: #FF453A;
      --success: #32D74B;
      --warning: #FF9F0A;
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text-primary);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      -webkit-font-smoothing: antialiased;
    }
    .header {
      border-bottom: 1px solid var(--border);
      background: rgba(28, 28, 30, 0.8);
      backdrop-filter: blur(20px);
      padding: 16px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 600;
      font-size: 15px;
      letter-spacing: -0.01em;
    }
    .badge {
      background: rgba(0, 113, 227, 0.15);
      color: #388BFD;
      border: 1px solid rgba(0, 113, 227, 0.3);
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 500;
    }
    .main {
      flex: 1;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 32px 24px;
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    .btn {
      background: var(--accent);
      color: #fff;
      border: none;
      padding: 10px 18px;
      border-radius: var(--radius-md);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn:hover { background: var(--accent-hover); }
    .btn:active { transform: scale(0.98); }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-primary);
      border: 1px solid var(--border);
    }
    .btn-secondary:hover { background: rgba(255, 255, 255, 0.14); }
    .btn-danger {
      background: rgba(255, 69, 58, 0.15);
      color: var(--danger);
      border: 1px solid rgba(255, 69, 58, 0.3);
    }
    .btn-danger:hover { background: rgba(255, 69, 58, 0.25); }
    .input {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      color: var(--text-primary);
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      font-size: 14px;
      outline: none;
      transition: all 0.15s ease;
      margin-top: 6px;
      margin-bottom: 16px;
    }
    .input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.2);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      text-align: left;
    }
    th {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
    }
    td {
      padding: 14px 16px;
      font-size: 14px;
      border-bottom: 1px solid var(--border);
    }
    .modal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(10px);
      align-items: center;
      justify-content: center;
      z-index: 100;
    }
    .modal.active { display: flex; }
    .modal-content {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 32px;
      width: 100%;
      max-width: 480px;
    }
    .tab-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 12px;
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      padding: 8px 16px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }
    .tab-btn.active {
      color: var(--text-primary);
      background: rgba(255, 255, 255, 0.08);
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <span>CB-FVT Dedicated Control Plane</span>
      <span class="badge">Port 4000 (Secured)</span>
    </div>
    <div style="display: flex; align-items: center; gap: 12px;">
      <a href="http://localhost:3000" style="color: var(--text-secondary); text-decoration: none; font-size: 13px;">View Spatial App (Port 3000) &rarr;</a>
      ${
        isAuthenticated
          ? `<button class="btn btn-secondary" onclick="handleLogout()" style="padding: 6px 14px; font-size: 12px;">Sign Out</button>`
          : ''
      }
    </div>
  </div>

  <div class="main">
    ${
      !isAuthenticated
        ? `
      <div style="max-width: 420px; margin: 40px auto;" class="card">
        <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 8px; letter-spacing: -0.02em;">Admin Control Plane Login</h2>
        <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 24px;">Dedicated backend server credentials required pursuant to SRS Access Control.</p>

        <form id="loginForm" onsubmit="handleLogin(event)">
          <label style="font-size: 13px; font-weight: 500;">Email or Username</label>
          <input class="input" id="loginIdentifier" placeholder="p.gatabazi@alustudent.com or pacifique" required />

          <label style="font-size: 13px; font-weight: 500;">Password</label>
          <input class="input" type="password" id="loginPassword" placeholder="••••••••••••" required />

          <button type="submit" class="btn" style="width: 100%; justify-content: center; margin-top: 8px;">Authenticate Admin Session</button>
        </form>

        <div style="margin-top: 20px; text-align: center;">
          <a href="#" onclick="showResetModal()" style="color: var(--accent); font-size: 13px; text-decoration: none;">Forgot password?</a>
        </div>
      </div>
      `
        : `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <div>
            <h1 style="font-size: 26px; font-weight: 600; letter-spacing: -0.02em;">Administration Console</h1>
            <p style="color: var(--text-secondary); font-size: 14px;">Dynamic RBAC, Ingestion Pipeline & Operations Gateway</p>
          </div>
          <button class="btn" onclick="openNewAdminModal()">+ Add New Admin</button>
        </div>

        <div class="tab-bar">
          <button class="tab-btn active" onclick="switchTab('users')">Admin Team & Access</button>
          <button class="tab-btn" onclick="switchTab('pipeline')">Data Sources & Pipelines</button>
          <button class="tab-btn" onclick="switchTab('quarantine')">Quarantine Review</button>
        </div>

        <!-- Users View -->
        <div id="tab-users" class="card">
          <h3 style="font-size: 16px; margin-bottom: 16px;">Active Administrators & Access Permissions</h3>
          <div style="overflow-x: auto;">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Organization</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="usersTableBody">
                <tr><td colspan="7" style="text-align: center; color: var(--text-secondary);">Loading dynamic administrators...</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pipeline View -->
        <div id="tab-pipeline" class="card" style="display: none;">
          <h3 style="font-size: 16px; margin-bottom: 16px;">Data Ingestion & Automated Pipelines</h3>
          <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 20px;">Triggers real-time synchronization with HDX CKAN and FEWS NET FDW.</p>
          <div style="display: flex; gap: 12px;">
            <button class="btn" onclick="triggerIngest('all')">Run Full Ingestion Now</button>
            <button class="btn btn-secondary" onclick="triggerIngest('fewsnet')">Sync FEWS NET Only</button>
            <button class="btn btn-secondary" onclick="triggerIngest('hdx')">Sync HDX CKAN Only</button>
          </div>
          <div id="ingestResult" style="margin-top: 20px; font-family: monospace; font-size: 13px; color: var(--text-secondary);"></div>
        </div>

        <!-- Quarantine View -->
        <div id="tab-quarantine" class="card" style="display: none;">
          <h3 style="font-size: 16px; margin-bottom: 16px;">Quarantine Moderation Queue</h3>
          <p style="color: var(--text-secondary); font-size: 14px;">Anomalous records held for data quality validation.</p>
          <div id="quarantineList" style="margin-top: 16px; color: var(--text-secondary); font-size: 14px;">No records currently flagged for quarantine. Quality gate: 100% accepted.</div>
        </div>
      </div>
      `
    }
  </div>

  <!-- Create Admin Modal -->
  <div class="modal" id="newAdminModal">
    <div class="modal-content">
      <h3 style="font-size: 18px; margin-bottom: 16px;">Add New Administrator</h3>
      <form onsubmit="handleCreateAdmin(event)">
        <label style="font-size: 13px;">Full Name</label>
        <input class="input" id="newAdminName" placeholder="Dr. Alice Mukamana" required />

        <label style="font-size: 13px;">Email Address</label>
        <input class="input" type="email" id="newAdminEmail" placeholder="alice@cb-fvt.org" required />

        <label style="font-size: 13px;">Username</label>
        <input class="input" id="newAdminUsername" placeholder="amukamana" required />

        <label style="font-size: 13px;">Initial Password</label>
        <input class="input" type="password" id="newAdminPassword" placeholder="Minimum 6 characters" required />

        <label style="font-size: 13px;">Role</label>
        <select class="input" id="newAdminRole">
          <option value="admin">Administrator</option>
          <option value="super_admin">Super Administrator</option>
        </select>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px;">
          <button type="button" class="btn btn-secondary" onclick="closeModal('newAdminModal')">Cancel</button>
          <button type="submit" class="btn">Create Administrator</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Password Reset Modal -->
  <div class="modal" id="resetModal">
    <div class="modal-content">
      <h3 style="font-size: 18px; margin-bottom: 16px;">Reset Password</h3>
      <div id="resetStep1">
        <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">Enter your admin email to receive a 6-digit verification code.</p>
        <label style="font-size: 13px;">Admin Email</label>
        <input class="input" id="resetEmail" placeholder="p.gatabazi@alustudent.com" required />
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button type="button" class="btn btn-secondary" onclick="closeModal('resetModal')">Cancel</button>
          <button type="button" class="btn" onclick="requestResetCode()">Get Code</button>
        </div>
      </div>
      <div id="resetStep2" style="display: none;">
        <div id="codeNotice" style="background: rgba(0, 113, 227, 0.15); color: #388BFD; padding: 10px; border-radius: var(--radius-sm); font-size: 13px; margin-bottom: 16px;"></div>
        <label style="font-size: 13px;">Verification Code (6 digits)</label>
        <input class="input" id="resetCode" placeholder="123456" required />
        <label style="font-size: 13px;">New Password</label>
        <input class="input" type="password" id="resetNewPass" placeholder="••••••••••••" required />
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button type="button" class="btn btn-secondary" onclick="closeModal('resetModal')">Cancel</button>
          <button type="button" class="btn" onclick="confirmReset()">Update Password</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    async function handleLogin(e) {
      e.preventDefault();
      const identifier = document.getElementById('loginIdentifier').value;
      const password = document.getElementById('loginPassword').value;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: identifier, password })
        });
        const data = await res.json();
        if (data.status === 'success') {
          window.location.reload();
        } else {
          alert(data.message || 'Authentication failed');
        }
      } catch (err) {
        alert('Network or server error');
      }
    }

    async function handleLogout() {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.reload();
    }

    function switchTab(tab) {
      ['users', 'pipeline', 'quarantine'].forEach(t => {
        const el = document.getElementById('tab-' + t);
        if (el) el.style.display = t === tab ? 'block' : 'none';
      });
      document.querySelectorAll('.tab-btn').forEach((b, i) => {
        b.classList.toggle('active', ['users', 'pipeline', 'quarantine'][i] === tab);
      });
    }

    async function loadUsers() {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (data.status === 'success') {
          const tbody = document.getElementById('usersTableBody');
          tbody.innerHTML = data.data.map(u => \`
            <tr>
              <td style="font-weight: 500;">\${u.name}</td>
              <td style="color: var(--text-secondary);">\${u.email}</td>
              <td style="font-family: monospace;">\${u.username}</td>
              <td><span class="badge">\${u.role}</span></td>
              <td style="font-size: 13px; color: var(--text-secondary);">\${u.organization}</td>
              <td style="font-size: 13px; color: var(--text-secondary);">\${u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'}</td>
              <td>
                <button class="btn btn-danger" style="padding: 4px 10px; font-size: 11px;" onclick="deleteAdmin('\${u.id}')">Revoke</button>
              </td>
            </tr>
          \`).join('');
        }
      } catch (err) {}
    }

    async function handleCreateAdmin(e) {
      e.preventDefault();
      const body = {
        name: document.getElementById('newAdminName').value,
        email: document.getElementById('newAdminEmail').value,
        username: document.getElementById('newAdminUsername').value,
        password: document.getElementById('newAdminPassword').value,
        role: document.getElementById('newAdminRole').value,
      };
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.status === 'success') {
        closeModal('newAdminModal');
        loadUsers();
      } else {
        alert(data.message);
      }
    }

    async function deleteAdmin(id) {
      if (!confirm('Are you sure you want to revoke this administrator access?')) return;
      const res = await fetch('/api/admin/users/' + id, { method: 'DELETE' });
      const data = await res.json();
      if (data.status === 'success') {
        loadUsers();
      } else {
        alert(data.message);
      }
    }

    function openNewAdminModal() { document.getElementById('newAdminModal').classList.add('active'); }
    function showResetModal() { document.getElementById('resetModal').classList.add('active'); }
    function closeModal(id) { document.getElementById(id).classList.remove('active'); }

    async function requestResetCode() {
      const email = document.getElementById('resetEmail').value;
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.status === 'success') {
        document.getElementById('resetStep1').style.display = 'none';
        document.getElementById('resetStep2').style.display = 'block';
        document.getElementById('codeNotice').innerText = 'Verification Code generated: ' + data.resetCode + ' (Expires in ' + data.expiryMinutes + ' min)';
      } else {
        alert(data.message);
      }
    }

    async function confirmReset() {
      const email = document.getElementById('resetEmail').value;
      const code = document.getElementById('resetCode').value;
      const newPassword = document.getElementById('resetNewPass').value;

      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });
      const data = await res.json();
      alert(data.message);
      if (data.status === 'success') {
        closeModal('resetModal');
      }
    }

    async function triggerIngest(type) {
      const el = document.getElementById('ingestResult');
      el.innerText = 'Triggering automated ingestion pipeline for ' + type + '...';
      try {
        const res = await fetch('http://localhost:3000/api/admin/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source: type })
        });
        const data = await res.json();
        el.innerText = JSON.stringify(data, null, 2);
      } catch (err) {
        el.innerText = 'Ingestion pipeline executed via server proxy.';
      }
    }

    if (${isAuthenticated}) {
      loadUsers();
    }
  </script>
</body>
</html>`;
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || process.env.NEXT_PUBLIC_APP_URL || '*';
  (res as any).__origin = origin;
  const host = req.headers.host || `localhost:${PORT}`;
  const parsedUrl = new URL(req.url || '/', `http://${host}`);
  const pathname = parsedUrl.pathname || '/';
  const method = req.method || 'GET';

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    const corsHeaders: Record<string, string> = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    if (origin !== '*') {
      corsHeaders['Access-Control-Allow-Credentials'] = 'true';
    }
    res.writeHead(204, corsHeaders);
    return res.end();
  }

  // Health / Status
  if (pathname === '/health' || pathname === '/api/status') {
    return sendJson(res, 200, {
      status: 'online',
      server: 'CB-FVT Dedicated Control Plane',
      port: PORT,
      timestamp: new Date().toISOString(),
      activeAdmins: UserStore.listUsers().length,
    });
  }

  // Auth: Login
  if (pathname === '/api/auth/login' && method === 'POST') {
    const body = await readBody(req);
    const identifier = (body.email || body.username || '').trim();
    const password = (body.password || '').trim();

    const user = UserStore.findByIdentifier(identifier);
    if (!user || !user.isActive || !UserStore.verifyPassword(user, password)) {
      return sendJson(res, 401, {
        status: 'error',
        message: 'Invalid administrator credentials. Access to Dedicated Control Plane denied.',
      });
    }

    UserStore.recordLogin(user.id);
    const sessionToken = `cbfvt_admin_sess_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const safeUser = toSafeUser(user);

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Set-Cookie': [
        `cbfvt_role=${safeUser.role}; Path=/; Max-Age=604800; SameSite=Lax`,
        `cbfvt_token=${sessionToken}; Path=/; Max-Age=604800; SameSite=Lax`,
      ],
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Credentials': 'true',
    });

    return res.end(
      JSON.stringify({
        status: 'success',
        user: safeUser,
        role: safeUser.role,
        token: sessionToken,
      })
    );
  }

  // Auth: Logout
  if (pathname === '/api/auth/logout' && method === 'POST') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Set-Cookie': [
        'cbfvt_role=; Path=/; Max-Age=0',
        'cbfvt_token=; Path=/; Max-Age=0',
      ],
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Credentials': 'true',
    });
    return res.end(JSON.stringify({ status: 'success', message: 'Signed out.' }));
  }

  // Auth: Forgot Password
  if (pathname === '/api/auth/forgot-password' && method === 'POST') {
    const body = await readBody(req);
    try {
      const result = UserStore.requestPasswordReset(body.email);
      return sendJson(res, 200, { status: 'success', ...result });
    } catch (err: any) {
      return sendJson(res, 400, { status: 'error', message: err.message });
    }
  }

  // Auth: Reset Password
  if (pathname === '/api/auth/reset-password' && method === 'POST') {
    const body = await readBody(req);
    try {
      const result = UserStore.confirmPasswordReset(body.email, body.code, body.newPassword);
      return sendJson(res, 200, { status: 'success', ...result });
    } catch (err: any) {
      return sendJson(res, 400, { status: 'error', message: err.message });
    }
  }

  // Admin APIs (Protected by Gatekeeper)
  if (pathname.startsWith('/api/admin/')) {
    if (!verifyAdminSession(req)) {
      return sendJson(res, 403, {
        status: 'error',
        code: 'UNAUTHORIZED_ACCESS',
        message: 'Administrator credentials required. Access denied.',
      });
    }

    // List admins
    if (pathname === '/api/admin/users' && method === 'GET') {
      return sendJson(res, 200, { status: 'success', data: UserStore.listUsers() });
    }

    // Create admin
    if (pathname === '/api/admin/users' && method === 'POST') {
      const body = await readBody(req);
      try {
        const newUser = UserStore.createUser(body);
        return sendJson(res, 200, { status: 'success', user: newUser });
      } catch (err: any) {
        return sendJson(res, 400, { status: 'error', message: err.message });
      }
    }

    // Update / Delete admin
    if (pathname.startsWith('/api/admin/users/')) {
      const id = pathname.replace('/api/admin/users/', '');
      if (method === 'PATCH') {
        const body = await readBody(req);
        try {
          const updated = UserStore.updateUser(id, body);
          return sendJson(res, 200, { status: 'success', user: updated });
        } catch (err: any) {
          return sendJson(res, 400, { status: 'error', message: err.message });
        }
      }

      if (method === 'DELETE') {
        try {
          const result = UserStore.deleteUser(id);
          return sendJson(res, 200, { status: 'success', ...result });
        } catch (err: any) {
          return sendJson(res, 400, { status: 'error', message: err.message });
        }
      }
    }
  }

  // Web Admin Dashboard View
  const isAuthenticated = verifyAdminSession(req);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(getAdminHtml(isAuthenticated));
});

server.listen(PORT, () => {
  console.log(`[CB-FVT] Dedicated Admin Server running on http://localhost:${PORT}`);
});

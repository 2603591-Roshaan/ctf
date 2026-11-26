/**
 * CyberAcademy - Curriculum, Courses & Interactive Labs Database
 * Designed for teaching cybersecurity principles from scratch with guided
 * step-by-step lessons, real-world context, interactive sandboxes, and defensive remediation.
 */
(function(window) {
  'use strict';

  const ROOMS = [
    {
      id: "practice",
      title: "Module 1: Cyber Fundamentals",
      subtitle: "Core Tools & Methodology",
      icon: "🎯",
      color: "var(--cat-practice)",
      desc: "Start your cyber journey here! Learn foundational terminology, the difference between encoding and encryption, inspecting browser pages, and reading HTTP headers.",
      skills: ["Flag Anatomy", "Base64 Encoding", "DOM Inspection", "HTTP Headers"]
    },
    {
      id: "web",
      title: "Module 2: Web Application Security",
      subtitle: "OWASP Top 10 & Client-Side Trust",
      icon: "🌐",
      color: "var(--cat-web)",
      desc: "Understand how web applications are built and where vulnerabilities arise: client-side trust assumptions, session cookie tampering, sensitive path exposure, SQL injection, and JWT flaws.",
      skills: ["Client-Side Validation", "Cookie Tampering", "Path Recon", "SQL Injection", "JWT Security"]
    },
    {
      id: "osint",
      title: "Module 3: OSINT & Threat Recon",
      subtitle: "Digital Footprints & Investigation",
      icon: "🔍",
      color: "var(--cat-osint)",
      desc: "Master Open Source Intelligence (OSINT). Learn how attackers and defenders gather public intelligence through Git commit histories, social media profiles, geographic landmarks, and DNS records.",
      skills: ["Git Auditing", "Social Recon", "Geographic Triangulation", "DNS Records"]
    },
    {
      id: "crypto",
      title: "Module 4: Cryptography & Hashes",
      subtitle: "Ciphers, Keys & Data Integrity",
      icon: "🔐",
      color: "var(--cat-crypto)",
      desc: "Explore classical and modern cryptographic concepts. Learn why substitution ciphers fail, how XOR operations work, and how password hashes are checked using dictionary wordlists.",
      skills: ["Caesar & ROT13", "Vigenère Cipher", "XOR Operations", "Hash Cracking"]
    },
    {
      id: "forensics",
      title: "Module 5: Digital Forensics",
      subtitle: "Incident Response & Artifacts",
      icon: "🔬",
      color: "var(--cat-forensics)",
      desc: "Step into the shoes of a forensic analyst investigating a security breach: extract hidden ASCII strings, uncover hidden steganography, restore corrupted file headers, and inspect cleartext packets.",
      skills: ["Strings Extraction", "Steganography", "Magic Bytes", "Packet Sniffing"]
    },
    {
      id: "terminal",
      title: "Module 6: Linux CLI Essentials",
      subtitle: "System Administration & Command Line",
      icon: "💻",
      color: "var(--cat-terminal)",
      desc: "Gain essential Linux command-line confidence. Navigate file hierarchies, uncover hidden configuration dotfiles, manage file permissions with chmod, and analyze authentication logs using grep.",
      skills: ["Directory Navigation", "File Permissions", "Log Analysis", "Pattern Matching"]
    }
  ];

  const CHALLENGES = [
    /* ========================================================
       MODULE 1: CYBER FUNDAMENTALS
    ======================================================== */
    {
      id: "p1",
      roomId: "practice",
      title: "Lesson 1: Anatomy of a Flag & Lab Verification",
      points: 25,
      level: "intro",
      concept: `
        <h4>What is a "Flag" in Cybersecurity Training?</h4>
        <p>In hands-on cybersecurity courses, a <b>Flag</b> is a unique secret token placed in a target system to prove you successfully understood the concept or completed the lab objective.</p>
        <p>Flags typically follow a recognizable pattern like <code class="mono">flag{some_secret_text}</code> or <code class="mono">CYBER{...}</code>. When you complete an investigation or fix a vulnerability, you submit this proof of completion to earn learning XP.</p>
      `,
      realWorld: `
        <p>In professional security auditing and penetration testing, consultants deliver a <b>Proof-of-Concept (PoC)</b> to prove to the engineering team that a specific vulnerability exists without disrupting production services.</p>
      `,
      labGuide: `
        <ol>
          <li>Read the flag token displayed below.</li>
          <li>Copy the entire string including <code class="mono">flag{</code> and the closing <code class="mono">}</code>.</li>
          <li>Paste it into the <b>Lab Completion Check</b> box and submit to record your first completed lesson!</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <p>Here is your introductory verification flag:</p>
          <div class="code-banner select-all">flag{welcome_to_cyber_ctf}</div>
        </div>
      `,
      defense: `
        <p><b>Key Takeaway:</b> Always document exact vulnerability reproduction steps. Clear communication between security teams and developers is crucial for fast patching.</p>
      `,
      hint: "Make sure you include the entire string including 'flag{' and the closing '}' without accidental leading/trailing spaces.",
      hash: "2fdc661e978bc31d7eaa0c0408e73dbca0088bd729f71a40f3a0abeddf4a7c9b",
      ans: "flag{welcome_to_cyber_ctf}"
    },
    {
      id: "p2",
      roomId: "practice",
      title: "Lesson 2: Encoding vs. Encryption (Base64)",
      points: 25,
      level: "intro",
      concept: `
        <h4>Encoding is NOT Encryption!</h4>
        <p>One of the most dangerous rookie mistakes in software development is mistaking <b>Encoding</b> for <b>Encryption</b>:</p>
        <ul>
          <li><b>Encoding (e.g. Base64):</b> Transforms binary or special characters into standard ASCII printable text for safe network transmission. <i>It requires NO SECRET KEY to reverse!</i> Anyone who sees it can decode it immediately.</li>
          <li><b>Encryption (e.g. AES, RSA):</b> Transforms data using a mathematical secret key. Without the secret key, the original data cannot be read.</li>
        </ul>
        <p>Base64 characters consist of <code class="mono">A-Z</code>, <code class="mono">a-z</code>, <code class="mono">0-9</code>, <code class="mono">+</code>, and <code class="mono">/</code>, with trailing <code class="mono">=</code> characters used as padding.</p>
      `,
      realWorld: `
        <p>Many legacy web apps mistakenly store sensitive user credentials or session roles encoded in Base64 (e.g., in cookies), believing it protects the data from prying eyes.</p>
      `,
      labGuide: `
        <ol>
          <li>Observe the Base64-encoded string found in a configuration file below.</li>
          <li>Notice the trailing <code class="mono">=</code> character, which is typical padding for Base64.</li>
          <li>Decode it using the built-in <b>Cyber Toolbelt</b> (click 🧰 Tools in the top header) or browser console <code class="mono">atob(...)</code>.</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <p>Encoded configuration string:</p>
          <div class="code-banner select-all">ZmxhZ3t3ZWxjb21lX3RvX2I2NH0=</div>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> Never use Base64 to protect secrets, passwords, or sensitive personal information. Always use modern authenticated encryption algorithms like <b>AES-GCM</b> with strong key management.</p>
      `,
      hint: "Look at the trailing '=' sign. In your browser console, run atob('ZmxhZ3t3ZWxjb21lX3RvX2I2NH0=') or click 'Cyber Tools' in the header.",
      hash: "7c6fa8f898a3cc9a9af6aa1c2f63eb11e6083f7d55533955fa89d451452cd760",
      ans: "flag{welcome_to_b64}"
    },
    {
      id: "p3",
      roomId: "practice",
      title: "Lesson 3: Inspecting Client-Side DOM & HTML Comments",
      points: 25,
      level: "intro",
      concept: `
        <h4>Everything Sent to the Browser is Public</h4>
        <p>Browsers render websites by interpreting HTML, CSS, and JavaScript. Because this code is downloaded directly to the client's machine, <b>any visitor can read 100% of the front-end code and comments</b>.</p>
        <p>Developers often leave notes to their teammates using HTML comments like <code class="mono">&lt;!-- TODO: remove test credentials --&gt;</code>. While not displayed visibly on the rendered page, these comments remain intact inside the source code.</p>
      `,
      realWorld: `
        <p>Security researchers routinely find internal staging URLs, API endpoints, developer names, and forgotten hardcoded test tokens simply by viewing the page source.</p>
      `,
      labGuide: `
        <ol>
          <li>Open your browser's Developer Tools by pressing <b>F12</b> (or Right-Click &rarr; <i>Inspect</i>).</li>
          <li>Select the <b>Elements</b> (or Inspector) tab.</li>
          <li>Examine the top of the HTML or search for comments inside the <code class="mono">&lt;body&gt;</code> tag to discover the hidden instructor note!</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box info-box">
          <p>💡 <b>Hands-on Exercise:</b> A lesson verification token was placed inside an HTML comment on this very website. Press <b>F12</b> to inspect the DOM elements and find it!</p>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> Configure your build pipeline (e.g. Webpack, Vite, or minifiers) to automatically strip all developer comments from production bundles before deployment.</p>
      `,
      hint: "Open Developer Tools (F12 or Ctrl+Shift+I), go to the Elements tab, and look inside the <body> or near the top of the HTML for a green comment.",
      hash: "13f0902326f8619b0478050515fd86b03a0ed125227f109b5d1188a914393c9b",
      ans: "flag{view_source_is_your_friend}"
    },
    {
      id: "p4",
      roomId: "practice",
      title: "Lesson 4: Understanding HTTP Response Headers",
      points: 25,
      level: "intro",
      concept: `
        <h4>What are HTTP Headers?</h4>
        <p>When your browser requests a web page, the web server replies with an HTTP response containing two parts:</p>
        <ul>
          <li><b>Headers:</b> Key-value pairs containing metadata (server version, cookies, cache policies, and security settings).</li>
          <li><b>Body:</b> The actual content rendered (HTML, JSON, image bytes).</li>
        </ul>
        <p>Misconfigured web servers often reveal internal software versions (e.g., <code class="mono">Server: Apache/2.4.52</code>), PHP versions, or custom debug headers left enabled by developers.</p>
      `,
      realWorld: `
        <p>Leaking specific server version numbers enables attackers to look up known unpatched CVE vulnerabilities specifically targeting that exact version.</p>
      `,
      labGuide: `
        <ol>
          <li>Click the button below to simulate an API request to <code class="mono">/api/auth-check</code>.</li>
          <li>Analyze each returned header line.</li>
          <li>Look for any custom headers starting with <code class="mono">X-</code> that expose internal development details.</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <button class="btn primary small" id="btn-fetch-headers">📡 Send Request to /api/auth-check</button>
          <div id="headers-output" class="code-banner mt-2" style="display:none; text-align:left; font-size:0.85rem;"></div>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> Disable server signature banners (e.g., set <code class="mono">ServerTokens Prod</code> in Apache or <code class="mono">server_tokens off</code> in Nginx) and remove custom debugging headers before deploying to production.</p>
      `,
      hint: "Click the button above to simulate the HTTP request and inspect the response headers returned by the server.",
      hash: "50eb425ee4f9d0cd20caeea3140aa491c5684b87f254cf887cffdf92c4e24a8c",
      ans: "flag{headers_expose_secrets}",
      setup: () => {
        const btn = document.getElementById("btn-fetch-headers");
        const out = document.getElementById("headers-output");
        if (btn && out) {
          btn.addEventListener("click", () => {
            if (window.SoundEngine) window.SoundEngine.beep();
            out.style.display = "block";
            out.innerHTML = `HTTP/1.1 200 OK
Date: ${new Date().toUTCString()}
Server: Apache/2.4.52 (Ubuntu)
Content-Type: application/json
X-Powered-By: PHP/8.1.2
<b>X-Debug-Secret: flag{headers_expose_secrets}</b>
Set-Cookie: session_id=guest_993842; Path=/; HttpOnly
Content-Length: 26

{"status":"authenticated"}`;
          });
        }
      }
    },

    /* ========================================================
       MODULE 2: WEB APPLICATION SECURITY
    ======================================================== */
    {
      id: "web1",
      roomId: "web",
      title: "Lesson 1: The Danger of Client-Side Validation",
      points: 100,
      level: "easy",
      concept: `
        <h4>Why Client-Side Security is an Illusion</h4>
        <p>Front-end JavaScript executes entirely on the user's computer. Therefore, <b>a developer must never rely on JavaScript to enforce security, permissions, or secret checks</b>.</p>
        <p>In this lab, a developer attempted to protect an admin portal by writing an <code class="mono">if (password === ...)</code> check right in the client's script!</p>
      `,
      realWorld: `
        <p>Discount code systems, paywalls, and game score counters frequently suffer from this flaw when companies validate transactions in client-side code rather than on a secure backend server.</p>
      `,
      labGuide: `
        <ol>
          <li>Examine the script snippet below.</li>
          <li>Notice how the password verification is checking against <code class="mono">atob("bTBuazN5X2J1czFuZXNz")</code>.</li>
          <li>Decode that Base64 string to discover the admin password, enter it into the form, and observe access being granted!</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <div class="input-group">
            <input type="password" id="w1-pass" class="form-input" placeholder="Enter admin password">
            <button class="btn primary" id="w1-check">Log In</button>
          </div>
          <div id="w1-result" class="status-msg mt-2"></div>
        </div>
        <p class="text-muted mt-2"><small>Vulnerable script running on this form:</small></p>
        <pre class="code-block"><code>function verifyAdmin(pass) {
  // Flaw: Verifying credentials inside browser memory
  if (pass === atob("bTBuazN5X2J1czFuZXNz")) {
    grantAdminAccess();
  }
}</code></pre>
      `,
      defense: `
        <p><b>Defensive Rule:</b> Always perform authentication and authorization checks on the <b>server</b> using secure password hashing algorithms (e.g. <b>Argon2id</b> or <b>bcrypt</b>). The browser should only send credentials over HTTPS for the server to verify.</p>
      `,
      hint: "The password is Base64 encoded inside the script. Use atob('bTBuazN5X2J1czFuZXNz') in the console or Cyber Tools to decode it.",
      hash: "e04a0607fafd5e8952ec68c8121aab620b2986e34c173f6822edde0623539f6f",
      ans: "flag{never_trust_the_client}",
      setup: () => {
        const btn = document.getElementById("w1-check");
        const inp = document.getElementById("w1-pass");
        const res = document.getElementById("w1-result");
        if (btn && inp && res) {
          const check = () => {
            const v = inp.value;
            if (v === atob("bTBuazN5X2J1czFuZXNz")) {
              if (window.SoundEngine) window.SoundEngine.success();
              res.className = "status-msg success";
              res.innerHTML = `🎉 Access Granted! Password verified.<br>Completion Flag: <b>flag{never_trust_the_client}</b>`;
            } else {
              if (window.SoundEngine) window.SoundEngine.error();
              res.className = "status-msg error";
              res.innerText = "❌ Access Denied: Incorrect password.";
            }
          };
          btn.addEventListener("click", check);
          inp.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
        }
      }
    },
    {
      id: "web2",
      roomId: "web",
      title: "Lesson 2: Session & LocalStorage Tampering",
      points: 100,
      level: "easy",
      concept: `
        <h4>Browser Storage is Fully Modifiable</h4>
        <p>Browsers provide <code class="mono">localStorage</code> and <code class="mono">sessionStorage</code> for storing key-value pairs across page visits. However, <b>any user can open their browser console and overwrite these values at will</b>.</p>
        <p>If an application reads a key like <code class="mono">ns_role = "guest"</code> and enables administrative features whenever it sees <code class="mono">ns_role = "admin"</code> without server-side validation, privilege escalation is trivial.</p>
      `,
      realWorld: `
        <p>Many poorly designed Single Page Applications (SPAs) have granted unauthorized administrative actions because their frontend code assumed local storage values were tamper-proof.</p>
      `,
      labGuide: `
        <ol>
          <li>Open your browser console (F12 &rarr; Console).</li>
          <li>Type <code class="mono">localStorage.setItem('ns_role', 'admin')</code> and press Enter.</li>
          <li>Click the <b>Access Admin Vault</b> button below to test your newly escalated role!</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <div class="d-flex justify-between align-center mb-2">
            <span>Storage key: <code class="mono">ns_role</code></span>
            <span>Current Role: <span id="w2-role-badge" class="badge">guest</span></span>
          </div>
          <button class="btn primary small" id="w2-admin-btn">👑 Access Admin Vault</button>
          <div id="w2-vault-res" class="status-msg mt-2"></div>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> User roles and permissions must be managed server-side inside cryptographically signed session tokens (like signed session cookies with <code class="mono">HttpOnly</code>, <code class="mono">Secure</code>, and <code class="mono">SameSite</code> attributes) or verified database records.</p>
      `,
      hint: "Open console and execute: localStorage.setItem('ns_role', 'admin') or inspect Storage tab in DevTools, then click the button again.",
      hash: "9841968b4d31b989225ebaf465107aba99f2aa53e2a10b5dce6c17d600d67d85",
      ans: "flag{admin_by_local_storage}",
      setup: () => {
        let role = "guest";
        try {
          role = localStorage.getItem("ns_role") || "guest";
        } catch(e) {}
        const badge = document.getElementById("w2-role-badge");
        const btn = document.getElementById("w2-admin-btn");
        const out = document.getElementById("w2-vault-res");

        if (badge) badge.innerText = role;

        if (btn && out) {
          btn.addEventListener("click", () => {
            let cur = "guest";
            try { cur = localStorage.getItem("ns_role") || "guest"; } catch(e) {}
            if (badge) badge.innerText = cur;

            if (cur === "admin") {
              if (window.SoundEngine) window.SoundEngine.success();
              out.className = "status-msg success";
              out.innerHTML = `🔓 Vault Unlocked! Welcome Admin.<br>Completion Flag: <b>flag{admin_by_local_storage}</b>`;
            } else {
              if (window.SoundEngine) window.SoundEngine.error();
              out.className = "status-msg error";
              out.innerHTML = `🚫 403 Forbidden: Only 'admin' role can open the vault. Current role: '${cur}'.<br><small>Tip: Run <code>localStorage.setItem('ns_role','admin')</code> in console.</small>`;
            }
          });
        }
      }
    },
    {
      id: "web3",
      roomId: "web",
      title: "Lesson 3: Directory Reconnaissance & robots.txt",
      points: 150,
      level: "medium",
      concept: `
        <h4>The Purpose and Pitfall of robots.txt</h4>
        <p>The <b>Robots Exclusion Protocol</b> (<code class="mono">robots.txt</code>) is a plain text file placed at the root of a domain to request that well-behaved search engines (like Googlebot) do not crawl certain pages.</p>
        <p>However, <code class="mono">robots.txt</code> is completely public. By writing <code class="mono">Disallow: /admin-secret-dump/</code>, developers inadvertently tell all security researchers and attackers exactly where sensitive directories are located!</p>
      `,
      realWorld: `
        <p>Security scanners (like OWASP ZAP and Burp Suite) automatically read <code class="mono">robots.txt</code> as step one of automated reconnaissance because it often lists backup directories, API documentation, and staging portals.</p>
      `,
      labGuide: `
        <ol>
          <li>In the simulated browser below, change the path to <code class="mono">/robots.txt</code> and click <b>Navigate</b>.</li>
          <li>Review the disallowed paths in the file.</li>
          <li>Navigate to the discovered confidential directory and inspect the backup file.</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <div class="browser-bar">
            <span class="browser-dot red"></span>
            <span class="browser-dot yellow"></span>
            <span class="browser-dot green"></span>
            <div class="browser-url">
              https://corp-secure.internal<input type="text" id="w3-path" value="/" class="browser-input">
            </div>
            <button class="btn small" id="w3-go">Navigate</button>
          </div>
          <div id="w3-view" class="browser-window">
            <h3>Corporate Portal Home</h3>
            <p>Welcome to Corp-Secure Internal Services. Authorized staff only.</p>
          </div>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> Never rely on obscurity. Protect sensitive administrative endpoints using proper authentication and firewall IP whitelisting rather than asking search bots to ignore them.</p>
      `,
      hint: "Try typing /robots.txt in the simulated browser URL bar above! Then follow where the Disallow paths lead.",
      hash: "f26deec9c685f063316885d91ad949d70fdd8fe9d23a9086af8299a348e7a8ab",
      ans: "flag{robots_reveal_hidden_doors}",
      setup: () => {
        const inp = document.getElementById("w3-path");
        const btn = document.getElementById("w3-go");
        const win = document.getElementById("w3-view");
        if (inp && btn && win) {
          const nav = () => {
            const p = inp.value.trim().toLowerCase();
            if (p === "/robots.txt") {
              win.innerHTML = `<pre>User-agent: *
Disallow: /admin-secret-dump/
Disallow: /backups/
Disallow: /api/v1/private/</pre>`;
            } else if (p === "/admin-secret-dump" || p === "/admin-secret-dump/") {
              win.innerHTML = `<h3>Index of /admin-secret-dump/</h3>
<ul>
  <li><a href="#" id="w3-secret-file">confidential_backup.txt</a></li>
</ul>`;
              setTimeout(() => {
                const f = document.getElementById("w3-secret-file");
                if (f) f.addEventListener("click", (e) => {
                  e.preventDefault();
                  inp.value = "/admin-secret-dump/confidential_backup.txt";
                  nav();
                });
              }, 50);
            } else if (p.includes("confidential_backup.txt")) {
              if (window.SoundEngine) window.SoundEngine.success();
              win.innerHTML = `<div class="status-msg success">
<b>CONFIDENTIAL SYSTEM BACKUP:</b><br>
Database Host: 10.0.4.12<br>
Root Password: red_herring_pass<br>
System Flag: <b>flag{robots_reveal_hidden_doors}</b>
</div>`;
            } else {
              win.innerHTML = `<div class="status-msg error">404 Not Found: Path '${p}' does not exist on this server.</div>`;
            }
          };
          btn.addEventListener("click", nav);
          inp.addEventListener("keydown", e => { if (e.key === "Enter") nav(); });
        }
      }
    },
    {
      id: "web4",
      roomId: "web",
      title: "Lesson 4: SQL Injection (SQLi) & Query Manipulation",
      points: 250,
      level: "medium",
      concept: `
        <h4>What is SQL Injection?</h4>
        <p>SQL Injection consistently ranks among the most critical web application vulnerabilities (OWASP Top 10). It happens when untrusted user input is concatenated directly into a database query string.</p>
        <p>Consider this vulnerable SQL query:<br>
        <code class="mono">SELECT * FROM users WHERE user = 'USER_INPUT' AND pass = 'PASS_INPUT'</code></p>
        <p>If an attacker inputs <code class="mono">' OR '1'='1' --</code> into the password field, the query becomes:<br>
        <code class="mono">SELECT * FROM users WHERE user = 'admin' AND pass = '' OR '1'='1' --'</code><br>
        Because <code class="mono">1=1</code> is always true, and <code class="mono">--</code> comments out the remainder of the query, the database logs the attacker in as the first user (administrator)!</p>
      `,
      realWorld: `
        <p>High-profile breaches at companies worldwide have occurred due to basic SQL injections, allowing attackers to dump millions of customer credit cards and password hashes.</p>
      `,
      labGuide: `
        <ol>
          <li>Type into the username or password fields and watch how the simulated backend SQL query updates in real time.</li>
          <li>Enter a classic SQL bypass string like <code class="mono">' OR 1=1 --</code> into the password box.</li>
          <li>Click <b>Submit Query</b> to observe the authentication bypass in action.</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <div class="form-group mb-2">
            <label>Username</label>
            <input type="text" id="w4-user" class="form-input" placeholder="admin" value="admin">
          </div>
          <div class="form-group mb-2">
            <label>Password</label>
            <input type="text" id="w4-pass" class="form-input" placeholder="password">
          </div>
          <div class="mb-2">
            <small class="text-muted">Simulated Backend SQL Query (Watch the syntax):</small>
            <div id="w4-sql" class="code-banner text-left" style="font-size:0.85rem;">SELECT * FROM users WHERE username = 'admin' AND password = ''</div>
          </div>
          <button class="btn primary" id="w4-login">Submit Query</button>
          <div id="w4-out" class="status-msg mt-2"></div>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> NEVER build SQL queries via string concatenation! Always use <b>Parameterized Queries (Prepared Statements)</b> or Object-Relational Mappers (ORMs). With prepared statements, the database treats user input strictly as data values, never as executable SQL code.</p>
      `,
      hint: "What happens if password is: ' OR '1'='1 or admin' -- ? Closing the single quote and adding an OR statement makes the WHERE clause always evaluate to true!",
      hash: "883afa5c716521fb69e0814cc3e40328a62095362a6d100165fa5b18f1561790",
      ans: "flag{sqli_auth_bypass_master}",
      setup: () => {
        const u = document.getElementById("w4-user");
        const p = document.getElementById("w4-pass");
        const sql = document.getElementById("w4-sql");
        const btn = document.getElementById("w4-login");
        const out = document.getElementById("w4-out");

        const updateSql = () => {
          if (sql) sql.innerText = `SELECT * FROM users WHERE username = '${u.value}' AND password = '${p.value}'`;
        };
        u.addEventListener("input", updateSql);
        p.addEventListener("input", updateSql);

        if (btn && out) {
          btn.addEventListener("click", () => {
            const uv = u.value;
            const pv = p.value;
            const sqliPattern = /('|--|or\s+['"]?1['"]?\s*=\s*['"]?1|or\s+true)/i;
            const isBypass = sqliPattern.test(pv) || sqliPattern.test(uv);

            if (isBypass) {
              if (window.SoundEngine) window.SoundEngine.success();
              out.className = "status-msg success";
              out.innerHTML = `🎉 SQL Injection Successful! Database returned Row 1 (Administrator).<br>Flag: <b>flag{sqli_auth_bypass_master}</b>`;
            } else {
              if (window.SoundEngine) window.SoundEngine.error();
              out.className = "status-msg error";
              out.innerText = "❌ 0 rows returned: Invalid username or password.";
            }
          });
        }
      }
    },
    {
      id: "web5",
      roomId: "web",
      title: "Lesson 5: JSON Web Tokens (JWT) & Algorithm 'none' Attack",
      points: 350,
      level: "hard",
      concept: `
        <h4>Understanding JWT Structure & Signature Flaws</h4>
        <p>A JSON Web Token (JWT) is composed of three Base64URL-encoded parts separated by periods: <code class="mono">Header.Payload.Signature</code>.</p>
        <ul>
          <li><b>Header:</b> Specifies metadata, such as token type and signature algorithm (e.g. <code class="mono">{"alg": "HS256"}</code>).</li>
          <li><b>Payload:</b> Contains user claims (e.g. <code class="mono">{"user": "guest", "role": "user"}</code>).</li>
          <li><b>Signature:</b> Cryptographic hash verifying that the payload hasn't been altered.</li>
        </ul>
        <p><b>The Vulnerability:</b> The JWT RFC allows an algorithm named <code class="mono">"none"</code>. If a server library naively trusts the header algorithm without enforcing a strict whitelist, an attacker can modify the payload to <code class="mono">role: "admin"</code>, set <code class="mono">"alg": "none"</code>, and remove the signature completely!</p>
      `,
      realWorld: `
        <p>Multiple prominent open-source JWT verification libraries historically suffered from this flaw, permitting complete authentication bypass across modern microservices.</p>
      `,
      labGuide: `
        <ol>
          <li>Click <b>Inspect Token</b> to decode the current JWT.</li>
          <li>Change the header to: <code class="mono">{"alg":"none","typ":"JWT"}</code> and payload to: <code class="mono">{"user":"guest","role":"admin"}</code>.</li>
          <li>Encode both as Base64URL, join with dots, and leave the signature empty (e.g. <code class="mono">header.payload.</code>).</li>
          <li>Click <b>Send to API</b> to execute the exploit.</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <label>Authentication Token:</label>
          <textarea id="w5-jwt" class="form-input mono" rows="3">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZ3Vlc3QiLCJyb2xlIjoiZ3Vlc3QifQ.invalidsig123</textarea>
          <div class="d-flex gap-2 mt-2">
            <button class="btn small" id="w5-decode">Inspect Token</button>
            <button class="btn primary small" id="w5-send">Send to API</button>
          </div>
          <div id="w5-inspection" class="code-banner mt-2" style="display:none; text-align:left; font-size:0.85rem;"></div>
          <div id="w5-res" class="status-msg mt-2"></div>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> Server authentication middleware must explicitly enforce expected verification algorithms (e.g. strictly <code class="mono">algorithms: ['HS256']</code>) and reject any token bearing <code class="mono">"alg": "none"</code>.</p>
      `,
      hint: "Change the header to: {\"alg\":\"none\",\"typ\":\"JWT\"} and payload to: {\"user\":\"guest\",\"role\":\"admin\"}. Encode each with Base64URL, and join with a dot plus a trailing dot (header.payload.).",
      hash: "98cc580640fb0affe137576af8d04cd608be04064ddbf1ac1596cd8ffbb9d787",
      ans: "flag{alg_none_means_no_trust}",
      setup: () => {
        const txt = document.getElementById("w5-jwt");
        const decBtn = document.getElementById("w5-decode");
        const sendBtn = document.getElementById("w5-send");
        const inspect = document.getElementById("w5-inspection");
        const res = document.getElementById("w5-res");

        const b64u = s => {
          let c = s.replace(/-/g, '+').replace(/_/g, '/');
          while (c.length % 4) c += '=';
          return atob(c);
        };

        if (decBtn && txt && inspect) {
          decBtn.addEventListener("click", () => {
            const parts = txt.value.trim().split('.');
            if (parts.length < 2) {
              inspect.style.display = "block";
              inspect.innerText = "Error: Invalid JWT structure.";
              return;
            }
            try {
              const h = b64u(parts[0]);
              const p = b64u(parts[1]);
              inspect.style.display = "block";
              inspect.innerHTML = `<b>Header:</b> ${h}<br><b>Payload:</b> ${p}<br><b>Signature:</b> ${parts[2] || "(empty)"}`;
            } catch(e) {
              inspect.style.display = "block";
              inspect.innerText = "Error decoding Base64: " + e.message;
            }
          });
        }

        if (sendBtn && txt && res) {
          sendBtn.addEventListener("click", () => {
            const parts = txt.value.trim().split('.');
            if (parts.length < 2) {
              res.className = "status-msg error";
              res.innerText = "Bad Request: Token must contain dot-separated parts.";
              return;
            }
            try {
              const h = JSON.parse(b64u(parts[0]));
              const p = JSON.parse(b64u(parts[1]));
              const alg = String(h.alg || "").toLowerCase();

              if (alg === "none") {
                if (p.role === "admin") {
                  if (window.SoundEngine) window.SoundEngine.success();
                  res.className = "status-msg success";
                  res.innerHTML = `🌟 200 OK: Welcome Superadmin! Authorization valid.<br>Flag: <b>flag{alg_none_means_no_trust}</b>`;
                } else {
                  res.className = "status-msg";
                  res.innerText = "200 OK: Hello " + (p.user || "guest") + ". You have valid access, but role is not admin.";
                }
              } else {
                if (window.SoundEngine) window.SoundEngine.error();
                res.className = "status-msg error";
                res.innerText = "401 Unauthorized: Invalid HMAC secret or signature mismatch.";
              }
            } catch(e) {
              res.className = "status-msg error";
              res.innerText = "Error parsing token JSON: " + e.message;
            }
          });
        }
      }
    },

    /* ========================================================
       MODULE 3: OSINT & RECONNAISSANCE
    ======================================================== */
    {
      id: "osint1",
      roomId: "osint",
      title: "Lesson 1: Geographic Clue Triangulation",
      points: 100,
      level: "easy",
      concept: `
        <h4>The Art of Open Source Intelligence (OSINT)</h4>
        <p>OSINT refers to the collection and analysis of data gathered from publicly available sources (photographs, government registries, maps, and satellite imagery) to produce actionable intelligence.</p>
        <p>In geographic OSINT (Geo-OSINT), investigators combine 2–3 distinguishing clues to eliminate thousands of candidates and identify exact locations.</p>
      `,
      realWorld: `
        <p>Journalists (such as Bellingcat) and incident responders use geolocation OSINT to verify authentic news footage, trace military movements, and investigate cybercrime safehouses.</p>
      `,
      labGuide: `
        <ol>
          <li>Read the three distinguishing landmark characteristics below.</li>
          <li>Formulate an exact search query combining the unique terms.</li>
          <li>Submit the landmark name as <code class="mono">flag{name_with_underscores}</code> (lowercase, without city).</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <ul style="padding-left:1.2rem; margin:0.5rem 0;">
            <li>Wrought-iron lattice tower located in Europe</li>
            <li>Built as the entrance arch for the 1889 World's Fair</li>
            <li>Critics originally called it an eyesore; nicknamed "La dame de fer"</li>
          </ul>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> Be cautious when posting photos of sensitive facilities, data centers, or executive offices online. Distinctive architectural features and window views can easily reveal confidential physical locations.</p>
      `,
      hint: "It stands in Paris on the Champ de Mars. Two English words separated by an underscore.",
      hash: "a9189ce548beca1a4b425543a0672e5e82c9f4a024040b60df30004c87780a5b",
      ans: "flag{eiffel_tower}"
    },
    {
      id: "osint2",
      roomId: "osint",
      title: "Lesson 2: Git History Auditing & Accidental Commits",
      points: 150,
      level: "medium",
      concept: `
        <h4>Git Never Forgets (Unless You Rewrite History)</h4>
        <p>Git is a distributed content tracker designed to preserve an immutable history of every change. If a developer accidentally commits a file containing passwords or API tokens, <b>simply deleting the file in the next commit DOES NOT remove it from Git history</b>!</p>
        <p>Anyone with read access to the repository can run <code class="mono">git log -p</code> to inspect all historical diffs and retrieve the secret.</p>
      `,
      realWorld: `
        <p>Automated botnets scan GitHub public commit feeds 24/7 in real time. Within seconds of an AWS or Stripe API key being committed, attackers scrape the key and spin up unauthorized cryptocurrency mining clusters.</p>
      `,
      labGuide: `
        <ol>
          <li>Click the <b>git log -p</b> button to inspect the simulated repository history.</li>
          <li>Scroll through the commit diffs to see what was deleted in commit <code class="mono">d41d8cd</code>.</li>
          <li>Extract the leaked production credential.</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <div class="d-flex justify-between align-center mb-2">
            <b>Repository: corp-infra/auth-service.git</b>
            <button class="btn small" id="osint2-btn-log">git log -p</button>
          </div>
          <div id="osint2-git-view" class="code-banner text-left" style="font-size:0.85rem; max-height:220px; overflow-y:auto;">
            Click 'git log -p' to inspect commit history...
          </div>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> Use pre-commit hooks (like <i>trufflehog</i> or <i>git-secrets</i>) to block secrets from ever being committed. If a secret is committed, immediately <b>revoke and rotate</b> the credential and purge history with tools like <code class="mono">git-filter-repo</code>.</p>
      `,
      hint: "Click the 'git log -p' button and scroll through older commits to find what was committed and then removed in a cleanup commit.",
      hash: "85747bc9ed17ce7a6b395e8f95cb6e901757b2733841fc36cfd5c8c9b448f286",
      ans: "flag{git_history_remembers_everything}",
      setup: () => {
        const btn = document.getElementById("osint2-btn-log");
        const view = document.getElementById("osint2-git-view");
        if (btn && view) {
          btn.addEventListener("click", () => {
            view.innerHTML = `<span style="color:var(--beige-gold)">commit d41d8cd98f00b204e9800998ecf8427e</span> (HEAD -> main)
Author: DevBob &lt;bob@corp.internal&gt;
Date:   Mon Nov 24 09:12:00 2026 -0500

    oops! removed accidentally committed API secrets

diff --git a/config.env b/config.env
deleted file mode 100644
--- a/config.env
+++ /dev/null
@@ -1,3 +0,0 @@
-PORT=8080
-DATABASE_URL=postgres://app:secret123@db.internal:5432
-<span style="color:var(--color-success)">-AWS_PRODUCTION_KEY=flag{git_history_remembers_everything}</span>

<span style="color:var(--beige-gold)">commit 8b1a9953c4611296a827abf8c47804d7</span>
Author: DevBob &lt;bob@corp.internal&gt;
Date:   Sun Nov 23 23:45:12 2026 -0500

    Initial setup of authentication routes`;
          });
        }
      }
    },
    {
      id: "osint3",
      roomId: "osint",
      title: "Lesson 3: Social Media Footprints & Security Questions",
      points: 200,
      level: "medium",
      concept: `
        <h4>The Insecurity of Knowledge-Based Authentication</h4>
        <p>Many online systems allow users to reset passwords by answering security questions (e.g. <i>"What was the name of your first pet?"</i> or <i>"What high school did you attend?"</i>).</p>
        <p>Attackers do not need complex exploits to bypass these questions—they simply browse the victim's public social media posts where people routinely celebrate their pets' birthdays, graduation milestones, and family memories.</p>
      `,
      realWorld: `
        <p>Numerous high-profile celebrity email and social account takeovers have been carried out entirely through answering public security questions researched from Wikipedia and Instagram.</p>
      `,
      labGuide: `
        <ol>
          <li>Read target Jordan Rivera's public social media post below.</li>
          <li>Identify the pet's name mentioned in the post.</li>
          <li>Enter the name into the verification box to bypass the account security challenge.</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <div class="social-card">
            <div class="social-header">
              <div class="social-avatar">🐶</div>
              <div>
                <strong>Jordan Rivera</strong> <small class="text-muted">@jrivera_cyber</small>
                <div style="font-size:0.8rem; color:var(--text-muted);">Lead DevOps Engineer @ Apex Systems</div>
              </div>
            </div>
            <div class="social-body mt-2">
              <p>"Happy 3rd birthday to my favorite Golden Retriever, <b>Barnaby</b>! Can't imagine coding without my office buddy 🐾 #doglovers #codingcompanion"</p>
              <small class="text-muted">Posted 2 days ago from Austin, TX</small>
            </div>
          </div>
          <div class="mt-3">
            <p>Security Portal Question: <i>"Enter the name of your pet to verify identity"</i></p>
            <div class="input-group">
              <input type="text" id="osint3-inp" class="form-input" placeholder="Enter pet name">
              <button class="btn primary" id="osint3-btn">Unlock Account</button>
            </div>
            <div id="osint3-out" class="status-msg mt-2"></div>
          </div>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> Deprecate security questions in favor of modern <b>Multi-Factor Authentication (MFA)</b> like time-based authenticator apps (TOTP) or hardware security keys (FIDO2 / WebAuthn). If forced to answer security questions, treat the answer like a random password.</p>
      `,
      hint: "Read Jordan's social media post carefully. What is the golden retriever's name?",
      hash: "9d0717bf62a89b69c210fa0f4804f005ccfc1f0dbadad3bababfa284a31af0cc",
      ans: "flag{osint_social_footprint_exposed}",
      setup: () => {
        const inp = document.getElementById("osint3-inp");
        const btn = document.getElementById("osint3-btn");
        const out = document.getElementById("osint3-out");
        if (inp && btn && out) {
          btn.addEventListener("click", () => {
            if (inp.value.trim().toLowerCase() === "barnaby") {
              if (window.SoundEngine) window.SoundEngine.success();
              out.className = "status-msg success";
              out.innerHTML = `Identity Verified! Security question bypassed.<br>Flag: <b>flag{osint_social_footprint_exposed}</b>`;
            } else {
              if (window.SoundEngine) window.SoundEngine.error();
              out.className = "status-msg error";
              out.innerText = "Incorrect answer. Account remains locked.";
            }
          });
        }
      }
    },
    {
      id: "osint4",
      roomId: "osint",
      title: "Lesson 4: DNS Records & Domain Reconnaissance",
      points: 250,
      level: "medium",
      concept: `
        <h4>What DNS Records Reveal About Infrastructure</h4>
        <p>The Domain Name System (DNS) translates human-readable domain names into IP addresses. Beyond IP lookups, DNS publishes record types that reveal organizational details:</p>
        <ul>
          <li><b>MX Records:</b> Identify mail servers (e.g. Google Workspace, Microsoft 365).</li>
          <li><b>TXT Records:</b> Used for email authentication (SPF, DKIM, DMARC) and domain ownership proofs.</li>
        </ul>
        <p>Security teams regularly discover forgotten third-party services, subdomains, and verification tokens by querying domain TXT records.</p>
      `,
      realWorld: `
        <p>During security assessments, running DNS enumeration using tools like <code class="mono">dig</code> or <code class="mono">amass</code> maps out an organization's entire attack surface before touching a single web page.</p>
      `,
      labGuide: `
        <ol>
          <li>Use the simulated <code class="mono">dig TXT</code> tool below to query <code class="mono">target-defense.net</code>.</li>
          <li>Inspect the returned DNS answer section.</li>
          <li>Find the challenge verification TXT record to retrieve the lesson flag.</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <div class="input-group">
            <span class="mono" style="padding:0.6rem 0.8rem; background:var(--panel-2); border-radius:6px 0 0 6px;">dig TXT</span>
            <input type="text" id="osint4-domain" class="form-input" value="target-defense.net">
            <button class="btn primary" id="osint4-btn">Query DNS</button>
          </div>
          <div id="osint4-res" class="code-banner text-left mt-2" style="font-size:0.85rem; display:none;"></div>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> Periodically audit your organization's external DNS zone files. Remove orphaned TXT verification records from obsolete vendors to avoid information leakage and Subdomain Takeover attacks.</p>
      `,
      hint: "Click 'Query DNS' to run the simulated DNS lookup on target-defense.net and check the TXT verification records.",
      hash: "937c6c4d9a5e8966fb3a2ab5910cbfe881cd6ada881abefa679ad1e0f77eea59",
      ans: "flag{dns_txt_record_found}",
      setup: () => {
        const btn = document.getElementById("osint4-btn");
        const dom = document.getElementById("osint4-domain");
        const res = document.getElementById("osint4-res");
        if (btn && dom && res) {
          btn.addEventListener("click", () => {
            res.style.display = "block";
            res.innerHTML = `; &lt;&lt;&gt;&gt; DiG 9.18.1 &lt;&lt;&gt;&gt; TXT ${dom.value}
;; QUESTION SECTION:
;${dom.value}.    IN    TXT

;; ANSWER SECTION:
${dom.value}. 300 IN TXT "v=spf1 include:_spf.google.com ~all"
<b>${dom.value}. 300 IN TXT "security-challenge-verification=flag{dns_txt_record_found}"</b>
${dom.value}. 300 IN TXT "google-site-verification=4kLmNoP98..."

;; Query time: 14 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)`;
          });
        }
      }
    },

    /* ========================================================
       MODULE 4: CRYPTOGRAPHY
    ======================================================== */
    {
      id: "cry1",
      roomId: "crypto",
      title: "Lesson 1: Substitution Ciphers & ROT13",
      points: 100,
      level: "easy",
      concept: `
        <h4>The Caesar Cipher & Why Simple Shifts Fail</h4>
        <p>The Caesar cipher shifts each letter in the alphabet by a fixed number of positions. <b>ROT13</b> rotates letters by 13 positions. Because the English alphabet has 26 letters, applying ROT13 twice returns the original message!</p>
        <p>Since the shift distance is identical for every letter, simple letter-frequency analysis or testing all 25 possible shifts breaks Caesar ciphers in milliseconds.</p>
      `,
      realWorld: `
        <p>While obsolete for real security, ROT13 is still used in web development and forums to obscure spoilers and puzzle hints from immediate view.</p>
      `,
      labGuide: `
        <ol>
          <li>Read the ciphertext below.</li>
          <li>Notice that the braces <code class="mono">{ }</code> remain unchanged because ROT13 only alters alphabetical characters.</li>
          <li>Decode it using the built-in <b>Cyber Toolbelt &rarr; ROT13</b> button.</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <p>Intercepted ROT13 ciphertext:</p>
          <div class="code-banner select-all">synt{ebg13_vf_abg_rapelcgvba}</div>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> Never implement custom "roll-your-own" shift ciphers. Always use standardized, peer-reviewed cryptographic libraries implementing <b>AES-256</b> or <b>ChaCha20-Poly1305</b>.</p>
      `,
      hint: "s shifted by 13 is f, y shifted by 13 is l, etc. Use the Cyber Tools ROT/Caesar operation.",
      hash: "f88220851f00f229caffa2e06c33d7088bda50fe5489ca96fe8e0ccbd264b7cd",
      ans: "flag{rot13_is_not_encryption}"
    },
    {
      id: "cry2",
      roomId: "crypto",
      title: "Lesson 2: Polyalphabetic Ciphers & Vigenère Keywords",
      points: 200,
      level: "medium",
      concept: `
        <h4>Overcoming Frequency Analysis with Keywords</h4>
        <p>The <b>Vigenère cipher</b> improves on Caesar by shifting each letter using characters from a repeating secret keyword. Because the shift varies from letter to letter, simple single-letter frequency analysis is disrupted.</p>
        <p>However, if an attacker knows the key length or can deduce parts of the message (a <b>Known-Plaintext Attack</b>), the repeating keyword pattern can be quickly uncovered.</p>
      `,
      realWorld: `
        <p>Historically considered unbreakable ("le chiffre indéchiffrable"), the Vigenère cipher was broken in the 19th century by Friedrich Kasiski using repeating factor analysis.</p>
      `,
      labGuide: `
        <ol>
          <li>Ciphertext: <code class="mono">rznq{ockg_eotcmh_ckxrqfac_pcmy}</code></li>
          <li>Clue: The keyword is a 6-letter banana-loving animal (<code class="mono">monkey</code>).</li>
          <li>Decode using a Vigenère tool with keyword <code class="mono">monkey</code>.</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <div class="code-banner select-all">rznq{ockg_eotcmh_ckxrqfac_pcmy}</div>
          <p class="mt-2 text-muted"><small>Clue: Key is a 6-letter animal: <b>m _ _ _ _ _</b></small></p>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> Repeating key reuse leaks statistical patterns. Modern stream and block ciphers require unique, random <b>Initialization Vectors (IVs)</b> or Nonces for every encryption operation to prevent pattern repetition.</p>
      `,
      hint: "The key is 'monkey'. Use Cyber Tools or an online Vigenère decoder with key 'monkey'.",
      hash: "b72a6f6e546d1e48364e98817abbea226300a828a8351e526f00dd95d6b5dd8d",
      ans: "flag{keys_repeat_patterns_leak}"
    },
    {
      id: "cry3",
      roomId: "crypto",
      title: "Lesson 3: The XOR Bitwise Operation & Single-Byte Streams",
      points: 300,
      level: "hard",
      concept: `
        <h4>The Foundation of Cryptography: XOR (⊕)</h4>
        <p>Exclusive OR (XOR) is a mathematical operation on binary bits: <code class="mono">0 ⊕ 0 = 0</code>, <code class="mono">1 ⊕ 1 = 0</code>, but <code class="mono">1 ⊕ 0 = 1</code>.</p>
        <p>Crucially, <b>XOR is its own inverse</b>: if <code class="mono">Cipher = Plain ⊕ Key</code>, then <code class="mono">Plain = Cipher ⊕ Key</code>! However, when data is encrypted using only a single repeating byte, there are only <b>256 possible keys</b> (0x00 to 0xFF), making exhaustive brute-force trivial.</p>
      `,
      realWorld: `
        <p>Malware authors frequently use single-byte XOR loops to obfuscate command-and-control strings and bypass basic static antivirus file signatures.</p>
      `,
      labGuide: `
        <ol>
          <li>Observe the hex ciphertext below.</li>
          <li>Use the slider to test XOR keys from 0 to 255.</li>
          <li>Watch the decoded preview until legible English text beginning with <code class="mono">flag{...}</code> emerges!</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <p>Hex ciphertext:</p>
          <div class="code-banner select-all">3c363b3d2135343f0538232e3f05332905343f2c3f28053f34352f3d3227</div>
          <div class="mt-3">
            <label>Test XOR Key (0 to 255 / 0x00 to 0xFF):</label>
            <div class="d-flex align-center gap-2 mt-1">
              <input type="range" id="cry3-slider" min="0" max="255" value="0" style="flex:1;">
              <span id="cry3-val" class="mono badge">0x00 (0)</span>
            </div>
            <div id="cry3-preview" class="code-banner mt-2 text-left" style="font-size:0.85rem;">...</div>
          </div>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> A stream cipher is only secure if the keystream is truly random and as long as the message itself (a One-Time Pad), or generated by an approved cryptographically secure pseudorandom generator (CSPRNG).</p>
      `,
      hint: "The first byte is 0x3c and the plaintext starts with 'f' (0x66). 0x3c XOR 0x66 = 0x5a (90). Try key 90 (0x5a)!",
      hash: "05634f9f1e78040f728eaa984d14b3eae8b645b3410ebb4e87f7c6cf34647cd0",
      ans: "flag{one_byte_is_never_enough}",
      setup: () => {
        const hex = "3c363b3d2135343f0538232e3f05332905343f2c3f28053f34352f3d3227";
        const slider = document.getElementById("cry3-slider");
        const val = document.getElementById("cry3-val");
        const prev = document.getElementById("cry3-preview");

        const update = () => {
          const k = parseInt(slider.value, 10);
          val.innerText = `0x${k.toString(16).padStart(2,'0')} (${k})`;
          const decoded = window.CyberTools.xorSingleByte(hex, k);
          prev.innerText = decoded;
        };

        if (slider) {
          slider.addEventListener("input", update);
          update();
        }
      }
    },
    {
      id: "cry4",
      roomId: "crypto",
      title: "Lesson 4: Password Hashing & Dictionary Wordlist Attacks",
      points: 250,
      level: "medium",
      concept: `
        <h4>Hashes are One-Way Functions</h4>
        <p>Unlike encryption, a cryptographic hash (like MD5 or SHA-256) is a <b>one-way mathematical operation</b>. You cannot "decrypt" a hash back to its original plaintext.</p>
        <p>To crack a hash, security auditors perform a <b>Dictionary Attack</b>: taking a list of millions of common passwords (such as the famous <i>RockYou.txt</i> list), hashing each word, and checking if the output matches the target hash.</p>
      `,
      realWorld: `
        <p>Fast algorithms like MD5 can be computed billions of times per second on modern consumer GPUs. Storing unsalted MD5 password hashes in databases is considered negligent security practice.</p>
      `,
      labGuide: `
        <ol>
          <li>Review the target MD5 hash: <code class="mono">5d41402abc4b2a76b9719d911017c592</code>.</li>
          <li>Click <b>Run Dictionary Attack</b> to test common words against the hash in real time.</li>
          <li>Observe the match and note the plaintext password discovered.</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <p>Target MD5 Hash:</p>
          <div class="code-banner mono select-all">5d41402abc4b2a76b9719d911017c592</div>
          <button class="btn primary small mt-2" id="cry4-crack">🚀 Run Dictionary Attack (RockYou-mini)</button>
          <div id="cry4-log" class="code-banner text-left mt-2" style="display:none; font-size:0.8rem; max-height:160px; overflow-y:auto;"></div>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> Always use memory-hard, computationally expensive password hashing functions (such as <b>Argon2id</b>, <b>bcrypt</b>, or <b>scrypt</b>) with unique random cryptographic <b>salts</b> per user to render pre-computed rainbow tables useless.</p>
      `,
      hint: "Click the button to run a simulated dictionary test. What common word hashes to 5d41402abc4b2a76b9719d911017c592?",
      hash: "538dffac074784241776cb8ec4eb1731d2e58d30ce03a9a1c0457f4da2dc6803",
      ans: "flag{rainbow_tables_crack_hashes}",
      setup: () => {
        const btn = document.getElementById("cry4-crack");
        const log = document.getElementById("cry4-log");
        if (btn && log) {
          btn.addEventListener("click", () => {
            log.style.display = "block";
            log.innerHTML = "Initializing dictionary attack with common words...<br>";
            const words = ["123456", "password", "qwerty", "admin", "welcome", "hello", "football", "iloveyou"];
            let i = 0;
            const timer = setInterval(() => {
              if (i < words.length) {
                const w = words[i];
                if (w === "hello") {
                  clearInterval(timer);
                  if (window.SoundEngine) window.SoundEngine.success();
                  log.innerHTML += `<span style="color:var(--color-success)">[MATCH FOUND!] Password: '${w}' &rarr; Hash: 5d41402abc4b2a76b9719d911017c592</span><br><b>Completion Flag: flag{rainbow_tables_crack_hashes}</b>`;
                } else {
                  log.innerHTML += `[-] Testing '${w}'... no match.<br>`;
                  log.scrollTop = log.scrollHeight;
                  i++;
                }
              } else {
                clearInterval(timer);
              }
            }, 120);
          });
        }
      }
    },

    /* ========================================================
       MODULE 5: DIGITAL FORENSICS
    ======================================================== */
    {
      id: "for1",
      roomId: "forensics",
      title: "Lesson 1: Binary Triage & String Extraction",
      points: 100,
      level: "easy",
      concept: `
        <h4>Finding Readable Text in Binary Files</h4>
        <p>Compiled binaries, memory dumps, and image files contain raw byte values. However, embedded within them are human-readable ASCII text strings—such as error messages, author usernames, URLs, and hardcoded keys.</p>
        <p>The standard Unix utility <code class="mono">strings</code> scans any binary file and prints any sequence of 4 or more printable ASCII characters.</p>
      `,
      realWorld: `
        <p>Malware analysts run <code class="mono">strings</code> on unknown suspicious executables to immediately discover command-and-control server domains and registry keys before performing deep disassembly.</p>
      `,
      labGuide: `
        <ol>
          <li>Examine the hex dump of an image file below.</li>
          <li>Look at the right-hand ASCII text column across offsets <code class="mono">0x0020</code> through <code class="mono">0x0040</code>.</li>
          <li>Extract the complete flag string.</li>
        </ol>
      `,
      desc: `
        <pre class="code-block" style="font-size:0.8rem;"><code>00000000  89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52   |.PNG........IHDR|
00000010  00 00 01 00 00 00 00 00 00 00 74 45 58 74 43 6f   |..........tEXtCo|
00000020  6d 6d 65 6e 74 00 66 6c 61 67 7b 73 74 72 69 6e   |mment.flag{strin|
00000030  67 73 5f 66 69 6e 64 73 5f 65 76 65 72 79 74 68   |gs_finds_everyth|
00000040  69 6e 67 7d 00 00 49 44 41 54 78 9c ed            |ing}..IDATx..|</code></pre>
      `,
      defense: `
        <p><b>Defensive Rule:</b> Do not rely on compiled binary formats to hide secret keys or credentials. Reverse engineering tools (like Ghidra and strings) expose hardcoded secrets effortlessly.</p>
      `,
      hint: "Read the text column on the right across lines 0x0020 through 0x0040.",
      hash: "199aed4339f9a2492ede8ce9b865c72d55c598eb6f13e993226c95532b2f1366",
      ans: "flag{strings_finds_everything}"
    },
    {
      id: "for2",
      roomId: "forensics",
      title: "Lesson 2: Steganography & Visual Contrast Analysis",
      points: 150,
      level: "medium",
      concept: `
        <h4>What is Steganography?</h4>
        <p>While cryptography scrambles a message so it cannot be read, <b>Steganography</b> conceals the message so nobody realizes a secret even exists.</p>
        <p>In digital images, text or data can be hidden in color shades that differ by only 1–2 RGB values from the background. The human eye sees a solid dark square, but digital sensors can amplify the variance.</p>
      `,
      realWorld: `
        <p>Advanced Persistent Threat (APT) groups have used image steganography to conceal malicious payloads inside harmless memes and logos to evade Network Intrusion Detection Systems (NIDS).</p>
      `,
      labGuide: `
        <ol>
          <li>Observe the seemingly solid dark canvas below.</li>
          <li>Drag the <b>Brightness/Contrast Boost</b> slider to amplify subtle pixel variations.</li>
          <li>Read the hidden text as the pixel contrast widens!</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <div class="d-flex align-center gap-2 mb-2">
            <label>Brightness/Contrast Boost:</label>
            <input type="range" id="for2-slider" min="1" max="10" value="1" style="flex:1;">
            <span id="for2-val" class="mono badge">1x</span>
          </div>
          <div id="for2-canvas-wrap" style="border:1px solid var(--border-color); border-radius:8px; overflow:hidden;"></div>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> Implement Content Disarm and Reconstruction (CDR) or image sanitization pipelines that re-compress and re-encode incoming media files, stripping out subtle steganographic bit-plane anomalies.</p>
      `,
      hint: "Slide the brightness/contrast booster to the right to amplify the faint color difference of the text pixels!",
      hash: "4b3080283dd023ea00b8ee45d522e02eb6ce398d47b8b30b3eb3bf1686d99f51",
      ans: "flag{contrast_reveals_all}",
      setup: () => {
        const wrap = document.getElementById("for2-canvas-wrap");
        const slider = document.getElementById("for2-slider");
        const val = document.getElementById("for2-val");

        if (wrap) {
          const cv = document.createElement("canvas");
          cv.width = 600;
          cv.height = 140;
          const ctx = cv.getContext("2d");
          ctx.fillStyle = "#0c0f1d";
          ctx.fillRect(0, 0, cv.width, cv.height);

          for (let i = 0; i < 400; i++) {
            ctx.fillStyle = Math.random() < 0.5 ? "#0b0e1b" : "#0d1020";
            ctx.fillRect(Math.random() * cv.width, Math.random() * cv.height, 2, 2);
          }

          ctx.fillStyle = "#151930";
          ctx.font = "bold 24px 'JetBrains Mono', monospace";
          ctx.textAlign = "center";
          ctx.fillText("flag{contrast_reveals_all}", 300, 78);

          cv.style.width = "100%";
          cv.style.display = "block";
          wrap.replaceChildren(cv);

          if (slider && val) {
            slider.addEventListener("input", () => {
              const v = slider.value;
              val.innerText = v + "x";
              cv.style.filter = `brightness(${v * 2.5}) contrast(${v * 4})`;
            });
          }
        }
      }
    },
    {
      id: "for3",
      roomId: "forensics",
      title: "Lesson 3: File Headers, Signatures & Magic Bytes Repair",
      points: 250,
      level: "medium",
      concept: `
        <h4>How Operating Systems Recognize File Types</h4>
        <p>File extensions like <code class="mono">.png</code> or <code class="mono">.exe</code> can easily be renamed to anything. Operating systems and forensic suites instead inspect the first few bytes of the file, known as <b>Magic Bytes</b> or <b>File Signatures</b>.</p>
        <ul>
          <li><b>PNG:</b> <code class="mono">89 50 4E 47</code> (<code class="mono">.PNG</code>)</li>
          <li><b>JPEG:</b> <code class="mono">FF D8 FF</code></li>
          <li><b>PDF:</b> <code class="mono">25 50 44 46</code> (<code class="mono">%PDF</code>)</li>
          <li><b>ZIP:</b> <code class="mono">50 4B 03 04</code> (<code class="mono">PK..</code>)</li>
        </ul>
        <p>If the first 4 bytes of a PNG are damaged or intentionally corrupted, image viewers will refuse to render it.</p>
      `,
      realWorld: `
        <p>Adversaries often corrupt or tamper with file headers to prevent Automated Antivirus (AV) and Sandbox engines from parsing and analyzing executable payloads.</p>
      `,
      labGuide: `
        <ol>
          <li>Observe the damaged header below (<code class="mono">41 41 41 41</code>).</li>
          <li>Replace the 4 hex values with the legitimate PNG signature: <code class="mono">89</code>, <code class="mono">50</code>, <code class="mono">4E</code>, <code class="mono">47</code>.</li>
          <li>Click <b>Repair Header</b> to restore the image rendering.</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <p>Corrupted PNG Header (First 4 Bytes):</p>
          <div class="d-flex gap-2 align-center mb-2">
            <input type="text" id="for3-b1" class="form-input mono" style="width:60px; text-align:center;" value="41">
            <input type="text" id="for3-b2" class="form-input mono" style="width:60px; text-align:center;" value="41">
            <input type="text" id="for3-b3" class="form-input mono" style="width:60px; text-align:center;" value="41">
            <input type="text" id="for3-b4" class="form-input mono" style="width:60px; text-align:center;" value="41">
            <span class="mono text-muted">0D 0A 1A 0A ...</span>
            <button class="btn primary small" id="for3-fix">Repair Header</button>
          </div>
          <div id="for3-img-slot" class="mt-2 text-center">
            <div class="badge" style="background:var(--color-danger); color:#fff;">⚠️ CORRUPTED PNG: Invalid header signature</div>
          </div>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> File upload handlers must validate the actual file magic bytes rather than blindly trusting the user-provided <code class="mono">Content-Type</code> or file extension to avoid uploading disguised malicious executables.</p>
      `,
      hint: "A PNG file's first 4 hex bytes are always 89 50 4E 47. Enter them in the 4 boxes!",
      hash: "f8b293bf2bb0342c8e48fea659c0109c1c94e8d37d169fff5e44a85ed3ef6af3",
      ans: "flag{magic_bytes_restored}",
      setup: () => {
        const b1 = document.getElementById("for3-b1");
        const b2 = document.getElementById("for3-b2");
        const b3 = document.getElementById("for3-b3");
        const b4 = document.getElementById("for3-b4");
        const btn = document.getElementById("for3-fix");
        const slot = document.getElementById("for3-img-slot");

        if (btn && slot) {
          btn.addEventListener("click", () => {
            const h = `${b1.value.trim()}${b2.value.trim()}${b3.value.trim()}${b4.value.trim()}`.toUpperCase();
            if (h === "89504E47") {
              if (window.SoundEngine) window.SoundEngine.success();
              slot.innerHTML = `
                <div class="status-msg success">
                  ✅ Magic Bytes Verified! File parser restored image:<br>
                  <div class="code-banner mt-2" style="background:#000; color:var(--color-success); font-size:1.1rem; padding:1.2rem;">
                    🖼️ [RESTORED IMAGE CONTENT]<br>
                    <b>flag{magic_bytes_restored}</b>
                  </div>
                </div>
              `;
            } else {
              if (window.SoundEngine) window.SoundEngine.error();
              slot.innerHTML = `<div class="badge" style="background:var(--color-danger); color:#fff;">❌ Corrupted Header: ${h} is not a valid PNG signature. Expected: 89 50 4E 47</div>`;
            }
          });
        }
      }
    },
    {
      id: "for4",
      roomId: "forensics",
      title: "Lesson 4: Network Packet Capture & Cleartext Traffic",
      points: 250,
      level: "medium",
      concept: `
        <h4>Why Cleartext Protocols are Insecure</h4>
        <p>When data is transmitted over plain HTTP, FTP, or Telnet, network packets cross routers without any encryption. Network protocol analyzers like <b>Wireshark</b> capture and reassemble these TCP streams in plain human-readable text.</p>
        <p>Anyone positioned on the same local network or Wi-Fi hotspot can read submitted passwords and authorization tokens directly out of the packet payload.</p>
      `,
      realWorld: `
        <p>The "Firesheep" extension in 2010 demonstrated how trivial it was to hijack Facebook and Twitter sessions over open coffee shop Wi-Fi networks, prompting the tech industry to mandate HTTPS everywhere.</p>
      `,
      labGuide: `
        <ol>
          <li>Examine the simulated Wireshark packet capture table below.</li>
          <li>Locate Packet #2 (<code class="mono">POST /api/v1/auth</code>).</li>
          <li>Click the row to reconstruct the TCP stream and discover the credentials sent over clear text.</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <small class="text-muted">Simulated Packet Capture Stream (Filter: <code class="mono">http.request</code>):</small>
          <div class="packet-table mt-1">
            <div class="packet-row packet-header">
              <span>No.</span><span>Protocol</span><span>Source &rarr; Destination</span><span>Info</span>
            </div>
            <div class="packet-row" id="pkt-1">
              <span>1</span><span>DNS</span><span>192.168.1.45 &rarr; 8.8.8.8</span><span>Standard query A login.corp</span>
            </div>
            <div class="packet-row clickable" id="pkt-2">
              <span>2</span><span>HTTP</span><span>192.168.1.45 &rarr; 10.0.0.8</span><span>POST /api/v1/auth HTTP/1.1</span>
            </div>
            <div class="packet-row" id="pkt-3">
              <span>3</span><span>TCP</span><span>10.0.0.8 &rarr; 192.168.1.45</span><span>80 &rarr; 54210 [ACK]</span>
            </div>
          </div>
          <div id="pkt-detail" class="code-banner text-left mt-2" style="font-size:0.8rem; display:none;"></div>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> Enforce <b>HTTPS with TLS 1.3</b> for all network traffic. Use <b>HTTP Strict Transport Security (HSTS)</b> headers so browsers automatically refuse to communicate over unencrypted HTTP.</p>
      `,
      hint: "Click on packet #2 (POST /api/v1/auth) in the table above to follow the TCP stream!",
      hash: "e1ab26ab53a5d89cb098b4541e9e0237597db82ffcd57903de0a4dc8954868d2",
      ans: "flag{cleartext_packets_sniffed}",
      setup: () => {
        const p2 = document.getElementById("pkt-2");
        const dt = document.getElementById("pkt-detail");
        if (p2 && dt) {
          p2.addEventListener("click", () => {
            dt.style.display = "block";
            dt.innerHTML = `<b>Follow TCP Stream (Frame 2):</b><br>
POST /api/v1/auth HTTP/1.1
Host: login.corp.internal
User-Agent: Mozilla/5.0
Content-Type: application/x-www-form-urlencoded
Content-Length: 54

username=admin&secret_token=<b>flag{cleartext_packets_sniffed}</b>`;
          });
        }
      }
    },

    /* ========================================================
       MODULE 6: LINUX CLI ESSENTIALS
    ======================================================== */
    {
      id: "term1",
      roomId: "terminal",
      title: "Lesson 1: Uncovering Hidden Linux Dotfiles",
      points: 50,
      level: "intro",
      concept: `
        <h4>What are Dotfiles in Unix/Linux?</h4>
        <p>In Linux and macOS, any file whose name begins with a period <code class="mono">.</code> (such as <code class="mono">.env</code>, <code class="mono">.bash_history</code>, or <code class="mono">.git/</code>) is treated as a <b>hidden file</b>.</p>
        <p>Running the standard <code class="mono">ls</code> command hides these files by default. To list all files including hidden dotfiles, the <code class="mono">-a</code> (all) flag must be used: <code class="mono">ls -la</code>.</p>
      `,
      realWorld: `
        <p>Developers frequently store database credentials and API keys in hidden <code class="mono">.env</code> files in the root folder. Attackers who obtain server shell access immediately check for hidden dotfiles.</p>
      `,
      labGuide: `
        <ol>
          <li>Type <code class="mono">ls</code> in the box below and notice that only <code class="mono">notes.txt</code> appears.</li>
          <li>Now run <code class="mono">ls -la</code> to reveal hidden dotfiles.</li>
          <li>Use <code class="mono">cat .secret_flag.txt</code> to read the secret contents.</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <div class="input-group">
            <span class="mono" style="padding:0.6rem 0.8rem; background:var(--panel-2); border-radius:6px 0 0 6px;">$</span>
            <input type="text" id="t1-cmd" class="form-input" placeholder="ls -la">
            <button class="btn primary" id="t1-exec">Run</button>
          </div>
          <div id="t1-out" class="code-banner text-left mt-2" style="font-size:0.85rem; display:none;"></div>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> Restrict file permissions on sensitive configuration dotfiles (<code class="mono">chmod 600 .env</code>) and add <code class="mono">.env*</code> to your <code class="mono">.gitignore</code> file so credentials never leave the host.</p>
      `,
      hint: "Run 'ls -la' in the command box, then read the contents with 'cat .secret_flag.txt'.",
      hash: "714cc1b4700be2ade2ced07c44f6a47025bbcbcefec9064a27d729158cd10bdd",
      ans: "flag{hidden_dot_files_found}",
      setup: () => {
        const inp = document.getElementById("t1-cmd");
        const btn = document.getElementById("t1-exec");
        const out = document.getElementById("t1-out");
        if (inp && btn && out) {
          const run = () => {
            const cmd = inp.value.trim();
            out.style.display = "block";
            if (cmd === "ls -la" || cmd === "ls -a") {
              out.innerHTML = `drwxr-xr-x 2 user user 4096 Nov 24 10:00 .
drwxr-xr-x 4 user user 4096 Nov 24 09:50 ..
<b>-rw-r--r-- 1 user user   38 Nov 24 10:01 .secret_flag.txt</b>
-rw-r--r-- 1 user user  220 Nov 24 09:50 notes.txt`;
            } else if (cmd.includes("cat .secret_flag.txt")) {
              if (window.SoundEngine) window.SoundEngine.success();
              out.innerHTML = `<span style="color:var(--color-success)">flag{hidden_dot_files_found}</span>`;
            } else if (cmd === "ls") {
              out.innerText = "notes.txt";
            } else {
              out.innerText = `Command executed: ${cmd}. Try running 'ls -la' or 'cat .secret_flag.txt'.`;
            }
          };
          btn.addEventListener("click", run);
          inp.addEventListener("keydown", e => { if (e.key === "Enter") run(); });
        }
      }
    },
    {
      id: "term2",
      roomId: "terminal",
      title: "Lesson 2: Linux Permissions & The Executable Bit (chmod)",
      points: 100,
      level: "easy",
      concept: `
        <h4>Understanding Linux File Permissions (rwx)</h4>
        <p>Every file in Linux has permissions assigned to three tiers of users: <b>Owner (u)</b>, <b>Group (g)</b>, and <b>Others (o)</b>.</p>
        <p>Permissions define three actions: <b>Read (r)</b>, <b>Write (w)</b>, and <b>Execute (x)</b>. When a bash script is created, it lacks the executable bit by default. Attempting to run it results in <code class="mono">Permission denied</code>.</p>
        <p>The command <code class="mono">chmod +x script.sh</code> grants execution rights.</p>
      `,
      realWorld: `
        <p>Misconfigured permissions (such as assigning world-writable <code class="mono">chmod 777</code> to critical scripts) allow low-privileged attackers to modify system tasks and achieve complete Root Privilege Escalation.</p>
      `,
      labGuide: `
        <ol>
          <li>Run <code class="mono">chmod +x run_me.sh</code> to grant execution privileges to the script.</li>
          <li>Execute the script by typing <code class="mono">./run_me.sh</code>.</li>
          <li>Observe the script running and outputting the completion flag.</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <div class="input-group">
            <span class="mono" style="padding:0.6rem 0.8rem; background:var(--panel-2); border-radius:6px 0 0 6px;">$</span>
            <input type="text" id="t2-cmd" class="form-input" placeholder="chmod +x run_me.sh">
            <button class="btn primary" id="t2-exec">Run</button>
          </div>
          <div id="t2-out" class="code-banner text-left mt-2" style="font-size:0.85rem; display:none;"></div>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> Adhere strictly to the <b>Principle of Least Privilege (PoLP)</b>. Never use <code class="mono">chmod 777</code>. Only grant execution permissions to files and users that strictly require them.</p>
      `,
      hint: "First run 'chmod +x run_me.sh', then execute it by typing './run_me.sh'.",
      hash: "07437ccc9f9a3281bd9c62aed01025c7c9d35abd6b6b5c1ce7a8222018c34f64",
      ans: "flag{executable_permissions_granted}",
      setup: () => {
        let isExecutable = false;
        const inp = document.getElementById("t2-cmd");
        const btn = document.getElementById("t2-exec");
        const out = document.getElementById("t2-out");
        if (inp && btn && out) {
          const run = () => {
            const cmd = inp.value.trim();
            out.style.display = "block";
            if (cmd.startsWith("chmod +x") || cmd.startsWith("chmod 755") || cmd.startsWith("chmod 777")) {
              isExecutable = true;
              out.innerHTML = `<span style="color:var(--color-success)">Permissions updated! run_me.sh is now executable (-rwxr-xr-x). Now run './run_me.sh'.</span>`;
            } else if (cmd === "./run_me.sh" || cmd === "bash run_me.sh" || cmd === "sh run_me.sh") {
              if (isExecutable || cmd.startsWith("bash") || cmd.startsWith("sh")) {
                if (window.SoundEngine) window.SoundEngine.success();
                out.innerHTML = `<span style="color:var(--color-success)">Executing run_me.sh...<br>Flag: <b>flag{executable_permissions_granted}</b></span>`;
              } else {
                if (window.SoundEngine) window.SoundEngine.error();
                out.innerHTML = `<span style="color:var(--color-danger)">bash: ./run_me.sh: Permission denied. Make it executable with 'chmod +x run_me.sh'.</span>`;
              }
            } else {
              out.innerText = `Executed: ${cmd}`;
            }
          };
          btn.addEventListener("click", run);
          inp.addEventListener("keydown", e => { if (e.key === "Enter") run(); });
        }
      }
    },
    {
      id: "term3",
      roomId: "terminal",
      title: "Lesson 3: Investigating Authentication Logs with Grep",
      points: 150,
      level: "medium",
      concept: `
        <h4>Log Analysis & Pattern Matching</h4>
        <p>Linux systems maintain system logs in <code class="mono">/var/log/</code>. For example, <code class="mono">/var/log/auth.log</code> records all SSH logins, sudo commands, and authentication failures.</p>
        <p>Because log files contain hundreds of thousands of lines, security analysts use <code class="mono">grep</code> with flags like <code class="mono">-i</code> (case-insensitive) to quickly filter out noise and isolate indicators of compromise (IoCs).</p>
      `,
      realWorld: `
        <p>During incident response triage, SOC analysts grep authentication logs to spot brute-force SSH attacks, abnormal root privilege escalations, and compromised service accounts.</p>
      `,
      labGuide: `
        <ol>
          <li>Run <code class="mono">grep -i "flag" /var/log/auth.log</code> to filter the authentication log.</li>
          <li>Inspect the matched sudo command event executed by user agent.</li>
          <li>Submit the flag string to complete the lesson!</li>
        </ol>
      `,
      desc: `
        <div class="interactive-box">
          <div class="input-group">
            <span class="mono" style="padding:0.6rem 0.8rem; background:var(--panel-2); border-radius:6px 0 0 6px;">$</span>
            <input type="text" id="t3-cmd" class="form-input" placeholder='grep -i "flag" /var/log/auth.log'>
            <button class="btn primary" id="t3-exec">Run</button>
          </div>
          <div id="t3-out" class="code-banner text-left mt-2" style="font-size:0.85rem; display:none;"></div>
        </div>
      `,
      defense: `
        <p><b>Defensive Rule:</b> Forward Linux authentication logs to a centralized <b>Security Information and Event Management (SIEM)</b> platform (like Splunk or Elastic) to ensure logs cannot be tampered with or deleted by an intruder on the local host.</p>
      `,
      hint: "Run: grep -i flag /var/log/auth.log to filter the log output.",
      hash: "bac4426ec0d6773ac6c9264f9b9733bce111a944a73fbd8315077cc5246a81eb",
      ans: "flag{grep_log_detective}",
      setup: () => {
        const inp = document.getElementById("t3-cmd");
        const btn = document.getElementById("t3-exec");
        const out = document.getElementById("t3-out");
        if (inp && btn && out) {
          const run = () => {
            const cmd = inp.value.trim();
            out.style.display = "block";
            if (cmd.toLowerCase().includes("grep") && cmd.toLowerCase().includes("flag")) {
              if (window.SoundEngine) window.SoundEngine.success();
              out.innerHTML = `Nov 24 10:14:22 server sshd[4912]: Failed password for root from 192.168.1.99
<b>Nov 24 10:14:29 server sudo: agent : TTY=pts/0 ; PWD=/home/agent ; USER=root ; COMMAND=/bin/cat flag{grep_log_detective}</b>
Nov 24 10:14:35 server sshd[4915]: Accepted publickey for agent from 10.0.0.5`;
            } else {
              out.innerText = `Command: ${cmd}. Tip: Use 'grep -i "flag" /var/log/auth.log'`;
            }
          };
          btn.addEventListener("click", run);
          inp.addEventListener("keydown", e => { if (e.key === "Enter") run(); });
        }
      }
    }
  ];

  window.CTF_DATA = {
    ROOMS: ROOMS,
    CHALLENGES: CHALLENGES,
    getChallengeById: (id) => CHALLENGES.find(c => c.id === id),
    getChallengesByRoom: (roomId) => CHALLENGES.filter(c => c.roomId === roomId),
    getTotalPoints: () => CHALLENGES.reduce((sum, c) => sum + c.points, 0)
  };
})(window);

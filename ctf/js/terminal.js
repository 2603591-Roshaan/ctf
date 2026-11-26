/**
 * CyberCTF - Interactive In-Browser Linux Terminal Engine
 * Realistic virtual filesystem with interactive command execution,
 * tab autocompletion, history navigation, and challenges.
 */
(function(window) {
  'use strict';

  class CyberTerminal {
    constructor(containerId, options = {}) {
      this.container = document.getElementById(containerId);
      this.cwd = "/home/agent";
      this.user = "agent";
      this.hostname = "cyber-sandbox";
      this.history = [];
      this.historyIndex = -1;
      this.onFlagSubmit = options.onFlagSubmit || null;
      this.onCommand = options.onCommand || null;

      // Virtual File System
      this.vfs = {
        "/": { type: "dir", perms: "drwxr-xr-x", owner: "root" },
        "/home": { type: "dir", perms: "drwxr-xr-x", owner: "root" },
        "/home/agent": { type: "dir", perms: "drwxr-xr-x", owner: "agent" },
        "/home/agent/notes.txt": {
          type: "file",
          perms: "-rw-r--r--",
          owner: "agent",
          content: "MISSION BRIEFING:\n1. Check for hidden files using 'ls -la'\n2. Inspect logs in /var/log/auth.log\n3. Execute run_me.sh after granting permissions with 'chmod +x'\n4. You can also submit flags directly here with: submit flag{...}\n"
        },
        "/home/agent/.secret_flag.txt": {
          type: "file",
          perms: "-rw-r--r--",
          owner: "agent",
          content: "flag{hidden_dot_files_found}\n"
        },
        "/home/agent/run_me.sh": {
          type: "file",
          perms: "-rw-r--r--",
          owner: "agent",
          isExecutable: false,
          content: "#!/bin/bash\necho 'Verifying system integrity...'\necho 'Security authorization successful!'\necho 'Flag: flag{executable_permissions_granted}'\n"
        },
        "/home/agent/encoded.txt": {
          type: "file",
          perms: "-rw-r--r--",
          owner: "agent",
          content: "ZmxhZ3t3ZWxjb21lX3RvX2I2NH0=\n"
        },
        "/home/agent/missions": { type: "dir", perms: "drwxr-xr-x", owner: "agent" },
        "/home/agent/missions/target_intel.txt": {
          type: "file",
          perms: "-rw-r--r--",
          owner: "agent",
          content: "Target Domain: cybercorp-defense.net\nTarget User: Jordan Rivera (@jrivera_cyber)\nTarget Hash: 5d41402abc4b2a76b9719d911017c592\n"
        },
        "/var": { type: "dir", perms: "drwxr-xr-x", owner: "root" },
        "/var/log": { type: "dir", perms: "drwxr-xr-x", owner: "root" },
        "/var/log/auth.log": {
          type: "file",
          perms: "-rw-r--r--",
          owner: "root",
          content: `Nov 24 09:12:01 server CRON[1042]: (root) CMD (/usr/local/bin/backup.sh)
Nov 24 09:15:22 server sshd[1090]: Failed password for invalid user admin from 192.168.1.102 port 44211 ssh2
Nov 24 09:15:25 server sshd[1092]: Failed password for invalid user test from 192.168.1.102 port 44213 ssh2
Nov 24 10:14:22 server sshd[4912]: Failed password for root from 192.168.1.99
Nov 24 10:14:29 server sudo: agent : TTY=pts/0 ; PWD=/home/agent ; USER=root ; COMMAND=/bin/cat flag{grep_log_detective}
Nov 24 10:14:35 server sshd[4915]: Accepted publickey for agent from 10.0.0.5 port 52112 ssh2
Nov 24 11:00:00 server systemd[1]: Started Daily apt upgrade and clean activities.
`
        },
        "/etc": { type: "dir", perms: "drwxr-xr-x", owner: "root" },
        "/etc/passwd": {
          type: "file",
          perms: "-rw-r--r--",
          owner: "root",
          content: "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nagent:x:1000:1000:Cyber Agent,,,:/home/agent:/bin/bash\n"
        },
        "/etc/issue": {
          type: "file",
          perms: "-rw-r--r--",
          owner: "root",
          content: "CyberCTF Linux 6.1.0-sandbox x86_64\n"
        }
      };

      if (this.container) {
        this.init();
      }
    }

    init() {
      this.container.innerHTML = `
        <div class="terminal-window">
          <div class="terminal-header">
            <div class="terminal-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <div class="terminal-title">agent@${this.hostname}: ~ (bash)</div>
            <div class="terminal-actions">
              <button class="term-btn" id="term-clear-btn" title="Clear screen">Clear</button>
              <button class="term-btn" id="term-reset-btn" title="Reset terminal">Reset</button>
            </div>
          </div>
          <div class="terminal-body" id="term-body">
            <div class="terminal-output" id="term-out">
              <div class="term-welcome">
                <pre class="term-ascii-logo">
   ____      _               ____ _____ _____ 
  / ___|   _| |__   ___ _ __/ ___|_   _|  ___|
 | |  | | | | '_ \\ / _ \\ '__\\___ \\ | | | |_   
 | |__| |_| | |_) |  __/ |   ___) || | |  _|  
  \\____\\__, |_.__/ \\___|_|  |____/ |_| |_|    
       |___/  Interactive Sandbox v2.4 (Ubuntu 22.04 LTS)</pre>
                <p>Type <span class="term-cmd">help</span> for a list of available commands. Try <span class="term-cmd">ls -la</span> to view files.</p>
              </div>
            </div>
            <div class="terminal-input-line">
              <span class="term-prompt" id="term-prompt-label">${this.getPromptText()}</span>
              <input type="text" class="term-input" id="term-input-field" autocomplete="off" spellcheck="false" autofocus>
            </div>
          </div>
        </div>
      `;

      this.outputEl = document.getElementById("term-out");
      this.inputEl = document.getElementById("term-input-field");
      this.promptEl = document.getElementById("term-prompt-label");
      this.bodyEl = document.getElementById("term-body");

      // Focus input on click anywhere in terminal
      this.bodyEl.addEventListener("click", () => this.inputEl.focus());

      // Key listeners
      this.inputEl.addEventListener("keydown", (e) => this.handleKeyDown(e));

      // Control buttons
      document.getElementById("term-clear-btn").addEventListener("click", () => {
        this.outputEl.innerHTML = "";
      });
      document.getElementById("term-reset-btn").addEventListener("click", () => {
        this.cwd = "/home/agent";
        this.outputEl.innerHTML = "<p class='term-info'>Terminal state reset to default.</p>";
        this.updatePrompt();
      });
    }

    getPromptText() {
      const displayPath = this.cwd.startsWith("/home/agent")
        ? "~" + this.cwd.slice("/home/agent".length)
        : this.cwd;
      return `<span class="term-user">${this.user}@${this.hostname}</span>:<span class="term-path">${displayPath}</span>$ `;
    }

    updatePrompt() {
      if (this.promptEl) {
        this.promptEl.innerHTML = this.getPromptText();
      }
    }

    handleKeyDown(e) {
      if (e.key === "Enter") {
        const val = this.inputEl.value.trim();
        if (val) {
          this.history.push(val);
          this.historyIndex = this.history.length;
        }
        this.executeCommand(val);
        this.inputEl.value = "";
        this.scrollBottom();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.inputEl.value = this.history[this.historyIndex] || "";
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.inputEl.value = this.history[this.historyIndex] || "";
        } else {
          this.historyIndex = this.history.length;
          this.inputEl.value = "";
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        this.handleTabComplete();
      }
    }

    scrollBottom() {
      if (this.bodyEl) {
        this.bodyEl.scrollTop = this.bodyEl.scrollHeight;
      }
    }

    writeLine(html, className = "") {
      const div = document.createElement("div");
      div.className = "term-line " + className;
      div.innerHTML = html;
      this.outputEl.appendChild(div);
      this.scrollBottom();
    }

    executeCommand(fullCmd) {
      // Echo the typed command
      this.writeLine(`${this.getPromptText()} ${this.escapeHtml(fullCmd)}`);
      if (!fullCmd) return;

      if (window.SoundEngine) window.SoundEngine.beep();

      const parts = fullCmd.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      switch (cmd) {
        case "help":
        case "?":
          this.cmdHelp();
          break;

        case "clear":
          this.outputEl.innerHTML = "";
          break;

        case "pwd":
          this.writeLine(this.cwd);
          break;

        case "whoami":
          this.writeLine(this.user);
          break;

        case "id":
          this.writeLine("uid=1000(agent) gid=1000(agent) groups=1000(agent),4(adm),27(sudo)");
          break;

        case "uname":
          this.writeLine("Linux cyber-sandbox 6.1.0-21-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.90-1 x86_64 GNU/Linux");
          break;

        case "date":
          this.writeLine(new Date().toUTCString());
          break;

        case "echo":
          this.writeLine(this.escapeHtml(args.join(" ")));
          break;

        case "history":
          this.writeLine(this.history.map((h, i) => `  ${i + 1}  ${this.escapeHtml(h)}`).join("<br>"));
          break;

        case "ls":
          this.cmdLs(args);
          break;

        case "cd":
          this.cmdCd(args[0]);
          break;

        case "cat":
          this.cmdCat(args[0]);
          break;

        case "grep":
          this.cmdGrep(args);
          break;

        case "chmod":
          this.cmdChmod(args);
          break;

        case "base64":
          this.cmdBase64(args);
          break;

        case "strings":
          this.cmdStrings(args[0]);
          break;

        case "curl":
          this.cmdCurl(args[0]);
          break;

        case "submit":
          this.cmdSubmit(args[0]);
          break;

        default:
          if (cmd.startsWith("./") || cmd.endsWith(".sh")) {
            this.cmdExecuteScript(cmd);
          } else {
            this.writeLine(`bash: ${this.escapeHtml(cmd)}: command not found. Type 'help' for available commands.`, "term-err");
          }
          break;
      }

      if (typeof this.onCommand === "function") {
        this.onCommand(cmd, args, fullCmd);
      }
    }

    cmdHelp() {
      this.writeLine(`
<div class="term-help-grid">
  <span><b>ls [-la] [dir]</b></span><span>List directory contents</span>
  <span><b>cd [dir]</b></span><span>Change working directory</span>
  <span><b>pwd</b></span><span>Print current working directory</span>
  <span><b>cat &lt;file&gt;</b></span><span>Print file content</span>
  <span><b>grep [-i] &lt;term&gt; &lt;file&gt;</b></span><span>Search text in file</span>
  <span><b>chmod &lt;mode&gt; &lt;file&gt;</b></span><span>Change file permissions (e.g. +x)</span>
  <span><b>base64 [-d] &lt;str/file&gt;</b></span><span>Base64 encode or decode</span>
  <span><b>strings &lt;file&gt;</b></span><span>Extract printable ASCII strings</span>
  <span><b>submit &lt;flag&gt;</b></span><span>Directly submit a CTF flag!</span>
  <span><b>clear / history</b></span><span>Terminal controls</span>
</div>
      `);
    }

    resolvePath(p) {
      if (!p || p === "~") return "/home/agent";
      if (p.startsWith("~/")) return "/home/agent/" + p.slice(2);
      if (p.startsWith("/")) return this.cleanPath(p);
      return this.cleanPath(this.cwd + "/" + p);
    }

    cleanPath(path) {
      const parts = path.split("/").filter(Boolean);
      const stack = [];
      for (const seg of parts) {
        if (seg === ".") continue;
        if (seg === "..") {
          stack.pop();
        } else {
          stack.push(seg);
        }
      }
      return "/" + stack.join("/");
    }

    cmdLs(args) {
      let showAll = false;
      let longFormat = false;
      let targetPath = null;

      for (const arg of args) {
        if (arg.startsWith("-")) {
          if (arg.includes("a")) showAll = true;
          if (arg.includes("l")) longFormat = true;
        } else {
          targetPath = arg;
        }
      }

      const dirPath = this.resolvePath(targetPath || ".");
      const dir = this.vfs[dirPath];

      if (!dir) {
        this.writeLine(`ls: cannot access '${targetPath}': No such file or directory`, "term-err");
        return;
      }
      if (dir.type !== "dir") {
        this.writeLine(targetPath);
        return;
      }

      // Collect entries
      const entries = [];
      const prefix = dirPath === "/" ? "/" : dirPath + "/";

      for (const k of Object.keys(this.vfs)) {
        if (k === dirPath) continue;
        if (k.startsWith(prefix)) {
          const rest = k.slice(prefix.length);
          if (!rest.includes("/")) {
            entries.push({ name: rest, fullPath: k, item: this.vfs[k] });
          }
        }
      }

      if (showAll) {
        entries.unshift({ name: "..", fullPath: dirPath + "/..", item: { type: "dir", perms: "drwxr-xr-x", owner: "root" } });
        entries.unshift({ name: ".", fullPath: dirPath, item: dir });
      }

      const filtered = entries.filter(e => showAll || !e.name.startsWith("."));

      if (longFormat) {
        const lines = filtered.map(e => {
          const isDir = e.item.type === "dir";
          const colorClass = isDir ? "term-dir" : (e.item.isExecutable ? "term-exec" : "");
          const perms = e.item.perms || (isDir ? "drwxr-xr-x" : "-rw-r--r--");
          const size = e.item.content ? e.item.content.length : 4096;
          return `${perms} 1 ${e.item.owner || "agent"} ${e.item.owner || "agent"} ${String(size).padStart(5, ' ')} Nov 24 10:00 <span class="${colorClass}">${this.escapeHtml(e.name)}</span>`;
        });
        this.writeLine(lines.join("<br>"));
      } else {
        const names = filtered.map(e => {
          const isDir = e.item.type === "dir";
          const colorClass = isDir ? "term-dir" : (e.item.isExecutable ? "term-exec" : "");
          return `<span class="${colorClass}">${this.escapeHtml(e.name)}</span>`;
        });
        this.writeLine(names.join("&nbsp;&nbsp;&nbsp;&nbsp;"));
      }
    }

    cmdCd(path) {
      if (!path) path = "~";
      const target = this.resolvePath(path);
      const item = this.vfs[target];

      if (!item) {
        this.writeLine(`bash: cd: ${path}: No such file or directory`, "term-err");
        return;
      }
      if (item.type !== "dir") {
        this.writeLine(`bash: cd: ${path}: Not a directory`, "term-err");
        return;
      }

      this.cwd = target;
      this.updatePrompt();
    }

    cmdCat(path) {
      if (!path) {
        this.writeLine("cat: missing file operand", "term-err");
        return;
      }
      const target = this.resolvePath(path);
      const item = this.vfs[target];

      if (!item) {
        this.writeLine(`cat: ${path}: No such file or directory`, "term-err");
        return;
      }
      if (item.type === "dir") {
        this.writeLine(`cat: ${path}: Is a directory`, "term-err");
        return;
      }

      this.writeLine(this.escapeHtml(item.content));
    }

    cmdGrep(args) {
      let caseInsensitive = false;
      let pattern = null;
      let fileArg = null;

      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === "-i") {
          caseInsensitive = true;
        } else if (!pattern) {
          pattern = arg.replace(/^['"]|['"]$/g, '');
        } else if (!fileArg) {
          fileArg = arg;
        }
      }

      if (!pattern || !fileArg) {
        this.writeLine("Usage: grep [-i] &lt;pattern&gt; &lt;file&gt;", "term-err");
        return;
      }

      const target = this.resolvePath(fileArg);
      const item = this.vfs[target];

      if (!item) {
        this.writeLine(`grep: ${fileArg}: No such file or directory`, "term-err");
        return;
      }

      const lines = item.content.split("\n");
      const regex = new RegExp(pattern, caseInsensitive ? "i" : "");
      const matches = lines.filter(l => regex.test(l));

      if (matches.length > 0) {
        const highlighted = matches.map(l => {
          return this.escapeHtml(l).replace(regex, m => `<span class="term-match">${m}</span>`);
        });
        this.writeLine(highlighted.join("<br>"));
      }
    }

    cmdChmod(args) {
      if (args.length < 2) {
        this.writeLine("Usage: chmod &lt;mode&gt; &lt;file&gt; (e.g. chmod +x run_me.sh)", "term-err");
        return;
      }
      const mode = args[0];
      const file = args[1];
      const target = this.resolvePath(file);
      const item = this.vfs[target];

      if (!item) {
        this.writeLine(`chmod: cannot access '${file}': No such file or directory`, "term-err");
        return;
      }

      if (mode.includes("+x") || mode === "755" || mode === "777") {
        item.isExecutable = true;
        item.perms = "-rwxr-xr-x";
        this.writeLine(`Permissions updated: ${file} is now executable.`);
      } else {
        this.writeLine(`chmod: applied mode '${mode}' to ${file}`);
      }
    }

    cmdExecuteScript(cmd) {
      const scriptName = cmd.replace(/^\.\//, '');
      const target = this.resolvePath(scriptName);
      const item = this.vfs[target];

      if (!item) {
        this.writeLine(`bash: ${cmd}: No such file or directory`, "term-err");
        return;
      }

      if (!item.isExecutable) {
        this.writeLine(`bash: ${cmd}: Permission denied (run 'chmod +x ${scriptName}' first)`, "term-err");
        if (window.SoundEngine) window.SoundEngine.error();
        return;
      }

      if (window.SoundEngine) window.SoundEngine.success();
      this.writeLine(this.escapeHtml(item.content).replace(/\n/g, '<br>'));
    }

    cmdBase64(args) {
      let isDecode = false;
      let target = null;
      for (const a of args) {
        if (a === "-d" || a === "--decode") isDecode = true;
        else target = a;
      }

      if (!target) {
        this.writeLine("Usage: base64 [-d] &lt;string_or_file&gt;", "term-err");
        return;
      }

      // Check if target is a file in vfs
      const fullPath = this.resolvePath(target);
      let content = target;
      if (this.vfs[fullPath] && this.vfs[fullPath].type === "file") {
        content = this.vfs[fullPath].content.trim();
      }

      if (isDecode) {
        this.writeLine(window.CyberTools.base64Decode(content));
      } else {
        this.writeLine(window.CyberTools.base64Encode(content));
      }
    }

    cmdStrings(file) {
      if (!file) {
        this.writeLine("Usage: strings &lt;file&gt;", "term-err");
        return;
      }
      const target = this.resolvePath(file);
      const item = this.vfs[target];
      if (!item) {
        this.writeLine(`strings: '${file}': No such file`, "term-err");
        return;
      }
      this.writeLine(this.escapeHtml(item.content).replace(/\n/g, '<br>'));
    }

    cmdCurl(url) {
      if (!url) {
        this.writeLine("Usage: curl &lt;url&gt;", "term-err");
        return;
      }
      this.writeLine(`HTTP/1.1 200 OK<br>Server: CyberCTF-Edge<br>Content-Type: text/plain<br><br>Connection to ${this.escapeHtml(url)} succeeded.`);
    }

    async cmdSubmit(flagStr) {
      if (!flagStr) {
        this.writeLine("Usage: submit flag{...}", "term-err");
        return;
      }
      if (this.onFlagSubmit) {
        this.onFlagSubmit(flagStr);
      } else if (window.App && typeof window.App.submitFlag === "function") {
        window.App.submitFlag(flagStr);
      }
    }

    handleTabComplete() {
      const cur = this.inputEl.value;
      const parts = cur.split(/\s+/);
      const last = parts[parts.length - 1];

      // Match files in current directory
      const prefix = this.cwd === "/" ? "/" : this.cwd + "/";
      const candidates = [];

      for (const k of Object.keys(this.vfs)) {
        if (k.startsWith(prefix)) {
          const name = k.slice(prefix.length);
          if (!name.includes("/") && name.startsWith(last)) {
            candidates.push(name);
          }
        }
      }

      if (candidates.length === 1) {
        parts[parts.length - 1] = candidates[0];
        this.inputEl.value = parts.join(" ") + " ";
      } else if (candidates.length > 1) {
        this.writeLine(`${this.getPromptText()} ${this.escapeHtml(cur)}`);
        this.writeLine(candidates.join("&nbsp;&nbsp;&nbsp;&nbsp;"));
      }
    }

    escapeHtml(str) {
      return String(str || "").replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      }[c]));
    }
  }

  window.CyberTerminal = CyberTerminal;
})(window);

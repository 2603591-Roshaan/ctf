/**
 * CyberAcademy - Educational Application Engine
 * Guided lesson tabs, XP progression, student skill levels, interactive labs,
 * defensive remediation guides, and local persistence.
 */
(function(window) {
  'use strict';

  // LocalStorage state key
  const STORAGE_KEY = "cyberacademy_student_v2";

  // Default initial student state
  const defaultState = {
    handle: "student_novice",
    avatar: "🎓",
    solves: {}, // { [chalId]: timestamp }
    achievements: [], // ['first_blood', ...]
    created: Date.now()
  };

  // Class Leaderboard peer students
  const LEADERBOARD_RIVALS = [
    { handle: "Alice_Cyber", score: 2850, rank: "Elite Security Engineer", solved: 20 },
    { handle: "DevSec_Sam", score: 2400, rank: "Elite Security Engineer", solved: 17 },
    { handle: "LinuxLeo", score: 1850, rank: "Cyber Defense Specialist", solved: 14 },
    { handle: "NetWatcher", score: 1400, rank: "Cyber Defense Specialist", solved: 11 },
    { handle: "CryptoChloe", score: 950, rank: "Junior Security Analyst", solved: 8 },
    { handle: "WebHunter_Dan", score: 650, rank: "Junior Security Analyst", solved: 5 },
    { handle: "RookieRay", score: 350, rank: "Security Apprentice", solved: 3 },
    { handle: "FreshCadet", score: 100, rank: "Cyber Cadet", solved: 1 }
  ];

  // Academic Skill Badges Definition
  const ACHIEVEMENTS = [
    { id: "first_blood", title: "First Lesson Passed", icon: "🌱", desc: "Complete your very first hands-on lab" },
    { id: "web_adept", title: "Web Application Defender", icon: "🌐", desc: "Complete 3 Web Security lessons & labs" },
    { id: "osint_detective", title: "OSINT Investigator", icon: "🔍", desc: "Complete 3 Threat Recon & Footprint labs" },
    { id: "cipher_breaker", title: "Certified Cryptanalyst", icon: "🔐", desc: "Complete 3 Cryptography & Cipher labs" },
    { id: "forensic_sleuth", title: "Forensic Investigator", icon: "🔬", desc: "Complete 3 Digital Forensics & Incident labs" },
    { id: "cli_ninja", title: "Linux Administrator", icon: "💻", desc: "Complete 3 Linux Command Line labs" },
    { id: "century_club", title: "Honor Roll (500+ XP)", icon: "🏆", desc: "Earn 500 total Learning XP" },
    { id: "master_operative", title: "Distinguished Scholar (1500+ XP)", icon: "⭐", desc: "Reach 1,500 Learning XP" },
    { id: "tool_user", title: "Toolkit Specialist", icon: "🛠️", desc: "Use the offline Cyber Toolbelt" },
    { id: "completionist", title: "Valedictorian (Full Mastery)", icon: "👑", desc: "Complete all 24 labs across the entire curriculum" }
  ];

  class AcademyApp {
    constructor() {
      this.state = this.loadState();
      this.currentFilter = "all";
      this.activeChallenge = null;
      this.activeTab = "concept";
      this.terminal = null;

      this.initTheme();
      this.initRouter();
      this.initUI();
      this.initLessonTabs();
      this.initToolsDialog();
      this.initConfetti();
      if (window.KurumiMascot) {
        window.KurumiMascot.initCompanionWidget();
      }
      this.renderAll();
    }

    /* ---------------- Persistence ---------------- */
    loadState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaultState, ...parsed };
        }
      } catch(e) {}
      return { ...defaultState };
    }

    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch(e) {}
      this.updateHeaderStats();
    }

    getScore() {
      let sum = 0;
      for (const id of Object.keys(this.state.solves)) {
        const chal = window.CTF_DATA.getChallengeById(id);
        if (chal) sum += chal.points;
      }
      return sum;
    }

    getSolvedCount() {
      return Object.keys(this.state.solves).length;
    }

    getRank(score) {
      if (score >= 2000) return { title: "Elite Security Engineer", badge: "🔴 Level 5" };
      if (score >= 1200) return { title: "Cyber Defense Specialist", badge: "🟡 Level 4" };
      if (score >= 600)  return { title: "Junior Security Analyst", badge: "🟣 Level 3" };
      if (score >= 150)  return { title: "Security Apprentice", badge: "🔵 Level 2" };
      return { title: "Cyber Cadet", badge: "🟢 Level 1" };
    }

    /* ---------------- Theme & Audio ---------------- */
    initTheme() {
      const savedTheme = localStorage.getItem("cyberacademy_theme") || "dark";
      document.documentElement.setAttribute("data-theme", savedTheme);

      const btn = document.getElementById("themeToggleBtn");
      if (btn) {
        btn.textContent = savedTheme === "dark" ? "☀️" : "🌙";
        btn.addEventListener("click", () => {
          const cur = document.documentElement.getAttribute("data-theme");
          const next = cur === "dark" ? "light" : "dark";
          document.documentElement.setAttribute("data-theme", next);
          localStorage.setItem("cyberacademy_theme", next);
          btn.textContent = next === "dark" ? "☀️" : "🌙";
          if (window.SoundEngine) window.SoundEngine.click();
        });
      }

      const sndBtn = document.getElementById("audioToggleBtn");
      if (sndBtn && window.SoundEngine) {
        sndBtn.textContent = window.SoundEngine.isEnabled() ? "🔊" : "🔇";
        sndBtn.addEventListener("click", () => {
          const enabled = window.SoundEngine.toggle();
          sndBtn.textContent = enabled ? "🔊" : "🔇";
          this.showToast(enabled ? "Sound effects enabled" : "Sound effects muted", "info");
        });
      }
    }

    /* ---------------- Router ---------------- */
    initRouter() {
      const routes = ["home", "rooms", "challenges", "terminal", "scoreboard", "learn", "profile"];
      const handleRoute = () => {
        const hash = (window.location.hash || "#home").replace("#", "").toLowerCase();
        const activeRoute = routes.includes(hash) ? hash : "home";

        // Update nav links
        document.querySelectorAll("#mainNav a").forEach(a => {
          if (a.dataset.route === activeRoute) a.classList.add("active");
          else a.classList.remove("active");
        });

        // Switch active view
        document.querySelectorAll(".view-section").forEach(sec => {
          if (sec.id === "view-" + activeRoute) {
            sec.classList.add("active");
          } else {
            sec.classList.remove("active");
          }
        });

        window.scrollTo({ top: 0, behavior: "smooth" });

        // Initialize terminal on first navigation to it
        if (activeRoute === "terminal" && !this.terminal) {
          this.terminal = new window.CyberTerminal("main-terminal-container", {
            onFlagSubmit: (flag) => this.submitFlag(flag),
            onCommand: (cmd, args, fullCmd) => this.handleTerminalGuidance(cmd, args, fullCmd)
          });
        }

        // Render Kurumi terminal companion briefing
        if (activeRoute === "terminal" && window.KurumiMascot) {
          const termCard = document.getElementById("kurumiTerminalCard");
          if (termCard && !termCard.hasChildNodes()) {
            termCard.innerHTML = window.KurumiMascot.renderCard(
              "detective",
              "Kurumi's Terminal Briefing",
              "Welcome to the sandbox shell! Linux command-line fluency is essential for every security analyst. Use <code>help</code> to list available commands, <code>ls -la</code> to reveal hidden files, and <code>cat</code> to read secrets. Submit found flags directly in the shell using <code>submit flag{...}</code>!"
            );
          }
        }
      };

      window.addEventListener("hashchange", handleRoute);
      handleRoute();
    }

    /* ---------------- Confetti Burst ---------------- */
    initConfetti() {
      const cv = document.getElementById("confetti-canvas");
      if (!cv) return;
      this.confettiCtx = cv.getContext("2d");
      this.particles = [];

      const resize = () => {
        cv.width = window.innerWidth;
        cv.height = window.innerHeight;
      };
      window.addEventListener("resize", resize);
      resize();

      let animationId = null;
      const loop = () => {
        this.confettiCtx.clearRect(0, 0, cv.width, cv.height);
        for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.22;
          p.rotation += p.vRot;
          p.alpha -= 0.009;

          if (p.alpha <= 0 || p.y > cv.height) {
            this.particles.splice(i, 1);
            continue;
          }

          this.confettiCtx.save();
          this.confettiCtx.translate(p.x, p.y);
          this.confettiCtx.rotate((p.rotation * Math.PI) / 180);
          this.confettiCtx.globalAlpha = p.alpha;
          this.confettiCtx.fillStyle = p.color;
          this.confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          this.confettiCtx.restore();
        }

        if (this.particles.length > 0) {
          animationId = requestAnimationFrame(loop);
        } else {
          animationId = null;
        }
      };

      this.fireConfetti = () => {
        const colors = ["#c2274e", "#8b1538", "#dfbf8c", "#f4ece1", "#e03865", "#48bb78"];
        for (let i = 0; i < 90; i++) {
          this.particles.push({
            x: window.innerWidth / 2 + (Math.random() - 0.5) * 300,
            y: window.innerHeight * 0.45,
            vx: (Math.random() - 0.5) * 14,
            vy: (Math.random() - 0.8) * 16,
            size: Math.random() * 9 + 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            vRot: (Math.random() - 0.5) * 12,
            alpha: 1
          });
        }
        if (!animationId) loop();
      };
    }

    /* ---------------- Toast Notification ---------------- */
    showToast(msg, type = "info") {
      const container = document.getElementById("toastContainer");
      if (!container) return;

      const toast = document.createElement("div");
      toast.className = `toast ${type}`;
      const icon = type === "success" ? "🎓" : (type === "error" ? "⚠️" : "💡");
      toast.innerHTML = `<span>${icon}</span><span>${msg}</span>`;

      container.appendChild(toast);
      setTimeout(() => {
        toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        setTimeout(() => toast.remove(), 320);
      }, 3400);
    }

    /* ---------------- Achievements ---------------- */
    checkAchievements() {
      const solvedCount = this.getSolvedCount();
      const score = this.getScore();
      const solvedIds = Object.keys(this.state.solves);
      const newBadges = [];

      const unlock = (id) => {
        if (!this.state.achievements.includes(id)) {
          this.state.achievements.push(id);
          const meta = ACHIEVEMENTS.find(a => a.id === id);
          if (meta) {
            newBadges.push(meta);
          }
        }
      };

      if (solvedCount >= 1) unlock("first_blood");

      // Count solves by course module
      const counts = {};
      solvedIds.forEach(id => {
        const c = window.CTF_DATA.getChallengeById(id);
        if (c) counts[c.roomId] = (counts[c.roomId] || 0) + 1;
      });

      if ((counts["web"] || 0) >= 3) unlock("web_adept");
      if ((counts["osint"] || 0) >= 3) unlock("osint_detective");
      if ((counts["crypto"] || 0) >= 3) unlock("cipher_breaker");
      if ((counts["forensics"] || 0) >= 3) unlock("forensic_sleuth");
      if ((counts["terminal"] || 0) >= 3) unlock("cli_ninja");

      if (score >= 500) unlock("century_club");
      if (score >= 1500) unlock("master_operative");
      if (solvedCount >= window.CTF_DATA.CHALLENGES.length) unlock("completionist");

      if (newBadges.length > 0) {
        this.saveState();
        if (window.SoundEngine) window.SoundEngine.levelUp();
        newBadges.forEach(b => {
          this.showToast(`Skill Badge Earned: ${b.icon} ${b.title}!`, "success");
        });
        this.renderProfile();
      }
    }

    /* ---------------- UI Renderers ---------------- */
    renderAll() {
      this.updateHeaderStats();
      this.renderHomeRooms();
      this.renderRooms();
      this.renderChallenges();
      this.renderScoreboard();
      this.renderGuide();
      this.renderProfile();
    }

    updateHeaderStats() {
      const score = this.getScore();
      const solved = this.getSolvedCount();
      const total = window.CTF_DATA.CHALLENGES.length;
      const rank = this.getRank(score);

      const chipHandle = document.getElementById("userChipHandle");
      const chipPoints = document.getElementById("userChipPoints");
      const chipAvatar = document.getElementById("userChipAvatar");
      if (chipHandle) chipHandle.textContent = this.state.handle;
      if (chipPoints) chipPoints.textContent = `${score} XP`;
      if (chipAvatar) chipAvatar.textContent = this.state.avatar;

      const boardSummary = document.getElementById("boardSummaryText");
      if (boardSummary) {
        boardSummary.textContent = `${solved} / ${total} Labs Completed • ${score} XP • ${rank.title}`;
      }

      const statSolves = document.getElementById("stat-solves-count");
      if (statSolves) statSolves.textContent = solved;

      // Brand logo mascot badge
      const brandIcon = document.getElementById("brandMascotIcon");
      if (brandIcon && window.KurumiMascot && !brandIcon.querySelector("svg")) {
        brandIcon.innerHTML = window.KurumiMascot.renderSVG("welcoming", 36);
      }
    }

    renderHomeRooms() {
      const container = document.getElementById("homeRoomsPreview");
      if (!container) return;

      // Kurumi Hero Companion Card
      const heroCard = document.getElementById("kurumiHeroCard");
      if (heroCard && window.KurumiMascot) {
        heroCard.innerHTML = window.KurumiMascot.renderCard(
          "welcoming",
          "Kurumi Tokisaki",
          "Ara ara, welcome to CyberAcademy! I will be your companion and mentor throughout this journey. Cybersecurity is an art of understanding systems, discovering overlooked assumptions, and fortifying them. Start with the Security Fundamentals or dive into any course module below. Remember: time is on your side when you learn step by step!",
          `<a href="#rooms" class="btn small primary">Explore All Learning Paths &rarr;</a> <button class="btn small ghost" onclick="if(window.KurumiMascot&&window.KurumiMascot.startTour)window.KurumiMascot.startTour('academy');">🧭 Floating Tour of Icons</button> <button class="btn small ghost" onclick="if(window.KurumiMascot&&window.KurumiMascot.say)window.KurumiMascot.say(window.KurumiMascot.getRandomTip(),'thinking',8);">Ask Kurumi for a Tip</button>`
        );
      }

      container.innerHTML = window.CTF_DATA.ROOMS.map(r => {
        const chals = window.CTF_DATA.getChallengesByRoom(r.id);
        const solved = chals.filter(c => !!this.state.solves[c.id]).length;
        const total = chals.length;
        const pct = Math.round((solved / total) * 100);
        const skillsHtml = (r.skills || []).map(s => `<span class="skill-pill">${s}</span>`).join("");

        return `
          <div class="room-card" style="--room-color:${r.color};" onclick="location.hash='#challenges'; window.App.filterByRoom('${r.id}');">
            <div>
              <div class="room-icon">${r.icon}</div>
              <h3 class="room-title">${r.title}</h3>
              <div class="room-subtitle">${r.subtitle}</div>
              <p class="room-desc">${r.desc}</p>
              <div class="skill-pills">${skillsHtml}</div>
            </div>
            <div>
              <div class="room-progress-bar">
                <div class="room-progress-fill" style="width:${pct}%;"></div>
              </div>
              <div class="room-footer">
                <span><b>${solved} / ${total} Labs</b> Completed</span>
                <span class="badge ${pct === 100 ? 'easy' : 'intro'}">${pct}%</span>
              </div>
            </div>
          </div>
        `;
      }).join("");
    }

    renderRooms() {
      const container = document.getElementById("roomsListGrid");
      if (!container) return;

      // Kurumi Course Advice Card
      const coursesCard = document.getElementById("kurumiCoursesCard");
      if (coursesCard && window.KurumiMascot) {
        coursesCard.innerHTML = window.KurumiMascot.renderCard(
          "curious",
          "Kurumi's Curriculum Advice",
          "Each of our 6 learning tracks is designed for progressive mastery. If you are entirely new to cyber defense, complete <strong>Module 01: Fundamentals</strong> first to learn flag formats and encodings. Then investigate <strong>Web Security</strong> or <strong>OSINT Investigation</strong>!",
          `<a href="#challenges" class="btn small primary">View All 24 Guided Labs &rarr;</a>`
        );
      }

      container.innerHTML = window.CTF_DATA.ROOMS.map(r => {
        const chals = window.CTF_DATA.getChallengesByRoom(r.id);
        const solved = chals.filter(c => !!this.state.solves[c.id]).length;
        const total = chals.length;
        const pts = chals.reduce((acc, c) => acc + c.points, 0);
        const pct = Math.round((solved / total) * 100);
        const skillsHtml = (r.skills || []).map(s => `<span class="skill-pill">${s}</span>`).join("");

        return `
          <div class="room-card" style="--room-color:${r.color};">
            <div>
              <div class="d-flex justify-between align-center mb-1">
                <span class="room-icon">${r.icon}</span>
                <span class="badge ${pct === 100 ? 'easy' : 'intro'}">${pct === 100 ? 'COMPLETED ✓' : `${pct}% Finished`}</span>
              </div>
              <h3 class="room-title">${r.title}</h3>
              <div class="room-subtitle">${r.subtitle} &bull; ${pts} XP Available</div>
              <p class="room-desc">${r.desc}</p>
              <div class="mb-2">
                <small class="text-muted" style="font-weight:600;">Key Topics Covered:</small>
                <div class="skill-pills">${skillsHtml}</div>
              </div>
            </div>
            <div>
              <div class="room-progress-bar">
                <div class="room-progress-fill" style="width:${pct}%;"></div>
              </div>
              <div class="room-footer mb-2">
                <span>Progress: <b>${solved} / ${total} Labs</b></span>
                <span>${chals.length} Guided Lessons</span>
              </div>
              <button class="btn primary small" style="width:100%;" onclick="location.hash='#challenges'; window.App.filterByRoom('${r.id}');">
                Start Course Lessons &rarr;
              </button>
            </div>
          </div>
        `;
      }).join("");
    }

    filterByRoom(roomId) {
      this.currentFilter = roomId;
      document.querySelectorAll("#boardFilters .filter-btn").forEach(btn => {
        if (btn.dataset.filter === roomId) btn.classList.add("active");
        else btn.classList.remove("active");
      });
      this.renderChallenges();
    }

    renderChallenges() {
      const container = document.getElementById("challengesGrid");
      if (!container) return;

      let list = window.CTF_DATA.CHALLENGES;
      if (this.currentFilter === "unsolved") {
        list = list.filter(c => !this.state.solves[c.id]);
      } else if (this.currentFilter !== "all") {
        list = list.filter(c => c.roomId === this.currentFilter);
      }

      if (list.length === 0) {
        const mascotSvg = window.KurumiMascot ? window.KurumiMascot.renderSVG("celebrating", 80) : "";
        container.innerHTML = `
          <div class="code-banner text-center" style="grid-column: 1 / -1; padding:2.5rem; display:flex; flex-direction:column; align-items:center; gap:1rem;">
            ${mascotSvg}
            <div>
              <h3 style="color:var(--beige-gold); margin-bottom:0.4rem;">🎉 All labs in this track completed!</h3>
              <p class="text-muted">Outstanding achievement! You have mastered every lesson in this course track.</p>
            </div>
          </div>`;
        return;
      }

      container.innerHTML = list.map(c => {
        const isSolved = !!this.state.solves[c.id];
        const room = window.CTF_DATA.ROOMS.find(r => r.id === c.roomId) || { title: c.roomId };

        return `
          <div class="chal-card ${isSolved ? 'solved' : ''}" onclick="window.App.openChallenge('${c.id}')">
            <div>
              <div class="meta">
                <span class="badge ${c.level}">${c.level.toUpperCase()}</span>
                <span class="text-muted">${room.title.split(':')[0]}</span>
              </div>
              <div class="title">${c.title}</div>
            </div>
            <div class="d-flex justify-between align-center">
              <span class="points">+${c.points} <small style="font-size:0.85rem; font-weight:normal;">XP</small></span>
              <span class="btn small ${isSolved ? 'ghost' : 'primary'}">${isSolved ? 'Review' : 'Start Lab'}</span>
            </div>
          </div>
        `;
      }).join("");
    }

    /* ---------------- Lesson Modal & Educational Tabs ---------------- */
    initLessonTabs() {
      document.querySelectorAll(".lesson-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          this.switchLessonTab(btn.dataset.tab);
        });
      });

      // Kurumi interactive process stepper controls
      document.getElementById("kurumiGuideNextBtn")?.addEventListener("click", () => {
        const order = ["concept", "lab", "defense", "check"];
        const curIdx = order.indexOf(this.activeTab);
        const nextTab = order[(curIdx + 1) % order.length];
        this.switchLessonTab(nextTab);
        if (window.KurumiMascot) window.KurumiMascot.react("hop");
      });

      document.getElementById("kurumiGuideExplainBtn")?.addEventListener("click", () => {
        if (!this.activeChallenge) return;
        const chal = this.activeChallenge;
        if (window.KurumiMascot) window.KurumiMascot.react("nod");

        const guideTexts = {
          concept: `Theory Brief: ${chal.concept ? chal.concept.replace(/<[^>]+>/g, '').slice(0, 190) + '...' : 'Understand the fundamental computer science concept.'}`,
          lab: `Lab Target: ${chal.hint || 'Inspect the sandbox target below. Follow the steps in the guide to extract the secret flag.'}`,
          defense: `Defense Pattern: Learn how developers patch this vulnerability in code using defense-in-depth.`,
          check: `Flag Verification: Paste your discovered flag token (format: flag{...}) into the input box below.`
        };

        const modalText = document.getElementById("kurumiModalText");
        if (modalText) {
          modalText.textContent = guideTexts[this.activeTab] || "Let us master this step together!";
        }
        if (window.KurumiMascot && window.KurumiMascot.say) {
          window.KurumiMascot.say(guideTexts[this.activeTab], "detective", 8, "Step Coach");
        }
      });

      document.getElementById("kurumiGuideFocusBtn")?.addEventListener("click", () => {
        if (window.KurumiMascot) window.KurumiMascot.react("hop");
        let targetEl = null;
        if (this.activeTab === "concept") targetEl = document.getElementById("chalConceptBody");
        else if (this.activeTab === "lab") targetEl = document.getElementById("chalBody");
        else if (this.activeTab === "defense") targetEl = document.getElementById("chalDefenseBody");
        else if (this.activeTab === "check") targetEl = document.getElementById("flagInput");

        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
          targetEl.classList.remove("kurumi-target-pulse");
          void targetEl.offsetWidth;
          targetEl.classList.add("kurumi-target-pulse");
          if (targetEl.tagName === "INPUT") targetEl.focus();
        }
      });
    }

    switchLessonTab(tabName) {
      this.activeTab = tabName;
      document.querySelectorAll(".lesson-tab-btn").forEach(b => {
        if (b.dataset.tab === tabName) b.classList.add("active");
        else b.classList.remove("active");
      });
      document.querySelectorAll(".lesson-tab-content").forEach(content => {
        if (content.id === "tabContent-" + tabName) content.classList.add("active");
        else content.classList.remove("active");
      });

      // Update Kurumi modal companion dialogue & step tracker
      if (window.KurumiMascot) {
        const avatar = document.getElementById("kurumiModalAvatar");
        const text = document.getElementById("kurumiModalText");
        const badge = document.getElementById("kurumiGuideStepBadge");
        const tag = document.getElementById("kurumiGuideStatusTag");
        const nextBtn = document.getElementById("kurumiGuideNextBtn");
        const focusBtn = document.getElementById("kurumiGuideFocusBtn");

        const stepConfig = {
          concept: {
            step: "Step 1 of 4: Threat Concept",
            status: "📖 Vulnerability Theory",
            pose: "thinking",
            nextText: "Next: Sandbox Lab 🧪 →",
            focusText: "Focus Overview 🔍",
            text: "Ara ara, take time to understand the theory. Vulnerabilities arise when developers place misplaced trust in inputs or hidden assumptions."
          },
          lab: {
            step: "Step 2 of 4: Sandbox Exploit",
            status: "🎯 Finding Token",
            pose: "curious",
            nextText: "Next: Remediation 🛡️ →",
            focusText: "Highlight Sandbox 🎯",
            text: "Time for hands-on practice! Follow the lab guide, inspect the target application, and uncover the secret verification token."
          },
          defense: {
            step: "Step 3 of 4: Secure Defense",
            status: "🔒 Code Remediation",
            pose: "detective",
            nextText: "Next: Lab Check 🏁 →",
            focusText: "Focus Defense 🛡️",
            text: "Security is incomplete without defense. Let us examine how real-world engineers remediate and safeguard this flaw."
          },
          check: {
            step: "Step 4 of 4: Flag Verification",
            status: "✨ Submit Proof",
            pose: "welcoming",
            nextText: "Back to Concept 📖",
            focusText: "Highlight Flag Input ✍️",
            text: "Ready to record your achievement? Paste the discovered flag token below to earn your Learning XP!"
          }
        };

        const cfg = stepConfig[tabName] || stepConfig.concept;
        if (avatar) {
          avatar.innerHTML = window.KurumiMascot.renderSVG(cfg.pose, 58);
          window.KurumiMascot.react("nod");
        }
        if (text) text.innerHTML = cfg.text;
        if (badge) badge.innerHTML = `🕰️ ${cfg.step}`;
        if (tag) tag.textContent = cfg.status;
        if (nextBtn) nextBtn.textContent = cfg.nextText;
        if (focusBtn) focusBtn.textContent = cfg.focusText;
      }

      if (window.SoundEngine) window.SoundEngine.click();
    }

    openChallenge(id) {
      const chal = window.CTF_DATA.getChallengeById(id);
      if (!chal) return;
      this.activeChallenge = chal;

      const dlg = document.getElementById("chal-dialog");
      const title = document.getElementById("chalTitle");
      const meta = document.getElementById("chalMetaBadges");
      const conceptBody = document.getElementById("chalConceptBody");
      const realWorldBody = document.getElementById("chalRealWorldBody");
      const labGuideBody = document.getElementById("chalLabGuideBody");
      const targetBody = document.getElementById("chalBody");
      const defenseBody = document.getElementById("chalDefenseBody");
      const hintText = document.getElementById("chalHintText");
      const hintDetails = document.getElementById("chalHintDetails");
      const statusText = document.getElementById("chalSolveStatusText");
      const feedback = document.getElementById("flagFeedbackMsg");
      const input = document.getElementById("flagInput");

      const isSolved = !!this.state.solves[chal.id];
      const room = window.CTF_DATA.ROOMS.find(r => r.id === chal.roomId) || { title: chal.roomId };

      title.textContent = chal.title;
      meta.innerHTML = `
        <span class="badge ${chal.level}">${chal.level.toUpperCase()}</span>
        <span class="badge intro">${room.title}</span>
        <span class="badge medium">+${chal.points} Learning XP</span>
      `;

      // Fill in educational tab contents
      conceptBody.innerHTML = chal.concept || chal.desc;
      realWorldBody.innerHTML = `<h4>🌍 Real-World Security Context:</h4>${chal.realWorld || '<p>Understanding this vulnerability is critical for secure software architecture.</p>'}`;
      labGuideBody.innerHTML = `<h4>🎯 Guided Lab Instructions:</h4>${chal.labGuide || '<p>Follow the prompt below and find the secret token to verify lab completion.</p>'}`;
      targetBody.innerHTML = chal.desc;
      defenseBody.innerHTML = `<h4>🛡️ How to Defend & Remediate:</h4>${chal.defense || '<p>Always validate input, follow least privilege, and apply defense-in-depth.</p>'}`;

      hintText.textContent = chal.hint;
      hintDetails.removeAttribute("open");

      // Hook hint toggle to Kurumi companion reaction
      hintDetails.ontoggle = () => {
        if (hintDetails.open && window.KurumiMascot) {
          const avatar = document.getElementById("kurumiModalAvatar");
          const text = document.getElementById("kurumiModalText");
          if (avatar) avatar.innerHTML = window.KurumiMascot.renderSVG("encouraging", 56);
          if (text) text.innerHTML = "Stuck on a tricky step? Hints are here to guide your intuition, darling. Review the clue carefully!";
        }
      };

      input.value = "";
      feedback.style.display = "none";
      feedback.className = "status-msg";

      if (isSolved) {
        statusText.innerHTML = `<span style="color:var(--color-success)">✓ Lab Completed on ${new Date(this.state.solves[chal.id]).toLocaleDateString()}</span>`;
      } else {
        statusText.textContent = "Status: In Progress";
      }

      // Default to Concept tab for teaching flow
      this.switchLessonTab("concept");

      // Mount challenge-specific interactive handlers
      if (typeof chal.setup === "function") {
        setTimeout(() => chal.setup(), 40);
      }

      // Notes link inside modal
      const guideBtn = document.getElementById("chalGuideLink");
      if (guideBtn) {
        guideBtn.onclick = () => {
          dlg.close();
          window.location.hash = "#learn";
          setTimeout(() => {
            const el = document.getElementById("wu-" + chal.id);
            if (el) {
              el.setAttribute("open", "true");
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 80);
        };
      }

      if (window.SoundEngine) window.SoundEngine.click();
      dlg.showModal();
    }

    async submitFlag(flagStr) {
      if (!this.activeChallenge) {
        this.showToast("No active lesson selected for verification.", "error");
        return;
      }
      const chal = this.activeChallenge;
      const v = flagStr.trim();
      const feedback = document.getElementById("flagFeedbackMsg");

      if (!v) {
        if (feedback) {
          feedback.style.display = "block";
          feedback.className = "status-msg error";
          feedback.innerText = "Please enter the verification flag before submitting.";
        }
        return;
      }

      // Hash submission using Web Crypto SHA-256
      const hashed = await window.CyberTools.sha256(v);
      const isCorrect = (hashed === chal.hash) || (v === chal.ans);

      if (isCorrect) {
        const alreadySolved = !!this.state.solves[chal.id];
        if (!alreadySolved) {
          this.state.solves[chal.id] = Date.now();
          this.saveState();
          this.checkAchievements();
          this.fireConfetti();
          if (window.SoundEngine) window.SoundEngine.success();
          this.showToast(`🎉 LAB PASSED: +${chal.points} Learning XP earned!`, "success");
        }

        if (feedback) {
          feedback.style.display = "block";
          feedback.className = "status-msg success";
          feedback.innerHTML = `🎉 Correct! Lab objective fulfilled.<br>${alreadySolved ? '(Previously recorded)' : `+${chal.points} XP added to your student portfolio!`}`;
        }

        // Mascot celebration response
        if (window.KurumiMascot) {
          window.KurumiMascot.react("hop");
          const avatar = document.getElementById("kurumiModalAvatar");
          const text = document.getElementById("kurumiModalText");
          if (avatar) avatar.innerHTML = window.KurumiMascot.renderSVG("celebrating", 58);
          if (text) text.innerHTML = "Outstanding work! You solved this lab objective and demonstrated your security skill. Step over to Tab 3 (How to Defend) to see the remediation!";
          if (window.KurumiMascot.say) {
            window.KurumiMascot.say(`Bravo, ${this.state.handle}! Lab '${chal.title}' completed! +${chal.points} XP`, "celebrating", 8, "Lab Passed! 🎉");
          }
        }

        this.renderAll();
      } else {
        if (window.SoundEngine) window.SoundEngine.error();
        if (feedback) {
          feedback.style.display = "block";
          feedback.className = "status-msg error";
          feedback.innerText = v.startsWith("flag{") && v.endsWith("}")
            ? "❌ Incorrect flag token. Review the lab instructions or check the hint tab."
            : "❌ Invalid format. Flags must follow the flag{...} pattern.";
        }

        // Mascot surprised/encouraging response on incorrect attempt
        if (window.KurumiMascot) {
          window.KurumiMascot.react("wobble");
          const avatar = document.getElementById("kurumiModalAvatar");
          const text = document.getElementById("kurumiModalText");
          if (avatar) avatar.innerHTML = window.KurumiMascot.renderSVG("surprised", 58);
          if (text) text.innerHTML = "Ara ara? That verification token was not quite right. Check your flag syntax or click 'Guide Me' to review the lab objective.";
          if (window.KurumiMascot.say) {
            window.KurumiMascot.say("Do not be discouraged! Check the flag format flag{...} or review the hint.", "encouraging", 7, "Flag Retry");
          }
        }
      }
    }

    /* ---------------- Leaderboard / Class Progress ---------------- */
    renderScoreboard() {
      const tbody = document.getElementById("scoreboardBody");
      if (!tbody) return;

      const myScore = this.getScore();
      const mySolved = this.getSolvedCount();
      const myRank = this.getRank(myScore);

      // Kurumi Leaderboard Commentary Card
      const lbCard = document.getElementById("kurumiLeaderboardCard");
      if (lbCard && window.KurumiMascot) {
        const msg = myScore === 0 
          ? "Ara ara, every security architect started with 0 XP! Solve your first lab in the Fundamentals track to join your peers on the Academy Leaderboard."
          : (myScore >= 1200 
            ? "Splendid work! Your score places you among the top scholars of the Academy. Keep honing your defense skills!"
            : "You are making steady progress! Review your solved labs or challenge yourself with the Linux Terminal and Forensics tracks to climb higher.");
        const pose = myScore === 0 ? "encouraging" : (myScore >= 1200 ? "celebrating" : "thinking");
        lbCard.innerHTML = window.KurumiMascot.renderCard(
          pose,
          "Kurumi Tokisaki",
          msg,
          `<a href="#challenges" class="btn small ghost">Earn More XP &rarr;</a>`
        );
      }

      const allPlayers = [
        ...LEADERBOARD_RIVALS,
        {
          handle: this.state.handle,
          score: myScore,
          rank: myRank.title,
          solved: mySolved,
          isCurrentUser: true
        }
      ];

      allPlayers.sort((a, b) => b.score - a.score || b.solved - a.solved);

      tbody.innerHTML = allPlayers.map((p, idx) => {
        const rankNum = idx + 1;
        const topClass = rankNum === 1 ? 'top-1' : (rankNum === 2 ? 'top-2' : (rankNum === 3 ? 'top-3' : ''));
        const medal = rankNum === 1 ? '🥇' : (rankNum === 2 ? '🥈' : (rankNum === 3 ? '🥉' : rankNum));

        return `
          <tr class="${topClass} ${p.isCurrentUser ? 'current-user' : ''}">
            <td class="rank">${medal}</td>
            <td class="player">
              ${p.isCurrentUser ? `<span style="margin-right:4px;">${this.state.avatar}</span>` : ''}
              ${p.handle}
              ${p.isCurrentUser ? '<span class="badge easy" style="margin-left:6px; font-size:0.7rem;">YOU</span>' : ''}
            </td>
            <td><span class="badge ${p.score >= 1200 ? 'medium' : 'intro'}">${p.rank}</span></td>
            <td>${p.solved} / ${window.CTF_DATA.CHALLENGES.length} Labs</td>
            <td class="mono font-bold" style="color:var(--beige-gold);">${p.score} XP</td>
          </tr>
        `;
      }).join("");
    }

    /* ---------------- Course Notes & Field Guide ---------------- */
    renderGuide() {
      const container = document.getElementById("guideContent");
      if (!container) return;

      let html = `
        <div class="interactive-box mb-3">
          <h3>Curriculum Study Notes &amp; Defense Manual</h3>
          <p class="text-muted">A structured reference guide for software engineers and aspiring cybersecurity specialists. Below are detailed walkthroughs, vulnerability causes, and code-level remediation steps for every course module.</p>
        </div>
      `;

      window.CTF_DATA.ROOMS.forEach(r => {
        const chals = window.CTF_DATA.getChallengesByRoom(r.id);
        html += `<h2 class="mt-4 mb-2" style="color:var(--beige-gold)">${r.icon} ${r.title}</h2>`;

        chals.forEach(c => {
          html += `
            <details class="hint-box mb-2" id="wu-${c.id}">
              <summary>
                <b>${c.title}</b> &bull; <span class="badge ${c.level}">${c.level}</span> &bull; <span>+${c.points} XP</span>
              </summary>
              <div class="hint-content mt-2">
                <div class="mb-2">
                  <div class="callout concept mb-2">
                    ${c.concept || '<p>Core security principle.</p>'}
                  </div>
                  <div class="callout defense mb-2">
                    ${c.defense || '<p>Defensive best practices.</p>'}
                  </div>
                </div>
                <div class="d-flex align-center gap-2 mt-2 pt-2" style="border-top:1px dashed var(--border-color);">
                  <button class="btn small" onclick="this.nextElementSibling.style.display='inline'; this.style.display='none';">Reveal Lab Verification Token</button>
                  <span class="code-banner select-all" style="display:none;">${c.ans}</span>
                </div>
              </div>
            </details>
          `;
        });
      });

      container.innerHTML = html;
    }

    /* ---------------- Profile & Student Portfolio ---------------- */
    renderProfile() {
      const score = this.getScore();
      const solved = this.getSolvedCount();
      const total = window.CTF_DATA.CHALLENGES.length;
      const rank = this.getRank(score);
      const pct = Math.round((solved / total) * 100);

      const avatar = document.getElementById("profAvatar");
      const handle = document.getElementById("profHandle");
      const rankEl = document.getElementById("profRank");
      const scoreEl = document.getElementById("profScore");
      const solvedEl = document.getElementById("profSolved");
      const progBar = document.getElementById("profProgressBar");
      const progPct = document.getElementById("profProgressPct");
      const inpHandle = document.getElementById("profHandleInput");

      if (avatar) avatar.textContent = this.state.avatar;
      if (handle) handle.textContent = this.state.handle;
      if (rankEl) rankEl.textContent = `${rank.title} (${rank.badge})`;
      if (scoreEl) scoreEl.textContent = `${score} XP`;
      if (solvedEl) solvedEl.textContent = `${solved} / ${total} Labs`;
      if (progBar) progBar.style.width = `${pct}%`;
      if (progPct) progPct.textContent = `${pct}%`;
      if (inpHandle) inpHandle.value = this.state.handle;

      // Kurumi Portfolio Comment Card
      const profCard = document.getElementById("kurumiProfileCard");
      if (profCard && window.KurumiMascot) {
        let comment = "";
        let pose = "welcoming";

        if (solved === 0) {
          comment = "Welcome to your student portfolio! As you complete guided lessons and submit laboratory flags, your badges and academic rank will update automatically.";
          pose = "welcoming";
        } else if (solved === total) {
          comment = "Incredible dedication! You have achieved Valedictorian status by completing all 24 guided labs. You possess a well-rounded foundation in modern cybersecurity!";
          pose = "celebrating";
        } else if (solved >= 12) {
          comment = `You have completed ${solved} of ${total} labs and attained the rank of <strong>${rank.title}</strong>! You are more than halfway through the entire curriculum.`;
          pose = "celebrating";
        } else {
          comment = `Good start, ${this.state.handle}! You have completed ${solved} lab${solved > 1 ? 's' : ''}. Complete 3 labs in any category to unlock specialized skill badges!`;
          pose = "encouraging";
        }

        profCard.innerHTML = window.KurumiMascot.renderCard(
          pose,
          "Kurumi's Academic Evaluation",
          comment
        );
      }

      // Render achievements grid
      const achGrid = document.getElementById("achievementsGrid");
      if (achGrid) {
        achGrid.innerHTML = ACHIEVEMENTS.map(a => {
          const isUnlocked = this.state.achievements.includes(a.id);
          return `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : ''}">
              <div class="ach-icon">${a.icon}</div>
              <div>
                <div class="ach-title">${a.title}</div>
                <div class="ach-desc">${a.desc}</div>
                ${isUnlocked ? '<div class="badge easy mt-1">CERTIFIED ✓</div>' : '<div class="text-muted" style="font-size:0.75rem;">Incomplete</div>'}
              </div>
            </div>
          `;
        }).join("");
      }
    }

    /* ---------------- UI Event Listeners ---------------- */
    initUI() {
      // Filter buttons on challenge board
      document.querySelectorAll("#boardFilters .filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll("#boardFilters .filter-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          this.currentFilter = btn.dataset.filter;
          this.renderChallenges();
        });
      });

      // Challenge dialog close
      const chalDlg = document.getElementById("chal-dialog");
      const chalClose = document.getElementById("chalCloseBtn");
      if (chalClose) chalClose.addEventListener("click", () => chalDlg.close());
      chalDlg.addEventListener("click", (e) => {
        if (e.target === chalDlg) chalDlg.close();
      });

      // Flag form submission in challenge dialog
      const flagForm = document.getElementById("flagSubmitForm");
      if (flagForm) {
        flagForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const inp = document.getElementById("flagInput");
          this.submitFlag(inp.value);
        });
      }

      // Flag input live reactive guidance
      const flagInput = document.getElementById("flagInput");
      if (flagInput) {
        flagInput.addEventListener("input", (e) => {
          const val = e.target.value.trim();
          if (val.startsWith("flag{") && !val.endsWith("}") && window.KurumiMascot) {
            const text = document.getElementById("kurumiModalText");
            if (text) text.textContent = "Looking good, student! Keep typing and make sure to close the curly bracket '}'.";
            window.KurumiMascot.react("nod");
          }
        });
      }

      // Profile handle update form
      const profForm = document.getElementById("profileForm");
      if (profForm) {
        profForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const inp = document.getElementById("profHandleInput");
          const v = inp.value.trim();
          if (v && /^[a-zA-Z0-9_-]{3,20}$/.test(v)) {
            this.state.handle = v;
            this.saveState();
            this.renderAll();
            this.showToast(`Student handle updated to '${v}'!`, "success");
          } else {
            this.showToast("Handle must be 3-20 letters, numbers, or _ -", "error");
          }
        });
      }

      // Export Progress
      const expBtn = document.getElementById("exportProgressBtn");
      if (expBtn) {
        expBtn.addEventListener("click", () => {
          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
          const dlAnchor = document.createElement("a");
          dlAnchor.setAttribute("href", dataStr);
          dlAnchor.setAttribute("download", `cyberacademy_portfolio_${this.state.handle}_${Date.now()}.json`);
          dlAnchor.click();
          this.showToast("Portfolio backup exported successfully!", "success");
        });
      }

      // Import Progress
      const impBtn = document.getElementById("importProgressBtn");
      const fileInp = document.getElementById("importFileInput");
      if (impBtn && fileInp) {
        impBtn.addEventListener("click", () => fileInp.click());
        fileInp.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            try {
              const loaded = JSON.parse(ev.target.result);
              if (loaded && loaded.solves) {
                this.state = { ...defaultState, ...loaded };
                this.saveState();
                this.renderAll();
                this.showToast("Portfolio restored from backup!", "success");
              } else {
                throw new Error("Invalid structure");
              }
            } catch(err) {
              this.showToast("Failed to parse backup file: " + err.message, "error");
            }
          };
          reader.readAsText(file);
        });
      }

      // Reset Progress
      const resetBtn = document.getElementById("resetProgressBtn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          if (confirm("Are you sure you want to reset your course progress and Learning XP? This cannot be undone.")) {
            this.state.solves = {};
            this.state.achievements = [];
            this.saveState();
            this.renderAll();
            this.showToast("Learning progress has been reset.", "info");
          }
        });
      }

      // Quick Help Terminal Button
      const termHelpBtn = document.getElementById("termQuickHelpBtn");
      if (termHelpBtn) {
        termHelpBtn.addEventListener("click", () => {
          if (this.terminal) {
            this.terminal.executeCommand("help");
          }
        });
      }

      // User chip in header links to profile
      const userChip = document.getElementById("userHeaderChip");
      if (userChip) {
        userChip.addEventListener("click", () => {
          window.location.hash = "#profile";
        });
      }

      // Top Header Tour Guide button
      const tourBtn = document.getElementById("kurumiTourBtn");
      if (tourBtn) {
        tourBtn.addEventListener("click", () => {
          if (window.KurumiMascot && window.KurumiMascot.startTour) {
            window.KurumiMascot.startTour("academy");
          }
        });
      }
    }

    /* ---------------- Cyber Toolbelt Dialog ---------------- */
    initToolsDialog() {
      const openBtn = document.getElementById("openToolsBtn");
      const dlg = document.getElementById("tools-dialog");
      const closeBtn = document.getElementById("toolsCloseBtn");

      if (openBtn && dlg) {
        openBtn.addEventListener("click", () => {
          if (window.SoundEngine) window.SoundEngine.click();
          dlg.showModal();
        });
      }
      if (closeBtn && dlg) {
        closeBtn.addEventListener("click", () => dlg.close());
      }
      if (dlg) {
        dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
      }

      const input = document.getElementById("toolInputText");
      const output = document.getElementById("toolOutputResult");
      const tools = window.CyberTools;

      const runTool = (fn) => {
        if (!input || !output) return;
        const val = input.value;
        const res = fn(val);
        output.innerHTML = res;
        if (!this.state.achievements.includes("tool_user")) {
          this.state.achievements.push("tool_user");
          this.saveState();
          this.showToast("Skill Badge Unlocked: 🛠️ Toolkit Specialist!", "success");
          this.renderProfile();
        }
      };

      document.getElementById("toolB64Dec")?.addEventListener("click", () => runTool(tools.base64Decode));
      document.getElementById("toolB64Enc")?.addEventListener("click", () => runTool(tools.base64Encode));
      document.getElementById("toolHexDec")?.addEventListener("click", () => runTool(tools.hexDecode));
      document.getElementById("toolHexEnc")?.addEventListener("click", () => runTool(tools.hexEncode));
      document.getElementById("toolRot13")?.addEventListener("click", () => runTool(tools.rotN));
      document.getElementById("toolUrlDec")?.addEventListener("click", () => runTool(tools.urlDecode));
      document.getElementById("toolIdentify")?.addEventListener("click", () => runTool(tools.identify));
      document.getElementById("toolHashSha256")?.addEventListener("click", async () => {
        if (input && output) {
          const h = await tools.sha256(input.value);
          output.innerText = h;
        }
      });
    }

    /* ---------------- Kurumi Interactive Process Guidance ---------------- */
    handleTerminalGuidance(cmd, args, fullCmd) {
      if (!window.KurumiMascot) return;
      window.KurumiMascot.react("nod");

      let message = "";
      let pose = "detective";
      const cleanArgs = (args || []).map(a => a.toLowerCase());

      if (cmd === "help" || cmd === "?") {
        message = "Ara ara, exploring the manual! Try `ls -la` to inspect the contents of your home directory.";
        pose = "welcoming";
      } else if (cmd === "ls") {
        if (!cleanArgs.includes("-la") && !cleanArgs.includes("-a") && !cleanArgs.includes("-al")) {
          message = "Notice something missing? In Linux, files starting with '.' are hidden. Run `ls -la` to reveal all hidden files!";
          pose = "thinking";
        } else {
          message = "Excellent! Hidden dotfiles revealed. Look for `.secret_flag.txt` or scripts like `run_me.sh`!";
          pose = "celebrating";
        }
      } else if (cmd === "cat") {
        if (cleanArgs.some(a => a.includes("flag"))) {
          message = "Splendid! You uncovered a flag token in the file! Type `submit flag{...}` right here in the shell.";
          pose = "celebrating";
        } else if (cleanArgs.some(a => a.includes("notes"))) {
          message = "Reading notes is smart! Follow the mission briefings to locate the targets in `/var/log` or scripts.";
          pose = "curious";
        }
      } else if (cmd === "chmod") {
        message = "File permissions modified! Now try executing the script with `./run_me.sh`!";
        pose = "curious";
      } else if (cmd === "grep") {
        message = "Grep searches through files line by line. Look for authentication events like 'Accepted' or 'Failed' in auth.log!";
        pose = "detective";
      }

      if (message && window.KurumiMascot.say) {
        window.KurumiMascot.say(message, pose, 7, "Linux Guidance");
      }
    }

    getInteractiveGuidance() {
      // 1. If challenge dialog is open:
      const chalDlg = document.getElementById("chal-dialog");
      if (chalDlg && chalDlg.open && this.activeChallenge) {
        const chal = this.activeChallenge;
        if (this.activeTab === "concept") {
          return {
            text: `Step 1 of 4: We are studying '${chal.title}'. Read the theory to understand how attackers exploit this assumption!`,
            pose: "thinking",
            tag: "Step 1: Theory"
          };
        } else if (this.activeTab === "lab") {
          return {
            text: `Step 2 of 4: Investigate the sandbox target! ${chal.hint || 'Inspect the elements or inputs to locate the flag token.'}`,
            pose: "curious",
            tag: "Step 2: Lab Exploit"
          };
        } else if (this.activeTab === "defense") {
          return {
            text: `Step 3 of 4: Learn how engineers patch '${chal.title}'. Real security is about proactive defense!`,
            pose: "detective",
            tag: "Step 3: Defense"
          };
        } else {
          return {
            text: `Step 4 of 4: Enter your discovered flag in the format flag{...} to record your Learning XP!`,
            pose: "welcoming",
            tag: "Step 4: Verification"
          };
        }
      }

      // 2. If viewing a specific route:
      const hash = (window.location.hash || "#home").replace("#", "").toLowerCase();
      if (hash === "terminal") {
        return {
          text: "You are in the Linux Terminal lab! Use 'ls -la' to reveal hidden files, 'cat' to read secrets, and 'submit <flag>' to earn XP.",
          pose: "detective",
          tag: "Terminal Guide"
        };
      } else if (hash === "scoreboard") {
        const score = this.getScore();
        return {
          text: `You have ${score} Learning XP! Complete guided lessons in Web Security or Linux CLI to climb higher on the leaderboard.`,
          pose: "encouraging",
          tag: "Rank Guide"
        };
      } else if (hash === "rooms") {
        return {
          text: "Browse our 6 structured courses! If you're a beginner, complete Module 1 (Fundamentals) first, then jump into Web Security.",
          pose: "curious",
          tag: "Course Selection"
        };
      } else if (hash === "challenges") {
        const unsolved = window.CTF_DATA.CHALLENGES.filter(c => !this.state.solves[c.id]);
        if (unsolved.length > 0) {
          return {
            text: `Ready for your next lab? Try '${unsolved[0].title}' (+${unsolved[0].points} XP). Click any card to launch the guided player!`,
            pose: "welcoming",
            tag: "Next Lab"
          };
        }
        return {
          text: "Incredible dedication! You have solved all 24 labs across the entire curriculum!",
          pose: "celebrating",
          tag: "Valedictorian"
        };
      }

      // Default home guidance
      const nextChal = window.CTF_DATA.CHALLENGES.find(c => !this.state.solves[c.id]);
      if (nextChal) {
        return {
          text: `Welcome back, ${this.state.handle}! Your next recommended lesson is '${nextChal.title}'. Ready to dive in?`,
          pose: "welcoming",
          tag: "Study Recommendation"
        };
      }
      return {
        text: "Ara ara, you are on top of the world! All academy lessons completed. Review your notes or explore the Linux shell!",
        pose: "celebrating",
        tag: "Scholar"
      };
    }
  }

  // Initialize application on DOM ready
  window.addEventListener("DOMContentLoaded", () => {
    window.App = new AcademyApp();
  });
})(window);

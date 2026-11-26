/**
 * CyberAcademy - Kurumi Tokisaki Mascot Component
 * Official platform mascot and student learning companion.
 * Features customizable poses, SVG rendering with signature gothic aesthetic
 * (uneven twin tails, crimson eye, golden Zaphkiel clock eye, gothic ribbons),
 * interactive companion speech bubbles, and contextual tips.
 */
(function(window) {
  'use strict';

  // Contextual tips and quotes from Kurumi Tokisaki
  const KURUMI_TIPS = [
    "Ara ara, remember: never trust user input in JavaScript alone! The client is always controllable by the user.",
    "A secret in Git history is never truly gone until you rewrite history or rotate the credentials.",
    "Base64 is just an encoding scheme, darling. Anyone can reverse it without a key in seconds!",
    "Time reveals all secrets... and so does a single-byte XOR key when you brute-force all 256 possibilities.",
    "Always check robots.txt first—developers often leave roadmaps straight to their most sensitive directories.",
    "When inspecting suspicious files, the strings command and magic bytes never lie.",
    "SQL injection happens when developers concatenate strings instead of using Prepared Statements.",
    "Take your time, student. Even the most intricate ciphers unravel with patience and known-plaintext clues.",
    "Cleartext protocols like HTTP send your tokens naked across the wire. Insist on HTTPS Everywhere!"
  ];

  const MODULE_GREETINGS = {
    practice: "Welcome to the Fundamentals! Let us begin our journey with flag anatomy and basic encodings.",
    web: "Web applications are full of delicious vulnerabilities when developers place too much trust in the client.",
    osint: "Public digital footprints leave endless trails. Shall we investigate the target's open-source intelligence?",
    crypto: "Ciphers and keys... manipulating time and mathematics is my specialty. Let us decode these puzzles.",
    forensics: "Digging through binary memory dumps and corrupted headers? A true forensic investigation awaits.",
    terminal: "The Linux command line is the hacker's true playground. Open the shell and let us explore the system."
  };

  /**
   * SVG Character Builder for Kurumi Tokisaki
   * Distinctive traits:
   * - Uneven black twin-tails (longer on right, shorter on left)
   * - Red gothic lolita hair frills / ribbons
   * - Right eye: Crimson red
   * - Left eye: Golden Emperor Zaphkiel clock face with Roman numeral ticks
   * - Gothic lolita collar with lace and gold brooch
   */
  function buildKurumiSVG(pose = "welcoming", size = 120) {
    let mouthPath = "M65 83 Q75 90 85 83"; // gentle smile
    let leftBrow = "M46 54 Q56 50 64 53";
    let rightBrow = "M86 53 Q94 50 104 54";
    let blushOpacity = "0.6";
    let accessory = "";
    let eyeHandsAngle = 45; // clock hand rotation

    switch (pose) {
      case "thinking":
        mouthPath = "M70 84 Q75 82 80 84";
        leftBrow = "M46 56 Q56 54 64 51";
        rightBrow = "M86 49 Q94 53 104 55";
        accessory = `
          <!-- Thinking hand near chin -->
          <path d="M84 92 C88 88 94 86 98 90 C96 95 90 98 84 96 Z" fill="#f8e7dc" stroke="#501622" stroke-width="1.5"/>
          <circle cx="102" cy="40" r="3" fill="#dfbf8c" opacity="0.6"/>
          <circle cx="108" cy="32" r="5" fill="#dfbf8c" opacity="0.8"/>
        `;
        eyeHandsAngle = 135;
        break;

      case "celebrating":
        mouthPath = "M64 81 Q75 94 86 81 Z"; // joyful open smile
        blushOpacity = "0.9";
        accessory = `
          <!-- Victory sparkles / rose petals -->
          <path d="M25 40 Q28 45 25 50 Q22 45 25 40 Z" fill="#c2274e" opacity="0.85"/>
          <path d="M125 35 Q130 38 127 44 Q123 40 125 35 Z" fill="#dfbf8c" opacity="0.9"/>
          <polygon points="20,25 22,29 27,29 23,32 25,37 20,34 16,37 17,32 14,29 19,29" fill="#dfbf8c"/>
          <polygon points="130,55 132,58 136,58 133,61 134,65 130,62 127,65 128,61 125,58 129,58" fill="#c2274e"/>
        `;
        break;

      case "surprised":
        mouthPath = "M70 82 A5 6 0 1 0 80 82 A5 6 0 1 0 70 82 Z"; // small open 'o'
        leftBrow = "M46 48 Q56 46 64 49";
        rightBrow = "M86 49 Q94 46 104 48";
        accessory = `
          <!-- Surprise exclamation / sweatdrop -->
          <path d="M112 36 Q115 30 118 36 A3 3 0 1 1 112 36 Z" fill="#dfbf8c"/>
        `;
        break;

      case "curious":
        mouthPath = "M67 84 Q75 88 83 84";
        leftBrow = "M46 51 Q56 48 64 53";
        rightBrow = "M86 55 Q94 52 104 53";
        accessory = `
          <!-- Golden clock gear near shoulder -->
          <g transform="translate(108, 68) scale(0.65)">
            <circle cx="15" cy="15" r="12" fill="none" stroke="#dfbf8c" stroke-width="3" stroke-dasharray="4,2"/>
            <circle cx="15" cy="15" r="5" fill="#dfbf8c"/>
          </g>
        `;
        break;

      case "detective":
        mouthPath = "M68 83 Q75 85 82 83";
        leftBrow = "M46 54 Q56 52 64 54";
        rightBrow = "M86 53 Q94 51 104 53";
        accessory = `
          <!-- Gothic monocle rim over crimson eye -->
          <circle cx="95" cy="64" r="14" fill="none" stroke="#dfbf8c" stroke-width="1.8"/>
          <path d="M109 64 Q116 75 112 90" fill="none" stroke="#dfbf8c" stroke-width="1.2" stroke-dasharray="2,2"/>
        `;
        eyeHandsAngle = 280;
        break;

      case "encouraging":
      default:
        mouthPath = "M65 83 Q75 90 85 83";
        accessory = `
          <!-- Subtle wink/confidence sparkle -->
          <polygon points="115,45 117,49 121,49 118,52 119,56 115,53 112,56 113,52 110,49 114,49" fill="#dfbf8c"/>
        `;
        break;
    }

    return `
      <svg class="kurumi-mascot-svg kurumi-pose-${pose}" viewBox="0 0 150 150" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kurumi Tokisaki (${pose} expression)">
        <defs>
          <radialGradient id="kurumiRubyEye" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#ff4d79"/>
            <stop offset="60%" stop-color="#b81538"/>
            <stop offset="100%" stop-color="#4d0515"/>
          </radialGradient>
          <radialGradient id="kurumiClockEye" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fff8db"/>
            <stop offset="50%" stop-color="#e0b86c"/>
            <stop offset="100%" stop-color="#7a5518"/>
          </radialGradient>
          <linearGradient id="kurumiHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2a1217"/>
            <stop offset="50%" stop-color="#14070a"/>
            <stop offset="100%" stop-color="#0a0305"/>
          </linearGradient>
          <linearGradient id="kurumiRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#c2274e"/>
            <stop offset="60%" stop-color="#800f28"/>
            <stop offset="100%" stop-color="#470716"/>
          </linearGradient>
        </defs>

        <!-- Back Hair & Iconic Uneven Twin-Tails (Animated Sway) -->
        <!-- Right Twintail (Viewer's left: long flowing twin-tail) -->
        <path class="kurumi-twintail-right" d="M38 48 C15 65 5 105 18 142 C24 125 32 95 44 80 Z" fill="url(#kurumiHairGrad)"/>
        <!-- Left Twintail (Viewer's right: shorter pinned twin-tail) -->
        <path class="kurumi-twintail-left" d="M112 48 C128 60 142 85 136 115 C128 98 122 82 110 74 Z" fill="url(#kurumiHairGrad)"/>

        <!-- Gothic Lolita Hair Ribbons (Animated Flutter) -->
        <!-- Right Hair Ribbon (Large) -->
        <g class="kurumi-ribbon-right" transform="translate(32, 42)">
          <path d="M-8 -6 C-18 -16 -24 4 -12 10 C-6 6 -2 2 0 0 Z" fill="url(#kurumiRibbonGrad)"/>
          <path d="M-6 8 C-14 20 -20 28 -8 26 C-4 18 0 8 0 0 Z" fill="url(#kurumiRibbonGrad)"/>
          <circle cx="0" cy="0" r="4" fill="#dfbf8c"/>
        </g>
        <!-- Left Hair Ribbon (High) -->
        <g class="kurumi-ribbon-left" transform="translate(114, 40)">
          <path d="M8 -6 C18 -16 24 4 12 10 C6 6 2 2 0 0 Z" fill="url(#kurumiRibbonGrad)"/>
          <path d="M6 8 C14 20 20 28 8 26 C4 18 0 8 0 0 Z" fill="url(#kurumiRibbonGrad)"/>
          <circle cx="0" cy="0" r="4" fill="#dfbf8c"/>
        </g>

        <!-- Body & Gothic Lolita Collar -->
        <path d="M48 125 C48 108 60 102 75 102 C90 102 102 108 102 125 L108 150 L42 150 Z" fill="#14070a"/>
        <path d="M56 112 L75 128 L94 112 L88 104 L75 110 L62 104 Z" fill="#ede1ce" stroke="#800f28" stroke-width="1.5"/>
        <circle cx="75" cy="118" r="3.5" fill="#dfbf8c" stroke="#470716" stroke-width="1"/>
        <path d="M68 124 Q75 132 82 124" fill="none" stroke="#c2274e" stroke-width="2"/>

        <!-- Face Base (Pale Porcelain) -->
        <path d="M42 58 C42 92 56 104 75 104 C94 104 108 92 108 58 C108 34 94 28 75 28 C56 28 42 34 42 58 Z" fill="#fcf4ed"/>

        <!-- Soft Blush on Cheeks -->
        <ellipse class="kurumi-blush-left" cx="53" cy="74" rx="7" ry="3.5" fill="#f096aa" opacity="${blushOpacity}"/>
        <ellipse class="kurumi-blush-right" cx="97" cy="74" rx="7" ry="3.5" fill="#f096aa" opacity="${blushOpacity}"/>

        <!-- Left Eye (Viewer's left): Emperor Zaphkiel Golden Clock Eye! (Mechanical Ticking Motion) -->
        <g transform="translate(56, 64)" class="kurumi-clock-eye">
          <ellipse cx="0" cy="0" rx="9.5" ry="11" fill="url(#kurumiClockEye)" stroke="#4d350e" stroke-width="1.2"/>
          <!-- Roman Numeral Clock Dial Marks -->
          <circle cx="0" cy="0" r="7.5" fill="none" stroke="#664612" stroke-width="0.8" stroke-dasharray="1.2,2.5"/>
          <!-- Center Pin -->
          <circle cx="0" cy="0" r="1.5" fill="#362205"/>
          <!-- Rotating Clock Hands -->
          <g class="kurumi-clock-hand-long" transform="rotate(${eyeHandsAngle})">
            <line x1="0" y1="0" x2="0" y2="-5.5" stroke="#2e1b02" stroke-width="1.4" stroke-linecap="round"/>
          </g>
          <g class="kurumi-clock-hand-short" transform="rotate(${eyeHandsAngle + 110})">
            <line x1="0" y1="0" x2="0" y2="-3.8" stroke="#2e1b02" stroke-width="1.2" stroke-linecap="round"/>
          </g>
          <!-- Eye Eyelash / Shadow -->
          <path d="M-11 -7 Q0 -13 11 -7" fill="none" stroke="#16080b" stroke-width="3" stroke-linecap="round"/>
        </g>

        <!-- Right Eye (Viewer's right): Deep Ruby Crimson Eye -->
        <g transform="translate(94, 64)" class="kurumi-ruby-eye">
          <ellipse cx="0" cy="0" rx="9.5" ry="11" fill="url(#kurumiRubyEye)"/>
          <ellipse cx="0" cy="1" rx="5" ry="6.5" fill="#2d030c"/>
          <!-- Eye Highlights -->
          <circle class="kurumi-eye-glint" cx="-3" cy="-3.5" r="2.5" fill="#ffffff"/>
          <circle cx="2.5" cy="3" r="1.2" fill="#ffffff" opacity="0.8"/>
          <!-- Eye Eyelash / Shadow -->
          <path d="M-11 -7 Q0 -13 11 -7" fill="none" stroke="#16080b" stroke-width="3" stroke-linecap="round"/>
        </g>

        <!-- Eyebrows -->
        <path d="${leftBrow}" fill="none" stroke="#240c12" stroke-width="1.6" stroke-linecap="round"/>
        <path d="${rightBrow}" fill="none" stroke="#240c12" stroke-width="1.6" stroke-linecap="round"/>

        <!-- Nose -->
        <path d="M75 72 L76 75" stroke="#d49e87" stroke-width="1.2" stroke-linecap="round"/>

        <!-- Mouth -->
        <path d="${mouthPath}" fill="${pose === 'celebrating' ? '#c2274e' : 'none'}" stroke="#731526" stroke-width="1.8" stroke-linecap="round"/>

        <!-- Front Bangs & Curtains (Gothic Uneven Parting) -->
        <path d="M42 45 C45 28 65 24 75 25 C88 24 105 28 108 45 C102 46 95 50 90 56 C85 48 76 45 70 55 C65 48 55 48 48 58 C44 52 42 48 42 45 Z" fill="url(#kurumiHairGrad)"/>
        <!-- Side hair strands framing face -->
        <path d="M42 54 C40 70 43 85 47 95 C49 85 48 70 47 58 Z" fill="url(#kurumiHairGrad)"/>
        <path d="M108 54 C110 70 107 85 103 95 C101 85 102 70 103 58 Z" fill="url(#kurumiHairGrad)"/>
        <!-- Center bangs strand -->
        <path d="M73 28 C74 44 71 58 68 66 C73 58 76 44 75 28 Z" fill="url(#kurumiHairGrad)"/>

        <!-- Accessories & Expression additions -->
        ${accessory}
      </svg>
    `;
  }

  const KurumiMascot = {
    /**
     * Render raw SVG string for a specific pose
     */
    renderSVG: (pose = "welcoming", size = 120) => {
      return buildKurumiSVG(pose, size);
    },

    /**
     * Render mascot wrapper HTML element
     */
    render: (pose = "welcoming", options = {}) => {
      const size = options.size || 110;
      const extraClass = options.className || "";
      const bubble = options.speech ? `<div class="kurumi-speech-bubble">${options.speech}</div>` : "";

      return `
        <div class="kurumi-mascot-container ${extraClass}" data-pose="${pose}">
          ${bubble}
          <div class="kurumi-avatar-frame">
            ${buildKurumiSVG(pose, size)}
          </div>
        </div>
      `;
    },

    /**
     * Render a full card with Kurumi illustration and message
     */
    renderCard: (pose = "welcoming", title = "Kurumi Tokisaki", message = "", buttonHtml = "") => {
      return `
        <div class="kurumi-dialogue-card">
          <div class="kurumi-dialogue-avatar">
            ${buildKurumiSVG(pose, 95)}
          </div>
          <div class="kurumi-dialogue-body">
            <div class="kurumi-dialogue-header">
              <span class="kurumi-name-badge">🕰️ ${title}</span>
              <span class="kurumi-role-tag">Academy Companion</span>
            </div>
            <p class="kurumi-dialogue-text">${message}</p>
            ${buttonHtml ? `<div class="kurumi-dialogue-actions mt-2">${buttonHtml}</div>` : ''}
          </div>
        </div>
      `;
    },

    /**
     * Get a random contextual tip
     */
    getRandomTip: () => {
      return KURUMI_TIPS[Math.floor(Math.random() * KURUMI_TIPS.length)];
    },

    /**
     * Get module greeting
     */
    getModuleGreeting: (moduleId) => {
      return MODULE_GREETINGS[moduleId] || "Let us master this cybersecurity lesson together, student.";
    },

    /**
     * Trigger dynamic motion animation on Kurumi avatar
     */
    react: (motionType = "hop") => {
      const cls = `kurumi-motion-${motionType}`;
      const targets = [
        document.getElementById("kurumiTriggerAvatar"),
        document.getElementById("kurumiModalAvatar"),
        document.getElementById("brandMascotIcon")
      ].filter(Boolean);

      targets.forEach(el => {
        el.classList.remove("kurumi-motion-hop", "kurumi-motion-wobble", "kurumi-motion-nod");
        // Force reflow
        void el.offsetWidth;
        el.classList.add(cls);
        setTimeout(() => el.classList.remove(cls), 950);
      });
    },

    /**
     * Floating companion controller
     */
    initCompanionWidget: () => {
      if (document.getElementById("kurumi-companion-dock")) return;

      const dock = document.createElement("div");
      dock.id = "kurumi-companion-dock";
      dock.className = "kurumi-companion-dock";
      dock.innerHTML = `
        <div class="kurumi-companion-bubble" id="kurumiCompanionBubble" style="display:none;">
          <button class="kurumi-bubble-close" id="kurumiBubbleClose" title="Dismiss speech bubble">✕</button>
          <div class="kurumi-bubble-header">
            <span class="kurumi-bubble-speaker">🕰️ Kurumi Tokisaki</span>
            <span class="kurumi-bubble-badge" id="kurumiBubbleContext">Active Guide</span>
          </div>
          <div class="kurumi-bubble-content" id="kurumiBubbleText">Ara ara, need some guidance on this lesson? Click me anytime for security tips!</div>
          <div class="kurumi-bubble-actions">
            <button class="kurumi-bubble-btn" id="kurumiActionGuideMe" type="button">🧭 What's Next?</button>
            <button class="kurumi-bubble-btn" id="kurumiActionTip" type="button">💡 Quick Tip</button>
            <button class="kurumi-bubble-btn" id="kurumiActionTools" type="button">🧰 Tools</button>
            <button class="kurumi-bubble-btn" id="kurumiActionTerminal" type="button">💻 Linux Shell</button>
          </div>
        </div>
        <button class="kurumi-companion-trigger" id="kurumiCompanionTrigger" aria-label="Ask Kurumi Tokisaki for interactive cybersecurity guidance" title="Kurumi Tokisaki — Your Interactive Cyber Companion">
          <div class="kurumi-trigger-avatar" id="kurumiTriggerAvatar">
            ${buildKurumiSVG("welcoming", 68)}
          </div>
          <span class="kurumi-pulse-ring"></span>
        </button>
      `;

      document.body.appendChild(dock);

      const trigger = document.getElementById("kurumiCompanionTrigger");
      const bubble = document.getElementById("kurumiCompanionBubble");
      const bubbleText = document.getElementById("kurumiBubbleText");
      const bubbleContext = document.getElementById("kurumiBubbleContext");
      const closeBtn = document.getElementById("kurumiBubbleClose");
      const avatarContainer = document.getElementById("kurumiTriggerAvatar");

      let isBubbleOpen = false;
      let hideTimer = null;

      const showBubble = (msg, pose = "curious", autoCloseSeconds = 10, contextTag = "Active Guide") => {
        if (bubbleText) bubbleText.textContent = msg;
        if (bubbleContext) bubbleContext.textContent = contextTag;
        if (avatarContainer) avatarContainer.innerHTML = buildKurumiSVG(pose, 68);
        if (bubble) bubble.style.display = "block";
        isBubbleOpen = true;

        // Trigger gentle reaction nod or hop
        KurumiMascot.react(pose === "celebrating" ? "hop" : (pose === "surprised" ? "wobble" : "nod"));

        clearTimeout(hideTimer);
        if (autoCloseSeconds > 0) {
          hideTimer = setTimeout(() => {
            if (bubble) bubble.style.display = "none";
            isBubbleOpen = false;
          }, autoCloseSeconds * 1000);
        }
      };

      if (trigger) {
        trigger.addEventListener("click", () => {
          if (window.SoundEngine) window.SoundEngine.click();
          KurumiMascot.react("hop");
          if (isBubbleOpen) {
            bubble.style.display = "none";
            isBubbleOpen = false;
            clearTimeout(hideTimer);
          } else {
            // Provide contextual guidance based on what's on screen
            if (window.App && typeof window.App.getInteractiveGuidance === "function") {
              const guide = window.App.getInteractiveGuidance();
              showBubble(guide.text, guide.pose || "curious", 12, guide.tag || "Live Guide");
            } else {
              const tip = KurumiMascot.getRandomTip();
              showBubble(tip, "thinking", 10, "Security Tip");
            }
          }
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (bubble) bubble.style.display = "none";
          isBubbleOpen = false;
          clearTimeout(hideTimer);
        });
      }

      // Quick Action Buttons inside Companion Bubble
      document.getElementById("kurumiActionGuideMe")?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (window.SoundEngine) window.SoundEngine.click();
        KurumiMascot.react("nod");
        if (window.App && typeof window.App.getInteractiveGuidance === "function") {
          const guide = window.App.getInteractiveGuidance();
          showBubble(guide.text, guide.pose || "curious", 14, guide.tag || "Next Step");
        }
      });

      document.getElementById("kurumiActionTip")?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (window.SoundEngine) window.SoundEngine.click();
        KurumiMascot.react("nod");
        showBubble(KurumiMascot.getRandomTip(), "thinking", 10, "Cyber Tip");
      });

      document.getElementById("kurumiActionTools")?.addEventListener("click", (e) => {
        e.stopPropagation();
        document.getElementById("openToolsBtn")?.click();
        showBubble("Opened the Cyber Toolbelt! Use this to decode Base64, Hex, or calculate SHA-256 hashes.", "detective", 7, "Toolkit");
      });

      document.getElementById("kurumiActionTerminal")?.addEventListener("click", (e) => {
        e.stopPropagation();
        window.location.hash = "#terminal";
        showBubble("Welcome to the Linux Terminal sandbox! Run 'help' or 'ls -la' to investigate.", "detective", 7, "Linux Shell");
      });

      // Initial gentle companion greeting after 3 seconds on first load
      setTimeout(() => {
        showBubble("Ara ara, welcome to the Academy! I am Kurumi Tokisaki, your guide through cybersecurity. Click me anytime for hints and step guidance!", "welcoming", 8, "Welcome");
      }, 2500);

      window.KurumiMascot.say = showBubble;
    },

    /**
     * Floating Glide Engine — Kurumi flies directly to icons & elements (TryHackMe style)
     */
    initFlightEngine: () => {
      if (document.getElementById("kurumi-floating-guide")) return;

      const guide = document.createElement("div");
      guide.id = "kurumi-floating-guide";
      guide.className = "kurumi-floating-guide";
      guide.style.display = "none";
      guide.innerHTML = `
        <div class="kurumi-flying-avatar-wrap" id="kurumiFlyingAvatarWrap">
          <div class="kurumi-flying-avatar" id="kurumiFlyingAvatar">
            ${buildKurumiSVG("curious", 72)}
          </div>
          <div class="kurumi-flight-trail"></div>
        </div>
        <div class="kurumi-flying-bubble" id="kurumiFlyingBubble">
          <button class="kurumi-bubble-close" id="kurumiFlyingClose" title="Dismiss guide">✕</button>
          <div class="kurumi-flying-header">
            <span class="kurumi-flying-speaker">🕰️ Kurumi Tokisaki</span>
            <span class="kurumi-flying-step-badge" id="kurumiFlyingStepBadge">Tour Guide</span>
          </div>
          <div class="kurumi-flying-text" id="kurumiFlyingText">
            Welcome to the Academy!
          </div>
          <div class="kurumi-flying-actions" id="kurumiFlyingActions">
            <button class="btn tiny ghost" id="kurumiFlyingPrevBtn" type="button">← Prev</button>
            <button class="btn tiny primary" id="kurumiFlyingNextBtn" type="button">Next Icon ➔</button>
          </div>
          <div class="kurumi-flying-arrow" id="kurumiFlyingArrow"></div>
        </div>
      `;

      document.body.appendChild(guide);

      // Event listeners for flight guide
      document.getElementById("kurumiFlyingClose")?.addEventListener("click", () => {
        KurumiMascot.dismissFlight();
      });

      document.getElementById("kurumiFlyingNextBtn")?.addEventListener("click", () => {
        KurumiMascot.nextTourStep();
      });

      document.getElementById("kurumiFlyingPrevBtn")?.addEventListener("click", () => {
        KurumiMascot.prevTourStep();
      });

      // Escape key closes flight guide
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && guide.style.display !== "none") {
          KurumiMascot.dismissFlight();
        }
      });

      // Reposition on window resize if active
      window.addEventListener("resize", () => {
        if (KurumiMascot._activeFlightTarget && guide.style.display !== "none") {
          KurumiMascot._positionFlight(KurumiMascot._activeFlightTarget, KurumiMascot._activePlacement);
        }
      });
    },

    /**
     * Position calculation and smooth floating glide to target element
     */
    _positionFlight: (el, placement = "auto") => {
      const guide = document.getElementById("kurumi-floating-guide");
      const arrow = document.getElementById("kurumiFlyingArrow");
      if (!guide || !el) return;

      const rect = el.getBoundingClientRect();
      const guideWidth = 320;
      const guideHeight = 180;
      const pad = 16;

      let p = placement;
      if (p === "auto") {
        if (rect.top < 160) p = "bottom";
        else if (rect.bottom > window.innerHeight - 200) p = "top";
        else if (rect.left > guideWidth + 40) p = "left";
        else p = "bottom";
      }

      let top = 0;
      let left = 0;
      const targetCenterX = rect.left + rect.width / 2;
      const targetCenterY = rect.top + rect.height / 2;

      if (p === "bottom") {
        top = Math.min(window.innerHeight - guideHeight - pad, rect.bottom + 14);
        left = Math.max(pad, Math.min(window.innerWidth - guideWidth - pad, targetCenterX - guideWidth / 2));
      } else if (p === "top") {
        top = Math.max(pad, rect.top - guideHeight - 14);
        left = Math.max(pad, Math.min(window.innerWidth - guideWidth - pad, targetCenterX - guideWidth / 2));
      } else if (p === "left") {
        top = Math.max(pad, Math.min(window.innerHeight - guideHeight - pad, targetCenterY - guideHeight / 2));
        left = Math.max(pad, rect.left - guideWidth - 14);
      } else { // right
        top = Math.max(pad, Math.min(window.innerHeight - guideHeight - pad, targetCenterY - guideHeight / 2));
        left = Math.min(window.innerWidth - guideWidth - pad, rect.right + 14);
      }

      guide.style.left = `${left}px`;
      guide.style.top = `${top}px`;
      guide.setAttribute("data-placement", p);

      if (arrow) {
        // Position arrow pointing directly at target center
        if (p === "bottom") {
          const arrowOffset = Math.max(20, Math.min(guideWidth - 30, targetCenterX - left));
          arrow.style.left = `${arrowOffset}px`;
          arrow.style.top = `-8px`;
        } else if (p === "top") {
          const arrowOffset = Math.max(20, Math.min(guideWidth - 30, targetCenterX - left));
          arrow.style.left = `${arrowOffset}px`;
          arrow.style.top = `auto`;
          arrow.style.bottom = `-8px`;
        }
      }
    },

    /**
     * Fly mascot smoothly to an icon or element and display contextual instruction
     */
    flyTo: (target, options = {}) => {
      KurumiMascot.initFlightEngine();
      const guide = document.getElementById("kurumi-floating-guide");
      const avatar = document.getElementById("kurumiFlyingAvatar");
      const textEl = document.getElementById("kurumiFlyingText");
      const badgeEl = document.getElementById("kurumiFlyingStepBadge");
      const prevBtn = document.getElementById("kurumiFlyingPrevBtn");
      const nextBtn = document.getElementById("kurumiFlyingNextBtn");

      const el = typeof target === "string" ? document.querySelector(target) : target;
      if (!el) return;

      // Clear previous spotlights
      document.querySelectorAll(".kurumi-icon-spotlight").forEach(item => item.classList.remove("kurumi-icon-spotlight"));
      el.classList.add("kurumi-icon-spotlight");

      // Smooth scroll target into view if needed
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });

      KurumiMascot._activeFlightTarget = el;
      KurumiMascot._activePlacement = options.placement || "auto";

      // Update contents
      const pose = options.pose || "curious";
      if (avatar) avatar.innerHTML = buildKurumiSVG(pose, 72);
      if (textEl) textEl.innerHTML = options.text || "Ara ara, observe this element!";
      if (badgeEl) badgeEl.textContent = options.badge || "Icon Guide";

      if (prevBtn) prevBtn.style.display = options.showPrev ? "inline-block" : "none";
      if (nextBtn) {
        nextBtn.style.display = options.showNext !== false ? "inline-block" : "none";
        nextBtn.textContent = options.actionText || "Next Icon ➔";
      }

      guide.style.display = "flex";
      guide.classList.remove("kurumi-flying-depart");

      // Position after brief DOM update
      setTimeout(() => {
        KurumiMascot._positionFlight(el, KurumiMascot._activePlacement);
        KurumiMascot.react("hop");
        if (window.SoundEngine) window.SoundEngine.click();
      }, 40);
    },

    /**
     * Dismiss floating guide
     */
    dismissFlight: () => {
      const guide = document.getElementById("kurumi-floating-guide");
      document.querySelectorAll(".kurumi-icon-spotlight").forEach(item => item.classList.remove("kurumi-icon-spotlight"));
      if (guide) {
        guide.classList.add("kurumi-flying-depart");
        setTimeout(() => {
          guide.style.display = "none";
          guide.classList.remove("kurumi-flying-depart");
        }, 320);
      }
      KurumiMascot._activeTour = null;
      KurumiMascot._activeTourIndex = 0;
      KurumiMascot._activeFlightTarget = null;
    },

    /**
     * Pre-defined interactive tours across website icons
     */
    _tours: {
      academy: [
        {
          target: "#brandMascotIcon",
          placement: "bottom",
          pose: "welcoming",
          badge: "Step 1 of 6",
          text: "Ara ara, welcome to <b>CyberAcademy</b>! I am Kurumi Tokisaki, your personal academy mascot. Let me guide you across the essential icons on our platform!",
          actionText: "Next: Tools ➔"
        },
        {
          target: "#openToolsBtn",
          placement: "bottom",
          pose: "detective",
          badge: "Step 2 of 6",
          text: "This is your offline <b>Cyber Toolbelt</b>! Click here anytime to decode Base64, Hex, URL encodings, or calculate SHA-256 hashes without leaving your active lab.",
          actionText: "Next: Linux Shell ➔"
        },
        {
          target: "nav.main-nav a[data-route='terminal']",
          placement: "bottom",
          pose: "thinking",
          badge: "Step 3 of 6",
          text: "The <b>Terminal Lab</b>! An authentic in-browser bash terminal where you can practice real Linux administration commands, uncover hidden dotfiles, and audit logs.",
          actionText: "Next: Course Tracks ➔"
        },
        {
          target: "#homeRoomsPreview",
          placement: "top",
          pose: "curious",
          badge: "Step 4 of 6",
          text: "Here are our <b>6 Course Tracks</b>! If you are a beginner, start with Module 1: Fundamentals to master flag anatomy and encodings, then dive into Web Security or Threat Recon.",
          actionText: "Next: Leaderboard ➔"
        },
        {
          target: "nav.main-nav a[data-route='scoreboard']",
          placement: "bottom",
          pose: "encouraging",
          badge: "Step 5 of 6",
          text: "The <b>Class Leaderboard</b>! Every lab you solve awards Learning XP to help you rise through student ranks from Cyber Cadet up to Elite Security Engineer.",
          actionText: "Next: Portfolio ➔"
        },
        {
          target: "#userHeaderChip",
          placement: "bottom",
          pose: "celebrating",
          badge: "Step 6 of 6",
          text: "Your <b>Student Portfolio</b>! Track your completed labs, earned skill badges, and export or restore your progress anytime. You are ready to explore!",
          actionText: "Start Learning! 🎉"
        }
      ],
      lab: [
        {
          target: ".lesson-tabs",
          placement: "bottom",
          pose: "curious",
          badge: "Lab Guide 1 of 4",
          text: "Every lab is organized into 4 guided tabs: Concept & Theory, Guided Sandbox Lab, Defensive Remediation, and Flag Verification.",
          actionText: "Next: Hints ➔"
        },
        {
          target: "#chalHintDetails",
          placement: "top",
          pose: "encouraging",
          badge: "Lab Guide 2 of 4",
          text: "Need a clue? Click here to reveal an instructor hint whenever you feel stuck on a puzzle step!",
          actionText: "Next: Sandbox ➔"
        },
        {
          target: "#chalBody",
          placement: "top",
          pose: "detective",
          badge: "Lab Guide 3 of 4",
          text: "This is the interactive sandbox target! Test inputs, inspect source code, or manipulate parameters to extract the secret token.",
          actionText: "Next: Flag Submit ➔"
        },
        {
          target: "#flagInput",
          placement: "top",
          pose: "welcoming",
          badge: "Lab Guide 4 of 4",
          text: "Once you find the secret verification token, submit it here in the format flag{...} to claim your Learning XP!",
          actionText: "Ready to Solve! 🏁"
        }
      ]
    },

    /**
     * Start an interactive guided tour
     */
    startTour: (tourName = "academy") => {
      const tour = KurumiMascot._tours[tourName];
      if (!tour || tour.length === 0) return;

      KurumiMascot._activeTour = tour;
      KurumiMascot._activeTourIndex = 0;
      KurumiMascot._showActiveTourStep();
    },

    _showActiveTourStep: () => {
      const tour = KurumiMascot._activeTour;
      if (!tour) return;
      const idx = KurumiMascot._activeTourIndex;
      const step = tour[idx];

      KurumiMascot.flyTo(step.target, {
        placement: step.placement,
        pose: step.pose,
        badge: step.badge,
        text: step.text,
        actionText: step.actionText,
        showPrev: idx > 0,
        showNext: true
      });
    },

    nextTourStep: () => {
      if (!KurumiMascot._activeTour) {
        KurumiMascot.dismissFlight();
        return;
      }
      KurumiMascot._activeTourIndex++;
      if (KurumiMascot._activeTourIndex >= KurumiMascot._activeTour.length) {
        KurumiMascot.dismissFlight();
        if (window.KurumiMascot.say) {
          window.KurumiMascot.say("Tour complete! Select any course or lab below to begin learning.", "celebrating", 6, "Ready!");
        }
      } else {
        KurumiMascot._showActiveTourStep();
      }
    },

    prevTourStep: () => {
      if (!KurumiMascot._activeTour || KurumiMascot._activeTourIndex <= 0) return;
      KurumiMascot._activeTourIndex--;
      KurumiMascot._showActiveTourStep();
    }
  };

  window.KurumiMascot = KurumiMascot;
})(window);

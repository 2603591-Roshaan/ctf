# CyberAcademy — Interactive Cybersecurity Learning Platform
**Official Mascot & Academic Companion: Kurumi Tokisaki (Date A Live)**

A beginner-friendly, browser-based **Cybersecurity Educational Platform & Hands-on Academy** designed to teach offensive security concepts and defensive software engineering through structured courses, guided lessons, simulated sandbox labs, and an interactive anime mascot companion.

---

## 🕰️ Official Mascot & Companion: Kurumi Tokisaki

Similar to how TryHackMe features its green mascot across all stages of learning, **CyberAcademy** integrates **Kurumi Tokisaki** (*Date A Live*) as the recurring mascot and student mentor across the entire user experience.

### 1. Visual Traits & Aesthetic Consistency
- **Gothic Lolita Palette**: Deep reddish maroon (`#85122c`, `#c2274e`), gothic noir (`#14070a`), and warm parchment beige (`#f8f4ed`, `#dfbf8c`).
- **Signature Silhouette**: Uneven twin-tails (longer flowing right tail, pinned left tail), black and crimson ruffled ribbons.
- **Iconic Eyes**:
  - Right Eye: Deep crimson ruby iris with highlights.
  - Left Eye: Golden **Emperor Zaphkiel** clock face with Roman numeral ticks and moving mechanical hands.
- **Crisp Vector SVGs**: Fully resolution-independent vector illustrations built cleanly in vanilla SVG without heavy image assets.

### 2. Contextual Poses & Expressions
| Pose | Context Where Kurumi Appears | Emotional State |
| :--- | :--- | :--- |
| `welcoming` | Landing hero banner, navigation brand crest, lab check tab | Friendly, inviting mentor |
| `thinking` | Lesson concept & theory tab, security tip generator | Thoughtful hand to chin, clock hands tilted |
| `curious` | Course tracks advice, interactive lab exploration | Inspecting gears, tilted twin-tails |
| `detective` | Terminal playground briefing, remediation guide tab | Monocle over crimson eye, analyzing logs |
| `encouraging` | Instructor hint accordion toggle, beginner leaderboard | Warm wink, golden star sparkle |
| `celebrating` | Correct flag submission, course track completion, Valedictorian | Joyful smile, floating rose petals and confetti |
| `surprised` | Incorrect flag submission attempt | Surprised expression with sweatdrop, urging a retry |

### 3. Living Animations & Motion System
Kurumi is not a static graphic; she dynamically moves and animates to create an engaging anime companion experience:
- **Ticking Emperor Zaphkiel Clock**: The golden clock hands in her left eye continuously tick in real time via CSS rotation keyframes (`kurumiClockRotateLong` & `kurumiClockRotateShort`).
- **Natural Hair & Ribbon Sway**: Her signature uneven twin-tails and gothic ribbons flutter gently in an idle physics cycle (`kurumiTwintailRightSway`, `kurumiRibbonFlutter`).
- **Idle Breathing & Floating**: Avatar frames bob smoothly (`kurumiIdleBob` & `kurumiFloat`).
- **Dynamic Reactive Movements**:
  - `kurumiVictoryHop`: Jubilant hop and spin when a student successfully passes a lab or accomplishes a milestone.
  - `kurumiWobble`: Head tilt and sweatdrop wobble when an incorrect flag format is attempted.
  - `kurumiNod`: Reassuring affirming nod when a student transitions between guided phases or types in the terminal.

### 4. Interactive Process Guidance (Step-by-Step Walking Guide)
During every phase of the learning experience, Kurumi actively coaches the student through the learning process:
- **4-Stage Modal Process Stepper**:
  - `Step 1 of 4: Threat Concept` $\rightarrow$ Highlights core vulnerability theory.
  - `Step 2 of 4: Sandbox Exploit` $\rightarrow$ Guides the student through hands-on sandbox analysis.
  - `Step 3 of 4: Secure Defense` $\rightarrow$ Teaches how engineers patch the flaw in production code.
  - `Step 4 of 4: Flag Verification` $\rightarrow$ Formats and submits the proof token.
- **Interactive Step Navigation**: Students can click **"Next Step 🐾"** to move sequentially with Kurumi through the curriculum flow.
- **"Guide Me 💡" Contextual Coach**: Explains the exact mission objective for whatever tab the student is currently viewing.
- **"Highlight Sandbox 🎯" Attention Spotlight**: Smoothly scrolls and flashes a radiant golden/maroon pulse ring around the target sandbox, code block, or flag input.
- **Real-Time Shell Coaching**: When running Linux CLI commands in the sandbox terminal (`help`, `ls`, `cat`, `chmod`, `grep`), Kurumi offers immediate tips and feedback in real time.
- **Live Input Guidance**: As the student begins typing `flag{`, Kurumi provides instant encouragement and reminds them to close the brackets!

---

## 🎓 Educational Philosophy

Unlike traditional CTF platforms that simply present problems with no context, **CyberAcademy** is built around an educational four-pillar learning methodology:

1. **📖 Concept & Theory First**: Every lesson introduces the foundational computer science or security concept in plain English (e.g. why the browser is an untrusted environment, how symmetric encryption operates, or how databases interpret SQL syntax).
2. **🌍 Real-World Security Context**: Each module explores real-world breach case studies and explains *why* security professionals and software developers must understand this vulnerability.
3. **🧪 Guided Hands-on Lab Sandbox**: Students interact with simulated targets—including live SQL query visualizers, Wireshark packet capture streams, canvas contrast filters, and an in-browser Linux terminal.
4. **🛡️ Defensive Remediation & Secure Coding**: Students learn how developers and security engineers fix, mitigate, and prevent the flaw in real production code (e.g. prepared statements, HTTPS Everywhere, memory-hard password hashes, or least privilege).

---

## 📚 Structured Courses & Curriculum

| Module / Course | Topic Focus | Hands-on Labs Covered | Key Skills Acquired |
| :--- | :--- | :--- | :--- |
| **Module 1: Cyber Fundamentals** | Core security methodology & web architecture | Flag Anatomy, Base64 Encoding vs. Encryption, Inspecting DOM Comments, Reading HTTP Headers | Encodings, HTTP Request/Response, Browser DevTools |
| **Module 2: Web Application Security** | OWASP Top 10 vulnerabilities & client-side trust | Client-Side Password Checks, LocalStorage Tampering, `robots.txt` Directory Recon, SQL Injection Login Bypass, JWT `alg: "none"` Attacks | Front-End vs. Back-End Security, Prepared Statements, Secure Cookies, JWT Verification |
| **Module 3: OSINT & Threat Recon** | Gathering open-source intelligence | Landmark Geographic Triangulation, Git Commit History Auditing, Social Media Footprints & Security Questions, DNS TXT Records | Open-Source Intelligence, Version Control Security, MFA over Knowledge Questions, DNS Auditing |
| **Module 4: Cryptography & Hashes** | Classical ciphers, bitwise math & data integrity | Caesar & ROT13, Vigenère Polyalphabetic Ciphers, Single-Byte XOR Streams, Password Hash Dictionary Attacks | Symmetric Encryption, Known-Plaintext Attacks, One-Way Hashes, Salted Argon2id / bcrypt |
| **Module 5: Digital Forensics** | Incident investigation & artifact analysis | Extracting Printable Strings (`strings`), Steganography Contrast Analysis, Repairing PNG Magic Bytes, Sniffing Cleartext Traffic | Binary Inspection, Steganography, File Signatures, Network Packet Analysis with Wireshark |
| **Module 6: Linux CLI Essentials** | Command line system administration | Uncovering Hidden Dotfiles (`ls -la`), Managing File Permissions (`chmod`), Log Investigation with Pattern Matching (`grep`) | Linux Shell Navigation, Least Privilege (rwx), Authentication Log Analysis, Pattern Matching |

---

## 🌟 Interactive Features

- **Kurumi Tokisaki Mascot Component**: Modular `window.KurumiMascot` API providing vector SVG rendering, speech bubbles, card templates, and contextual advice.
- **4-Tab Guided Lesson Player**:
  - `📖 1. Concept & Theory`
  - `🧪 2. Guided Lab Sandbox`
  - `🛡️ 3. How to Defend & Remediate`
  - `🏁 4. Lab Check (Verify Completion Flag)`
- **Interactive Linux Terminal**: In-browser virtual bash shell running Ubuntu/Debian commands (`ls -la`, `cd`, `cat`, `grep`, `chmod`, `base64`, `history`, `clear`) with tab-completion and command history.
- **Offline Cyber Toolbelt**: Built-in decoder, encoder, hash generator, and automatic format identifier (Base64, Hex, Binary, ROT13, URL decode, SHA-256).
- **Gamified Learning XP & Student Skill Ranks**:
  - 🟢 **Cyber Cadet** (Level 1)
  - 🔵 **Security Apprentice** (Level 2)
  - 🟣 **Junior Security Analyst** (Level 3)
  - 🟡 **Cyber Defense Specialist** (Level 4)
  - 🔴 **Elite Security Engineer** (Level 5)
- **10 Verified Skill Badges & Certificates**: Automatic milestone tracking (*First Lesson Passed*, *Web Defender*, *OSINT Investigator*, *Certified Cryptanalyst*, etc.).
- **Automatic Progress Saving**: State is stored in `localStorage`, complete with JSON progress export and import.
- **Synthesized Audio & Confetti**: Web Audio API sound effects and particle confetti celebrating lab completions.

---

## 🚀 How to Run the Platform

### Method 1: Direct Double Click
Double-click `index.html` to open it immediately in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Brave).

### Method 2: Local Web Server
```powershell
python -m http.server 8000
```
Open `http://localhost:8000` in your browser.

---

## 📁 Code Organization

```
ctf/
├── index.html            # Main Single-Page Educational Application
├── README.md             # Documentation & Course Guide
│
├── css/
│   └── style.css         # Maroon & beige palette, Kurumi card styles, animations, responsive queries
│
└── js/
    ├── app.js            # State management, router, lesson tabs controller, XP engine, Kurumi companion hooks
    ├── mascot.js         # Kurumi Tokisaki mascot component (7 SVG poses, tips, floating widget)
    ├── challenges.js     # 24 guided lessons with concepts, real-world context, sandboxes, and defense rules
    ├── terminal.js       # In-browser virtual Linux CLI terminal engine
    ├── tools.js          # Offline Cyber Toolbelt (Base64, Hex, ROT13, URL, Hashes, Format Identifier)
    └── audio.js          # Synthesized Web Audio API sound effects
```

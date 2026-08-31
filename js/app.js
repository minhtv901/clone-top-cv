const app = document.getElementById("app");

const state = {
  route: "home",
  role: localStorage.getItem("jobflow_role") || null,
  loggedIn: localStorage.getItem("jobflow_logged_in") === "true",
  selectedRole: "candidate",
  authMode: "login",
  selectedJob: null,
  selectedCandidate: null,
  currentChat: 1,
  jobQuery: "",
  locationQuery: "",
  candidateQuery: ""
};

const getJobs = () => JSON.parse(localStorage.getItem("jobflow_jobs") || "[]");
const setJobs = (v) => localStorage.setItem("jobflow_jobs", JSON.stringify(v));
const getCandidates = () => JSON.parse(localStorage.getItem("jobflow_candidates") || "[]");
const setCandidates = (v) => localStorage.setItem("jobflow_candidates", JSON.stringify(v));
const getMessages = () => JSON.parse(localStorage.getItem("jobflow_messages") || "[]");
const setMessages = (v) => localStorage.setItem("jobflow_messages", JSON.stringify(v));
const getApplications = () => JSON.parse(localStorage.getItem("jobflow_applications") || "[]");
const setApplications = (v) => localStorage.setItem("jobflow_applications", JSON.stringify(v));

function esc(s="") {
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function statusMeta(status) {
  return {
    pending: ["Đang xem xét", "warning"],
    accepted: ["Đã chấp nhận", "success"],
    rejected: ["Đã từ chối", "danger"]
  }[status] || ["Đang xem xét", "warning"];
}
function toast(message, type="success") {
  const wrap = document.getElementById("toast-container");
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${type === "success" ? "✓" : type === "danger" ? "!" : "i"}</span><div>${esc(message)}</div>`;
  wrap.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 250);
  }, 2600);
}
function openModal(id) { document.getElementById(id)?.classList.add("show"); document.body.classList.add("modal-open"); }
function closeModal(id) { document.getElementById(id)?.classList.remove("show"); document.body.classList.remove("modal-open"); }

function setRoute(route) {
  const protectedCandidate = ["candidate-dashboard","applications","messages","profile"];
  const protectedEmployer = ["employer-dashboard","post-job","manage-jobs","applicants","company-profile"];
  if (protectedCandidate.includes(route) && (!state.loggedIn || state.role !== "candidate")) {
    state.selectedRole = "candidate"; openAuth("login"); return;
  }
  if (protectedEmployer.includes(route) && (!state.loggedIn || state.role !== "employer")) {
    state.selectedRole = "employer"; openAuth("login"); return;
  }
  state.route = route;
  window.scrollTo({top:0, behavior:"smooth"});
  render();
}

function openAuth(mode="login") {
  state.authMode = mode;
  const modal = document.getElementById("auth-modal");
  modal.querySelectorAll(".auth-tab").forEach(b => b.classList.toggle("active", b.dataset.authMode === mode));
  modal.querySelectorAll(".register-only").forEach(x => x.classList.toggle("hidden", mode !== "register"));
  modal.querySelector("#auth-title").textContent = mode === "login" ? "Chào mừng trở lại" : "Tạo tài khoản MoonWork";
  modal.querySelector("#auth-subtitle").textContent = mode === "login"
    ? "Chọn vai trò để vào đúng khu vực của bạn."
    : "Bắt đầu với vai trò phù hợp nhu cầu của bạn.";
  modal.querySelector("#auth-submit").textContent = mode === "login" ? "Đăng nhập" : "Đăng ký";
  modal.querySelectorAll(".role-card").forEach(b => b.classList.toggle("active", b.dataset.role === state.selectedRole));
  openModal("auth-modal");
}

function updateNavigation() {
  const actions = document.getElementById("nav-actions");
  if (!state.loggedIn) {
    actions.innerHTML = `<button class="btn btn-ghost" id="open-login">Đăng nhập</button><button class="btn btn-primary" id="open-register">Đăng ký</button>`;
  } else {
    const label = state.role === "candidate" ? "Nguyễn Văn A" : "Nova Game Studio";
    const route = state.role === "candidate" ? "candidate-dashboard" : "employer-dashboard";
    actions.innerHTML = `
      <button class="user-chip" data-route="${route}">
        <span class="avatar-sm">${state.role === "candidate" ? "NA" : "NG"}</span>
        <span>${label}</span>
      </button>
      <button class="btn btn-ghost btn-sm" id="logout-btn">Đăng xuất</button>`;
  }
  document.querySelectorAll(".nav-link").forEach(b => {
    b.classList.toggle("active", b.dataset.route === state.route || (state.route === "home" && b.dataset.route === "home"));
  });
}

function jobCard(job) {
  return `
    <article class="job-card" data-open-job="${job.id}">
      <div class="job-logo">${esc(job.logo)}</div>
      <div class="job-main">
        <div class="job-topline">
          <div>
            <h3>${esc(job.title)}</h3>
            <p>${esc(job.company)}</p>
          </div>
          ${job.hot ? '<span class="hot-badge">HOT</span>' : ''}
        </div>
        <div class="job-meta">
          <span>💰 ${esc(job.salary)}</span>
          <span>📍 ${esc(job.location)}</span>
          <span>🕒 ${esc(job.type)}</span>
        </div>
        <div class="job-footer">
          <div class="tag-row">${job.skills.slice(0,3).map(s => `<span class="tag">${esc(s)}</span>`).join("")}</div>
          <span class="job-posted">${esc(job.posted)}</span>
        </div>
      </div>
      <button class="bookmark-btn" title="Lưu việc">♡</button>
    </article>`;
}

function renderHome() {
  const jobs = getJobs().slice(0, 4);
  return `
  <section class="hero moon-hero">
    <div class="moon-stars" aria-hidden="true">
      <i style="--x:7%;--y:18%;--s:2px;--d:0s"></i>
      <i style="--x:17%;--y:70%;--s:3px;--d:1.8s"></i>
      <i style="--x:29%;--y:12%;--s:2px;--d:.8s"></i>
      <i style="--x:44%;--y:79%;--s:2px;--d:2.4s"></i>
      <i style="--x:58%;--y:15%;--s:3px;--d:1.2s"></i>
      <i style="--x:68%;--y:66%;--s:2px;--d:3s"></i>
      <i style="--x:79%;--y:10%;--s:2px;--d:2.1s"></i>
      <i style="--x:91%;--y:30%;--s:3px;--d:.4s"></i>
      <i style="--x:95%;--y:76%;--s:2px;--d:1.5s"></i>
      <i style="--x:52%;--y:48%;--s:2px;--d:3.2s"></i>
    </div>

    <div class="container hero-grid">
      <div class="hero-copy">
        <div class="eyebrow moon-eyebrow"><span>✦</span> MOONWORK — TÌM ĐÚNG CÔNG VIỆC</div>
        <h1>Chạm tới công việc<br/><span>xứng đáng với bạn.</span></h1>
        <p>Khám phá cơ hội mới, tạo CV đẹp và kết nối trực tiếp với nhà tuyển dụng trong một không gian nhẹ nhàng, trực quan.</p>

        <div class="search-hero moon-search">
          <div class="input-icon"><span>⌕</span><input id="home-job-query" placeholder="Vị trí, kỹ năng hoặc công ty..." /></div>
          <div class="input-icon location"><span>⌖</span><input id="home-location-query" placeholder="Địa điểm" /></div>
          <button class="btn btn-primary" id="home-search-btn">Tìm việc</button>
        </div>

        <div class="popular-search moon-popular">
          <span>Đang được tìm:</span>
          <button data-search-key="Unity">Unity</button>
          <button data-search-key="Frontend">Frontend</button>
          <button data-search-key="UI/UX">UI/UX</button>
          <button data-search-key="Marketing">Marketing</button>
        </div>

        <div class="hero-stats moon-stats">
          <div><b>1.2K+</b><span>Việc làm mới</span></div>
          <div><b>650+</b><span>Doanh nghiệp</span></div>
          <div><b>8.5K+</b><span>Ứng viên</span></div>
        </div>
      </div>

      <div class="hero-art moon-art poetic-moon-art" aria-label="Một cậu bé ngồi trên vầng trăng lưỡi liềm và câu một cơ hội việc làm">
        <div class="poetic-sky-glow"></div>
        <div class="poetic-cloud cloud-one"></div>
        <div class="poetic-cloud cloud-two"></div>

        <div class="poetic-crescent">
          <div class="moon-texture moon-texture-a"></div>
          <div class="moon-texture moon-texture-b"></div>
          <div class="moon-texture moon-texture-c"></div>
        </div>

        <div class="poetic-child">
          <svg class="poetic-boy-svg" viewBox="0 0 240 180" aria-hidden="true">
            <defs>
              <linearGradient id="boySkin2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#FFF8F4"/>
                <stop offset="70%" stop-color="#F1D9CF"/>
                <stop offset="100%" stop-color="#DDBCB1"/>
              </linearGradient>

              <linearGradient id="boyWhite2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#FFFFFF"/>
                <stop offset="62%" stop-color="#EDF2FF"/>
                <stop offset="100%" stop-color="#CCD7F5"/>
              </linearGradient>

              <linearGradient id="boyWhiteShadow2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#F2F6FF"/>
                <stop offset="100%" stop-color="#B9C8F0"/>
              </linearGradient>

              <linearGradient id="boyHair2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#131A36"/>
                <stop offset="60%" stop-color="#222B57"/>
                <stop offset="100%" stop-color="#38437C"/>
              </linearGradient>

              <filter id="boySoftGlow2" x="-35%" y="-35%" width="170%" height="170%">
                <feGaussianBlur stdDeviation="1.8" result="b"/>
                <feMerge>
                  <feMergeNode in="b"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <!-- soft contact shadow: makes him visibly sit on the moon -->
            <ellipse cx="100" cy="136" rx="48" ry="10"
                     fill="rgba(63,79,154,.12)"
                     transform="rotate(-7 100 136)"/>

            <!-- BACK LEG: bent naturally, cooler because it is farther away -->
            <path d="M102 104
                     C114 111 121 121 119 132
                     C117 143 108 150 103 157"
                  fill="none"
                  stroke="url(#boyWhiteShadow2)"
                  stroke-width="12"
                  stroke-linecap="round"
                  stroke-linejoin="round"/>

            <!-- back shoe -->
            <path d="M91 156
                     C97 153 107 154 113 158
                     C115 161 112 165 107 166
                     C101 167 94 165 89 162
                     C88 160 89 158 91 156 Z"
                  fill="#1C2445"/>

            <!-- FRONT LEG: thigh forward, shin drops down -->
            <path d="M111 105
                     C126 114 132 124 131 136
                     C130 146 135 153 142 159"
                  fill="none"
                  stroke="url(#boySkin2)"
                  stroke-width="12"
                  stroke-linecap="round"
                  stroke-linejoin="round"/>

            <!-- front shoe -->
            <path d="M136 157
                     C143 156 153 159 158 163
                     C159 166 156 169 150 169
                     C144 169 138 167 134 164
                     C133 161 134 159 136 157 Z"
                  fill="#192141"/>

            <!-- shorts / seated hip -->
            <path d="M82 92
                     C92 87 107 88 119 96
                     C121 103 118 111 112 116
                     C99 119 86 116 77 109
                     C76 103 78 97 82 92 Z"
                  fill="url(#boyWhite2)"/>

            <!-- torso, intentionally leaning backward -->
            <path d="M67 58
                     C77 50 91 50 102 57
                     C111 66 116 79 116 91
                     C110 99 99 104 86 103
                     C75 100 66 94 61 86
                     C60 75 62 65 67 58 Z"
                  fill="url(#boyWhite2)"
                  filter="url(#boySoftGlow2)"/>

            <!-- subtle shirt lower shadow -->
            <path d="M66 89
                     C79 96 97 99 113 92
                     C111 99 104 104 91 105
                     C80 104 71 99 66 94 Z"
                  fill="rgba(143,161,220,.10)"/>

            <!-- rear arm: both hands now go toward the fishing rod -->
            <path d="M91 67
                     C103 76 115 86 132 91"
                  fill="none"
                  stroke="#EACFC7"
                  stroke-width="8"
                  stroke-linecap="round"/>

            <!-- front arm -->
            <path d="M103 65
                     C116 74 128 84 145 90"
                  fill="none"
                  stroke="url(#boySkin2)"
                  stroke-width="9"
                  stroke-linecap="round"/>

            <!-- hands -->
            <circle cx="133" cy="91" r="4.6" fill="#E7C9BF"/>
            <circle cx="146" cy="90" r="5.1" fill="#F0D7CE"/>

            <!-- neck -->
            <path d="M76 54 L77 66
                     C81 69 87 68 90 64
                     L88 52 Z"
                  fill="url(#boySkin2)"/>

            <!-- face in right-facing profile, smaller and rounder -->
            <path d="M48 35
                     C50 19 65 10 81 13
                     C94 15 104 25 104 38
                     C104 43 108 45 106 49
                     C104 53 99 54 95 54
                     C90 60 80 62 70 59
                     C56 56 47 48 48 35 Z"
                  fill="url(#boySkin2)"
                  filter="url(#boySoftGlow2)"/>

            <!-- round dark hair like the reference image -->
            <path d="M47 35
                     C45 24 50 14 60 8
                     C69 2 82 3 91 8
                     C99 12 104 19 105 28
                     C97 23 89 22 83 25
                     C77 28 74 34 75 41
                     C66 42 56 40 49 36 Z"
                  fill="url(#boyHair2)"/>

            <!-- soft back hair volume -->
            <path d="M47 31
                     C43 38 46 49 54 54
                     C61 59 70 59 76 56
                     C67 52 63 46 64 39
                     C57 39 51 36 47 31 Z"
                  fill="#202957"
                  opacity=".95"/>

            <!-- tiny poetic cowlick -->
            <path d="M58 10
                     C51 5 56 -1 63 2
                     C66 4 65 7 62 8"
                  fill="none"
                  stroke="#1A234A"
                  stroke-width="4"
                  stroke-linecap="round"/>

            <!-- ear -->
            <circle cx="75" cy="39" r="5.2" fill="#EED4CB"/>

            <!-- eye -->
            <circle cx="97" cy="35" r="1.7" fill="#4E536C"/>

            <!-- tiny nose -->
            <path d="M102 39
                     C107 40 108 43 103 44"
                  fill="none"
                  stroke="#C99E91"
                  stroke-width="1.4"
                  stroke-linecap="round"/>

            <!-- tiny mouth -->
            <path d="M99 48 C101 49 103 49 104 48"
                  fill="none"
                  stroke="#BD928B"
                  stroke-width="1"
                  stroke-linecap="round"
                  opacity=".75"/>

            <!-- subtle cheek -->
            <ellipse cx="94" cy="44" rx="5" ry="2.5"
                     fill="#E9AFA7"
                     opacity=".14"/>

            <!-- shirt seam -->
            <path d="M69 67
                     C80 72 94 72 106 67"
                  fill="none"
                  stroke="rgba(139,156,218,.18)"
                  stroke-width="1.5"
                  stroke-linecap="round"/>

            <!-- fishing rod: longer and more elegant, angled upward like reference -->
            <path d="M143 90
                     L235 58"
                  fill="none"
                  stroke="#C7D3FF"
                  stroke-width="1.65"
                  stroke-linecap="round"/>

            <!-- rod highlight -->
            <path d="M150 87 L231 59"
                  fill="none"
                  stroke="rgba(255,255,255,.38)"
                  stroke-width=".55"
                  stroke-linecap="round"/>
          </svg>

          <div class="poetic-line-wrap">
            <div class="poetic-line"></div>
            <div class="poetic-job-tag">
              <small>MOONWORK</small>
              <b>Dream Job</b>
              <span>Unity Developer</span>
            </div>
          </div>
        </div>
      </div>

      <div class="poetic-star star-a"></div>
        <div class="poetic-star star-b"></div>
        <div class="poetic-star star-c"></div>
        <div class="poetic-star star-d"></div>
      </div>
    </div>
  </div>
  <div class="hero-bottom-fade"></div>
  </section>

  <section class="section moon-section">
    <div class="container">
      <div class="section-head">
        <div><span class="eyebrow">CƠ HỘI NỔI BẬT</span><h2>Việc làm đáng để bạn ngắm tới</h2><p class="section-subtitle">Một vài vị trí nổi bật được chọn từ MoonWork.</p></div>
        <button class="text-arrow" data-route="jobs">Khám phá tất cả →</button>
      </div>
      <div class="job-grid">${jobs.map(jobCard).join("")}</div>
    </div>
  </section>

  <section class="section alt moon-role-section">
    <div class="container role-feature-grid">
      <div class="feature-card candidate-feature moon-feature-dark">
        <div class="feature-orbit"></div>
        <div class="feature-icon">☾</div>
        <span class="eyebrow">DÀNH CHO ỨNG VIÊN</span>
        <h2>Mỗi CV là một bước gần hơn tới công việc phù hợp.</h2>
        <p>Tạo CV trực quan, tìm việc theo kỹ năng và theo dõi trạng thái hồ sơ ngay trong một nơi.</p>
        <div class="feature-list"><span>✓ CV Builder trực quan</span><span>✓ Ứng tuyển chỉ vài giây</span><span>✓ Chat với nhà tuyển dụng</span></div>
        <button class="btn btn-moonlight" data-route="cv">Tạo CV ngay</button>
      </div>
      <div class="feature-card employer-feature moon-feature-light">
        <div class="feature-icon">✦</div>
        <span class="eyebrow">DÀNH CHO NHÀ TUYỂN DỤNG</span>
        <h2>Tìm đúng người, không cần lạc giữa hàng trăm hồ sơ.</h2>
        <p>Đăng tin, xem hồ sơ, lọc ứng viên và quyết định chấp nhận hoặc từ chối trên cùng một dashboard.</p>
        <div class="feature-list"><span>✓ Đăng & quản lý tin</span><span>✓ Xem hồ sơ ứng viên</span><span>✓ Accept / Reject nhanh</span></div>
        <button class="btn btn-primary" data-route="employer-dashboard">Khu vực tuyển dụng</button>
      </div>
    </div>
  </section>`;
}

function renderJobs() {
  const jobs = getJobs().filter(job => {
    const q = state.jobQuery.toLowerCase();
    const loc = state.locationQuery.toLowerCase();
    const searchable = `${job.title} ${job.company} ${job.skills.join(" ")} ${job.category}`.toLowerCase();
    return (!q || searchable.includes(q)) && (!loc || job.location.toLowerCase().includes(loc));
  });
  return `
    <section class="page-hero compact">
      <div class="container">
        <span class="eyebrow">TÌM CƠ HỘI MỚI</span>
        <h1>Khám phá việc làm phù hợp</h1>
        <div class="search-hero search-page">
          <div class="input-icon"><span>⌕</span><input id="jobs-query" value="${esc(state.jobQuery)}" placeholder="Vị trí, kỹ năng hoặc công ty..." /></div>
          <div class="input-icon location"><span>⌖</span><input id="jobs-location" value="${esc(state.locationQuery)}" placeholder="Địa điểm" /></div>
          <button class="btn btn-primary" id="jobs-search-btn">Tìm kiếm</button>
        </div>
      </div>
    </section>
    <section class="section jobs-page">
      <div class="container jobs-layout">
        <aside class="filter-card">
          <div class="filter-title"><b>Bộ lọc</b><button id="clear-filter">Xóa lọc</button></div>
          <div class="filter-block">
            <label>Ngành nghề</label>
            <label class="check-row"><input type="checkbox" /> IT / Software <span>128</span></label>
            <label class="check-row"><input type="checkbox" /> Game <span>46</span></label>
            <label class="check-row"><input type="checkbox" /> Design <span>32</span></label>
            <label class="check-row"><input type="checkbox" /> Marketing <span>55</span></label>
          </div>
          <div class="filter-block">
            <label>Kinh nghiệm</label>
            <select><option>Tất cả</option><option>Fresher</option><option>1 - 2 năm</option><option>2 - 3 năm</option></select>
          </div>
          <div class="filter-block">
            <label>Mức lương</label>
            <select><option>Tất cả</option><option>10 - 15 triệu</option><option>15 - 25 triệu</option><option>Trên 25 triệu</option></select>
          </div>
          <div class="filter-block">
            <label>Hình thức</label>
            <select><option>Tất cả</option><option>Full-time</option><option>Hybrid</option><option>Remote</option></select>
          </div>
        </aside>
        <div>
          <div class="result-head"><div><h2>${jobs.length} việc làm</h2><p>Gợi ý theo tiêu chí của bạn</p></div><select><option>Mới nhất</option><option>Lương cao nhất</option><option>Phù hợp nhất</option></select></div>
          <div class="job-list">${jobs.length ? jobs.map(jobCard).join("") : `<div class="empty-card"><div>⌕</div><h3>Không tìm thấy công việc</h3><p>Thử từ khóa hoặc địa điểm khác nhé.</p></div>`}</div>
        </div>
      </div>
    </section>`;
}

function renderCompanies() {
  const groups = {};
  getJobs().forEach(j => {
    if (!groups[j.company]) groups[j.company] = {...j, count:0};
    groups[j.company].count++;
  });
  return `
  <section class="page-hero compact">
    <div class="container">
      <span class="eyebrow">DOANH NGHIỆP</span>
      <h1>Khám phá công ty nổi bật</h1>
      <p>Tìm hiểu môi trường làm việc và các vị trí đang tuyển.</p>
    </div>
  </section>
  <section class="section"><div class="container company-grid">
    ${Object.values(groups).map(c=>`
      <article class="company-card">
        <div class="company-cover"><span>${esc(c.logo)}</span></div>
        <div class="company-card-body">
          <h3>${esc(c.company)}</h3>
          <p>${esc(c.companyDesc)}</p>
          <div class="company-meta"><span>📍 ${esc(c.location)}</span><span>${c.count} vị trí đang tuyển</span></div>
          <button class="btn btn-soft" data-company="${esc(c.company)}">Xem việc làm</button>
        </div>
      </article>`).join("")}
  </div></section>`;
}

function renderCV() {
  return `
  <section class="cv-page">
    <div class="cv-toolbar">
      <div class="container cv-toolbar-inner">
        <div><span class="eyebrow">CV BUILDER</span><h2>CV Game Developer</h2></div>
        <div class="toolbar-actions"><button class="btn btn-ghost" id="reset-cv">Làm mới</button><button class="btn btn-primary" id="save-cv">Lưu CV</button></div>
      </div>
    </div>
    <div class="container cv-builder">
      <aside class="cv-editor">
        <div class="editor-section"><h3>Thông tin cá nhân</h3>
          <div class="form-grid">
            <div class="form-group"><label>Họ tên</label><input class="cv-input" data-cv="name" value="Nguyễn Văn A" /></div>
            <div class="form-group"><label>Vị trí</label><input class="cv-input" data-cv="title" value="Game Developer" /></div>
            <div class="form-group"><label>Email</label><input class="cv-input" data-cv="email" value="nguyenvana@gmail.com" /></div>
            <div class="form-group"><label>Số điện thoại</label><input class="cv-input" data-cv="phone" value="0901 234 567" /></div>
            <div class="form-group full"><label>Địa điểm</label><input class="cv-input" data-cv="location" value="Hà Nội, Việt Nam" /></div>
          </div>
        </div>
        <div class="editor-section"><h3>Giới thiệu</h3><textarea class="cv-input" data-cv="about">Game Developer yêu thích xây dựng gameplay, hệ thống chiến đấu và trải nghiệm người chơi bằng Unity.</textarea></div>
        <div class="editor-section"><h3>Kỹ năng</h3><input class="cv-input" data-cv="skills" value="Unity, C#, Git, OOP, 2D Game" /><small>Phân cách kỹ năng bằng dấu phẩy.</small></div>
        <div class="editor-section"><h3>Kinh nghiệm</h3>
          <div class="form-group"><label>Công ty</label><input class="cv-input" data-cv="company" value="ABC Game Studio" /></div>
          <div class="form-group"><label>Vị trí / thời gian</label><input class="cv-input" data-cv="experience" value="Game Developer Intern • 2025 - 2026" /></div>
          <div class="form-group"><label>Mô tả</label><textarea class="cv-input" data-cv="experienceDesc">Phát triển gameplay 2D, xử lý bug và phối hợp cùng team design để hoàn thiện các tính năng.</textarea></div>
        </div>
        <div class="editor-section"><h3>Học vấn</h3><input class="cv-input" data-cv="education" value="FPT Polytechnic • Lập trình Game • 2023 - 2026" /></div>
      </aside>
      <div class="cv-preview-wrap">
        <div class="preview-note">Xem trước trực tiếp</div>
        <article class="cv-paper" id="cv-preview">
          <header class="cv-head">
            <div class="cv-avatar">NA</div>
            <div><h1 data-preview="name">Nguyễn Văn A</h1><h2 data-preview="title">Game Developer</h2></div>
          </header>
          <div class="cv-contact"><span>✉ <i data-preview="email">nguyenvana@gmail.com</i></span><span>☎ <i data-preview="phone">0901 234 567</i></span><span>⌖ <i data-preview="location">Hà Nội, Việt Nam</i></span></div>
          <section><h3>GIỚI THIỆU</h3><p data-preview="about">Game Developer yêu thích xây dựng gameplay, hệ thống chiến đấu và trải nghiệm người chơi bằng Unity.</p></section>
          <section><h3>KỸ NĂNG</h3><div class="cv-skills" data-preview="skills"></div></section>
          <section><h3>KINH NGHIỆM</h3><div class="cv-entry"><b data-preview="company">ABC Game Studio</b><span data-preview="experience">Game Developer Intern • 2025 - 2026</span><p data-preview="experienceDesc">Phát triển gameplay 2D, xử lý bug và phối hợp cùng team design để hoàn thiện các tính năng.</p></div></section>
          <section><h3>HỌC VẤN</h3><div class="cv-entry"><b data-preview="education">FPT Polytechnic • Lập trình Game • 2023 - 2026</b></div></section>
        </article>
      </div>
    </div>
  </section>`;
}

function candidateSidebar(active) {
  const items = [
    ["candidate-dashboard","▦","Tổng quan"],
    ["jobs","⌕","Tìm việc"],
    ["cv","▤","CV của tôi"],
    ["applications","✓","Việc đã ứng tuyển"],
    ["messages","✉","Tin nhắn"],
    ["profile","○","Hồ sơ cá nhân"]
  ];
  return `<aside class="dashboard-sidebar">
    <div class="profile-mini"><div class="avatar-lg">NA</div><div><b>Nguyễn Văn A</b><span>Game Developer</span></div></div>
    <nav>${items.map(i=>`<button class="${active===i[0]?"active":""}" data-route="${i[0]}"><i>${i[1]}</i>${i[2]}</button>`).join("")}</nav>
  </aside>`;
}

function employerSidebar(active) {
  const items = [
    ["employer-dashboard","▦","Tổng quan"],
    ["post-job","+","Đăng tin tuyển dụng"],
    ["manage-jobs","▤","Quản lý tin"],
    ["applicants","◎","Ứng viên"],
    ["messages","✉","Tin nhắn"],
    ["company-profile","○","Thông tin công ty"]
  ];
  return `<aside class="dashboard-sidebar employer-side">
    <div class="profile-mini"><div class="avatar-lg company-avatar">NG</div><div><b>Nova Game Studio</b><span>Nhà tuyển dụng</span></div></div>
    <nav>${items.map(i=>`<button class="${active===i[0]?"active":""}" data-route="${i[0]}"><i>${i[1]}</i>${i[2]}</button>`).join("")}</nav>
  </aside>`;
}

function renderCandidateDashboard() {
  const apps = getApplications();
  const jobs = getJobs().slice(0,3);
  return `<section class="dashboard-page"><div class="container dashboard-grid">
    ${candidateSidebar("candidate-dashboard")}
    <div class="dashboard-content">
      <div class="welcome-card"><div><span class="eyebrow">CANDIDATE DASHBOARD</span><h1>Xin chào, Nguyễn Văn A 👋</h1><p>Hôm nay có <b>6 công việc mới</b> phù hợp với hồ sơ của bạn.</p></div><div class="profile-progress"><div class="progress-ring"><span>82%</span></div><div><b>Hồ sơ khá tốt</b><span>Hoàn thiện thêm để tăng cơ hội</span></div></div></div>
      <div class="stats-grid">
        <div class="stat-card"><span class="stat-icon">▤</span><div><b>${apps.length}</b><span>Đã ứng tuyển</span></div></div>
        <div class="stat-card"><span class="stat-icon">♡</span><div><b>7</b><span>Việc đã lưu</span></div></div>
        <div class="stat-card"><span class="stat-icon">✓</span><div><b>${apps.filter(a=>a.status==="accepted").length}</b><span>Được chấp nhận</span></div></div>
        <div class="stat-card"><span class="stat-icon">✉</span><div><b>2</b><span>Tin nhắn mới</span></div></div>
      </div>
      <div class="dash-section"><div class="section-head mini"><div><h2>Việc làm phù hợp với bạn</h2><p>Dựa trên kỹ năng và hồ sơ hiện tại</p></div><button class="text-arrow" data-route="jobs">Xem tất cả →</button></div><div class="job-list compact-list">${jobs.map(jobCard).join("")}</div></div>
    </div>
  </div></section>`;
}

function renderApplications() {
  const jobs = getJobs(); const apps = getApplications();
  return `<section class="dashboard-page"><div class="container dashboard-grid">
    ${candidateSidebar("applications")}
    <div class="dashboard-content">
      <div class="dash-title"><span class="eyebrow">APPLICATIONS</span><h1>Việc đã ứng tuyển</h1><p>Theo dõi trạng thái hồ sơ của bạn.</p></div>
      <div class="table-card">
        <div class="table-toolbar"><div class="search-small">⌕ <input placeholder="Tìm theo vị trí hoặc công ty..." /></div><select><option>Tất cả trạng thái</option><option>Đang xem xét</option><option>Đã chấp nhận</option><option>Đã từ chối</option></select></div>
        <div class="responsive-table">
          <table><thead><tr><th>Vị trí</th><th>Ngày ứng tuyển</th><th>Trạng thái</th><th></th></tr></thead><tbody>
          ${apps.map(a=>{ const j=jobs.find(x=>x.id===a.jobId) || {title:"Tin tuyển dụng", company:"Doanh nghiệp", logo:"JF"}; const [txt,cls]=statusMeta(a.status); return `<tr><td><div class="table-job"><span class="mini-logo">${esc(j.logo)}</span><div><b>${esc(j.title)}</b><span>${esc(j.company)}</span></div></div></td><td>${esc(a.date)}</td><td><span class="status ${cls}">${txt}</span></td><td><button class="icon-btn" data-open-job="${j.id}">→</button></td></tr>`}).join("")}
          </tbody></table>
        </div>
      </div>
    </div>
  </div></section>`;
}

function renderMessages() {
  const messages = getMessages();
  const current = messages.find(m=>m.id===state.currentChat) || messages[0];
  const side = state.role === "employer" ? employerSidebar("messages") : candidateSidebar("messages");
  return `<section class="dashboard-page"><div class="container dashboard-grid">
    ${side}
    <div class="dashboard-content">
      <div class="dash-title"><span class="eyebrow">MESSAGES</span><h1>Trò chuyện</h1><p>Liên hệ trực tiếp giữa ứng viên và nhà tuyển dụng.</p></div>
      <div class="chat-shell">
        <aside class="chat-list">
          <div class="chat-search">⌕ <input id="chat-search" placeholder="Tìm cuộc trò chuyện..." /></div>
          ${messages.map(m=>`<button class="chat-person ${m.id===current.id?"active":""}" data-chat-id="${m.id}"><span class="avatar-md">${esc(m.avatar)}</span><div><b>${esc(m.person)}</b><span>${esc(m.last)}</span></div><small>${esc(m.time)}</small>${m.unread?`<i>${m.unread}</i>`:""}</button>`).join("")}
        </aside>
        <div class="chat-panel">
          <header><div class="chat-user"><span class="avatar-md">${esc(current.avatar)}</span><div><b>${esc(current.person)}</b><span><i class="online-dot"></i> Đang hoạt động</span></div></div><button class="icon-btn">⋮</button></header>
          <div class="chat-messages" id="chat-messages">
            <div class="date-sep">Hôm nay</div>
            ${current.messages.map(x=>`<div class="bubble-row ${x.from==="me"?"me":""}"><div class="bubble">${esc(x.text)}<small>${esc(x.time)}</small></div></div>`).join("")}
          </div>
          <form class="chat-compose" id="chat-form"><button type="button">＋</button><input id="chat-input" placeholder="Nhập tin nhắn..." autocomplete="off"/><button class="send-btn" type="submit">➤</button></form>
        </div>
      </div>
    </div>
  </div></section>`;
}

function renderProfile() {
  return `<section class="dashboard-page"><div class="container dashboard-grid">${candidateSidebar("profile")}
    <div class="dashboard-content"><div class="dash-title"><span class="eyebrow">PROFILE</span><h1>Hồ sơ cá nhân</h1><p>Thông tin được gửi kèm khi bạn ứng tuyển.</p></div>
      <div class="profile-card">
        <div class="profile-cover"></div>
        <div class="profile-header"><div class="avatar-xl">NA</div><div><h2>Nguyễn Văn A</h2><p>Game Developer</p></div><button class="btn btn-soft">Đổi ảnh</button></div>
        <div class="profile-form-grid">
          <div class="form-group"><label>Họ và tên</label><input value="Nguyễn Văn A"></div>
          <div class="form-group"><label>Email</label><input value="nguyenvana@gmail.com"></div>
          <div class="form-group"><label>Số điện thoại</label><input value="0901 234 567"></div>
          <div class="form-group"><label>Địa điểm</label><input value="Hà Nội"></div>
          <div class="form-group full"><label>Giới thiệu</label><textarea>Game Developer yêu thích Unity, gameplay systems và các sản phẩm có trải nghiệm người dùng tốt.</textarea></div>
          <div class="form-group full"><label>Kỹ năng</label><input value="Unity, C#, Git, OOP, 2D Game"></div>
        </div>
        <div class="form-actions"><button class="btn btn-primary" id="save-profile">Lưu thay đổi</button></div>
      </div>
    </div></div></section>`;
}

function renderEmployerDashboard() {
  const candidates = getCandidates(); const jobs = getJobs();
  return `<section class="dashboard-page"><div class="container dashboard-grid">
    ${employerSidebar("employer-dashboard")}
    <div class="dashboard-content">
      <div class="welcome-card employer-welcome"><div><span class="eyebrow">EMPLOYER DASHBOARD</span><h1>Nova Game Studio</h1><p>Quản lý tuyển dụng và theo dõi ứng viên trong một giao diện.</p></div><button class="btn btn-primary" data-route="post-job">＋ Đăng tin mới</button></div>
      <div class="stats-grid">
        <div class="stat-card"><span class="stat-icon">▤</span><div><b>${jobs.length}</b><span>Tin đang tuyển</span></div></div>
        <div class="stat-card"><span class="stat-icon">◎</span><div><b>${candidates.length}</b><span>Tổng ứng viên</span></div></div>
        <div class="stat-card"><span class="stat-icon">◔</span><div><b>${candidates.filter(c=>c.status==="pending").length}</b><span>Chờ xử lý</span></div></div>
        <div class="stat-card"><span class="stat-icon">✓</span><div><b>${candidates.filter(c=>c.status==="accepted").length}</b><span>Đã chấp nhận</span></div></div>
      </div>
      <div class="dashboard-split">
        <div class="dash-section table-card no-pad">
          <div class="section-head mini padded"><div><h2>Ứng viên gần đây</h2><p>Hồ sơ vừa gửi đến</p></div><button class="text-arrow" data-route="applicants">Xem tất cả →</button></div>
          <div class="candidate-mini-list">${candidates.slice(0,4).map(c=>{const [t,cl]=statusMeta(c.status); return `<button data-open-candidate="${c.id}"><span class="avatar-md">${esc(c.avatar)}</span><div><b>${esc(c.name)}</b><span>${esc(c.title)} • ${esc(c.experience)}</span></div><span class="status ${cl}">${t}</span></button>`}).join("")}</div>
        </div>
        <div class="analytics-card">
          <div class="section-head mini"><div><h2>Hiệu quả tuyển dụng</h2><p>7 ngày gần nhất</p></div></div>
          <div class="analytics-number"><b>48</b><span>lượt ứng tuyển</span><i>+18%</i></div>
          <div class="bar-chart"><span style="height:40%"></span><span style="height:55%"></span><span style="height:48%"></span><span style="height:80%"></span><span style="height:65%"></span><span style="height:90%"></span><span style="height:78%"></span></div>
          <div class="chart-labels"><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span></div>
        </div>
      </div>
    </div>
  </div></section>`;
}

function renderPostJob() {
  return `<section class="dashboard-page"><div class="container dashboard-grid">
    ${employerSidebar("post-job")}
    <div class="dashboard-content">
      <div class="dash-title"><span class="eyebrow">CREATE JOB</span><h1>Đăng tin tuyển dụng</h1><p>Tạo một tin tuyển dụng mới cho doanh nghiệp.</p></div>
      <form class="post-job-form" id="post-job-form">
        <div class="form-card"><h3>Thông tin cơ bản</h3><div class="form-grid">
          <div class="form-group full"><label>Tên vị trí *</label><input name="title" placeholder="VD: Unity Game Developer" required></div>
          <div class="form-group"><label>Địa điểm *</label><input name="location" placeholder="Hà Nội" required></div>
          <div class="form-group"><label>Mức lương *</label><input name="salary" placeholder="15 - 25 triệu" required></div>
          <div class="form-group"><label>Kinh nghiệm</label><select name="experience"><option>Fresher</option><option selected>1 - 2 năm</option><option>2 - 3 năm</option><option>Trên 3 năm</option></select></div>
          <div class="form-group"><label>Hình thức</label><select name="type"><option>Full-time</option><option>Part-time</option><option>Hybrid</option><option>Remote</option></select></div>
          <div class="form-group full"><label>Kỹ năng</label><input name="skills" placeholder="Unity, C#, Git"></div>
        </div></div>
        <div class="form-card"><h3>Nội dung tuyển dụng</h3>
          <div class="form-group"><label>Mô tả công việc</label><textarea name="description" placeholder="Mô tả nhiệm vụ chính..."></textarea></div>
          <div class="form-group"><label>Yêu cầu</label><textarea name="requirements" placeholder="Mỗi yêu cầu cách nhau bằng dấu chấm phẩy..."></textarea></div>
          <div class="form-group"><label>Quyền lợi</label><textarea name="benefits" placeholder="Mỗi quyền lợi cách nhau bằng dấu chấm phẩy..."></textarea></div>
        </div>
        <div class="form-actions sticky-actions"><button type="button" class="btn btn-ghost">Lưu nháp</button><button type="submit" class="btn btn-primary">Đăng tin tuyển dụng</button></div>
      </form>
    </div>
  </div></section>`;
}

function renderManageJobs() {
  const jobs = getJobs();
  return `<section class="dashboard-page"><div class="container dashboard-grid">${employerSidebar("manage-jobs")}
    <div class="dashboard-content">
      <div class="dash-title row-title"><div><span class="eyebrow">JOB MANAGEMENT</span><h1>Quản lý tin tuyển dụng</h1><p>Theo dõi và quản lý các vị trí đang tuyển.</p></div><button class="btn btn-primary" data-route="post-job">＋ Đăng tin mới</button></div>
      <div class="table-card"><div class="table-toolbar"><div class="search-small">⌕ <input placeholder="Tìm tin tuyển dụng..."></div><select><option>Tất cả trạng thái</option><option>Đang tuyển</option><option>Đã đóng</option></select></div>
      <div class="responsive-table"><table><thead><tr><th>Vị trí</th><th>Ứng viên</th><th>Đăng lúc</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>
      ${jobs.map(j=>`<tr><td><div><b>${esc(j.title)}</b><span class="cell-sub">${esc(j.location)} • ${esc(j.salary)}</span></div></td><td><b>${j.applicants}</b> hồ sơ</td><td>${esc(j.posted)}</td><td><span class="status success">Đang tuyển</span></td><td><div class="action-row"><button class="icon-btn" data-route="applicants" title="Xem ứng viên">◎</button><button class="icon-btn" data-open-job="${j.id}" title="Xem tin">→</button><button class="icon-btn danger-ghost" data-close-job="${j.id}" title="Đóng tin">×</button></div></td></tr>`).join("")}
      </tbody></table></div></div>
    </div></div></section>`;
}

function renderApplicants() {
  const candidates = getCandidates().filter(c => {
    const q = state.candidateQuery.toLowerCase();
    return !q || `${c.name} ${c.title} ${c.skills.join(" ")} ${c.location}`.toLowerCase().includes(q);
  });
  return `<section class="dashboard-page"><div class="container dashboard-grid">${employerSidebar("applicants")}
    <div class="dashboard-content">
      <div class="dash-title"><span class="eyebrow">APPLICANTS</span><h1>Ứng viên đã nộp CV</h1><p>Xem hồ sơ, tìm kiếm và xử lý ứng viên.</p></div>
      <div class="applicant-toolbar"><div class="search-small large">⌕ <input id="candidate-search" value="${esc(state.candidateQuery)}" placeholder="Tìm theo tên, vị trí hoặc kỹ năng..."></div><select><option>Tất cả vị trí</option><option>Unity Game Developer</option><option>Frontend Developer</option></select><select><option>Tất cả trạng thái</option><option>Đang xem xét</option><option>Đã chấp nhận</option><option>Đã từ chối</option></select></div>
      <div class="candidate-grid">${candidates.map(c=>candidateCard(c)).join("")}</div>
    </div></div></section>`;
}

function candidateCard(c) {
  const [txt,cls]=statusMeta(c.status);
  return `<article class="candidate-card-full">
    <div class="candidate-card-top"><div class="avatar-lg">${esc(c.avatar)}</div><div class="candidate-info"><h3>${esc(c.name)}</h3><p>${esc(c.title)}</p></div><span class="match-pill">${c.score}% phù hợp</span></div>
    <div class="candidate-details"><span>⌖ ${esc(c.location)}</span><span>◷ ${esc(c.experience)}</span><span>✉ ${esc(c.email)}</span></div>
    <div class="tag-row">${c.skills.map(s=>`<span class="tag">${esc(s)}</span>`).join("")}</div>
    <div class="candidate-card-bottom"><span class="status ${cls}">${txt}</span><button class="btn btn-soft btn-sm" data-open-candidate="${c.id}">Xem hồ sơ</button></div>
  </article>`;
}

function renderCompanyProfile() {
  return `<section class="dashboard-page"><div class="container dashboard-grid">${employerSidebar("company-profile")}
    <div class="dashboard-content"><div class="dash-title"><span class="eyebrow">COMPANY PROFILE</span><h1>Thông tin công ty</h1><p>Thông tin hiển thị trên các tin tuyển dụng.</p></div>
      <div class="profile-card">
        <div class="company-profile-cover"><div class="company-logo-xl">NG</div></div>
        <div class="profile-form-grid">
          <div class="form-group full"><label>Tên công ty</label><input value="Nova Game Studio"></div>
          <div class="form-group"><label>Email</label><input value="hr@novagame.demo"></div>
          <div class="form-group"><label>Số điện thoại</label><input value="024 3999 8888"></div>
          <div class="form-group"><label>Website</label><input value="novagame.demo"></div>
          <div class="form-group"><label>Quy mô</label><select><option>50 - 100 nhân sự</option></select></div>
          <div class="form-group full"><label>Địa chỉ</label><input value="Cầu Giấy, Hà Nội"></div>
          <div class="form-group full"><label>Giới thiệu</label><textarea>Nova Game Studio là studio phát triển game mobile tập trung vào gameplay có chiều sâu và trải nghiệm người chơi.</textarea></div>
        </div>
        <div class="form-actions"><button class="btn btn-primary" id="save-company">Lưu thay đổi</button></div>
      </div>
    </div></div></section>`;
}

function render() {
  updateNavigation();
  const map = {
    home: renderHome,
    jobs: renderJobs,
    companies: renderCompanies,
    cv: renderCV,
    "candidate-dashboard": renderCandidateDashboard,
    applications: renderApplications,
    messages: renderMessages,
    profile: renderProfile,
    "employer-dashboard": renderEmployerDashboard,
    "post-job": renderPostJob,
    "manage-jobs": renderManageJobs,
    applicants: renderApplicants,
    "company-profile": renderCompanyProfile
  };
  app.innerHTML = (map[state.route] || renderHome)();
  if (state.route === "cv") initCVPreview();
  if (state.route === "messages") setTimeout(scrollChatBottom, 0);
  bindDynamicEvents();
}

function showJob(jobId) {
  const job = getJobs().find(j=>j.id===Number(jobId));
  if (!job) return;
  state.selectedJob = job.id;
  document.getElementById("job-modal-content").innerHTML = `
    <button class="modal-close" data-close-modal="job-modal">×</button>
    <div class="job-detail-head">
      <div class="job-logo big">${esc(job.logo)}</div>
      <div><span class="eyebrow">${esc(job.category)}</span><h2>${esc(job.title)}</h2><p>${esc(job.company)}</p></div>
      ${job.hot?'<span class="hot-badge">HOT</span>':''}
    </div>
    <div class="job-detail-meta"><div><span>💰</span><b>${esc(job.salary)}</b><small>Mức lương</small></div><div><span>📍</span><b>${esc(job.location)}</b><small>Địa điểm</small></div><div><span>◷</span><b>${esc(job.experience)}</b><small>Kinh nghiệm</small></div></div>
    <div class="detail-grid">
      <div class="detail-main">
        <section><h3>Mô tả công việc</h3><p>${esc(job.description)}</p></section>
        <section><h3>Yêu cầu ứng viên</h3><ul>${job.requirements.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>
        <section><h3>Quyền lợi</h3><ul>${job.benefits.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>
        <section><h3>Kỹ năng</h3><div class="tag-row">${job.skills.map(x=>`<span class="tag">${esc(x)}</span>`).join("")}</div></section>
      </div>
      <aside class="detail-side">
        <div class="company-summary"><span class="mini-logo">${esc(job.logo)}</span><h3>${esc(job.company)}</h3><p>${esc(job.companyDesc)}</p><div>📍 ${esc(job.location)}</div></div>
        <button class="btn btn-primary btn-full" data-apply-job="${job.id}">Ứng tuyển ngay</button>
        <button class="btn btn-soft btn-full">♡ Lưu việc làm</button>
      </aside>
    </div>`;
  openModal("job-modal");
  bindDynamicEvents();
}

function showCandidate(id) {
  const c = getCandidates().find(x=>x.id===Number(id)); if (!c) return;
  const job = getJobs().find(j=>j.id===c.appliedJobId);
  const [txt,cls] = statusMeta(c.status);
  document.getElementById("candidate-modal-content").innerHTML = `
    <button class="modal-close" data-close-modal="candidate-modal">×</button>
    <div class="candidate-profile-head">
      <div class="avatar-xl">${esc(c.avatar)}</div>
      <div><span class="eyebrow">CANDIDATE PROFILE</span><h2>${esc(c.name)}</h2><p>${esc(c.title)}</p></div>
      <span class="match-pill big">${c.score}% phù hợp</span>
    </div>
    <div class="candidate-contact-strip"><span>✉ ${esc(c.email)}</span><span>☎ ${esc(c.phone)}</span><span>⌖ ${esc(c.location)}</span><span>◷ ${esc(c.experience)}</span></div>
    <div class="detail-grid candidate-detail-grid">
      <div class="detail-main">
        <section><h3>Giới thiệu</h3><p>${esc(c.about)}</p></section>
        <section><h3>Kỹ năng</h3><div class="tag-row">${c.skills.map(s=>`<span class="tag">${esc(s)}</span>`).join("")}</div></section>
        <section><h3>Kinh nghiệm</h3><div class="timeline"><div><i></i><b>${esc(c.title)}</b><span>ABC Studio • 2025 - 2026</span><p>Tham gia phát triển sản phẩm, xử lý bug và phối hợp cùng team để hoàn thiện tính năng.</p></div></div></section>
        <section><h3>Học vấn</h3><p>${esc(c.education)}</p></section>
      </div>
      <aside class="detail-side">
        <div class="application-box"><span class="status ${cls}">${txt}</span><h3>Ứng tuyển vị trí</h3><b>${esc(job?.title || "Tin tuyển dụng")}</b><p>Ngày nộp: ${esc(c.appliedAt)}</p><button class="btn btn-soft btn-full">▤ Xem CV</button></div>
        <div class="decision-actions">
          <button class="btn btn-danger-soft" data-reject-candidate="${c.id}">✕ Từ chối</button>
          <button class="btn btn-primary" data-accept-candidate="${c.id}">✓ Chấp nhận</button>
        </div>
        <button class="btn btn-dark btn-full" data-message-candidate="${c.id}">✉ Nhắn tin</button>
      </aside>
    </div>`;
  openModal("candidate-modal"); bindDynamicEvents();
}

function showApply(jobId) {
  const job = getJobs().find(j=>j.id===Number(jobId)); if (!job) return;
  if (!state.loggedIn || state.role !== "candidate") {
    closeModal("job-modal"); state.selectedRole="candidate"; openAuth("login"); return;
  }
  document.getElementById("apply-modal-content").innerHTML = `
    <button class="modal-close" data-close-modal="apply-modal">×</button>
    <div class="modal-header-simple"><span class="eyebrow">APPLICATION</span><h2>Ứng tuyển ${esc(job.title)}</h2><p>${esc(job.company)}</p></div>
    <form id="apply-form">
      <div class="form-group"><label>CV sử dụng</label><label class="cv-select-card"><input type="radio" checked name="cv"><span class="file-icon">PDF</span><div><b>CV - NguyenVanA.pdf</b><small>Cập nhật hôm nay</small></div><i>✓</i></label></div>
      <div class="form-grid"><div class="form-group"><label>Họ tên</label><input value="Nguyễn Văn A"></div><div class="form-group"><label>Số điện thoại</label><input value="0901 234 567"></div></div>
      <div class="form-group"><label>Email</label><input value="nguyenvana@gmail.com"></div>
      <div class="form-group"><label>Thư giới thiệu</label><textarea placeholder="Viết vài dòng giới thiệu ngắn với nhà tuyển dụng...">Em quan tâm đến vị trí này và mong có cơ hội trao đổi thêm với anh/chị về kinh nghiệm của mình.</textarea></div>
      <button class="btn btn-primary btn-full" type="submit">Gửi CV ứng tuyển</button>
    </form>`;
  closeModal("job-modal"); openModal("apply-modal");
  document.getElementById("apply-form").onsubmit = e => {
    e.preventDefault();
    const apps = getApplications();
    if (!apps.some(a=>a.jobId===job.id)) apps.unshift({id:Date.now(),jobId:job.id,candidateName:"Nguyễn Văn A",date:"31/08/2026",status:"pending"});
    setApplications(apps);
    closeModal("apply-modal"); toast("Ứng tuyển thành công! CV đã được gửi.");
  };
}

function updateCandidateStatus(id, status) {
  const cands = getCandidates(); const idx = cands.findIndex(c=>c.id===Number(id));
  if (idx<0) return;
  cands[idx].status=status; setCandidates(cands);
  closeModal("candidate-modal");
  toast(status==="accepted" ? "Đã chấp nhận ứng viên." : "Đã từ chối ứng viên.", status==="accepted" ? "success" : "danger");
  if (state.route==="applicants" || state.route==="employer-dashboard") render();
}

function initCVPreview() {
  const update = () => {
    document.querySelectorAll(".cv-input").forEach(input=>{
      const key=input.dataset.cv; const target=document.querySelector(`[data-preview="${key}"]`); if(!target) return;
      if(key==="skills") target.innerHTML=input.value.split(",").filter(Boolean).map(s=>`<span>${esc(s.trim())}</span>`).join("");
      else target.textContent=input.value;
    });
  };
  document.querySelectorAll(".cv-input").forEach(i=>i.addEventListener("input", update)); update();
}

function scrollChatBottom() {
  const box = document.getElementById("chat-messages"); if(box) box.scrollTop = box.scrollHeight;
}

function bindDynamicEvents() {
  document.querySelectorAll("[data-route]").forEach(el => el.onclick = (e) => { e.preventDefault(); setRoute(el.dataset.route); });
  document.querySelectorAll("[data-open-job]").forEach(el => el.onclick = (e) => { e.stopPropagation(); showJob(el.dataset.openJob); });
  document.querySelectorAll("[data-open-candidate]").forEach(el => el.onclick = ()=>showCandidate(el.dataset.openCandidate));
  document.querySelectorAll("[data-close-modal]").forEach(el => el.onclick = ()=>closeModal(el.dataset.closeModal));
  document.querySelectorAll("[data-apply-job]").forEach(el => el.onclick = ()=>showApply(el.dataset.applyJob));
  document.querySelectorAll("[data-accept-candidate]").forEach(el => el.onclick = ()=>updateCandidateStatus(el.dataset.acceptCandidate,"accepted"));
  document.querySelectorAll("[data-reject-candidate]").forEach(el => el.onclick = ()=>updateCandidateStatus(el.dataset.rejectCandidate,"rejected"));
  document.querySelectorAll("[data-message-candidate]").forEach(el => el.onclick = ()=>{closeModal("candidate-modal"); setRoute("messages");});
  document.querySelectorAll("[data-search-key]").forEach(el => el.onclick = ()=>{state.jobQuery=el.dataset.searchKey; setRoute("jobs");});
  document.querySelectorAll("[data-company]").forEach(el => el.onclick = ()=>{state.jobQuery=el.dataset.company; setRoute("jobs");});
  document.querySelectorAll("[data-chat-id]").forEach(el => el.onclick = ()=>{state.currentChat=Number(el.dataset.chatId); render();});
  document.querySelectorAll("[data-close-job]").forEach(el => el.onclick = ()=>toast("Tin đã được chuyển sang trạng thái đóng.", "info"));

  const homeBtn=document.getElementById("home-search-btn");
  if(homeBtn) homeBtn.onclick=()=>{state.jobQuery=document.getElementById("home-job-query").value.trim(); state.locationQuery=document.getElementById("home-location-query").value.trim(); setRoute("jobs");};
  const jobsBtn=document.getElementById("jobs-search-btn");
  if(jobsBtn) jobsBtn.onclick=()=>{state.jobQuery=document.getElementById("jobs-query").value.trim(); state.locationQuery=document.getElementById("jobs-location").value.trim(); render();};
  const clear=document.getElementById("clear-filter");
  if(clear) clear.onclick=()=>{state.jobQuery="";state.locationQuery="";render();};

  const candSearch=document.getElementById("candidate-search");
  if(candSearch) candSearch.oninput=()=>{state.candidateQuery=candSearch.value; setTimeout(()=>{ if(document.activeElement===candSearch){ const pos=candSearch.selectionStart; render(); const n=document.getElementById("candidate-search"); if(n){n.focus(); n.setSelectionRange(pos,pos);} }},120);};

  const postForm=document.getElementById("post-job-form");
  if(postForm) postForm.onsubmit=e=>{
    e.preventDefault();
    const fd=new FormData(postForm); const jobs=getJobs();
    const req=(fd.get("requirements")||"").split(";").map(x=>x.trim()).filter(Boolean);
    const ben=(fd.get("benefits")||"").split(";").map(x=>x.trim()).filter(Boolean);
    const skills=(fd.get("skills")||"").split(",").map(x=>x.trim()).filter(Boolean);
    jobs.unshift({
      id:Date.now(), title:fd.get("title"), company:"Nova Game Studio", logo:"NG", location:fd.get("location"),
      salary:fd.get("salary"), type:fd.get("type"), experience:fd.get("experience"), category:"Tuyển dụng mới",
      skills:skills.length?skills:["Kỹ năng mới"], hot:true, applicants:0, posted:"Vừa xong",
      description:fd.get("description")||"Mô tả công việc đang được cập nhật.",
      requirements:req.length?req:["Trao đổi khi phỏng vấn"], benefits:ben.length?ben:["Thỏa thuận theo năng lực"],
      companyDesc:"Studio phát triển game mobile tập trung vào trải nghiệm gameplay có chiều sâu."
    }); setJobs(jobs); toast("Đăng tin tuyển dụng thành công!"); setRoute("manage-jobs");
  };

  const chatForm=document.getElementById("chat-form");
  if(chatForm) chatForm.onsubmit=e=>{
    e.preventDefault(); const input=document.getElementById("chat-input"); const text=input.value.trim(); if(!text)return;
    const msgs=getMessages(); const conv=msgs.find(m=>m.id===state.currentChat); if(conv){conv.messages.push({from:"me",text,time:"23:24"});conv.last=text;conv.time="Vừa xong";conv.unread=0;setMessages(msgs);}
    render();
  };

  const saveCv=document.getElementById("save-cv"); if(saveCv) saveCv.onclick=()=>toast("Đã lưu CV vào trình duyệt.");
  const resetCv=document.getElementById("reset-cv"); if(resetCv) resetCv.onclick=()=>{localStorage.removeItem("jobflow_cv");toast("Đã làm mới CV.","info");};
  const saveProfile=document.getElementById("save-profile"); if(saveProfile) saveProfile.onclick=()=>toast("Đã lưu hồ sơ cá nhân.");
  const saveCompany=document.getElementById("save-company"); if(saveCompany) saveCompany.onclick=()=>toast("Đã lưu thông tin công ty.");
}

document.addEventListener("click", e => {
  if (e.target.id === "open-login") openAuth("login");
  if (e.target.id === "open-register") openAuth("register");
  if (e.target.id === "logout-btn") {
    state.loggedIn=false; state.role=null;
    localStorage.removeItem("jobflow_logged_in"); localStorage.removeItem("jobflow_role");
    toast("Đã đăng xuất.", "info"); setRoute("home");
  }
});

document.querySelectorAll(".modal-overlay").forEach(m => m.addEventListener("click", e => { if(e.target===m) closeModal(m.id); }));
document.getElementById("mobile-menu-btn").onclick = () => document.getElementById("main-nav").classList.toggle("open");
document.querySelectorAll(".auth-tab").forEach(b=>b.onclick=()=>openAuth(b.dataset.authMode));
document.querySelectorAll(".role-card").forEach(b=>b.onclick=()=>{
  state.selectedRole=b.dataset.role;
  document.querySelectorAll(".role-card").forEach(x=>x.classList.toggle("active",x===b));
});
document.getElementById("auth-form").onsubmit=e=>{
  e.preventDefault();
  state.loggedIn=true; state.role=state.selectedRole;
  localStorage.setItem("jobflow_logged_in","true"); localStorage.setItem("jobflow_role",state.role);
  closeModal("auth-modal");
  toast(state.authMode==="register" ? "Tạo tài khoản demo thành công!" : "Đăng nhập thành công!");
  setRoute(state.role==="candidate" ? "candidate-dashboard" : "employer-dashboard");
};

render();

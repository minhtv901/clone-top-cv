const app = document.getElementById("app");

const state = {
  route: "home",
  role: localStorage.getItem("jobflow_role") || null,
  loggedIn: localStorage.getItem("jobflow_logged_in") === "true",
  selectedRole: "candidate",
  authMode: "login",
  selectedJob: null,
  selectedCandidate: null,
  currentChat: null,
  jobQuery: "",
  locationQuery: "",
  candidateQuery: ""
};


const getUsers = () => JSON.parse(localStorage.getItem("jobflow_users") || "[]");
const setUsers = (v) => localStorage.setItem("jobflow_users", JSON.stringify(v));
const getCurrentUser = () => JSON.parse(localStorage.getItem("jobflow_current_user") || "null");
const setCurrentUser = (v) => localStorage.setItem("jobflow_current_user", JSON.stringify(v));

const getJobs = () => JSON.parse(localStorage.getItem("jobflow_jobs") || "[]");
const setJobs = (v) => localStorage.setItem("jobflow_jobs", JSON.stringify(v));
const getCandidates = () => JSON.parse(localStorage.getItem("jobflow_candidates") || "[]");
const setCandidates = (v) => localStorage.setItem("jobflow_candidates", JSON.stringify(v));
const getMessages = () => JSON.parse(localStorage.getItem("jobflow_messages") || "[]");
const setMessages = (v) => localStorage.setItem("jobflow_messages", JSON.stringify(v));
const getApplications = () => JSON.parse(localStorage.getItem("jobflow_applications") || "[]");
const setApplications = (v) => localStorage.setItem("jobflow_applications", JSON.stringify(v));


function initials(name="") {
  const parts=String(name).trim().split(/\s+/).filter(Boolean);
  if(!parts.length) return "MW";
  if(parts.length===1) return parts[0].slice(0,2).toUpperCase();
  return (parts[0][0]+parts[parts.length-1][0]).toUpperCase();
}

function getEmployerApplications(user=getCurrentUser()) {
  if(!user) return [];
  const jobs=getCompanyJobs(user.id, user.profile?.company || user.name);
  const ids=jobs.map(j=>String(j.id));
  return getApplications().filter(a=>
    ids.includes(String(a.jobId)) || String(a.employerId||"")===String(user.id)
  );
}

function getCandidateApplications(user=getCurrentUser()) {
  if(!user) return [];
  return getApplications().filter(a=>
    String(a.candidateUserId || a.candidateId || "")===String(user.id) ||
    (a.candidateEmail && user.email && a.candidateEmail.toLowerCase()===user.email.toLowerCase())
  );
}

function getCvStorageKey(user=getCurrentUser()) {
  return user?.id ? `jobflow_cv_${user.id}` : "jobflow_cv";
}

function getSavedCV(user=getCurrentUser()) {
  const defaults={
    name:user?.name || "Nguyễn Văn A",
    title:user?.profile?.title || "Digital Marketing Candidate",
    email:user?.email || "candidate@moonwork.vn",
    phone:user?.profile?.phone || "0901 234 567",
    location:user?.profile?.location || user?.profile?.address || "Hà Nội, Việt Nam",
    about:user?.profile?.bio || "Ứng viên Marketing quan tâm đến Digital Marketing, Content, Social Media và tối ưu chiến dịch theo dữ liệu.",
    skills:Array.isArray(user?.profile?.skills) ? user.profile.skills.join(", ") : (user?.profile?.skills || "Facebook Ads, Google Ads, Content Marketing, Social Media, SEO"),
    company:"Bright Media Vietnam",
    experience:"Marketing Intern • 2025 - 2026",
    experienceDesc:"Hỗ trợ triển khai nội dung social, theo dõi quảng cáo và tổng hợp báo cáo chiến dịch.",
    education:user?.profile?.education || "Đại học Thương mại • Marketing • 2023 - 2026"
  };
  let local=null;
  try { local=JSON.parse(localStorage.getItem(getCvStorageKey(user)) || "null"); } catch(_) {}
  if(!local && user?.id) {
    try { local=JSON.parse(localStorage.getItem("jobflow_cv") || "null"); } catch(_) {}
  }
  return {...defaults, ...(user?.cv || {}), ...(local || {})};
}

function getVisibleConversations(user=getCurrentUser()) {
  if(!user) return [];
  return getMessages().filter(c=>{
    if(state.role==="candidate") {
      return String(c.candidateUserId||"")===String(user.id) ||
        (c.candidateEmail && user.email && c.candidateEmail.toLowerCase()===user.email.toLowerCase());
    }
    return String(c.employerId||"")===String(user.id) ||
      (c.employerName && (user.profile?.company || user.name) && c.employerName===(user.profile?.company || user.name));
  });
}

function conversationPartner(conv) {
  if(state.role==="employer") return {name:conv.candidateName||"Ứng viên", avatar:conv.candidateAvatar||initials(conv.candidateName||"Ứng viên")};
  return {name:conv.employerName||"Nhà tuyển dụng", avatar:conv.employerAvatar||initials(conv.employerName||"Nhà tuyển dụng")};
}

function ensureConversation(application, job=null, initialText="") {
  if(!application) return null;
  const all=getMessages();
  const employerId=application.employerId || job?.employerId || null;
  const candidateUserId=application.candidateUserId || application.candidateId || null;
  const key=`conv_${candidateUserId || application.candidateEmail || application.id}_${employerId || application.employerName || job?.company || "employer"}_${application.jobId || job?.id || "general"}`;
  let conv=all.find(c=>String(c.id)===String(key)) || all.find(c=>
    String(c.candidateUserId||"")===String(candidateUserId||"") &&
    String(c.employerId||"")===String(employerId||"") &&
    String(c.jobId||"")===String(application.jobId||job?.id||"")
  );
  if(!conv) {
    conv={
      id:key,
      candidateUserId,
      candidateName:application.candidateName || "Ứng viên",
      candidateEmail:application.candidateEmail || "",
      candidateAvatar:initials(application.candidateName || "Ứng viên"),
      employerId,
      employerName:application.employerName || job?.company || "Nhà tuyển dụng",
      employerAvatar:initials(application.employerName || job?.company || "Nhà tuyển dụng"),
      jobId:application.jobId || job?.id || null,
      jobTitle:job?.title || "Trao đổi tuyển dụng",
      last:"Bắt đầu cuộc trò chuyện",
      time:"Vừa xong",
      unreadForCandidate:0,
      unreadForEmployer:0,
      messages:[]
    };
    all.unshift(conv);
  }
  if(initialText && !conv.messages.some(m=>m.text===initialText && m.senderRole==="candidate")) {
    conv.messages.push({
      senderId:candidateUserId,
      senderRole:"candidate",
      senderName:application.candidateName || "Ứng viên",
      text:initialText,
      time:new Date().toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"})
    });
    conv.last=initialText;
    conv.time="Vừa xong";
    conv.unreadForEmployer=(conv.unreadForEmployer||0)+1;
  }
  setMessages(all);
  return conv;
}

function openConversationForApplication(applicationId) {
  const a=getApplications().find(x=>String(x.id)===String(applicationId));
  if(!a) return;
  const job=getJobs().find(j=>String(j.id)===String(a.jobId));
  const conv=ensureConversation(a,job);
  if(!conv) return;
  state.currentChat=conv.id;
  closeModal("candidate-modal");
  setRoute("messages");
}

// Lấy đúng các job thuộc về một công ty / nhà tuyển dụng
function getCompanyJobs(companyId, companyName) {
  return getJobs().filter(j =>
    (companyId && String(j.employerId) === String(companyId)) ||
    (companyName && j.company === companyName)
  );
}

// Demo employer account - Bright Media Vietnam
function seedEmployerAccount(){
  const users=getUsers();
  const demos=[
    {
      id:9001,name:"Bright Media Vietnam",email:"hr@brightmedia.vn",password:"123456",role:"employer",
      profile:{company:"Bright Media Vietnam",industry:"Digital Marketing & Creative",location:"Cầu Giấy, Hà Nội",phone:"024 8888 9999",contactEmail:"hr@brightmedia.vn",website:"brightmedia.vn",size:"50 - 100 nhân sự",description:"Bright Media Vietnam là agency chuyên Digital Marketing, Content Marketing, SEO, Performance và xây dựng thương hiệu cho doanh nghiệp."}
    },
    {
      id:8001,name:"Nguyễn Văn A",email:"candidate@moonwork.vn",password:"123456",role:"candidate",
      profile:{title:"Digital Marketing Candidate",phone:"0901 234 567",location:"Hà Nội",bio:"Ứng viên Marketing quan tâm đến Digital Marketing, Content, Social Media và tối ưu chiến dịch theo dữ liệu.",skills:["Facebook Ads","Google Ads","Content Marketing","Social Media","SEO"],experience:"1 năm",education:"Đại học Thương mại — Marketing"}
    }
  ];
  demos.forEach(demo=>{
    const idx=users.findIndex(u=>String(u.email||"").toLowerCase()===demo.email.toLowerCase());
    if(idx<0) users.push(demo);
    else {
      const old=users[idx];
      users[idx]={...demo,...old,id:old.id||demo.id,email:demo.email,password:demo.password,role:demo.role,profile:{...demo.profile,...(old.profile||{})}};
    }
  });
  setUsers(users);
}

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
  const protectedCandidate=["candidate-dashboard","applications","profile"];
  const protectedEmployer=["employer-dashboard","post-job","manage-jobs","applicants","company-profile"];
  const protectedShared=["messages"];
  if(protectedCandidate.includes(route) && (!state.loggedIn || state.role!=="candidate")) {
    state.selectedRole="candidate"; openAuth("login"); return;
  }
  if(protectedEmployer.includes(route) && (!state.loggedIn || state.role!=="employer")) {
    state.selectedRole="employer"; openAuth("login"); return;
  }
  if(protectedShared.includes(route) && !state.loggedIn) { openAuth("login"); return; }
  state.route=route;
  window.scrollTo({top:0,behavior:"smooth"});
  render();
}

function openAuth(mode="login") {
  state.authMode = mode;
  const modal = document.getElementById("auth-modal");
  if (modal) {
    modal.style.overflowY = "auto";
    const box = modal.querySelector(".auth-content, .modal-content, .auth-box, .modal-body");
    if (box) {
      box.style.maxHeight = "90vh";
      box.style.overflowY = "auto";
    }
  }
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
    const current = getCurrentUser();
    const label = current ? current.name : (state.role === "candidate" ? "Ứng viên" : "Nhà tuyển dụng");
    const route = state.role === "candidate" ? "candidate-dashboard" : "employer-dashboard";
    actions.innerHTML = `
      <button class="user-chip" data-route="${route}">
        <span class="avatar-sm">${esc(initials(label))}</span>
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
          <button data-search-key="Marketing">Marketing</button>
          <button data-search-key="Content">Content</button>
          <button data-search-key="SEO">SEO</button>
          <button data-search-key="Social Media">Social Media</button>
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
          <img src="images/moon-boy.png" class="poetic-boy-image" alt="Moon boy on crescent moon">
          <div class="poetic-line-wrap">
            <div class="poetic-line"></div>
            <div class="poetic-job-tag">
              <small>MOONWORK</small>
              <b>Dream Job</b>
              <span>Digital Marketing</span>
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
            <label class="check-row"><input type="checkbox" /> Performance Marketing <span>128</span></label>
            <label class="check-row"><input type="checkbox" /> Content Marketing <span>46</span></label>
            <label class="check-row"><input type="checkbox" /> Social Media <span>32</span></label>
            <label class="check-row"><input type="checkbox" /> SEO / Branding <span>55</span></label>
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
  const cv=getSavedCV();
  return `
  <section class="cv-page">
    <div class="cv-toolbar"><div class="container cv-toolbar-inner">
      <div><span class="eyebrow">CV BUILDER</span><h2>CV ${esc(cv.title || "Marketing Specialist")}</h2></div>
      <div class="toolbar-actions"><button class="btn btn-ghost" id="reset-cv">Làm mới</button><button class="btn btn-primary" id="save-cv">Lưu CV</button></div>
    </div></div>
    <div class="container cv-builder">
      <aside class="cv-editor">
        <div class="editor-section"><h3>Thông tin cá nhân</h3><div class="form-grid">
          <div class="form-group"><label>Họ tên</label><input class="cv-input" data-cv="name" value="${esc(cv.name)}" /></div>
          <div class="form-group"><label>Vị trí</label><input class="cv-input" data-cv="title" value="${esc(cv.title)}" /></div>
          <div class="form-group"><label>Email</label><input class="cv-input" data-cv="email" value="${esc(cv.email)}" /></div>
          <div class="form-group"><label>Số điện thoại</label><input class="cv-input" data-cv="phone" value="${esc(cv.phone)}" /></div>
          <div class="form-group full"><label>Địa điểm</label><input class="cv-input" data-cv="location" value="${esc(cv.location)}" /></div>
        </div></div>
        <div class="editor-section"><h3>Giới thiệu</h3><textarea class="cv-input" data-cv="about">${esc(cv.about)}</textarea></div>
        <div class="editor-section"><h3>Kỹ năng</h3><input class="cv-input" data-cv="skills" value="${esc(cv.skills)}" /><small>Phân cách kỹ năng bằng dấu phẩy.</small></div>
        <div class="editor-section"><h3>Kinh nghiệm</h3>
          <div class="form-group"><label>Công ty</label><input class="cv-input" data-cv="company" value="${esc(cv.company)}" /></div>
          <div class="form-group"><label>Vị trí / thời gian</label><input class="cv-input" data-cv="experience" value="${esc(cv.experience)}" /></div>
          <div class="form-group"><label>Mô tả</label><textarea class="cv-input" data-cv="experienceDesc">${esc(cv.experienceDesc)}</textarea></div>
        </div>
        <div class="editor-section"><h3>Học vấn</h3><input class="cv-input" data-cv="education" value="${esc(cv.education)}" /></div>
      </aside>
      <div class="cv-preview-wrap"><div class="preview-note">Xem trước trực tiếp</div>
        <article class="cv-paper" id="cv-preview">
          <header class="cv-head"><div class="cv-avatar" id="cv-avatar">${esc(initials(cv.name))}</div><div><h1 data-preview="name">${esc(cv.name)}</h1><h2 data-preview="title">${esc(cv.title)}</h2></div></header>
          <div class="cv-contact"><span>✉ <i data-preview="email">${esc(cv.email)}</i></span><span>☎ <i data-preview="phone">${esc(cv.phone)}</i></span><span>⌖ <i data-preview="location">${esc(cv.location)}</i></span></div>
          <section><h3>GIỚI THIỆU</h3><p data-preview="about">${esc(cv.about)}</p></section>
          <section><h3>KỸ NĂNG</h3><div class="cv-skills" data-preview="skills"></div></section>
          <section><h3>KINH NGHIỆM</h3><div class="cv-entry"><b data-preview="company">${esc(cv.company)}</b><span data-preview="experience">${esc(cv.experience)}</span><p data-preview="experienceDesc">${esc(cv.experienceDesc)}</p></div></section>
          <section><h3>HỌC VẤN</h3><div class="cv-entry"><b data-preview="education">${esc(cv.education)}</b></div></section>
        </article>
      </div>
    </div>
  </section>`;
}

function candidateSidebar(active) {
  const user=getCurrentUser();
  const profile=user?.profile || {};
  const cv=getSavedCV(user);
  const name=user?.name || cv.name || "Ứng viên";
  const title=profile.title || cv.title || "Digital Marketing Candidate";
  const items=[["candidate-dashboard","▦","Tổng quan"],["jobs","⌕","Tìm việc"],["cv","▤","CV của tôi"],["applications","✓","Việc đã ứng tuyển"],["messages","✉","Tin nhắn"],["profile","○","Hồ sơ cá nhân"]];
  return `<aside class="dashboard-sidebar"><div class="profile-mini"><div class="avatar-lg">${esc(initials(name))}</div><div><b>${esc(name)}</b><span>${esc(title)}</span></div></div><nav>${items.map(i=>`<button class="${active===i[0]?"active":""}" data-route="${i[0]}"><i>${i[1]}</i>${i[2]}</button>`).join("")}</nav></aside>`;
}

seedEmployerAccount();

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
    <div class="profile-mini"><div class="avatar-lg company-avatar">${esc(initials(getCurrentUser()?.profile?.company || getCurrentUser()?.name || "Bright Media Vietnam"))}</div><div><b>${esc(getCurrentUser()?.profile?.company || getCurrentUser()?.name || "Bright Media Vietnam")}</b><span>Nhà tuyển dụng</span></div></div>
    <nav>${items.map(i=>`<button class="${active===i[0]?"active":""}" data-route="${i[0]}"><i>${i[1]}</i>${i[2]}</button>`).join("")}</nav>
  </aside>`;
}

function renderCandidateDashboard() {
  const user=getCurrentUser();
  const apps=getCandidateApplications(user);
  const jobs=getJobs().slice(0,3);
  const unread=getVisibleConversations(user).reduce((n,c)=>n+(c.unreadForCandidate||0),0);
  return `<section class="dashboard-page"><div class="container dashboard-grid">
    ${candidateSidebar("candidate-dashboard")}
    <div class="dashboard-content">
      <div class="welcome-card"><div><span class="eyebrow">CANDIDATE DASHBOARD</span><h1>Xin chào, ${esc(user?.name || "Ứng viên")} 👋</h1><p>Khám phá các cơ hội Marketing phù hợp và theo dõi hồ sơ của bạn.</p></div><div class="profile-progress"><div class="progress-ring"><span>82%</span></div><div><b>Hồ sơ khá tốt</b><span>Hoàn thiện thêm để tăng cơ hội</span></div></div></div>
      <div class="stats-grid">
        <div class="stat-card"><span class="stat-icon">▤</span><div><b>${apps.length}</b><span>Đã ứng tuyển</span></div></div>
        <div class="stat-card"><span class="stat-icon">◔</span><div><b>${apps.filter(a=>a.status==="pending").length}</b><span>Đang xem xét</span></div></div>
        <div class="stat-card"><span class="stat-icon">✓</span><div><b>${apps.filter(a=>a.status==="accepted").length}</b><span>Được chấp nhận</span></div></div>
        <div class="stat-card"><span class="stat-icon">✉</span><div><b>${unread}</b><span>Tin nhắn mới</span></div></div>
      </div>
      <div class="dash-section"><div class="section-head mini"><div><h2>Việc làm phù hợp với bạn</h2><p>Dựa trên kỹ năng và hồ sơ Marketing hiện tại</p></div><button class="text-arrow" data-route="jobs">Xem tất cả →</button></div><div class="job-list compact-list">${jobs.map(jobCard).join("")}</div></div>
    </div>
  </div></section>`;
}

function renderApplications() {
  const jobs=getJobs();
  const apps=getCandidateApplications();
  return `<section class="dashboard-page"><div class="container dashboard-grid">
    ${candidateSidebar("applications")}
    <div class="dashboard-content"><div class="dash-title"><span class="eyebrow">APPLICATIONS</span><h1>Việc đã ứng tuyển</h1><p>Theo dõi trạng thái hồ sơ và nhắn trực tiếp với nhà tuyển dụng.</p></div>
      <div class="table-card"><div class="table-toolbar"><div class="search-small">⌕ <input placeholder="Tìm theo vị trí hoặc công ty..." /></div><select><option>Tất cả trạng thái</option><option>Đang xem xét</option><option>Đã chấp nhận</option><option>Đã từ chối</option></select></div>
        <div class="responsive-table"><table><thead><tr><th>Vị trí</th><th>Ngày ứng tuyển</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>
          ${apps.length ? apps.map(a=>{const j=jobs.find(x=>String(x.id)===String(a.jobId))||{id:a.jobId,title:"Tin tuyển dụng",company:a.employerName||"Doanh nghiệp",logo:"MW"}; const [txt,cls]=statusMeta(a.status); return `<tr><td><div class="table-job"><span class="mini-logo">${esc(j.logo)}</span><div><b>${esc(j.title)}</b><span>${esc(j.company)}</span></div></div></td><td>${esc(a.date||"")}</td><td><span class="status ${cls}">${txt}</span></td><td><div class="action-row"><button class="icon-btn" data-message-application="${a.id}" title="Nhắn nhà tuyển dụng">✉</button><button class="icon-btn" data-open-job="${j.id}" title="Xem tin">→</button></div></td></tr>`}).join("") : `<tr><td colspan="4"><div class="empty-card"><p>Bạn chưa ứng tuyển công việc nào.</p></div></td></tr>`}
        </tbody></table></div>
      </div>
    </div>
  </div></section>`;
}

function renderMessages() {
  const user=getCurrentUser();
  const messages=getVisibleConversations(user);
  if(!messages.length) {
    const side=state.role==="employer" ? employerSidebar("messages") : candidateSidebar("messages");
    return `<section class="dashboard-page"><div class="container dashboard-grid">${side}<div class="dashboard-content"><div class="dash-title"><span class="eyebrow">MESSAGES</span><h1>Trò chuyện</h1><p>Tin nhắn giữa ứng viên và nhà tuyển dụng được lưu chung theo từng cuộc hội thoại.</p></div><div class="empty-card"><div>✉</div><h3>Chưa có cuộc trò chuyện</h3><p>${state.role==="candidate" ? "Hãy ứng tuyển hoặc mở mục Việc đã ứng tuyển để nhắn cho nhà tuyển dụng." : "Khi có ứng viên nộp hồ sơ, bạn có thể mở hồ sơ và nhắn trực tiếp tại đây."}</p></div></div></div></section>`;
  }
  if(!messages.some(m=>String(m.id)===String(state.currentChat))) state.currentChat=messages[0].id;
  const current=messages.find(m=>String(m.id)===String(state.currentChat)) || messages[0];
  const all=getMessages();
  const real=all.find(m=>String(m.id)===String(current.id));
  if(real) {
    if(state.role==="candidate"){ real.unreadForCandidate=0; current.unreadForCandidate=0; } else { real.unreadForEmployer=0; current.unreadForEmployer=0; }
    setMessages(all);
  }
  const side=state.role==="employer" ? employerSidebar("messages") : candidateSidebar("messages");
  const partner=conversationPartner(current);
  const unreadFor=c=>state.role==="employer" ? (c.unreadForEmployer||0) : (c.unreadForCandidate||0);
  return `<section class="dashboard-page"><div class="container dashboard-grid">
    ${side}<div class="dashboard-content"><div class="dash-title"><span class="eyebrow">MESSAGES</span><h1>Trò chuyện</h1><p>Tin nhắn thật được dùng chung giữa tài khoản ứng viên và nhà tuyển dụng trên trình duyệt này.</p></div>
      <div class="chat-shell"><aside class="chat-list"><div class="chat-search">⌕ <input id="chat-search" placeholder="Tìm cuộc trò chuyện..." /></div>
        ${messages.map(m=>{const p=conversationPartner(m); const unread=unreadFor(m); return `<button class="chat-person ${String(m.id)===String(current.id)?"active":""}" data-chat-id="${esc(m.id)}"><span class="avatar-md">${esc(p.avatar)}</span><div><b>${esc(p.name)}</b><span>${esc(m.last||m.jobTitle||"Trao đổi tuyển dụng")}</span></div><small>${esc(m.time||"")}</small>${unread?`<i>${unread}</i>`:""}</button>`}).join("")}
      </aside><div class="chat-panel"><header><div class="chat-user"><span class="avatar-md">${esc(partner.avatar)}</span><div><b>${esc(partner.name)}</b><span><i class="online-dot"></i> ${esc(current.jobTitle||"Trao đổi tuyển dụng")}</span></div></div><button class="icon-btn">⋮</button></header>
        <div class="chat-messages" id="chat-messages"><div class="date-sep">Hôm nay</div>
          ${(current.messages||[]).map(x=>{const mine=(x.senderId!=null && String(x.senderId)===String(user?.id)) || (!x.senderId && x.senderRole===state.role); return `<div class="bubble-row ${mine?"me":""}"><div class="bubble">${esc(x.text)}<small>${esc(x.time||"")}</small></div></div>`}).join("")}
        </div><form class="chat-compose" id="chat-form"><button type="button">＋</button><input id="chat-input" placeholder="Nhập tin nhắn..." autocomplete="off"/><button class="send-btn" type="submit">➤</button></form>
      </div></div>
    </div>
  </div></section>`;
}

function renderProfile() {
  const user=getCurrentUser(); const profile=user?.profile||{}; const cv=getSavedCV(user);
  const name=user?.name||cv.name||"Ứng viên"; const email=user?.email||cv.email||""; const title=profile.title||cv.title||"Digital Marketing Candidate";
  const phone=profile.phone||cv.phone||""; const location=profile.location||profile.address||cv.location||"Hà Nội"; const bio=profile.bio||cv.about||"";
  const skills=Array.isArray(profile.skills)?profile.skills.join(", "):(profile.skills||cv.skills||"");
  return `<section class="dashboard-page"><div class="container dashboard-grid">${candidateSidebar("profile")}
    <div class="dashboard-content"><div class="dash-title"><span class="eyebrow">PROFILE</span><h1>Hồ sơ cá nhân</h1><p>Thông tin được gửi kèm khi bạn ứng tuyển.</p></div><div class="profile-card"><div class="profile-cover"></div>
      <div class="profile-header"><div class="avatar-xl">${esc(initials(name))}</div><div><h2>${esc(name)}</h2><p>${esc(title)}</p></div><button class="btn btn-soft">Đổi ảnh</button></div>
      <div class="profile-form-grid">
        <div class="form-group"><label>Họ và tên</label><input id="profile-name" value="${esc(name)}"></div>
        <div class="form-group"><label>Vị trí mong muốn</label><input id="profile-title" value="${esc(title)}"></div>
        <div class="form-group"><label>Email</label><input id="profile-email" value="${esc(email)}"></div>
        <div class="form-group"><label>Số điện thoại</label><input id="profile-phone" value="${esc(phone)}"></div>
        <div class="form-group full"><label>Địa điểm</label><input id="profile-location" value="${esc(location)}"></div>
        <div class="form-group full"><label>Giới thiệu</label><textarea id="profile-bio">${esc(bio)}</textarea></div>
        <div class="form-group full"><label>Kỹ năng</label><input id="profile-skills" value="${esc(skills)}"></div>
      </div><div class="form-actions"><button class="btn btn-primary" id="save-profile">Lưu thay đổi</button></div>
    </div></div></div></section>`;
}

function renderEmployerDashboard() {
  const user=getCurrentUser(); const jobs=getCompanyJobs(user?.id,user?.profile?.company||user?.name); const applications=getEmployerApplications(user);
  const company=user?.profile?.company||user?.name||"Bright Media Vietnam";
  return `<section class="dashboard-page"><div class="container dashboard-grid">${employerSidebar("employer-dashboard")}
    <div class="dashboard-content"><div class="welcome-card employer-welcome"><div><span class="eyebrow">EMPLOYER DASHBOARD</span><h1>${esc(company)}</h1><p>Quản lý đúng các tin của công ty, hồ sơ ứng viên và tin nhắn trao đổi.</p></div><button class="btn btn-primary" data-route="post-job">＋ Đăng tin mới</button></div>
      <div class="stats-grid"><div class="stat-card"><span class="stat-icon">▤</span><div><b>${jobs.length}</b><span>Tin đang tuyển</span></div></div><div class="stat-card"><span class="stat-icon">◎</span><div><b>${applications.length}</b><span>Hồ sơ đã nhận</span></div></div><div class="stat-card"><span class="stat-icon">◔</span><div><b>${applications.filter(a=>a.status==="pending").length}</b><span>Chờ xử lý</span></div></div><div class="stat-card"><span class="stat-icon">✓</span><div><b>${applications.filter(a=>a.status==="accepted").length}</b><span>Đã chấp nhận</span></div></div></div>
      <div class="dashboard-split"><div class="dash-section table-card no-pad"><div class="section-head mini padded"><div><h2>Ứng viên gần đây</h2><p>Chỉ hồ sơ gửi vào job của ${esc(company)}</p></div><button class="text-arrow" data-route="applicants">Xem tất cả →</button></div><div class="candidate-mini-list">${applications.length?applications.slice(0,4).map(a=>{const [t,cl]=statusMeta(a.status); const j=jobs.find(x=>String(x.id)===String(a.jobId)); return `<button data-open-application="${a.id}"><span class="avatar-md">${esc(initials(a.candidateName||"UV"))}</span><div><b>${esc(a.candidateName||"Ứng viên")}</b><span>${esc(a.candidateTitle||"Marketing Candidate")} • ${esc(j?.title||"Tin tuyển dụng")}</span></div><span class="status ${cl}">${t}</span></button>`}).join(""):`<div class="empty-card"><p>Chưa có hồ sơ mới.</p></div>`}</div></div>
      <div class="analytics-card"><div class="section-head mini"><div><h2>Hiệu quả tuyển dụng</h2><p>7 ngày gần nhất</p></div></div><div class="analytics-number"><b>${applications.length}</b><span>lượt ứng tuyển</span><i>${getVisibleConversations(user).reduce((n,c)=>n+(c.unreadForEmployer||0),0)} tin mới</i></div><div class="bar-chart"><span style="height:40%"></span><span style="height:55%"></span><span style="height:48%"></span><span style="height:80%"></span><span style="height:65%"></span><span style="height:90%"></span><span style="height:78%"></span></div><div class="chart-labels"><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span></div></div></div>
    </div></div></section>`;
}

function renderPostJob() {
  return `<section class="dashboard-page"><div class="container dashboard-grid">
    ${employerSidebar("post-job")}
    <div class="dashboard-content">
      <div class="dash-title"><span class="eyebrow">CREATE JOB</span><h1>Đăng tin tuyển dụng</h1><p>Tạo một tin tuyển dụng mới cho doanh nghiệp.</p></div>
      <form class="post-job-form" id="post-job-form">
        <div class="form-card"><h3>Thông tin cơ bản</h3><div class="form-grid">
          <div class="form-group full"><label>Tên vị trí *</label><input name="title" placeholder="VD: Digital Marketing Executive" required></div>
          <div class="form-group"><label>Địa điểm làm việc *</label><input name="location" placeholder="Hà Nội / Remote" required></div>
          <div class="form-group"><label>Thời gian làm việc</label><input name="workingTime" placeholder="VD: Thứ 2 - Thứ 6, 8:30 - 17:30"></div>
          <div class="form-group"><label>Số lượng cần tuyển</label><input name="quantity" type="number" min="1" placeholder="VD: 3"></div>
          <div class="form-group"><label>Cách ứng tuyển</label><textarea name="applyMethod" placeholder="Nhập cách ứng tuyển: Email, số điện thoại, website công ty..."></textarea></div>
          <div class="form-group"><label>Mức lương *</label><input name="salary" placeholder="15 - 25 triệu" required></div>
          <div class="form-group"><label>Kinh nghiệm</label><select name="experience"><option>Fresher</option><option selected>1 - 2 năm</option><option>2 - 3 năm</option><option>Trên 3 năm</option></select></div>
          <div class="form-group"><label>Địa điểm làm việc</label><input name="location" placeholder="Ví dụ: Hà Nội"></div><div class="form-group"><label>Thời gian làm việc</label><input name="workingTime" placeholder="Ví dụ: Thứ 2 - Thứ 6, 8:30 - 17:30"></div><div class="form-group"><label>Số lượng cần tuyển</label><input name="quantity" type="number" min="1" placeholder="Ví dụ: 3"></div><div class="form-group"><label>Hình thức</label><select name="type"><option>Full-time</option><option>Part-time</option><option>Hybrid</option><option>Remote</option></select></div>
          <div class="form-group full"><label>Kỹ năng</label><input name="skills" placeholder="Facebook Ads, Google Ads, SEO"></div>
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
  const user=getCurrentUser(); const jobs=getCompanyJobs(user?.id,user?.profile?.company||user?.name); const apps=getEmployerApplications(user);
  return `<section class="dashboard-page"><div class="container dashboard-grid">${employerSidebar("manage-jobs")}<div class="dashboard-content"><div class="dash-title row-title"><div><span class="eyebrow">JOB MANAGEMENT</span><h1>Quản lý tin tuyển dụng</h1><p>Theo dõi và quản lý các vị trí đang tuyển.</p></div><button class="btn btn-primary" data-route="post-job">＋ Đăng tin mới</button></div><div class="table-card"><div class="table-toolbar"><div class="search-small">⌕ <input placeholder="Tìm tin tuyển dụng..."></div><select><option>Tất cả trạng thái</option><option>Đang tuyển</option><option>Đã đóng</option></select></div><div class="responsive-table"><table><thead><tr><th>Vị trí</th><th>Ứng viên</th><th>Đăng lúc</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${jobs.map(j=>{const count=apps.filter(a=>String(a.jobId)===String(j.id)).length; return `<tr><td><div><b>${esc(j.title)}</b><span class="cell-sub">${esc(j.location)} • ${esc(j.salary)} • Tuyển ${esc(j.quantity || 1)} người</span></div></td><td><b>${count}</b> hồ sơ</td><td>${esc(j.posted)}</td><td><span class="status success">Đang tuyển</span></td><td><div class="action-row"><button class="icon-btn" data-route="applicants" title="Xem ứng viên">◎</button><button class="icon-btn" data-open-job="${j.id}" title="Xem tin">→</button><button class="icon-btn" data-edit-job="${j.id}" title="Sửa tin">✎</button><button class="icon-btn danger-ghost" data-delete-job="${j.id}" title="Xóa tin">🗑</button></div></td></tr>`}).join("")}</tbody></table></div></div></div></div></section>`;
}

function renderApplicants() {
  const user=getCurrentUser(); const jobs=getCompanyJobs(user?.id,user?.profile?.company||user?.name); const myApplications=getEmployerApplications(user);
  return `<section class="dashboard-page"><div class="container dashboard-grid">${employerSidebar("applicants")}<div class="dashboard-content"><div class="dash-title"><span class="eyebrow">APPLICANTS</span><h1>Ứng viên đã nộp CV</h1><p>Chỉ hiển thị ứng viên ứng tuyển vào các vị trí của công ty bạn.</p></div><div class="candidate-grid">${myApplications.length?myApplications.map(a=>{const job=jobs.find(j=>String(j.id)===String(a.jobId)); const [txt,cls]=statusMeta(a.status); return `<article class="candidate-card-full"><div class="candidate-card-top"><div class="avatar-lg">${esc(initials(a.candidateName||"UV"))}</div><div class="candidate-info"><h3>${esc(a.candidateName||"Ứng viên")}</h3><p>${esc(a.candidateTitle||"Marketing Candidate")}</p></div><span class="status ${cls}">${txt}</span></div><div class="candidate-details"><span>✉ ${esc(a.candidateEmail||"")}</span><span>📅 ${esc(a.date||"")}</span><span>▤ ${esc(job?.title||"Tin tuyển dụng")}</span></div><div class="tag-row">${(a.candidateSkills||[]).map(x=>`<span class="tag">${esc(x)}</span>`).join("")}</div><div class="candidate-card-bottom"><button class="btn btn-soft btn-sm" data-open-application="${a.id}">Xem CV & hồ sơ</button><button class="btn btn-dark btn-sm" data-message-application="${a.id}">✉ Nhắn tin</button></div></article>`}).join(""):`<div class="empty-state">Chưa có ứng viên nào ứng tuyển vào các tin tuyển dụng của bạn.</div>`}</div></div></div></section>`;
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

function showApplication(id){
  const a=getApplications().find(x=>String(x.id)===String(id)); if(!a) return;
  const job=getJobs().find(j=>String(j.id)===String(a.jobId));
  const cv=(a.candidateCv && typeof a.candidateCv==="object") ? a.candidateCv : null;
  const skills=a.candidateSkills || (cv?.skills ? String(cv.skills).split(",").map(x=>x.trim()).filter(Boolean) : []);
  document.getElementById("candidate-modal-content").innerHTML=`<button class="modal-close" data-close-modal="candidate-modal">×</button><div class="candidate-profile-head"><div class="avatar-xl">${esc(initials(a.candidateName||"UV"))}</div><div><span class="eyebrow">APPLICATION</span><h2>${esc(a.candidateName||"Ứng viên")}</h2><p>${esc(a.candidateTitle||cv?.title||"Marketing Candidate")} • ${esc(job?.title||"")}</p></div></div><div class="candidate-contact-strip"><span>✉ ${esc(a.candidateEmail||cv?.email||"")}</span><span>☎ ${esc(a.candidatePhone||cv?.phone||"")}</span><span>⌖ ${esc(a.candidateLocation||cv?.location||"")}</span></div><div class="detail-grid candidate-detail-grid"><div class="detail-main"><section><h3>Giới thiệu</h3><p>${esc(a.candidateAbout||cv?.about||"Ứng viên đang cập nhật giới thiệu.")}</p></section><section><h3>Kỹ năng</h3><div class="tag-row">${skills.map(x=>`<span class="tag">${esc(x)}</span>`).join("")}</div></section><section><h3>Kinh nghiệm</h3><div class="timeline"><div><i></i><b>${esc(cv?.company||a.candidateTitle||"Marketing")}</b><span>${esc(cv?.experience||a.candidateExperience||"Đang cập nhật")}</span><p>${esc(cv?.experienceDesc||"Kinh nghiệm được gửi kèm hồ sơ ứng tuyển.")}</p></div></div></section><section><h3>Học vấn</h3><p>${esc(cv?.education||a.candidateEducation||"Đang cập nhật")}</p></section>${a.coverLetter?`<section><h3>Thư giới thiệu</h3><p>${esc(a.coverLetter)}</p></section>`:""}</div><aside class="detail-side"><div class="application-box"><h3>Ứng tuyển vị trí</h3><b>${esc(job?.title||"Tin tuyển dụng")}</b><p>Ngày nộp: ${esc(a.date||"")}</p><p>${cv?"CV MoonWork đã lưu":"CV: "+esc(a.candidateCv||"Đang cập nhật")}</p></div><div class="decision-actions"><button class="btn btn-danger-soft" data-reject-application="${a.id}">✕ Từ chối</button><button class="btn btn-primary" data-accept-application="${a.id}">✓ Chấp nhận</button></div><button class="btn btn-dark btn-full" data-message-application="${a.id}">✉ Nhắn tin ứng viên</button></aside></div>`;
  openModal("candidate-modal"); bindDynamicEvents();
}

function renderCompanyProfile() {
  const user=getCurrentUser(); const p=user?.profile||{}; const company=p.company||user?.name||"Bright Media Vietnam";
  return `<section class="dashboard-page"><div class="container dashboard-grid">${employerSidebar("company-profile")}<div class="dashboard-content"><div class="dash-title"><span class="eyebrow">COMPANY PROFILE</span><h1>Thông tin công ty</h1><p>Thông tin hiển thị trên các tin tuyển dụng.</p></div><div class="profile-card"><div class="company-profile-cover"><div class="company-logo-xl">${esc(initials(company))}</div></div><div class="profile-form-grid"><div class="form-group full"><label>Tên công ty</label><input id="company-name" value="${esc(company)}"></div><div class="form-group"><label>Email</label><input id="company-email" value="${esc(p.contactEmail||user?.email||"")}"></div><div class="form-group"><label>Số điện thoại</label><input id="company-phone" value="${esc(p.phone||"")}"></div><div class="form-group"><label>Website</label><input id="company-website" value="${esc(p.website||"")}"></div><div class="form-group"><label>Quy mô</label><input id="company-size" value="${esc(p.size||"50 - 100 nhân sự")}"></div><div class="form-group"><label>Ngành nghề</label><input id="company-industry" value="${esc(p.industry||"Digital Marketing & Creative")}"></div><div class="form-group full"><label>Địa chỉ</label><input id="company-location" value="${esc(p.location||"")}"></div><div class="form-group full"><label>Giới thiệu</label><textarea id="company-description">${esc(p.description||"")}</textarea></div></div><div class="form-actions"><button class="btn btn-primary" id="save-company">Lưu thay đổi</button></div></div></div></div></section>`;
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
        <section><h3>Kinh nghiệm</h3><div class="timeline"><div><i></i><b>${esc(c.title)}</b><span>Marketing Team • 2025 - 2026</span><p>Tham gia triển khai nội dung, theo dõi chiến dịch và phối hợp cùng team để tối ưu hiệu quả marketing.</p></div></div></section>
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
  const job=getJobs().find(j=>String(j.id)===String(jobId)); if(!job) return;
  if(!state.loggedIn || state.role!=="candidate") { closeModal("job-modal"); state.selectedRole="candidate"; openAuth("login"); return; }
  const user=getCurrentUser(); const profile=user?.profile||{}; const cv=getSavedCV(user);
  document.getElementById("apply-modal-content").innerHTML=`<button class="modal-close" data-close-modal="apply-modal">×</button><div class="modal-header-simple"><span class="eyebrow">APPLICATION</span><h2>Ứng tuyển ${esc(job.title)}</h2><p>${esc(job.company)}</p></div><form id="apply-form"><div class="form-group"><label>CV sử dụng</label><label class="cv-select-card"><input type="radio" checked name="cv"><span class="file-icon">CV</span><div><b>CV - ${esc(cv.name||user?.name||"Ứng viên")}</b><small>Dữ liệu từ CV của tôi</small></div><i>✓</i></label></div><div class="form-grid"><div class="form-group"><label>Họ tên</label><input id="apply-name" value="${esc(cv.name||user?.name||"")}"></div><div class="form-group"><label>Số điện thoại</label><input id="apply-phone" value="${esc(cv.phone||profile.phone||"")}"></div></div><div class="form-group"><label>Email</label><input id="apply-email" value="${esc(cv.email||user?.email||"")}"></div><div class="form-group"><label>Thư giới thiệu</label><textarea id="apply-cover" placeholder="Viết vài dòng giới thiệu ngắn với nhà tuyển dụng...">Em quan tâm đến vị trí ${esc(job.title)} và mong có cơ hội trao đổi thêm với anh/chị về kinh nghiệm của mình.</textarea></div><button class="btn btn-primary btn-full" type="submit">Gửi CV ứng tuyển</button></form>`;
  closeModal("job-modal"); openModal("apply-modal");
  document.getElementById("apply-form").onsubmit=e=>{
    e.preventDefault(); const apps=getApplications();
    const duplicate=apps.some(a=>String(a.jobId)===String(job.id) && (String(a.candidateUserId||a.candidateId||"")===String(user?.id) || (a.candidateEmail&&user?.email&&a.candidateEmail.toLowerCase()===user.email.toLowerCase())));
    if(duplicate){ toast("Bạn đã ứng tuyển vị trí này rồi.","info"); return; }
    const name=document.getElementById("apply-name")?.value.trim()||user?.name||"Ứng viên";
    const email=document.getElementById("apply-email")?.value.trim()||user?.email||"";
    const phone=document.getElementById("apply-phone")?.value.trim()||profile.phone||"";
    const cover=document.getElementById("apply-cover")?.value.trim()||"";
    const skills=String(cv.skills||"").split(",").map(x=>x.trim()).filter(Boolean);
    const application={id:Date.now(),jobId:job.id,employerId:job.employerId||null,employerName:job.company||"",candidateId:user?.id||Date.now(),candidateUserId:user?.id||null,candidateName:name,candidateEmail:email,candidatePhone:phone,candidateTitle:cv.title||profile.title||"Marketing Candidate",candidateLocation:cv.location||profile.location||"",candidateExperience:cv.experience||profile.experience||"",candidateSkills:skills,candidateAbout:cv.about||profile.bio||"",candidateEducation:cv.education||profile.education||"",candidateCv:{...cv,name,email,phone},coverLetter:cover,date:new Date().toLocaleDateString("vi-VN"),status:"pending"};
    apps.unshift(application); setApplications(apps);
    const updatedJobs=getJobs(); const jIndex=updatedJobs.findIndex(j=>String(j.id)===String(job.id)); if(jIndex>=0){updatedJobs[jIndex].applicants=(updatedJobs[jIndex].applicants||0)+1; setJobs(updatedJobs);}
    ensureConversation(application,job,cover || `Em vừa ứng tuyển vị trí ${job.title}.`);
    closeModal("apply-modal"); toast("Ứng tuyển thành công! Bạn có thể nhắn trực tiếp với nhà tuyển dụng trong mục Tin nhắn.");
    if(state.route==="applications") render();
  };
}

function updateApplicationStatus(id,status){
  const apps=getApplications(); const idx=apps.findIndex(a=>String(a.id)===String(id)); if(idx<0)return;
  apps[idx].status=status; setApplications(apps);
  const cands=getCandidates(); const cidx=cands.findIndex(c=>String(c.id)===String(apps[idx].candidateId)); if(cidx>=0){cands[cidx].status=status; setCandidates(cands);}
  const job=getJobs().find(j=>String(j.id)===String(apps[idx].jobId));
  const conv=ensureConversation(apps[idx],job); if(conv){const all=getMessages(); const real=all.find(c=>String(c.id)===String(conv.id)); if(real){const text=status==="accepted"?`Hồ sơ của bạn cho vị trí ${job?.title||"này"} đã được chấp nhận. Chúng tôi sẽ trao đổi bước tiếp theo với bạn.`:`Cảm ơn bạn đã ứng tuyển ${job?.title||"vị trí này"}. Hiện hồ sơ chưa phù hợp với nhu cầu tuyển dụng.`; real.messages.push({senderId:getCurrentUser()?.id,senderRole:"employer",senderName:getCurrentUser()?.profile?.company||getCurrentUser()?.name||"Nhà tuyển dụng",text,time:new Date().toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"})}); real.last=text; real.time="Vừa xong"; real.unreadForCandidate=(real.unreadForCandidate||0)+1; setMessages(all);}}
  closeModal("candidate-modal"); toast(status==="accepted"?"Đã chấp nhận ứng viên.":"Đã từ chối ứng viên.",status==="accepted"?"success":"danger"); render();
}

function updateCandidateStatus(id, status) {
  const cands=getCandidates(); const idx=cands.findIndex(c=>String(c.id)===String(id));
  if(idx<0) return;
  cands[idx].status=status; setCandidates(cands);
  const mine=getEmployerApplications(); const mineIds=new Set(mine.map(a=>String(a.id))); const apps=getApplications();
  apps.forEach(a=>{if(mineIds.has(String(a.id)) && String(a.candidateId||"")===String(id)) a.status=status;});
  setApplications(apps);
  closeModal("candidate-modal");
  toast(status==="accepted"?"Đã chấp nhận ứng viên.":"Đã từ chối ứng viên.",status==="accepted"?"success":"danger");
  render();
}

function initCVPreview() {
  const saved=getSavedCV();
  document.querySelectorAll(".cv-input").forEach(input=>{const key=input.dataset.cv; if(saved[key]!==undefined && saved[key]!==null) input.value=saved[key];});
  const update=()=>{
    document.querySelectorAll(".cv-input").forEach(input=>{const key=input.dataset.cv; const target=document.querySelector(`[data-preview="${key}"]`); if(!target)return; if(key==="skills") target.innerHTML=input.value.split(",").filter(Boolean).map(x=>`<span>${esc(x.trim())}</span>`).join(""); else target.textContent=input.value;});
    const name=document.querySelector('.cv-input[data-cv="name"]')?.value||""; const avatar=document.getElementById("cv-avatar"); if(avatar) avatar.textContent=initials(name);
  };
  document.querySelectorAll(".cv-input").forEach(i=>i.addEventListener("input",update)); update();
}

function scrollChatBottom() {
  const box = document.getElementById("chat-messages"); if(box) box.scrollTop = box.scrollHeight;
}

function bindDynamicEvents() {
  document.querySelectorAll("[data-route]").forEach(el=>el.onclick=e=>{e.preventDefault();setRoute(el.dataset.route);});
  document.querySelectorAll("[data-open-job]").forEach(el=>el.onclick=e=>{e.stopPropagation();showJob(el.dataset.openJob);});
  document.querySelectorAll("[data-open-application]").forEach(el=>el.onclick=()=>showApplication(el.dataset.openApplication));
  document.querySelectorAll("[data-open-candidate]").forEach(el=>el.onclick=()=>showCandidate(el.dataset.openCandidate));
  document.querySelectorAll("[data-close-modal]").forEach(el=>el.onclick=()=>closeModal(el.dataset.closeModal));
  document.querySelectorAll("[data-apply-job]").forEach(el=>el.onclick=()=>showApply(el.dataset.applyJob));
  document.querySelectorAll("[data-accept-application]").forEach(el=>el.onclick=()=>updateApplicationStatus(el.dataset.acceptApplication,"accepted"));
  document.querySelectorAll("[data-reject-application]").forEach(el=>el.onclick=()=>updateApplicationStatus(el.dataset.rejectApplication,"rejected"));
  document.querySelectorAll("[data-accept-candidate]").forEach(el=>el.onclick=()=>updateCandidateStatus(el.dataset.acceptCandidate,"accepted"));
  document.querySelectorAll("[data-reject-candidate]").forEach(el=>el.onclick=()=>updateCandidateStatus(el.dataset.rejectCandidate,"rejected"));
  document.querySelectorAll("[data-message-application]").forEach(el=>el.onclick=()=>openConversationForApplication(el.dataset.messageApplication));
  document.querySelectorAll("[data-message-candidate]").forEach(el=>el.onclick=()=>{const c=getCandidates().find(x=>String(x.id)===String(el.dataset.messageCandidate)); const a=getEmployerApplications().find(x=>String(x.candidateId)===String(c?.id)); if(a) openConversationForApplication(a.id); else {closeModal("candidate-modal");setRoute("messages");}});
  document.querySelectorAll("[data-search-key]").forEach(el=>el.onclick=()=>{state.jobQuery=el.dataset.searchKey;setRoute("jobs");});
  document.querySelectorAll("[data-company]").forEach(el=>el.onclick=()=>{state.jobQuery=el.dataset.company;setRoute("jobs");});
  document.querySelectorAll("[data-chat-id]").forEach(el=>el.onclick=()=>{state.currentChat=el.dataset.chatId;render();});
  document.querySelectorAll("[data-close-job]").forEach(el=>el.onclick=()=>toast("Tin đã được chuyển sang trạng thái đóng.","info"));

  const homeBtn=document.getElementById("home-search-btn"); if(homeBtn) homeBtn.onclick=()=>{state.jobQuery=document.getElementById("home-job-query").value.trim();state.locationQuery=document.getElementById("home-location-query").value.trim();setRoute("jobs");};
  const jobsBtn=document.getElementById("jobs-search-btn"); if(jobsBtn) jobsBtn.onclick=()=>{state.jobQuery=document.getElementById("jobs-query").value.trim();state.locationQuery=document.getElementById("jobs-location").value.trim();render();};
  const clear=document.getElementById("clear-filter"); if(clear) clear.onclick=()=>{state.jobQuery="";state.locationQuery="";render();};

  const postForm=document.getElementById("post-job-form"); if(postForm) postForm.onsubmit=e=>{
    e.preventDefault(); const fd=new FormData(postForm); const jobs=getJobs(); const user=getCurrentUser(); const p=user?.profile||{}; const company=p.company||user?.name||"Công ty mới";
    const req=(fd.get("requirements")||"").split(";").map(x=>x.trim()).filter(Boolean); const ben=(fd.get("benefits")||"").split(";").map(x=>x.trim()).filter(Boolean); const skills=(fd.get("skills")||"").split(",").map(x=>x.trim()).filter(Boolean);
    const editId = postForm.dataset.editId ? Number(postForm.dataset.editId) : null;
    const jobData = {id:editId || Date.now(),employerId:user?.id||null,title:fd.get("title"),company,logo:initials(company),location:fd.get("location"),workingTime:fd.get("workingTime")||"Trao đổi khi phỏng vấn",quantity:Number(fd.get("quantity")||1),applyMethod:fd.get("applyMethod")||"Email",salary:fd.get("salary"),type:fd.get("type"),experience:fd.get("experience"),category:p.industry||"Marketing",skills:skills.length?skills:["Marketing"],hot:true,applicants:0,posted:"Vừa xong",description:fd.get("description")||"Mô tả công việc đang được cập nhật.",requirements:req.length?req:["Trao đổi khi phỏng vấn"],benefits:ben.length?ben:["Thỏa thuận theo năng lực"],companyDesc:p.description||`${company} đang tuyển dụng các vị trí Marketing và Creative.`};
    if(editId){
      const index = jobs.findIndex(j=>Number(j.id)===editId);
      if(index>=0) jobs[index] = {...jobs[index], ...jobData};
    }else{
      jobs.unshift(jobData);
    }
    delete postForm.dataset.editId;
    setJobs(jobs); toast("Đăng tin tuyển dụng thành công!"); setRoute("manage-jobs");
  };

    document.querySelectorAll("[data-delete-job]").forEach(btn=>btn.onclick=()=>{
    const id=Number(btn.dataset.deleteJob);
    if(!confirm("Xóa tin tuyển dụng này?")) return;
    setJobs(getJobs().filter(j=>Number(j.id)!==id));
    toast("Đã xóa tin tuyển dụng");
    render();
  });
  document.querySelectorAll("[data-edit-job]").forEach(btn=>btn.onclick=()=>{
    const id=Number(btn.dataset.editJob);
    const job=getJobs().find(j=>Number(j.id)===id);
    if(!job) return;
    setRoute("post-job");
    setTimeout(()=>{
      const form=document.getElementById("post-job-form");
      if(!form) return;
      Object.keys(job).forEach(k=>{ if(form.elements[k]) form.elements[k].value=Array.isArray(job[k])?job[k].join(","):job[k]||"";});
      form.dataset.editId=id;
    },50);
  });
const chatForm=document.getElementById("chat-form"); if(chatForm) chatForm.onsubmit=e=>{
    e.preventDefault(); const input=document.getElementById("chat-input"); const text=input.value.trim(); if(!text)return; const user=getCurrentUser(); const all=getMessages(); const conv=all.find(m=>String(m.id)===String(state.currentChat));
    if(conv){const time=new Date().toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"}); conv.messages=conv.messages||[]; conv.messages.push({senderId:user?.id,senderRole:state.role,senderName:state.role==="employer"?(user?.profile?.company||user?.name||"Nhà tuyển dụng"):(user?.name||"Ứng viên"),text,time}); conv.last=text; conv.time="Vừa xong"; if(state.role==="employer"){conv.unreadForCandidate=(conv.unreadForCandidate||0)+1;conv.unreadForEmployer=0;}else{conv.unreadForEmployer=(conv.unreadForEmployer||0)+1;conv.unreadForCandidate=0;} setMessages(all);} render();
  };

  const saveCv=document.getElementById("save-cv"); if(saveCv) saveCv.onclick=()=>{const cv={};document.querySelectorAll(".cv-input").forEach(el=>cv[el.dataset.cv]=el.value);const user=getCurrentUser();localStorage.setItem(getCvStorageKey(user),JSON.stringify(cv));localStorage.setItem("jobflow_cv",JSON.stringify(cv));if(user){user.cv=cv;user.name=cv.name||user.name;user.email=cv.email||user.email;setCurrentUser(user);const users=getUsers();const idx=users.findIndex(u=>String(u.id)===String(user.id));if(idx>=0)users[idx]=user;else users.push(user);setUsers(users);}toast("Đã lưu CV thành công! Dữ liệu sẽ giữ nguyên khi mở lại My CV.");render();};
  const resetCv=document.getElementById("reset-cv"); if(resetCv) resetCv.onclick=()=>{const user=getCurrentUser();localStorage.removeItem(getCvStorageKey(user));localStorage.removeItem("jobflow_cv");if(user){delete user.cv;setCurrentUser(user);const users=getUsers();const idx=users.findIndex(u=>String(u.id)===String(user.id));if(idx>=0){users[idx]=user;setUsers(users);}}toast("Đã làm mới CV.","info");render();};

  const saveProfile=document.getElementById("save-profile"); if(saveProfile) saveProfile.onclick=()=>{const user=getCurrentUser();if(!user)return;user.name=document.getElementById("profile-name")?.value.trim()||user.name;user.email=document.getElementById("profile-email")?.value.trim()||user.email;user.profile={...(user.profile||{}),title:document.getElementById("profile-title")?.value.trim()||"Marketing Candidate",phone:document.getElementById("profile-phone")?.value.trim()||"",location:document.getElementById("profile-location")?.value.trim()||"",bio:document.getElementById("profile-bio")?.value.trim()||"",skills:(document.getElementById("profile-skills")?.value||"").split(",").map(x=>x.trim()).filter(Boolean)};setCurrentUser(user);const users=getUsers();const idx=users.findIndex(u=>String(u.id)===String(user.id));if(idx>=0)users[idx]=user;else users.push(user);setUsers(users);toast("Đã lưu hồ sơ cá nhân.");render();};

  const saveCompany=document.getElementById("save-company"); if(saveCompany) saveCompany.onclick=()=>{const user=getCurrentUser();if(!user)return;const old=user.profile?.company||user.name;const company=document.getElementById("company-name")?.value.trim()||old;user.name=company;user.profile={...(user.profile||{}),company,contactEmail:document.getElementById("company-email")?.value.trim()||user.email||"",phone:document.getElementById("company-phone")?.value.trim()||"",website:document.getElementById("company-website")?.value.trim()||"",size:document.getElementById("company-size")?.value.trim()||"",industry:document.getElementById("company-industry")?.value.trim()||"Marketing",location:document.getElementById("company-location")?.value.trim()||"",description:document.getElementById("company-description")?.value.trim()||""};setCurrentUser(user);const users=getUsers();const idx=users.findIndex(u=>String(u.id)===String(user.id));if(idx>=0)users[idx]=user;else users.push(user);setUsers(users);const jobs=getJobs();jobs.forEach(j=>{if(String(j.employerId)===String(user.id)||j.company===old){j.company=company;j.logo=initials(company);j.companyDesc=user.profile.description||j.companyDesc;}});setJobs(jobs);const msgs=getMessages();msgs.forEach(c=>{if(String(c.employerId)===String(user.id)){c.employerName=company;c.employerAvatar=initials(company);}});setMessages(msgs);toast("Đã lưu thông tin công ty.");render();};
}

document.addEventListener("click", e => {
  if (e.target.id === "open-login") openAuth("login");
  if (e.target.id === "open-register") openAuth("register");
  if (e.target.id === "logout-btn") {
    state.loggedIn=false; state.role=null;
    localStorage.removeItem("jobflow_logged_in"); localStorage.removeItem("jobflow_role"); localStorage.removeItem("jobflow_current_user");
    toast("Đã đăng xuất.", "info"); setRoute("home");
  }
});

document.querySelectorAll(".modal-overlay").forEach(m => m.addEventListener("click", e => { if(e.target===m) closeModal(m.id); }));
document.getElementById("mobile-menu-btn").onclick = () => document.getElementById("main-nav").classList.toggle("open");
document.querySelectorAll(".auth-tab").forEach(b=>b.onclick=()=>openAuth(b.dataset.authMode));
document.querySelectorAll(".role-card").forEach(b=>b.onclick=()=>{
  state.selectedRole=b.dataset.role;
  document.querySelectorAll(".role-card").forEach(x=>x.classList.toggle("active",x===b));
  if(state.authMode==="login"){
    const email=document.getElementById("auth-email");
    const pass=document.getElementById("auth-password");
    if(email) email.value=state.selectedRole==="employer"?"hr@brightmedia.vn":"candidate@moonwork.vn";
    if(pass) pass.value="123456";
  }
});
document.getElementById("auth-form").onsubmit = e => {
  e.preventDefault();

  const email = document.getElementById("auth-email").value.trim();
  const password = document.getElementById("auth-password").value.trim();
  const nameInput = document.getElementById("auth-name");
  const name = nameInput ? nameInput.value.trim() : "Demo User";

  let users = getUsers();

  if (state.authMode === "register") {
    if (!email || !password || !name) {
      toast("Vui lòng nhập đầy đủ thông tin.", "danger");
      return;
    }

    if (users.some(u => u.email === email)) {
      toast("Email đã tồn tại.", "danger");
      return;
    }

    const user = {
      id: Date.now(),
      name,
      email,
      password,
      role: state.selectedRole,
      createdAt: new Date().toISOString(),
      profile: {
        phone:"",
        address:"",
        bio:"",
        skills:[]
      }
    };

    users.push(user);
    setUsers(users);
    setCurrentUser(user);

    state.loggedIn = true;
    state.role = user.role;

  } else {
    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      toast("Sai email hoặc mật khẩu.", "danger");
      return;
    }

    state.loggedIn = true;
    state.role = user.role;
    setCurrentUser(user);
  }

  localStorage.setItem("jobflow_logged_in","true");
  localStorage.setItem("jobflow_role",state.role);

  closeModal("auth-modal");
  toast("Đăng nhập thành công!");

  setRoute(
    state.role === "candidate"
      ? "candidate-dashboard"
      : "employer-dashboard"
  );
};

render();

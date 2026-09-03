const DEFAULT_JOBS = [
  {
    id: 1, employerId: 9001, title: "Digital Marketing Executive", company: "Bright Media Vietnam", logo: "BM",
    location: "Hà Nội", salary: "12 - 20 triệu", type: "Full-time", experience: "1 - 2 năm", category: "Marketing",
    skills: ["Facebook Ads", "Google Ads", "SEO"], hot: true, applicants: 2, posted: "2 giờ trước",
    description: "Triển khai chiến dịch Digital Marketing, tối ưu quảng cáo và theo dõi hiệu quả theo từng kênh.",
    requirements: ["Có kinh nghiệm chạy Facebook Ads/Google Ads", "Biết đọc số liệu marketing", "Chủ động và có tư duy sáng tạo"],
    benefits: ["Thưởng KPI", "Đào tạo chuyên môn", "Review lương định kỳ"],
    companyDesc: "Agency chuyên Digital Marketing, Content Marketing, SEO và xây dựng thương hiệu cho doanh nghiệp."
  },
  {
    id: 2, employerId: 9001, title: "Content Marketing Specialist", company: "Bright Media Vietnam", logo: "BM",
    location: "Hà Nội", salary: "11 - 18 triệu", type: "Hybrid", experience: "1 năm", category: "Content Marketing",
    skills: ["Content Writing", "Social Media", "Copywriting"], hot: true, applicants: 1, posted: "5 giờ trước",
    description: "Lên kế hoạch nội dung và triển khai bài viết cho Facebook, TikTok, website và các chiến dịch thương hiệu.",
    requirements: ["Khả năng viết tốt", "Hiểu social media", "Có tư duy storytelling"],
    benefits: ["Hybrid working", "Thưởng nội dung", "Budget học tập"],
    companyDesc: "Agency chuyên Digital Marketing, Content Marketing, SEO và xây dựng thương hiệu cho doanh nghiệp."
  },
  {
    id: 3, employerId: 9102, title: "Performance Marketing Specialist", company: "GrowthPilot Agency", logo: "GP",
    location: "Hồ Chí Minh", salary: "18 - 30 triệu", type: "Full-time", experience: "2 năm", category: "Performance Marketing",
    skills: ["Meta Ads", "Google Ads", "GA4"], hot: true, applicants: 24, posted: "Hôm nay",
    description: "Quản lý ngân sách quảng cáo, tối ưu CPA/ROAS và xây dựng báo cáo tăng trưởng theo dữ liệu.",
    requirements: ["Có kinh nghiệm performance", "Hiểu funnel", "Sử dụng tốt GA4"],
    benefits: ["Performance bonus", "Hybrid", "Training theo quý"],
    companyDesc: "Growth agency tập trung vào paid media, conversion và tăng trưởng doanh thu."
  },
  {
    id: 4, employerId: 9103, title: "Social Media Executive", company: "Trendify Studio", logo: "TS",
    location: "Hà Nội", salary: "12 - 22 triệu", type: "Hybrid", experience: "1 - 2 năm", category: "Social Media",
    skills: ["TikTok", "Facebook", "Content Plan"], hot: false, applicants: 28, posted: "1 ngày trước",
    description: "Quản lý kênh social, xây content calendar và phát triển cộng đồng cho nhiều thương hiệu.",
    requirements: ["Biết bắt trend", "Có kinh nghiệm quản lý fanpage", "Hiểu hành vi người dùng"],
    benefits: ["Làm việc linh hoạt", "Creative environment", "Thưởng campaign"],
    companyDesc: "Studio phát triển nội dung social và creative campaign."
  },
  {
    id: 5, employerId: 9104, title: "SEO Specialist", company: "SearchUp Digital", logo: "SD",
    location: "Remote", salary: "15 - 28 triệu", type: "Remote", experience: "2 năm", category: "SEO",
    skills: ["SEO", "Search Console", "Keyword Research"], hot: false, applicants: 19, posted: "1 ngày trước",
    description: "Nghiên cứu từ khóa, tối ưu on-page và phối hợp xây dựng nội dung để tăng organic traffic.",
    requirements: ["Có kinh nghiệm SEO", "Biết Search Console", "Tư duy phân tích tốt"],
    benefits: ["Remote", "Thưởng theo kết quả", "Flexible time"],
    companyDesc: "Digital agency chuyên SEO và organic growth."
  },
  {
    id: 6, employerId: 9105, title: "Graphic Designer - Marketing", company: "Pixel Creative Agency", logo: "PC",
    location: "Hà Nội", salary: "12 - 25 triệu", type: "Full-time", experience: "1 - 2 năm", category: "Design",
    skills: ["Photoshop", "Illustrator", "Branding"], hot: false, applicants: 24, posted: "2 ngày trước",
    description: "Thiết kế social post, key visual, banner quảng cáo và các ấn phẩm truyền thông cho chiến dịch marketing.",
    requirements: ["Có portfolio", "Thành thạo công cụ thiết kế", "Cảm quan thẩm mỹ tốt"],
    benefits: ["Creative workspace", "Training", "Thưởng dự án"],
    companyDesc: "Agency thiết kế và xây dựng nhận diện thương hiệu."
  },
  {
    id: 7, employerId: 9106, title: "Brand Marketing Executive", company: "Nova Lifestyle", logo: "NL",
    location: "Hồ Chí Minh", salary: "18 - 30 triệu", type: "Full-time", experience: "2 năm", category: "Branding",
    skills: ["Brand Strategy", "Campaign", "Research"], hot: true, applicants: 15, posted: "2 ngày trước",
    description: "Xây dựng kế hoạch thương hiệu và phối hợp triển khai campaign đa kênh.",
    requirements: ["Có kinh nghiệm branding", "Tư duy chiến lược", "Kỹ năng quản lý dự án"],
    benefits: ["Bonus dự án", "Bảo hiểm sức khỏe", "Môi trường chuyên nghiệp"],
    companyDesc: "Thương hiệu lifestyle đang mở rộng thị trường tại Việt Nam."
  },
  {
    id: 8, employerId: 9107, title: "E-commerce Marketing Specialist", company: "ShopHub Vietnam", logo: "SH",
    location: "Hồ Chí Minh", salary: "15 - 30 triệu", type: "Full-time", experience: "2 năm", category: "E-commerce",
    skills: ["Shopee", "TikTok Shop", "Ads"], hot: true, applicants: 32, posted: "3 ngày trước",
    description: "Quản lý hoạt động marketing trên marketplace, tối ưu quảng cáo và chương trình bán hàng.",
    requirements: ["Có kinh nghiệm marketplace", "Biết tối ưu ads", "Theo dõi số liệu tốt"],
    benefits: ["Thưởng doanh số", "Đào tạo e-commerce", "Team building"],
    companyDesc: "Doanh nghiệp thương mại điện tử đa ngành."
  },
  {
    id: 9, employerId: 9108, title: "CRM & Email Marketing Executive", company: "GrowthMail Labs", logo: "GL",
    location: "Hà Nội", salary: "14 - 24 triệu", type: "Hybrid", experience: "1 - 2 năm", category: "CRM Marketing",
    skills: ["CRM", "Email Marketing", "Automation"], hot: false, applicants: 17, posted: "4 ngày trước",
    description: "Xây dựng lifecycle campaign, email automation và phân nhóm khách hàng theo hành vi.",
    requirements: ["Hiểu CRM", "Biết email automation", "Có tư duy data-driven"],
    benefits: ["Hybrid", "Thưởng hiệu quả", "Budget khóa học"],
    companyDesc: "Công ty MarTech chuyên CRM, automation và retention marketing."
  },
  {
    id: 10, employerId: 9001, title: "Marketing Intern", company: "Bright Media Vietnam", logo: "BM",
    location: "Hà Nội", salary: "3 - 6 triệu", type: "Internship", experience: "Fresher", category: "Marketing",
    skills: ["Research", "Social Media", "Excel"], hot: false, applicants: 0, posted: "5 ngày trước",
    description: "Hỗ trợ team marketing nghiên cứu thị trường, chuẩn bị nội dung và theo dõi số liệu chiến dịch.",
    requirements: ["Chăm chỉ", "Có tinh thần học hỏi", "Yêu thích marketing"],
    benefits: ["Hỗ trợ dấu thực tập", "Mentor trực tiếp", "Cơ hội lên chính thức"],
    companyDesc: "Agency chuyên Digital Marketing, Content Marketing, SEO và xây dựng thương hiệu cho doanh nghiệp."
  }
];

const DEFAULT_CANDIDATES = [
  {
    id: 8001, userId: 8001, name: "Nguyễn Văn A", title: "Digital Marketing Candidate", avatar: "NA",
    email: "candidate@moonwork.vn", phone: "0901 234 567", location: "Hà Nội", experience: "1 năm",
    skills: ["Facebook Ads", "Google Ads", "Content Marketing", "Social Media", "SEO"],
    education: "Đại học Thương mại — Marketing",
    about: "Ứng viên Marketing quan tâm đến Digital Marketing, Content, Social Media và tối ưu chiến dịch theo dữ liệu.",
    appliedJobId: 1, appliedAt: "03/09/2026", status: "pending", score: 92
  },
  {
    id: 102, name: "Lê Thu Trang", title: "Content Marketing Specialist", avatar: "TT",
    email: "thutrang.content@gmail.com", phone: "0966 551 991", location: "Hà Nội", experience: "1.5 năm",
    skills: ["Content Writing", "TikTok", "Facebook", "Copywriting"], education: "Học viện Báo chí và Tuyên truyền",
    about: "Content Marketer có thế mạnh storytelling, social content và triển khai nội dung theo insight khách hàng.",
    appliedJobId: 2, appliedAt: "01/09/2026", status: "accepted", score: 91
  }
];

// Conversation được lưu theo đúng 2 phía. senderRole quyết định bubble nào là "mình" khi đổi tài khoản.
const DEFAULT_MESSAGES = [
  {
    id: "conv_8001_9001_1",
    candidateUserId: 8001,
    candidateName: "Nguyễn Văn A",
    candidateEmail: "candidate@moonwork.vn",
    candidateAvatar: "NA",
    employerId: 9001,
    employerName: "Bright Media Vietnam",
    employerAvatar: "BM",
    jobId: 1,
    jobTitle: "Digital Marketing Executive",
    last: "Bạn có thể trao đổi nhanh về campaign gần nhất không?",
    time: "21:14",
    unreadForCandidate: 1,
    unreadForEmployer: 0,
    messages: [
      { senderId: 9001, senderRole: "employer", senderName: "Bright Media Vietnam", text: "Chào bạn, team đã xem hồ sơ Marketing của bạn.", time: "20:42" },
      { senderId: 8001, senderRole: "candidate", senderName: "Nguyễn Văn A", text: "Dạ em cảm ơn anh/chị đã phản hồi ạ.", time: "20:45" },
      { senderId: 9001, senderRole: "employer", senderName: "Bright Media Vietnam", text: "Bạn có thể trao đổi nhanh về campaign gần nhất không?", time: "21:14" }
    ]
  }
];

const DEFAULT_APPLICATIONS = [
  {
    id: 301, jobId: 1, employerId: 9001, employerName: "Bright Media Vietnam",
    candidateId: 8001, candidateUserId: 8001, candidateName: "Nguyễn Văn A", candidateEmail: "candidate@moonwork.vn",
    candidatePhone: "0901 234 567", candidateTitle: "Digital Marketing Candidate",
    candidateLocation: "Hà Nội", candidateExperience: "1 năm",
    candidateSkills: ["Facebook Ads", "Google Ads", "Content Marketing", "Social Media", "SEO"],
    candidateAbout: "Ứng viên Marketing quan tâm đến Digital Marketing, Content, Social Media và tối ưu chiến dịch theo dữ liệu.",
    candidateEducation: "Đại học Thương mại — Marketing",
    candidateCv: {
      name: "Nguyễn Văn A", title: "Digital Marketing Candidate", email: "candidate@moonwork.vn", phone: "0901 234 567",
      location: "Hà Nội", about: "Ứng viên Marketing quan tâm đến Digital Marketing, Content, Social Media và tối ưu chiến dịch theo dữ liệu.",
      skills: "Facebook Ads, Google Ads, Content Marketing, Social Media, SEO",
      company: "Bright Media Vietnam", experience: "Marketing Intern • 2025 - 2026",
      experienceDesc: "Hỗ trợ triển khai nội dung social, theo dõi quảng cáo và tổng hợp báo cáo chiến dịch.",
      education: "Đại học Thương mại • Marketing • 2023 - 2026"
    },
    coverLetter: "Em quan tâm đến vị trí Digital Marketing Executive và mong có cơ hội trao đổi thêm với anh/chị.",
    date: "03/09/2026", status: "pending"
  },
  {
    id: 302, jobId: 2, employerId: 9001, employerName: "Bright Media Vietnam",
    candidateId: 102, candidateName: "Lê Thu Trang", candidateEmail: "thutrang.content@gmail.com",
    candidatePhone: "0966 551 991", candidateTitle: "Content Marketing Specialist",
    candidateLocation: "Hà Nội", candidateExperience: "1.5 năm",
    candidateSkills: ["Content Writing", "TikTok", "Facebook", "Copywriting"],
    candidateAbout: "Content Marketer có thế mạnh storytelling, social content và triển khai nội dung theo insight khách hàng.",
    candidateEducation: "Học viện Báo chí và Tuyên truyền",
    candidateCv: "Content-CV-Le-Thu-Trang.pdf", date: "01/09/2026", status: "accepted"
  }
];

const JOBFLOW_DATA_VERSION = "marketing-linked-chat-v6";

function seedData() {
  const currentVersion = localStorage.getItem("jobflow_data_version");

  if (currentVersion !== JOBFLOW_DATA_VERSION) {
    let oldJobs = [];
    let oldApps = [];
    let oldMessages = [];
    try { oldJobs = JSON.parse(localStorage.getItem("jobflow_jobs") || "[]"); } catch (_) {}
    try { oldApps = JSON.parse(localStorage.getItem("jobflow_applications") || "[]"); } catch (_) {}
    try { oldMessages = JSON.parse(localStorage.getItem("jobflow_messages") || "[]"); } catch (_) {}

    const customJobs = oldJobs.filter(j => Number(j.id) > 1000000000000);
    const customApps = oldApps.filter(a => Number(a.id) > 1000000000000);
    const linkedMessages = oldMessages.filter(m => m && m.candidateUserId && m.employerId && Array.isArray(m.messages));

    localStorage.setItem("jobflow_jobs", JSON.stringify([...customJobs, ...DEFAULT_JOBS]));
    localStorage.setItem("jobflow_candidates", JSON.stringify(DEFAULT_CANDIDATES));
    localStorage.setItem("jobflow_applications", JSON.stringify([...customApps, ...DEFAULT_APPLICATIONS]));
    localStorage.setItem("jobflow_messages", JSON.stringify(linkedMessages.length ? linkedMessages : DEFAULT_MESSAGES));
    localStorage.setItem("jobflow_data_version", JOBFLOW_DATA_VERSION);
    return;
  }

  if (!localStorage.getItem("jobflow_jobs")) localStorage.setItem("jobflow_jobs", JSON.stringify(DEFAULT_JOBS));
  if (!localStorage.getItem("jobflow_candidates")) localStorage.setItem("jobflow_candidates", JSON.stringify(DEFAULT_CANDIDATES));
  if (!localStorage.getItem("jobflow_messages")) localStorage.setItem("jobflow_messages", JSON.stringify(DEFAULT_MESSAGES));
  if (!localStorage.getItem("jobflow_applications")) localStorage.setItem("jobflow_applications", JSON.stringify(DEFAULT_APPLICATIONS));
}

seedData();

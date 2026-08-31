const DEFAULT_JOBS = [
  {
    id: 1,
    title: "Unity Game Developer",
    company: "Nova Game Studio",
    logo: "NG",
    location: "Hà Nội",
    salary: "15 - 25 triệu",
    type: "Full-time",
    experience: "1 - 2 năm",
    category: "Game / IT",
    skills: ["Unity", "C#", "Git"],
    hot: true,
    applicants: 12,
    posted: "2 giờ trước",
    description: "Phát triển gameplay, hệ thống nhân vật và tối ưu hiệu năng game Unity 2D/3D.",
    requirements: ["Có kinh nghiệm Unity và C#", "Hiểu OOP, Git, game loop", "Chủ động tìm hiểu và xử lý bug"],
    benefits: ["Thưởng dự án", "Review lương 2 lần/năm", "Thiết bị làm việc đầy đủ"],
    companyDesc: "Studio phát triển game mobile tập trung vào trải nghiệm gameplay có chiều sâu."
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "PixelCraft Technology",
    logo: "PC",
    location: "Hồ Chí Minh",
    salary: "18 - 30 triệu",
    type: "Full-time",
    experience: "2 năm",
    category: "Software",
    skills: ["JavaScript", "React", "CSS"],
    hot: true,
    applicants: 24,
    posted: "5 giờ trước",
    description: "Xây dựng và tối ưu giao diện web hiện đại, responsive, chú trọng UX và hiệu năng.",
    requirements: ["Thành thạo JavaScript", "Nắm chắc HTML/CSS", "Có tư duy component"],
    benefits: ["Hybrid working", "MacBook làm việc", "Team building hàng quý"],
    companyDesc: "Công ty công nghệ chuyên phát triển sản phẩm SaaS và nền tảng thương mại điện tử."
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Mango Digital",
    logo: "MD",
    location: "Hà Nội",
    salary: "14 - 22 triệu",
    type: "Hybrid",
    experience: "1 năm",
    category: "Design",
    skills: ["Figma", "Prototype", "Design System"],
    hot: false,
    applicants: 9,
    posted: "1 ngày trước",
    description: "Thiết kế web/app từ wireframe đến high-fidelity, phối hợp cùng Product và Dev.",
    requirements: ["Sử dụng tốt Figma", "Có portfolio UI/UX", "Hiểu design system"],
    benefits: ["Flexible time", "Budget học tập", "Môi trường trẻ"],
    companyDesc: "Digital agency chuyên thiết kế trải nghiệm số cho startup và doanh nghiệp."
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "CloudPeak Solutions",
    logo: "CS",
    location: "Đà Nẵng",
    salary: "20 - 35 triệu",
    type: "Full-time",
    experience: "2 - 3 năm",
    category: "Software",
    skills: ["Node.js", "PostgreSQL", "Docker"],
    hot: false,
    applicants: 17,
    posted: "1 ngày trước",
    description: "Phát triển REST API, hệ thống xử lý dữ liệu và dịch vụ backend.",
    requirements: ["Node.js hoặc tương đương", "Biết SQL", "Hiểu REST API"],
    benefits: ["Remote 2 ngày/tuần", "Bảo hiểm sức khỏe", "Lộ trình Tech Lead"],
    companyDesc: "Đơn vị tư vấn và triển khai hạ tầng cloud cho doanh nghiệp."
  },
  {
    id: 5,
    title: "Marketing Executive",
    company: "EverGreen Commerce",
    logo: "EC",
    location: "Hồ Chí Minh",
    salary: "12 - 18 triệu",
    type: "Full-time",
    experience: "1 năm",
    category: "Marketing",
    skills: ["Content", "Ads", "Analytics"],
    hot: false,
    applicants: 21,
    posted: "2 ngày trước",
    description: "Lên kế hoạch nội dung, phối hợp chạy chiến dịch và theo dõi hiệu quả marketing.",
    requirements: ["Có tư duy nội dung", "Biết theo dõi số liệu", "Chủ động phối hợp team"],
    benefits: ["KPI bonus", "Du lịch công ty", "Thưởng lễ Tết"],
    companyDesc: "Doanh nghiệp thương mại điện tử đa ngành tại Việt Nam."
  },
  {
    id: 6,
    title: "QA / Game Tester",
    company: "Nova Game Studio",
    logo: "NG",
    location: "Hà Nội",
    salary: "10 - 16 triệu",
    type: "Full-time",
    experience: "Fresher",
    category: "Game / IT",
    skills: ["Testing", "Jira", "Game"],
    hot: false,
    applicants: 31,
    posted: "3 ngày trước",
    description: "Kiểm thử gameplay, ghi nhận bug và phối hợp cùng developer để đảm bảo chất lượng bản build.",
    requirements: ["Yêu thích game", "Cẩn thận, logic", "Biết viết bug report"],
    benefits: ["Được chơi build sớm", "Đào tạo quy trình QA", "Môi trường game studio"],
    companyDesc: "Studio phát triển game mobile tập trung vào trải nghiệm gameplay có chiều sâu."
  }
];

const DEFAULT_CANDIDATES = [
  {
    id: 101,
    name: "Nguyễn Minh Anh",
    title: "Unity Game Developer",
    avatar: "MA",
    email: "minhanh.dev@gmail.com",
    phone: "0988 123 456",
    location: "Hà Nội",
    experience: "2 năm",
    skills: ["Unity", "C#", "Git", "2D Game"],
    education: "FPT Polytechnic — Lập trình Game",
    about: "Game Developer tập trung vào Unity, gameplay systems và tối ưu trải nghiệm người chơi.",
    appliedJobId: 1,
    appliedAt: "31/08/2026",
    status: "pending",
    score: 92
  },
  {
    id: 102,
    name: "Trần Quốc Huy",
    title: "Junior Game Developer",
    avatar: "QH",
    email: "quochuy.dev@gmail.com",
    phone: "0977 222 188",
    location: "Hà Nội",
    experience: "1 năm",
    skills: ["Unity", "C#", "OOP"],
    education: "Đại học Công nghiệp Hà Nội",
    about: "Junior Developer yêu thích phát triển game 2D và AI cho NPC.",
    appliedJobId: 1,
    appliedAt: "30/08/2026",
    status: "pending",
    score: 85
  },
  {
    id: 103,
    name: "Lê Thu Trang",
    title: "Frontend Developer",
    avatar: "TT",
    email: "trang.frontend@gmail.com",
    phone: "0966 551 991",
    location: "Hồ Chí Minh",
    experience: "2 năm",
    skills: ["React", "JavaScript", "CSS", "Figma"],
    education: "Đại học Công nghệ TP.HCM",
    about: "Frontend Developer chú trọng UI quality, accessibility và hiệu năng.",
    appliedJobId: 2,
    appliedAt: "29/08/2026",
    status: "accepted",
    score: 90
  },
  {
    id: 104,
    name: "Phạm Đức Long",
    title: "Backend Developer",
    avatar: "DL",
    email: "duclong.backend@gmail.com",
    phone: "0911 901 202",
    location: "Đà Nẵng",
    experience: "3 năm",
    skills: ["Node.js", "PostgreSQL", "Docker"],
    education: "Đại học Bách Khoa Đà Nẵng",
    about: "Backend Engineer có kinh nghiệm xây dựng API và hệ thống cloud-native.",
    appliedJobId: 4,
    appliedAt: "27/08/2026",
    status: "rejected",
    score: 81
  }
];

const DEFAULT_MESSAGES = [
  {
    id: 1,
    person: "Nova Game Studio",
    avatar: "NG",
    role: "Nhà tuyển dụng",
    last: "Bạn có thể phỏng vấn vào chiều thứ 3 không?",
    time: "21:14",
    unread: 2,
    messages: [
      {from: "them", text: "Chào bạn, chúng tôi đã xem CV của bạn.", time: "20:42"},
      {from: "me", text: "Dạ em cảm ơn anh/chị đã phản hồi ạ.", time: "20:45"},
      {from: "them", text: "Bạn có thể phỏng vấn vào chiều thứ 3 không?", time: "21:14"}
    ]
  },
  {
    id: 2,
    person: "PixelCraft Technology",
    avatar: "PC",
    role: "Nhà tuyển dụng",
    last: "Cảm ơn bạn đã quan tâm vị trí Frontend.",
    time: "Hôm qua",
    unread: 0,
    messages: [
      {from: "them", text: "Cảm ơn bạn đã quan tâm vị trí Frontend.", time: "16:22"}
    ]
  }
];

const DEFAULT_APPLICATIONS = [
  {id: 301, jobId: 3, candidateName: "Nguyễn Văn A", date: "28/08/2026", status: "pending"},
  {id: 302, jobId: 5, candidateName: "Nguyễn Văn A", date: "25/08/2026", status: "accepted"}
];

function seedData() {
  if (!localStorage.getItem("jobflow_jobs")) localStorage.setItem("jobflow_jobs", JSON.stringify(DEFAULT_JOBS));
  if (!localStorage.getItem("jobflow_candidates")) localStorage.setItem("jobflow_candidates", JSON.stringify(DEFAULT_CANDIDATES));
  if (!localStorage.getItem("jobflow_messages")) localStorage.setItem("jobflow_messages", JSON.stringify(DEFAULT_MESSAGES));
  if (!localStorage.getItem("jobflow_applications")) localStorage.setItem("jobflow_applications", JSON.stringify(DEFAULT_APPLICATIONS));
}
seedData();

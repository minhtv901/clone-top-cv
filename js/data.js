const DEFAULT_JOBS = [

{
id:1,
title:"Digital Marketing Executive",
company:"Bright Media Vietnam",
logo:"BM",
location:"Hà Nội",
salary:"12 - 20 triệu",
type:"Full-time",
experience:"1 - 2 năm",
category:"Marketing",
skills:["Facebook Ads","Google Ads","SEO"],
hot:true,
applicants:42,
posted:"2 giờ trước",
description:"Triển khai chiến dịch Digital Marketing, tối ưu quảng cáo và phân tích hiệu quả marketing.",
requirements:[
"Có kinh nghiệm chạy Facebook Ads/Google Ads",
"Biết phân tích dữ liệu marketing",
"Có tư duy sáng tạo"
],
benefits:[
"Thưởng KPI",
"Đào tạo chuyên môn",
"Team building"
],
companyDesc:"Agency marketing chuyên triển khai chiến dịch cho thương hiệu lớn."
},


{
id:2,
title:"Content Marketing Specialist",
company:"Creative House",
logo:"CH",
location:"Hồ Chí Minh",
salary:"10 - 18 triệu",
type:"Full-time",
experience:"1 năm",
category:"Content",
skills:["Content Writing","Social Media","Copywriting"],
hot:true,
applicants:36,
posted:"5 giờ trước",
description:"Xây dựng nội dung cho Facebook, TikTok, Website và các nền tảng truyền thông.",
requirements:[
"Khả năng viết tốt",
"Hiểu social media",
"Có tư duy storytelling"
],
benefits:[
"Môi trường sáng tạo",
"Thưởng nội dung"
],
companyDesc:"Công ty chuyên sản xuất nội dung và truyền thông thương hiệu."
},


{
id:3,
title:"Social Media Executive",
company:"Trendify Studio",
logo:"TS",
location:"Hà Nội",
salary:"12 - 22 triệu",
type:"Hybrid",
experience:"1 - 2 năm",
category:"Marketing",
skills:["TikTok","Facebook","Content Plan"],
hot:false,
applicants:28,
posted:"Hôm nay",
description:"Quản lý kênh social, lên kế hoạch nội dung và phát triển cộng đồng.",
requirements:[
"Có kinh nghiệm quản lý fanpage",
"Biết bắt trend",
"Hiểu hành vi người dùng"
],
benefits:[
"Làm việc linh hoạt",
"Creative environment"
],
companyDesc:"Studio phát triển nội dung social cho nhiều thương hiệu."
},


{
id:4,
title:"SEO Specialist",
company:"Growth Digital",
logo:"GD",
location:"Remote",
salary:"15 - 28 triệu",
type:"Remote",
experience:"2 năm",
category:"Marketing",
skills:["SEO","Google Analytics","Keyword Research"],
hot:false,
applicants:19,
posted:"1 ngày trước",
description:"Tối ưu SEO website, nghiên cứu từ khóa và tăng trưởng traffic.",
requirements:[
"Có kinh nghiệm SEO",
"Biết Google Search Console",
"Tư duy phân tích"
],
benefits:[
"Remote",
"Thưởng theo kết quả"
],
companyDesc:"Agency chuyên Growth Marketing."
},


{
id:5,
title:"Brand Marketing Executive",
company:"Nova Lifestyle",
logo:"NL",
location:"Hồ Chí Minh",
salary:"18 - 30 triệu",
type:"Full-time",
experience:"2 năm",
category:"Branding",
skills:["Brand Strategy","Campaign","Research"],
hot:true,
applicants:15,
posted:"2 ngày trước",
description:"Xây dựng chiến lược thương hiệu và triển khai các chiến dịch marketing.",
requirements:[
"Có kinh nghiệm branding",
"Tư duy chiến lược",
"Kỹ năng quản lý dự án"
],
benefits:[
"Bonus dự án",
"Môi trường chuyên nghiệp"
],
companyDesc:"Thương hiệu lifestyle đang mở rộng thị trường."
},


{
id:6,
title:"Graphic Designer",
company:"Pixel Creative Agency",
logo:"PC",
location:"Hà Nội",
salary:"12 - 25 triệu",
type:"Full-time",
experience:"1 - 2 năm",
category:"Design",
skills:["Photoshop","Illustrator","Figma"],
hot:false,
applicants:24,
posted:"2 ngày trước",
description:"Thiết kế hình ảnh quảng cáo, social post và bộ nhận diện thương hiệu.",
requirements:[
"Có portfolio",
"Thành thạo công cụ thiết kế",
"Cảm quan thẩm mỹ tốt"
],
benefits:[
"Creative workspace",
"Training"
],
companyDesc:"Agency thiết kế và xây dựng thương hiệu."
},


{
id:7,
title:"Marketing Intern",
company:"Global Commerce",
logo:"GC",
location:"Hà Nội",
salary:"3 - 6 triệu",
type:"Internship",
experience:"Fresher",
category:"Marketing",
skills:["Research","Social Media","Excel"],
hot:false,
applicants:60,
posted:"3 ngày trước",
description:"Hỗ trợ team marketing triển khai nội dung và nghiên cứu thị trường.",
requirements:[
"Chăm chỉ",
"Có tinh thần học hỏi",
"Yêu thích marketing"
],
benefits:[
"Hỗ trợ dấu thực tập",
"Cơ hội lên chính thức"
],
companyDesc:"Công ty thương mại điện tử."
},


{
id:8,
title:"E-commerce Marketing Specialist",
company:"ShopHub Vietnam",
logo:"SH",
location:"Hồ Chí Minh",
salary:"15 - 30 triệu",
type:"Full-time",
experience:"2 năm",
category:"E-commerce",
skills:["Shopee","TikTok Shop","Ads"],
hot:true,
applicants:32,
posted:"4 ngày trước",
description:"Quản lý marketing trên các nền tảng thương mại điện tử.",
requirements:[
"Có kinh nghiệm marketplace",
"Biết tối ưu quảng cáo"
],
benefits:[
"Thưởng doanh số",
"Được học Ecommerce"
],
companyDesc:"Nền tảng bán hàng online."
},


{
id:9,
title:"Business Development Executive",
company:"NextGrowth",
logo:"NG",
location:"Đà Nẵng",
salary:"15 - 35 triệu",
type:"Full-time",
experience:"1 - 3 năm",
category:"Business",
skills:["Sales","Negotiation","CRM"],
hot:false,
applicants:20,
posted:"5 ngày trước",
description:"Phát triển khách hàng và mở rộng thị trường.",
requirements:[
"Kỹ năng giao tiếp tốt",
"Có tư duy kinh doanh"
],
benefits:[
"Hoa hồng cao",
"Career path"
],
companyDesc:"Công ty cung cấp giải pháp doanh nghiệp."
},


{
id:10,
title:"HR Recruitment Specialist",
company:"Talent Pro",
logo:"TP",
location:"Hà Nội",
salary:"14 - 25 triệu",
type:"Full-time",
experience:"1 - 2 năm",
category:"Human Resource",
skills:["Recruitment","Communication","HR"],
hot:false,
applicants:18,
posted:"1 tuần trước",
description:"Tuyển dụng nhân sự và xây dựng nguồn ứng viên.",
requirements:[
"Có kinh nghiệm tuyển dụng",
"Kỹ năng giao tiếp tốt"
],
benefits:[
"Thưởng tuyển dụng",
"Môi trường chuyên nghiệp"
],
companyDesc:"Công ty dịch vụ nhân sự."
}

];

const DEFAULT_APPLICATIONS = [
  {id: 301, jobId: 3, candidateName: "Nguyễn Văn A", date: "28/08/2026", status: "pending"},
  {id: 302, jobId: 5, candidateName: "Nguyễn Văn A", date: "25/08/2026", status: "accepted"}
];


  const extraJobs = [
    {id:20,title:"UI/UX Designer",company:"Lumi Creative Studio",logo:"LC",location:"Hà Nội",salary:"12 - 22 triệu",type:"Full-time",experience:"1 năm",category:"Design",skills:["Figma","UX Research","Prototype"],hot:true,applicants:8,posted:"1 giờ trước",description:"Thiết kế trải nghiệm sản phẩm số.",requirements:["Có portfolio","Thành thạo Figma"],benefits:["Môi trường sáng tạo"],companyDesc:"Studio thiết kế sản phẩm số."},
    {id:21,title:"Backend Developer NodeJS",company:"CloudNova",logo:"CN",location:"Remote",salary:"20 - 40 triệu",type:"Remote",experience:"2 - 3 năm",category:"Software",skills:["NodeJS","API","Database"],hot:false,applicants:15,posted:"3 giờ trước",description:"Xây dựng API và hệ thống backend.",requirements:["NodeJS","REST API"],benefits:["Remote linh hoạt"],companyDesc:"Công ty công nghệ cloud."},
    {id:22,title:"Game Artist 2D",company:"Pixel Game Lab",logo:"PG",location:"Đà Nẵng",salary:"15 - 28 triệu",type:"Full-time",experience:"1 - 2 năm",category:"Game",skills:["Photoshop","Spine","2D"],hot:true,applicants:6,posted:"Hôm nay",description:"Tạo asset và animation cho game.",requirements:["Có portfolio game"],benefits:["Thưởng dự án"],companyDesc:"Game studio độc lập."}
  ];

function seedData() {
  if (!localStorage.getItem("jobflow_jobs")) localStorage.setItem("jobflow_jobs", JSON.stringify([...DEFAULT_JOBS, ...extraJobs]));
  else {
    const current=JSON.parse(localStorage.getItem("jobflow_jobs"));
    if(current.length < 10){
      localStorage.setItem("jobflow_jobs", JSON.stringify([...current, ...extraJobs.filter(j=>!current.some(x=>x.id===j.id))]));
    }
  }
  if (!localStorage.getItem("jobflow_candidates")) localStorage.setItem("jobflow_candidates", JSON.stringify(DEFAULT_CANDIDATES));
  if (!localStorage.getItem("jobflow_messages")) localStorage.setItem("jobflow_messages", JSON.stringify(DEFAULT_MESSAGES));
  if (!localStorage.getItem("jobflow_applications")) localStorage.setItem("jobflow_applications", JSON.stringify(DEFAULT_APPLICATIONS));
}
seedData();

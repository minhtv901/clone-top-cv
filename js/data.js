const DEFAULT_JOBS = [

{
id:1,
title:"Unity Game Developer",
company:"Nova Game Studio",
logo:"NG",
location:"Hà Nội",
salary:"15 - 25 triệu",
type:"Full-time",
experience:"1 - 2 năm",
category:"Game / IT",
skills:["Unity","C#","Git"],
hot:true,
applicants:12,
posted:"2 giờ trước",
description:"Phát triển gameplay, hệ thống nhân vật và tối ưu hiệu năng game Unity.",
requirements:[
"Có kinh nghiệm Unity và C#",
"Hiểu OOP, Game Loop",
"Có tư duy xử lý bug"
],
benefits:[
"Thưởng dự án",
"Review lương",
"Thiết bị làm việc"
],
companyDesc:"Studio phát triển game mobile và PC."
},


{
id:2,
title:"Frontend Developer",
company:"PixelCraft Technology",
logo:"PC",
location:"Hồ Chí Minh",
salary:"18 - 32 triệu",
type:"Full-time",
experience:"2 năm",
category:"Software",
skills:["React","Javascript","CSS"],
hot:true,
applicants:24,
posted:"5 giờ trước",
description:"Xây dựng giao diện web hiện đại, tối ưu UX và hiệu năng.",
requirements:[
"Thành thạo React",
"Biết responsive design",
"Có tư duy component"
],
benefits:[
"Hybrid working",
"Macbook",
"Team building"
],
companyDesc:"Công ty phát triển nền tảng SaaS."
},


{
id:3,
title:"UI/UX Designer",
company:"Lumi Creative Studio",
logo:"LC",
location:"Hà Nội",
salary:"14 - 25 triệu",
type:"Hybrid",
experience:"1 - 2 năm",
category:"Design",
skills:["Figma","Prototype","UX Research"],
hot:true,
applicants:18,
posted:"3 giờ trước",
description:"Thiết kế trải nghiệm người dùng cho web và mobile app.",
requirements:[
"Có portfolio UI/UX",
"Thành thạo Figma",
"Hiểu Design System"
],
benefits:[
"Flexible time",
"Creative environment"
],
companyDesc:"Agency chuyên thiết kế sản phẩm số."
},


{
id:4,
title:"Digital Marketing Executive",
company:"EverGreen Commerce",
logo:"EC",
location:"Hà Nội",
salary:"12 - 20 triệu",
type:"Full-time",
experience:"1 năm",
category:"Marketing",
skills:["SEO","Facebook Ads","Content"],
hot:false,
applicants:35,
posted:"Hôm nay",
description:"Lên kế hoạch marketing online và triển khai chiến dịch quảng cáo.",
requirements:[
"Có kinh nghiệm chạy Ads",
"Biết phân tích dữ liệu",
"Tư duy sáng tạo"
],
benefits:[
"KPI Bonus",
"Du lịch hàng năm"
],
companyDesc:"Doanh nghiệp thương mại điện tử."
},


{
id:5,
title:"Content Creator",
company:"Media House Vietnam",
logo:"MH",
location:"Hồ Chí Minh",
salary:"10 - 18 triệu",
type:"Full-time",
experience:"Fresher",
category:"Content / Media",
skills:["Writing","Video","Social Media"],
hot:false,
applicants:42,
posted:"1 ngày trước",
description:"Sáng tạo nội dung cho TikTok, Facebook và website.",
requirements:[
"Viết content tốt",
"Biết edit video cơ bản"
],
benefits:[
"Môi trường trẻ",
"Được đào tạo"
],
companyDesc:"Công ty truyền thông và sáng tạo nội dung."
},


{
id:6,
title:"Backend Developer",
company:"CloudPeak Solutions",
logo:"CS",
location:"Đà Nẵng",
salary:"22 - 40 triệu",
type:"Full-time",
experience:"2 - 3 năm",
category:"Software",
skills:["NodeJS","SQL","Docker"],
hot:false,
applicants:16,
posted:"2 ngày trước",
description:"Xây dựng API và hệ thống backend cho doanh nghiệp.",
requirements:[
"NodeJS",
"Database",
"REST API"
],
benefits:[
"Remote",
"Health Insurance"
],
companyDesc:"Công ty cloud technology."
},


{
id:7,
title:"Graphic Designer",
company:"Creative Lab",
logo:"CL",
location:"Hà Nội",
salary:"12 - 22 triệu",
type:"Full-time",
experience:"1 năm",
category:"Design",
skills:["Photoshop","Illustrator","Branding"],
hot:false,
applicants:20,
posted:"2 ngày trước",
description:"Thiết kế banner, branding và ấn phẩm truyền thông.",
requirements:[
"Sử dụng tốt Photoshop",
"Có portfolio"
],
benefits:[
"Creative space",
"Training"
],
companyDesc:"Studio thiết kế thương hiệu."
},


{
id:8,
title:"HR Recruitment Specialist",
company:"Global Talent Group",
logo:"GT",
location:"Hà Nội",
salary:"15 - 25 triệu",
type:"Full-time",
experience:"2 năm",
category:"Human Resource",
skills:["Recruitment","Communication","HR"],
hot:false,
applicants:13,
posted:"3 ngày trước",
description:"Tìm kiếm ứng viên và quản lý quy trình tuyển dụng.",
requirements:[
"Có kinh nghiệm tuyển dụng",
"Kỹ năng giao tiếp tốt"
],
benefits:[
"Bonus tuyển dụng",
"Career path"
],
companyDesc:"Công ty nhân sự quốc tế."
},


{
id:9,
title:"Data Analyst",
company:"Insight Data Vietnam",
logo:"ID",
location:"Remote",
salary:"18 - 35 triệu",
type:"Remote",
experience:"1 - 2 năm",
category:"Data",
skills:["SQL","Excel","Python"],
hot:true,
applicants:22,
posted:"4 giờ trước",
description:"Phân tích dữ liệu và xây dựng báo cáo kinh doanh.",
requirements:[
"Biết SQL",
"Tư duy phân tích"
],
benefits:[
"Remote",
"Training"
],
companyDesc:"Công ty chuyên giải pháp dữ liệu."
},


{
id:10,
title:"Sales Executive",
company:"Nova Business",
logo:"NB",
location:"Hồ Chí Minh",
salary:"12 - 30 triệu",
type:"Full-time",
experience:"Fresher",
category:"Sales",
skills:["Communication","CRM","Negotiation"],
hot:false,
applicants:50,
posted:"5 ngày trước",
description:"Tìm kiếm khách hàng và phát triển thị trường.",
requirements:[
"Giao tiếp tốt",
"Chủ động"
],
benefits:[
"Hoa hồng cao",
"Thưởng doanh số"
],
companyDesc:"Doanh nghiệp cung cấp giải pháp B2B."
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

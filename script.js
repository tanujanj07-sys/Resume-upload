// -------------------------
// Mock data: skills by role
// -------------------------
const ROLE_SKILLS = {
  frontend: [
    "HTML", "CSS", "JavaScript", "React", "TypeScript",
    "Responsive Design", "Git", "REST APIs"
  ],
  backend: [
    "Node.js", "Express", "Python", "Java", "SQL",
    "REST APIs", "Git", "Docker"
  ],
  fullstack: [
    "HTML", "CSS", "JavaScript", "React", "Node.js",
    "Express", "SQL", "Git", "REST APIs"
  ],
  data: [
    "Python", "SQL", "Excel", "Data Visualization",
    "Statistics", "Pandas", "NumPy", "Power BI"
  ],
  ml: [
    "Python", "Machine Learning", "Deep Learning",
    "TensorFlow", "PyTorch", "SQL", "Statistics", "Git"
  ]
};

// -------------------------
// Mock job listings
// -------------------------
const MOCK_JOBS = [
  {
    title: "Frontend Developer",
    company: "TechCorp",
    roleKey: "frontend",
    skills: ["HTML", "CSS", "JavaScript", "React", "Git"]
  },
  {
    title: "Backend Developer",
    company: "DataSystems",
    roleKey: "backend",
    skills: ["Node.js", "Express", "SQL", "REST APIs", "Git"]
  },
  {
    title: "Full Stack Developer",
    company: "WebWorks",
    roleKey: "fullstack",
    skills: ["React", "Node.js", "Express", "SQL", "Git"]
  },
  {
    title: "Data Analyst",
    company: "InsightCo",
    roleKey: "data",
    skills: ["Python", "SQL", "Excel", "Data Visualization", "Pandas"]
  },
  {
    title: "Machine Learning Engineer",
    company: "AI Labs",
    roleKey: "ml",
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Git"]
  }
];

// -------------------------
// DOM elements
// -------------------------
const dropZone = document.getElementById("dropZone");
const resumeFileInput = document.getElementById("resumeFile");
const fileNameEl = document.getElementById("fileName");
const uploadErrorEl = document.getElementById("uploadError");
const analyzeBtn = document.getElementById("analyzeBtn");
const targetRoleSelect = document.getElementById("targetRole");

const dashboardSection = document.getElementById("dashboard");
const jobsSection = document.getElementById("jobs");

const resumeScoreEl = document.getElementById("resumeScore");
const scoreFillEl = document.getElementById("scoreFill");
const skillsCountEl = document.getElementById("skillsCount");
const skillsListPreviewEl = document.getElementById("skillsListPreview");
const matchedJobsCountEl = document.getElementById("matchedJobsCount");

const extractedSkillsEl = document.getElementById("extractedSkills");
const missingSkillsEl = document.getElementById("missingSkills");
const missingRoleLabelEl = document.getElementById("missingRoleLabel");

const jobsListEl = document.getElementById("jobsList");

let uploadedFile = null;

// -------------------------
// Drag & drop handlers
// -------------------------
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");

  const files = e.dataTransfer.files;
  if (files && files.length) {
    handleFileSelect(files[0]);
  }
});

resumeFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) handleFileSelect(file);
});

// -------------------------
// File selection handler
// -------------------------
function handleFileSelect(file) {
  uploadErrorEl.textContent = "";

  const validExt = [".pdf", ".docx"];
  const ext = "." + file.name.split(".").pop().toLowerCase();

  if (!validExt.includes(ext)) {
    uploadErrorEl.textContent = "Invalid file type. Please upload a PDF or DOCX file.";
    uploadedFile = null;
    fileNameEl.textContent = "";
    return;
  }

  const maxSize = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxSize) {
    uploadErrorEl.textContent = "File too large. Max size is 5 MB.";
    uploadedFile = null;
    fileNameEl.textContent = "";
    return;
  }

  uploadedFile = file;
  fileNameEl.textContent = `Selected: ${file.name}`;
}

// -------------------------
// Analyze button handler
// -------------------------
analyzeBtn.addEventListener("click", () => {
  uploadErrorEl.textContent = "";

  if (!uploadedFile) {
    uploadErrorEl.textContent = "Please select a resume file first.";
    return;
  }

  const role = targetRoleSelect.value;
  runMockAnalysis(role);
});

// -------------------------
// Mock analysis function
// -------------------------
function runMockAnalysis(role) {
  // In a real app: send file to backend, get:
  // - extracted skills
  // - resume score
  // - missing skills
  // - job recommendations

  const allSkills = [
    "HTML", "CSS", "JavaScript", "React", "Node.js", "Express",
    "Python", "SQL", "Git", "TypeScript", "Machine Learning",
    "Data Visualization", "Pandas", "REST APIs", "Docker"
  ];

  // Simulate "extracted" skills (random subset)
  let extracted = allSkills
    .filter(() => Math.random() > 0.5)
    .slice(0, 8);

  if (extracted.length === 0) {
    extracted = ["HTML", "JavaScript"];
  }

  const requiredSkills = ROLE_SKILLS[role] || [];
  const missing = requiredSkills.filter((s) => !extracted.includes(s));

  // Simple scoring logic
  const baseScore = 60;
  const skillBonus = Math.min(30, extracted.length * 4);
  const missingPenalty = Math.min(20, missing.length * 3);
  let score = baseScore + skillBonus - missingPenalty;
  score = Math.max(0, Math.min(100, score));

  // Update UI
  updateDashboard(score, extracted, missing, role);
  updateJobs(role, extracted);

  dashboardSection.classList.remove("hidden");
  jobsSection.classList.remove("hidden");

  // Scroll to dashboard
  dashboardSection.scrollIntoView({ behavior: "smooth" });
}

// -------------------------
// Update dashboard UI
// -------------------------
function updateDashboard(score, extracted, missing, role) {
  resumeScoreEl.textContent = score;
  scoreFillEl.style.width = `${score}%`;

  skillsCountEl.textContent = extracted.length;
  skillsListPreviewEl.textContent =
    extracted.slice(0, 4).join(", ") +
    (extracted.length > 4 ? "..." : "");

  // Render extracted skills
  extractedSkillsEl.innerHTML = "";
  extracted.forEach((s) => {
    const tag = document.createElement("div");
    tag.className = "skill-tag";
    tag.textContent = s;
    extractedSkillsEl.appendChild(tag);
  });

  // Render missing skills
  missingRoleLabelEl.textContent = roleLabel(role);
  missingSkillsEl.innerHTML = "";

  if (missing.length === 0) {
    missingSkillsEl.textContent = "No missing skills for this role!";
  } else {
    missing.forEach((s) => {
      const tag = document.createElement("div");
      tag.className = "missing-tag";
      tag.textContent = s;
      missingSkillsEl.appendChild(tag);
    });
  }
}

// -------------------------
// Role label helper
// -------------------------
function roleLabel(role) {
  const map = {
    frontend: "Frontend Developer",
    backend: "Backend Developer",
    fullstack: "Full Stack Developer",
    data: "Data Analyst",
    ml: "Machine Learning Engineer"
  };
  return map[role] || role;
}

// -------------------------
// Update job recommendations
// -------------------------
function updateJobs(role, extractedSkills) {
  const roleJobs = MOCK_JOBS.filter((j) => j.roleKey === role);

  const matched = roleJobs.map((job) => {
    const matchCount = job.skills.filter((s) => extractedSkills.includes(s)).length;
    const matchPercent = Math.round((matchCount / job.skills.length) * 100);
    return { ...job, matchPercent };
  });

  matched.sort((a, b) => b.matchPercent - a.matchPercent);

  matchedJobsCountEl.textContent = matched.length;

  jobsListEl.innerHTML = "";
  matched.forEach((job) => {
    const card = document.createElement("div");
    card.className = "job-card";

    const title = document.createElement("div");
    title.className = "job-title";
    title.textContent = job.title;

    const company = document.createElement("div");
    company.className = "job-company";
    company.textContent = job.company;

    const skillsDiv = document.createElement("div");
    skillsDiv.className = "job-skills";
    job.skills.forEach((s) => {
      const sk = document.createElement("div");
      sk.className = "job-skill";
      sk.textContent = s;
      skillsDiv.appendChild(sk);
    });

    const match = document.createElement("div");
    match.className = "job-match";
    match.textContent = `Match: ${job.matchPercent}%`;

    card.appendChild(title);
    card.appendChild(company);
    card.appendChild(skillsDiv);
    card.appendChild(match);

    jobsListEl.appendChild(card);
  });
}
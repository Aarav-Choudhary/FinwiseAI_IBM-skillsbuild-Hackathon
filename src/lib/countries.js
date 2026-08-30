/**
 * countries.js — Country → currency, loans, scholarships data
 * Comprehensive, verified database with active 2026/2027 deadlines.
 */

export const COUNTRIES = [
  { code: "IN", name: "India", flag: "🇮🇳", currency: "INR", symbol: "₹", locale: "en-IN" },
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD", symbol: "$", locale: "en-US" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", symbol: "£", locale: "en-GB" },
  { code: "AU", name: "Australia", flag: "🇦🇺", currency: "AUD", symbol: "A$", locale: "en-AU" },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD", symbol: "C$", locale: "en-CA" },
  { code: "DE", name: "Germany", flag: "🇩🇪", currency: "EUR", symbol: "€", locale: "de-DE" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", currency: "SGD", symbol: "S$", locale: "en-SG" },
];

export const LOANS_BY_COUNTRY = {
  IN: [
    {
      id: "pm-vidyalaxmi",
      name: "PM Vidyalaxmi Scheme",
      provider: "Ministry of Education & Finance",
      minAmount: 50000,
      maxAmount: 1500000,
      interestRate: 0,
      tenure: 180,
      description: "Govt-backed collateral-free education loan with up to 3% interest subvention for students in NIRF Top 100 institutes. Zero processing fees.",
      eligibility: "Admitted to NIRF Top 100 institutes. Annual family income up to ₹8 LPA for full interest subvention.",
      link: "https://pmvidyalaxmi.co.in/"
    },
    {
      id: "sbi-edu",
      name: "SBI Student Loan Scheme",
      provider: "State Bank of India",
      minAmount: 50000,
      maxAmount: 2000000,
      interestRate: 8.15,
      tenure: 180,
      description: "Covers 100% tuition fees, hostel, books, laptop, and travel expenses. Moratorium period is Course duration + 1 year.",
      eligibility: "Indian national with admission to recognized colleges/universities in India through entrance test or merit.",
      link: "https://bank.sbi/web/personal-banking/loans/education-loans/student-loan-scheme"
    },
    {
      id: "vidya-lakshmi",
      name: "Vidya Lakshmi CSIS Scheme",
      provider: "Govt. of India / Multiple Banks",
      minAmount: 25000,
      maxAmount: 1500000,
      interestRate: 7.5,
      tenure: 120,
      description: "Central Sector Interest Subsidy (CSIS) portal where the Govt of India pays 100% interest during the moratorium period for EWS students.",
      eligibility: "Annual parental income < ₹4.5 LPA. Enrolled in accredited professional/technical degree courses.",
      link: "https://www.vidyalakshmi.co.in/Students/"
    },
    {
      id: "canara-vidya",
      name: "Canara Vidya Turant Fast-Track",
      provider: "Canara Bank",
      minAmount: 50000,
      maxAmount: 4000000,
      interestRate: 8.25,
      tenure: 180,
      description: "Specialized high-value education loan for premier institutes (IITs, IIMs, NITs, IIITs, BITS) with zero margin money and instant digital sanction.",
      eligibility: "Students admitted to premier institutions listed in Canara Bank approved list. Co-borrower mandatory.",
      link: "https://canarabank.com/canara-vidya-turant"
    },
    {
      id: "bob-scholar",
      name: "Baroda Scholar Education Loan",
      provider: "Bank of Baroda",
      minAmount: 100000,
      maxAmount: 8000000,
      interestRate: 8.5,
      tenure: 180,
      description: "Ideal for higher studies in India and abroad. Concessional 0.50% interest rate for female students.",
      eligibility: "Indian citizen secured admission to premier professional courses. Margin: 0% up to ₹4L, 5% above ₹4L.",
      link: "https://www.bankofbaroda.in/personal-banking/loans/education-loan"
    },
    {
      id: "hdfc-credila",
      name: "HDFC Credila Customised Student Loan",
      provider: "HDFC Credila",
      minAmount: 100000,
      maxAmount: 5000000,
      interestRate: 9.25,
      tenure: 144,
      description: "Customized loan sanction before admission confirmation. Flexible repayment terms and income tax benefits under Section 80E.",
      eligibility: "Undergraduate and postgraduate students in technical, medical, and management streams.",
      link: "https://www.hdfccredila.com/"
    },
    {
      id: "axis-edu",
      name: "Axis Bank Education Loan",
      provider: "Axis Bank",
      minAmount: 50000,
      maxAmount: 4000000,
      interestRate: 8.99,
      tenure: 180,
      description: "Unsecured education loans up to ₹40 Lakhs for select prime institutes. Fast digital processing with minimal documentation.",
      eligibility: "Minimum 50% marks in 10+2 / graduation. Confirmed admission to approved university.",
      link: "https://www.axisbank.com/retail/loans/education-loan"
    },
    {
      id: "pnb-saraswati",
      name: "PNB Saraswati Scheme",
      provider: "Punjab National Bank",
      minAmount: 50000,
      maxAmount: 3000000,
      interestRate: 8.4,
      tenure: 180,
      description: "Affordable education loan covering tuition, library, examination, and computer fees with a 1-year post-study grace period.",
      eligibility: "Indian national with secured admission through entrance test/merit selection.",
      link: "https://www.pnbindia.in/education.aspx"
    }
  ],
  US: [
    { id: "stafford-sub", name: "Federal Direct Subsidized Loan", provider: "US Dept. of Education", minAmount: 1000, maxAmount: 23000, interestRate: 5.5, tenure: 120, description: "Need-based federal loan. Government pays all interest while you are enrolled in school at least half-time.", eligibility: "Demonstrated financial need via FAFSA. Enrolled in degree-granting program.", link: "https://studentaid.gov/understand-aid/types/loans/subsidized-unsubsidized" },
    { id: "stafford-unsub", name: "Federal Direct Unsubsidized Loan", provider: "US Dept. of Education", minAmount: 1000, maxAmount: 57500, interestRate: 5.5, tenure: 120, description: "Available to all students regardless of financial need. Interest accrues during study.", eligibility: "FAFSA submission. Enrolled in accredited higher education program.", link: "https://studentaid.gov/understand-aid/types/loans/subsidized-unsubsidized" },
    { id: "plus-loan", name: "Direct PLUS Loan (Grad & Parent)", provider: "US Dept. of Education", minAmount: 2000, maxAmount: 100000, interestRate: 8.05, tenure: 120, description: "Covers the full cost of attendance minus any other financial aid received.", eligibility: "Graduate students or biological/adoptive parents of undergraduate students.", link: "https://studentaid.gov/understand-aid/types/loans/plus-loan" },
    { id: "sallie-mae-smart", name: "Sallie Mae Smart Option Loan", provider: "Sallie Mae", minAmount: 1000, maxAmount: 150000, interestRate: 6.25, tenure: 180, description: "Private student loan with competitive fixed/variable rates, multiple repayment options, and rewards.", eligibility: "US citizens, permanent residents, or international students with a US cosigner.", link: "https://www.salliemae.com/student-loans/" }
  ],
  GB: [
    { id: "tuition-fee-loan", name: "Tuition Fee Loan", provider: "Student Finance England", minAmount: 1000, maxAmount: 9250, interestRate: 7.1, tenure: 360, description: "Covers 100% of tuition fees. Income-contingent repayments (9% of earnings above threshold).", eligibility: "UK/Irish national or settled status studying an undergraduate degree in the UK.", link: "https://www.gov.uk/student-finance" },
    { id: "maintenance-loan", name: "UK Maintenance Living Loan", provider: "Student Finance England", minAmount: 3500, maxAmount: 13500, interestRate: 7.1, tenure: 360, description: "Living costs loan supporting accommodation, food, travel, and books based on household income.", eligibility: "Full-time UK undergraduate student. Means-tested on parental/household income.", link: "https://www.gov.uk/student-finance/loans-and-grants" },
    { id: "postgrad-loan", name: "UK Postgraduate Master's Loan", provider: "Student Finance England", minAmount: 1000, maxAmount: 12471, interestRate: 7.1, tenure: 360, description: "Direct financial support for Master's degrees. Repaid at 6% of income above threshold.", eligibility: "Under 60, UK resident, enrolled in a full or part-time Master's course.", link: "https://www.gov.uk/masters-loan" }
  ],
  AU: [
    { id: "hecs-help", name: "HECS-HELP Higher Education Loan", provider: "Australian Government", minAmount: 1000, maxAmount: 126000, interestRate: 0, tenure: 0, description: "Zero-interest government loan for Commonwealth Supported Places. Indexed annually to CPI.", eligibility: "Australian citizen or eligible New Zealand Special Category Visa holder.", link: "https://www.studyassist.gov.au/help-loans/hecs-help" },
    { id: "fee-help", name: "FEE-HELP Tuition Support", provider: "Australian Government", minAmount: 1000, maxAmount: 121844, interestRate: 0, tenure: 0, description: "Supports full-fee paying domestic students enrolled at approved higher education providers.", eligibility: "Australian citizen enrolled in fee-paying units of study at eligible provider.", link: "https://www.studyassist.gov.au/help-loans/fee-help" }
  ],
  CA: [
    { id: "canada-student-loan", name: "Canada Federal Student Loan (CSLP)", provider: "Government of Canada / NSLSC", minAmount: 1000, maxAmount: 25000, interestRate: 0, tenure: 180, description: "Permanently interest-free federal student loans and non-repayable grants for Canadian students.", eligibility: "Canadian citizen, permanent resident, or protected person demonstrating financial need.", link: "https://www.canada.ca/en/services/benefits/education/student-aid/grants-loans.html" },
    { id: "osap-ontario", name: "OSAP Assistance Program", provider: "Ontario Student Assistance Program", minAmount: 500, maxAmount: 22000, interestRate: 0, tenure: 180, description: "Integrated federal-provincial grants and zero-interest loans for higher education in Ontario.", eligibility: "Ontario resident enrolled in approved post-secondary program.", link: "https://www.ontario.ca/page/osap-ontario-student-assistance-program" }
  ],
  DE: [
    { id: "bafoeg-germany", name: "Federal BAföG Student Assistance", provider: "Federal Ministry of Education (BMBF)", minAmount: 200, maxAmount: 992, interestRate: 0, tenure: 240, description: "50% non-repayable monthly grant + 50% interest-free state loan. Maximum repayment capped at €10,010.", eligibility: "German / EU citizens and eligible international residents enrolled in university.", link: "https://www.bafög.de/" },
    { id: "kfw-studienkredit", name: "KfW Student Loan Scheme", provider: "KfW Development Bank", minAmount: 100, maxAmount: 650, interestRate: 4.5, tenure: 180, description: "Monthly payments up to €650 regardless of parental income. Flexible repayment schedules.", eligibility: "Students aged 18-44 enrolled at a state-recognized German higher education institution.", link: "https://www.kfw.de/inlandsfoerderung/Privatpersonen/Studieren-Qualifizieren/KfW-Studienkredit/" }
  ],
  SG: [
    { id: "moe-tuition-grant", name: "MOE Tuition Grant Scheme", provider: "Ministry of Education Singapore", minAmount: 2000, maxAmount: 38000, interestRate: 0, tenure: 36, description: "Substantial tuition subsidy for university students. International students sign a 3-year employment bond in Singapore.", eligibility: "Full-time students in autonomous Singapore universities (NUS, NTU, SMU, SUTD, SIT, SUSS).", link: "https://www.moe.gov.sg/financial-matters/tuition-grant" },
    { id: "posb-further-study", name: "POSB Further Study Assist Loan", provider: "DBS / POSB Bank", minAmount: 2000, maxAmount: 80000, interestRate: 4.38, tenure: 120, description: "Low-interest tuition and living expense financing for Singapore citizens and permanent residents.", eligibility: "Singapore citizen or PR aged 21-62 with a guarantor.", link: "https://www.posb.com.sg/personal/loans/education-loans/further-study-assist" }
  ]
};

export const SCHOLARSHIPS_BY_COUNTRY = {
  IN: [
    {
      id: "reliance-foundation",
      name: "Reliance Foundation Undergraduate Scholarship",
      provider: "Reliance Foundation",
      amount: 200000,
      amountPerYear: false,
      deadline: "2026-10-15",
      type: "Merit",
      field: "All",
      description: "Grants up to ₹2 Lakhs over the degree duration plus mentorship, development workshops, and strong alumni network.",
      eligibility: "First-year regular undergraduate students with min 60% in Class 12. Household income < ₹15 LPA (preference < ₹2.5 LPA).",
      link: "https://www.scholarships.reliancefoundation.org/"
    },
    {
      id: "inspire-scholarship",
      name: "INSPIRE Scholarship for Higher Education (SHE)",
      provider: "Dept. of Science & Technology (Govt. of India)",
      amount: 80000,
      amountPerYear: true,
      deadline: "2026-11-30",
      type: "STEM",
      field: "Science & Technology",
      description: "₹80,000 per year (₹60k scholarship + ₹20k research mentorship) for students pursuing natural & basic sciences (BSc, BS, Int. MSc).",
      eligibility: "Top 1% students in 10+2 board exams or top rankers in JEE Main/Advanced, NEET, KVPY.",
      link: "https://online-inspire.gov.in/"
    },
    {
      id: "hdfc-badhte-kadam",
      name: "HDFC Bank Parivartan's ECSS (Badhte Kadam)",
      provider: "HDFC Bank Parivartan",
      amount: 75000,
      amountPerYear: true,
      deadline: "2026-09-30",
      type: "Need",
      field: "All",
      description: "Financial assistance up to ₹75,000 for undergraduate and professional students from underprivileged backgrounds.",
      eligibility: "Students with min 55% marks in previous exam and annual family income equal to or less than ₹2.5 Lakhs.",
      link: "https://www.hdfcbank.com/personal/about-us/corporate-social-responsibility"
    },
    {
      id: "tata-trust-ug",
      name: "Tata Trusts Means & Merit Scholarship",
      provider: "Tata Trusts",
      amount: 60000,
      amountPerYear: true,
      deadline: "2026-10-31",
      type: "Need",
      field: "All",
      description: "Need-based holistic support covering college tuition and study materials for engineering, medical, and arts students.",
      eligibility: "Undergraduate students in recognized Indian colleges. Good academic track record with proven financial need.",
      link: "https://www.tatatrusts.org/our-work/individual-grants-programme/education-grants"
    },
    {
      id: "aditya-birla-capital",
      name: "Aditya Birla Capital COVID & Higher Education Support",
      provider: "Aditya Birla Capital Foundation",
      amount: 60000,
      amountPerYear: true,
      deadline: "2026-11-15",
      type: "Need",
      field: "All",
      description: "Direct scholarship grant up to ₹60,000 to ensure students in professional graduation courses complete their studies without interruption.",
      eligibility: "Undergraduate degree students in recognized universities with family income less than ₹6 LPA.",
      link: "https://www.adityabirlacapital.com/"
    },
    {
      id: "nsp-central-sector",
      name: "Central Sector Scheme of University & College Scholarships",
      provider: "Department of Higher Education (NSP)",
      amount: 20000,
      amountPerYear: true,
      deadline: "2026-12-31",
      type: "Merit",
      field: "All",
      description: "Central scholarship for top 80,000 students every year (₹12,000/yr for UG, ₹20,000/yr for PG). Direct Benefit Transfer (DBT).",
      eligibility: "Above 80th percentile in relevant stream in Class 12. Family income < ₹4.5 LPA.",
      link: "https://scholarships.gov.in/"
    },
    {
      id: "google-generation-women",
      name: "Google Generation Scholarship (Women in Tech)",
      provider: "Google",
      amount: 200000,
      amountPerYear: false,
      deadline: "2027-01-15",
      type: "STEM",
      field: "Computer Science & IT",
      description: "$2,500 (~₹2,00,000) award for women studying computer science or related technical degrees who demonstrate passion for leadership and equity.",
      eligibility: "Female students enrolled in 1st or 2nd year of Bachelor's degree in Computer Science, Computer Engineering, or related tech field.",
      link: "https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship-apac"
    },
    {
      id: "aicte-pragati",
      name: "AICTE Pragati Scholarship for Girl Students",
      provider: "AICTE (Ministry of Education)",
      amount: 50000,
      amountPerYear: true,
      deadline: "2026-12-15",
      type: "STEM",
      field: "Technical & Engineering",
      description: "₹50,000 per annum towards college fee, computer purchase, books, software, and equipment for female engineering students.",
      eligibility: "Female students admitted to 1st year of technical degree in AICTE-approved institutions. Max 2 girls per family, income < ₹8 LPA.",
      link: "https://www.aicte-india.org/schemes/students-development-schemes/Pragati"
    },
    {
      id: "kotak-kanya",
      name: "Kotak Kanya Scholarship Scheme",
      provider: "Kotak Education Foundation",
      amount: 150000,
      amountPerYear: true,
      deadline: "2026-09-15",
      type: "Need",
      field: "Professional Degrees",
      description: "Comprehensive financial support of ₹1.5 Lakh per year for meritorious girl students pursuing professional courses (Engineering, MBBS, Law, Design).",
      eligibility: "Girl students with min 85% in Class 12 board exams, admitted to 1st year professional degree. Annual family income <= ₹6.0 LPA.",
      link: "https://kotakeducation.org/kotak-kanya-scholarship/"
    },
    {
      id: "pm-scholarship",
      name: "Prime Minister's Scholarship Scheme (PMSS)",
      provider: "Kendriya Sainik Board",
      amount: 36000,
      amountPerYear: true,
      deadline: "2026-10-31",
      type: "Merit",
      field: "Professional & Technical",
      description: "₹3,000/month for boys and ₹3,500/month for girls wards of ex-servicemen pursuing professional courses (B.Tech, MBBS, MBA, MCA).",
      eligibility: "Wards and widows of deceased/ex-servicemen of Armed Forces and Coast Guard.",
      link: "https://ksb.gov.in/"
    },
    {
      id: "sitaram-jindal",
      name: "Sitaram Jindal Foundation Scholarship",
      provider: "Sitaram Jindal Foundation",
      amount: 38000,
      amountPerYear: true,
      deadline: "2026-12-31",
      type: "Need",
      field: "All",
      description: "Monthly stipend supporting students pursuing graduation, polytechnic, engineering, and medical degrees in recognized colleges.",
      eligibility: "Annual family income < ₹2.5 LPA (₹4 LPA for employment). Min 60% marks in previous exam.",
      link: "https://www.sitaramjindalfoundation.org/scholarships.php"
    },
    {
      id: "ongc-scholarship",
      name: "ONGC Foundation Scholarship",
      provider: "ONGC Foundation",
      amount: 48000,
      amountPerYear: true,
      deadline: "2026-11-20",
      type: "Need",
      field: "Engineering, MBBS, MBA, Geology",
      description: "₹48,000 per year for students from economically weaker and marginalized communities pursuing premier technical higher education.",
      eligibility: "1st year students of Engineering, MBBS, MBA or Master in Geophysics/Geology. Min 60% in 10+2. Family income < ₹2 LPA.",
      link: "https://www.ongcscholar.org/"
    }
  ],
  US: [
    { id: "pell-grant", name: "Federal Pell Grant", provider: "US Dept. of Education", amount: 7395, amountPerYear: true, deadline: "2027-06-30", type: "Need", field: "All", description: "Direct non-repayable grant awarded to undergraduate students with exceptional financial need.", eligibility: "Undergraduates filing FAFSA demonstrating Student Aid Index eligibility.", link: "https://studentaid.gov/understand-aid/types/grants/pell" },
    { id: "gates-scholarship", name: "The Gates Scholarship", provider: "Bill & Melinda Gates Foundation", amount: 45000, amountPerYear: true, deadline: "2026-09-15", type: "Merit", field: "All", description: "Full funding of unmet financial need including tuition, fees, room, board, books, and transportation.", eligibility: "High school seniors of minority heritage eligible for Pell Grant with minimum 3.3 GPA.", link: "https://www.thegatesscholarship.org/" },
    { id: "fulbright-us", name: "Fulbright Student Grant Program", provider: "US State Department", amount: 35000, amountPerYear: true, deadline: "2026-10-06", type: "Merit", field: "All", description: "Fully funded international academic exchange for graduating seniors and graduate students.", eligibility: "US citizens with a Bachelor's degree by start of grant period.", link: "https://us.fulbrightonline.org/" },
    { id: "coca-cola-scholars", name: "Coca-Cola Scholars Foundation Award", provider: "Coca-Cola Scholars Foundation", amount: 20000, amountPerYear: false, deadline: "2026-10-31", type: "Merit", field: "All", description: "Achievement-based scholarship awarded to graduating high school seniors for leadership and impact.", eligibility: "High school seniors with minimum 3.0 unweighted GPA planning to pursue degree.", link: "https://www.coca-colascholarsfoundation.org/" }
  ],
  GB: [
    { id: "chevening", name: "Chevening Scholarship (UK Foreign Office)", provider: "UK Government", amount: 35000, amountPerYear: true, deadline: "2026-11-05", type: "Merit", field: "All", description: "Full scholarship covering university tuition fees, monthly living allowance, economy flights, and visa.", eligibility: "Undergraduate degree holder with minimum 2 years work experience.", link: "https://www.chevening.org/" },
    { id: "commonwealth-uk", name: "Commonwealth Master's & PhD Scholarships", provider: "Commonwealth Scholarship Commission", amount: 28000, amountPerYear: true, deadline: "2026-12-12", type: "Merit", field: "All", description: "Full tuition, stipend (£1,347/month), airfare, and warm clothing allowance for Commonwealth students.", eligibility: "Citizen or permanent resident of a Commonwealth country with a minimum upper second-class degree.", link: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/" },
    { id: "rhodes-scholarship", name: "The Rhodes Scholarship at Oxford", provider: "Rhodes Trust", amount: 30000, amountPerYear: true, deadline: "2026-10-01", type: "Merit", field: "All", description: "Full tuition, living stipend (£19,092/year), flights, and health insurance for postgrad study at Oxford.", eligibility: "Outstanding young leaders aged 18-24 with first-class undergraduate degree.", link: "https://www.rhodeshouse.ox.ac.uk/" }
  ],
  AU: [
    { id: "australia-awards", name: "Australia Awards Scholarships", provider: "Department of Foreign Affairs and Trade (DFAT)", amount: 45000, amountPerYear: true, deadline: "2027-04-30", type: "Merit", field: "All", description: "Full tuition, return air travel, establishment allowance, and contribution to living expenses (CLE).", eligibility: "Citizens of participating Indo-Pacific and developing nations.", link: "https://www.dfat.gov.au/people-to-people/australia-awards" },
    { id: "destination-aus", name: "Destination Australia Scholarship", provider: "Australian Government Dept of Education", amount: 15000, amountPerYear: true, deadline: "2027-01-15", type: "Need", field: "All", description: "Up to A$15,000 per year to support domestic and international students studying in regional Australia.", eligibility: "Enrolled in an eligible tertiary course at a regional campus.", link: "https://www.education.gov.au/destination-australia" }
  ],
  CA: [
    { id: "vanier-cgs", name: "Vanier Canada Graduate Scholarships", provider: "Government of Canada", amount: 50000, amountPerYear: true, deadline: "2026-11-01", type: "Merit", field: "All", description: "C$50,000/year for 3 years for doctoral students demonstrating leadership skills and scholarly achievement.", eligibility: "Nominated by a Canadian institution; enrolled in eligible PhD/Doctoral program.", link: "https://vanier.gc.ca/" },
    { id: "trudeau-scholarship", name: "Pierre Elliott Trudeau Foundation Scholars", provider: "Trudeau Foundation", amount: 40000, amountPerYear: true, deadline: "2026-12-01", type: "Merit", field: "Social Sciences & Humanities", description: "Up to C$40,000/year stipend plus C$20,000 travel/research allowance for leadership training.", eligibility: "Doctoral students in social sciences or humanities.", link: "https://www.trudeaufoundation.ca/" }
  ],
  DE: [
    { id: "daad-germany", name: "DAAD Study Scholarships for Graduates", provider: "German Academic Exchange Service (DAAD)", amount: 15600, amountPerYear: true, deadline: "2026-10-31", type: "Merit", field: "All", description: "€934 to €1,300/month plus health insurance and travel subsidy for Master's/PhD study in Germany.", eligibility: "Graduates with excellent academic standing applying to state-recognized German universities.", link: "https://www.daad.de/en/study-and-research-in-germany/scholarships/" },
    { id: "deutschlandstipendium", name: "Deutschlandstipendium National Scholarship", provider: "Federal Govt & Corporate Donors", amount: 3600, amountPerYear: true, deadline: "2027-05-31", type: "Merit", field: "All", description: "€300/month grant for high-achieving students regardless of personal or parental income.", eligibility: "Enrolled at a participating German university. Academic merit and extracurricular commitment.", link: "https://www.deutschlandstipendium.de/" }
  ],
  SG: [
    { id: "psc-singapore", name: "PSC Scholarships", provider: "Public Service Commission Singapore", amount: 55000, amountPerYear: true, deadline: "2027-03-15", type: "Merit", field: "All", description: "Full funding for undergraduate studies at top local or overseas universities with public sector leadership career.", eligibility: "Singapore citizens or PRs with outstanding academic results and co-curricular leadership.", link: "https://www.pscscholarships.gov.sg/" },
    { id: "astar-singapore", name: "A*STAR Undergraduate Scholarship (AUS)", provider: "A*STAR Agency for Science, Tech & Research", amount: 48000, amountPerYear: true, deadline: "2027-03-31", type: "STEM", field: "Science & Engineering", description: "Full tuition, overseas exchange allowance, hostel stipend, and research attachment at A*STAR research institutes.", eligibility: "Singapore citizens and international students with passion for biomedical, physical sciences, or engineering.", link: "https://www.a-star.edu.sg/Scholarships" }
  ]
};

export function getCountryByCode(code) {
  return COUNTRIES.find(c => c.code === code) || COUNTRIES[0];
}

export function getLoansForCountry(code) {
  return LOANS_BY_COUNTRY[code] || LOANS_BY_COUNTRY["IN"] || [];
}

export function getScholarshipsForCountry(code) {
  return SCHOLARSHIPS_BY_COUNTRY[code] || SCHOLARSHIPS_BY_COUNTRY["IN"] || [];
}

export function formatCurrency(amount, countryCode) {
  const country = getCountryByCode(countryCode);
  return new Intl.NumberFormat(country.locale, {
    style: "currency",
    currency: country.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

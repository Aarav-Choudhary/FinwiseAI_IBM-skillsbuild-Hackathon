/**
 * countries.js — Country → currency, loans, scholarships data
 * Used across the entire FinWise AI app.
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
    { id: "sbi-edu", name: "SBI Education Loan", provider: "State Bank of India", minAmount: 50000, maxAmount: 1500000, interestRate: 8.15, tenure: 180, description: "Covers tuition, hostel, books and study materials. Moratorium: course duration + 1 year.", eligibility: "Indian nationals, admission to recognised colleges, co-obligant required.", link: "https://bank.sbi/web/personal-banking/loans/education-loans/student-loan-scheme" },
    { id: "vidya-lakshmi", name: "Vidya Lakshmi Portal", provider: "Govt. of India", minAmount: 10000, maxAmount: 1500000, interestRate: 7.5, tenure: 120, description: "Central portal for education loans from multiple banks. Subsidy available under CSIS scheme.", eligibility: "EWS students, annual family income < ₹4.5 LPA for CSIS subsidy.", link: "https://www.vidyalakshmi.co.in/Students/" },
    { id: "canara-vidya", name: "Canara Vidya Turant", provider: "Canara Bank", minAmount: 25000, maxAmount: 1000000, interestRate: 8.5, tenure: 120, description: "Quick-disbursal education loan. Covers tuition + living expenses.", eligibility: "Admission to approved Indian/foreign institutions. Parents as co-borrower.", link: "https://canarabank.com/canara-vidya-turant" },
    { id: "pm-vidyalaxmi", name: "PM Vidyalaxmi Scheme", provider: "Ministry of Education", minAmount: 50000, maxAmount: 1000000, interestRate: 0, tenure: 120, description: "Interest subvention for EWS students. 3% interest subvention for loans up to ₹10 lakhs.", eligibility: "Annual family income up to ₹8 LPA, admitted to NIRF top 100 institutions.", link: "https://pmvidyalaxmi.co.in/" },
  ],
  US: [
    { id: "stafford-sub", name: "Federal Direct Subsidized Loan", provider: "US Dept. of Education", minAmount: 1000, maxAmount: 23000, interestRate: 5.5, tenure: 120, description: "Need-based. Government pays interest while you're in school. No payments during school.", eligibility: "Demonstrated financial need. FAFSA required. Enrolled at least half-time.", link: "https://studentaid.gov/understand-aid/types/loans/subsidized-unsubsidized" },
    { id: "stafford-unsub", name: "Federal Direct Unsubsidized Loan", provider: "US Dept. of Education", minAmount: 1000, maxAmount: 57500, interestRate: 5.5, tenure: 120, description: "Not need-based. Interest accrues during school. Available to all eligible students.", eligibility: "No financial need requirement. FAFSA required. Enrolled at least half-time.", link: "https://studentaid.gov/understand-aid/types/loans/subsidized-unsubsidized" },
    { id: "plus-loan", name: "PLUS Loan (Grad/Parent)", provider: "US Dept. of Education", minAmount: 1000, maxAmount: 999999, interestRate: 8.05, tenure: 120, description: "For graduate students or parents of undergrads. Covers full cost of attendance minus other aid.", eligibility: "Graduate student or parent of dependent undergrad. No adverse credit history.", link: "https://studentaid.gov/understand-aid/types/loans/plus-loan" },
  ],
  GB: [
    { id: "tuition-fee-loan", name: "Tuition Fee Loan", provider: "Student Finance England", minAmount: 1000, maxAmount: 9250, interestRate: 7.5, tenure: 360, description: "Covers tuition fees up to £9,250/year. Repaid via salary deductions (9% above threshold).", eligibility: "UK/Irish national or EU settled status. Enrolled at UK university.", link: "https://www.gov.uk/student-finance" },
    { id: "maintenance-loan", name: "Maintenance Loan", provider: "Student Finance England", minAmount: 3022, maxAmount: 13022, interestRate: 7.5, tenure: 360, description: "Living costs loan. Amount depends on household income and where you study.", eligibility: "UK national, first-time undergraduate, household income-assessed.", link: "https://www.gov.uk/student-finance/loans-and-grants" },
    { id: "postgrad-loan", name: "Postgraduate Loan", provider: "Student Finance England", minAmount: 1000, maxAmount: 11836, interestRate: 7.5, tenure: 360, description: "For master's students. Up to £11,836 per year. Repay 6% of income above £21,000/year.", eligibility: "Under 60, UK national, enrolled in an eligible master's course.", link: "https://www.gov.uk/masters-loan" },
  ],
  AU: [
    { id: "hecs-help", name: "HECS-HELP", provider: "Australian Government", minAmount: 1000, maxAmount: 999999, interestRate: 0, tenure: 0, description: "Deferred tuition fee payment. Repaid via tax once income exceeds threshold (~A$51,550). Indexed to CPI.", eligibility: "Australian citizen or eligible NZ citizen. Enrolled at Commonwealth-supported place.", link: "https://www.studyassist.gov.au/help-loans/hecs-help" },
    { id: "fee-help", name: "FEE-HELP", provider: "Australian Government", minAmount: 1000, maxAmount: 121844, interestRate: 0, tenure: 0, description: "For fee-paying students not in CSP. Same income-contingent repayment as HECS-HELP.", eligibility: "Australian citizen, studying privately enrolled units at approved provider.", link: "https://www.studyassist.gov.au/help-loans/fee-help" },
  ],
  CA: [
    { id: "osap", name: "OSAP (Ontario)", provider: "Government of Ontario", minAmount: 500, maxAmount: 18000, interestRate: 5.5, tenure: 120, description: "Mix of grants and loans for Ontario students. Non-repayable grants for low-income families.", eligibility: "Ontario resident, enrolled at eligible Ontario institution, financial need.", link: "https://www.ontario.ca/page/osap-ontario-student-assistance-program" },
    { id: "canada-student-loan", name: "Canada Student Loan", provider: "NSLSC", minAmount: 500, maxAmount: 10100, interestRate: 5.95, tenure: 120, description: "Federal student loan. Interest-free while in school. Repayment starts 6 months after graduation.", eligibility: "Canadian citizen or permanent resident, enrolled at eligible institution.", link: "https://www.canada.ca/en/services/benefits/education/student-aid/grants-loans.html" },
  ],
  DE: [
    { id: "bafoeg", name: "BAföG", provider: "Federal Government of Germany", minAmount: 100, maxAmount: 934, interestRate: 0, tenure: 0, description: "Monthly stipend. 50% is a non-repayable grant, 50% is an interest-free loan. Max loan cap: €10,010.", eligibility: "German citizens / EU citizens with permanent residence. Income-tested.", link: "https://www.bafög.de/" },
  ],
  SG: [
    { id: "moe-tuition-grant", name: "MOE Tuition Grant", provider: "Ministry of Education Singapore", minAmount: 1000, maxAmount: 30000, interestRate: 4.75, tenure: 60, description: "Subsidised tuition grant for international students. Requires 3-year service bond in Singapore company.", eligibility: "Non-Singapore-citizen enrolled at autonomous universities in SG.", link: "https://www.moe.gov.sg/financial-matters/tuition-grant" },
    { id: "mendaki-loan", name: "MENDAKI Loan", provider: "MENDAKI", minAmount: 1000, maxAmount: 20000, interestRate: 3.5, tenure: 84, description: "Subsidised education loan for Malay/Muslim students in Singapore.", eligibility: "Singapore Malay/Muslim citizens or PRs enrolled in local IHLs.", link: "https://www.mendaki.org.sg/" },
  ],
};

export const SCHOLARSHIPS_BY_COUNTRY = {
  IN: [
    { id: "pm-scholarship", name: "PM Scholarship Scheme", provider: "Kendriya Sainik Board", amount: 36000, amountPerYear: true, deadline: "2024-10-15", type: "Merit", field: "All", description: "Scholarship for wards of ex-servicemen. Up to ₹3,000/month for boys, ₹3,500 for girls.", link: "https://ksb.gov.in/", eligibility: "Children of ex-servicemen/ex-coast guard. Studying professional courses." },
    { id: "nsp-central", name: "National Scholarship Portal", provider: "Ministry of Education", amount: 25000, amountPerYear: true, deadline: "2024-11-30", type: "Need", field: "All", description: "Central platform for all Govt. of India scholarships. SC/ST/OBC/Minority scholarships.", link: "https://scholarships.gov.in/", eligibility: "Multiple categories: SC, ST, OBC, Minority, EWS, Girls. Income-based criteria." },
    { id: "tata-trust", name: "Tata Trusts Scholarship", provider: "Tata Trusts", amount: 50000, amountPerYear: true, deadline: "2024-09-30", type: "Need", field: "All", description: "Holistic support beyond tuition — mentoring, internships, career guidance.", link: "https://www.tatatrusts.org/", eligibility: "Undergraduate students from underserved communities. Strong academic record." },
    { id: "inspire-scholarship", name: "INSPIRE Scholarship for Higher Education", provider: "Dept. of Science & Technology", amount: 80000, amountPerYear: true, deadline: "2024-12-31", type: "STEM", field: "Science", description: "₹80,000/year for top 1% students in Class 12 pursuing natural/basic sciences.", link: "https://online-inspire.gov.in/", eligibility: "Top 1% in 10+2, pursuing BSc/BS/Int. MSc in natural sciences." },
    { id: "sitaram-jindal", name: "Sitaram Jindal Scholarship", provider: "Sitaram Jindal Foundation", amount: 36000, amountPerYear: true, deadline: "2024-08-31", type: "Need", field: "All", description: "Need-based scholarship for meritorious students. Available for multiple categories.", link: "https://www.sitaramjindalfoundation.org/", eligibility: "Annual family income < ₹2.5 LPA. Good academic record. Multiple categories." },
  ],
  US: [
    { id: "pell-grant", name: "Pell Grant", provider: "US Dept. of Education", amount: 7395, amountPerYear: true, deadline: "2025-06-30", type: "Need", field: "All", description: "Largest federal grant program. Non-repayable. Amount based on financial need.", link: "https://studentaid.gov/understand-aid/types/grants/pell", eligibility: "Undergraduate students with exceptional financial need. FAFSA required." },
    { id: "gates-millennium", name: "Gates Millennium Scholars", provider: "Bill & Melinda Gates Foundation", amount: 50000, amountPerYear: true, deadline: "2025-01-15", type: "Merit", field: "All", description: "Full scholarship covering tuition, room, board for minority students excelling academically.", link: "https://gmsp.org/", eligibility: "African American, Native American, Hispanic, Asian Pacific Islander. Min 3.3 GPA." },
    { id: "fulbright", name: "Fulbright Scholarship", provider: "US State Department", amount: 25000, amountPerYear: true, deadline: "2025-10-12", type: "Merit", field: "All", description: "Prestigious international exchange scholarship for study, research, or teaching.", link: "https://us.fulbrightonline.org/", eligibility: "US citizens for study abroad. International students for study in the US." },
    { id: "fafsa-aid", name: "FAFSA Federal Aid Package", provider: "US Dept. of Education", amount: 15000, amountPerYear: true, deadline: "2025-06-30", type: "Need", field: "All", description: "Comprehensive federal aid including grants, work-study, and loans.", link: "https://studentaid.gov/h/apply-for-aid/fafsa", eligibility: "US citizens and eligible non-citizens. Financial need required for grants." },
  ],
  GB: [
    { id: "chevening", name: "Chevening Scholarship", provider: "UK Foreign Office", amount: 18000, amountPerYear: true, deadline: "2024-11-05", type: "Merit", field: "All", description: "Fully funded one-year master's scholarship. Covers tuition, living, travel.", link: "https://www.chevening.org/", eligibility: "Outstanding emerging leaders. Work experience required. Return to home country afterwards." },
    { id: "commonwealth", name: "Commonwealth Scholarship", provider: "CSC", amount: 20000, amountPerYear: true, deadline: "2024-12-16", type: "Merit", field: "All", description: "For students from Commonwealth countries pursuing postgraduate study in the UK.", link: "https://cscuk.fcdo.gov.uk/", eligibility: "Citizens of Commonwealth countries. Development potential. Not previously studied in UK." },
    { id: "rhodes-scholarship", name: "Rhodes Scholarship", provider: "Rhodes Trust", amount: 22000, amountPerYear: true, deadline: "2024-10-01", type: "Merit", field: "All", description: "World's oldest international scholarship. 2-year postgraduate study at Oxford.", link: "https://www.rhodeshouse.ox.ac.uk/", eligibility: "Outstanding applicants worldwide. Academic excellence, leadership, and character." },
  ],
  AU: [
    { id: "australia-awards", name: "Australia Awards", provider: "Australian Government", amount: 40000, amountPerYear: true, deadline: "2025-04-30", type: "Merit", field: "All", description: "Fully funded scholarships for students from developing countries. Covers all expenses.", link: "https://www.australiaawards.gov.au/", eligibility: "Citizens of eligible developing countries. Undergraduate or postgraduate study." },
    { id: "destination-aus", name: "Destination Australia", provider: "Dept. of Education", amount: 15000, amountPerYear: true, deadline: "2025-06-30", type: "Need", field: "All", description: "Supports students studying in regional Australia. Up to A$15,000 per year.", link: "https://www.education.gov.au/destination-australia", eligibility: "Australian or international students studying at regional institutions." },
  ],
  CA: [
    { id: "vanier-cgs", name: "Vanier Canada Graduate Scholarship", provider: "Government of Canada", amount: 50000, amountPerYear: true, deadline: "2024-11-01", type: "Merit", field: "All", description: "Prestigious doctoral scholarship. C$50,000/year for 3 years. Academic excellence.", link: "https://vanier.gc.ca/", eligibility: "Doctoral students. Academic excellence, research potential, leadership qualities." },
    { id: "trudeau-scholarship", name: "Pierre Elliott Trudeau Foundation Scholarship", provider: "Trudeau Foundation", amount: 40000, amountPerYear: true, deadline: "2024-12-01", type: "Merit", field: "Social Sciences", description: "For exceptional doctoral candidates studying humanities/social sciences.", link: "https://www.trudeaufoundation.ca/", eligibility: "Doctoral candidates, Canadian or studying in Canada, social sciences/humanities." },
  ],
  DE: [
    { id: "daad", name: "DAAD Scholarship", provider: "German Academic Exchange Service", amount: 14400, amountPerYear: true, deadline: "2024-10-31", type: "Merit", field: "All", description: "€1,200/month plus travel allowance. For international students studying in Germany.", link: "https://www.daad.de/", eligibility: "International students and graduates. Strong academic record, language skills." },
    { id: "deutschlandstipendium", name: "Deutschlandstipendium", provider: "Federal Government + Private Donors", amount: 3600, amountPerYear: true, deadline: "2025-05-31", type: "Merit", field: "All", description: "€300/month for students at German universities. Mix of academic merit and social engagement.", link: "https://www.deutschlandstipendium.de/", eligibility: "Students enrolled at German universities. Academic excellence, social commitment." },
  ],
  SG: [
    { id: "psc-scholarship", name: "PSC Scholarship", provider: "Public Service Commission Singapore", amount: 50000, amountPerYear: true, deadline: "2025-02-28", type: "Merit", field: "All", description: "Prestigious scholarship for future Singapore public service leaders. Full coverage.", link: "https://www.pscscholarships.gov.sg/", eligibility: "Singapore citizens. Outstanding academic record and leadership qualities." },
    { id: "astar-scholarship", name: "A*STAR National Science Scholarship", provider: "A*STAR Singapore", amount: 45000, amountPerYear: true, deadline: "2025-03-31", type: "STEM", field: "Science & Technology", description: "For BSc and PhD in science, engineering, quantitative biology.", link: "https://www.a-star.edu.sg/Scholarships", eligibility: "Singapore citizens. Exceptional academic achievement in science/engineering." },
  ],
};

export function getCountryByCode(code) {
  return COUNTRIES.find(c => c.code === code) || COUNTRIES[0];
}

export function getLoansForCountry(code) {
  return LOANS_BY_COUNTRY[code] || [];
}

export function getScholarshipsForCountry(code) {
  return SCHOLARSHIPS_BY_COUNTRY[code] || [];
}

export function formatCurrency(amount, countryCode) {
  const country = getCountryByCode(countryCode);
  return new Intl.NumberFormat(country.locale, {
    style: "currency",
    currency: country.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/* Generator for Horizon service landing pages.
   Run:  node build-services.js
   Re-run any time content below changes. */
const fs = require("fs");
const path = require("path");
const OUT = __dirname; // write pages next to index.html
const ORIGIN = "https://horizonphysician.com";
const PHONE = "+92 319 1385894";
const EMAIL = "info@horizonphysicianservices.com";
const GA_ID = "G-7LPHZ4JH6Z";
const GA_TAG = `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>\n<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>`;

const ICON = {
  doc: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  code: '<svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  dollar: '<svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  chart: '<svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  refresh: '<svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
  users: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
};

const SERVICES = [
  {
    slug: "medical-billing", nav: "Medical Billing",
    title: "Medical Billing Services | Horizon Physician Services",
    metaDesc: "End-to-end medical billing services for healthcare providers — accurate claim submission, payment posting, and faster reimbursements that maximize revenue.",
    keyword: "medical billing services",
    h1: ["Medical Billing Services", "That Get You Paid Faster"],
    heroLead: "End-to-end medical billing that submits clean claims the first time, follows every dollar, and shortens the gap between care delivered and revenue collected.",
    introHead: "Full-cycle medical billing built for clean claims and faster payment",
    intro: ["Inaccurate or delayed billing is one of the biggest drains on practice revenue. Our medical billing service manages the entire process — from eligibility verification and charge entry to claim submission, payment posting, and patient statements — so claims go out clean and payments come in faster.",
      "We work across all major payers, including Medicare, Medicaid, commercial insurers, and managed care, and adapt to your EHR or practice management system so your team keeps its existing workflow while we handle the revenue cycle."],
    includes: [
      { i: "check", t: "Eligibility & Benefits Verification", d: "Coverage and benefits confirmed before the visit to prevent front-end denials." },
      { i: "doc", t: "Charge Entry & Claim Submission", d: "Accurate charge capture and electronic claim submission, typically within 24 hours." },
      { i: "search", t: "Claim Scrubbing", d: "Multi-layer edits catch errors before submission so claims go out clean." },
      { i: "dollar", t: "Payment Posting", d: "Timely, accurate posting of ERAs and EOBs with reconciliation against expected reimbursement." },
      { i: "phone", t: "Patient Statements & Support", d: "Clear patient statements and courteous billing support for self-pay balances." },
      { i: "chart", t: "Transparent Reporting", d: "Monthly performance reports covering collections, denials, and AR aging." }
    ],
    benefits: ["Cleaner claims and fewer rejections", "Faster, more predictable cash flow", "Lower days in accounts receivable", "Reduced administrative burden on your staff", "Full visibility into your revenue cycle", "HIPAA-aware handling at every step"],
    process: [
      { t: "Verify & Capture", d: "We confirm eligibility and accurately capture every billable charge." },
      { t: "Scrub & Submit", d: "Claims are scrubbed against payer rules and submitted electronically." },
      { t: "Follow & Post", d: "We track each claim and post payments with reconciliation." },
      { t: "Report & Improve", d: "Monthly reporting surfaces trends and drives ongoing improvement." }
    ],
    faqs: [
      { q: "Which insurance payers do you work with?", a: "We bill all major payers including Medicare, Medicaid, commercial insurers, and managed care organizations across a wide range of medical specialties." },
      { q: "Do you work within our existing software?", a: "Yes. We integrate with your existing EHR or practice management system so your team keeps its workflow while we manage billing behind the scenes." },
      { q: "How quickly are claims submitted?", a: "Clean claims are typically scrubbed and submitted electronically within 24 hours of receiving complete charge information." }
    ]
  },
  {
    slug: "medical-coding", nav: "Medical Coding",
    title: "Medical Coding Services | ICD-10, CPT & HCPCS Coding",
    metaDesc: "Certified medical coding services — accurate ICD-10, CPT, and HCPCS coding that maximizes reimbursement, reduces denials, and keeps you compliant.",
    keyword: "medical coding services",
    h1: ["Certified Medical Coding", "for Accurate Reimbursement"],
    heroLead: "Precise ICD-10, CPT, and HCPCS coding by certified coders that captures every billable service, reduces denials, and keeps your practice compliant.",
    introHead: "Accurate coding is where clean revenue begins",
    intro: ["A single mis-keyed or outdated code can trigger a denial, an underpayment, or a compliance flag. Our certified coders assign precise ICD-10, CPT, and HCPCS codes based on your documentation, ensuring every billable service is captured and coded to current payer and federal guidelines.",
      "We stay current with annual code updates and payer-specific rules, applying rigorous quality checks so your claims reflect the care delivered — no more, no less."],
    includes: [
      { i: "code", t: "ICD-10 / CPT / HCPCS Coding", d: "Complete, accurate code assignment across all encounter types." },
      { i: "search", t: "Documentation Review", d: "We align codes with clinical documentation to support every claim." },
      { i: "shield", t: "Compliance & Audit Support", d: "Coding aligned to current guidelines, with audit-ready documentation." },
      { i: "check", t: "Quality Assurance", d: "Multi-level coder review catches errors before claims are billed." },
      { i: "chart", t: "Specialty Coding", d: "Experienced across medical, surgical, behavioral health, and specialty practices." },
      { i: "refresh", t: "Annual Code Updates", d: "We keep pace with yearly ICD-10 and CPT changes so you stay current." }
    ],
    benefits: ["Maximized, compliant reimbursement", "Fewer coding-related denials", "Reduced audit and compliance risk", "Accurate capture of every billable service", "Specialty-specific coding expertise", "Audit-ready documentation trail"],
    process: [
      { t: "Receive Documentation", d: "We review your clinical documentation for each encounter." },
      { t: "Assign Codes", d: "Certified coders assign precise ICD-10, CPT, and HCPCS codes." },
      { t: "Quality Check", d: "A second-level review verifies accuracy and compliance." },
      { t: "Release to Billing", d: "Clean coded claims flow straight into the billing process." }
    ],
    faqs: [
      { q: "Are your coders certified?", a: "Yes. Coding is performed by certified coders trained in current ICD-10, CPT, and HCPCS guidelines across multiple specialties." },
      { q: "How do you reduce coding denials?", a: "We align every code with clinical documentation, apply payer-specific rules, and run multi-level quality checks before claims are billed." },
      { q: "Do you support specialty practices?", a: "Yes. We code for medical, surgical, behavioral health, pain management, and a range of specialty practices." }
    ]
  },
  {
    slug: "ar-management", nav: "AR Management",
    title: "Accounts Receivable (AR) Management Services",
    metaDesc: "Accounts receivable management that lowers your days in AR. Systematic follow-up on aging claims and unpaid balances to protect your cash flow.",
    keyword: "accounts receivable management",
    h1: ["Accounts Receivable", "Management That Recovers Revenue"],
    heroLead: "Systematic AR management that works every aging bucket, resolves unpaid claims before they age out, and keeps your days in AR low and cash flow healthy.",
    introHead: "Stop revenue from aging out of reach",
    intro: ["Every unpaid claim that ages past its filing window is revenue lost for good. Our accounts receivable management service monitors outstanding claims daily, sorts them by aging bucket, and prioritizes high-value and near-deadline balances so nothing slips through the cracks.",
      "Dedicated AR specialists work your aging report relentlessly — contacting payers, resolving pended claims, and escalating delays — while monthly reporting gives you complete visibility into where your money is."],
    includes: [
      { i: "chart", t: "Aging Analysis", d: "Daily monitoring of outstanding claims by 30/60/90/120+ day buckets." },
      { i: "search", t: "Root-Cause Review", d: "We identify why claims are unpaid and fix the underlying issue." },
      { i: "phone", t: "Proactive Payer Follow-Up", d: "Dedicated specialists pursue every outstanding claim with payers." },
      { i: "dollar", t: "High-Value Prioritization", d: "Large and near-timely-filing balances are worked first." },
      { i: "refresh", t: "Old AR Cleanup", d: "We recover aged receivables others have written off." },
      { i: "doc", t: "Monthly AR Reporting", d: "Clear aging reports so you always know your AR position." }
    ],
    benefits: ["Lower days in accounts receivable", "Recovery of aging and at-risk claims", "Predictable, healthier cash flow", "Fewer claims lost to timely-filing limits", "Full visibility into outstanding balances", "Less staff time chasing payers"],
    process: [
      { t: "Analyze Aging", d: "We sort and prioritize your outstanding claims by age and value." },
      { t: "Investigate", d: "Each unpaid claim is researched to find the cause of delay." },
      { t: "Follow Up", d: "Specialists pursue payers until claims are resolved or escalated." },
      { t: "Report", d: "Monthly AR reports track progress and surface trends." }
    ],
    faqs: [
      { q: "What is a healthy days-in-AR target?", a: "Most healthy practices keep days in AR under 40. We work to reduce and hold your AR within a healthy range through consistent follow-up." },
      { q: "Can you recover old AR other companies gave up on?", a: "Yes. We routinely work aged receivables and recover balances that were previously written off, as long as they are within filing or appeal windows." },
      { q: "How often do you work the aging report?", a: "We monitor outstanding claims daily and prioritize follow-up by aging bucket and balance value." }
    ]
  },
  {
    slug: "denial-management", nav: "Denial Management",
    title: "Denial Management Services | Reduce Claim Denials",
    metaDesc: "Denial management services that find the root cause of denied claims, appeal them quickly, and fix upstream issues to reduce your denial rate.",
    keyword: "denial management services",
    h1: ["Denial Management", "That Recovers Lost Revenue"],
    heroLead: "Root-cause analysis, fast appeals, and upstream fixes that turn denied claims into paid claims — and stop the same denials from happening again.",
    introHead: "Denials are not the end of a claim — they're a problem to solve",
    intro: ["Denied claims represent revenue you've already earned but haven't been paid for. Our denial management service analyzes the root cause of every denial, builds targeted appeals, and resubmits promptly — while identifying the upstream patterns so the same denials stop recurring.",
      "By fixing the source of denials — eligibility, coding, authorization, or documentation — we don't just recover individual claims, we lower your overall denial rate over time."],
    includes: [
      { i: "search", t: "Root-Cause Analysis", d: "We categorize every denial and pinpoint why it happened." },
      { i: "doc", t: "Targeted Appeals", d: "Well-documented appeals built to overturn denials and recover payment." },
      { i: "refresh", t: "Timely Resubmission", d: "Corrected claims are resubmitted quickly, before deadlines pass." },
      { i: "shield", t: "Upstream Fixes", d: "We address coding, eligibility, and authorization issues at the source." },
      { i: "chart", t: "Denial Trend Reporting", d: "Denial reason breakdowns reveal where to improve." },
      { i: "check", t: "Prevention Strategy", d: "Process changes that reduce future denials, not just rework them." }
    ],
    benefits: ["Recovery of denied and underpaid claims", "A measurably lower denial rate", "Faster appeal turnaround", "Fewer recurring, preventable denials", "Clear visibility into denial drivers", "Protected revenue and compliance"],
    process: [
      { t: "Identify", d: "Every denial is logged and categorized by reason." },
      { t: "Analyze", d: "We find the root cause behind each denial pattern." },
      { t: "Appeal", d: "Targeted appeals and corrected claims are submitted promptly." },
      { t: "Prevent", d: "Upstream fixes stop the same denials from recurring." }
    ],
    faqs: [
      { q: "How quickly do you appeal denied claims?", a: "Denied claims are analyzed and appealed promptly, well within payer appeal windows, to maximize recovery." },
      { q: "Can you actually lower our denial rate?", a: "Yes. By fixing root causes — coding, eligibility, authorization, and documentation — practices typically see denial rates fall significantly within the first two months." },
      { q: "Do you report on denial trends?", a: "Yes. You receive denial reason breakdowns each month so you can see exactly what is driving denials and where it is improving." }
    ]
  },
  {
    slug: "insurance-follow-up", nav: "Insurance Follow-Up",
    title: "Insurance Follow-Up Services for Medical Claims",
    metaDesc: "Proactive insurance follow-up services — we pursue every pending claim with payers so nothing ages out and your reimbursements arrive faster.",
    keyword: "insurance follow-up services",
    h1: ["Insurance Follow-Up", "So No Claim Sits Idle"],
    heroLead: "Proactive outreach to payers on every pending claim — status checks, escalations, and documented follow-up that prevent claim abandonment and speed up payment.",
    introHead: "Pending claims don't pay themselves",
    intro: ["A submitted claim is only half the job. Without persistent follow-up, claims stall in payer systems, pend for missing information, or quietly age past their filing limit. Our insurance follow-up service tracks every outstanding claim and pursues payers until each one is resolved.",
      "We contact payers by phone, portal, and electronic inquiry, document every interaction for a clear audit trail, and escalate delays so your reimbursements arrive faster and more predictably."],
    includes: [
      { i: "clock", t: "Timely Follow-Up", d: "We follow up on outstanding claims within 30 days of submission, or sooner." },
      { i: "phone", t: "Multi-Channel Outreach", d: "Payer contact via phone, portals, and electronic inquiry systems." },
      { i: "search", t: "Pended Claim Resolution", d: "We resolve claims pending for information or additional documentation." },
      { i: "doc", t: "Documented Audit Trail", d: "Every follow-up attempt is logged for full transparency." },
      { i: "refresh", t: "Escalation Management", d: "Delays are escalated through the right payer channels." },
      { i: "chart", t: "Status Reporting", d: "Clear reporting on the status of pending claims." }
    ],
    benefits: ["Faster, more predictable reimbursements", "Fewer claims lost to timely-filing limits", "No claims abandoned in payer systems", "A documented trail for every claim", "Less staff time on hold with payers", "Improved overall collection rate"],
    process: [
      { t: "Track", d: "Every submitted claim is monitored for payer response." },
      { t: "Contact", d: "We reach payers by phone, portal, and electronic inquiry." },
      { t: "Resolve", d: "Pended and delayed claims are pushed to resolution." },
      { t: "Document", d: "Each interaction is logged with a clear audit trail." }
    ],
    faqs: [
      { q: "When do you start following up on claims?", a: "We initiate follow-up on outstanding claims within 30 days of submission, or sooner based on payer-specific timelines." },
      { q: "How do you contact payers?", a: "We use phone, payer portals, and electronic inquiry systems to obtain claim status, resolve pended claims, and escalate delays." },
      { q: "Do you document follow-up activity?", a: "Yes. Every follow-up attempt is documented so there is always a clear audit trail for each claim." }
    ]
  },
  {
    slug: "collections-support", nav: "Collections Support",
    title: "Medical Collections Support Services",
    metaDesc: "Professional, patient-sensitive medical collections support for self-pay and delinquent accounts that recovers revenue while protecting patient relationships.",
    keyword: "medical collections support",
    h1: ["Collections Support", "That Protects Your Reputation"],
    heroLead: "Firm but patient-friendly collections for self-pay and delinquent accounts — structured outreach that recovers balances while preserving the relationships your practice values.",
    introHead: "Recover what you're owed without alienating patients",
    intro: ["Unpaid patient balances add up fast, but aggressive collections can damage the patient relationships your practice depends on. Our collections support strikes the right balance: firm, professional, and patient-sensitive outreach that recovers revenue while protecting your reputation.",
      "We begin with patient-friendly statements and reminders, escalate through structured outreach, and only consider third-party placement as a last resort — with thresholds and escalation paths customized to your practice's preferences."],
    includes: [
      { i: "doc", t: "Patient-Friendly Statements", d: "Clear, easy-to-understand statements and payment reminders." },
      { i: "phone", t: "Structured Outreach", d: "Courteous, professional follow-up that escalates appropriately." },
      { i: "dollar", t: "Self-Pay Recovery", d: "Effective recovery of self-pay and delinquent balances." },
      { i: "users", t: "Relationship-First Approach", d: "Collections handled to preserve the patient-provider relationship." },
      { i: "shield", t: "Customized Thresholds", d: "Escalation paths and placement thresholds set to your preferences." },
      { i: "chart", t: "Recovery Reporting", d: "Transparent reporting on collections performance." }
    ],
    benefits: ["Higher recovery on patient balances", "Protected patient relationships and reputation", "Professional, compliant collections process", "Customized escalation to your comfort level", "Reduced write-offs on self-pay accounts", "Less burden on your front-office staff"],
    process: [
      { t: "Statement Cycle", d: "Patient-friendly statements and reminders go out on schedule." },
      { t: "Outreach", d: "Structured, courteous follow-up on outstanding balances." },
      { t: "Escalate", d: "Accounts escalate through agreed steps before any placement." },
      { t: "Report", d: "You see recovery results and account status clearly." }
    ],
    faqs: [
      { q: "Is your collections approach aggressive?", a: "No. Our approach is firm but professional and patient-sensitive. We start with friendly statements and reminders and escalate through structured outreach before considering third-party placement." },
      { q: "Can we control the escalation process?", a: "Yes. We customize collection thresholds and the escalation path to match your practice's preferences and patient-relationship standards." },
      { q: "Which accounts do you handle?", a: "We support self-pay balances and delinquent accounts, recovering revenue while preserving the patient-provider relationship." }
    ]
  },
  {
    slug: "personal-injury-billing", nav: "Personal Injury Billing",
    title: "Personal Injury & Workers' Comp Billing Services",
    metaDesc: "Specialized personal injury and workers' compensation billing — lien management, letters of protection, and attorney coordination handled with precision.",
    keyword: "personal injury billing",
    h1: ["Personal Injury &", "Workers' Comp Billing"],
    heroLead: "Specialized billing for motor vehicle accident, liability, and workers' compensation cases — lien management, letters of protection, and attorney coordination handled with precision.",
    introHead: "PI and workers' comp billing is a specialty of its own",
    intro: ["Personal injury and workers' compensation cases follow rules nothing like standard insurance billing — and treating them the same way leaves money on the table. These cases involve liens, letters of protection, attorney coordination, and case-specific documentation that can stretch over months or years.",
      "Our specialized PI billing team manages motor vehicle accident, liability, and workers' comp claims end to end, tracking liens through settlement and coordinating with attorneys so you recover the full amount you're owed."],
    includes: [
      { i: "shield", t: "Lien Management", d: "Medical liens tracked and protected through case settlement." },
      { i: "doc", t: "Letters of Protection", d: "LOP agreements documented and managed to payment." },
      { i: "users", t: "Attorney Coordination", d: "Consistent communication and records exchange with attorneys." },
      { i: "search", t: "Case Documentation", d: "Case-specific documentation handled accurately and completely." },
      { i: "phone", t: "Workers' Comp Claims", d: "Workers' compensation claims billed to jurisdiction rules." },
      { i: "clock", t: "Long-Cycle Tracking", d: "Cases tracked over months or years until resolution." }
    ],
    benefits: ["Full recovery on PI and workers' comp cases", "Properly protected medical liens", "Reliable attorney coordination", "Accurate, case-specific documentation", "Specialized expertise others lack", "No revenue lost to mishandled cases"],
    process: [
      { t: "Intake", d: "We capture case details, liens, and protection agreements." },
      { t: "Coordinate", d: "We work with attorneys and gather required documentation." },
      { t: "Track", d: "Liens and balances are tracked through case resolution." },
      { t: "Recover", d: "We pursue full payment at settlement or claim resolution." }
    ],
    faqs: [
      { q: "Do you handle liens and letters of protection?", a: "Yes. Lien management and letters of protection are core to our PI billing. We track and protect liens through settlement and manage LOP agreements to payment." },
      { q: "Do you coordinate with attorneys?", a: "Yes. We communicate consistently with attorneys, exchange records, and respond to case requests so payment isn't delayed." },
      { q: "What case types do you bill?", a: "We handle motor vehicle accident cases, liability claims, and workers' compensation claims, including their case-specific documentation requirements." }
    ]
  },
  {
    slug: "revenue-cycle-management", nav: "Revenue Cycle Management",
    title: "Revenue Cycle Management (RCM) Services",
    metaDesc: "Full-spectrum revenue cycle management — from eligibility and charge capture to payment posting and reporting — designed to optimize your financial outcomes.",
    keyword: "revenue cycle management services",
    h1: ["Revenue Cycle", "Management, End to End"],
    heroLead: "Full-spectrum RCM — eligibility verification, charge capture, coding, claims, follow-up, denials, collections, and reporting — managed as one optimized system.",
    introHead: "One partner for your entire revenue cycle",
    intro: ["When billing, coding, AR, denials, and collections are handled in silos, revenue leaks at every handoff. Our revenue cycle management service manages the whole cycle as one connected system — from the moment a patient is scheduled to the moment the final dollar is collected and reported.",
      "You get a single accountable partner, consistent processes, and complete visibility — with measurable improvement in collection rate, days in AR, and net revenue."],
    includes: [
      { i: "check", t: "Eligibility & Verification", d: "Front-end checks that prevent denials before they start." },
      { i: "doc", t: "Charge Capture & Coding", d: "Accurate capture and certified coding of every service." },
      { i: "dollar", t: "Claims & Payment Posting", d: "Clean submission, follow-up, and reconciled payment posting." },
      { i: "shield", t: "Denial & AR Management", d: "Aggressive denial recovery and AR follow-up to protect revenue." },
      { i: "phone", t: "Patient Collections", d: "Professional collections that preserve patient relationships." },
      { i: "chart", t: "Performance Reporting", d: "Monthly reporting on collections, denials, AR, and trends." }
    ],
    benefits: ["A measurable lift in net revenue", "Lower days in AR and denial rates", "One accountable partner, end to end", "Consistent, optimized processes", "Complete financial visibility", "Reduced administrative overhead"],
    process: [
      { t: "Front End", d: "Eligibility, verification, and accurate charge capture." },
      { t: "Mid Cycle", d: "Coding, claim submission, and proactive follow-up." },
      { t: "Back End", d: "Denials, AR recovery, and patient collections." },
      { t: "Reporting", d: "Monthly insight that drives continuous improvement." }
    ],
    faqs: [
      { q: "What does revenue cycle management include?", a: "Our RCM covers eligibility verification, charge capture, coding, claim submission, payment posting, insurance follow-up, denial management, collections, and performance reporting — the entire cycle." },
      { q: "How fast will we see results?", a: "Most practices see measurable improvement in collection rate and days in AR within the first 30 to 60 days as clean claims and consistent follow-up take effect." },
      { q: "Do we get reporting and visibility?", a: "Yes. You receive comprehensive monthly reports covering collections, denials, AR aging, and trends, with real-time visibility into claim status." }
    ]
  },
  {
    slug: "bpo-call-center", nav: "BPO / Call Center",
    title: "Healthcare BPO & Call Center Services",
    metaDesc: "HIPAA-aware healthcare BPO and call center services — inbound and outbound calls, email and chat support, and SMS that keep your front office responsive.",
    keyword: "healthcare BPO call center services",
    h1: ["Healthcare BPO &", "Call Center Services"],
    heroLead: "Dedicated, HIPAA-aware call center support — inbound and outbound calls, email and chat, and SMS — that keeps your front office responsive while your team focuses on care.",
    introHead: "Front-office support that never misses a patient",
    intro: ["Missed calls and slow responses cost practices appointments and revenue. Our healthcare BPO and call center service gives you a dedicated, trained team to handle patient communication across every channel — phone, email, chat, and text — with the courtesy and accuracy patients expect.",
      "From appointment reminders and eligibility questions to payment follow-ups, our agents extend your front office and reduce no-shows, all under HIPAA-aware processes."],
    includes: [
      { i: "phone", t: "Inbound Calls", d: "Professional handling of incoming patient and payer calls." },
      { i: "refresh", t: "Outbound Calls", d: "Reminders, payment follow-ups, and proactive patient outreach." },
      { i: "doc", t: "Email & Chat Support", d: "Responsive written support that improves patient satisfaction." },
      { i: "clock", t: "SMS Support", d: "Two-way texting for reminders, confirmations, and quick questions." },
      { i: "users", t: "Dedicated Agents", d: "A trained team that works as an extension of your front office." },
      { i: "shield", t: "HIPAA-Aware Processes", d: "Patient communication handled under HIPAA-aware protocols." }
    ],
    benefits: ["Fewer missed calls and no-shows", "Faster patient response times", "Extended front-office capacity", "Improved patient satisfaction", "Lower administrative load on staff", "HIPAA-aware handling throughout"],
    process: [
      { t: "Onboard", d: "We learn your scripts, systems, and patient-handling standards." },
      { t: "Staff", d: "A dedicated, trained team is assigned to your account." },
      { t: "Engage", d: "Agents handle calls, chat, email, and SMS across the day." },
      { t: "Report", d: "You get visibility into volumes, response times, and outcomes." }
    ],
    faqs: [
      { q: "What channels do you support?", a: "We handle inbound and outbound calls, email and live chat, and two-way SMS — covering every channel patients use to reach your practice." },
      { q: "Is patient communication HIPAA-aware?", a: "Yes. All patient communication is handled under HIPAA-aware processes, with appropriate training and access controls." },
      { q: "Can agents work as part of our front office?", a: "Yes. Our dedicated agents follow your scripts and standards, working as a seamless extension of your front office." }
    ]
  }
];

function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}

function navHtml(active){
  var ddLinks = SERVICES.map(function(s){
    return `<a href="${s.slug}.html"${s.slug===active?' class="dd-active"':''}>${esc(s.nav)}</a>`;
  }).join("");
  return `<nav id="navbar"><div class="nav-inner">
    <a class="nav-logo" href="index.html"><img src="logo.png" alt="Horizon Physician Services LLC"></a>
    <div class="nav-links">
      <div class="nav-dd">
        <a href="index.html#bpo" class="nav-dd-trigger">BPO <span class="caret">▼</span></a>
        <div class="nav-dd-menu">
          <a href="bpo-call-center.html">Inbound Calls</a>
          <a href="bpo-call-center.html">Outbound Calls</a>
          <a href="bpo-call-center.html">Email &amp; Chat Support</a>
          <a href="bpo-call-center.html">SMS Support</a>
          <div class="dd-divider"></div>
          <a href="bpo-call-center.html" class="dd-all">BPO &amp; Call Center →</a>
        </div>
      </div>
      <div class="nav-dd">
        <a href="index.html#services" class="nav-dd-trigger">Services <span class="caret">▼</span></a>
        <div class="nav-dd-menu">
          ${ddLinks}
          <div class="dd-divider"></div>
          <a href="index.html#services" class="dd-all">View all services →</a>
        </div>
      </div>
      <div class="nav-dd">
        <a href="index.html#about" class="nav-dd-trigger">About <span class="caret">▼</span></a>
        <div class="nav-dd-menu">
          <a href="index.html#about">About Us</a>
          <a href="index.html#about">Mission, Vision &amp; Values</a>
          <a href="index.html#why">Why Choose Us</a>
          <a href="index.html#leadership">Our Leadership</a>
        </div>
      </div>
      <div class="nav-dd">
        <a href="index.html#process" class="nav-dd-trigger">Our Process <span class="caret">▼</span></a>
        <div class="nav-dd-menu">
          <a href="index.html#pstep0">1. Patient &amp; Claim Review</a>
          <a href="index.html#pstep1">2. Coding &amp; Submission</a>
          <a href="index.html#pstep2">3. Insurance Follow-Up</a>
          <a href="index.html#pstep3">4. AR &amp; Denial Management</a>
          <a href="index.html#pstep4">5. Revenue Recovery &amp; Reporting</a>
        </div>
      </div>
      <a href="index.html#leadership">Leadership</a>
      <a href="blog.html">Blog</a>
      <a href="index.html#faq">FAQ</a>
    </div>
    <a class="btn btn-primary" href="index.html#final-cta">Schedule Consultation</a>
    <button class="nav-toggle" onclick="location.href='index.html'"><span></span><span></span><span></span></button>
  </div></nav>`;
}
function footerHtml(svc){
  var links = SERVICES.map(function(s){return `<li><a href="${s.slug}.html">${esc(s.nav)}</a></li>`;}).join("");
  return `<footer><div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="logo.png" alt="Horizon Physician Services LLC">
        <p>A trusted partner in healthcare revenue cycle management — delivering accurate billing, coding, collections, and AR management that strengthen practice finances.</p>
      </div>
      <div class="footer-col"><h4>Services</h4><ul>${links}</ul></div>
      <div class="footer-col"><h4>Company</h4><ul>
        <li><a href="index.html#about">About Us</a></li>
        <li><a href="index.html#why">Why Choose Us</a></li>
        <li><a href="index.html#leadership">Leadership</a></li>
        <li><a href="index.html#blog">Blog</a></li>
        <li><a href="index.html#faq">FAQ</a></li>
        <li><a href="tel:${PHONE.replace(/[^\d+]/g,"")}">${esc(PHONE)}</a></li>
        <li><a href="mailto:${EMAIL}">${esc(EMAIL)}</a></li>
      </ul></div>
    </div>
    <div class="footer-bottom">&copy; ${new Date().getFullYear()} Horizon Physician Services LLC. All rights reserved.</div>
  </div></footer>`;
}
function faqAccordionJs(){
  return `<script>document.querySelectorAll('.faq-q').forEach(function(b){b.addEventListener('click',function(){var it=b.closest('.faq-item');var a=it.querySelector('.faq-a');var open=it.classList.contains('open');document.querySelectorAll('.faq-item').forEach(function(i){i.classList.remove('open');i.querySelector('.faq-a').style.maxHeight='0';});if(!open){it.classList.add('open');a.style.maxHeight=a.scrollHeight+'px';}});});</script>`;
}

function render(svc){
  var url = ORIGIN + "/" + svc.slug + ".html";
  var related = SERVICES.filter(function(s){return s.slug!==svc.slug;}).slice(0,6);
  var jsonld = {
    "@context":"https://schema.org","@type":"Service",
    "name": svc.nav + " Services","serviceType": svc.keyword,
    "provider":{"@type":"ProfessionalService","name":"Horizon Physician Services LLC","url":ORIGIN+"/","telephone":PHONE,"email":EMAIL},
    "areaServed":"United States","url":url,"description":svc.metaDesc
  };
  var breadcrumb = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"Home","item":ORIGIN+"/"},
    {"@type":"ListItem","position":2,"name":svc.nav,"item":url}
  ]};
  var faqSchema = {"@context":"https://schema.org","@type":"FAQPage","mainEntity":svc.faqs.map(function(f){return {"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}};})};

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(svc.title)}</title>
<meta name="description" content="${esc(svc.metaDesc)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/png" href="/logo.png">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(svc.title)}">
<meta property="og:description" content="${esc(svc.metaDesc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ORIGIN}/og-image.png">
<meta name="twitter:card" content="summary_large_image">
${GA_TAG}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@600;700;800&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@600;700;800&display=swap"></noscript>
<link rel="stylesheet" href="service.css?v=4">
<script type="application/ld+json">${JSON.stringify([jsonld,breadcrumb,faqSchema])}</script>
</head>
<body>
${navHtml(svc.slug)}

<header class="svc-hero"><div class="container">
  <div class="crumb"><a href="index.html">Home</a> &nbsp;/&nbsp; ${esc(svc.nav)}</div>
  <span class="eyebrow">${esc(svc.nav)}</span>
  <h1>${esc(svc.h1[0])} <span class="accent">${esc(svc.h1[1])}</span></h1>
  <p class="lead">${esc(svc.heroLead)}</p>
  <div class="hero-ctas">
    <a class="btn btn-primary btn-lg" href="index.html#final-cta">Schedule a Free Consultation</a>
    <a class="btn btn-outline btn-lg" href="index.html#services">View All Services</a>
  </div>
</div></header>

<section class="section-pad"><div class="container">
  <div class="label">Overview</div>
  <h2 class="h2" style="max-width:760px;margin-bottom:22px;">${esc(svc.introHead)}</h2>
  <div class="prose">${svc.intro.map(function(p){return "<p>"+esc(p)+"</p>";}).join("")}</div>
</div></section>

<section class="section-pad tint"><div class="container">
  <div class="label">What's Included</div>
  <h2 class="h2" style="margin-bottom:36px;">Everything our ${esc(svc.nav.toLowerCase())} service covers</h2>
  <div class="grid cols-3">
    ${svc.includes.map(function(it){return `<div class="card"><div class="ico">${ICON[it.i]||ICON.check}</div><h3>${esc(it.t)}</h3><p>${esc(it.d)}</p></div>`;}).join("")}
  </div>
</div></section>

<section class="section-pad"><div class="container">
  <div class="label">The Benefits</div>
  <h2 class="h2" style="margin-bottom:30px;">Why providers choose us for ${esc(svc.nav.toLowerCase())}</h2>
  <div class="benefits">
    ${svc.benefits.map(function(b){return `<div class="benefit"><div class="chk"></div><span>${esc(b)}</span></div>`;}).join("")}
  </div>
</div></section>

<section class="section-pad tint"><div class="container">
  <div class="label">How We Work</div>
  <h2 class="h2" style="margin-bottom:34px;">A clear, proven process</h2>
  <div class="steps">
    ${svc.process.map(function(p,i){return `<div class="step"><div class="n">${i+1}</div><h4>${esc(p.t)}</h4><p>${esc(p.d)}</p></div>`;}).join("")}
  </div>
</div></section>

<section class="section-pad"><div class="container">
  <div class="label" style="text-align:center;display:block;">FAQ</div>
  <h2 class="h2" style="text-align:center;">${esc(svc.nav)} questions, answered</h2>
  <div class="faq-wrap">
    ${svc.faqs.map(function(f,i){return `<div class="faq-item${i===0?" open":""}"><button class="faq-q"><span>${esc(f.q)}</span><div class="faq-icon">+</div></button><div class="faq-a"${i===0?' style="max-height:400px;"':''}><div class="faq-a-inner">${esc(f.a)}</div></div></div>`;}).join("")}
  </div>
</div></section>

<section class="section-pad tint"><div class="container">
  <div class="label">Explore More</div>
  <h2 class="h2" style="margin-bottom:28px;">Related services</h2>
  <div class="grid cols-3 related">
    ${related.map(function(s){return `<a href="${s.slug}.html">${esc(s.nav)}</a>`;}).join("")}
  </div>
</div></section>

<section class="section-pad"><div class="container">
  <div class="cta-band">
    <h2>Ready to improve your ${esc(svc.nav.toLowerCase())}?</h2>
    <p>Schedule a free consultation and see how Horizon Physician Services can strengthen your revenue cycle.</p>
    <a class="btn btn-primary btn-lg" href="index.html#final-cta">Schedule a Consultation</a>
  </div>
</div></section>

${footerHtml(svc)}
${faqAccordionJs()}
</body>
</html>`;
}

function generate(){
  var written=[];
  SERVICES.forEach(function(svc){
    fs.writeFileSync(path.join(OUT, svc.slug + ".html"), render(svc));
    written.push(svc.slug + ".html");
  });
  console.log("Generated " + written.length + " service pages:\n  " + written.join("\n  "));
}
if (require.main === module) generate();
module.exports = { SERVICES, navHtml, footerHtml, faqAccordionJs, esc, render, generate, GA_TAG, ORIGIN, PHONE, EMAIL };

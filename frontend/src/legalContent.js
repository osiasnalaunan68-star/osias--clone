// legalContent.js — text + version for the Privacy Notice / Terms / About screen.
// Pure data (no React, no imports) so authContext.jsx can import LEGAL_VERSION
// without creating a circular import.
//
// HOW TO FORCE EVERYONE TO ACCEPT AGAIN:
//   change LEGAL_VERSION (e.g. "2027-01-15"). Every user will see the
//   acceptance screen once more after their next login.

export const LEGAL_VERSION = "2026-11-03";
export const LEGAL_UPDATED = "November 3, 2026";

// Optional: put your support email here to show a "Contact" line.
// Leave "" to hide it (the developer portfolio link is shown instead).
export const CONTACT_EMAIL = "";
export const DEVELOPER_PORTFOLIO = "https://osiasnalaunan68-star.github.io/osias-personal-portfolio";

// The two things the user must tick on the acceptance screen.
export const CONSENT_ITEMS = [
  {
    id: "terms",
    text: "I have read and agree to the Privacy Notice and Terms of Use, and I consent to the collection and use of my information as described.",
  },
  {
    id: "ai",
    text: "I understand that the AI-generated explanations (Osias 6.7) and quiz content may contain mistakes, and that I use them at my own risk.",
  },
];

// Short highlights shown on the acceptance screen before the full text.
export const KEY_POINTS = [
  { icon: "🤖", title: "AI explanations: use at your own risk", body: "Gamitin sa sariling panganib. AI-generated ang mga paliwanag at maaaring may mali. Laging kumpirmahin sa opisyal na teksto ng batas." },
  { icon: "⚖️", title: "Not official, not legal advice", body: "This is an independent study app. It is not affiliated with the Bureau of Customs, the PRC, or any government agency." },
  { icon: "🔒", title: "Your data", body: "We store your Google name, email and photo, the full name you enter, your device info and your access/payment records. Highlights, notes and quiz progress stay on your device." },
];

// Each section: { id, icon, title, tone?: "warn", blocks: [{ type: "p"|"ul", ... }] }
export const LEGAL_SECTIONS = [
  {
    id: "about",
    icon: "ℹ️",
    title: "About this app",
    blocks: [
      { type: "p", text: "RA 10863 – CuBLE Review App is an offline study and review companion for the Customs Modernization and Tariff Act (CMTA, RA 10863) of the Philippines. It is made for BSCA (Bachelor of Science in Customs Administration) students and Customs Broker Licensure Exam (CuBLE) takers." },
      { type: "p", text: "What you can do in the app:" },
      {
        type: "ul",
        items: [
          "Read the full text of RA 10863, arranged by Title, Chapter and Section, in Study Mode or Reading Mode.",
          "Highlight text, add your own notes, and search the law.",
          "Read Osias 6.7 explanations, which are AI-generated and bundled in the app so they work offline.",
          "Browse Customs Memorandum Orders (CMO) and Customs Administrative Orders (CAO), with summaries and quizzes.",
          "Practice with quizzes and exams in RA 10863, CDP, TL, PC and TCP, or build your own custom quizzes.",
        ],
      },
      { type: "p", text: "The app is built and maintained by Osias. Most content works fully offline once the app has loaded." },
    ],
  },
  {
    id: "ai",
    icon: "🤖",
    title: "AI-generated content: use at your own risk",
    tone: "warn",
    blocks: [
      { type: "p", text: "The Osias 6.7 explanations, summaries and some quiz material in this app were generated with the help of artificial intelligence. AI can be wrong, incomplete or out of date, and it can misread or oversimplify a legal provision." },
      {
        type: "ul",
        items: [
          "Do not rely on AI explanations as the only basis for answering an exam, doing customs work, or making a legal, business or financial decision.",
          "The official text of the law, CMOs and CAOs always prevails over anything in this app. Please verify with the official publications.",
          "Quiz questions, choices, answer keys and explanations may contain errors. If something looks wrong, check the source.",
          "Gamitin ang AI explanations sa sarili ninyong panganib. Hindi ito garantiya ng tamang sagot sa pagsusulit.",
        ],
      },
      { type: "p", text: "Ask AI hand-off: when you tap Meta AI, ChatGPT or Gemini, the app copies a prompt (and the section text) to your clipboard and opens that service. What you paste there is handled by that service under its own terms and privacy policy, not by this app." },
    ],
  },
  {
    id: "official",
    icon: "⚖️",
    title: "Not official · not legal advice",
    blocks: [
      { type: "p", text: "This is an independent study tool. It is not an official publication and is not affiliated with, endorsed by, or connected to the Bureau of Customs, the Professional Regulation Commission, the Tariff Commission, or any other government agency." },
      {
        type: "ul",
        items: [
          "Nothing in the app is legal advice, and no lawyer-client or professional relationship is created by using it.",
          "Laws, CMOs, CAOs and tariff rates are amended from time to time. The app may not reflect the latest changes.",
          "The law text and issuances are included for study and reference. Always confirm against the official sources.",
          "Using the app does not guarantee that you will pass any exam.",
        ],
      },
    ],
  },
  {
    id: "privacy",
    icon: "🔒",
    title: "Privacy Notice",
    blocks: [
      { type: "p", text: "This notice explains how your personal information is handled, in line with the Data Privacy Act of 2012 (Republic Act No. 10173)." },
      { type: "p", text: "Information we collect when you sign in and use the app:" },
      {
        type: "ul",
        items: [
          "From your Google account: name, email address and profile photo.",
          "From you: the full name you enter when setting up your account.",
          "Device information: a random device ID, a device label (for example \"Android · Chrome\") and when it was last active. This is used to enforce the limit of 2 devices per account.",
          "Access records: trial start date, access expiry, subjects unlocked, and the purchase requests you submit (plan, price, payment method chosen, reference code and time). We do not receive or store your GCash, Maya or MariBank login or card details.",
          "Last-seen time, so the admin can see account activity.",
          "Your acceptance of this notice (version and date).",
        ],
      },
      { type: "p", text: "What stays on your device only: highlights, notes, quiz answers and progress, custom quizzes, and display settings are saved in your phone's or browser's local storage. They are not uploaded to our servers. Clearing app data, uninstalling the app or clearing your browser will delete them." },
      { type: "p", text: "Why we use your information:" },
      {
        type: "ul",
        items: [
          "To sign you in and keep your account secure.",
          "To run the free trial and the device limit.",
          "To confirm manual payments and unlock your access.",
          "To let the admin support you and keep the service running.",
        ],
      },
      { type: "p", text: "Who can see it: the app admin can view user records (name, email, device list, access and purchase requests) in the admin panel. Your data is stored and processed using Google Firebase (Authentication and Cloud Firestore), and the app loads fonts from Google Fonts. We do not sell your personal information or use it for advertising." },
      { type: "p", text: "How long we keep it: for as long as your account is active, or until you ask us to delete it, unless we need to keep a record for payments or to prevent abuse." },
    ],
  },
  {
    id: "rights",
    icon: "🙋",
    title: "Your rights",
    blocks: [
      { type: "p", text: "Under the Data Privacy Act you have the right to be informed, to access your data, to correct it, to object to or withdraw consent for its processing, to request blocking or deletion, and to file a complaint with the National Privacy Commission (privacy.gov.ph)." },
      { type: "p", text: "To use any of these rights, or to ask for your account data to be deleted, contact the developer using the details at the bottom of this page. Withdrawing consent means you will no longer be able to use the signed-in features of the app." },
    ],
  },
  {
    id: "terms",
    icon: "📄",
    title: "Terms of use",
    blocks: [
      {
        type: "ul",
        items: [
          "Personal use only. Your account is for you. Do not share it, sell access, or let others use your paid access.",
          "Device limit. One account can be signed in on up to 2 devices at a time.",
          "No copying or scraping. Do not copy, redistribute, resell or scrape the app's explanations, quizzes or other compiled content.",
          "Trial and plans. New accounts get a free trial. After that, access is time-limited and depends on the plan you pay for. Prices, plans and what each plan includes may change.",
          "Manual payments. Payments are confirmed manually by the admin, so unlocking access may take some time. Keep your reference code until your access is confirmed.",
          "Service provided \"as is\". We try to keep the app accurate and available, but we make no warranty that it is error-free, uninterrupted or fit for any particular purpose.",
          "Limit of liability. To the extent allowed by law, the developer is not liable for any loss or damage arising from your use of, or reliance on, the app or its content, including AI-generated content.",
          "Misuse. We may suspend or remove access for abuse, sharing, or attempts to bypass the trial, device limit or payment checks.",
        ],
      },
    ],
  },
  {
    id: "changes",
    icon: "🔄",
    title: "Changes to this notice",
    blocks: [
      { type: "p", text: "We may update this page when the app changes. When we make a meaningful change you will be asked to review and accept it again the next time you sign in. You can read the current version at any time in Settings → Privacy & Terms." },
    ],
  },
];

/**
 * ==========================================================================
 * Certificates & Achievements Central Data Store
 * ==========================================================================
 * 
 * HOW TO ADD A NEW CERTIFICATE:
 * 1. Place your certificate file inside:
 *    - public/certificates/images/ (for .png, .jpg, .jpeg, .webp)
 *    - public/certificates/pdfs/   (for .pdf)
 * 
 * 2. Add an object to the CERTIFICATES array below:
 *    {
 *      id: "unique-identifier",
 *      title: "Certificate or Event Title",
 *      organization: "Issuing Organization",
 *      date: "Month Year or Exact Date",
 *      category: "Certification" | "Hackathon" | "Virtual Experience",
 *      description: "Brief summary of what you learned or achieved.",
 *      skills: ["Skill 1", "Skill 2", "Skill 3"],
 *      file: "public/certificates/pdfs/your-file.pdf", // or "public/certificates/pdfs/..." or "public/certificates/images/..."
 *      fileType: "pdf" | "image",
 *      credentialId: "",      // Optional: Leave empty string if not applicable
 *      verificationUrl: ""    // Optional: Leave empty string if not applicable
 *    }
 * 
 * The website UI, category filters, counters, and modal viewers update automatically!
 */

const CERTIFICATES = [
  {
    id: "sih-internal-hackathon-2026",
    title: "SIH Internal Hackathon",
    organization: "Sri Shakthi Institute of Engineering and Technology",
    date: "25 August 2026",
    category: "Hackathon",
    description: "Awarded Certificate of Excellence as a Top Performer in the SIH Internal Hackathon organized by Sri Shakthi Institute of Engineering and Technology for demonstrated problem-solving, rapid prototyping, and software engineering execution.",
    skills: ["AI Problem Solving", "Rapid Prototyping", "Team Collaboration", "Software Engineering"],
    file: "public/certificates/pdfs/SIH.pdf",
    fileType: "pdf",
    credentialId: "",
    verificationUrl: ""
  },
  {
    id: "osdhack-2026",
    title: "OSDHACK'26 Hackathon",
    organization: "OSDC (Open Source Developers Community)",
    date: "July 2026",
    category: "Hackathon",
    description: "Awarded Certificate of Merit for active participation and project building in OSDHACK'26, an open-source hackathon organized by OSDC in partnership with FOSS United and CodeCrafters.io.",
    skills: ["Open Source", "Hackathon", "Rapid Prototyping", "Collaboration"],
    file: "public/certificates/pdfs/osd hackathon.pdf",
    fileType: "pdf",
    credentialId: "",
    verificationUrl: ""
  },
  {
    id: "tata-genai-data-analytics-2026",
    title: "GenAI Powered Data Analytics Job Simulation",
    organization: "Tata Group (via Forage)",
    date: "27 June 2026",
    category: "Virtual Experience",
    description: "Completed practical job simulation in exploratory data analysis and risk profiling, predicting delinquency with AI, business reporting, and data storytelling for AI-driven collections strategy.",
    skills: ["Generative AI", "Data Analytics", "Risk Profiling", "Data Storytelling", "Predictive Modeling"],
    file: "public/certificates/pdfs/TATA.pdf",
    fileType: "pdf",
    credentialId: "ry4Ne6LGCyQfQzr84",
    verificationUrl: "https://www.theforage.com/simulations/tata/data-analytics-182n"
  },
  {
    id: "deloitte-data-analytics-2026",
    title: "Data Analytics Job Simulation",
    organization: "Deloitte (via Forage)",
    date: "26 June 2026",
    category: "Virtual Experience",
    description: "Completed practical job simulation tasks in data analysis and forensic technology, investigating data anomalies, structuring analytical findings, and communicating business insights.",
    skills: ["Data Analytics", "Forensic Technology", "Data Investigation", "Business Insights"],
    file: "public/certificates/pdfs/Deloite.pdf",
    fileType: "pdf",
    credentialId: "tL78ragCKpiexfD7j",
    verificationUrl: "https://www.theforage.com/simulations/deloitte-au/data-analytics-pman"
  },
  {
    id: "quantium-data-analytics-2026",
    title: "Data Analytics Job Simulation",
    organization: "Quantium (via Forage)",
    date: "29 June 2026",
    category: "Virtual Experience",
    description: "Completed advanced practical modules in customer analytics, transaction data preparation, uplift testing and experimentation, and translating data insights into commercial recommendations.",
    skills: ["Customer Analytics", "Data Preparation", "Uplift Testing", "Statistical Experimentation"],
    file: "public/certificates/pdfs/Quantaum.pdf",
    fileType: "pdf",
    credentialId: "dfhdqtQ6phB4hTyLA",
    verificationUrl: "https://www.theforage.com/simulations/quantium/data-analytics-uq5d"
  },
  {
    id: "citi-markets-quantitative-analysis-2026",
    title: "Markets Quantitative Analysis (MQA) Job Simulation",
    organization: "Citi (via Forage)",
    date: "27 June 2026",
    category: "Virtual Experience",
    description: "Completed practical simulation tasks in financial math fundamentals, team structuring, pricing commodities (coffee), hedging and structuring securities, and managing risk across market trade units.",
    skills: ["Quantitative Analysis", "Financial Mathematics", "Commodity Pricing", "Hedging & Risk Management"],
    file: "public/certificates/pdfs/Citi.pdf",
    fileType: "pdf",
    credentialId: "aeWeEM6FhzfLXTXsL",
    verificationUrl: "https://www.theforage.com/simulations/citi/markets-quantitative-analysis-q4d7"
  }
];

// Export to global scope for standard script tag inclusion in index.html
if (typeof window !== "undefined") {
  window.CERTIFICATES_DATA = CERTIFICATES;
}

// Export for ES modules / CommonJS bundlers if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = { CERTIFICATES };
}

// ==========================================================================
// Tanu Sri. R - Portfolio Interactive Scripts & Certifications System
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------------------------------
  // 1. Mobile Menu Toggle
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("nav");
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen);
    });

    // Close menu when clicking on any nav link
    document.querySelectorAll(".nav-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. Navbar Shadow on Scroll
  // --------------------------------------------------------------------------
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // --------------------------------------------------------------------------
  // 3. Active Nav Link on Scroll Spy
  // --------------------------------------------------------------------------
  const updateActiveNavLink = () => {
    const scrollY = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  };
  window.addEventListener("scroll", updateActiveNavLink, { passive: true });

  // --------------------------------------------------------------------------
  // 4. Subtle Intersection Observer for Reveal Animations
  // --------------------------------------------------------------------------
  let revealObserver = null;
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  // --------------------------------------------------------------------------
  // 5. Certifications & Achievements Dynamic System
  // --------------------------------------------------------------------------
  initCertificationsSystem(revealObserver);
});

/**
 * Helper to safely resolve certificate file paths across various host setups
 * @param {string} path 
 * @returns {string}
 */
function resolveCertificatePath(path) {
  if (!path) return "";
  let clean = path.trim();
  // Strip leading slash if present so it resolves relative to site root
  if (clean.startsWith("/")) {
    clean = clean.substring(1);
  }
  return clean;
}

/**
 * Encodes URI for file paths ensuring spaces and special characters load properly
 * @param {string} path 
 * @returns {string}
 */
function getEncodedPath(path) {
  const resolved = resolveCertificatePath(path);
  return encodeURI(resolved);
}

/**
 * Fallback handler for missing certificate image preview
 * @param {HTMLImageElement} img 
 */
function handleCertImageError(img) {
  img.style.display = "none";
  const parent = img.closest(".cert-thumb-box");
  if (parent && !parent.querySelector(".cert-thumb-fallback")) {
    const fallback = document.createElement("div");
    fallback.className = "cert-thumb-fallback";
    fallback.innerHTML = `
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
      <span>Certificate preview unavailable</span>
    `;
    parent.appendChild(fallback);
  }
}

/**
 * Initializes the entire Certifications system (rendering, filtering, modal viewers)
 * @param {IntersectionObserver|null} revealObserver 
 */
function initCertificationsSystem(revealObserver) {
  const gridContainer = document.getElementById("certificationsGrid");
  const emptyState = document.getElementById("certEmptyState");
  const filterButtons = document.querySelectorAll(".cert-filter-btn");

  // Certificate Modal Elements
  const modalBackdrop = document.getElementById("certModal");
  const modalTitle = document.getElementById("certModalTitle");
  const modalOrg = document.getElementById("certModalOrg");
  const modalBadge = document.getElementById("certModalBadge");
  const modalNewTab = document.getElementById("certModalNewTab");
  const modalBody = document.getElementById("certModalBody");
  const modalMeta = document.getElementById("certModalMeta");
  const modalFooterActions = document.getElementById("certModalFooterActions");
  const modalCloseBtn = document.getElementById("certModalClose");

  let lastFocusedElement = null;
  let currentActiveCategory = "All";

  // Check for certificates data
  const certificatesData = (typeof window !== "undefined" && Array.isArray(window.CERTIFICATES_DATA))
    ? window.CERTIFICATES_DATA
    : [];

  // Update Category Badge Counts
  updateFilterCounts(certificatesData);

  // Normalize category comparison
  function matchCategory(itemCategory, targetCategory) {
    if (targetCategory === "All") return true;
    const item = (itemCategory || "").toLowerCase().trim();
    const target = (targetCategory || "").toLowerCase().trim();

    if (target === "certifications") {
      return item === "certification" || item === "certifications";
    }
    if (target === "hackathons") {
      return item === "hackathon" || item === "hackathons";
    }
    if (target === "virtual experience") {
      return item === "virtual experience" || item === "virtual experiences" || item.includes("virtual");
    }
    return item === target;
  }

  // Render Certificate Cards
  function renderCertificates(category = "All") {
    if (!gridContainer) return;

    currentActiveCategory = category;
    const filtered = certificatesData.filter((c) => matchCategory(c.category, category));

    if (filtered.length === 0) {
      gridContainer.innerHTML = "";
      gridContainer.style.display = "none";
      if (emptyState) emptyState.style.display = "flex";
      return;
    }

    if (emptyState) emptyState.style.display = "none";
    gridContainer.style.display = "grid";

    gridContainer.innerHTML = filtered
      .map((cert, index) => createCertificateCardHTML(cert, index))
      .join("");

    // Attach reveal observer to new items
    if (revealObserver) {
      gridContainer.querySelectorAll(".reveal").forEach((card) => {
        revealObserver.observe(card);
      });
    } else {
      gridContainer.querySelectorAll(".reveal").forEach((card) => {
        card.classList.add("visible");
      });
    }
  }

  // Generate Card HTML
  function createCertificateCardHTML(cert, index) {
    const isPdf = cert.fileType === "pdf" || (cert.file && cert.file.toLowerCase().endsWith(".pdf"));
    const encodedFile = getEncodedPath(cert.file);
    const categoryName = cert.category || "Certification";
    const categoryClass = getCategoryBadgeClass(categoryName);

    // Skill pills
    const skillPills = Array.isArray(cert.skills) && cert.skills.length > 0
      ? cert.skills.map((s) => `<span class="tag">${escapeHTML(s)}</span>`).join("")
      : "";

    // Optional Credential ID
    const credentialIdHTML = cert.credentialId && cert.credentialId.trim() !== ""
      ? `<div class="cert-cred-id">
           <span class="cred-label">Credential ID:</span>
           <span class="cred-value">${escapeHTML(cert.credentialId)}</span>
         </div>`
      : "";

    // Optional Verify URL button
    const verifyButtonHTML = cert.verificationUrl && cert.verificationUrl.trim() !== ""
      ? `<a class="btn btn-sm btn-tertiary cert-verify-btn" href="${escapeHTML(cert.verificationUrl)}" target="_blank" rel="noopener noreferrer">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
           </svg>
           Verify Credential
           <span class="arrow">↗</span>
         </a>`
      : "";

    // Thumbnail Preview: Image vs PDF
    let thumbnailHTML = "";
    if (isPdf) {
      thumbnailHTML = `
        <div class="cert-thumb-box cert-thumb-pdf" data-cert-id="${escapeHTML(cert.id)}" role="button" tabindex="0" aria-label="View PDF certificate for ${escapeHTML(cert.title)}">
          <div class="pdf-preview-canvas">
            <div class="pdf-icon-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span class="pdf-badge-tag">PDF DOCUMENT</span>
            </div>
            <div class="pdf-preview-title">${escapeHTML(cert.title)}</div>
            <div class="pdf-preview-sub">${escapeHTML(cert.organization)}</div>
          </div>
          <div class="cert-thumb-overlay">
            <span class="thumb-view-label">
              <span>View Certificate</span>
              <span class="arrow">↗</span>
            </span>
          </div>
        </div>
      `;
    } else {
      thumbnailHTML = `
        <div class="cert-thumb-box cert-thumb-img" data-cert-id="${escapeHTML(cert.id)}" role="button" tabindex="0" aria-label="View certificate for ${escapeHTML(cert.title)}">
          <img 
            src="${escapeHTML(encodedFile)}" 
            alt="${escapeHTML(cert.title)} Certificate - ${escapeHTML(cert.organization)}" 
            class="cert-img-preview" 
            loading="lazy" 
            onerror="handleCertImageError(this)" 
          />
          <div class="cert-thumb-overlay">
            <span class="thumb-view-label">
              <span>View Certificate</span>
              <span class="arrow">↗</span>
            </span>
          </div>
        </div>
      `;
    }

    return `
      <article class="cert-card card reveal" data-category="${escapeHTML(categoryName)}" id="cert-card-${escapeHTML(cert.id)}">
        <div class="cert-card-header-banner">
          <div class="cert-header-meta">
            <span class="cert-category-badge ${categoryClass}">${escapeHTML(categoryName)}</span>
            <span class="cert-date-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              ${escapeHTML(cert.date || "")}
            </span>
          </div>
        </div>

        ${thumbnailHTML}

        <div class="cert-card-body">
          <span class="cert-org-name">${escapeHTML(cert.organization || "")}</span>
          <h3 class="cert-title">${escapeHTML(cert.title || "")}</h3>
          
          ${cert.description ? `<p class="cert-description">${escapeHTML(cert.description)}</p>` : ""}

          ${credentialIdHTML}

          ${skillPills ? `<div class="cert-skills">${skillPills}</div>` : ""}

          <div class="cert-card-actions">
            <button class="btn btn-outline btn-sm cert-view-btn" data-cert-id="${escapeHTML(cert.id)}" aria-label="View ${escapeHTML(cert.title)} certificate">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              View Certificate
              <span class="arrow">↗</span>
            </button>
            ${verifyButtonHTML}
          </div>
        </div>
      </article>
    `;
  }

  // Category Badge Class Mapping
  function getCategoryBadgeClass(category) {
    const cat = (category || "").toLowerCase();
    if (cat.includes("hackathon")) return "badge-hackathon";
    if (cat.includes("virtual")) return "badge-virtual";
    return "badge-cert";
  }

  // Update filter count numbers
  function updateFilterCounts(data) {
    const countAll = document.getElementById("countAll");
    const countCertifications = document.getElementById("countCertifications");
    const countHackathons = document.getElementById("countHackathons");
    const countVirtual = document.getElementById("countVirtualExperience");

    if (countAll) countAll.textContent = data.length;
    if (countCertifications) {
      countCertifications.textContent = data.filter((c) => matchCategory(c.category, "Certifications")).length;
    }
    if (countHackathons) {
      countHackathons.textContent = data.filter((c) => matchCategory(c.category, "Hackathons")).length;
    }
    if (countVirtual) {
      countVirtual.textContent = data.filter((c) => matchCategory(c.category, "Virtual Experience")).length;
    }
  }

  // Category Filter Tab Click Listeners
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const category = btn.getAttribute("data-category") || "All";
      
      // Smooth grid fade transition
      if (gridContainer) {
        gridContainer.classList.add("filtering");
        setTimeout(() => {
          renderCertificates(category);
          gridContainer.classList.remove("filtering");
        }, 150);
      } else {
        renderCertificates(category);
      }
    });
  });

  // Modal Open Function
  function openModal(certId, triggerElement) {
    const cert = certificatesData.find((c) => c.id === certId);
    if (!cert || !modalBackdrop) return;

    lastFocusedElement = triggerElement || document.activeElement;
    const encodedFile = getEncodedPath(cert.file);
    const isPdf = cert.fileType === "pdf" || (cert.file && cert.file.toLowerCase().endsWith(".pdf"));

    // Set Header Data
    if (modalTitle) modalTitle.textContent = cert.title;
    if (modalOrg) modalOrg.textContent = cert.organization;
    if (modalBadge) {
      modalBadge.textContent = cert.category || "Certificate";
      modalBadge.className = `cert-modal-badge ${getCategoryBadgeClass(cert.category)}`;
    }
    if (modalNewTab) {
      modalNewTab.href = encodedFile;
      modalNewTab.setAttribute("aria-label", `Open ${cert.title} in new tab`);
    }

    // Set Body Content
    if (modalBody) {
      modalBody.innerHTML = "";
      if (isPdf) {
        // PDF Viewer with embed and mobile-friendly direct action
        modalBody.innerHTML = `
          <div class="cert-modal-pdf-wrap">
            <div class="cert-modal-pdf-loading" id="pdfLoadingSpinner">
              <div class="spinner"></div>
              <span>Loading certificate document...</span>
            </div>
            <iframe 
              src="${escapeHTML(encodedFile)}#toolbar=1&navpanes=0" 
              title="${escapeHTML(cert.title)} - ${escapeHTML(cert.organization)}"
              class="cert-modal-pdf-frame"
              onload="document.getElementById('pdfLoadingSpinner')?.classList.add('hidden')"
            ></iframe>
            <div class="cert-modal-pdf-mobile-fallback">
              <p>For the best viewing experience on mobile devices:</p>
              <a class="btn btn-primary" href="${escapeHTML(encodedFile)}" target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                Open Fullscreen PDF ↗
              </a>
            </div>
          </div>
        `;
      } else {
        // Image Lightbox Viewer
        modalBody.innerHTML = `
          <div class="cert-modal-img-wrap">
            <div class="cert-modal-img-loading" id="imgLoadingSpinner">
              <div class="spinner"></div>
            </div>
            <img 
              src="${escapeHTML(encodedFile)}" 
              alt="${escapeHTML(cert.title)} Certificate issued by ${escapeHTML(cert.organization)}" 
              class="cert-modal-image"
              onload="document.getElementById('imgLoadingSpinner')?.classList.add('hidden')"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            />
            <div class="cert-modal-img-fallback" style="display: none;">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>Unable to display image preview directly.</p>
              <a class="btn btn-sm btn-primary" href="${escapeHTML(encodedFile)}" target="_blank" rel="noopener noreferrer">
                Open Image in New Tab ↗
              </a>
            </div>
          </div>
        `;
      }
    }

    // Set Footer Content (Credential ID / Date / Verification Link)
    if (modalMeta) {
      let metaHTML = "";
      if (cert.date) {
        metaHTML += `<span class="modal-date">Issued: <strong>${escapeHTML(cert.date)}</strong></span>`;
      }
      if (cert.credentialId && cert.credentialId.trim() !== "") {
        metaHTML += `<span class="modal-cred-id">Credential ID: <code>${escapeHTML(cert.credentialId)}</code></span>`;
      }
      modalMeta.innerHTML = metaHTML;
    }

    if (modalFooterActions) {
      if (cert.verificationUrl && cert.verificationUrl.trim() !== "") {
        modalFooterActions.innerHTML = `
          <a class="btn btn-sm btn-secondary" href="${escapeHTML(cert.verificationUrl)}" target="_blank" rel="noopener noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            Verify Credential ↗
          </a>
        `;
      } else {
        modalFooterActions.innerHTML = "";
      }
    }

    // Show Modal & Prevent Body Scroll
    modalBackdrop.classList.add("active");
    modalBackdrop.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    // Focus close button for accessibility
    setTimeout(() => {
      modalCloseBtn?.focus();
    }, 100);
  }

  // Modal Close Function
  function closeModal() {
    if (!modalBackdrop || !modalBackdrop.classList.contains("active")) return;

    modalBackdrop.classList.remove("active");
    modalBackdrop.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    // Clear iframe/image after fade out to save memory
    setTimeout(() => {
      if (modalBody && !modalBackdrop.classList.contains("active")) {
        modalBody.innerHTML = "";
      }
    }, 250);

    // Restore focus
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  // Event Delegation for Certificate Grid clicks
  gridContainer?.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-cert-id]");
    if (trigger) {
      const certId = trigger.getAttribute("data-cert-id");
      if (certId) {
        e.preventDefault();
        openModal(certId, trigger);
      }
    }
  });

  // Keyboard accessibility for thumbnails (Enter or Space)
  gridContainer?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const trigger = e.target.closest("[data-cert-id]");
      if (trigger && (trigger.classList.contains("cert-thumb-box") || trigger.classList.contains("cert-view-btn"))) {
        e.preventDefault();
        const certId = trigger.getAttribute("data-cert-id");
        if (certId) openModal(certId, trigger);
      }
    }
  });

  // Modal Dismiss Listeners
  modalCloseBtn?.addEventListener("click", closeModal);

  // Click outside modal container (on backdrop)
  modalBackdrop?.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  // ESC key listener to close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalBackdrop?.classList.contains("active")) {
      closeModal();
    }
  });

  // Initial Render
  renderCertificates("All");
}

/**
 * Escapes HTML characters to prevent XSS
 * @param {string} str 
 * @returns {string}
 */
function escapeHTML(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

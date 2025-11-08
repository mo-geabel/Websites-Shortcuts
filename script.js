// Link Management System
let links = [];
let editingLinkId = null;

// Dark Mode Toggle Functionality
function initDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const darkModeIcon = document.getElementById("darkModeIcon");
  const body = document.body;

  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    body.classList.add("dark-mode");
    darkModeIcon.classList.remove("fa-moon");
    darkModeIcon.classList.add("fa-sun");
  }

  darkModeToggle.addEventListener("click", function () {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
      darkModeIcon.classList.remove("fa-moon");
      darkModeIcon.classList.add("fa-sun");
      localStorage.setItem("theme", "dark");
    } else {
      darkModeIcon.classList.remove("fa-sun");
      darkModeIcon.classList.add("fa-moon");
      localStorage.setItem("theme", "light");
    }
  });
}

// Load links from localStorage or initialize with existing cards
function loadLinks() {
  const savedLinks = localStorage.getItem("quickLinks");
  if (savedLinks) {
    links = JSON.parse(savedLinks);
  } else {
    // Extract existing links from HTML
    const existingCards = document.querySelectorAll(".site-card");
    existingCards.forEach((card) => {
      const linkId = card.getAttribute("data-link-id") || generateId();
      const name = card.querySelector("h3")?.textContent || "";
      const description = card.querySelector("p")?.textContent || "";
      const url = card.getAttribute("href") || "";
      const iconUrl = card.getAttribute("data-icon-url") || "";

      links.push({
        id: linkId,
        name,
        description,
        url,
        iconUrl,
      });
    });
    saveLinks();
  }
  renderLinks();
}

// Save links to localStorage
function saveLinks() {
  localStorage.setItem("quickLinks", JSON.stringify(links));
}

// Generate unique ID
function generateId() {
  return "link_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}

// Render all links
function renderLinks() {
  const container = document.getElementById("linksContainer");
  container.innerHTML = "";

  links.forEach((link) => {
    const card = createLinkCard(link);
    container.appendChild(card);
  });

  // Re-initialize card interactions
  initCardInteractions();
}

// Create a link card element
function createLinkCard(link) {
  const card = document.createElement("a");
  card.href = link.url;
  card.target = "_blank";
  card.className = "site-card shadow-md p-2 sm:p-3 md:p-3 cursor-pointer";
  card.setAttribute("data-link-id", link.id);
  if (link.iconUrl) {
    card.setAttribute("data-icon-url", link.iconUrl);
  }

  const iconContainer = document.createElement("div");
  iconContainer.className = "icon-container";

  if (link.iconUrl && link.iconUrl.trim() !== "") {
    iconContainer.innerHTML = `<img src="${link.iconUrl}" alt="${link.name}" />`;
  } else {
    iconContainer.innerHTML = `<i class="fas fa-link"></i>`;
  }

  const title = document.createElement("h3");
  title.className = "font-semibold";
  title.textContent = link.name;

  const description = document.createElement("p");
  description.className = "mt-0.5";
  description.textContent = link.description || "";

  card.appendChild(iconContainer);
  card.appendChild(title);
  if (link.description) {
    card.appendChild(description);
  }

  return card;
}

// Initialize card interactions (click, right-click)
function initCardInteractions() {
  const siteCards = document.querySelectorAll(".site-card");

  siteCards.forEach((card) => {
    // Left click - navigate
    card.addEventListener("click", function (e) {
      // Only navigate if not right-clicking
      if (e.button === 0 || !e.button) {
        const siteName = this.querySelector("h3").textContent;
        console.log(`Navigating to ${siteName}`);

        // Ripple effect
        const ripple = document.createElement("span");
        ripple.style.position = "absolute";
        ripple.style.borderRadius = "50%";
        ripple.style.background = "rgba(255, 255, 255, 0.6)";
        ripple.style.transform = "scale(0)";
        ripple.style.animation = "ripple 0.6s linear";
        ripple.style.left = "50%";
        ripple.style.top = "50%";
        ripple.style.width = "20px";
        ripple.style.height = "20px";
        ripple.style.marginLeft = "-10px";
        ripple.style.marginTop = "-10px";

        this.style.position = "relative";
        this.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      }
    });

    // Right click - context menu
    card.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      showContextMenu(e, card);
    });
  });
}

// Show context menu
function showContextMenu(e, card) {
  const contextMenu = document.getElementById("contextMenu");
  contextMenu.classList.remove("hidden");
  contextMenu.style.left = e.pageX + "px";
  contextMenu.style.top = e.pageY + "px";

  const linkId = card.getAttribute("data-link-id");
  const link = links.find((l) => l.id === linkId);

  // Edit option
  document.getElementById("editOption").onclick = () => {
    editLink(link);
    hideContextMenu();
  };

  // Delete option
  document.getElementById("deleteOption").onclick = () => {
    deleteLink(linkId);
    hideContextMenu();
  };
}

// Hide context menu
function hideContextMenu() {
  document.getElementById("contextMenu").classList.add("hidden");
}

// Close context menu when clicking outside
document.addEventListener("click", function (e) {
  if (!e.target.closest(".context-menu") && !e.target.closest(".site-card")) {
    hideContextMenu();
  }
});

// Modal functions
function showModal(isEdit = false) {
  const modal = document.getElementById("linkModal");
  const modalTitle = document.getElementById("modalTitle");

  modal.classList.remove("hidden");
  modalTitle.textContent = isEdit ? "Edit Link" : "Add New Link";

  // Only reset the form if it's NOT editing
  if (!isEdit) {
    const form = document.getElementById("linkForm");
    form.reset();
    editingLinkId = null;
  }
}

function hideModal() {
  const modal = document.getElementById("linkModal");
  modal.classList.add("hidden");
  const form = document.getElementById("linkForm");
  form.reset();
  editingLinkId = null;
}

function editLink(link) {
  editingLinkId = link.id;
  document.getElementById("linkName").value = link.name;
  document.getElementById("linkUrl").value = link.url;
  document.getElementById("linkDescription").value = link.description || "";
  document.getElementById("linkIconUrl").value = link.iconUrl || "";
  showModal(true);
}

function deleteLink(linkId) {
  if (confirm("Are you sure you want to delete this link?")) {
    links = links.filter((link) => link.id !== linkId);
    saveLinks();
    renderLinks();
  }
}

// Initialize everything
document.addEventListener("DOMContentLoaded", function () {
  initDarkMode();
  loadLinks();

  // Add link button
  document.getElementById("addLinkBtn").addEventListener("click", () => {
    showModal(false);
  });

  // Close modal buttons
  document.getElementById("closeModal").addEventListener("click", hideModal);
  document.getElementById("cancelBtn").addEventListener("click", hideModal);

  // Close modal on outside click
  document.getElementById("linkModal").addEventListener("click", function (e) {
    if (e.target === this) {
      hideModal();
    }
  });

  // Form submission
  document.getElementById("linkForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("linkName").value.trim();
    const url = document.getElementById("linkUrl").value.trim();
    const description = document.getElementById("linkDescription").value.trim();
    const iconUrl = document.getElementById("linkIconUrl").value.trim();

    if (!name || !url) {
      alert("Please fill in at least Name and URL fields");
      return;
    }

    if (editingLinkId) {
      // Update existing link
      const linkIndex = links.findIndex((l) => l.id === editingLinkId);
      if (linkIndex !== -1) {
        links[linkIndex] = {
          id: editingLinkId,
          name,
          url,
          description,
          iconUrl,
        };
      }
    } else {
      // Add new link
      links.push({
        id: generateId(),
        name,
        url,
        description,
        iconUrl,
      });
    }

    saveLinks();
    renderLinks();
    hideModal();
  });
});

// Add ripple animation
const style = document.createElement("style");
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

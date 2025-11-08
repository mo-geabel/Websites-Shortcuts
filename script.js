// Dark Mode Toggle Functionality
function initDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const darkModeIcon = document.getElementById("darkModeIcon");
  const body = document.body;

  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    body.classList.add("dark-mode");
    darkModeIcon.classList.remove("fa-moon");
    darkModeIcon.classList.add("fa-sun");
  }

  // Toggle dark mode
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

// Add click tracking and animations
document.addEventListener("DOMContentLoaded", function () {
  // Initialize dark mode
  initDarkMode();

  const siteCards = document.querySelectorAll(".site-card");

  // Process image icons from data-icon-url attribute
  siteCards.forEach((card) => {
    const iconUrl = card.getAttribute("data-icon-url");
    const iconContainer = card.querySelector(".icon-container");

    // If data-icon-url is provided and not empty, replace content with image
    if (iconUrl && iconUrl.trim() !== "" && iconContainer) {
      iconContainer.innerHTML = `<img src="${iconUrl}" alt="Icon" />`;
    }
  });

  siteCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      const siteName = this.querySelector("h3").textContent;
      console.log(`Navigating to ${siteName}`);

      // Add a ripple effect
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
    });

    // Add hover sound effect (optional - can be removed)
    card.addEventListener("mouseenter", function () {
      this.style.transition = "all 0.3s ease";
    });
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

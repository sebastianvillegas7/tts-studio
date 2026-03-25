document.addEventListener("DOMContentLoaded", function () {
  const desktopLinks = Array.from(document.querySelectorAll("#menu .nav-link[href^='#']"));
  const sectionIds = [...new Set(
    desktopLinks.map(link => link.getAttribute("href")).filter(Boolean)
  )];

  function getAllMatchingLinks(hash) {
    return document.querySelectorAll(`#menu .nav-link[href='${hash}'], .slicknav_nav a[href='${hash}']`);
  }

  function clearActive() {
    document.querySelectorAll("#menu .nav-link[href^='#'], .slicknav_nav a[href^='#']").forEach(link => {
      link.classList.remove("active");
    });
  }

  function setActiveByHash(hash) {
    clearActive();
    getAllMatchingLinks(hash).forEach(link => link.classList.add("active"));
  }

  function setActiveOnScroll() {
    let current = "#home";
    const scrollPosition = window.scrollY + 140;

    sectionIds.forEach(hash => {
      const section = document.querySelector(hash);
      if (!section) return;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = hash;
      }
    });

    setActiveByHash(current);
  }

  document.addEventListener("click", function (e) {
    const link = e.target.closest("#menu .nav-link[href^='#'], .slicknav_nav a[href^='#']");
    if (!link) return;

    const hash = link.getAttribute("href");
    setActiveByHash(hash);

    const slickBtn = document.querySelector(".slicknav_btn");
    const slickNav = document.querySelector(".slicknav_nav");

    if (slickBtn && slickNav && getComputedStyle(slickNav).display !== "none") {
      setTimeout(() => {
        slickBtn.click();
      }, 150);
    }
  });

  window.addEventListener("scroll", setActiveOnScroll);
  window.addEventListener("load", setActiveOnScroll);

  setTimeout(setActiveOnScroll, 300);
});
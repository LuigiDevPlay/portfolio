document.addEventListener("DOMContentLoaded", function () {
  // --- 1. CONFIGURACIÓN DEL TEMA (DARK/LIGHT MODE) ---
  const themeToggle = document.getElementById("themeToggle");
  const html = document.documentElement;
  const icon = themeToggle?.querySelector("i");
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  // Corregido: error tipográfico "schame" -> "scheme"
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  function applyTheme(theme) {
    if (theme === "dark") {
      html.classList.add("dark");
      icon?.classList.replace("fa-moon", "fa-sun");
      metaThemeColor?.setAttribute("content", "#000000");
    } else {
      html.classList.remove("dark");
      icon?.classList.replace("fa-sun", "fa-moon");
      metaThemeColor?.setAttribute("content", "#ffffff");
    }
  }

  // Inicializar tema
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }

  themeToggle?.addEventListener("click", () => {
    const isDark = html.classList.toggle("dark");
    const currentTheme = isDark ? "dark" : "light";
    localStorage.setItem("theme", currentTheme);
    applyTheme(currentTheme);
  });

  // --- 2. NAVEGACIÓN MÓVIL ---
  const menuToggle = document.getElementById("menuToggle");
  const closeMenu = document.getElementById("closeMenu");
  const mobileMenu = document.getElementById("mobileMenu");

  const toggleMobileMenu = (isOpen) => {
    if (isOpen) {
      mobileMenu?.classList.remove("translate-x-full");
      document.body.style.overflow = "hidden";
    } else {
      mobileMenu?.classList.add("translate-x-full");
      document.body.style.overflow = "";
    }
  };

  menuToggle?.addEventListener("click", () => toggleMobileMenu(true));
  closeMenu?.addEventListener("click", () => toggleMobileMenu(false));

  // Cerrar menú al hacer click en links
  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => toggleMobileMenu(false));
  });

  // --- 3. SCROLL SUAVE (SMOOTH SCROLL) ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = document.querySelector("header")?.offsetHeight || 0;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // --- 4. FORMULARIO DE CONTACTO CON FORMSPREE (AJAX) ---
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const button = contactForm.querySelector('button[type="submit"]');
      const originalContent = button.innerHTML;
      const formData = new FormData(this);

      // Estado de carga visual
      button.disabled = true;
      button.innerHTML = '<i class="fa-solid fa-circle-notch animate-spin mr-2"></i> Enviando...';

      try {
        const response = await fetch(this.action, {
          method: this.method,
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          // ÉXITO
          button.innerHTML = '<i class="fa-solid fa-check mr-2"></i> ¡Mensaje Enviado! 🚀';

          // Cambiamos el estilo a verde éxito
          button.classList.remove(
            "bg-linear-to-r",
            "from-blue-600",
            "via-indigo-600",
            "to-purple-600",
          );
          button.classList.add("bg-green-600");

          contactForm.reset();

          // Restaurar botón después de 4 segundos
          setTimeout(() => {
            button.disabled = false;
            button.innerHTML = originalContent;
            button.classList.remove("bg-green-600");
            button.classList.add(
              "bg-linear-to-r",
              "from-blue-600",
              "via-indigo-600",
              "to-purple-600",
            );
          }, 4000);
        } else {
          throw new Error("Error en la respuesta del servidor");
        }
      } catch (error) {
        // ERROR
        button.disabled = false;
        button.innerHTML = '<i class="fa-solid fa-xmark mr-2"></i> Error al enviar';
        console.error("Formspree Error:", error);

        setTimeout(() => {
          button.innerHTML = originalContent;
        }, 4000);
      }
    });
  }

  // --- 5. ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER) ---
  const observerOptions = {
    threshold: 0.15,
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("opacity-100", "translate-y-0");
        entry.target.classList.remove("opacity-0", "translate-y-4");
        revealObserver.unobserve(entry.target); // Solo anima una vez
      }
    });
  }, observerOptions);

  document.querySelectorAll("section").forEach((section) => {
    revealObserver.observe(section);
  });

  // Sombras en el header al hacer scroll
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header?.classList.add("shadow-lg", "backdrop-blur-md", "bg-white/80", "dark:bg-black/80");
    } else {
      header?.classList.remove("shadow-lg", "backdrop-blur-md", "bg-white/80", "dark:bg-black/80");
    }
  });

  // --- 6. ANIMACIÓN DE TERMINAL (MÁQUINA DE ESCRIBIR) ---
  const terminalText = document.querySelector(".command-text");
  if (terminalText) {
    const fullText = "git clone https://github.com/luigiProGame/Personal-Portfolio.git";
    terminalText.textContent = "";
    let index = 0;

    function typeWriter() {
      if (index < fullText.length) {
        terminalText.textContent += fullText.charAt(index);
        index++;
        setTimeout(typeWriter, Math.random() * 50 + 50); // Velocidad variable para realismo
      } else {
        // Añadir cursor parpadeante al final
        const cursor = document.createElement("span");
        cursor.innerHTML = "_";
        cursor.classList.add("animate-pulse", "font-bold", "text-green-600");
        terminalText.parentElement.appendChild(cursor);
      }
    }

    // Iniciar con un retraso corto
    setTimeout(typeWriter, 1200);
  }
});

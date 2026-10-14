(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Nav background on scroll + mobile sticky CTA (hidden while a quote form is on screen)
  const nav = $("#nav");
  const sticky = $("#stickyCta");
  const quote = $("#quote");
  let quoteVisible = false;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 20 || !$("#mobile-menu").hidden);
    sticky.classList.toggle("is-on", y > 600 && !quoteVisible);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  if (quote) new IntersectionObserver(([e]) => { quoteVisible = e.isIntersecting; onScroll(); }, { threshold: 0.1 }).observe(quote);
  onScroll();

  // Mobile menu
  const toggle = $(".nav__toggle");
  const menu = $("#mobile-menu");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
    onScroll();
  };
  toggle.addEventListener("click", () => setMenu(menu.hidden));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));

  // Reveal on scroll, staggered within each parent
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const siblings = $$(":scope > .reveal", e.target.parentElement);
      e.target.style.setProperty("--d", `${Math.min(siblings.indexOf(e.target), 6) * 0.07}s`);
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => io.observe(el));

  // Count-up stats
  const fmt = (n, d) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const counter = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || "0", 10);
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / 1600, 1);
        el.textContent = fmt(end * (1 - Math.pow(1 - p, 4)), dec);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counter.unobserve(el);
    });
  }, { threshold: 0.6 });
  if (!reduceMotion) $$("[data-count]").forEach((el) => counter.observe(el));

  // Card spotlight follows cursor
  $$(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  // Parallax image bands
  const bands = $$("[data-parallax]");
  if (bands.length && !reduceMotion) {
    const move = () => bands.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      img.style.transform = `translateY(${p * -8}%)`;
    });
    window.addEventListener("scroll", () => requestAnimationFrame(move), { passive: true });
    move();
  }

  // Sub-navigation highlights the section in view
  const subLinks = $$(".subnav a, .guide__toc a");
  if (subLinks.length) {
    const map = new Map(subLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        subLinks.forEach((a) => a.classList.remove("is-active"));
        const link = map.get(e.target.id);
        if (link) {
          link.classList.add("is-active");
          if (link.closest(".subnav")) link.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, id) => { const el = document.getElementById(id); if (el) spy.observe(el); });
  }

  // Lead-time estimator
  const est = $("#estimator");
  if (est) {
    // Typical business days for 1–10 parts, and how much each volume tier adds.
    const base = { cnc: [4, 6], sheet: [5, 7], mold: [18, 25], am: [2, 4] };
    const volume = { cnc: [0, 2, 6, 12], sheet: [0, 2, 5, 10], mold: [0, 2, 4, 7], am: [0, 2, 6, 14] };
    const update = () => {
      const v = (n) => $(`input[name=${n}]:checked`, est).value;
      const p = v("p");
      const extra = volume[p][Number(v("q")) - 1] + Number(v("f")) + Number(v("i"));
      const lo = base[p][0] + extra;
      const hi = base[p][1] + extra;
      $("#estDays").textContent = `${lo} to ${hi}`;
      $("#estFa").textContent = p === "mold" ? `T1 samples, day ${base.mold[0] - 3}` : `day ${Math.max(2, base[p][0] - 1 + Number(v("i")))}`;
      $("#estExp").textContent = `from ${Math.max(2, Math.round(lo * 0.6))} days`;
    };
    est.addEventListener("change", update);
    update();
  }

  // Portfolio filters
  const filters = $$(".filter");
  filters.forEach((btn) => btn.addEventListener("click", () => {
    const f = btn.dataset.filter;
    filters.forEach((b) => { b.classList.toggle("is-on", b === btn); b.setAttribute("aria-pressed", String(b === btn)); });
    $$(".gitem").forEach((it) => it.classList.toggle("is-hidden", f !== "all" && it.dataset.cat !== f));
  }));

  // Portfolio lightbox
  const lb = $("#lightbox");
  if (lb) {
    let lastFocus = null;
    const close = () => {
      lb.classList.remove("is-open");
      setTimeout(() => { lb.hidden = true; }, 350);
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };
    $$(".gitem").forEach((it) => it.addEventListener("click", () => {
      lastFocus = it;
      $("#lbImg").src = it.dataset.img;
      $("#lbImg").alt = it.dataset.title;
      $("#lbTitle").textContent = it.dataset.title;
      $("#lbMeta").textContent = it.dataset.meta;
      $("#lbInd").textContent = it.dataset.ind;
      $("#lbDesc").textContent = it.dataset.desc;
      lb.hidden = false;
      requestAnimationFrame(() => lb.classList.add("is-open"));
      document.body.style.overflow = "hidden";
      $(".lightbox__close", lb).focus();
    }));
    $(".lightbox__close", lb).addEventListener("click", close);
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lb.hidden) close(); });
  }

  // Multi-step quote form
  const form = $("#qform");
  if (form) {
    const steps = $$(".qstep", form);
    const bar = $("#qbar");
    const labels = $$(".qform__labels span", form);
    const err = $("#qerror");
    let current = 0;
    const go = (i) => {
      steps[current].classList.remove("is-active");
      current = i;
      steps[current].classList.add("is-active");
      bar.style.width = `${((i + 1) / steps.length) * 100}%`;
      labels.forEach((l, j) => l.classList.toggle("is-on", j <= i));
      const first = $("input:not([type=radio]):not([type=file]), select", steps[current]);
      if (first && window.innerWidth > 720) first.focus({ preventScroll: true });
    };
    $$("[data-next]", form).forEach((b) => b.addEventListener("click", () => go(current + 1)));
    $$("[data-prev]", form).forEach((b) => b.addEventListener("click", () => go(current - 1)));

    const drop = $("#drop");
    const fileInput = $("input[type=file]", drop);
    const fileList = $("#dropFiles");
    fileInput.addEventListener("change", () => {
      const names = [...fileInput.files].map((f) => f.name);
      fileList.textContent = names.length ? `✓ ${names.join(", ")}` : "";
    });
    ["dragenter", "dragover"].forEach((t) => drop.addEventListener(t, () => drop.classList.add("is-over")));
    ["dragleave", "drop"].forEach((t) => drop.addEventListener(t, () => drop.classList.remove("is-over")));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $$("[required]", steps[current]).forEach((f) => {
        const valid = f.value.trim() && (f.type !== "email" || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
        f.classList.toggle("is-invalid", !valid);
        if (!valid) ok = false;
      });
      if (!ok) {
        err.textContent = "Please fill in your name, company and a valid work email.";
        return;
      }
      err.textContent = "";
      // TODO: connect to your CRM / form backend (e.g. HubSpot, Formspree) here.
      steps.forEach((s) => s.classList.remove("is-active"));
      $(".qform__progress", form).hidden = true;
      $("#qref").textContent = `TV-${Math.floor(100000 + Math.random() * 900000)}`;
      $("#qsuccess").hidden = false;
    });
  }

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();

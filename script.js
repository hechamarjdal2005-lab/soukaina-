/* ============================================================================
   script.js — Site-wide interactions & animation
   ----------------------------------------------------------------------------
   • sticky nav (transparent → solid) + scroll progress hairline
   • mobile drawer menu
   • Intersection Observer reveals with stagger
   • word-by-word hero title entrance
   • product rendering (featured rail + shop grid), filters & search
   • add-to-cart micro-interactions (button morph, badge pulse, bag bounce)
   • animated star rating
   • parallax on hero arch
   • counters, toast, back-to-top, page transitions, form validation
   ========================================================================== */

/* ---------------- tiny toast (used by cart.js too) ---------------- */
const Toast = {
  t: null,
  show(msg, icon) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.querySelector("span").textContent = msg;
    if (icon !== undefined) el.querySelector("svg").style.display = icon ? "" : "none";
    el.classList.add("is-on");
    clearTimeout(this.t);
    this.t = setTimeout(() => el.classList.remove("is-on"), 2400);
  }
};

/* ---------------- helpers ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* fade placeholder images in when they load (and never break if they don't) */
function hydrateImages(scope) {
  $$(".ph > img", scope || document).forEach((img) => {
    if (img.dataset.done) return;
    img.dataset.done = "1";
    if (img.complete && img.naturalWidth) img.classList.add("is-loaded");
    else img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
  });
}

/* ============================================================================
   NAVBAR
   ========================================================================== */
function initNav() {
  const nav = $("#nav");
  const progress = $(".nav__progress");
  const burger = $("#burger");
  const links = $("#navLinks");
  const scrim = $("#menuScrim");

  const onScroll = () => {
    const y = window.scrollY;
    nav?.classList.toggle("is-stuck", y > 24);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    }
    $("#toTop")?.classList.toggle("is-on", y > 620);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (!burger || !links) return;

  const setMenu = (open) => {
    links.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    scrim?.classList.toggle("is-on", open);
    document.body.classList.toggle("is-locked", open);
  };
  burger.addEventListener("click", () => setMenu(!links.classList.contains("is-open")));
  scrim?.addEventListener("click", () => setMenu(false));
  $$("a", links).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && links.classList.contains("is-open")) setMenu(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 860) setMenu(false);
  });
}

/* ============================================================================
   REVEALS
   ========================================================================== */
function initReveals() {
  const els = $$("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    els.forEach((e) => e.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        io.unobserve(en.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  els.forEach((e) => io.observe(e));

  /* auto-stagger direct children of any [data-stagger] group */
  $$("[data-stagger]").forEach((group) => {
    [...group.children].forEach((child, i) => {
      if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", "up");
      child.style.setProperty("--d", i * 90 + "ms");
      io.observe(child);
    });
  });
}

/* ============================================================================
   HERO — word entrance + pointer/scroll parallax
   ========================================================================== */
function initHero() {
  /* split the H1 into word wrappers for the rise-in */
  $$(".h1").forEach((h) => {
    $$(".word", h).forEach((w, i) => {
      const inner = document.createElement("span");
      inner.innerHTML = w.innerHTML;
      w.innerHTML = "";
      w.appendChild(inner);
      inner.style.transition = `transform 1.05s var(--ease) ${0.22 + i * 0.11}s, opacity 1.05s var(--ease) ${0.22 + i * 0.11}s`;
      inner.style.transform = "translateY(115%)";
      inner.style.opacity = "0";
      requestAnimationFrame(() =>
        setTimeout(() => {
          inner.style.transform = "none";
          inner.style.opacity = "1";
        }, 60)
      );
    });
  });

  /* soft parallax drift on the hero arch */
  const stage = $(".hero__stage");
  const arch = $(".hero__stage .arch");
  if (!arch) return;

  let target = 0, current = 0, raf = null;
  const tick = () => {
    current += (target - current) * 0.08;
    arch.style.transform = `translate3d(0, ${current.toFixed(2)}px, 0)`;
    if (Math.abs(target - current) > 0.1) raf = requestAnimationFrame(tick);
    else raf = null;
  };
  const queue = () => { if (!raf) raf = requestAnimationFrame(tick); };

  if (window.matchMedia("(pointer: fine)").matches) {
    stage?.addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      arch.style.transform = `translate3d(${x * 14}px, ${y * 14}px, 0) rotate(${x * 1.2}deg)`;
    });
    return;
  }
  window.addEventListener(
    "scroll",
    () => { target = Math.min(window.scrollY * 0.1, 60); queue(); },
    { passive: true }
  );
}

/* ============================================================================
   PRODUCT CARD
   ========================================================================== */
function cardHTML(p) {
  const sizes = p.sizes || [];
  return `
  <article class="pcard" data-id="${p.id}" data-reveal="up">
    <div class="pcard__media">
      <div class="pcard__img ph" data-mono="${esc(p.name.split(" ")[0])}">
        <img src="${p.img}" alt="${esc(p.name)}" loading="lazy">
      </div>
      ${p.tag ? `<span class="pcard__tag ${p.tag === "New" ? "pcard__tag--new" : ""}">${esc(p.tag)}</span>` : ""}
      <button class="pcard__fav" data-fav aria-label="Save ${esc(p.name)}" aria-pressed="false">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.6-7-9.4A4 4 0 0 1 12 7.6 4 4 0 0 1 19 10.6C19 15.4 12 20 12 20z"/></svg>
      </button>
    </div>
    <div class="pcard__body">
      <span class="pcard__cat">${esc(categoryLabel(p.category))}</span>
      <h3 class="pcard__name">${esc(p.name)}</h3>
      <span class="pcard__price">${money(p.price)}${p.old ? `<s>${money(p.old)}</s>` : ""}</span>
      ${
        sizes.length
          ? `<div class="sizes sizes--auto" data-sizes>
               ${sizes.map((s, i) => `<button class="size ${i === 0 ? "is-on" : ""}" data-size="${s}" aria-pressed="${i === 0}">${s}</button>`).join("")}
             </div>`
          : ""
      }
      <button class="addbtn" data-add>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12l-1.2 12.2a1.5 1.5 0 0 1-1.5 1.3H8.7a1.5 1.5 0 0 1-1.5-1.3L6 7z"/><path d="M9 7V5.6A3 3 0 0 1 12 3a3 3 0 0 1 3 2.6V7"/></svg>
        <span>Add to cart</span>
      </button>
    </div>
  </article>`;
}

function initCards(scope) {
  const root = scope || document;

  /* recommended size selection */
  $$("[data-sizes]", root).forEach((group) => {
    if (group.dataset.bound) return;
    group.dataset.bound = "1";
    group.addEventListener("click", (e) => {
      const b = e.target.closest("[data-size]");
      if (!b) return;
      $$("[data-size]", group).forEach((x) => {
        x.classList.toggle("is-on", x === b);
        x.setAttribute("aria-pressed", String(x === b));
      });
    });
  });

  /* favourite toggle */
  $$("[data-fav]", root).forEach((b) => {
    if (b.dataset.bound) return;
    b.dataset.bound = "1";
    b.addEventListener("click", () => {
      const on = b.classList.toggle("is-on");
      b.setAttribute("aria-pressed", String(on));
      Toast.show(on ? "Saved to your wishlist" : "Removed from wishlist", false);
    });
  });

  /* add to cart */
  $$("[data-add]", root).forEach((b) => {
    if (b.dataset.bound) return;
    b.dataset.bound = "1";
    b.addEventListener("click", () => {
      const card = b.closest(".pcard");
      const id = card.dataset.id;
      const size = $("[data-size].is-on", card)?.dataset.size || "";
      Cart.add(id, size);

      /* micro-interaction: button morphs, badge pulses, bag bounces */
      const label = $("span", b);
      const prev = label.textContent;
      b.classList.add("is-added");
      label.textContent = "Added ✓";
      setTimeout(() => {
        b.classList.remove("is-added");
        label.textContent = prev;
      }, 1300);

      const badge = $("#cartBadge");
      const cartBtn = $("#cartBtn");
      badge?.classList.remove("pulse");
      cartBtn?.classList.remove("bounce");
      void badge?.offsetWidth;
      badge?.classList.add("pulse");
      cartBtn?.classList.add("bounce");
      setTimeout(() => cartBtn?.classList.remove("bounce"), 700);

      Toast.show(`${productById(id).name} added to cart`);
    });
  });

  hydrateImages(root);
}

/* ============================================================================
   HOMEPAGE — featured rail
   ========================================================================== */
function initFeatured() {
  const rail = $("#featuredRail");
  if (!rail) return;
  const list = PRODUCTS.filter((p) => p.featured).slice(0, 8);
  rail.innerHTML = list.map(cardHTML).join("");
  initCards(rail);
  initReveals();
}

/* ============================================================================
   SHOP PAGE — grid + filters + search
   ========================================================================== */
function initShop() {
  const grid = $("#shopGrid");
  if (!grid) return;

  let active = "all";
  let query = "";

  /* deep link support: shop.html?cat=dresses */
  const wanted = new URLSearchParams(location.search).get("cat");
  if (wanted && CATEGORIES.some((c) => c.key === wanted)) active = wanted;

  const filtersBox = $("#filters");
  if (filtersBox) {
    const all = [{ key: "all", label: "All pieces" }, ...CATEGORIES];
    filtersBox.innerHTML = all
      .map((c) => {
        const n = c.key === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === c.key).length;
        return `<button class="filter ${c.key === active ? "is-on" : ""}" data-cat="${c.key}">${esc(c.label)}<b>${n}</b></button>`;
      })
      .join("");
  }

  const render = () => {
    const q = query.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => {
      const okCat = active === "all" || p.category === active;
      const okQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        categoryLabel(p.category).toLowerCase().includes(q) ||
        (p.blurb || "").toLowerCase().includes(q);
      return okCat && okQ;
    });

    grid.innerHTML = list.map(cardHTML).join("");
    initCards(grid);
    initReveals();

    const res = $("#shopCount");
    if (res) res.textContent = `${list.length} piece${list.length !== 1 ? "s" : ""}`;
    $("#emptyState")?.classList.toggle("is-on", list.length === 0);
  };

  filtersBox?.addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    active = b.dataset.cat;
    $$("[data-cat]", filtersBox).forEach((x) => x.classList.toggle("is-on", x === b));
    render();
  });

  const input = $("#searchInput");
  const clear = $("#searchClear");
  input?.addEventListener("input", () => {
    query = input.value;
    clear?.classList.toggle("is-on", !!query);
    clearTimeout(input._t);
    input._t = setTimeout(render, 130);
  });
  clear?.addEventListener("click", () => {
    input.value = "";
    query = "";
    clear.classList.remove("is-on");
    input.focus();
    render();
  });

  render();
}

/* ============================================================================
   STARS — animated reveal
   ========================================================================== */
function initStars() {
  const groups = $$("[data-stars]");
  if (!groups.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const value = parseFloat(en.target.dataset.stars) || 5;
        $$("svg", en.target).forEach((star, i) => {
          const lit = i < Math.round(value) || (value % 1 && i === Math.floor(value) && value % 1 >= 0.5);
          if (lit) setTimeout(() => star.classList.add("lit"), 130 * i + 120);
        });
        io.unobserve(en.target);
      });
    },
    { threshold: 0.5 }
  );
  groups.forEach((g) => io.observe(g));
}

/* ============================================================================
   COUNTERS
   ========================================================================== */
function initCounters() {
  const els = $$("[data-count]");
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const node = en.target;
        const end = parseFloat(node.dataset.count);
        const dec = node.dataset.dec || "0";
        const t0 = performance.now();
        const dur = 1400;
        const step = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          node.textContent = (end * eased).toFixed(dec).replace(".0", "");
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.unobserve(node);
      });
    },
    { threshold: 0.6 }
  );
  els.forEach((e) => io.observe(e));
}

/* ============================================================================
   CONTACT FORM (front-end only — no backend)
   ========================================================================== */
function initForm() {
  const form = $("#contactForm");
  if (!form) return;

  const rules = {
    name: (v) => v.trim().length >= 2 || "Please tell us your name.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Please check your email address.",
    message: (v) => v.trim().length >= 10 || "A little more detail helps us help you."
  };

  const validate = (field) => {
    const fn = rules[field.name];
    if (!fn) return true;
    const res = fn(field.value);
    const wrap = field.closest(".field");
    const err = $(".field__err", wrap);
    const ok = res === true;
    wrap.classList.toggle("has-err", !ok);
    if (err) err.textContent = ok ? "" : res;
    return ok;
  };

  $$("input, textarea, select", form).forEach((f) => {
    f.addEventListener("blur", () => rules[f.name] && validate(f));
    f.addEventListener("input", () => f.closest(".field")?.classList.remove("has-err"));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = $$("input, textarea", form).filter((f) => rules[f.name]);
    const ok = fields.map(validate).every(Boolean);
    if (!ok) {
      $(".has-err input, .has-err textarea")?.focus();
      return;
    }
    const note = $("#formNote");
    note?.classList.add("is-on");
    form.reset();
    note?.scrollIntoView({ behavior: "smooth", block: "center" });

    /* hand the same message to WhatsApp so nothing is lost */
    const data = new FormData(form);
    const msg =
      `Bonjour Souka 🌸\n` +
      `Nom : ${data.get("name") || ""}\n` +
      `Email : ${data.get("email") || ""}\n` +
      (data.get("subject") ? `Sujet : ${data.get("subject")}\n` : "") +
      `\n${data.get("message") || ""}`;
    const wa = $("#formWhatsApp");
    if (wa) wa.href = `https://wa.me/${SITE.phone}?text=${encodeURIComponent(msg)}`;
  });
}

/* ============================================================================
   MISC — back to top, page transition, footer signup, hours highlight
   ========================================================================== */
function initMisc() {
  $("#toTop")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* soft cross-fade between internal pages */
  if (document.startViewTransition) {
    $$('a[href$=".html"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        if (a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey) return;
        const url = new URL(a.href, location.href);
        if (url.origin !== location.origin || a.href === location.href) return;
        e.preventDefault();
        document.startViewTransition(() => { location.href = a.href; });
      });
    });
  }

  /* newsletter / wishlist signup confirmation */
  $$("[data-signup]").forEach((f) => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      Toast.show("Merci ! We'll keep you posted ✦");
      f.reset();
    });
  });

  /* highlight today's opening hours */
  const day = new Date().getDay(); // 0 Sun … 6 Sat
  const idx = day === 0 ? 2 : day === 6 ? 1 : 0;
  $$(".hours li").forEach((li, i) => li.classList.toggle("is-today", i === idx));
}

/* ============================================================================
   BOOT
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initReveals();
  initHero();
  initFeatured();
  initShop();
  initCards(document);
  initStars();
  initCounters();
  initForm();
  initMisc();
  hydrateImages(document);
  Cart.init();
});

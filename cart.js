/* ============================================================================
   cart.js — Cart state (localStorage) + drawer UI + WhatsApp order hand-off
   ----------------------------------------------------------------------------
   Works identically on every page. Requires data.js to be loaded first.
   Line identity = product id + selected size, so the same dress in M and in L
   are stored as two separate lines.
   ========================================================================== */

const Cart = (() => {
  const KEY = "tendance_cart_v1";
  let items = load();
  let lastFocus = null;

  /* ---------------- storage ---------------- */
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(raw) ? raw.filter((l) => l && productById(l.id)) : [];
    } catch (e) {
      return [];
    }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
  }

  /* ---------------- state helpers ---------------- */
  const count = () => items.reduce((n, l) => n + l.qty, 0);
  const subtotal = () => items.reduce((n, l) => n + productById(l.id).price * l.qty, 0);

  function add(id, size, qty = 1) {
    const p = productById(id);
    if (!p) return;
    const chosen = size || p.sizes?.[0] || "";
    const line = items.find((l) => l.id === id && (l.size || "") === chosen);
    if (line) line.qty += qty;
    else items.push({ id, size: chosen, qty });
    save();
    render();
    return line;
  }

  function setQty(i, qty) {
    if (!items[i]) return;
    if (qty <= 0) return remove(i);
    items[i].qty = Math.min(qty, 99);
    save();
    render();
  }

  function setSize(i, size) {
    if (!items[i]) return;
    items[i].size = size;
    save();
    render();
  }

  function remove(i) {
    const el = document.querySelector(`.citem[data-i="${i}"]`);
    const done = () => { items.splice(i, 1); save(); render(); };
    if (el) {
      el.classList.add("is-out");
      setTimeout(done, 300);         // let the slide-out play first
    } else done();
  }

  function clear() { items = []; save(); render(); }

  /* ---------------- DOM refs (lazily resolved — markup lives on every page) */
  const el = (id) => document.getElementById(id);

  /* ---------------- rendering ---------------- */
  function render() {
    const list = el("cartItems");
    const badge = el("cartBadge");
    const btn = el("cartBtn");
    const n = count();

    /* badge */
    if (badge) {
      badge.textContent = n;
      badge.classList.toggle("is-on", n > 0);
    }
    if (btn) {
      btn.setAttribute("aria-label", n ? `Open cart, ${n} item${n > 1 ? "s" : ""}` : "Open cart, empty");
    }
    const label = el("cartCountLabel");
    if (label) label.textContent = n ? `${n} item${n > 1 ? "s" : ""}` : "empty";

    /* items list (empty state lives inside the same scroll area) */
    if (list) {
      if (!items.length) {
        list.innerHTML = `
          <div class="cart__empty">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1.1 11.2a1.6 1.6 0 0 1-1.6 1.4H8.7a1.6 1.6 0 0 1-1.6-1.4L6 8z"/><path d="M9.2 8V6.4A2.8 2.8 0 0 1 12 3.6a2.8 2.8 0 0 1 2.8 2.8V8"/></svg>
            <h3>Your cart is empty</h3>
            <p>Nothing chosen yet — let's find something that feels like you.</p>
            <a class="btn btn--sm" href="shop.html">Browse the collection</a>
          </div>`;
      } else {
      list.innerHTML = items
        .map((l, i) => {
          const p = productById(l.id);
          const sizeOpts = p.sizes || [];
          return `
          <article class="citem" data-i="${i}">
            <div class="citem__img ph" data-mono="${esc(p.name.split(" ")[0])}">
              <img src="${p.img}" alt="${esc(p.name)}" loading="lazy">
            </div>
            <div class="citem__body">
              <div class="citem__top">
                <div>
                  <h3 class="citem__name">${esc(p.name)}</h3>
                  <span class="citem__cat">${esc(categoryLabel(p.category))}</span>
                </div>
                <button class="citem__rm" data-act="rm" data-i="${i}" aria-label="Remove ${esc(p.name)}">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
                </button>
              </div>
              ${
                sizeOpts.length
                  ? `<select class="citem__sizesel" data-act="size" data-i="${i}" aria-label="Size for ${esc(p.name)}">
                       ${sizeOpts
                         .map((s) => `<option value="${s}" ${s === l.size ? "selected" : ""}>Size ${s}</option>`)
                         .join("")}
                     </select>`
                  : ""
              }
              <div class="citem__ctrl">
                <div class="qty">
                  <button data-act="dec" data-i="${i}" aria-label="Decrease quantity">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>
                  </button>
                  <output>${l.qty}</output>
                  <button data-act="inc" data-i="${i}" aria-label="Increase quantity">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
                  </button>
                </div>
                <span class="citem__price">${money(p.price * l.qty)}</span>
              </div>
            </div>
          </article>`;
        })
        .join("");
      }

      hydrateImages(list);
    }

    /* footer totals */
    const sub = subtotal();
    const ship = sub >= SITE.freeShippingFrom || sub === 0 ? 0 : 25;
    const set = (id, v) => { const n = el(id); if (n) n.textContent = v; };
    set("cartSubtotal", money(sub));
    set("cartShipping", ship === 0 ? "Offered" : money(ship));
    set("cartTotal", money(sub + ship));

    /* free-shipping progress nudge */
    const pct = Math.min(100, Math.round((sub / SITE.freeShippingFrom) * 100));
    const bar = el("shipBar");
    if (bar) bar.style.setProperty("--p", pct + "%");
    const msg = el("shipMsg");
    if (msg) {
      msg.innerHTML =
        sub === 0
          ? "Add a piece — free worldwide delivery over <b>800 DH</b>."
          : sub >= SITE.freeShippingFrom
          ? "You've unlocked <b>free worldwide delivery</b> ✦"
          : `Only <b>${money(SITE.freeShippingFrom - sub)}</b> away from free worldwide delivery.`;
    }

    /* hide the footer checkout when cart is empty */
    const foot = el("cartFoot");
    if (foot) foot.style.display = items.length ? "block" : "none";
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* fade <img> in once loaded; if it fails, the .ph gradient + monogram stays */
  function hydrateImages(scope) {
    (scope || document).querySelectorAll(".ph > img").forEach((img) => {
      if (img.dataset.done) return;
      img.dataset.done = "1";
      if (img.complete && img.naturalWidth) img.classList.add("is-loaded");
      else img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
    });
  }

  /* ---------------- open / close ---------------- */
  function open() {
    lastFocus = document.activeElement;
    el("cart")?.classList.add("is-open");
    el("cartScrim")?.classList.add("is-on");
    document.body.classList.add("is-locked");
    render();
    setTimeout(() => document.querySelector(".cart__close")?.focus(), 340);
  }
  function close() {
    el("cart")?.classList.remove("is-open");
    el("cartScrim")?.classList.remove("is-on");
    document.body.classList.remove("is-locked");
    lastFocus?.focus?.();
  }
  const isOpen = () => !!el("cart")?.classList.contains("is-open");

  /* ---------------- WhatsApp hand-off ----------------
     Builds a readable recap and hands it to wa.me. This is the whole
     checkout: no payment page, no forms, no lost orders.                */
  function waLink() {
    const lines = items.map((l) => {
      const p = productById(l.id);
      const size = l.size ? ` — size ${l.size}` : "";
      return `• ${p.name}${size} ×${l.qty} — ${money(p.price * l.qty)}`;
    });
    const sub = subtotal();
    const ship = sub >= SITE.freeShippingFrom ? 0 : 25;
    const msg =
      `Bonjour Souka 🌸\n` +
      `Je souhaite commander depuis le site :\n\n` +
      lines.join("\n") +
      `\n\nSous-total : ${money(sub)}\n` +
      `Livraison : ${ship === 0 ? "Offerte" : money(ship)}\n` +
      `Total : ${money(sub + ship)}\n\n` +
      `📍 ${SITE.address.line1}, ${SITE.address.city}\n` +
      `(Je préciserai mon pays de livraison et la couleur si besoin.)`;

    return `https://wa.me/${SITE.phone}?text=${encodeURIComponent(msg)}`;
  }

  /* ---------------- wiring ---------------- */
  function init() {
    const cart = el("cart");

    el("cartBtn")?.addEventListener("click", open);
    document.querySelectorAll("[data-open-cart]").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.preventDefault();
        open();
      })
    );
    el("cartScrim")?.addEventListener("click", close);
    document.querySelectorAll(".cart__close, [data-close-cart]").forEach((b) =>
      b.addEventListener("click", close)
    );

    /* delegated clicks inside the list (works after every re-render) */
    el("cartItems")?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      const i = +b.dataset.i;
      if (b.dataset.act === "inc") setQty(i, (items[i]?.qty || 0) + 1);
      if (b.dataset.act === "dec") setQty(i, (items[i]?.qty || 0) - 1);
      if (b.dataset.act === "rm") remove(i);
    });

    el("cartItems")?.addEventListener("change", (e) => {
      const s = e.target.closest("[data-act='size']");
      if (s) setSize(+s.dataset.i, s.value);
    });

    el("cartCheckout")?.addEventListener("click", () => {
      if (!items.length) return;
      window.open(waLink(), "_blank", "noopener");
    });

    el("cartClear")?.addEventListener("click", () => {
      if (!items.length) return;
      clear();
      Toast.show("Panier vidé");
    });

    /* Esc closes; keep focus inside while the sheet is open */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) close();
      if (e.key === "Tab" && isOpen()) {
        const f = [...cart.querySelectorAll('button, a[href], select, input')].filter((x) => x.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    /* swipe-down to dismiss the bottom sheet (mobile) */
    initSwipe();

    /* keep multiple tabs in sync */
    window.addEventListener("storage", (e) => {
      if (e.key === KEY) { items = load(); render(); }
    });

    render();
    hydrateImages(document);
  }

  /* bottom-sheet drag physics */
  function initSwipe() {
    const cart = el("cart");
    const handle = cart?.querySelector(".cart__handle");
    if (!handle || !window.matchMedia("(max-width: 859px)").matches) return;

    let startY = 0, dy = 0, dragging = false;
    const sheetH = () => cart.getBoundingClientRect().height || 1;

    const start = (e) => {
      dragging = true;
      startY = (e.touches ? e.touches[0].clientY : e.clientY);
      dy = 0;
      cart.style.transition = "none";
      cart.style.transform = `translateY(${dy}px)`;
    };
    const move = (e) => {
      if (!dragging) return;
      dy = Math.max(0, (e.touches ? e.touches[0].clientY : e.clientY) - startY);
      cart.style.transform = `translateY(${dy}px)`;
      if (dy > 4 && e.cancelable) e.preventDefault();
    };
    const end = () => {
      if (!dragging) return;
      dragging = false;
      cart.style.transition = "";
      cart.style.transform = "";
      if (dy > sheetH() * 0.22) close();
    };

    handle.addEventListener("touchstart", start, { passive: true });
    handle.addEventListener("touchmove", move, { passive: false });
    handle.addEventListener("touchend", end);
    handle.addEventListener("mousedown", start);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
  }

  return { init, add, open, close, render, count, subtotal, waLink };
})();

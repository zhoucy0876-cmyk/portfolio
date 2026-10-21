(function () {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const categories = Array.isArray(window.CATEGORIES) ? window.CATEGORIES.slice() : [];
  const works = Array.isArray(window.WORKS) ? window.WORKS.slice() : [];

  function pad(number) {
    return String(number).padStart(2, '0');
  }

  function getCategories() {
    if (categories.length) return categories;

    const seen = [...new Set(works.map((work) => work.category).filter(Boolean))];
    return seen.map((id) => ({ id, label: id, note: '' }));
  }

  const allCategories = getCategories();

  function findCategory(id) {
    return allCategories.find((category) => category.id === id) || null;
  }

  function countFor(id) {
    return works.filter((work) => work.category === id).length;
  }

  function sortWorks(list) {
    return list.slice().sort((a, b) => {
      return (Number(b.year) || 0) - (Number(a.year) || 0);
    });
  }

  function el(tag, className, text) {
    const node = doc.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function categoryLabel(id) {
    const category = findCategory(id);
    return category ? category.label : '未分类';
  }

  function renderHomeCatalog() {
    const container = doc.getElementById('home-catalog');
    if (!container) return;

    container.innerHTML = '';
    const activeCategories = allCategories.filter((category) => countFor(category.id) > 0);

    if (!activeCategories.length) {
      container.appendChild(el('p', 'empty-note', '作品正在整理中。'));
      return;
    }

    activeCategories.forEach((category, index) => {
      const row = el('a', 'category-row');
      row.href = 'works.html#' + category.id;
      row.appendChild(el('span', 'category-index', pad(index + 1)));

      const main = el('span', 'category-main');
      main.appendChild(el('span', 'category-label', category.label));
      if (category.note) main.appendChild(el('span', 'category-note', category.note));
      row.appendChild(main);

      row.appendChild(el('span', 'category-count', countFor(category.id) + ' 件作品'));
      row.appendChild(el('span', 'category-arrow', '→'));
      container.appendChild(row);
    });
  }

  function renderWorkTile(work, index) {
    const tile = el(work.link ? 'a' : 'div', 'work-tile');
    if (work.link) tile.href = work.link;
    tile.dataset.category = work.category || '';
    tile.dataset.reveal = '';
    tile.style.transitionDelay = Math.min(index * 60, 180) + 'ms';

    const media = el('div', 'work-tile-media');
    if (work.tile && work.tile.type === 'ranks' && Array.isArray(work.tile.items)) {
      media.classList.add('work-tile-media--ranks');
      const plate = el('div', 'tile-rank-plate');
      plate.setAttribute('role', 'img');
      plate.setAttribute('aria-label', work.title + '：' + work.tile.items.map((item) => item.label + item.value).join('，'));
      const head = el('div', 'tile-rank-head');
      head.appendChild(el('span', 'tile-rank-title', '2024 · 福建九市'));
      head.appendChild(el('span', 'tile-rank-meta', '排名'));
      plate.appendChild(head);
      work.tile.items.forEach((item) => {
        const row = el('div', 'tile-rank-row');
        row.appendChild(el('span', 'tile-rank-label', item.label));
        const track = el('span', 'tile-rank-track');
        const fill = el('span', 'tile-rank-fill');
        fill.style.setProperty('--w', String(item.width) + '%');
        track.appendChild(fill);
        row.appendChild(track);
        row.appendChild(el('span', 'tile-rank-value', item.value));
        plate.appendChild(row);
      });
      plate.appendChild(el('p', 'tile-rank-note', '同一座城市，换一把尺子，排名就会变。'));
      media.appendChild(plate);
    } else if (work.image) {
      const img = el('img');
      img.src = work.image;
      img.alt = work.imageAlt || work.title;
      img.loading = 'eager';
      if (work.slug === 'sleep-earlier') {
        img.style.viewTransitionName = 'poster-cover';
      }
      media.appendChild(img);
    } else {
      media.appendChild(el('div', 'work-tile-placeholder', categoryLabel(work.category)));
    }
    const action = el('span', 'work-tile-action', '查看 ↗');
    action.setAttribute('aria-hidden', 'true');
    media.appendChild(action);
    const cursor = el('span', 'work-tile-cursor', '查看 ↗');
    cursor.setAttribute('aria-hidden', 'true');
    media.appendChild(cursor);
    tile.appendChild(media);

    const content = el('div', 'work-tile-content');
    const meta = el('div', 'work-tile-meta');
    meta.appendChild(el('span', 'work-tile-index', pad(index + 1)));
    meta.appendChild(el('span', 'work-tile-category', categoryLabel(work.category)));
    meta.appendChild(el('span', 'work-tile-year', String(work.year)));
    content.appendChild(meta);

    const title = el('h3', 'work-tile-title', work.title);
    if (work.link) {
      title.style.viewTransitionName = 'work-title-' + (work.slug || String(index + 1));
    }
    content.appendChild(title);

    if (work.summary) {
      content.appendChild(el('p', 'work-tile-summary', work.summary));
    }

    if (Array.isArray(work.facts) && work.facts.length) {
      const facts = el('dl', 'work-tile-facts');
      work.facts.forEach((fact) => {
        const row = el('div');
        row.appendChild(el('dt', '', fact.value));
        row.appendChild(el('dd', '', fact.label));
        facts.appendChild(row);
      });
      content.appendChild(facts);
    }

    const tags = el('div', 'work-tile-tags');
    if (work.type) tags.appendChild(el('span', 'work-tile-type', work.type));
    if (Array.isArray(work.tags)) {
      work.tags.forEach((tag) => tags.appendChild(el('span', 'work-tile-tag', tag)));
    }
    if (tags.children.length) content.appendChild(tags);

    if (work.link) content.appendChild(el('span', 'work-tile-arrow', '↗'));
    tile.appendChild(content);
    return tile;
  }

  function renderHomeWorks() {
    const container = doc.getElementById('home-works');
    if (!container) return;

    container.innerHTML = '';
    const homeWorks = sortWorks(works).sort((a, b) => {
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });

    if (!homeWorks.length) {
      container.appendChild(el('p', 'empty-note', '作品正在整理中。'));
      return;
    }

    container.classList.toggle('is-single', homeWorks.length === 1);
    homeWorks.forEach((work, index) => {
      container.appendChild(renderWorkTile(work, index));
    });
    initWorkCardInteractions();
  }

  function initWorkCardInteractions() {
    if (reduceMotion) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    doc.querySelectorAll('.work-tile').forEach((tile) => {
      const media = tile.querySelector('.work-tile-media');
      const cursor = tile.querySelector('.work-tile-cursor');
      if (!media || !cursor) return;

      function moveCursor(event) {
        const rect = media.getBoundingClientRect();
        const x = Math.min(Math.max(event.clientX - rect.left, 34), Math.max(34, rect.width - 34));
        const y = Math.min(Math.max(event.clientY - rect.top, 24), Math.max(24, rect.height - 24));
        cursor.style.setProperty('--x', x + 'px');
        cursor.style.setProperty('--y', y + 'px');
      }

      media.addEventListener('pointerenter', () => tile.classList.add('is-pointer'));
      media.addEventListener('pointermove', moveCursor);
      media.addEventListener('pointerleave', () => tile.classList.remove('is-pointer'));
    });
  }

  function getFilter() {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    return hash && hash !== 'all' && findCategory(hash) ? hash : 'all';
  }

  function filterLabel(id) {
    return id === 'all' ? '全部' : categoryLabel(id);
  }

  function renderFilters(activeFilter) {
    const container = doc.getElementById('catalog-filter');
    if (!container) return;

    const activeElement = doc.activeElement;
    const focusedFilter = activeElement && activeElement.classList.contains('filter-button')
      ? activeElement.dataset.filter
      : '';

    container.innerHTML = '';
    const options = [{ id: 'all', label: '全部' }].concat(allCategories);

    options.forEach((option) => {
      const button = el('button', 'filter-button');
      button.type = 'button';
      button.dataset.filter = option.id;
      button.setAttribute('aria-pressed', String(activeFilter === option.id));
      button.appendChild(el('span', '', option.label));

      const count = option.id === 'all' ? works.length : countFor(option.id);
      button.appendChild(el('span', 'filter-count', String(count)));
      button.addEventListener('click', () => {
        const target = option.id === 'all' ? 'all' : option.id;
        if (window.location.hash.slice(1) === target) {
          renderCatalog();
        } else {
          window.location.hash = target;
        }
      });
      container.appendChild(button);
    });

    if (focusedFilter) {
      const match = [...container.children].find((button) => button.dataset.filter === focusedFilter);
      if (match) match.focus({ preventScroll: true });
    }
  }

  function emptyState(message) {
    const box = el('div', 'catalog-empty');
    box.appendChild(el('p', '', message));
    const link = el('a', 'text-link', '查看全部作品 →');
    link.href = '#all';
    box.appendChild(link);
    return box;
  }

  function renderCatalog() {
    const list = doc.getElementById('catalog-list');
    const status = doc.getElementById('catalog-status');
    const count = doc.getElementById('catalog-count');
    if (!list) return;

    list.classList.add('is-changing');

    const activeFilter = getFilter();
    const activeWorks = activeFilter === 'all'
      ? sortWorks(works)
      : sortWorks(works.filter((work) => work.category === activeFilter));

    if (count) count.textContent = works.length + ' 件作品';
    renderFilters(activeFilter);

    list.innerHTML = '';
    list.classList.toggle('is-single', activeWorks.length === 1);

    if (!activeWorks.length) {
      list.appendChild(emptyState(works.length ? '这一类还没有作品。' : '还没有作品。'));
    } else {
      activeWorks.forEach((work, index) => list.appendChild(renderWorkTile(work, index)));
    }

    if (status) {
      status.textContent = '显示' + filterLabel(activeFilter) + '，共 ' + activeWorks.length + ' 件作品';
    }

    if (activeFilter !== 'all') {
      const target = doc.getElementById('catalog-list');
      if (target) {
        window.setTimeout(() => {
          target.classList.add('is-visible');
          target.querySelectorAll('[data-reveal]').forEach((item) => item.classList.add('is-visible'));
          const styles = window.getComputedStyle(root);
          const navHeight = parseFloat(styles.getPropertyValue('--nav-h')) || 64;
          const filterHeight = parseFloat(styles.getPropertyValue('--filter-h')) || 58;
          const top = target.getBoundingClientRect().top + window.scrollY - navHeight - filterHeight - 16;
          const previousScrollBehavior = root.style.scrollBehavior;
          root.style.scrollBehavior = 'auto';
          window.scrollTo(0, Math.max(0, top));
          root.style.scrollBehavior = previousScrollBehavior;
        }, 80);
      }
    }

    initWorkCardInteractions();
    window.requestAnimationFrame(() => list.classList.remove('is-changing'));
  }

  function initCatalog() {
    renderCatalog();
    window.addEventListener('hashchange', () => {
      renderCatalog();
      initReveal();
    });
  }

  function initReveal() {
    const items = [...doc.querySelectorAll('[data-reveal]:not(.is-visible)')];
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        item.classList.add('is-visible');
      } else {
        observer.observe(item);
      }
    });
  }

  function initPage() {
    const page = doc.body.dataset.page;
    root.classList.add('js');

    if (page === 'home') {
      renderHomeWorks();
      renderHomeCatalog();
    }

    if (page === 'catalog') {
      initCatalog();
    }

    initReveal();
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', initPage);
  } else {
    initPage();
  }
})();

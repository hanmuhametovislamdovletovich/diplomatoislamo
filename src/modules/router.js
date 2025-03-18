import { loadPage } from './pages.js';

export function initRouter() {
  // Handle navigation clicks
  document.querySelector('.nav-links').addEventListener('click', (e) => {
    if (e.target.matches('[data-page]')) {
      e.preventDefault();
      const page = e.target.dataset.page;
      loadPage(page);
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    if (e.state?.page) {
      loadPage(e.state.page, false);
    }
  });
}
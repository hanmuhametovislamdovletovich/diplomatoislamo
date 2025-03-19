import { supabase } from './lib/supabase.js';
import { initAuth } from './modules/auth.js';
import { initRouter } from './modules/router.js';
import { loadPage } from './modules/pages.js';

// Initialize the application
async function initApp() {
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  // Initialize authentication
  initAuth();
  
  // Initialize router
  initRouter();

  // Show appropriate section based on auth state
  const authSection = document.getElementById('auth-section');
  const mainSection = document.getElementById('main-section');

  if (session) {
    authSection.classList.add('hidden');
    mainSection.classList.remove('hidden');
    loadPage('home');
  } else {
    authSection.classList.remove('hidden');
    mainSection.classList.add('hidden');
  }

  // Listen for auth state changes
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      authSection.classList.add('hidden');
      mainSection.classList.remove('hidden');
      loadPage('home');
    } else {
      authSection.classList.remove('hidden');
      mainSection.classList.add('hidden');
    }
  });
}

// Start the application
initApp();
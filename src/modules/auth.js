import { supabase } from '../lib/supabase.js';

export function initAuth() {
  const authForm = document.getElementById('auth-form');
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  // Handle login
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Clear form
      emailInput.value = '';
      passwordInput.value = '';
    } catch (error) {
      alert(error.message);
    }
  });

  // Handle signup
  signupBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      // Create user profile after successful signup
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('users_profile')
          .insert({
            id: data.user.id,
            username: email.split('@')[0], // Use part of email as username
            created_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }

      // Clear form
      emailInput.value = '';
      passwordInput.value = '';

      alert('Registration successful! You can now log in.');
    } catch (error) {
      alert(error.message);
    }
  });

  // Handle logout
  logoutBtn.addEventListener('click', async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  });

  // Check initial auth state
  supabase.auth.onAuthStateChange((event, session) => {
    const authSection = document.getElementById('auth-section');
    const mainSection = document.getElementById('main-section');

    if (session) {
      authSection.classList.add('hidden');
      mainSection.classList.remove('hidden');
    } else {
      authSection.classList.remove('hidden');
      mainSection.classList.add('hidden');
    }
  });
}
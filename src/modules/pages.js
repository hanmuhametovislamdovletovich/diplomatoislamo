import { supabase } from './lib/supabase.js';

const pages = {
  home: async () => {
    try {
      const { data: profile, error } = await supabase
        .from('users_profile')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const username = profile?.username || 'Guitarist';

      return `
        <div class="card">
          <h1 class="card-title">Welcome ${username}!</h1>
          <p>Start your guitar journey today with our structured lessons and exercises.</p>
        </div>
        <div class="grid">
          <div class="card">
            <h2>Continue Learning</h2>
            <p>Pick up where you left off</p>
            <div class="progress-bar">
              <div class="progress-bar-fill" style="width: ${profile?.progress || 0}%"></div>
            </div>
          </div>
          <div class="card">
            <h2>Recommended Lessons</h2>
            <ul id="recommended-lessons">Loading...</ul>
          </div>
        </div>
      `;
    } catch (error) {
      console.error('Error loading home page:', error);
      return `
        <div class="card">
          <h1 class="card-title">Welcome!</h1>
          <p>There was an error loading your profile. Please try refreshing the page.</p>
        </div>
      `;
    }
  },

  lessons: async () => {
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*')
      .order('order_index');

    if (error) {
      console.error('Error loading lessons:', error);
      return '<div class="card"><p>Error loading lessons. Please try again.</p></div>';
    }

    return `
      <h1>Guitar Lessons</h1>
      <div class="grid">
        ${lessons?.map(lesson => `
          <div class="card">
            <h2 class="card-title">${lesson.title}</h2>
            <p>${lesson.description}</p>
            <button onclick="startLesson('${lesson.id}')">Start Lesson</button>
          </div>
        `).join('') || 'No lessons available.'}
      </div>
    `;
  },

  exercises: async () => {
    const { data: exercises, error } = await supabase
      .from('exercises')
      .select('*');

    if (error) {
      console.error('Error loading exercises:', error);
      return '<div class="card"><p>Error loading exercises. Please try again.</p></div>';
    }

    return `
      <h1>Practice Exercises</h1>
      <div class="grid">
        ${exercises?.map(exercise => `
          <div class="card">
            <h2 class="card-title">${exercise.title}</h2>
            <p>${exercise.description}</p>
            <button onclick="startExercise('${exercise.id}')">Start Exercise</button>
          </div>
        `).join('') || 'No exercises available.'}
      </div>
    `;
  },

  progress: async () => {
    const { data: progress, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        lessons (title)
      `);

    if (error) {
      console.error('Error loading progress:', error);
      return '<div class="card"><p>Error loading progress. Please try again.</p></div>';
    }

    return `
      <h1>Your Progress</h1>
      <div class="card">
        <h2>Progress Overview</h2>
        <div class="progress-chart">
          ${progress?.map(p => `
            <div class="progress-item">
              <span>${p.lessons?.title || 'Unknown Lesson'}</span>
              <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${p.score || 0}%"></div>
              </div>
            </div>
          `).join('') || 'No progress data available'}
        </div>
      </div>
    `;
  },

  resources: async () => {
    const { data: resources, error } = await supabase
      .from('resources')
      .select('*');

    if (error) {
      console.error('Error loading resources:', error);
      return '<div class="card"><p>Error loading resources. Please try again.</p></div>';
    }

    return `
      <h1>Learning Resources</h1>
      <div class="grid">
        ${resources?.map(resource => `
          <div class="card">
            <h2 class="card-title">${resource.title}</h2>
            <p>${resource.description}</p>
            <a href="${resource.url}" target="_blank" rel="noopener noreferrer">
              <button>View Resource</button>
            </a>
          </div>
        `).join('') || 'No resources available.'}
      </div>
    `;
  },

  faq: () => `
    <h1>Frequently Asked Questions</h1>
    <div class="card">
      <h2 class="card-title">Common Questions</h2>
      <div class="faq-list">
        <div class="faq-item">
          <h3>How do I get started?</h3>
          <p>Start with the beginner lessons in our structured curriculum.</p>
        </div>
        <div class="faq-item">
          <h3>How often should I practice?</h3>
          <p>We recommend practicing at least 30 minutes daily for optimal progress.</p>
        </div>
        <div class="faq-item">
          <h3>What equipment do I need?</h3>
          <p>To begin, you'll need an acoustic or electric guitar and a tuner.</p>
        </div>
      </div>
    </div>
  `
};

export async function loadPage(pageName, updateHistory = true) {
  const mainContent = document.getElementById('main-content');
  
  try {
    const pageContent = await pages[pageName]();
    mainContent.innerHTML = pageContent;

    if (updateHistory) {
      history.pushState({ page: pageName }, '', `#${pageName}`);
    }
  } catch (error) {
    console.error('Error loading page:', error);
    mainContent.innerHTML = '<div class="card"><p>Error loading content. Please try again.</p></div>';
  }
}
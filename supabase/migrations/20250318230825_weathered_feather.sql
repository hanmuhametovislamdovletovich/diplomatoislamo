/*
  # Initial Schema for Guitar Learning Platform

  1. New Tables
    - users_profile
      - id (references auth.users)
      - username
      - skill_level
      - created_at
    - lessons
      - id
      - title
      - description
      - content
      - difficulty_level
      - category
      - order_index
    - user_progress
      - id
      - user_id
      - lesson_id
      - completed
      - score
      - notes
      - completed_at
    - exercises
      - id
      - title
      - description
      - type (chord, rhythm, theory)
      - difficulty_level
      - content
    - user_exercise_results
      - id
      - user_id
      - exercise_id
      - score
      - feedback
      - completed_at
    - resources
      - id
      - title
      - description
      - type (sheet_music, video, article)
      - url
      - category

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users Profile Table
CREATE TABLE users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  skill_level TEXT NOT NULL DEFAULT 'beginner',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON users_profile
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users_profile
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Lessons Table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  difficulty_level TEXT NOT NULL,
  category TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (true);

-- User Progress Table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users_profile(id),
  lesson_id UUID REFERENCES lessons(id),
  completed BOOLEAN DEFAULT false,
  score INTEGER,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own progress"
  ON user_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Exercises Table
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  difficulty_level TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view exercises"
  ON exercises
  FOR SELECT
  TO authenticated
  USING (true);

-- User Exercise Results Table
CREATE TABLE user_exercise_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users_profile(id),
  exercise_id UUID REFERENCES exercises(id),
  score INTEGER,
  feedback TEXT,
  completed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_exercise_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own exercise results"
  ON user_exercise_results
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Resources Table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view resources"
  ON resources
  FOR SELECT
  TO authenticated
  USING (true);
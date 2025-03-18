/*
  # Add INSERT policy for users_profile table

  1. Changes
    - Add INSERT policy to allow authenticated users to create their own profile
    - Add UPDATE policy to allow users to update their own profile
*/

CREATE POLICY "Users can create own profile"
  ON users_profile
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
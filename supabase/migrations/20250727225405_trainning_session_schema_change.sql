-- Rename the existing table for backup (optional but recommended)
ALTER TABLE training_sessions RENAME TO training_sessions_old;

-- Create the new table with the updated schema
CREATE TABLE training_sessions (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    duration INTEGER,
    subscription_type_id INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subscription_type_id) REFERENCES subscription_types(id) ON DELETE RESTRICT
);

-- Drop the foreign key constraint from training_results
ALTER TABLE training_results
DROP CONSTRAINT training_results_training_session_id_fkey;

-- Recreate it to point to the new training_sessions table
ALTER TABLE training_results
ADD CONSTRAINT training_results_training_session_id_fkey
FOREIGN KEY (training_session_id) REFERENCES training_sessions(id) ON DELETE CASCADE;


-- 1. Create difficulty ENUM type (safe to skip if already exists)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'diff') THEN
    CREATE TYPE diff AS ENUM ('easy', 'medium', 'hard');
  END IF;
END $$;

-- 2. Create the exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    experience_reward FLOAT NOT NULL DEFAULT 0.0,
    difficulty diff NOT NULL,
    duration INTEGER,
    CONSTRAINT positive_xp CHECK (experience_reward >= 0.0)
);

-- 3. Create the join table linking training_sessions and exercises
CREATE TABLE IF NOT EXISTS training_sessions_and_exercises (
    training_session_id INTEGER NOT NULL,
    exercises_id INTEGER NOT NULL,
    FOREIGN KEY (training_session_id) REFERENCES training_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (exercises_id) REFERENCES exercises(id) ON DELETE CASCADE,
    UNIQUE(training_session_id, exercises_id)
);



-- SEEDING PART

-- Copy data from training_sessions_old to new one, mapping `duration_minutes` to `duration`
INSERT INTO training_sessions (id, title, description, duration, subscription_type_id, created_at)
SELECT id, title, description, duration_minutes, subscription_type_id, created_at
FROM training_sessions_old;

-- Drop the old table once you're sure everything is migrated correctly
DROP TABLE training_sessions_old;

-- Exercises (Individual drills or tutorials)
INSERT INTO exercises (title, description, experience_reward, difficulty, duration) VALUES
-- Basic
('Ball Control Basics', 'Learn fundamental ball control techniques with stationary ball exercises', 25.0, 'easy', 15),
('First Touch Training', 'Improve your first touch with various receiving exercises', 30.0, 'easy', 20),
('Passing Accuracy', 'Practice short and medium range passing with precision', 35.0, 'easy', 25),
('Shooting Fundamentals', 'Master basic shooting technique and accuracy', 40.0, 'easy', 30),

-- Intermediate
('Dribbling Moves', 'Learn essential dribbling moves to beat defenders', 45.0, 'medium', 25),
('Crossing and Finishing', 'Practice crossing from wide positions and finishing in the box', 50.0, 'medium', 35),
('Defensive Positioning', 'Learn proper defensive stance and positioning', 40.0, 'medium', 30),
('Goalkeeper Basics', 'Fundamental goalkeeper training - catching, diving, distribution', 55.0, 'medium', 40),

-- Advanced
('Advanced Ball Mastery', 'Complex ball control exercises for advanced players', 60.0, 'hard', 45),
('Tactical Awareness', 'Understanding field positioning and game reading', 65.0, 'hard', 50),
('Set Piece Specialist', 'Master free kicks, corners, and penalty techniques', 70.0, 'hard', 40),
('Speed and Agility', 'High-intensity training for pace and quick direction changes', 55.0, 'hard', 35),

-- Team Tactics
('Formation Play', 'Learn different formations and their applications', 75.0, 'hard', 60),
('Counter Attack', 'Master the art of quick counter-attacking football', 70.0, 'hard', 50),
('Possession Football', 'Practice maintaining possession and patient build-up play', 80.0, 'hard', 55),
('Pressing and High Line', 'Advanced defensive tactics - coordinated pressing', 85.0, 'hard', 65);

-- Relationship between sessions and exercises
-- Basic Module
INSERT INTO training_sessions_and_exercises (training_session_id, exercises_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),

-- Intermediate Module
(2, 5), (2, 6), (2, 7), (2, 8),

-- Advanced Training
(3, 9), (3, 10), (3, 11), (3, 12),

-- Tactical Module
(4, 13), (4, 14), (4, 15), (4, 16);

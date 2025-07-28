-- Clean up and fix all training session to exercise relationships
-- This migration ensures every training session has appropriate exercises

-- First, clear all existing relationships to start fresh
DELETE FROM training_sessions_and_exercises;

-- Map training sessions to exercises based on content and logical groupings
INSERT INTO training_sessions_and_exercises (training_session_id, exercises_id) VALUES

-- === BASIC FREE TRAINING SESSIONS (1-16) ===
-- Direct 1:1 mappings where training session matches exercise exactly

-- 1. Ball Control Basics → Ball Control Basics
(1, 1),

-- 2. First Touch Training → First Touch Training  
(2, 2),

-- 3. Passing Accuracy → Passing Accuracy
(3, 3),

-- 4. Shooting Fundamentals → Shooting Fundamentals
(4, 4),

-- 5. Dribbling Moves → Dribbling Moves
(5, 5),

-- 6. Crossing and Finishing → Crossing and Finishing
(6, 6),

-- 7. Defensive Positioning → Defensive Positioning
(7, 7),

-- 8. Goalkeeper Basics → Goalkeeper Basics
(8, 8),

-- 9. Advanced Ball Mastery → Advanced Ball Mastery
(9, 9),

-- 10. Tactical Awareness → Tactical Awareness
(10, 10),

-- 11. Set Piece Specialist → Set Piece Specialist
(11, 11),

-- 12. Speed and Agility → Speed and Agility
(12, 12),

-- 13. Formation Play → Formation Play
(13, 13),

-- 14. Counter Attack → Counter Attack
(14, 14),

-- 15. Possession Football → Possession Football
(15, 15),

-- 16. Pressing and High Line → Pressing and High Line
(16, 16),

-- === PREMIUM TRAINING SESSIONS (17-26) ===
-- Multi-exercise combinations for comprehensive premium sessions

-- 17. Elite Dribbling Masterclass → Advanced dribbling + ball mastery
(17, 5), (17, 9),

-- 18. Precision Long Passing → Passing + possession
(18, 3), (18, 15),

-- 19. Finishing Under Pressure → Shooting + crossing
(19, 4), (19, 6),

-- 20. Advanced Formations and Rotations → Formation + tactical awareness
(20, 13), (20, 10),

-- 21. Analyzing Opponent Weaknesses → Tactical + counter attack
(21, 10), (21, 14),

-- 22. Transition Play Mastery → Counter attack + possession
(22, 14), (22, 15),

-- 23. Explosive Power & Conditioning → Speed/agility + advanced training
(23, 12), (23, 9),

-- 24. Mental Toughness & Focus → Advanced ball mastery + tactical awareness  
(24, 9), (24, 10),

-- 25. Goalkeeper Advanced Tactics → Goalkeeper + defensive positioning
(25, 8), (25, 7),

-- 26. Set Piece Routines and Deception → Set pieces + formation play
(26, 11), (26, 13);

-- Verify the results
-- This should show 26 training sessions with at least one exercise each
-- SELECT 
--   ts.id, 
--   ts.title, 
--   COUNT(tse.exercises_id) as exercise_count
-- FROM training_sessions ts
-- LEFT JOIN training_sessions_and_exercises tse ON ts.id = tse.training_session_id
-- GROUP BY ts.id, ts.title
-- ORDER BY ts.id; 
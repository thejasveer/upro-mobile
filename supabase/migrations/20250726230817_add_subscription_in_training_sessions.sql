ALTER TABLE training_sessions
ADD COLUMN subscription_type_id INTEGER NOT NULL DEFAULT 1;

ALTER TABLE training_sessions
ADD FOREIGN KEY (subscription_type_id)
REFERENCES subscription_types(id) ON DELETE RESTRICT;


UPDATE training_sessions
SET subscription_type_id = 1
WHERE subscription_type_id IS NULL;

-- Premium Training Sessions
INSERT INTO training_sessions (title, description, experience_reward, duration_minutes, subscription_type_id, created_at) VALUES
-- Elite Skills (3-4 months ago - premium content launch)
('Elite Dribbling Masterclass', 'Advanced footwork and 1v1 dribbling mastery for elite players', 100.0, 60, 2, NOW() - INTERVAL '4 months' + INTERVAL '1 week'),
('Precision Long Passing', 'Master the art of accurate long passes and switch play', 90.0, 50, 2, NOW() - INTERVAL '3 months' + INTERVAL '3 weeks'),
('Finishing Under Pressure', 'Simulated game conditions for goal scoring in tight spaces', 95.0, 55, 2, NOW() - INTERVAL '3 months' + INTERVAL '2 weeks'),

-- Tactical Deep Dive (2-3 months ago - advanced premium)
('Advanced Formations and Rotations', 'In-depth understanding of tactical shape and movement', 110.0, 70, 2, NOW() - INTERVAL '2 months' + INTERVAL '3 weeks'),
('Analyzing Opponent Weaknesses', 'How to spot and exploit opposition weaknesses mid-game', 105.0, 65, 2, NOW() - INTERVAL '2 months' + INTERVAL '1 week'),
('Transition Play Mastery', 'Offensive and defensive transitions at pro level', 115.0, 75, 2, NOW() - INTERVAL '2 months'),

-- Physical & Mental Edge (1-2 months ago - latest premium features)
('Explosive Power & Conditioning', 'Training focused on explosive speed, power, and endurance', 120.0, 80, 2, NOW() - INTERVAL '6 weeks'),
('Mental Toughness & Focus', 'Develop elite-level concentration and resilience under pressure', 100.0, 60, 2, NOW() - INTERVAL '5 weeks'),

-- Specialist Modules (Recent - last month)
('Goalkeeper Advanced Tactics', 'Pro techniques for anticipation, positioning, and saving 1v1s', 110.0, 70, 2, NOW() - INTERVAL '4 weeks'),
('Set Piece Routines and Deception', 'Elite-level strategies for creating goal-scoring set pieces', 115.0, 60, 2, NOW() - INTERVAL '1 week');
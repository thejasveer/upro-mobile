-- Seed data for UPro Soccer Platform
-- This file contains sample data for development and testing

-- Store Items (Avatars, Profile Banners, Equipment, etc.)
INSERT INTO store_items (name, description, upro_gold_cost, is_active, created_at) VALUES
-- Avatars (Launch items - 6 months ago)
('Classic Player Avatar', 'Traditional soccer player avatar with basic uniform', 50.0, true, NOW() - INTERVAL '6 months'),
('Elite Striker Avatar', 'Premium striker avatar with golden boots', 150.0, true, NOW() - INTERVAL '5 months' + INTERVAL '3 weeks'),
('Goalkeeper Pro Avatar', 'Professional goalkeeper avatar with gloves and gear', 120.0, true, NOW() - INTERVAL '5 months' + INTERVAL '2 weeks'),
('Retro Legend Avatar', 'Vintage soccer legend style avatar', 200.0, true, NOW() - INTERVAL '4 months' + INTERVAL '3 weeks'),
('Future Star Avatar', 'Futuristic soccer player avatar', 180.0, true, NOW() - INTERVAL '3 months' + INTERVAL '1 week'),

-- Profile Banners (4-5 months ago - customization expansion)
('Champions League Banner', 'Prestigious Champions League themed banner', 75.0, true, NOW() - INTERVAL '5 months'),
('World Cup Glory Banner', 'World Cup championship celebration banner', 100.0, true, NOW() - INTERVAL '4 months' + INTERVAL '2 weeks'),
('Local Hero Banner', 'Community soccer hero themed banner', 30.0, true, NOW() - INTERVAL '4 months'),
('Rising Star Banner', 'Banner for up-and-coming players', 45.0, true, NOW() - INTERVAL '3 months' + INTERVAL '3 weeks'),
('Team Captain Banner', 'Leadership themed banner', 80.0, true, NOW() - INTERVAL '3 months' + INTERVAL '1 week'),

-- Training Equipment (2-3 months ago - physical items launch)
('Pro Soccer Ball', 'Professional quality soccer ball for training', 25.0, true, NOW() - INTERVAL '3 months'),
('Speed Cones Set', 'Set of 10 training cones for agility drills', 15.0, true, NOW() - INTERVAL '2 months' + INTERVAL '3 weeks'),
('Goalkeeper Gloves', 'High-quality goalkeeper gloves', 35.0, true, NOW() - INTERVAL '2 months' + INTERVAL '2 weeks'),
('Training Jersey', 'Moisture-wicking training jersey', 40.0, true, NOW() - INTERVAL '2 months'),
('Shin Guards', 'Protective shin guards for safe play', 20.0, true, NOW() - INTERVAL '6 weeks'),

-- Power-ups and Boosts (Recent - 1-2 months ago)
('XP Boost (2x)', 'Double experience points for 1 hour', 60.0, true, NOW() - INTERVAL '6 weeks'),
('Training Boost', 'Enhanced training session rewards', 45.0, true, NOW() - INTERVAL '1 month'),
('Gold Rush', 'Extra U-Pro Gold from completed activities', 75.0, true, NOW() - INTERVAL '3 weeks'),
('Skill Accelerator', 'Faster skill progression for training', 90.0, true, NOW() - INTERVAL '1 week');

-- Badges for achievement system
INSERT INTO badges (xp_amount, name, description) VALUES
(0, 'First Steps', 'Welcome to UPro! Complete your first training session'),
(100, 'Getting Started', 'Earn your first 100 XP'),
(500, 'Training Enthusiast', 'Complete 10 training sessions'),
(1000, 'Dedicated Player', 'Reach 1,000 total XP'),
(2500, 'Rising Star', 'Achieve 2,500 XP and show real commitment'),
(5000, 'Elite Trainee', 'Reach 5,000 XP - you are becoming elite'),
(10000, 'Pro Level', 'Hit 10,000 XP - professional level achieved'),
(25000, 'Legend', 'Accumulate 25,000 XP - legendary status'),
(50000, 'Master', 'Reach 50,000 XP - true mastery of the game'),
(100000, 'Champion', 'Ultimate achievement: 100,000 XP');

-- Training Sessions (Soccer drills, skill tutorials, game tactics)
INSERT INTO training_sessions (title, description, experience_reward, duration_minutes, created_at) VALUES
-- Basic Skills (Platform launch - 6 months ago)
('Ball Control Basics', 'Learn fundamental ball control techniques with stationary ball exercises', 25.0, 15, NOW() - INTERVAL '6 months'),
('First Touch Training', 'Improve your first touch with various receiving exercises', 30.0, 20, NOW() - INTERVAL '6 months' + INTERVAL '1 week'),
('Passing Accuracy', 'Practice short and medium range passing with precision', 35.0, 25, NOW() - INTERVAL '6 months' + INTERVAL '2 weeks'),
('Shooting Fundamentals', 'Master basic shooting technique and accuracy', 40.0, 30, NOW() - INTERVAL '5 months' + INTERVAL '2 weeks'),

-- Intermediate Skills (4-5 months ago - expanding content)
('Dribbling Moves', 'Learn essential dribbling moves to beat defenders', 45.0, 25, NOW() - INTERVAL '5 months'),
('Crossing and Finishing', 'Practice crossing from wide positions and finishing in the box', 50.0, 35, NOW() - INTERVAL '4 months' + INTERVAL '3 weeks'),
('Defensive Positioning', 'Learn proper defensive stance and positioning', 40.0, 30, NOW() - INTERVAL '4 months' + INTERVAL '2 weeks'),
('Goalkeeper Basics', 'Fundamental goalkeeper training - catching, diving, distribution', 55.0, 40, NOW() - INTERVAL '4 months'),

-- Advanced Skills (2-3 months ago - advanced content rollout)
('Advanced Ball Mastery', 'Complex ball control exercises for advanced players', 60.0, 45, NOW() - INTERVAL '3 months'),
('Tactical Awareness', 'Understanding field positioning and game reading', 65.0, 50, NOW() - INTERVAL '2 months' + INTERVAL '3 weeks'),
('Set Piece Specialist', 'Master free kicks, corners, and penalty techniques', 70.0, 40, NOW() - INTERVAL '2 months' + INTERVAL '2 weeks'),
('Speed and Agility', 'High-intensity training for pace and quick direction changes', 55.0, 35, NOW() - INTERVAL '2 months'),

-- Team Tactics (Recent - 1-2 months ago)
('Formation Play', 'Learn different formations and their applications', 75.0, 60, NOW() - INTERVAL '6 weeks'),
('Counter Attack', 'Master the art of quick counter-attacking football', 70.0, 50, NOW() - INTERVAL '1 month'),
('Possession Football', 'Practice maintaining possession and patient build-up play', 80.0, 55, NOW() - INTERVAL '3 weeks'),
('Pressing and High Line', 'Advanced defensive tactics - coordinated pressing', 85.0, 65, NOW() - INTERVAL '2 weeks');

-- Sample Clubs
INSERT INTO clubs (name, description, created_at) VALUES
('Barcelona Academy', 'Elite youth development program focused on technical skills and tactical understanding', NOW() - INTERVAL '6 months'),
('Manchester United Youth', 'Prestigious academy known for developing well-rounded players', NOW() - INTERVAL '5 months' + INTERVAL '2 weeks'),
('Local Soccer Club', 'Community-based club welcoming players of all skill levels', NOW() - INTERVAL '5 months'),
('Street Football Collective', 'Urban soccer community emphasizing creativity and flair', NOW() - INTERVAL '4 months' + INTERVAL '1 week'),
('Elite Performance Center', 'High-performance training facility for serious athletes', NOW() - INTERVAL '3 months' + INTERVAL '2 weeks'),
('Grassroots United', 'Inclusive club promoting soccer for everyone in the community', NOW() - INTERVAL '3 months'),
('Pro Development Academy', 'Professional pathway program for aspiring elite players', NOW() - INTERVAL '2 months' + INTERVAL '1 week'),
('Technical Skills Institute', 'Specialized training focused on ball mastery and technique', NOW() - INTERVAL '1 month' + INTERVAL '2 weeks');

-- Note: User data will be created when users sign up through the application
-- The accounts table will be populated automatically via the trigger when auth.users are created
-- Users, training results, friendships, etc. will be generated through app usage 
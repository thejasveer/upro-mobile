-- Run this in supabase AFTER you have executed the supabase_schema, this data will be used to test/implement features

-- Seed data for soccer training app database

-- Store Items (Avatars, Profile Banners, Equipment, etc.)
INSERT INTO store_items (name, description, upro_gold_cost, is_active) VALUES
-- Avatars
('Classic Player Avatar', 'Traditional soccer player avatar with basic uniform', 50.0, true),
('Elite Striker Avatar', 'Premium striker avatar with golden boots', 150.0, true),
('Goalkeeper Pro Avatar', 'Professional goalkeeper avatar with gloves and gear', 120.0, true),
('Retro Legend Avatar', 'Vintage soccer legend style avatar', 200.0, true),
('Future Star Avatar', 'Futuristic soccer player avatar', 180.0, true),

-- Profile Banners
('Champions League Banner', 'Prestigious Champions League themed banner', 75.0, true),
('World Cup Glory Banner', 'World Cup championship celebration banner', 100.0, true),
('Local Hero Banner', 'Community soccer hero themed banner', 30.0, true),
('Rising Star Banner', 'Banner for up-and-coming players', 45.0, true),
('Team Captain Banner', 'Leadership themed banner', 80.0, true),

-- Training Equipment
('Professional Ball', 'High-quality training soccer ball', 25.0, true),
('Speed Cones Set', 'Set of agility training cones', 35.0, true),
('Training Vest', 'Professional training vest', 40.0, true),
('Resistance Bands', 'Strength training resistance bands', 30.0, true),
('Agility Ladder', 'Speed and coordination training ladder', 55.0, true),

-- In game currency
('UPO Gold - 50', '$10 Dollars (Used to mock store userflows)', 0.0, true),
('UPO Gold - 500', '$100 Dollars worth of gold! (Used to mock store userflows)', 1.0, true);


-- Badges (Achievement System)
INSERT INTO badges (xp_amount, name, description) VALUES
(100.0, 'First Steps', 'Complete your first training session'),
(500.0, 'Getting Started', 'Earn your first 500 XP'),
(1000.0, 'Dedicated Trainer', 'Reach 1,000 XP milestone'),
(2500.0, 'Skilled Player', 'Achieve 2,500 XP through consistent training'),
(5000.0, 'Advanced Athlete', 'Master level reached with 5,000 XP'),
(10000.0, 'Elite Performer', 'Elite status achieved with 10,000 XP'),
(25000.0, 'Soccer Virtuoso', 'Exceptional skill level with 25,000 XP'),
(50000.0, 'Training Legend', 'Legendary status with 50,000 XP'),
(0.0, 'First Goal', 'Score your first goal in training'),
(0.0, 'Team Player', 'Join your first club'),
(0.0, 'Social Butterfly', 'Make 5 friends on the platform'),
(0.0, 'Consistent Trainer', 'Complete training for 7 consecutive days'),
(0.0, 'Weekend Warrior', 'Complete 10 weekend training sessions'),
(0.0, 'Speed Demon', 'Complete 20 speed-focused training sessions'),
(0.0, 'Precision Master', 'Complete 20 accuracy-focused training sessions');

-- Soccer Clubs
INSERT INTO clubs (name, description) VALUES
('Rising Stars FC', 'A community club focused on developing young talent and fostering team spirit'),
('Elite Training Academy', 'Professional-level training facility for serious players aiming for excellence'),
('Weekend Warriors', 'Casual club for players who love the game and weekend matches'),
('Youth Development United', 'Dedicated to nurturing the next generation of soccer talent'),
('City Soccer Club', 'Local club bringing together players from all walks of life'),
('Technical Masters', 'Club focused on developing technical skills and tactical awareness'),
('Fitness First FC', 'Emphasizing physical conditioning and athletic performance'),
('Global Soccer Network', 'International community of soccer enthusiasts and players'),
('Grassroots United', 'Community-driven club supporting local soccer development'),
('Champion Strikers', 'Specialized club for forwards and goal-scoring techniques');

-- Training Sessions
INSERT INTO training_sessions (title, description, experience_reward, duration_minutes) VALUES
-- Basic Skills
('Ball Control Fundamentals', 'Master the basics of ball control with various touches and surfaces', 50.0, 30),
('Passing Accuracy Drill', 'Improve short and long passing accuracy through targeted exercises', 45.0, 25),
('Shooting Technique', 'Learn proper shooting form and accuracy for different scenarios', 60.0, 35),
('Dribbling Basics', 'Fundamental dribbling moves and close ball control', 55.0, 30),
('First Touch Training', 'Develop a clean first touch in various game situations', 40.0, 20),

-- Intermediate Skills
('Advanced Dribbling Moves', 'Master step-overs, cuts, and advanced dribbling techniques', 80.0, 40),
('Crossing and Finishing', 'Perfect your crossing technique and finishing from wide positions', 75.0, 35),
('Defensive Positioning', 'Learn proper defensive stance, timing, and positioning', 70.0, 30),
('Midfield Playmaking', 'Develop vision, passing, and game management skills', 85.0, 45),
('Set Piece Execution', 'Master free kicks, corners, and penalty techniques', 90.0, 40),

-- Advanced Skills
('1v1 Attacking', 'Advanced techniques for beating defenders in one-on-one situations', 100.0, 35),
('Tactical Awareness', 'Understanding team formations, movements, and tactical concepts', 120.0, 50),
('Goalkeeper Training', 'Specialized training for shot-stopping, distribution, and positioning', 110.0, 45),
('Speed and Agility', 'Enhance acceleration, top speed, and change of direction', 95.0, 40),
('Match Simulation', 'Full-intensity training simulating real match conditions', 150.0, 60),

-- Physical Conditioning
('Cardio Endurance', 'Build cardiovascular fitness for full 90-minute performance', 60.0, 45),
('Strength Training', 'Soccer-specific strength exercises for power and injury prevention', 70.0, 35),
('Flexibility and Recovery', 'Stretching routines and recovery techniques for optimal performance', 30.0, 25),
('Core Stability', 'Strengthen core muscles for better balance and power transfer', 50.0, 30),
('Plyometric Training', 'Explosive power development through jump and sprint exercises', 80.0, 35),

-- Mental Training
('Mental Toughness', 'Develop resilience, focus, and confidence under pressure', 65.0, 30),
('Game Intelligence', 'Improve decision-making and reading of game situations', 75.0, 35),
('Leadership Skills', 'Develop communication and leadership qualities on the field', 55.0, 25),
('Pressure Handling', 'Learn to perform under pressure and manage game stress', 70.0, 30),
('Team Communication', 'Enhance on-field communication and coordination with teammates', 45.0, 20);

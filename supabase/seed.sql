BEGIN;

-- First, clean up existing data
DO $$
BEGIN
    DELETE FROM store_purchases;
    DELETE FROM user_badges;
    DELETE FROM training_results;
    DELETE FROM club_members;
    DELETE FROM friendships;
    DELETE FROM users;
    DELETE FROM accounts;
    DELETE FROM auth.identities;
    DELETE FROM auth.users;
END $$;

-- Create demo users and related data in one transaction
WITH user_values AS (
    SELECT *
    FROM (
        VALUES 
            ('demo@demo.com', 'Maria', 'Rodriguez', 'parent'),
            ('coach@demo.com', 'Alex', 'Thompson', 'coach'),
            ('teen@demo.com', 'Player', 'Three', 'player')
    ) AS t(email, first_name, last_name, type)
),
inserted_users AS (
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        invited_at,
        confirmation_token,
        confirmation_sent_at,
        recovery_token,
        recovery_sent_at,
        email_change_token_new,
        email_change,
        email_change_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        phone,
        phone_confirmed_at,
        phone_change,
        phone_change_token,
        phone_change_sent_at,
        email_change_token_current,
        email_change_confirm_status,
        banned_until,
        reauthentication_token,
        reauthentication_sent_at
    )
    SELECT
        CASE 
            WHEN email = 'demo@demo.com' THEN '11111111-1111-1111-1111-111111111111'::uuid
            WHEN email = 'coach@demo.com' THEN '22222222-2222-2222-2222-222222222222'::uuid
            ELSE '33333333-3333-3333-3333-333333333333'::uuid
        END,
        '00000000-0000-0000-0000-000000000000'::uuid,
        'authenticated',
        'authenticated',
        email,
        crypt('demo123', gen_salt('bf')),
        now(),
        NULL::timestamp,
        '',
        NULL::timestamp,
        '',
        NULL::timestamp,
        '',
        '',
        NULL::timestamp,
        now()::timestamp,
        '{"provider":"email","providers":["email"]}'::jsonb,
        json_build_object(
            'first_name', first_name,
            'last_name', last_name
        )::jsonb,
        false,
        now(),
        now(),
        NULL,
        NULL::timestamp,
        '',
        '',
        NULL::timestamp,
        '',
        0,
        NULL::timestamp,
        '',
        NULL::timestamp
    FROM user_values
    RETURNING id, email
),
inserted_identities AS (
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
    )
    SELECT 
        gen_random_uuid(),
        id,
        json_build_object(
            'sub', id::text,
            'email', email,
            'email_verified', true
        )::jsonb,
        'email',
        email,
        now(),
        now(),
        now()
    FROM inserted_users
    RETURNING user_id
)
-- Wait for trigger to create accounts
SELECT pg_sleep(0.1);

-- Create demo data
DO $$
DECLARE
    parent_auth_id UUID := '11111111-1111-1111-1111-111111111111';
    coach_auth_id UUID := '22222222-2222-2222-2222-222222222222';
    teen_auth_id UUID := '33333333-3333-3333-3333-333333333333';
    
    parent_account_id INTEGER;
    coach_account_id INTEGER;
    teen_account_id INTEGER;
    
    emma_user_id INTEGER;
    liam_user_id INTEGER;
    sophia_user_id INTEGER;
    coach_user_id INTEGER;
    teen_user_id INTEGER;
BEGIN
    -- Get account IDs
    SELECT id INTO parent_account_id FROM accounts WHERE auth_user_id = parent_auth_id;
    SELECT id INTO coach_account_id FROM accounts WHERE auth_user_id = coach_auth_id;
    SELECT id INTO teen_account_id FROM accounts WHERE auth_user_id = teen_auth_id;

    -- Create soccer players under the parent account (individual INSERTs)
    INSERT INTO users (name, account_id, gender, age_group, weight, height, dominant_foot, playing_position, experience_total, subscription_type, upro_gold, profile_picture, equipped_avatar_id, equipped_profile_banner_id)
    VALUES ('Emma Rodriguez', parent_account_id, 'Female', 12, 45.0, 155.0, true, 'Midfielder', 750.0, 2, 250.0, NULL, 2, 6)
    RETURNING id INTO emma_user_id;

    INSERT INTO users (name, account_id, gender, age_group, weight, height, dominant_foot, playing_position, experience_total, subscription_type, upro_gold, profile_picture, equipped_avatar_id, equipped_profile_banner_id)
    VALUES ('Liam Rodriguez', parent_account_id, 'Male', 10, 35.0, 140.0, false, 'Forward', 420.0, 2, 180.0, NULL, 1, 8)
    RETURNING id INTO liam_user_id;

    INSERT INTO users (name, account_id, gender, age_group, weight, height, dominant_foot, playing_position, experience_total, subscription_type, upro_gold, profile_picture, equipped_avatar_id, equipped_profile_banner_id)
    VALUES ('Sophia Rodriguez', parent_account_id, 'Female', 8, 28.0, 125.0, true, 'Defender', 180.0, 2, 320.0, NULL, 3, 9)
    RETURNING id INTO sophia_user_id;

    -- Create a coach user under coach account
    INSERT INTO users (name, account_id, gender, age_group, weight, height, dominant_foot, playing_position, experience_total, subscription_type, upro_gold)
    VALUES ('Coach Alex Thompson', coach_account_id, 'Male', 35, 75.0, 180.0, true, 'Coach', 15000.0, 2, 500.0)
    RETURNING id INTO coach_user_id;

    -- Create a teen player under separate account
    INSERT INTO users (name, account_id, gender, age_group, weight, height, dominant_foot, playing_position, experience_total, subscription_type, upro_gold)
    VALUES ('Jake Wilson', teen_account_id, 'Male', 16, 65.0, 175.0, true, 'Goalkeeper', 2250.0, 1, 120.0)
    RETURNING id INTO teen_user_id;

    -- Create friendships between players
    INSERT INTO friendships (requester_id, addressee_id, status, created_at) VALUES
        (emma_user_id, teen_user_id, 'accepted', NOW() - INTERVAL '2 weeks'),
        (liam_user_id, emma_user_id, 'accepted', NOW() - INTERVAL '3 weeks'),
        (sophia_user_id, liam_user_id, 'accepted', NOW() - INTERVAL '1 week'),
        (teen_user_id, liam_user_id, 'pending', NOW() - INTERVAL '2 days');

    -- Add users to clubs
    INSERT INTO club_members (user_id, club_id, joined_at, role) VALUES
        (emma_user_id, 1, NOW() - INTERVAL '6 months', 'member'),
        (liam_user_id, 1, NOW() - INTERVAL '6 months', 'member'),
        (sophia_user_id, 3, NOW() - INTERVAL '3 months', 'member'),
        (coach_user_id, 1, NOW() - INTERVAL '2 years', 'admin'),
        (teen_user_id, 2, NOW() - INTERVAL '1 year', 'member');

    -- Training Results - showing varied progress
    INSERT INTO training_results (user_id, training_session_id, xp_amount, created_at) VALUES
        -- Emma's progress (most advanced)
        (emma_user_id, 1, 25.0, NOW() - INTERVAL '3 weeks'),
        (emma_user_id, 2, 45.0, NOW() - INTERVAL '2 weeks'),
        (emma_user_id, 3, 60.0, NOW() - INTERVAL '1 week'),
        (emma_user_id, 4, 75.0, NOW() - INTERVAL '3 days'),
        (emma_user_id, 11, 100.0, NOW() - INTERVAL '1 day'), -- Premium content
        
        -- Liam's progress (intermediate)
        (liam_user_id, 1, 25.0, NOW() - INTERVAL '4 weeks'),
        (liam_user_id, 2, 40.0, NOW() - INTERVAL '2 weeks'),
        (liam_user_id, 1, 25.0, NOW() - INTERVAL '1 week'), -- Repeated training
        (liam_user_id, 3, 55.0, NOW() - INTERVAL '2 days'),
        (liam_user_id, 12, 90.0, NOW() - INTERVAL '6 hours'), -- Premium content
        
        -- Sophia's progress (beginner)
        (sophia_user_id, 1, 20.0, NOW() - INTERVAL '2 weeks'),
        (sophia_user_id, 1, 25.0, NOW() - INTERVAL '1 week'), -- Improvement on repeat
        (sophia_user_id, 2, 35.0, NOW() - INTERVAL '3 days'),
        
        -- Teen player's progress (advanced goalkeeper)
        (teen_user_id, 1, 25.0, NOW() - INTERVAL '1 month'),
        (teen_user_id, 8, 55.0, NOW() - INTERVAL '3 weeks'), -- Goalkeeper training
        (teen_user_id, 3, 65.0, NOW() - INTERVAL '2 weeks'),
        (teen_user_id, 4, 80.0, NOW() - INTERVAL '1 week'),
        (teen_user_id, 19, 110.0, NOW() - INTERVAL '2 days'), -- Premium goalkeeper training
        
        -- Coach's training (demonstration purposes)
        (coach_user_id, 14, 105.0, NOW() - INTERVAL '1 week'),
        (coach_user_id, 16, 115.0, NOW() - INTERVAL '3 days');

    -- User Badges - based on XP earned
    INSERT INTO user_badges (user_id, badge_id, earned_at) VALUES
        -- Emma's badges
        (emma_user_id, 1, NOW() - INTERVAL '3 weeks'), -- First Steps
        (emma_user_id, 2, NOW() - INTERVAL '2 weeks'), -- Getting Started (100 XP)
        (emma_user_id, 3, NOW() - INTERVAL '1 week'),  -- Training Enthusiast (500 XP)
        
        -- Liam's badges
        (liam_user_id, 1, NOW() - INTERVAL '4 weeks'), -- First Steps
        (liam_user_id, 2, NOW() - INTERVAL '2 weeks'), -- Getting Started (100 XP)
        
        -- Sophia's badges
        (sophia_user_id, 1, NOW() - INTERVAL '2 weeks'), -- First Steps
        (sophia_user_id, 2, NOW() - INTERVAL '3 days'),  -- Getting Started (100 XP)
        
        -- Teen player's badges
        (teen_user_id, 1, NOW() - INTERVAL '1 month'), -- First Steps
        (teen_user_id, 2, NOW() - INTERVAL '3 weeks'), -- Getting Started (100 XP)
        (teen_user_id, 3, NOW() - INTERVAL '2 weeks'), -- Training Enthusiast (500 XP)
        (teen_user_id, 4, NOW() - INTERVAL '1 week'),  -- Dedicated Player (1000 XP)
        (teen_user_id, 5, NOW() - INTERVAL '2 days'),  -- Rising Star (2500 XP)
        
        -- Coach's badges
        (coach_user_id, 1, NOW() - INTERVAL '2 years'),
        (coach_user_id, 2, NOW() - INTERVAL '2 years'),
        (coach_user_id, 3, NOW() - INTERVAL '2 years'),
        (coach_user_id, 4, NOW() - INTERVAL '1 year'),
        (coach_user_id, 5, NOW() - INTERVAL '1 year'),
        (coach_user_id, 6, NOW() - INTERVAL '6 months'),
        (coach_user_id, 7, NOW() - INTERVAL '3 months'),
        (coach_user_id, 8, NOW() - INTERVAL '1 month'); -- Legend status

    -- Store Purchases - showing the economy in action
    INSERT INTO store_purchases (user_id, store_item_id, quantity, total_cost, purchased_at) VALUES
        -- Emma's purchases (premium avatar and banner)
        (emma_user_id, 2, 1, 150.0, NOW() - INTERVAL '1 week'),    -- Elite Striker Avatar
        (emma_user_id, 6, 1, 100.0, NOW() - INTERVAL '5 days'),    -- World Cup Glory Banner
        (emma_user_id, 16, 1, 60.0, NOW() - INTERVAL '2 days'),    -- XP Boost
        
        -- Liam's purchases (basic avatar and training gear)
        (liam_user_id, 1, 1, 50.0, NOW() - INTERVAL '2 weeks'),    -- Classic Player Avatar
        (liam_user_id, 8, 1, 30.0, NOW() - INTERVAL '1 week'),     -- Local Hero Banner
        (liam_user_id, 11, 1, 25.0, NOW() - INTERVAL '3 days'),    -- Pro Soccer Ball
        
        -- Sophia's purchases (cute avatar and protective gear)
        (sophia_user_id, 3, 1, 120.0, NOW() - INTERVAL '1 week'),  -- Goalkeeper Pro Avatar
        (sophia_user_id, 9, 1, 45.0, NOW() - INTERVAL '4 days'),   -- Rising Star Banner
        (sophia_user_id, 15, 1, 20.0, NOW() - INTERVAL '1 day'),   -- Shin Guards
        
        -- Teen player's purchases (goalkeeper focused)
        (teen_user_id, 3, 1, 120.0, NOW() - INTERVAL '3 weeks'),   -- Goalkeeper Pro Avatar
        (teen_user_id, 13, 1, 35.0, NOW() - INTERVAL '2 weeks'),   -- Goalkeeper Gloves
        (teen_user_id, 17, 1, 45.0, NOW() - INTERVAL '1 week'),    -- Training Boost
        
        -- Coach's purchases (premium items)
        (coach_user_id, 4, 1, 200.0, NOW() - INTERVAL '1 month'),  -- Retro Legend Avatar
        (coach_user_id, 6, 1, 100.0, NOW() - INTERVAL '3 weeks'),  -- World Cup Glory Banner
        (coach_user_id, 18, 1, 75.0, NOW() - INTERVAL '2 weeks'),  -- Gold Rush
        (coach_user_id, 19, 1, 90.0, NOW() - INTERVAL '1 week');   -- Skill Accelerator

END $$;

COMMIT;

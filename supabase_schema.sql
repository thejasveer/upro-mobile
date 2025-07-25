-- The account that owns the profiles (a parent would make this while signing up)
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- If the account is premium or free
CREATE TABLE subscription_types (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL UNIQUE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    account_id INTEGER NOT NULL,
    gender TEXT NOT NULL,
    age_group INTEGER NOT NULL,
    weight FLOAT,
    height FLOAT,
    dominant_foot BOOLEAN, -- true == right foot, false == left foot
    playing_position TEXT, -- 'Forward', 'Midfielder', 'Defender', 'Goalkeeper' etc
    experience_total FLOAT DEFAULT 0.0 NOT NULL,
    subscription_type INTEGER NOT NULL,
    upro_gold FLOAT DEFAULT 0.0 NOT NULL,
    profile_picture TEXT, -- put url here?
    equipped_avatar_id INT, -- The profiles 3d avatar
    equipped_profile_banner_id INT, -- Like Call of Duty calling card
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_type) REFERENCES subscription_types(id) ON DELETE RESTRICT,
    FOREIGN KEY (equipped_avatar_id) REFERENCES store_items(id) ON DELETE SET NULL, 
    FOREIGN KEY (equipped_profile_banner_id) REFERENCES store_items(id) ON DELETE SET NULL,
    CONSTRAINT upro_gold_debt_check CHECK (upro_gold >= 0.0)
);

CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    requester_id INTEGER NOT NULL,
    addressee_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'blocked'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (addressee_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT no_self_friendship CHECK (requester_id != addressee_id),
    CONSTRAINT valid_friendship_status CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
    UNIQUE(requester_id, addressee_id) 
);

-- Badges awarded at X amount of xp 
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    xp_amount FLOAT DEFAULT 0.0,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL
);

-- Items users can buy
CREATE TABLE store_items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    upro_gold_cost FLOAT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT upro_gold_cost_check CHECK (upro_gold_cost >= 0.0)
);

-- Its a soccer club...
CREATE TABLE clubs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profiles will be associated to the clubs
CREATE TABLE club_members (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    club_id INTEGER NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role TEXT DEFAULT 'member', -- 'member', 'admin', 'owner'
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    UNIQUE(user_id, club_id)
);

-- Training sessions, Soccer dirlls, skill tutorials, Game Tactics
CREATE TABLE training_sessions (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    experience_reward FLOAT NOT NULL DEFAULT 0.0,
    duration_minutes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_xp CHECK (experience_reward >= 0.0)
);

-- How the user did for some training session
CREATE TABLE training_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    training_session_id INTEGER NOT NULL,
    xp_amount FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (training_session_id) REFERENCES training_sessions(id) ON DELETE CASCADE,
    CONSTRAINT positive_xp_result CHECK (xp_amount >= 0.0)
);

-- Badges the user currently has
CREATE TABLE user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    badge_id INTEGER NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
    UNIQUE(user_id, badge_id) 
);

-- Purchases a user has made with the U-Pro marketplace
CREATE TABLE store_purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    store_item_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    total_cost FLOAT NOT NULL,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_item_id) REFERENCES store_items(id) ON DELETE RESTRICT,
    CONSTRAINT positive_quantity CHECK (quantity > 0),
    CONSTRAINT positive_cost CHECK (total_cost >= 0.0)
);
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_online BOOLEAN DEFAULT true,
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  username VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forum_stats (
  id SERIAL PRIMARY KEY,
  total_users INTEGER DEFAULT 0,
  total_topics INTEGER DEFAULT 567,
  total_messages INTEGER DEFAULT 8901,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO forum_stats (total_users, total_topics, total_messages) 
VALUES (5, 567, 8901);

INSERT INTO users (username, password_hash) VALUES 
  ('Admin', 'admin123'),
  ('User123', 'user123'),
  ('MusicLover', 'music123'),
  ('Newbie', 'newbie123'),
  ('Guest', 'guest123');
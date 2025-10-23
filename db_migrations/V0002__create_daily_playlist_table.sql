CREATE TABLE IF NOT EXISTS daily_playlist (
  id SERIAL PRIMARY KEY,
  song_title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  duration VARCHAR(10) NOT NULL,
  play_order INTEGER NOT NULL,
  playlist_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_playlist_date ON daily_playlist(playlist_date);

INSERT INTO daily_playlist (song_title, artist, duration, play_order, playlist_date) VALUES
  ('Windows Vista Startup', 'Microsoft', '3:45', 1, CURRENT_DATE),
  ('Dreamscape', 'Aero Sounds', '4:20', 2, CURRENT_DATE),
  ('Crystal Clear', 'Vista Mix', '3:55', 3, CURRENT_DATE),
  ('Blue Sky Dreams', 'Frutiger Collective', '5:10', 4, CURRENT_DATE),
  ('Glossy Reflection', 'Aero Beats', '4:05', 5, CURRENT_DATE),
  ('Transparent Waves', 'Windows Era', '3:30', 6, CURRENT_DATE),
  ('Digital Horizon', 'Vista Lounge', '4:45', 7, CURRENT_DATE),
  ('Glass Garden', 'Aero Ambient', '5:25', 8, CURRENT_DATE),
  ('Aqua Dreams', 'Frutiger FM', '3:50', 9, CURRENT_DATE),
  ('Bubble Pop', 'Vista Vibes', '4:15', 10, CURRENT_DATE);
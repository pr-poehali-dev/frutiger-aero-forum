import json
import os
import psycopg2
from datetime import date, timedelta
from typing import Dict, Any
import random

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Daily radio playlist management with auto-refresh every 24h
    Args: event with httpMethod
    Returns: HTTP response with today's playlist
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'GET':
        db_url = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        today = date.today()
        
        cur.execute(
            "SELECT COUNT(*) FROM daily_playlist WHERE playlist_date = %s",
            (today,)
        )
        count = cur.fetchone()[0]
        
        if count == 0:
            song_pool = [
                ('Windows Vista Startup', 'Microsoft', '3:45'),
                ('Dreamscape', 'Aero Sounds', '4:20'),
                ('Crystal Clear', 'Vista Mix', '3:55'),
                ('Blue Sky Dreams', 'Frutiger Collective', '5:10'),
                ('Glossy Reflection', 'Aero Beats', '4:05'),
                ('Transparent Waves', 'Windows Era', '3:30'),
                ('Digital Horizon', 'Vista Lounge', '4:45'),
                ('Glass Garden', 'Aero Ambient', '5:25'),
                ('Aqua Dreams', 'Frutiger FM', '3:50'),
                ('Bubble Pop', 'Vista Vibes', '4:15'),
                ('Neon Lights', 'Retro Future', '4:30'),
                ('Ocean Breeze', 'Chill Wave', '3:40'),
                ('Sunset Glow', 'Evening Mix', '5:00'),
                ('Morning Dew', 'Fresh Start', '3:25'),
                ('Starlight', 'Night Sky', '4:50'),
            ]
            
            random.shuffle(song_pool)
            selected_songs = song_pool[:10]
            
            for idx, (title, artist, duration) in enumerate(selected_songs, 1):
                cur.execute(
                    "INSERT INTO daily_playlist (song_title, artist, duration, play_order, playlist_date) VALUES (%s, %s, %s, %s, %s)",
                    (title, artist, duration, idx, today)
                )
            
            conn.commit()
        
        cur.execute(
            "SELECT song_title, artist, duration, play_order FROM daily_playlist WHERE playlist_date = %s ORDER BY play_order",
            (today,)
        )
        rows = cur.fetchall()
        
        playlist = []
        for row in rows:
            playlist.append({
                'title': row[0],
                'artist': row[1],
                'duration': row[2],
                'order': row[3]
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'date': today.isoformat(),
                'playlist': playlist
            })
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }

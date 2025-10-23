import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Real-time chat message management
    Args: event with httpMethod, body (username, message for POST)
    Returns: HTTP response with messages or confirmation
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        username = body_data.get('username', '').strip()
        message = body_data.get('message', '').strip()
        
        if not username or not message:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Username and message required'})
            }
        
        cur.execute(
            "INSERT INTO messages (username, message) VALUES (%s, %s) RETURNING id, created_at",
            (username, message)
        )
        msg_id, created_at = cur.fetchone()
        conn.commit()
        
        cur.execute("UPDATE forum_stats SET total_messages = total_messages + 1")
        conn.commit()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'message': {
                    'id': msg_id,
                    'username': username,
                    'message': message,
                    'created_at': created_at.isoformat()
                }
            })
        }
    
    if method == 'GET':
        cur.execute(
            "SELECT id, username, message, created_at FROM messages ORDER BY created_at DESC LIMIT 50"
        )
        rows = cur.fetchall()
        
        messages = []
        for row in rows:
            messages.append({
                'id': row[0],
                'username': row[1],
                'message': row[2],
                'created_at': row[3].isoformat()
            })
        
        messages.reverse()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'messages': messages})
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }

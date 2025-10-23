import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: User authentication and session management
    Args: event with httpMethod, body (username, password for POST)
    Returns: HTTP response with user data or error
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
        password = body_data.get('password', '').strip()
        
        if not username or not password:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Username and password required'})
            }
        
        cur.execute(
            "SELECT id, username FROM users WHERE username = %s AND password_hash = %s",
            (username, password)
        )
        user = cur.fetchone()
        
        if user:
            user_id, username = user
            cur.execute(
                "UPDATE users SET is_online = true, last_seen = CURRENT_TIMESTAMP WHERE id = %s",
                (user_id,)
            )
            conn.commit()
            
            result = {
                'success': True,
                'user': {'id': user_id, 'username': username}
            }
        else:
            result = {'success': False, 'error': 'Invalid credentials'}
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps(result)
        }
    
    if method == 'GET':
        cur.execute("SELECT id, username, is_online FROM users WHERE is_online = true ORDER BY last_seen DESC")
        users = cur.fetchall()
        
        online_users = [{'id': u[0], 'username': u[1]} for u in users]
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'users': online_users})
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }

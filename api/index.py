from flask import Flask, request, jsonify, session, redirect, render_template_string
import os
import json
import base64
from io import BytesIO
from datetime import timedelta
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)

# OAuth 2.0 scopes
SCOPES = ['https://www.googleapis.com/auth/drive.file']

# Global variable to cache client config
_CLIENT_CONFIG = None

def get_client_config():
    """
    Get OAuth client configuration from GOOGLE_OAUTH_CREDENTIALS environment variable.
    This should be the full JSON downloaded from Google Cloud Console.
    Cached after first call to avoid repeated parsing.
    """
    global _CLIENT_CONFIG

    # Return cached config if available
    if _CLIENT_CONFIG is not None:
        return _CLIENT_CONFIG

    credentials_json = os.environ.get('GOOGLE_OAUTH_CREDENTIALS')

    if not credentials_json:
        raise ValueError(
            'Missing GOOGLE_OAUTH_CREDENTIALS environment variable.\n'
            'Download the OAuth credentials JSON from Google Cloud Console and set it as an environment variable.'
        )

    try:
        credentials = json.loads(credentials_json)

        # Handle both "web" and "installed" app types
        if 'web' in credentials:
            config = credentials['web']
        elif 'installed' in credentials:
            config = credentials['installed']
        else:
            raise ValueError('Invalid credentials format. Expected "web" or "installed" key in JSON.')

        # Ensure redirect_uris exists
        if 'redirect_uris' not in config:
            redirect_uri = os.environ.get('OAUTH_REDIRECT_URI', 'http://localhost:5000/oauth2callback')
            config['redirect_uris'] = [redirect_uri]

        # Cache the config
        _CLIENT_CONFIG = {"web": config}
        return _CLIENT_CONFIG

    except json.JSONDecodeError as e:
        raise ValueError(f'Invalid JSON in GOOGLE_OAUTH_CREDENTIALS: {e}')
    except (ValueError, KeyError) as e:
        raise ValueError(f'Error parsing GOOGLE_OAUTH_CREDENTIALS: {e}')

def get_flow():
    """Create OAuth flow"""
    client_config = get_client_config()
    flow = Flow.from_client_config(
        client_config,
        scopes=SCOPES,
        redirect_uri=client_config['web']['redirect_uris'][0]
    )
    return flow

def credentials_to_dict(credentials):
    """Convert credentials to dictionary for session storage"""
    return {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes
    }

def get_credentials_from_session():
    """Get credentials from session"""
    if 'credentials' not in session:
        return None
    return Credentials(**session['credentials'])

# Authorization UI HTML
AUTH_UI_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Drive Authorization - Pocket Booth</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 40px;
            max-width: 500px;
            width: 100%;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }
        .status {
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 25px;
            font-size: 14px;
        }
        .status.authorized {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .status.unauthorized {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }
        .status-icon {
            font-size: 20px;
            margin-right: 10px;
        }
        .info-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 25px;
            border-left: 4px solid #667eea;
        }
        .info-box h3 {
            color: #333;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .info-box ul {
            margin-left: 20px;
            color: #666;
            font-size: 14px;
            line-height: 1.8;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
            border: none;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
            text-align: center;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .button.secondary {
            background: #6c757d;
            margin-top: 10px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        .session-info {
            background: #e7f3ff;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #004085;
            border: 1px solid #b8daff;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📸 Pocket Booth</h1>
        <p class="subtitle">Google Drive Authorization</p>

        {% if authorized %}
        <div class="status authorized">
            <span class="status-icon">✓</span>
            <strong>Authorized!</strong> You're connected to Google Drive.
        </div>
        <div class="session-info">
            🕐 Your authorization is valid for <strong>24 hours</strong> from now.
        </div>
        <div class="info-box">
            <h3>What's Next?</h3>
            <ul>
                <li>Your photos will now be uploaded to Google Drive</li>
                <li>You can close this window and return to Pocket Booth</li>
                <li>Authorization will expire after 24 hours</li>
            </ul>
        </div>
        <a href="/revoke" class="button secondary">Revoke Access</a>
        {% else %}
        <div class="status unauthorized">
            <span class="status-icon">⚠</span>
            <strong>Not Authorized.</strong> Connect your Google Drive to upload photos.
        </div>
        <div class="info-box">
            <h3>What You're Authorizing:</h3>
            <ul>
                <li>Upload photos from Pocket Booth to your Google Drive</li>
                <li>Access is granted for 24 hours only</li>
                <li>You can revoke access at any time</li>
            </ul>
        </div>
        <a href="/authorize" class="button">Connect Google Drive</a>
        {% endif %}

        <div class="footer">
            Pocket Booth uses OAuth 2.0 for secure authorization<br>
            Your credentials are stored temporarily for 24 hours<br>
            <a href="/health" style="color: #667eea; text-decoration: none; margin-top: 10px; display: inline-block;">System Health Check →</a>
        </div>
    </div>
</body>
</html>
"""

@app.route('/')
def index():
    """Main authorization page"""
    try:
        # Check if OAuth is configured
        try:
            get_client_config()
            oauth_configured = True
        except Exception:
            oauth_configured = False

        if not oauth_configured:
            return """
            <html>
            <head>
                <title>Setup Required</title>
                <style>
                    body { font-family: sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; background: #f5f5f5; }
                    .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    h1 { color: #d32f2f; }
                    code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
                    a { color: #667eea; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>⚙️ Setup Required</h1>
                    <p><strong>Google OAuth credentials are not configured.</strong></p>
                    <p>The Flask app is running, but needs configuration to work.</p>
                    <hr>
                    <h3>Steps to configure:</h3>
                    <ol>
                        <li>Go to <strong>Vercel Dashboard</strong> → Your Project</li>
                        <li>Navigate to <strong>Settings</strong> → <strong>Environment Variables</strong></li>
                        <li>Add <code>GOOGLE_OAUTH_CREDENTIALS</code> with your OAuth JSON</li>
                        <li>Add <code>SECRET_KEY</code> with a random string</li>
                        <li>Redeploy the project</li>
                    </ol>
                    <p><a href="/health">→ Check system health for details</a></p>
                </div>
            </body>
            </html>
            """

        credentials = get_credentials_from_session()
        authorized = credentials and credentials.valid

        return render_template_string(AUTH_UI_HTML, authorized=authorized)
    except Exception as e:
        return f"""
        <html>
        <head><title>Error</title></head>
        <body style="font-family: sans-serif; padding: 40px;">
            <h1>Error</h1>
            <p>{str(e)}</p>
            <p><a href="/health">Check system health</a></p>
        </body>
        </html>
        """, 500

@app.route('/authorize')
def authorize():
    """Initiate OAuth flow"""
    try:
        flow = get_flow()
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent'
        )
        session['state'] = state
        session.permanent = True
        return redirect(authorization_url)
    except Exception as e:
        return f"""
        <html>
        <head><title>Configuration Error</title></head>
        <body style="font-family: sans-serif; padding: 40px; max-width: 600px; margin: 0 auto;">
            <h1>⚠️ Configuration Error</h1>
            <p><strong>OAuth credentials are not configured correctly.</strong></p>
            <p>Error: {str(e)}</p>
            <hr>
            <h3>How to fix:</h3>
            <ol>
                <li>Go to Vercel Dashboard → Your Project → Settings → Environment Variables</li>
                <li>Set <code>GOOGLE_OAUTH_CREDENTIALS</code> with your OAuth JSON</li>
                <li>Redeploy the project</li>
            </ol>
            <p><a href="/health">Check system health</a></p>
        </body>
        </html>
        """, 500

@app.route('/oauth2callback')
def oauth2callback():
    """OAuth callback handler"""
    try:
        # Check for error in callback
        error = request.args.get('error')
        if error:
            error_description = request.args.get('error_description', 'Unknown error')
            return f"""
            <html>
            <head><title>Authorization Error</title></head>
            <body style="font-family: sans-serif; padding: 40px; max-width: 600px; margin: 0 auto;">
                <h1>❌ Authorization Failed</h1>
                <p><strong>Error:</strong> {error}</p>
                <p><strong>Description:</strong> {error_description}</p>
                <hr>
                <h3>Common Issues:</h3>
                <ul>
                    <li><strong>redirect_uri_mismatch:</strong> The redirect URI must match exactly in both Google Cloud Console and your app configuration</li>
                    <li><strong>access_denied:</strong> You cancelled the authorization</li>
                </ul>
                <p><a href="/">← Back to authorization page</a></p>
                <p><a href="/health">Check system health</a></p>
            </body>
            </html>
            """, 400

        # Verify state to prevent CSRF attacks
        # state = session.get('state')

        flow = get_flow()
        flow.fetch_token(authorization_response=request.url)

        credentials = flow.credentials
        session['credentials'] = credentials_to_dict(credentials)
        session.permanent = True

        return redirect('/')
    except Exception as e:
        return f"""
        <html>
        <head><title>OAuth Error</title></head>
        <body style="font-family: sans-serif; padding: 40px; max-width: 600px; margin: 0 auto;">
            <h1>⚠️ OAuth Callback Error</h1>
            <p><strong>Error:</strong> {str(e)}</p>
            <hr>
            <h3>How to fix:</h3>
            <ol>
                <li>Check that redirect_uris in GOOGLE_OAUTH_CREDENTIALS matches your Vercel URL</li>
                <li>Go to Google Cloud Console and verify Authorized redirect URIs</li>
                <li>Format: https://your-app.vercel.app/oauth2callback</li>
            </ol>
            <p><a href="/">← Try again</a></p>
        </body>
        </html>
        """, 500

@app.route('/revoke')
def revoke():
    """Revoke OAuth credentials"""
    if 'credentials' in session:
        del session['credentials']
    return redirect('/')

@app.route('/health')
def health():
    """Health check endpoint - verify Flask is running on Vercel"""
    try:
        # Test if OAuth config can be loaded
        config_loaded = False
        client_id = 'Not set'
        config_error = None

        try:
            client_config = get_client_config()
            config_loaded = client_config and 'web' in client_config
            if config_loaded:
                client_id = client_config.get('web', {}).get('client_id', 'Not set')[:20] + '...'
        except Exception as e:
            config_error = str(e)

        return jsonify({
            'status': 'healthy',
            'service': 'Pocket Booth API',
            'platform': 'Vercel',
            'oauth_configured': config_loaded,
            'oauth_error': config_error,
            'client_id_preview': client_id,
            'endpoints': {
                'authorization': '/authorize',
                'oauth_callback': '/oauth2callback',
                'status_check': '/api/status',
                'upload': '/api/upload (POST)',
                'health': '/health'
            },
            'environment': {
                'secret_key_set': bool(app.secret_key and app.secret_key != 'dev-secret-key-change-in-production'),
                'gdrive_folder_configured': bool(os.environ.get('GDRIVE_FOLDER_ID')),
                'google_oauth_credentials_set': bool(os.environ.get('GOOGLE_OAUTH_CREDENTIALS'))
            }
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'service': 'Pocket Booth API',
            'error': str(e)
        }), 500

@app.route('/api/status')
def api_status():
    """Check authorization status"""
    credentials = get_credentials_from_session()

    return jsonify({
        'authorized': credentials and credentials.valid,
        'message': 'Authorized' if (credentials and credentials.valid) else 'Not authorized'
    })

@app.route('/api/upload', methods=['POST', 'OPTIONS'])
def api_upload():
    """Upload image to Google Drive"""
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    try:
        # Check credentials
        credentials = get_credentials_from_session()
        if not credentials or not credentials.valid:
            response = jsonify({
                'error': 'Not authorized. Please authorize at the /authorize endpoint first.',
                'authorized': False
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 401

        # Get request data
        data = request.get_json()

        if not data or 'image' not in data or 'filename' not in data:
            response = jsonify({'error': 'Missing required fields: image and filename'})
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 400

        # Get folder ID from environment or use root
        folder_id = os.environ.get('GDRIVE_FOLDER_ID')

        # Decode base64 image
        image_data = data['image']
        filename = data['filename']

        # Handle base64 data URI format
        if ',' in image_data:
            image_data = image_data.split(',')[1]

        image_bytes = base64.b64decode(image_data)

        # Determine mimetype
        mimetype = 'image/png'
        if filename.lower().endswith(('.jpg', '.jpeg')):
            mimetype = 'image/jpeg'
        elif filename.lower().endswith('.gif'):
            mimetype = 'image/gif'
        elif filename.lower().endswith('.webp'):
            mimetype = 'image/webp'

        # Build Drive service
        drive_service = build('drive', 'v3', credentials=credentials)

        # Create file metadata
        file_metadata = {'name': filename}
        if folder_id:
            file_metadata['parents'] = [folder_id]

        # Upload file
        media = MediaIoBaseUpload(
            BytesIO(image_bytes),
            mimetype=mimetype,
            resumable=True
        )

        file = drive_service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id, name, webViewLink'
        ).execute()

        response = jsonify({
            'success': True,
            'file_id': file.get('id'),
            'file_name': file.get('name'),
            'web_view_link': file.get('webViewLink'),
            'message': 'Image uploaded successfully'
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    except Exception as e:
        response = jsonify({'error': f'Upload failed: {str(e)}'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

# Export app for Vercel
# Vercel will automatically detect and use the 'app' object
# No need for a custom handler - Vercel handles Flask apps natively

if __name__ == '__main__':
    # For local development only
    app.run(debug=True, host='0.0.0.0', port=5000)

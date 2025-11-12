"""
Health Check Web Server for Render
Allows Render to monitor the bot's health status
"""
import os
import asyncio
import logging
from datetime import datetime
from flask import Flask, jsonify
from threading import Thread

from market_data import MarketDataProvider

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Global health status
health_status = {
    'status': 'starting',
    'last_check': None,
    'market_data_ok': False,
    'uptime_start': datetime.now().isoformat()
}


@app.route('/')
def home():
    """Root endpoint"""
    return jsonify({
        'service': 'XAU/USD AI Trading Bot',
        'status': 'running',
        'timestamp': datetime.now().isoformat()
    })


@app.route('/health')
def health():
    """Health check endpoint for Render"""
    return jsonify(health_status), 200 if health_status['status'] == 'healthy' else 503


@app.route('/status')
def status():
    """Detailed status endpoint"""
    return jsonify({
        'service': 'XAU/USD AI Trading Bot',
        'health': health_status,
        'environment': {
            'analysis_interval': os.getenv('ANALYSIS_INTERVAL_SECONDS', '300'),
            'status_update_interval': os.getenv('STATUS_UPDATE_INTERVAL_SECONDS', '3600')
        },
        'timestamp': datetime.now().isoformat()
    })


def update_health_status():
    """Periodically update health status"""
    while True:
        try:
            # Test market data connection
            provider = MarketDataProvider()
            price = provider.get_current_price()
            
            if price:
                health_status['status'] = 'healthy'
                health_status['market_data_ok'] = True
            else:
                health_status['status'] = 'degraded'
                health_status['market_data_ok'] = False
            
            health_status['last_check'] = datetime.now().isoformat()
            
        except Exception as e:
            logger.error(f"Health check error: {e}")
            health_status['status'] = 'unhealthy'
            health_status['market_data_ok'] = False
        
        # Check every 60 seconds
        import time
        time.sleep(60)


def start_health_server():
    """Start the health check server"""
    port = int(os.getenv('PORT', '10000'))
    
    # Start health monitoring in background
    health_thread = Thread(target=update_health_status, daemon=True)
    health_thread.start()
    
    logger.info(f"Starting health check server on port {port}")
    app.run(host='0.0.0.0', port=port)


if __name__ == '__main__':
    start_health_server()

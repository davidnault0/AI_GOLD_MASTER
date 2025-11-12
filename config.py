"""
Configuration management for the Gold Analysis AI
"""
import os
from typing import Optional

class Config:
    """Configuration class for managing environment variables and settings"""
    
    # Telegram Bot Configuration
    TELEGRAM_BOT_TOKEN: str = os.getenv('TELEGRAM_BOT_TOKEN', '')
    TELEGRAM_CHAT_ID: str = os.getenv('TELEGRAM_CHAT_ID', '')
    
    # API Keys for market data
    ALPHA_VANTAGE_API_KEY: str = os.getenv('ALPHA_VANTAGE_API_KEY', '')
    POLYGON_API_KEY: str = os.getenv('POLYGON_API_KEY', '')
    FINNHUB_API_KEY: str = os.getenv('FINNHUB_API_KEY', '')
    
    # Analysis Configuration
    ANALYSIS_INTERVAL_SECONDS: int = int(os.getenv('ANALYSIS_INTERVAL_SECONDS', '300'))  # 5 minutes default
    CONFIDENCE_THRESHOLD: float = float(os.getenv('CONFIDENCE_THRESHOLD', '0.7'))
    
    # Server Configuration
    PORT: int = int(os.getenv('PORT', '8000'))
    HOST: str = os.getenv('HOST', '0.0.0.0')
    
    # Gold Symbol
    GOLD_SYMBOL: str = 'XAUUSD'  # Gold/USD pair
    
    @classmethod
    def validate(cls) -> bool:
        """Validate that required configuration is present"""
        required_vars = [
            ('TELEGRAM_BOT_TOKEN', cls.TELEGRAM_BOT_TOKEN),
            ('TELEGRAM_CHAT_ID', cls.TELEGRAM_CHAT_ID),
        ]
        
        missing = [var for var, val in required_vars if not val]
        
        if missing:
            print(f"Warning: Missing required environment variables: {', '.join(missing)}")
            print("The bot will run in limited mode. Set these variables for full functionality.")
            return False
        return True
    
    @classmethod
    def get_api_keys(cls) -> dict:
        """Get available API keys for market data sources"""
        return {
            'alpha_vantage': cls.ALPHA_VANTAGE_API_KEY,
            'polygon': cls.POLYGON_API_KEY,
            'finnhub': cls.FINNHUB_API_KEY,
        }

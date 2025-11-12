"""
XAU/USD Market Data Provider
Fetches real-time and historical gold prices for analysis
"""
import os
import time
import requests
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MarketDataProvider:
    """Provides continuous access to XAU/USD market data"""
    
    def __init__(self):
        # Using Twelve Data API (free tier available)
        self.api_key = os.getenv('TWELVE_DATA_API_KEY', '')
        self.base_url = 'https://api.twelvedata.com'
        self.symbol = 'XAU/USD'
        self.cache = {}
        self.cache_duration = 60  # Cache for 60 seconds
        
    def get_current_price(self) -> Optional[Dict]:
        """
        Get current XAU/USD price
        Returns: Dict with price, timestamp, and metadata
        """
        try:
            # Check cache first
            cache_key = 'current_price'
            if cache_key in self.cache:
                cached_data, cached_time = self.cache[cache_key]
                if time.time() - cached_time < self.cache_duration:
                    return cached_data
            
            url = f'{self.base_url}/price'
            params = {
                'symbol': self.symbol,
                'apikey': self.api_key
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if 'price' in data:
                result = {
                    'price': float(data['price']),
                    'timestamp': datetime.now().isoformat(),
                    'symbol': self.symbol
                }
                self.cache[cache_key] = (result, time.time())
                logger.info(f"Current XAU/USD price: ${result['price']}")
                return result
            else:
                logger.error(f"Unexpected API response: {data}")
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching current price: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return None
    
    def get_historical_data(self, interval: str = '1h', outputsize: int = 100) -> Optional[List[Dict]]:
        """
        Get historical XAU/USD data
        
        Args:
            interval: Time interval (1min, 5min, 15min, 30min, 1h, 4h, 1day)
            outputsize: Number of data points to retrieve
            
        Returns: List of OHLCV data points
        """
        try:
            cache_key = f'historical_{interval}_{outputsize}'
            if cache_key in self.cache:
                cached_data, cached_time = self.cache[cache_key]
                if time.time() - cached_time < self.cache_duration:
                    return cached_data
            
            url = f'{self.base_url}/time_series'
            params = {
                'symbol': self.symbol,
                'interval': interval,
                'outputsize': outputsize,
                'apikey': self.api_key
            }
            
            response = requests.get(url, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()
            
            if 'values' in data and data['values']:
                # Parse and format the data
                formatted_data = []
                for item in data['values']:
                    formatted_data.append({
                        'timestamp': item['datetime'],
                        'open': float(item['open']),
                        'high': float(item['high']),
                        'low': float(item['low']),
                        'close': float(item['close']),
                        'volume': float(item.get('volume', 0))
                    })
                
                self.cache[cache_key] = (formatted_data, time.time())
                logger.info(f"Retrieved {len(formatted_data)} historical data points")
                return formatted_data
            else:
                logger.error(f"No historical data available: {data}")
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching historical data: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error in historical data: {e}")
            return None
    
    def get_quote(self) -> Optional[Dict]:
        """
        Get detailed quote information
        Returns: Dict with bid, ask, spread, and other metadata
        """
        try:
            url = f'{self.base_url}/quote'
            params = {
                'symbol': self.symbol,
                'apikey': self.api_key
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if 'close' in data:
                result = {
                    'symbol': data.get('symbol', self.symbol),
                    'price': float(data['close']),
                    'open': float(data.get('open', data['close'])),
                    'high': float(data.get('high', data['close'])),
                    'low': float(data.get('low', data['close'])),
                    'volume': float(data.get('volume', 0)),
                    'previous_close': float(data.get('previous_close', data['close'])),
                    'change': float(data.get('change', 0)),
                    'percent_change': float(data.get('percent_change', 0)),
                    'timestamp': data.get('timestamp', datetime.now().isoformat())
                }
                logger.info(f"Quote: ${result['price']} ({result['percent_change']:+.2f}%)")
                return result
            else:
                logger.error(f"Unexpected quote response: {data}")
                return None
                
        except Exception as e:
            logger.error(f"Error fetching quote: {e}")
            return None


class FallbackDataProvider:
    """
    Fallback provider using alternative free APIs
    Used when primary provider fails or has rate limits
    """
    
    def __init__(self):
        self.alpha_vantage_key = os.getenv('ALPHA_VANTAGE_API_KEY', '')
        
    def get_current_price(self) -> Optional[Dict]:
        """Get current price from Alpha Vantage"""
        try:
            url = 'https://www.alphavantage.co/query'
            params = {
                'function': 'CURRENCY_EXCHANGE_RATE',
                'from_currency': 'XAU',
                'to_currency': 'USD',
                'apikey': self.alpha_vantage_key
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if 'Realtime Currency Exchange Rate' in data:
                rate_data = data['Realtime Currency Exchange Rate']
                result = {
                    'price': float(rate_data['5. Exchange Rate']),
                    'timestamp': rate_data['6. Last Refreshed'],
                    'symbol': 'XAU/USD',
                    'source': 'alpha_vantage'
                }
                logger.info(f"Fallback: XAU/USD price: ${result['price']}")
                return result
            else:
                logger.error(f"Alpha Vantage error: {data}")
                return None
                
        except Exception as e:
            logger.error(f"Fallback provider error: {e}")
            return None

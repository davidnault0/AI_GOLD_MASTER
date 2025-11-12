"""
Market Data Service for fetching gold prices from multiple sources
"""
import asyncio
import aiohttp
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
from config import Config

class MarketDataService:
    """Service for fetching gold market data from multiple sources"""
    
    def __init__(self):
        self.api_keys = Config.get_api_keys()
        self.gold_symbol = Config.GOLD_SYMBOL
        
    async def fetch_current_price(self) -> Optional[float]:
        """
        Fetch current gold price from available sources
        
        Returns:
            Current gold price in USD or None if unavailable
        """
        # Try multiple sources in order of preference
        price = None
        
        # Try Alpha Vantage
        if self.api_keys['alpha_vantage']:
            price = await self._fetch_from_alpha_vantage()
            if price:
                return price
        
        # Try Polygon.io
        if self.api_keys['polygon']:
            price = await self._fetch_from_polygon()
            if price:
                return price
        
        # Try Finnhub
        if self.api_keys['finnhub']:
            price = await self._fetch_from_finnhub()
            if price:
                return price
        
        # Fallback to free APIs
        price = await self._fetch_from_free_source()
        return price
    
    async def _fetch_from_alpha_vantage(self) -> Optional[float]:
        """Fetch gold price from Alpha Vantage API"""
        try:
            url = f"https://www.alphavantage.co/query"
            params = {
                'function': 'CURRENCY_EXCHANGE_RATE',
                'from_currency': 'XAU',
                'to_currency': 'USD',
                'apikey': self.api_keys['alpha_vantage']
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, timeout=10) as response:
                    if response.status == 200:
                        data = await response.json()
                        if 'Realtime Currency Exchange Rate' in data:
                            price_str = data['Realtime Currency Exchange Rate']['5. Exchange Rate']
                            return float(price_str)
        except Exception as e:
            print(f"Error fetching from Alpha Vantage: {e}")
        return None
    
    async def _fetch_from_polygon(self) -> Optional[float]:
        """Fetch gold price from Polygon.io API"""
        try:
            # Note: Polygon uses different symbols, C:XAUUSD for crypto-style gold
            url = f"https://api.polygon.io/v2/last/nbbo/C:XAUUSD"
            params = {'apiKey': self.api_keys['polygon']}
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, timeout=10) as response:
                    if response.status == 200:
                        data = await response.json()
                        if 'results' in data:
                            return float(data['results']['P'])
        except Exception as e:
            print(f"Error fetching from Polygon: {e}")
        return None
    
    async def _fetch_from_finnhub(self) -> Optional[float]:
        """Fetch gold price from Finnhub API"""
        try:
            url = f"https://finnhub.io/api/v1/forex/rates"
            params = {
                'base': 'XAU',
                'token': self.api_keys['finnhub']
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, timeout=10) as response:
                    if response.status == 200:
                        data = await response.json()
                        if 'quote' in data and 'USD' in data['quote']:
                            return float(data['quote']['USD'])
        except Exception as e:
            print(f"Error fetching from Finnhub: {e}")
        return None
    
    async def _fetch_from_free_source(self) -> Optional[float]:
        """
        Fetch gold price from free sources as fallback
        Uses metalpriceapi.com free tier or similar
        """
        try:
            # Using a free API endpoint (no key required for basic access)
            # Note: This is a fallback and may have rate limits
            url = "https://api.metalpriceapi.com/v1/latest"
            params = {
                'base': 'USD',
                'currencies': 'XAU'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, timeout=10) as response:
                    if response.status == 200:
                        data = await response.json()
                        if 'rates' in data and 'XAU' in data['rates']:
                            # Convert from USD per troy ounce to price per ounce
                            xau_rate = float(data['rates']['XAU'])
                            # XAU rate is typically in USD per ounce already or needs conversion
                            return 1.0 / xau_rate if xau_rate > 0 else None
        except Exception as e:
            print(f"Error fetching from free source: {e}")
        
        # If all else fails, return a simulated price for testing
        print("Warning: Using simulated price data. Configure API keys for real data.")
        return 2000.0 + (datetime.now().second % 10) * 0.5
    
    async def fetch_historical_data(self, days: int = 30) -> List[Dict[str, Any]]:
        """
        Fetch historical gold price data
        
        Args:
            days: Number of days of historical data to fetch
            
        Returns:
            List of dictionaries with date and price information
        """
        # This would be implemented with specific API calls
        # For now, return simulated data for testing
        historical_data = []
        base_price = 2000.0
        
        for i in range(days):
            date = datetime.now() - timedelta(days=days-i)
            # Simulate some price movement
            price = base_price + (i * 2) + ((i % 7) * 5)
            historical_data.append({
                'date': date.isoformat(),
                'price': price
            })
        
        return historical_data
    
    async def get_market_sentiment(self) -> Dict[str, Any]:
        """
        Fetch market sentiment data related to gold
        
        Returns:
            Dictionary with sentiment indicators
        """
        # This would integrate with news APIs, social media sentiment, etc.
        # For now, return basic structure
        return {
            'sentiment_score': 0.5,  # -1 to 1 scale
            'news_count': 0,
            'sources': []
        }

"""
Tests for the Gold Analysis AI Bot
"""
import pytest
import asyncio
from config import Config
from analysis_engine import GoldAnalysisEngine
from market_data_service import MarketDataService

class TestConfig:
    """Test configuration management"""
    
    def test_config_defaults(self):
        """Test that config has reasonable defaults"""
        assert Config.ANALYSIS_INTERVAL_SECONDS > 0
        assert 0 <= Config.CONFIDENCE_THRESHOLD <= 1
        assert Config.PORT > 0
        assert Config.GOLD_SYMBOL == 'XAUUSD'

class TestAnalysisEngine:
    """Test the analysis engine"""
    
    def test_engine_initialization(self):
        """Test engine initializes correctly"""
        engine = GoldAnalysisEngine()
        assert engine is not None
        assert len(engine.price_history) == 0
    
    def test_add_price_data(self):
        """Test adding price data"""
        engine = GoldAnalysisEngine()
        engine.add_price_data(2000.0)
        assert len(engine.price_history) == 1
        assert engine.price_history[0] == 2000.0
    
    def test_sma_calculation(self):
        """Test Simple Moving Average calculation"""
        engine = GoldAnalysisEngine()
        prices = [2000, 2010, 2020, 2030, 2040]
        for price in prices:
            engine.add_price_data(price)
        
        sma_5 = engine.calculate_sma(5)
        assert sma_5 is not None
        assert sma_5 == 2020.0  # Average of 2000-2040
    
    def test_trend_detection(self):
        """Test trend detection"""
        engine = GoldAnalysisEngine()
        
        # Add uptrending prices
        for i in range(15):
            engine.add_price_data(2000 + i * 5)
        
        trend = engine.detect_trend()
        assert trend in ['UPTREND', 'DOWNTREND', 'SIDEWAYS']
    
    @pytest.mark.asyncio
    async def test_analysis_with_data(self):
        """Test full analysis with price data"""
        engine = GoldAnalysisEngine()
        
        # Add some historical data
        for i in range(60):
            engine.add_price_data(2000 + i * 0.5)
        
        # Perform analysis
        result = await engine.analyze(2030.0)
        
        assert 'signal_type' in result
        assert result['signal_type'] in ['BUY', 'SELL', 'HOLD']
        assert 'confidence' in result
        assert 0 <= result['confidence'] <= 1
        assert 'price' in result
        assert result['price'] == 2030.0
        assert 'indicators' in result
        assert 'analysis' in result

class TestMarketDataService:
    """Test market data service"""
    
    @pytest.mark.asyncio
    async def test_fetch_current_price(self):
        """Test fetching current price"""
        service = MarketDataService()
        price = await service.fetch_current_price()
        
        # Should get a price (real or simulated)
        assert price is not None
        assert price > 0
        assert price < 10000  # Reasonable range for gold

    @pytest.mark.asyncio
    async def test_fetch_historical_data(self):
        """Test fetching historical data"""
        service = MarketDataService()
        data = await service.fetch_historical_data(30)
        
        assert len(data) == 30
        assert all('date' in item for item in data)
        assert all('price' in item for item in data)

if __name__ == '__main__':
    pytest.main([__file__, '-v'])

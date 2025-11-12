"""
Test suite for XAU/USD AI Trading Bot
Run with: python test_bot.py
"""
import os
import sys
from datetime import datetime

# Set dummy environment variables for testing
os.environ['TWELVE_DATA_API_KEY'] = 'test_key'
os.environ['TELEGRAM_BOT_TOKEN'] = 'test:token'
os.environ['TELEGRAM_CHAT_ID'] = '12345'


def test_market_data_provider():
    """Test market data provider initialization"""
    print("Testing Market Data Provider...")
    try:
        from market_data import MarketDataProvider, FallbackDataProvider
        
        provider = MarketDataProvider()
        assert provider.symbol == 'XAU/USD'
        assert provider.cache_duration == 60
        print("✓ MarketDataProvider initialized successfully")
        
        fallback = FallbackDataProvider()
        print("✓ FallbackDataProvider initialized successfully")
        
        return True
    except Exception as e:
        print(f"✗ Market Data Provider test failed: {e}")
        return False


def test_ai_analyzer():
    """Test AI analyzer initialization and basic calculations"""
    print("\nTesting AI Analyzer...")
    try:
        from ai_analyzer import TechnicalAnalyzer, AISignalGenerator
        
        analyzer = TechnicalAnalyzer()
        print("✓ TechnicalAnalyzer initialized successfully")
        
        # Test SMA calculation
        test_data = [100, 102, 101, 103, 105, 104, 106, 108, 107, 109]
        sma = analyzer.calculate_sma(test_data, 5)
        assert sma is not None
        print(f"✓ SMA calculation works: {sma:.2f}")
        
        # Test RSI calculation
        rsi = analyzer.calculate_rsi(test_data, 5)
        assert rsi is not None
        assert 0 <= rsi <= 100
        print(f"✓ RSI calculation works: {rsi:.2f}")
        
        # Test signal generator
        signal_gen = AISignalGenerator()
        assert signal_gen.signal_confidence_threshold == 0.6
        print("✓ AISignalGenerator initialized successfully")
        
        return True
    except Exception as e:
        print(f"✗ AI Analyzer test failed: {e}")
        return False


def test_telegram_bot():
    """Test Telegram bot initialization"""
    print("\nTesting Telegram Bot...")
    try:
        from telegram_bot import TelegramNotifier
        
        notifier = TelegramNotifier()
        assert notifier.bot is not None
        assert notifier.chat_id == '12345'
        print("✓ TelegramNotifier initialized successfully")
        
        # Test message formatting
        test_signal = {
            'signal': 'BUY',
            'confidence': 0.75,
            'current_price': 2050.50,
            'timestamp': datetime.now().isoformat(),
            'indicators': {
                'rsi': 45.5,
                'sma_20': 2048.0,
                'ema_12': 2049.5,
                'macd': {'macd': 2.5, 'signal': 1.8, 'histogram': 0.7}
            },
            'levels': {
                'stop_loss': 2040.0,
                'take_profit': 2065.0,
                'support': 2045.0,
                'resistance': 2055.0
            },
            'reasons': ['RSI oversold', 'Bullish trend'],
            'buy_score': 4.5,
            'sell_score': 1.0
        }
        
        message = notifier._format_signal_message(test_signal)
        assert 'BUY' in message
        assert '75%' in message
        assert '$2,050.50' in message
        print("✓ Signal message formatting works")
        
        return True
    except Exception as e:
        print(f"✗ Telegram Bot test failed: {e}")
        return False


def test_health_server():
    """Test health server initialization"""
    print("\nTesting Health Server...")
    try:
        from health_server import app, health_status
        
        assert app is not None
        assert 'status' in health_status
        print("✓ Health server initialized successfully")
        
        # Test that routes exist
        rules = [rule.rule for rule in app.url_map.iter_rules()]
        assert '/' in rules
        assert '/health' in rules
        assert '/status' in rules
        print("✓ All health endpoints configured")
        
        return True
    except Exception as e:
        print(f"✗ Health Server test failed: {e}")
        return False


def test_main_bot():
    """Test main bot initialization"""
    print("\nTesting Main Bot...")
    try:
        from main import TradingBot
        
        bot = TradingBot()
        assert bot.market_data is not None
        assert bot.ai_analyzer is not None
        assert bot.telegram is not None
        assert bot.analysis_interval == 300
        print("✓ TradingBot initialized successfully")
        
        return True
    except Exception as e:
        print(f"✗ Main Bot test failed: {e}")
        return False


def test_integration():
    """Test that all components can work together"""
    print("\nTesting Integration...")
    try:
        # Create test historical data
        historical_data = []
        base_price = 2000
        for i in range(100):
            historical_data.append({
                'timestamp': f'2025-11-12T{i % 24:02d}:00:00',
                'open': base_price + (i % 10),
                'high': base_price + (i % 10) + 2,
                'low': base_price + (i % 10) - 2,
                'close': base_price + (i % 10) + 1,
                'volume': 1000 + (i * 10)
            })
        
        from ai_analyzer import AISignalGenerator
        
        signal_gen = AISignalGenerator()
        
        # Try to analyze (should work or return None gracefully)
        signal = signal_gen.analyze_market(historical_data)
        print(f"✓ Analysis completed: {signal['signal'] if signal else 'No signal'}")
        
        # Test market summary
        summary = signal_gen.get_market_summary(historical_data)
        assert summary is not None
        assert 'current_price' in summary
        print(f"✓ Market summary generated: ${summary['current_price']}")
        
        return True
    except Exception as e:
        print(f"✗ Integration test failed: {e}")
        return False


def main():
    """Run all tests"""
    print("=" * 60)
    print("XAU/USD AI Trading Bot - Test Suite")
    print("=" * 60)
    
    tests = [
        test_market_data_provider,
        test_ai_analyzer,
        test_telegram_bot,
        test_health_server,
        test_main_bot,
        test_integration
    ]
    
    results = []
    for test in tests:
        try:
            results.append(test())
        except Exception as e:
            print(f"✗ Test crashed: {e}")
            results.append(False)
    
    print("\n" + "=" * 60)
    print(f"Test Results: {sum(results)}/{len(results)} passed")
    print("=" * 60)
    
    if all(results):
        print("✅ All tests passed!")
        return 0
    else:
        print("❌ Some tests failed. Check the output above.")
        return 1


if __name__ == '__main__':
    sys.exit(main())

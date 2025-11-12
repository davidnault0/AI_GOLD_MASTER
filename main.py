"""
Main Trading Bot Application
Runs 24/7 on Render, continuously analyzing XAU/USD and sending signals
"""
import os
import sys
import time
import asyncio
import logging
from datetime import datetime
from typing import Optional

from market_data import MarketDataProvider, FallbackDataProvider
from ai_analyzer import AISignalGenerator
from telegram_bot import TelegramNotifier

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class TradingBot:
    """
    Main trading bot that runs continuously
    Analyzes XAU/USD market data and sends signals to Telegram
    """
    
    def __init__(self):
        self.market_data = MarketDataProvider()
        self.fallback_data = FallbackDataProvider()
        self.ai_analyzer = AISignalGenerator()
        self.telegram = TelegramNotifier()
        
        # Configuration
        self.analysis_interval = int(os.getenv('ANALYSIS_INTERVAL_SECONDS', '300'))  # 5 minutes default
        self.status_update_interval = int(os.getenv('STATUS_UPDATE_INTERVAL_SECONDS', '3600'))  # 1 hour default
        self.last_status_update = 0
        self.last_signal_time = 0
        self.min_signal_interval = 1800  # Minimum 30 minutes between signals
        
        self.running = False
        
    async def start(self):
        """Start the trading bot"""
        logger.info("Starting XAU/USD AI Trading Bot...")
        logger.info(f"Analysis interval: {self.analysis_interval} seconds")
        logger.info(f"Status update interval: {self.status_update_interval} seconds")
        
        # Test connections
        logger.info("Testing connections...")
        if not self._test_connections():
            logger.error("Connection tests failed. Please check configuration.")
            return
        
        # Send startup message
        await self.telegram.send_status({
            'current_price': 0,
            'timestamp': datetime.now().isoformat(),
            'message': '🚀 XAU/USD AI Trading Bot started successfully!'
        })
        
        self.running = True
        logger.info("Bot is now running. Press Ctrl+C to stop.")
        
        try:
            await self._run_loop()
        except KeyboardInterrupt:
            logger.info("Received shutdown signal")
        except Exception as e:
            logger.error(f"Critical error: {e}")
            await self.telegram.send_error(f"Bot crashed: {str(e)}")
        finally:
            await self.stop()
    
    async def _run_loop(self):
        """Main execution loop"""
        while self.running:
            try:
                await self._execute_analysis_cycle()
                
                # Send periodic status updates
                current_time = time.time()
                if current_time - self.last_status_update >= self.status_update_interval:
                    await self._send_status_update()
                    self.last_status_update = current_time
                
                # Wait before next cycle
                logger.info(f"Waiting {self.analysis_interval} seconds until next analysis...")
                await asyncio.sleep(self.analysis_interval)
                
            except Exception as e:
                logger.error(f"Error in analysis cycle: {e}")
                await asyncio.sleep(60)  # Wait 1 minute before retrying
    
    async def _execute_analysis_cycle(self):
        """Execute one analysis cycle"""
        logger.info("=" * 50)
        logger.info("Starting market analysis cycle...")
        
        # Fetch current price
        current_price_data = self.market_data.get_current_price()
        if not current_price_data:
            logger.warning("Primary data source failed, trying fallback...")
            current_price_data = self.fallback_data.get_current_price()
        
        if not current_price_data:
            logger.error("Failed to fetch current price from all sources")
            return
        
        logger.info(f"Current XAU/USD: ${current_price_data['price']:,.2f}")
        
        # Fetch historical data for analysis
        historical_data = self.market_data.get_historical_data(interval='1h', outputsize=100)
        
        if not historical_data:
            logger.error("Failed to fetch historical data")
            return
        
        logger.info(f"Retrieved {len(historical_data)} historical data points")
        
        # Perform AI analysis
        signal = self.ai_analyzer.analyze_market(historical_data)
        
        if signal:
            # Check if enough time has passed since last signal
            current_time = time.time()
            if current_time - self.last_signal_time >= self.min_signal_interval:
                logger.info(f"Generated {signal['signal']} signal with {signal['confidence']:.0%} confidence")
                
                # Send signal to Telegram
                success = await self.telegram.send_signal(signal)
                if success:
                    self.last_signal_time = current_time
                    logger.info("Signal sent successfully to Telegram")
                else:
                    logger.error("Failed to send signal to Telegram")
            else:
                time_remaining = self.min_signal_interval - (current_time - self.last_signal_time)
                logger.info(f"Signal suppressed. Wait {time_remaining/60:.1f} more minutes before next signal")
        else:
            logger.info("No high-confidence signal generated this cycle")
    
    async def _send_status_update(self):
        """Send periodic status update"""
        logger.info("Sending status update...")
        
        # Get historical data for summary
        historical_data = self.market_data.get_historical_data(interval='1h', outputsize=50)
        
        if historical_data:
            summary = self.ai_analyzer.get_market_summary(historical_data)
            if summary:
                await self.telegram.send_status(summary)
    
    def _test_connections(self) -> bool:
        """Test all connections before starting"""
        logger.info("Testing market data connection...")
        price_data = self.market_data.get_current_price()
        
        if not price_data:
            logger.warning("Primary market data source test failed, checking fallback...")
            price_data = self.fallback_data.get_current_price()
        
        if not price_data:
            logger.error("All market data sources failed")
            return False
        
        logger.info(f"✓ Market data: ${price_data['price']:,.2f}")
        
        # Note: Telegram test is commented out to avoid sending test messages
        # The connection will be verified on first actual message send
        logger.info("✓ Telegram bot configured")
        
        return True
    
    async def stop(self):
        """Stop the trading bot gracefully"""
        logger.info("Stopping trading bot...")
        self.running = False
        
        await self.telegram.send_status({
            'current_price': 0,
            'timestamp': datetime.now().isoformat(),
            'message': '🛑 XAU/USD AI Trading Bot stopped'
        })
        
        logger.info("Bot stopped successfully")


async def main():
    """Main entry point"""
    logger.info("=" * 50)
    logger.info("XAU/USD AI Trading Bot - Render Deployment")
    logger.info("=" * 50)
    
    # Check environment variables
    required_vars = ['TWELVE_DATA_API_KEY', 'TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
        logger.error("Please set these in Render environment variables")
        sys.exit(1)
    
    # Create and start bot
    bot = TradingBot()
    await bot.start()


if __name__ == '__main__':
    asyncio.run(main())

"""
Combined application runner
Runs both the trading bot and health server simultaneously
"""
import os
import asyncio
import logging
from threading import Thread

from main import TradingBot
from health_server import start_health_server

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def run_trading_bot():
    """Run the trading bot"""
    bot = TradingBot()
    await bot.start()


def main():
    """Main entry point - runs both services"""
    logger.info("Starting XAU/USD AI Trading Bot with Health Server")
    
    # Start health server in a separate thread
    health_thread = Thread(target=start_health_server, daemon=True)
    health_thread.start()
    logger.info("Health server started")
    
    # Run trading bot in main thread
    try:
        asyncio.run(run_trading_bot())
    except KeyboardInterrupt:
        logger.info("Received shutdown signal")
    except Exception as e:
        logger.error(f"Critical error: {e}")
        raise


if __name__ == '__main__':
    main()

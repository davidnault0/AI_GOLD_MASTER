"""
Main application for autonomous gold analysis AI
Continuously monitors gold markets and sends signals via Telegram
"""
import asyncio
from datetime import datetime
from typing import Optional
from aiohttp import web

from config import Config
from telegram_service import TelegramService
from market_data_service import MarketDataService
from analysis_engine import GoldAnalysisEngine

class GoldAnalysisBot:
    """Main bot class that orchestrates the autonomous analysis"""
    
    def __init__(self):
        self.config = Config()
        self.telegram = TelegramService()
        self.market_data = MarketDataService()
        self.analysis_engine = GoldAnalysisEngine()
        self.is_running = False
        self.last_signal_type = None
        
    async def initialize(self):
        """Initialize the bot and verify connections"""
        print("=" * 60)
        print("🚀 Starting Gold Analysis AI Bot")
        print("=" * 60)
        
        # Validate configuration
        config_valid = Config.validate()
        if config_valid:
            print("✅ Configuration validated successfully")
        else:
            print("⚠️ Running with limited configuration")
        
        # Test Telegram connection
        if Config.TELEGRAM_BOT_TOKEN and Config.TELEGRAM_CHAT_ID:
            telegram_ok = await self.telegram.test_connection()
            if telegram_ok:
                print("✅ Telegram connection successful")
            else:
                print("❌ Telegram connection failed")
        else:
            print("⚠️ Telegram not configured - signals will be printed to console")
        
        # Test market data
        price = await self.market_data.fetch_current_price()
        if price:
            print(f"✅ Market data connection successful - Current gold price: ${price:.2f}")
        else:
            print("⚠️ Market data connection issues - will retry")
        
        print("=" * 60)
    
    async def run_analysis_cycle(self):
        """Run a single analysis cycle"""
        try:
            # Fetch current price
            current_price = await self.market_data.fetch_current_price()
            
            if current_price is None:
                print("⚠️ Unable to fetch current price, skipping cycle")
                return
            
            print(f"\n📊 Current Gold Price: ${current_price:.2f}")
            
            # Perform analysis
            analysis_result = await self.analysis_engine.analyze(current_price)
            
            print(f"🤖 Analysis Result: {analysis_result['signal_type']} "
                  f"(Confidence: {analysis_result['confidence']*100:.1f}%)")
            
            # Check if we should send a signal
            should_send = False
            
            # Send signal if confidence is above threshold
            if analysis_result['confidence'] >= Config.CONFIDENCE_THRESHOLD:
                # Send if signal type changed or it's a strong signal
                if (analysis_result['signal_type'] != self.last_signal_type or 
                    analysis_result['confidence'] > 0.85):
                    should_send = True
            
            if should_send:
                print(f"📢 Sending {analysis_result['signal_type']} signal to Telegram...")
                success = await self.telegram.send_signal(analysis_result)
                if success:
                    print("✅ Signal sent successfully")
                    self.last_signal_type = analysis_result['signal_type']
                else:
                    print("❌ Failed to send signal")
            else:
                print("ℹ️ Signal not sent (confidence too low or no change)")
            
            # Print key indicators
            print("\n📈 Key Indicators:")
            for key, value in analysis_result['indicators'].items():
                if isinstance(value, (int, float)):
                    print(f"  • {key}: {value:.2f}")
                else:
                    print(f"  • {key}: {value}")
            
        except Exception as e:
            print(f"❌ Error in analysis cycle: {e}")
            import traceback
            traceback.print_exc()
    
    async def run_continuous(self):
        """Run the bot continuously"""
        self.is_running = True
        
        # Send startup notification
        await self.telegram.send_status_update(
            "🟢 Gold Analysis AI Started",
            f"Monitoring gold markets every {Config.ANALYSIS_INTERVAL_SECONDS} seconds"
        )
        
        cycle_count = 0
        
        while self.is_running:
            try:
                cycle_count += 1
                print(f"\n{'='*60}")
                print(f"🔄 Analysis Cycle #{cycle_count} - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
                print(f"{'='*60}")
                
                await self.run_analysis_cycle()
                
                # Wait for next cycle
                print(f"\n⏳ Waiting {Config.ANALYSIS_INTERVAL_SECONDS} seconds until next cycle...")
                await asyncio.sleep(Config.ANALYSIS_INTERVAL_SECONDS)
                
            except asyncio.CancelledError:
                print("\n🛑 Bot stopped by user")
                break
            except Exception as e:
                print(f"❌ Unexpected error: {e}")
                import traceback
                traceback.print_exc()
                # Wait a bit before retrying
                await asyncio.sleep(60)
    
    async def stop(self):
        """Stop the bot gracefully"""
        self.is_running = False
        await self.telegram.send_status_update(
            "🔴 Gold Analysis AI Stopped",
            "Bot has been shut down"
        )

# Web server for health checks (required for Render)
class HealthCheckServer:
    """Simple HTTP server for health checks"""
    
    def __init__(self, bot: GoldAnalysisBot):
        self.bot = bot
        self.app = web.Application()
        self.app.router.add_get('/', self.handle_root)
        self.app.router.add_get('/health', self.handle_health)
        self.app.router.add_get('/status', self.handle_status)
    
    async def handle_root(self, request):
        """Handle root endpoint"""
        return web.Response(text="Gold Analysis AI Bot - Running ✅")
    
    async def handle_health(self, request):
        """Handle health check endpoint"""
        return web.json_response({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'bot_running': self.bot.is_running
        })
    
    async def handle_status(self, request):
        """Handle status endpoint"""
        return web.json_response({
            'status': 'operational',
            'bot_running': self.bot.is_running,
            'timestamp': datetime.now().isoformat(),
            'config': {
                'analysis_interval': Config.ANALYSIS_INTERVAL_SECONDS,
                'confidence_threshold': Config.CONFIDENCE_THRESHOLD,
                'telegram_configured': bool(Config.TELEGRAM_BOT_TOKEN),
            }
        })
    
    async def start(self):
        """Start the web server"""
        runner = web.AppRunner(self.app)
        await runner.setup()
        site = web.TCPSite(runner, Config.HOST, Config.PORT)
        await site.start()
        print(f"🌐 Health check server running on http://{Config.HOST}:{Config.PORT}")

async def main():
    """Main entry point"""
    # Create bot instance
    bot = GoldAnalysisBot()
    
    # Initialize
    await bot.initialize()
    
    # Start health check server
    health_server = HealthCheckServer(bot)
    await health_server.start()
    
    # Run bot
    try:
        await bot.run_continuous()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down gracefully...")
        await bot.stop()

if __name__ == "__main__":
    asyncio.run(main())

"""
Telegram Bot for sending XAU/USD trading signals
"""
import os
import logging
import asyncio
from typing import Dict, Optional
from telegram import Bot
from telegram.error import TelegramError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TelegramNotifier:
    """Sends trading signals to Telegram"""
    
    def __init__(self):
        self.bot_token = os.getenv('TELEGRAM_BOT_TOKEN', '')
        self.chat_id = os.getenv('TELEGRAM_CHAT_ID', '')
        self.bot = None
        
        if self.bot_token:
            self.bot = Bot(token=self.bot_token)
        else:
            logger.warning("Telegram bot token not configured")
    
    async def send_signal(self, signal: Dict) -> bool:
        """
        Send trading signal to Telegram
        
        Args:
            signal: Trading signal dictionary
            
        Returns:
            True if sent successfully
        """
        if not self.bot or not self.chat_id:
            logger.error("Telegram bot not configured properly")
            return False
        
        try:
            message = self._format_signal_message(signal)
            await self.bot.send_message(
                chat_id=self.chat_id,
                text=message,
                parse_mode='HTML'
            )
            logger.info(f"Signal sent to Telegram: {signal['signal']}")
            return True
            
        except TelegramError as e:
            logger.error(f"Error sending Telegram message: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return False
    
    async def send_status(self, status: Dict) -> bool:
        """
        Send status update to Telegram
        
        Args:
            status: Status dictionary
            
        Returns:
            True if sent successfully
        """
        if not self.bot or not self.chat_id:
            logger.error("Telegram bot not configured properly")
            return False
        
        try:
            message = self._format_status_message(status)
            await self.bot.send_message(
                chat_id=self.chat_id,
                text=message,
                parse_mode='HTML'
            )
            logger.info("Status update sent to Telegram")
            return True
            
        except TelegramError as e:
            logger.error(f"Error sending status: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return False
    
    async def send_error(self, error_msg: str) -> bool:
        """Send error notification to Telegram"""
        if not self.bot or not self.chat_id:
            return False
        
        try:
            message = f"⚠️ <b>Error Alert</b>\n\n{error_msg}"
            await self.bot.send_message(
                chat_id=self.chat_id,
                text=message,
                parse_mode='HTML'
            )
            return True
        except Exception as e:
            logger.error(f"Error sending error notification: {e}")
            return False
    
    def _format_signal_message(self, signal: Dict) -> str:
        """Format trading signal as HTML message"""
        signal_emoji = {
            'BUY': '🟢',
            'SELL': '🔴',
            'NEUTRAL': '⚪'
        }
        
        emoji = signal_emoji.get(signal['signal'], '⚪')
        
        message = f"{emoji} <b>XAU/USD Trading Signal</b> {emoji}\n\n"
        message += f"<b>Signal:</b> {signal['signal']}\n"
        message += f"<b>Confidence:</b> {signal['confidence']:.0%}\n"
        message += f"<b>Current Price:</b> ${signal['current_price']:,.2f}\n"
        message += f"<b>Timestamp:</b> {signal['timestamp']}\n\n"
        
        # Technical levels
        message += "<b>📊 Trading Levels:</b>\n"
        message += f"• Stop Loss: ${signal['levels']['stop_loss']:,.2f}\n"
        message += f"• Take Profit: ${signal['levels']['take_profit']:,.2f}\n"
        message += f"• Support: ${signal['levels']['support']:,.2f}\n"
        message += f"• Resistance: ${signal['levels']['resistance']:,.2f}\n\n"
        
        # Technical indicators
        indicators = signal['indicators']
        message += "<b>📈 Indicators:</b>\n"
        if indicators.get('rsi'):
            message += f"• RSI: {indicators['rsi']:.2f}\n"
        if indicators.get('sma_20'):
            message += f"• SMA(20): ${indicators['sma_20']:,.2f}\n"
        if indicators.get('ema_12'):
            message += f"• EMA(12): ${indicators['ema_12']:,.2f}\n"
        if indicators.get('macd'):
            macd = indicators['macd']
            message += f"• MACD: {macd['macd']:.2f} / Signal: {macd['signal']:.2f}\n"
        
        # Analysis reasons
        if signal.get('reasons'):
            message += f"\n<b>💡 Analysis:</b>\n"
            for reason in signal['reasons'][:5]:  # Limit to top 5 reasons
                message += f"• {reason}\n"
        
        message += f"\n<i>Scores: Buy {signal['buy_score']:.1f} | Sell {signal['sell_score']:.1f}</i>"
        
        return message
    
    def _format_status_message(self, status: Dict) -> str:
        """Format status update as HTML message"""
        message = "📊 <b>XAU/USD Market Status</b>\n\n"
        message += f"<b>Current Price:</b> ${status.get('current_price', 0):,.2f}\n"
        
        if 'price_change_pct' in status:
            change = status['price_change_pct']
            change_emoji = '📈' if change > 0 else '📉' if change < 0 else '➡️'
            message += f"<b>Change:</b> {change_emoji} {change:+.2f}%\n"
        
        if 'rsi' in status and status['rsi']:
            message += f"<b>RSI:</b> {status['rsi']:.2f}\n"
        
        if 'sma_20' in status and status['sma_20']:
            message += f"<b>SMA(20):</b> ${status['sma_20']:,.2f}\n"
        
        message += f"\n<i>Updated: {status.get('timestamp', 'N/A')}</i>"
        
        return message
    
    def test_connection(self) -> bool:
        """Test Telegram bot connection"""
        if not self.bot or not self.chat_id:
            logger.error("Telegram bot not configured")
            return False
        
        try:
            async def _test():
                await self.bot.send_message(
                    chat_id=self.chat_id,
                    text="✅ XAU/USD AI Bot connected successfully!"
                )
            
            asyncio.run(_test())
            logger.info("Telegram connection test successful")
            return True
            
        except Exception as e:
            logger.error(f"Telegram connection test failed: {e}")
            return False

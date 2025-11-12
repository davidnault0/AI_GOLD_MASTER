"""
Telegram Bot Service for sending trading signals
"""
import asyncio
import aiohttp
from typing import Optional, Dict, Any
from datetime import datetime
from config import Config

class TelegramService:
    """Service for sending messages and signals via Telegram"""
    
    def __init__(self):
        self.bot_token = Config.TELEGRAM_BOT_TOKEN
        self.chat_id = Config.TELEGRAM_CHAT_ID
        self.base_url = f"https://api.telegram.org/bot{self.bot_token}"
        
    async def send_message(self, message: str, parse_mode: str = 'HTML') -> bool:
        """
        Send a message to the configured Telegram chat
        
        Args:
            message: The message text to send
            parse_mode: Message formatting mode (HTML or Markdown)
            
        Returns:
            True if message was sent successfully, False otherwise
        """
        if not self.bot_token or not self.chat_id:
            print("Telegram not configured. Message:", message)
            return False
            
        url = f"{self.base_url}/sendMessage"
        payload = {
            'chat_id': self.chat_id,
            'text': message,
            'parse_mode': parse_mode
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload) as response:
                    if response.status == 200:
                        print(f"Message sent successfully: {message[:50]}...")
                        return True
                    else:
                        error_text = await response.text()
                        print(f"Failed to send message. Status: {response.status}, Error: {error_text}")
                        return False
        except Exception as e:
            print(f"Error sending Telegram message: {e}")
            return False
    
    async def send_signal(self, signal_data: Dict[str, Any]) -> bool:
        """
        Send a formatted trading signal to Telegram
        
        Args:
            signal_data: Dictionary containing signal information
                - signal_type: 'BUY', 'SELL', or 'HOLD'
                - confidence: float 0-1
                - price: current gold price
                - analysis: analysis text
                - indicators: dict of technical indicators
                
        Returns:
            True if signal was sent successfully
        """
        signal_type = signal_data.get('signal_type', 'UNKNOWN')
        confidence = signal_data.get('confidence', 0.0)
        price = signal_data.get('price', 0.0)
        analysis = signal_data.get('analysis', 'No analysis available')
        indicators = signal_data.get('indicators', {})
        
        # Determine emoji based on signal type
        emoji = {
            'BUY': '🟢📈',
            'SELL': '🔴📉',
            'HOLD': '🟡⏸️'
        }.get(signal_type, '⚪')
        
        # Format message
        message = f"""
{emoji} <b>GOLD TRADING SIGNAL</b> {emoji}

<b>Signal:</b> {signal_type}
<b>Confidence:</b> {confidence*100:.1f}%
<b>Current Price:</b> ${price:.2f}
<b>Time:</b> {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}

<b>Analysis:</b>
{analysis}

<b>Technical Indicators:</b>
"""
        
        # Add indicators if available
        for key, value in indicators.items():
            if isinstance(value, (int, float)):
                message += f"• {key}: {value:.2f}\n"
            else:
                message += f"• {key}: {value}\n"
        
        message += f"\n⚠️ <i>Automated signal - Always do your own research!</i>"
        
        return await self.send_message(message)
    
    async def send_status_update(self, status: str, details: str = "") -> bool:
        """
        Send a status update message
        
        Args:
            status: Status message
            details: Additional details
            
        Returns:
            True if message was sent successfully
        """
        message = f"ℹ️ <b>System Status Update</b>\n\n{status}"
        if details:
            message += f"\n\n{details}"
        
        return await self.send_message(message)
    
    async def test_connection(self) -> bool:
        """Test the Telegram bot connection"""
        try:
            return await self.send_message("✅ Gold Analysis AI is online and monitoring markets!")
        except Exception as e:
            print(f"Telegram connection test failed: {e}")
            return False

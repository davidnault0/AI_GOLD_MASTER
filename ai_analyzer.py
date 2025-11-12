"""
AI Analysis Engine for XAU/USD
Analyzes market data and generates trading signals
"""
import logging
from typing import Dict, List, Optional, Tuple
import pandas as pd
import numpy as np
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TechnicalAnalyzer:
    """Performs technical analysis on XAU/USD data"""
    
    def __init__(self):
        self.min_data_points = 50
        
    def calculate_sma(self, data: List[float], period: int) -> Optional[float]:
        """Calculate Simple Moving Average"""
        if len(data) < period:
            return None
        return sum(data[-period:]) / period
    
    def calculate_ema(self, data: List[float], period: int) -> Optional[float]:
        """Calculate Exponential Moving Average"""
        if len(data) < period:
            return None
        
        df = pd.DataFrame({'close': data})
        ema = df['close'].ewm(span=period, adjust=False).mean()
        return float(ema.iloc[-1])
    
    def calculate_rsi(self, data: List[float], period: int = 14) -> Optional[float]:
        """Calculate Relative Strength Index"""
        if len(data) < period + 1:
            return None
        
        deltas = np.diff(data)
        gains = np.where(deltas > 0, deltas, 0)
        losses = np.where(deltas < 0, -deltas, 0)
        
        avg_gain = np.mean(gains[-period:])
        avg_loss = np.mean(losses[-period:])
        
        if avg_loss == 0:
            return 100.0
        
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        return float(rsi)
    
    def calculate_macd(self, data: List[float]) -> Optional[Dict]:
        """
        Calculate MACD (Moving Average Convergence Divergence)
        Returns: Dict with macd, signal, and histogram
        """
        if len(data) < 26:
            return None
        
        df = pd.DataFrame({'close': data})
        
        # Calculate EMAs
        ema_12 = df['close'].ewm(span=12, adjust=False).mean()
        ema_26 = df['close'].ewm(span=26, adjust=False).mean()
        
        # MACD line
        macd_line = ema_12 - ema_26
        
        # Signal line (9-day EMA of MACD)
        signal_line = macd_line.ewm(span=9, adjust=False).mean()
        
        # Histogram
        histogram = macd_line - signal_line
        
        return {
            'macd': float(macd_line.iloc[-1]),
            'signal': float(signal_line.iloc[-1]),
            'histogram': float(histogram.iloc[-1])
        }
    
    def calculate_bollinger_bands(self, data: List[float], period: int = 20, std_dev: int = 2) -> Optional[Dict]:
        """Calculate Bollinger Bands"""
        if len(data) < period:
            return None
        
        df = pd.DataFrame({'close': data})
        sma = df['close'].rolling(window=period).mean()
        std = df['close'].rolling(window=period).std()
        
        upper_band = sma + (std * std_dev)
        lower_band = sma - (std * std_dev)
        
        return {
            'upper': float(upper_band.iloc[-1]),
            'middle': float(sma.iloc[-1]),
            'lower': float(lower_band.iloc[-1])
        }
    
    def calculate_atr(self, high: List[float], low: List[float], close: List[float], period: int = 14) -> Optional[float]:
        """Calculate Average True Range (volatility indicator)"""
        if len(high) < period or len(low) < period or len(close) < period:
            return None
        
        tr_list = []
        for i in range(1, len(close)):
            tr = max(
                high[i] - low[i],
                abs(high[i] - close[i-1]),
                abs(low[i] - close[i-1])
            )
            tr_list.append(tr)
        
        if len(tr_list) < period:
            return None
        
        atr = sum(tr_list[-period:]) / period
        return float(atr)


class AISignalGenerator:
    """
    AI-powered signal generator for XAU/USD trading
    Combines multiple indicators to generate buy/sell signals
    """
    
    def __init__(self):
        self.analyzer = TechnicalAnalyzer()
        self.last_signal = None
        self.signal_confidence_threshold = 0.6
        
    def analyze_market(self, historical_data: List[Dict]) -> Optional[Dict]:
        """
        Analyze market data and generate trading signal
        
        Args:
            historical_data: List of OHLCV data points
            
        Returns:
            Dict with signal, confidence, reasoning, and technical levels
        """
        if not historical_data or len(historical_data) < 50:
            logger.warning("Insufficient data for analysis")
            return None
        
        try:
            # Extract price arrays
            closes = [d['close'] for d in historical_data]
            highs = [d['high'] for d in historical_data]
            lows = [d['low'] for d in historical_data]
            
            current_price = closes[-1]
            
            # Calculate technical indicators
            sma_20 = self.analyzer.calculate_sma(closes, 20)
            sma_50 = self.analyzer.calculate_sma(closes, 50)
            ema_12 = self.analyzer.calculate_ema(closes, 12)
            rsi = self.analyzer.calculate_rsi(closes)
            macd = self.analyzer.calculate_macd(closes)
            bollinger = self.analyzer.calculate_bollinger_bands(closes)
            atr = self.analyzer.calculate_atr(highs, lows, closes)
            
            # Initialize signal scoring
            buy_score = 0
            sell_score = 0
            reasons = []
            
            # Trend Analysis (SMA crossover)
            if sma_20 and sma_50:
                if sma_20 > sma_50:
                    buy_score += 1
                    reasons.append("Bullish trend: SMA(20) > SMA(50)")
                else:
                    sell_score += 1
                    reasons.append("Bearish trend: SMA(20) < SMA(50)")
            
            # Price vs Moving Averages
            if ema_12:
                if current_price > ema_12:
                    buy_score += 0.5
                    reasons.append("Price above EMA(12)")
                else:
                    sell_score += 0.5
                    reasons.append("Price below EMA(12)")
            
            # RSI Analysis
            if rsi:
                if rsi < 30:
                    buy_score += 1.5
                    reasons.append(f"RSI oversold: {rsi:.2f}")
                elif rsi > 70:
                    sell_score += 1.5
                    reasons.append(f"RSI overbought: {rsi:.2f}")
                elif 40 <= rsi <= 60:
                    reasons.append(f"RSI neutral: {rsi:.2f}")
            
            # MACD Analysis
            if macd:
                if macd['macd'] > macd['signal'] and macd['histogram'] > 0:
                    buy_score += 1
                    reasons.append("MACD bullish crossover")
                elif macd['macd'] < macd['signal'] and macd['histogram'] < 0:
                    sell_score += 1
                    reasons.append("MACD bearish crossover")
            
            # Bollinger Bands Analysis
            if bollinger:
                if current_price <= bollinger['lower']:
                    buy_score += 1
                    reasons.append("Price at lower Bollinger Band (oversold)")
                elif current_price >= bollinger['upper']:
                    sell_score += 1
                    reasons.append("Price at upper Bollinger Band (overbought)")
            
            # Determine signal
            total_score = buy_score + sell_score
            if total_score == 0:
                signal_type = "NEUTRAL"
                confidence = 0.0
            elif buy_score > sell_score:
                signal_type = "BUY"
                confidence = buy_score / (buy_score + sell_score)
            elif sell_score > buy_score:
                signal_type = "SELL"
                confidence = sell_score / (buy_score + sell_score)
            else:
                signal_type = "NEUTRAL"
                confidence = 0.0
            
            # Calculate support and resistance levels
            recent_lows = sorted(lows[-20:])
            recent_highs = sorted(highs[-20:], reverse=True)
            support = recent_lows[0] if recent_lows else current_price * 0.98
            resistance = recent_highs[0] if recent_highs else current_price * 1.02
            
            # Calculate stop loss and take profit
            if atr:
                stop_loss = current_price - (2 * atr) if signal_type == "BUY" else current_price + (2 * atr)
                take_profit = current_price + (3 * atr) if signal_type == "BUY" else current_price - (3 * atr)
            else:
                stop_loss = support if signal_type == "BUY" else resistance
                take_profit = resistance if signal_type == "BUY" else support
            
            signal = {
                'signal': signal_type,
                'confidence': round(confidence, 2),
                'current_price': round(current_price, 2),
                'timestamp': datetime.now().isoformat(),
                'indicators': {
                    'sma_20': round(sma_20, 2) if sma_20 else None,
                    'sma_50': round(sma_50, 2) if sma_50 else None,
                    'ema_12': round(ema_12, 2) if ema_12 else None,
                    'rsi': round(rsi, 2) if rsi else None,
                    'macd': macd,
                    'bollinger': bollinger,
                    'atr': round(atr, 2) if atr else None
                },
                'levels': {
                    'support': round(support, 2),
                    'resistance': round(resistance, 2),
                    'stop_loss': round(stop_loss, 2),
                    'take_profit': round(take_profit, 2)
                },
                'reasons': reasons,
                'buy_score': round(buy_score, 2),
                'sell_score': round(sell_score, 2)
            }
            
            # Only return signals above confidence threshold
            if confidence >= self.signal_confidence_threshold:
                logger.info(f"Generated {signal_type} signal with {confidence:.2%} confidence")
                self.last_signal = signal
                return signal
            else:
                logger.info(f"Signal confidence {confidence:.2%} below threshold, no signal generated")
                return None
            
        except Exception as e:
            logger.error(f"Error in market analysis: {e}")
            return None
    
    def get_market_summary(self, historical_data: List[Dict]) -> Optional[Dict]:
        """
        Get a comprehensive market summary without generating a signal
        Useful for status updates
        """
        if not historical_data or len(historical_data) < 20:
            return None
        
        try:
            closes = [d['close'] for d in historical_data]
            current_price = closes[-1]
            
            # Calculate basic indicators
            sma_20 = self.analyzer.calculate_sma(closes, 20)
            rsi = self.analyzer.calculate_rsi(closes)
            
            # Price change
            price_change = ((current_price - closes[0]) / closes[0]) * 100
            
            summary = {
                'current_price': round(current_price, 2),
                'price_change_pct': round(price_change, 2),
                'sma_20': round(sma_20, 2) if sma_20 else None,
                'rsi': round(rsi, 2) if rsi else None,
                'timestamp': datetime.now().isoformat()
            }
            
            return summary
            
        except Exception as e:
            logger.error(f"Error generating market summary: {e}")
            return None

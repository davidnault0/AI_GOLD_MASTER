"""
AI Analysis Engine for gold market analysis using multiple strategies
"""
import asyncio
from typing import Dict, Any, List, Optional
from datetime import datetime
import statistics

class GoldAnalysisEngine:
    """
    AI-powered analysis engine for gold market
    Uses multiple analysis strategies to generate trading signals
    """
    
    def __init__(self):
        self.price_history: List[float] = []
        self.max_history_size = 100
        
    def add_price_data(self, price: float):
        """Add new price data to history"""
        self.price_history.append(price)
        if len(self.price_history) > self.max_history_size:
            self.price_history.pop(0)
    
    def calculate_sma(self, period: int) -> Optional[float]:
        """Calculate Simple Moving Average"""
        if len(self.price_history) < period:
            return None
        return statistics.mean(self.price_history[-period:])
    
    def calculate_ema(self, period: int) -> Optional[float]:
        """Calculate Exponential Moving Average"""
        if len(self.price_history) < period:
            return None
        
        multiplier = 2 / (period + 1)
        ema = self.price_history[-period]
        
        for price in self.price_history[-period+1:]:
            ema = (price * multiplier) + (ema * (1 - multiplier))
        
        return ema
    
    def calculate_rsi(self, period: int = 14) -> Optional[float]:
        """Calculate Relative Strength Index"""
        if len(self.price_history) < period + 1:
            return None
        
        gains = []
        losses = []
        
        for i in range(-period, 0):
            change = self.price_history[i] - self.price_history[i-1]
            if change > 0:
                gains.append(change)
                losses.append(0)
            else:
                gains.append(0)
                losses.append(abs(change))
        
        avg_gain = statistics.mean(gains) if gains else 0
        avg_loss = statistics.mean(losses) if losses else 0
        
        if avg_loss == 0:
            return 100
        
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        
        return rsi
    
    def calculate_volatility(self, period: int = 20) -> Optional[float]:
        """Calculate price volatility (standard deviation)"""
        if len(self.price_history) < period:
            return None
        
        recent_prices = self.price_history[-period:]
        return statistics.stdev(recent_prices) if len(recent_prices) > 1 else 0
    
    def detect_trend(self) -> str:
        """
        Detect current price trend
        Returns: 'UPTREND', 'DOWNTREND', or 'SIDEWAYS'
        """
        if len(self.price_history) < 10:
            return 'UNKNOWN'
        
        short_sma = self.calculate_sma(5)
        long_sma = self.calculate_sma(10)
        
        if short_sma is None or long_sma is None:
            return 'UNKNOWN'
        
        difference_pct = ((short_sma - long_sma) / long_sma) * 100
        
        if difference_pct > 0.5:
            return 'UPTREND'
        elif difference_pct < -0.5:
            return 'DOWNTREND'
        else:
            return 'SIDEWAYS'
    
    def detect_support_resistance(self) -> Dict[str, Optional[float]]:
        """
        Detect support and resistance levels
        Returns dictionary with support and resistance prices
        """
        if len(self.price_history) < 20:
            return {'support': None, 'resistance': None}
        
        recent_prices = self.price_history[-20:]
        support = min(recent_prices)
        resistance = max(recent_prices)
        
        return {
            'support': support,
            'resistance': resistance
        }
    
    async def analyze(self, current_price: float) -> Dict[str, Any]:
        """
        Perform comprehensive analysis on current market data
        
        Args:
            current_price: Current gold price
            
        Returns:
            Analysis results with signal, confidence, and indicators
        """
        # Add price to history
        self.add_price_data(current_price)
        
        # Calculate technical indicators
        sma_20 = self.calculate_sma(20)
        sma_50 = self.calculate_sma(50)
        ema_12 = self.calculate_ema(12)
        ema_26 = self.calculate_ema(26)
        rsi = self.calculate_rsi(14)
        volatility = self.calculate_volatility(20)
        trend = self.detect_trend()
        levels = self.detect_support_resistance()
        
        # Initialize scoring system
        buy_signals = 0
        sell_signals = 0
        total_signals = 0
        
        analysis_details = []
        
        # RSI Analysis
        if rsi is not None:
            total_signals += 1
            if rsi < 30:
                buy_signals += 1
                analysis_details.append(f"RSI oversold at {rsi:.1f} (< 30)")
            elif rsi > 70:
                sell_signals += 1
                analysis_details.append(f"RSI overbought at {rsi:.1f} (> 70)")
            else:
                analysis_details.append(f"RSI neutral at {rsi:.1f}")
        
        # Moving Average Crossover
        if sma_20 is not None and sma_50 is not None:
            total_signals += 1
            if sma_20 > sma_50:
                buy_signals += 1
                analysis_details.append("SMA20 > SMA50 (Bullish crossover)")
            else:
                sell_signals += 1
                analysis_details.append("SMA20 < SMA50 (Bearish crossover)")
        
        # Price vs EMA
        if ema_26 is not None:
            total_signals += 1
            if current_price > ema_26:
                buy_signals += 1
                analysis_details.append(f"Price above EMA26 (${ema_26:.2f})")
            else:
                sell_signals += 1
                analysis_details.append(f"Price below EMA26 (${ema_26:.2f})")
        
        # Trend Analysis
        total_signals += 1
        if trend == 'UPTREND':
            buy_signals += 1
            analysis_details.append("Trend: Uptrend detected")
        elif trend == 'DOWNTREND':
            sell_signals += 1
            analysis_details.append("Trend: Downtrend detected")
        else:
            analysis_details.append("Trend: Sideways/Consolidation")
        
        # Support/Resistance
        if levels['support'] and levels['resistance']:
            total_signals += 1
            price_position = (current_price - levels['support']) / (levels['resistance'] - levels['support'])
            if price_position < 0.3:
                buy_signals += 1
                analysis_details.append(f"Price near support level (${levels['support']:.2f})")
            elif price_position > 0.7:
                sell_signals += 1
                analysis_details.append(f"Price near resistance level (${levels['resistance']:.2f})")
        
        # Determine signal and confidence
        if total_signals == 0:
            signal = 'HOLD'
            confidence = 0.5
        else:
            buy_ratio = buy_signals / total_signals
            sell_ratio = sell_signals / total_signals
            
            if buy_ratio > 0.6:
                signal = 'BUY'
                confidence = buy_ratio
            elif sell_ratio > 0.6:
                signal = 'SELL'
                confidence = sell_ratio
            else:
                signal = 'HOLD'
                confidence = 1 - abs(buy_ratio - sell_ratio)
        
        # Compile indicators
        indicators = {
            'SMA_20': sma_20,
            'SMA_50': sma_50,
            'EMA_12': ema_12,
            'EMA_26': ema_26,
            'RSI': rsi,
            'Volatility': volatility,
            'Trend': trend,
            'Support': levels['support'],
            'Resistance': levels['resistance']
        }
        
        # Remove None values
        indicators = {k: v for k, v in indicators.items() if v is not None}
        
        return {
            'signal_type': signal,
            'confidence': confidence,
            'price': current_price,
            'analysis': '\n'.join(analysis_details),
            'indicators': indicators,
            'timestamp': datetime.now().isoformat()
        }

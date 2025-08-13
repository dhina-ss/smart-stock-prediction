from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import yfinance as yf
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error
from collections import Counter
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


analyzer = SentimentIntensityAnalyzer()

class StockMLPredictionView(APIView):
    """
    Handles fetching stock data, forecasting trends, analyzing news sentiment,
    and generating a final BUY/HOLD/SELL recommendation.
    """

    # --------------------------
    # Data Retrieval
    # --------------------------
    def fetch_historical_data(self, symbol):
        """Fetch last 1 year of historical stock prices for the given symbol."""
        try:
            ticker = yf.Ticker(symbol)
            df = ticker.history(period="1y")

            if df.empty:
                raise ValueError(
                    f"No historical data found for symbol '{symbol}'. "
                    "Please check if the symbol is correct or available on Yahoo Finance."
                )

            df.reset_index(inplace=True)
            df['day'] = range(len(df))
            return df
        except Exception as e:
            raise ValueError(str(e))

    def fetch_news_sentiments(self, symbol):
        """Fetch latest news for the symbol and return a list of sentiment labels."""
        ticker = yf.Ticker(symbol)
        news_items = ticker.news

        sentiments = []
        for item in news_items:
            content = item.get('content', {})
            title = content.get('title')
            summary = content.get('summary')

            if not title or not summary:
                continue

            combined_text = f"{title} {summary}"
            sentiments.append(self.analyze_sentiment_vader(combined_text))

        return sentiments

    # --------------------------
    # Forecasting
    # --------------------------
    def forecast_prices_with_accuracy(self, df, days=7):
        """Train model, calculate accuracy, and forecast future prices."""
        split_idx = int(len(df) * 0.8)
        train = df.iloc[:split_idx]
        test = df.iloc[split_idx:]

        model = LinearRegression()
        model.fit(train[['day']], train['Close'])

        test_preds = model.predict(test[['day']])
        mae = mean_absolute_error(test['Close'], test_preds)
        rmse = np.sqrt(mean_squared_error(test['Close'], test_preds))

        future_days = np.arange(len(df), len(df) + days).reshape(-1, 1)
        future_preds = model.predict(future_days)

        return future_preds, mae, rmse

    def detect_trend_direction(self, predictions):
        """Determine if forecast indicates Uptrend, Downtrend, or No Change."""
        if predictions[-1] > predictions[0]:
            return "Uptrend"
        elif predictions[-1] < predictions[0]:
            return "Downtrend"
        return "No Change"

    # --------------------------
    # Sentiment Analysis
    # --------------------------
    def analyze_sentiment_vader(self, text):
        """Analyze sentiment using VADER."""
        score = analyzer.polarity_scores(text)['compound']
        if score >= 0.05:
            return "Positive"
        elif score <= -0.05:
            return "Negative"
        return "Neutral"

    def compute_overall_sentiment(self, sentiments):
        """Aggregate a list of sentiments into a single overall sentiment."""
        counts = Counter(sentiments)
        if counts["Positive"] > counts["Negative"]:
            return "Positive"
        elif counts["Negative"] > counts["Positive"]:
            return "Negative"
        return "Neutral"

    # --------------------------
    # Decision Making
    # --------------------------
    def generate_final_recommendation(self, sentiment, trend):
        """Combine sentiment and trend to make a trading recommendation."""
        if sentiment == "Positive" and trend == "Uptrend":
            return "BUY"
        elif sentiment == "Negative" and trend == "Downtrend":
            return "SELL"
        return "HOLD"

    # --------------------------
    # API Endpoint
    # --------------------------
    def get(self, request, symbol):
        try:
            # 1. Get stock data & forecast
            stock_data = self.fetch_historical_data(symbol)
            predictions, mae, rmse = self.forecast_prices_with_accuracy(stock_data)
            trend = self.detect_trend_direction(predictions)

            # 2. Get sentiment from news
            sentiments = self.fetch_news_sentiments(symbol)
            overall_sentiment = self.compute_overall_sentiment(sentiments)

            # 3. Generate final recommendation
            decision = self.generate_final_recommendation(overall_sentiment, trend)

            response_data = {
                "symbol": symbol,
                "predictions": predictions.tolist(),
                "trend": trend,
                "mae": round(mae, 2),
                "rmse": round(rmse, 2),
                "overall_sentiment": overall_sentiment,
                "decision": decision
            }
            return Response(response_data, status=status.HTTP_200_OK)

        except ValueError as ve:
            return Response({"error": str(ve)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

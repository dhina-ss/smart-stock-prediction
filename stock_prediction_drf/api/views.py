from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from sklearn.linear_model import LinearRegression
from rest_framework.response import Response
from rest_framework.views import APIView
from transformers import pipeline
from rest_framework import status
from collections import Counter
import yfinance as yf
import numpy as np
import fitz


class StockMLPredictionView(APIView):

    vader = SentimentIntensityAnalyzer()
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

    def generate_final_recommendation(self, sentiment, trend):
        if sentiment == "Positive" and trend == "Uptrend":
            return "BUY"
        elif sentiment == "Negative" and trend == "Downtrend":
            return "SELL"
        return "HOLD"

    def analyze_sentiment_vader(self, text):
        score = self.vader.polarity_scores(text)["compound"]
        if score >= 0.05:
            return "Positive"
        elif score <= -0.05:
            return "Negative"
        return "Neutral"

    def generate_insights(self, news_data):

        sentiments = []
        combined_text = ""

        for item in news_data:
            title = item.get("title", "")
            summary = item.get("summary", "")

            if not title or not summary:
                continue

            text = f"{title} {summary}"
            sentiments.append(self.analyze_sentiment_vader(text))
            combined_text += f"{text}. "

        if combined_text.strip():
            summary_result = self.summarizer(
                combined_text, max_length=80, min_length=25, do_sample=False
            )
            insight_summary = summary_result[0]["summary_text"]
        else:
            insight_summary = "No news available for summarization."

        sentiment_counts = dict(Counter(sentiments))
        most_common_sentiment = max(sentiment_counts, key=sentiment_counts.get, default="Neutral")

        return {"summary": insight_summary, "overall_sentiment": most_common_sentiment}

    
    def get_news_from_yfinance(self, symbol):
        ticker = yf.Ticker(symbol)
        news_items = ticker.news
        results = []
        for item in news_items:
            content = item.get("content", {})
            if content:
                results.append({
                    "title": content.get("title"),
                    "summary": content.get("summary")
                })
        return results
    
    def extract_text_from_pdf(self, pdf_file):
        text = ""
        with fitz.open(stream=pdf_file.read(), filetype="pdf") as doc:
            for page in doc:
                text += page.get_text()
        return text

    def detect_trend_direction(self, predictions):
        if predictions[-1] > predictions[0]:
            return "Uptrend"
        elif predictions[-1] < predictions[0]:
            return "Downtrend"
        return "No Change"

    def forecast_prices_with_accuracy(self, df, days=7):
        split_idx = int(len(df) * 0.8)
        train = df.iloc[:split_idx]
        test = df.iloc[split_idx:]

        model = LinearRegression()
        model.fit(train[["day"]], train["Close"])

        future_days = np.arange(len(df), len(df) + days).reshape(-1, 1)
        future_preds = model.predict(future_days)

        return future_preds

    def fetch_historical_data(self, symbol):

        try:
            ticker = yf.Ticker(symbol)
            df = ticker.history(period="1y").reset_index()
            if df.empty:
                raise ValueError(
                    f"No historical data found for symbol '{symbol}'. "
                    "Please check if the symbol is correct or available on Yahoo Finance."
                )
            df["day"] = range(len(df))
            return df
        except Exception as e:
            raise ValueError(str(e))

    def post(self, request):
        try:
            symbol = request.data.get("symbol")
            pdf_file = request.FILES.get("pdf")

            print(symbol)
            print(pdf_file)

            stock_data = self.fetch_historical_data(symbol)
            predictions = self.forecast_prices_with_accuracy(stock_data)
            trend = self.detect_trend_direction(predictions)

            # Get news data
            if pdf_file:
                pdf_text = self.extract_text_from_pdf(pdf_file)
                news_data = [{"title": "From PDF", "summary": pdf_text}]
            else:
                if not symbol:
                    return Response({"error": "Symbol is required if no PDF uploaded"},
                                    status=status.HTTP_400_BAD_REQUEST)
                news_data = self.get_news_from_yfinance(symbol)

            insights = self.generate_insights(news_data)

            decision = self.generate_final_recommendation(
                insights["overall_sentiment"], trend
            )

            response_data = {
                "symbol": symbol,
                "historical_data": [
                    {"date": str(row["Date"].date()), "close": float(row["Close"])}
                    for _, row in stock_data.iterrows()
                ],
                "predictions": predictions.tolist(),
                "trend": trend,
                "insights": insights,
                "decision": decision,
            }
            return Response(response_data, status=status.HTTP_200_OK)

        except ValueError as ve:
            return Response({"error": str(ve)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


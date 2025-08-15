# 📈 Smart Stock Prediction

A full-stack application for predicting stock prices using machine learning (Prophet / Linear Regression) and generating AI-based sentiment analysis from news (via yFinance or uploaded PDFs).

---

## 🚀 Features

- **1-year historical stock price fetch** (via yFinance)
- **ML prediction** for next 7 days
- **Accuracy metrics** (MAE, RMSE)
- **AI analysis** of stock news (from yFinance or uploaded PDF)
- **Final Recommendation**: BUY / SELL / HOLD
- **Interactive Dashboard** (React + Tailwind)
- **Stock chart** showing historical + predicted data

---

## 📂 Project Structure

smart-stock-prediction/
│
├── backend/ (Django + DRF)
│ ├── stock_prediction_drf/
│ ├── api/
│ │ ├── views.py
│ │ ├── urls.py
│ │ └── ...
│ └── requirements.txt
│
├── frontend/ (React + Tailwind)
│ ├── src/
│ │ ├── components/
│ │ │ ├── SearchBar.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ ├── StockChart.jsx
│ │ │ └── Header.jsx
│ │ ├── App.jsx
│ │ └── index.css
│ └── package.json
│
└── README.md


---

## 🛠 Backend Setup (Django)

1️⃣ Create Virtual Environment
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows


2️⃣ Install Dependencies
pip install -r requirements.txt


3️⃣ Run Migrations
python manage.py migrate


4️ Start Server
python manage.py runserver

Backend runs at: http://127.0.0.1:8000/


🎨 Frontend Setup (React + Tailwind)

1️⃣ Install Dependencies
```bash
cd frontend
npm install


2️⃣ Start Frontend
```bash
npm run dev
Frontend runs at: http://localhost:5173/

🔄 API Endpoints

1️⃣ Predict Stock
POST /api/predict/


📥 Sample Input
PDF Upload Example (contains stock news titles):

Infosys announces nCino platform implementation for ABN AMRO
Amazon to expand same-day grocery delivery
Apple to unveil AI-powered iPhone features


📊 Sample Output

{
    {
    "symbol": "INFY.NS",
    "predictions": [1420.5, 1435.2, 1450.8, 1468.4, 1475.9, 1482.3, 1490.7],
    "trend": "Uptrend",
    "mae": 1.92,
    "rmse": 2.87,
    "insights": {
        "summary": "Infosys partnership with ABN AMRO shows positive growth potential in fintech services...",
        "overall_sentiment": "Positive"
    },
    "decision": "BUY"
}


🖥 Frontend Demo
SearchBar: Select stock symbol & upload PDF

Dashboard:

ML Prediction Card → Shows trend

AI Analysis Card → Shows sentiment

Final Recommendation Card → BUY / SELL / HOLD

StockChart: Historical & predicted price chart

📌 Notes
If a PDF is uploaded, the news will be extracted from it instead of yFinance.

If no PDF is provided, yFinance will be used to fetch latest news.
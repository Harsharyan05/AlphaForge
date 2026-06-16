# ₿ AlphaForge

> AI-Powered Cryptocurrency Intelligence & Prediction Platform

AlphaForge is an end-to-end Machine Learning, Data Engineering, and Cloud-based cryptocurrency analytics platform that collects real-time market data, performs advanced feature engineering, trains predictive models, and serves intelligent market predictions through a scalable FastAPI backend.

---

# 🌟 Highlights

- 📈 Multi-Coin Cryptocurrency Tracking
- 🤖 Machine Learning Prediction Engine
- ⚡ FastAPI REST Backend
- 🗄️ PostgreSQL Cloud Database (Neon)
- 📊 Technical Indicator Pipeline
- 🐳 Docker Ready
- ☁️ Cloud Deployment Ready
- 🔄 Automated Data Ingestion

---

# 🏗️ System Architecture

```text
                    ┌─────────────────┐
                    │ Yahoo Finance   │
                    └────────┬────────┘
                             │
                             ▼
                ┌──────────────────────┐
                │ Data Collection Job  │
                │ store_data.py        │
                └─────────┬────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │ Neon PostgreSQL DB   │
                └─────────┬────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │ Feature Engineering  │
                └─────────┬────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │ XGBoost Model        │
                └─────────┬────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │ FastAPI Backend      │
                └─────────┬────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │ Frontend Dashboard   │
                └──────────────────────┘
```

---

# 🎯 Problem Statement

Cryptocurrency markets generate enormous volumes of data every second.

Retail investors often struggle to:

- Analyze multiple coins simultaneously
- Track technical indicators
- Understand market momentum
- Make data-driven decisions

AlphaForge solves this by creating an automated intelligence layer on top of raw market data.

---

# ⚙️ Features

## Data Pipeline

- Automated Market Data Collection
- Historical Data Backfill
- Scheduled Data Updates
- Multi-Coin Tracking

Supported Assets:

- BTC
- ETH
- SOL
- BNB
- XRP
- ADA
- DOGE
- AVAX
- DOT
- LINK

---

## Database Layer

Cloud-hosted PostgreSQL using Neon

Stores:

- Open Price
- High Price
- Low Price
- Close Price
- Volume
- Timestamp

Database Schema:

```sql
market_data
─────────────────────
id
symbol
open_price
high_price
low_price
close_price
volume
timestamp
```

---

# 🧠 Machine Learning Pipeline

## Feature Engineering

AlphaForge generates advanced trading indicators:

### Momentum Indicators

- RSI
- RSI Overbought
- RSI Oversold

### Trend Indicators

- EMA20
- EMA50
- EMA Cross
- SMA Trend

### Price Action

- Open-Close Percentage
- High-Low Percentage

### Volatility

- Rolling Volatility
- Return Volatility

### Momentum Features

- Momentum 7
- Momentum 14

### Volume Analysis

- Volume Change

### Bollinger Bands

- BB High
- BB Low
- BB Width

### Lag Features

- Return Lag 1
- Return Lag 2
- Return Lag 3

---

# 🤖 Model Training

Current Model:

```text
XGBoost Classifier
```

Prediction:

```text
UP
or
DOWN
```

Target:

```python
Tomorrow Close > Today Close
```

---

# 📊 Current Model Performance

| Metric | Value |
|----------|----------|
| Accuracy | 63.74% |
| Coins | 10 |
| Historical Records | 7300+ |
| Features | 20+ |
| Model | XGBoost |

---

# 🔄 ML Workflow

```text
Historical Data
       │
       ▼
Feature Engineering
       │
       ▼
Training Dataset
       │
       ▼
XGBoost Training
       │
       ▼
Model Evaluation
       │
       ▼
Prediction API
```

---

# 🚀 Backend API

Built with FastAPI.

## Endpoints

### Home

```http
GET /
```

Response:

```json
{
  "project": "AlphaForge",
  "status": "Running"
}
```

---

### Health Check

```http
GET /health
```

---

### Available Coins

```http
GET /coins
```

---

### Market Data

```http
GET /market-data?symbol=BTC-USD
```

Returns:

- Historical OHLCV Data

---

### Prediction

```http
GET /latest-prediction?symbol=BTC-USD
```

Returns:

```json
{
  "symbol":"BTC-USD",
  "prediction":"UP",
  "confidence":61.7
}
```

---

### Metrics

```http
GET /metrics
```

---

# 📂 Project Structure

```text
AlphaForge
│
├── backend
│   ├── app.py
│   ├── store_data.py
│   ├── train_model.py
│   ├── feature_engineering.py
│   ├── backfill_historical_data.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── model
│   └── crypto_model.pkl
│
├── screenshots
│   ├── swagger.png
│   ├── neon_database.png
│   ├── prediction_api.png
│   └── dashboard.png
│
├── docs
│   ├── architecture.png
│   ├── ml_pipeline.png
│   └── database_schema.png
│
├── README.md
│
└── LICENSE
```

---

# 🐳 Docker

Build

```bash
docker build -t alphaforge .
```

Run

```bash
docker run -p 8000:8000 alphaforge
```

---

# ☁️ Deployment

Deployment Architecture:

```text
GitHub
   │
   ▼
Render
   │
   ▼
FastAPI Backend
   │
   ▼
Neon PostgreSQL
```

---

# 📈 Future Roadmap

## Phase 1

- Historical Backfill
- Real-Time Indicators
- Model Optimization

## Phase 2

- Docker Deployment
- Render Deployment
- Automated Cron Jobs

## Phase 3

- React Dashboard
- Interactive Charts
- Portfolio Analytics

## Phase 4

- LSTM Forecasting
- Transformer Models
- News Sentiment Analysis
- MLOps Pipeline

---

# 🛠️ Tech Stack

### Backend

- Python
- FastAPI
- SQLAlchemy

### Data Processing

- Pandas
- NumPy

### Machine Learning

- XGBoost
- Scikit-Learn
- Joblib

### Technical Indicators

- ta

### Database

- PostgreSQL
- Neon

### DevOps

- Docker
- GitHub

---

# 📸 Screenshots

Add:

- Swagger UI
- Neon Database
- Prediction API
- Dashboard

Inside:

```text
/screenshots
```

---

# 👨‍💻 Author

Harsh Aryan

Electronics & Communication Engineering

Machine Learning • AI • Cloud • Data Engineering

Building production-ready AI systems and scalable backend infrastructure.

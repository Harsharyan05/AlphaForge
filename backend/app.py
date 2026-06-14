# app

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import pandas as pd
import joblib
import os

from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from ta.momentum import RSIIndicator
from ta.trend import MACD
from ta.volatility import BollingerBands

# ----------------------------------
# LOAD ENVIRONMENT VARIABLES
# ----------------------------------

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# ----------------------------------
# FASTAPI APP
# ----------------------------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------
# DATABASE
# ----------------------------------

engine = create_engine(DATABASE_URL)

# ----------------------------------
# LOAD MODEL
# ----------------------------------

model = joblib.load("crypto_model.pkl")

# ----------------------------------
# COIN ENCODING
# ----------------------------------

coin_map = {
    "BTC-USD": 0,
    "ETH-USD": 1,
    "SOL-USD": 2,
    "BNB-USD": 3,
    "XRP-USD": 4,
    "ADA-USD": 5,
    "DOGE-USD": 6,
    "AVAX-USD": 7,
    "DOT-USD": 8,
    "LINK-USD": 9,
}

# ----------------------------------
# HOME
# ----------------------------------

@app.get("/")
def home():
    return {
        "project": "AlphaForge",
        "status": "Running"
    }

# ----------------------------------
# HEALTH CHECK
# ----------------------------------

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

# ----------------------------------
# METRICS
# ----------------------------------

@app.get("/metrics")
def metrics():
    return {
        "accuracy": 52.14,
        "coins": 10,
        "model": "Random Forest"
    }

# ----------------------------------
# GET MARKET DATA
# ----------------------------------

@app.get("/market-data")
def market_data(symbol: str):

    with engine.connect() as conn:

        result = conn.execute(
            text("""
            SELECT *
            FROM market_data
            WHERE symbol = :symbol
            ORDER BY id DESC
            LIMIT 50
            """),
            {
                "symbol": symbol
            }
        )

        rows = [
            dict(row._mapping)
            for row in result
        ]

    return rows

# ----------------------------------
# LATEST PREDICTION
# ----------------------------------

@app.get("/latest-prediction")
def latest_prediction(symbol: str):

    with engine.connect() as conn:

        result = conn.execute(
            text("""
            SELECT *
            FROM market_data
            WHERE symbol = :symbol
            ORDER BY id DESC
            LIMIT 1
            """),
            {
                "symbol": symbol
            }
        )

        row = result.fetchone()

        if row is None:
            return {
                "error": f"No data found for {symbol}"
            }

        row = dict(row._mapping)

    coin_code = coin_map.get(symbol, 0)

    close_price = row["close_price"]
    volume = row["volume"]

    data = pd.DataFrame({
        "Close": [close_price],
        "Volume": [volume],
        "Returns": [0],
        "Volatility": [0],
        "RSI": [50],
        "EMA20": [close_price],
        "EMA50": [close_price],
        "MACD": [0],
        "Coin": [coin_code],
        "Close_Lag1": [close_price],
        "Close_Lag2": [close_price],
        "Return_Lag1": [0],
        "Return_Lag2": [0]
    })

    prediction = model.predict(data)[0]

    confidence = (
        max(
            model.predict_proba(data)[0]
        ) * 100
    )

    return {
        "symbol": symbol,
        "prediction":
            "UP"
            if prediction == 1
            else "DOWN",
        "confidence":
            round(confidence, 2)
    }

# ----------------------------------
# ALL COINS OVERVIEW
# ----------------------------------

@app.get("/coins")
def coins():

    with engine.connect() as conn:

        result = conn.execute(
            text("""
            SELECT DISTINCT symbol
            FROM market_data
            ORDER BY symbol
            """)
        )

        rows = [
            row[0]
            for row in result
        ]

    return rows
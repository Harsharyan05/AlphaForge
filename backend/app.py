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
print("DATABASE_URL =", DATABASE_URL)

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

    query = """
    SELECT *
    FROM market_data
    WHERE symbol = :symbol
    ORDER BY timestamp ASC
    """

    df = pd.read_sql(
        text(query),
        engine,
        params={"symbol": symbol}
    )

    if len(df) < 60:
        return {
            "error": "Not enough historical data"
        }

    # Returns
    df["Returns"] = (
        df["close_price"]
        .pct_change()
    )

    # Volatility
    df["Volatility"] = (
        df["Returns"]
        .rolling(7)
        .std()
    )

    # RSI
    df["RSI"] = RSIIndicator(
        close=df["close_price"],
        window=14
    ).rsi()

    # MACD
    macd = MACD(
        close=df["close_price"]
    )

    df["MACD"] = macd.macd()

    df["MACD_Signal"] = (
        macd.macd_signal()
    )

    df["MACD_Hist"] = (
        macd.macd_diff()
    )

    # EMA
    df["EMA20"] = (
        df["close_price"]
        .ewm(span=20, adjust=False)
        .mean()
    )

    df["EMA50"] = (
        df["close_price"]
        .ewm(span=50, adjust=False)
        .mean()
    )

    df["EMA_Cross"] = (
        df["EMA20"]
        >
        df["EMA50"]
    ).astype(int)

    # SMA
    df["SMA_7"] = (
        df["close_price"]
        .rolling(7)
        .mean()
    )

    df["SMA_30"] = (
        df["close_price"]
        .rolling(30)
        .mean()
    )

    df["SMA_Trend"] = (
        df["SMA_7"]
        >
        df["SMA_30"]
    ).astype(int)

    # Bollinger
    bb = BollingerBands(
        close=df["close_price"],
        window=20,
        window_dev=2
    )

    df["BB_High"] = (
        bb.bollinger_hband()
    )

    df["BB_Low"] = (
        bb.bollinger_lband()
    )

    df["BB_Width"] = (
        df["BB_High"]
        -
        df["BB_Low"]
    )

    # Lag Features
    df["Return_Lag1"] = (
        df["Returns"]
        .shift(1)
    )

    df["Return_Lag2"] = (
        df["Returns"]
        .shift(2)
    )

    df["Return_Lag3"] = (
        df["Returns"]
        .shift(3)
    )

    # Momentum
    df["Momentum_7"] = (
        df["close_price"]
        /
        df["close_price"].shift(7)
    )

    df["Momentum_14"] = (
        df["close_price"]
        /
        df["close_price"].shift(14)
    )

    # Price Action
    df["High_Low_Pct"] = (
        (
            df["high_price"]
            -
            df["low_price"]
        )
        /
        df["close_price"]
    )

    df["Open_Close_Pct"] = (
        (
            df["close_price"]
            -
            df["open_price"]
        )
        /
        df["open_price"]
    )

    # Volume
    df["Volume_Change"] = (
        df["volume"]
        .pct_change()
    )

    df["Volume_MA7"] = (
        df["volume"]
        .rolling(7)
        .mean()
    )

    df["Volume_Ratio"] = (
        df["volume"]
        /
        df["Volume_MA7"]
    )

    # ATR
    df["ATR"] = (
        df["high_price"]
        -
        df["low_price"]
    )

    # RSI Signals
    df["RSI_Overbought"] = (
        df["RSI"] > 70
    ).astype(int)

    df["RSI_Oversold"] = (
        df["RSI"] < 30
    ).astype(int)

    df["Coin"] = (
        coin_map.get(symbol, 0)
    )

    df = df.dropna()

    latest = df.iloc[-1]

    features = pd.DataFrame([{

        "Returns": latest["Returns"],
        "Volatility": latest["Volatility"],

        "RSI": latest["RSI"],
        "MACD": latest["MACD"],
        "MACD_Signal": latest["MACD_Signal"],
        "MACD_Hist": latest["MACD_Hist"],

        "Return_Lag1": latest["Return_Lag1"],
        "Return_Lag2": latest["Return_Lag2"],
        "Return_Lag3": latest["Return_Lag3"],

        "Momentum_7": latest["Momentum_7"],
        "Momentum_14": latest["Momentum_14"],

        "High_Low_Pct": latest["High_Low_Pct"],
        "Open_Close_Pct": latest["Open_Close_Pct"],

        "Volume": latest["volume"],
        "Volume_Change": latest["Volume_Change"],
        "Volume_Ratio": latest["Volume_Ratio"],

        "ATR": latest["ATR"],

        "EMA_Cross": latest["EMA_Cross"],
        "SMA_Trend": latest["SMA_Trend"],

        "BB_High": latest["BB_High"],
        "BB_Low": latest["BB_Low"],
        "BB_Width": latest["BB_Width"],

        "RSI_Overbought": latest["RSI_Overbought"],
        "RSI_Oversold": latest["RSI_Oversold"],

        "Coin": latest["Coin"]
    }])

    prediction = model.predict(
        features
    )[0]

    confidence = float(
    model.predict_proba(features)[0]
    .max()
    * 100
)

    return {
    "symbol": symbol,
    "prediction": "UP" if int(prediction) == 1 else "DOWN",
    "confidence": round(float(confidence), 2)
}
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
    "symbol": str(symbol),
    "prediction": int(prediction),
    "confidence": float(confidence)
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

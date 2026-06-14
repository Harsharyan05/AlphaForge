# feature_engineering

import pandas as pd

from ta.momentum import RSIIndicator
from ta.trend import MACD
from ta.volatility import BollingerBands

# ==========================
# Load Dataset
# ==========================

df = pd.read_csv("crypto_historical.csv")

df = df.sort_values(
    ["Symbol", "Date"]
)

processed = []

# ==========================
# Process Each Coin
# ==========================

for symbol in df["Symbol"].unique():

    print(f"Processing {symbol}...")

    coin_df = df[
        df["Symbol"] == symbol
    ].copy()

    # ==========================
    # Returns
    # ==========================

    coin_df["Returns"] = (
        coin_df["Close"]
        .pct_change()
    )

    # ==========================
    # Volatility
    # ==========================

    coin_df["Volatility"] = (
        coin_df["Returns"]
        .rolling(7)
        .std()
    )

    # ==========================
    # Moving Averages
    # ==========================

    coin_df["SMA_7"] = (
        coin_df["Close"]
        .rolling(7)
        .mean()
    )

    coin_df["SMA_30"] = (
        coin_df["Close"]
        .rolling(30)
        .mean()
    )

    coin_df["EMA20"] = (
        coin_df["Close"]
        .ewm(span=20, adjust=False)
        .mean()
    )

    coin_df["EMA50"] = (
        coin_df["Close"]
        .ewm(span=50, adjust=False)
        .mean()
    )

    coin_df["EMA_Cross"] = (
        coin_df["EMA20"]
        >
        coin_df["EMA50"]
    ).astype(int)

    coin_df["SMA_Trend"] = (
        coin_df["SMA_7"]
        >
        coin_df["SMA_30"]
    ).astype(int)

    # ==========================
    # RSI
    # ==========================

    coin_df["RSI"] = RSIIndicator(
        close=coin_df["Close"],
        window=14
    ).rsi()

    coin_df["RSI_Overbought"] = (
        coin_df["RSI"] > 70
    ).astype(int)

    coin_df["RSI_Oversold"] = (
        coin_df["RSI"] < 30
    ).astype(int)

    # ==========================
    # MACD
    # ==========================

    macd = MACD(
        coin_df["Close"]
    )

    coin_df["MACD"] = (
        macd.macd()
    )
    
    coin_df["MACD_Signal"] = (
    macd.macd_signal()
    )

    coin_df["MACD_Hist"] = (
    macd.macd_diff()
    )

    # ==========================
    # Bollinger Bands
    # ==========================

    bb = BollingerBands(
        close=coin_df["Close"],
        window=20,
        window_dev=2
    )

    coin_df["BB_High"] = (
        bb.bollinger_hband()
    )

    coin_df["BB_Low"] = (
        bb.bollinger_lband()
    )

    coin_df["BB_Width"] = (
        coin_df["BB_High"]
        -
        coin_df["BB_Low"]
    )

    # ==========================
    # Lag Features
    # ==========================

    coin_df["Return_Lag1"] = (
        coin_df["Returns"]
        .shift(1)
    )

    coin_df["Return_Lag2"] = (
        coin_df["Returns"]
        .shift(2)
    )

    coin_df["Return_Lag3"] = (
        coin_df["Returns"]
        .shift(3)
    )

    # ==========================
    # Momentum
    # ==========================

    coin_df["Momentum_7"] = (
        coin_df["Close"]
        /
        coin_df["Close"].shift(7)
    )

    coin_df["Momentum_14"] = (
        coin_df["Close"]
        /
        coin_df["Close"].shift(14)
    )

    # ==========================
    # Price Action
    # ==========================

    coin_df["High_Low_Pct"] = (
        (coin_df["High"] - coin_df["Low"])
        /
        coin_df["Close"]
    )

    coin_df["Open_Close_Pct"] = (
        (coin_df["Close"] - coin_df["Open"])
        /
        coin_df["Open"]
    )

    # ==========================
    # Volume
    # ==========================

    coin_df["Volume_Change"] = (
        coin_df["Volume"]
        .pct_change()
    )
    
    coin_df["Volume_MA7"] = (
    coin_df["Volume"]
    .rolling(7)
    .mean()
    )

    coin_df["Volume_Ratio"] = (
    coin_df["Volume"]
    /
    coin_df["Volume_MA7"]
    )
    
    # ==========================
    # ATR
    # ==========================
    
    coin_df["ATR"] = (
    coin_df["High"]
    -
    coin_df["Low"]
    ) / coin_df["Close"]

    # ==========================
    # Target
    # ==========================

    future_return = (
    coin_df["Close"].shift(-1)
    - coin_df["Close"]
    ) / coin_df["Close"]

    coin_df["Target"] = (
    future_return > 0.005
    ).astype(int)

    processed.append(
        coin_df
    )

# ==========================
# Merge
# ==========================

final_df = pd.concat(
    processed,
    ignore_index=True
)

final_df["Coin"] = (
    final_df["Symbol"]
    .astype("category")
    .cat.codes
)

final_df.dropna(
    inplace=True
)

final_df.to_csv(
    "processed_data.csv",
    index=False
)

print("\nDataset Shape:")
print(final_df.shape)

print("\nColumns:")
print(final_df.columns.tolist())

print("\nProcessed dataset saved successfully!")
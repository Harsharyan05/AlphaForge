# train_model

import pandas as pd
import joblib

from xgboost import XGBClassifier

from sklearn.metrics import (
    accuracy_score,
    classification_report
)

# ==========================
# Load Data
# ==========================

df = pd.read_csv(
    "processed_data.csv"
)

# ==========================
# Features
# ==========================

features = [

    "Returns",
    "Volatility",

    "RSI",
    "MACD",
    "MACD_Signal",
    "MACD_Hist",

    "Return_Lag1",
    "Return_Lag2",
    "Return_Lag3",

    "Momentum_7",
    "Momentum_14",

    "High_Low_Pct",
    "Open_Close_Pct",

    "Volume",
    "Volume_Change",
    "Volume_Ratio",

    "ATR",

    "EMA_Cross",
    "SMA_Trend",

    "BB_High",
    "BB_Low",
    "BB_Width",

    "RSI_Overbought",
    "RSI_Oversold",

    "Coin"
]

X = df[features]

y = df["Target"]

# ==========================
# Time Series Split
# ==========================

split = int(
    len(df) * 0.8
)

X_train = X[:split]
X_test = X[split:]

y_train = y[:split]
y_test = y[split:]

# ==========================
# XGBoost
# ==========================

model = XGBClassifier(

    n_estimators=2500,

    max_depth=8,

    learning_rate=0.01,

    subsample=0.85,

    colsample_bytree=0.85,

    min_child_weight=3,

    gamma=0.2,

    objective="binary:logistic",

    eval_metric="logloss",

    random_state=42,

    n_jobs=-1
)

# ==========================
# Train
# ==========================

model.fit(
    X_train,
    y_train
)

# ==========================
# Predict
# ==========================

preds = model.predict(
    X_test
)

accuracy = accuracy_score(
    y_test,
    preds
)

print(
    "\nAccuracy:",
    round(
        accuracy,
        4
    )
)

print(
    "\nTarget Distribution:"
)

print(
    y.value_counts()
)

print(
    "\nClassification Report:\n"
)

print(
    classification_report(
        y_test,
        preds
    )
)

# ==========================
# Feature Importance
# ==========================

importance_df = pd.DataFrame({

    "Feature": features,

    "Importance":
    model.feature_importances_

})

importance_df = (
    importance_df
    .sort_values(
        by="Importance",
        ascending=False
    )
)

print(
    "\nTop Features:\n"
)

print(
    importance_df
)

# ==========================
# Save Model
# ==========================

joblib.dump(
    model,
    "crypto_model.pkl"
)

print(
    "\nModel Saved!"
)
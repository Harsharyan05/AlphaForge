def generate_signal(
    prediction,
    rsi,
    ema20,
    ema50
):

    if (
        prediction == 1
        and ema20 > ema50
        and rsi < 70
    ):
        return "BUY"

    return "SELL"
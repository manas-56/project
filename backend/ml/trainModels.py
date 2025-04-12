import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.callbacks import EarlyStopping

DATA_DIR = './backend/data'  
SEQ_LEN = 60
EPOCHS = 20
BATCH_SIZE = 32

def preprocess_data(filepath):
    df = pd.read_csv(filepath)
    df['Date'] = pd.to_datetime(df['Date'])
    df.set_index('Date', inplace=True)
    df = df.sort_index().dropna()
    return df[['Open', 'High', 'Low', 'Close', 'Volume']]

def create_sequences(data, seq_length):
    X, y = [], []
    for i in range(seq_length, len(data)):
        X.append(data[i-seq_length:i])
        y.append(data[i, 3])  # 'Close' is at index 3
    return np.array(X), np.array(y)

def train_model(X_train, y_train, X_val, y_val):
    model = Sequential([
        LSTM(64, return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])),
        LSTM(32),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(
        X_train, y_train,
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        validation_data=(X_val, y_val),
        callbacks=[EarlyStopping(patience=3, restore_best_weights=True)],
        verbose=0
    )
    return model

def run_pipeline(file):
    print(f"Processing {file}...")
    df = preprocess_data(os.path.join(DATA_DIR, file))

    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(df)

    X, y = create_sequences(scaled, SEQ_LEN)
    split = int(0.8 * len(X))
    X_train, X_val = X[:split], X[split:]
    y_train, y_val = y[:split], y[split:]

    model = train_model(X_train, y_train, X_val, y_val)

    # Save model
    stock_name = os.path.splitext(file)[0]
    model.save(f'{stock_name}_lstm_model.h5')
    print(f"Saved model for {stock_name} ✅")

# Run on all CSVs
for filename in os.listdir(DATA_DIR):
    if filename.endswith('.csv'):
        try:
            run_pipeline(filename)
        except Exception as e:
            print(f"Failed to process {filename}: {e}")

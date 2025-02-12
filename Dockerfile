FROM python:3.11-slim AS python-builder

WORKDIR /app

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
COPY python_files ./python_files
RUN pip install --no-cache-dir -r requirements.txt

RUN curl -L https://github.com/XBastille/FoxTrend/releases/download/model_2/model.joblib -o python_files/ML_Models/Used_car_price_prediction/model_used_car/model.joblib \
    && curl -L https://github.com/XBastille/FoxTrend/releases/download/model_1/model.joblib -o python_files/ML_Models/Housing_price_model/model_us/model.joblib

FROM node:18 AS node-builder

WORKDIR /app

COPY package*.json ./
RUN npm install bcryptjs cluster  body-parser express express-session hbs passport passport-local node-cron csv-parser mongoose

COPY . .

FROM openjdk:17-jdk-slim

RUN apt-get update && \
    apt-get install -y curl python3 python3-pip && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    ln -s /usr/bin/python3 /usr/bin/python && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app/java

ADD https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-j-9.0.0.tar.gz /tmp/
RUN tar -xvzf /tmp/mysql-connector-j-9.0.0.tar.gz -C /tmp && \
    mv /tmp/mysql-connector-j-9.0.0/mysql-connector-j-9.0.0.jar /app/java/

WORKDIR /app

COPY --from=python-builder /app /app
COPY --from=node-builder /app /app
COPY jdbc/src /app/java/src

COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

ENV PYTHONPATH=/app/python_files
ENV PYTHONUNBUFFERED=1

RUN mkdir -p /app/java/bin && \
    javac -cp "/app/java/mysql-connector-j-9.0.0.jar" -d /app/java/bin /app/java/src/*.java

EXPOSE 3000

CMD ["node", "app.js"]

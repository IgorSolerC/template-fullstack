# Use an official Python runtime as a parent image
FROM python:3.11-slim

ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

RUN apt-get update
RUN rm -rf /var/lib/apt/lists/*
# Copy the backend's requirements file and install dependencies
# This is done first to leverage Docker's layer caching

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend application code into the container
COPY . .

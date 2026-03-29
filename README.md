# AI-Dropout-Prediction-System
📌 Project Overview

The AI-Based Dropout Risk Prediction & Counseling System is a machine learning-powered web application designed to identify students at risk of academic dropout.

The system classifies students into:

🟢 Low Risk

🟡 Medium Risk

🔴 High Risk

This enables institutions to provide timely counseling and intervention.

🚩 Problem Statement

Many students face academic failure due to poor SGPA, high backlogs, and low attendance.

Institutions lack an early warning prediction system.

Manual monitoring is delayed and inefficient.

Late intervention increases dropout probability.

🎯 Objectives

Predict student dropout risk using academic data.

Classify students into Low / Medium / High risk categories.

Provide a monitoring dashboard.

Enable counselor intervention.

🧠 Machine Learning Model
Model Used:

Random Forest Classifier

Why Random Forest?

Handles nonlinear patterns

Reduces overfitting

Provides feature importance

📊 Dataset Features

Past CGPA

SGPA Trend

Total Backlogs

Attendance %

Train-Test Split:

80% Training

20% Testing

⚙️ System Architecture

Admin → Flask Backend → Feature Engineering → Random Forest Model → MySQL → Dashboards

🖥️ Tech Stack

Frontend: React
Backend: Flask
Database: MySQL
Authentication: Google OAuth 2.0

📈 Model Evaluation

Accuracy: 87%

Precision

Confusion Matrix

🚀 Future Scope

 Integration with real institutional datasets
 
 SMS and email alerts for at-risk students

 LMS integration for automatic data updates
 
 Improved prediction using advanced models like LSTM

 Enhanced dashboards for counselors and administrators

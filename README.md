# BangaBites

### Smart Restaurant Recommendation System for Bengaluru

BangaBites is a machine-learning powered restaurant recommendation system built using **Python, Flask, TF-IDF, and Cosine Similarity**.

It helps users discover restaurants similar to their favorite restaurants while considering **location, ratings, popularity, and budget**.

The project is designed specifically around the Bengaluru restaurant ecosystem and provides an interactive web interface for discovering restaurants.

---

## 🌐 Live Demo

https://bangabites.ankitpardeshi.xyz/

---

## ✨ Features

### 🔍 Smart Restaurant Recommendations

Enter a restaurant you already like, and BangaBites recommends restaurants with similar characteristics using:

- Cuisine
- Restaurant type
- Location
- Other textual restaurant attributes

The similarity is calculated using:

**TF-IDF + Cosine Similarity**

---

### 📍 Location-Based Recommendations

Users can optionally specify a Bengaluru location such as:

- Banashankari
- Indiranagar
- Koramangala
- Jayanagar
- HSR
- Malleshwaram

Recommendations can then be restricted to that location.

---

### ⭐ Rating Filter

Users can specify a minimum rating:

- 3.0+
- 3.5+
- 4.0+
- 4.5+

This helps users avoid restaurants below their preferred rating.

---

### 💰 Budget Filter

Users can specify the maximum approximate cost for two people.

For example:

```text
Maximum Cost = ₹800
````

BangaBites will prioritize restaurants within the selected budget.

---

### 📊 Intelligent Ranking

Recommendations are not based only on similarity.

Each restaurant receives multiple scores:

| Score            | Purpose                                        |
| ---------------- | ---------------------------------------------- |
| Similarity Score | Measures similarity to the selected restaurant |
| Weighted Rating  | Balances rating with number of votes           |
| Popularity Score | Represents restaurant popularity               |
| Price Score      | Rewards restaurants within the selected budget |
| Final Score      | Combines all factors                           |

The final recommendation score is calculated using:

```text
Final Score =
    0.50 × Similarity Score
  + 0.30 × Weighted Rating
  + 0.10 × Popularity Score
  + 0.10 × Price Score
```

This allows BangaBites to balance **similarity, quality, popularity, and affordability**.

---

## 🤖 Machine Learning Approach

BangaBites uses a **content-based recommendation approach**.

### Step 1 — Feature Preparation

Restaurant attributes such as:

* Cuisines
* Restaurant type
* Location

are combined into textual information.

---

### Step 2 — TF-IDF Vectorization

The textual restaurant information is converted into numerical vectors using:

```python
TfidfVectorizer
```

TF-IDF helps identify which words/features are important for differentiating restaurants.

---

### Step 3 — Cosine Similarity

The selected restaurant's TF-IDF vector is compared with all other restaurants using:

```python
cosine_similarity()
```

This produces a similarity score between restaurants.

---

### Step 4 — Recommendation Ranking

The system then combines:

```text
Content Similarity
        +
Restaurant Quality
        +
Popularity
        +
Budget Compatibility
```

to generate the final ranked recommendations.

---

## 🧠 Weighted Rating

A restaurant with a rating of `4.9` based on only a few votes should not automatically outrank a restaurant with a rating of `4.7` based on thousands of votes.

Therefore, BangaBites uses a weighted rating approach to reduce the effect of restaurants with very few votes.

This produces a more reliable restaurant quality score.

---

## 🏗️ System Architecture

```text
                    User
                      │
                      ▼
              ┌───────────────┐
              │ BangaBites UI │
              │ HTML/CSS/JS   │
              └───────┬───────┘
                      │
                      ▼
               Flask REST API
                      │
                      ▼
           Restaurant Recommender
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
     TF-IDF Matrix          Restaurant Data
          │                       │
          └───────────┬───────────┘
                      │
                      ▼
              Cosine Similarity
                      │
                      ▼
              Recommendation
                 Scoring
                      │
                      ▼
              Ranked Results
```

---

## 🛠️ Tech Stack

### Programming

* Python

### Machine Learning

* Scikit-learn
* TF-IDF
* Cosine Similarity

### Data Science

* Pandas
* NumPy

### Backend

* Flask
* REST API

### Frontend

* HTML
* CSS
* JavaScript

### Model Persistence

* Joblib
* Pickle

### Deployment

* Gunicorn
* GitHub

---

## 📁 Project Structure

```text
BangaBites/
│
├── data/
│   └── cleaned_zomato.csv
│
├── models/
│   ├── rec_df.pkl
│   ├── tfidf_matrix.pkl
│   └── tfidf_vectorizer.pkl
│
├── src/
│   └── recommender.py
│
├── static/
│   ├── assets/
│   ├── script.js
│   └── style.css
│
├── templates/
│   └── index.html
│
├── app.py
├── Procfile
├── requirements.txt
├── .gitignore
└── README.md
```

> **Note:** The original restaurant dataset is used locally for data preparation and model development. The large CSV dataset is intentionally excluded from the GitHub repository because of GitHub's file-size limitations. The required processed model artifacts are stored in `models/`.

---

## 🚀 Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/Ankitpardeshiii/BangaBites.git
```

```bash
cd BangaBites
```

---

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

---

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

### 4. Run Flask

```bash
python app.py
```

The application will run at:

```text
http://127.0.0.1:5000
```

---

## 🔌 API

BangaBites exposes a Flask REST API for generating recommendations.

### Endpoint

```text
GET /api/recommend
```

### Required Parameter

```text
restaurant
```

### Optional Parameters

```text
location
min_rating
max_cost
top_n
```

### Example

```text
/api/recommend?restaurant=Jalsa&location=Banashankari&min_rating=4.0&max_cost=800&top_n=5
```

### Example Response

```json
{
    "restaurant": "Jalsa",
    "count": 5,
    "recommendations": [
        {
            "name": "Hara Fine Dine",
            "location": "Banashankari",
            "rate": 4.0,
            "votes": 633,
            "similarity_score": 0.8353,
            "weighted_rating": 3.9402,
            "final_score": 0.7206
        }
    ]
}
```

---

## 🎯 Why BangaBites?

Traditional restaurant search often relies heavily on ratings or popularity.

BangaBites takes a different approach.

Instead of simply asking:

> "Which restaurants have the highest rating?"

it asks:

> **"Which restaurants are most similar to what I already like, while also matching my location, rating preference, popularity and budget?"**

This makes the recommendation more personalized.

---

## 📌 Project Type

BangaBites combines **Data Science + Machine Learning + Backend Development**.

### Data Science

* Data cleaning
* Data preprocessing
* Exploratory analysis
* Feature engineering
* Statistical scoring
* Ranking

### Machine Learning

* TF-IDF feature representation
* Content-based recommendation
* Cosine similarity
* Recommendation scoring

### Software Engineering

* Flask REST API
* Frontend integration
* Model serialization
* Deployment
* Git/GitHub

---

## 🔮 Future Improvements

Some possible improvements include:

* [ ] User accounts and personalized profiles
* [ ] Collaborative filtering
* [ ] Hybrid recommendation system
* [ ] User feedback / like-dislike system
* [ ] Restaurant search autocomplete improvements
* [ ] Google Maps integration
* [ ] Distance-based recommendations
* [ ] Real-time restaurant availability
* [ ] Restaurant images
* [ ] Advanced recommendation explanations
* [ ] Incremental learning using user interactions
* [ ] Cloud deployment
* [ ] Custom domain

---

## 👨‍💻 Author

### Ankit Govind Pardeshi

Artificial Intelligence & Data Science Student
Developer • Data Science Enthusiast • ML Learner

### Connect With Me

🔗 **LinkedIn**
[https://www.linkedin.com/in/ankitpardeshi05](https://www.linkedin.com/in/ankitpardeshi05)

💻 **GitHub**
[https://github.com/Ankitpardeshiii](https://github.com/Ankitpardeshiii)

🌐 **Portfolio**
[https://ankitpardeshi.xyz](https://ankitpardeshi.xyz)

---

## ⭐ Support

If you found BangaBites interesting, consider giving the repository a ⭐ on GitHub!

---

### 🍴 BangaBites

**Discover Bengaluru. Discover great food. Discover your next favorite.**


from flask import Flask, request, jsonify, render_template
from src.recommender import RestaurantRecommender

app = Flask(__name__)

recommender = RestaurantRecommender(
    rec_df_path="models/rec_df.pkl",
    tfidf_matrix_path="models/tfidf_matrix.pkl"
)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/recommend", methods=["GET"])
def recommend():

    restaurant = request.args.get("restaurant")
    location = request.args.get("location")
    min_rating = request.args.get("min_rating", type=float)
    max_cost = request.args.get("max_cost", type=float)
    top_n = request.args.get("top_n", default=10, type=int)

    if not restaurant:
        return jsonify({
            "error": "Restaurant name is required."
        }), 400

    recommendations = recommender.recommend(
        restaurant_name=restaurant,
        location=location,
        min_rating=min_rating,
        max_cost=max_cost,
        top_n=top_n
    )

    return jsonify({
        "restaurant": restaurant,
        "count": len(recommendations),
        "recommendations": recommendations
    })


@app.route("/api/restaurants", methods=["GET"])
def restaurants():

    query = request.args.get("q", "").strip().lower()

    if not query:
        return jsonify([])

    matches = recommender.rec_df[
        recommender.rec_df["name"]
        .str.lower()
        .str.contains(query, na=False)
    ]

    results = (
        matches[
            ["name", "location"]
        ]
        .drop_duplicates()
        .head(10)
        .to_dict(orient="records")
    )

    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True)
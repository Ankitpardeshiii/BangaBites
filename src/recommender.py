import numpy as np
import joblib
from sklearn.metrics.pairwise import cosine_similarity


class RestaurantRecommender:

    def __init__(
        self,
        rec_df_path,
        tfidf_matrix_path
    ):
        self.rec_df = joblib.load(rec_df_path)
        self.tfidf_matrix = joblib.load(tfidf_matrix_path)

    def recommend(
        self,
        restaurant_name,
        location=None,
        min_rating=None,
        max_cost=None,
        top_n=10
    ):

        matches = self.rec_df[
            self.rec_df["name"].str.lower() ==
            restaurant_name.lower()
        ]

        if location is not None:
            matches = matches[
                matches["location"].str.lower() ==
                location.lower()
            ]

        if matches.empty:
            return []

        restaurant_index = matches.index[0]

        restaurant_vector = self.tfidf_matrix[
            restaurant_index
        ]

        similarity_scores = cosine_similarity(
            restaurant_vector,
            self.tfidf_matrix
        ).flatten()

        recommendations = self.rec_df.copy()

        recommendations["similarity_score"] = (
            similarity_scores
        )

        recommendations = recommendations[
            recommendations.index != restaurant_index
        ]

        recommendations = recommendations[
            recommendations["votes"] >= 50
        ]

        if location is not None:
            recommendations = recommendations[
                recommendations["location"].str.lower() ==
                location.lower()
            ]

        if min_rating is not None:
            recommendations = recommendations[
                recommendations["rate"] >= min_rating
            ]

        if max_cost is not None:
            recommendations = recommendations[
                recommendations[
                    "approx_cost(for two people)"
                ] <= max_cost
            ]

        if recommendations.empty:
            return []

        recommendations["popularity_score"] = (
            np.log1p(recommendations["votes"])
            /
            np.log1p(self.rec_df["votes"].max())
        )

        if max_cost is not None:

            recommendations["price_score"] = (
                1 -
                recommendations[
                    "approx_cost(for two people)"
                ] / max_cost
            ).clip(0, 1)

        else:

            recommendations["price_score"] = 0.5

        recommendations["final_score"] = (
            0.50 * recommendations["similarity_score"]
            + 0.30 * (
                recommendations["weighted_rating"] / 5
            )
            + 0.10 * recommendations["popularity_score"]
            + 0.10 * recommendations["price_score"]
        )

        recommendations = recommendations.sort_values(
            "final_score",
            ascending=False
        )

        result = recommendations[
            [
                "name",
                "location",
                "cuisines",
                "rest_type",
                "rate",
                "votes",
                "approx_cost(for two people)",
                "similarity_score",
                "weighted_rating",
                "popularity_score",
                "price_score",
                "final_score",
                "url"
            ]
        ].head(top_n)

        return result.to_dict(orient="records")
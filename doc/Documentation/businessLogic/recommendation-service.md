## Recommendation Service


### Featured Recommendations
- **Most Popular**
    - Provides a collection of the platform's most frequently borrowed books

    - **Logic Explanation**
        - Retrieves books with the highest borrowing counts
        - Highlights trending titles among readers
        - Helps users quickly discover widely read and highly engaged content


- **New Publications**
    - Provides recommendations based on recently published books

    - **Logic Explanation**
        - Retrieves the latest published books from the catalogue
        - Highlights newly available content
        - Automatically refreshes cache when publication data changes

- **Source Code Reference**
    - [bookRecommendationService.ts](../../../backend/src/service/recommendation/bookRecommendationService.ts)



### Personal Recommendation
- The Personal Recommendation feature generates personalised book suggestions based on a user's borrowing history and book metadata

#### Recommendation Pipeline
- **Metadata Collection**
    - Collect user borrowing records from LoanBook
    - Collect book metadata from AllBook

- **Corpus Construction**
    - Build a user interest corpus using metadata from previously borrowed books
    - Construct candidate book corpora using genre, category, author and keyword information
    - Exclude books already borrowed by the user

- **Candidate Scoring**
    - Calculate content relevance using a TF-IDF based recommendation engine
    - Apply genre preference weighting based on historical borrowing behaviour
    - Rank books according to their final recommendation scores

- **Recommendation Generation**
    - Select the highest-ranked books as recommendation candidates
    - Cache the generated results to reduce repeated computations

- **AI Explanation**
    - Use DeepSeek to generate natural-language recommendation messages
    - Provide contextual explanations for recommended books

- **Source Code Reference**
    - [recommendationEngine.ts](../../../backend/src/service/recommendation/recommendationEngine.ts)



## Recommendation Engine
- The recommendation engine uses a content-based filtering approach to measure the similarity between a user's reading interests and available books.

### Logic Explanation
- **TF-IDF Based Similarity Scoring**
    - Transforms user preferences and candidate books into metadata corpora
    - Applies TF-IDF vectorisation to quantify the importance of metadata terms
    - Generates feature vectors representing both user interests and book characteristics

- **Similarity Measurement**
    - Uses Cosine Similarity to measure the relevance between user and book vectors
    - Higher similarity scores indicate stronger alignment with the user's historical reading behaviour

- **Genre Preference Weighting**
    - Applies additional weighting based on genre frequency within the user's borrowing history.
    - Prioritises books from genres the user interacts with more frequently

- **Final Score**
    - Final Score = 0.7 × TF-IDF Similarity + 0.3 × Genre Preference Weight

- **Source Code Reference**
    - [IDF_Logic.ts](../../../backend/src/service/recommendation/TF-IDF_Logic.ts)
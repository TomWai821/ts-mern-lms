## TF-IDF Logic

****1. Calculate Term Frequency and Inverse Document Frequency****<br>
<img src="../../Image/Functions/TF-IDF_BasicFunction.png" style="width:60%;"/><br>

**Term Frequency (TF) - Build User Interest Profile**
- **Usage**
    - Extracts the User Interest Profile from borrowing history
    - It identifies which keywords (e.g., "Mystery", "Python", "Space") are most significant based on their recurrence in the user's past loans

- **Formula**<br>
  <img src="../../Image/Formula/TF-formula.png" style="width:30%;"/><br>

****Inverse Document Frequency (IDF) - Feature Engineering****    
- **Usage**
    -  Automatically de-prioritises generic terms (e.g., "book", "edition") while highlighting distinctive attributes that define a book's unique character<br>
       (This ensures the system focuses on specific traits rather than common metadata)
    
- **Formula**<br>
  <img src="../../Image/Formula/IDF-formula.png" style="width:30%;"/><br>

****Vector Space Representation - Feature Encoding****
- **Usage**
    - Translates text-based metadata into high-dimensional coordinate points<br>
      (This enables the system to perform Geometric Mapping, measuring the mathematical "proximity" between a user’s taste and the library inventory beyond simple keyword matching)
    
- **Project Logic***
    - Acts as the Common Language to measure "proximity" between user history and library inventory

****Cosine Similarity****<br>
- **Usage**
    - Measures the relevance between the User's Cumulative Interest and each book's metadata
    - By calculating the angle between vectors, the engine identifies relevant recommendations (scores near 1.0) even if titles do not share exact word matches

- **Formula**<br>
  <img src="../../Image/Formula/CosineSimilarity-formula.png" style="width:30%;"/><br>


***2. Calculation Logic (TF-IDF + Genre Weight)***<br>
<img src="../../Image/Functions/TF-IDF_CalculateFunction.png" style="width:95%;"/><br>

****Data Vectorisation (Corpus Construction)****
- **Process**
    - Constructing the User Interest Profile (loanCorpus) from borrowing history and the Global Book Registry (allBooksCorpus) from the entire library inventory

- **Goal**
    - To establish the raw text data required for high-dimensional feature extraction

****Vocabulary Mapping & TF-IDF Encoding****
- **Process**
    - Generating a global Vocabulary Index across all ..uments to encode both user history and book metadata into TF-IDF Vectors
    
- **Goal**
    - To translate text-based attributes into a unified numerical format for mathematical comparison

****Similarity Scoring (Cosine Similarity)****
- **Process** 
    - Executing Cosine Similarity between the user’s interest vector and each book’s feature vector
    
- **Goal**
    - To derive the tfidfScore, representing the degree of semantic proximity between a user's taste and a book's characteristics

****Hybrid Heuristic Tuning (Genre Weighting)****
- **Process**
    - Calculating a Genre Preference Factor by analysing the distribution of categories in the user's borrowing history
    - Instead of a binary match, the system assigns a weight based on the frequency ratio of a genre relative to the user's total loans
    
- **Final Logic**
    - finalScore = (0.7 * tfidfScore) + (0.3 * genreScore)
    
- **Goal**
    - To balance Discovery (finding new but semantically similar books) with Loyalty (prioritising the user's proven favourite categories)

***3. Data Normalisation And Corpus Construction***<br>
<img src="../../Image/Functions/TF-IDF_formatBookMetaData.png" style="width:60%;"/><br>

- **Process**
    - Implementing a Metadata Normalisation layer (formatBookMetadata) to sanitise raw book objects<br>
      (This involves resolving nested properties (e.g., genreDetails) and providing "Unknown" fallbacks for missing data to ensure consistent vectorisation)
      
- **Logic (Feature Fusion)** 
    - Constructing a Synthetic Corpus for each book by concatenating key attributes: Book Name, Genre, Author, and Publisher
    - Example: ${this.bookname} ${this.genre} ${this.author} ${this.publisher}
    
- **Goal**
    - To transform multi-dimensional metadata into a unified, descriptive text string<br>
      (Serve as the primary input for high-dimensional TF-IDF feature extraction)

***4. TF-IDF Implementation***<br>
<img src="../../Image/Functions/TF-IDF_Implementation.png" style="width:90%;"/><br>

The core execution logic is designed to balance recommendation accuracy with system responsiveness:
- **User Interest Modelling**
    - Extracts the latest 5 loan records to build the user profile
    - Constructs a genreFrequencyMap to quantify the user’s "Category Loyalty" based on historical distribution
    
- **Hybrid Scoring Algorithm**
    - **Semantic Score (70%)**: Derived from the TF-IDF Cosine Similarity of book content
    - **Preference Weight (30%)**: Calculated as (GenreCount / TotalUserLoans)
    - **Final Score Formula**: (0.7 * tfidfScore) + (0.3 * genreScore) + jitter

- **Refining & Tie-Breaking**
    - **Exclusion Logic**
        - Automatically filters out books currently or previously loaned by the user to avoid redundant suggestions
  
    - **Random Jitter**
        - For books with identical metadata (e.g., same author/series), a tiny decimal (Jitter) is applied to break ties (Ensure a dynamic and diverse ranking)
  
    - **Payload Delivery**
        - Ranks and returns the **top 8 most relevant results** to the client-side UI


****Remarks****
- **Performance Optimisation**
  - By limiting the profile to the **latest 5 loans**, the system prioritises "recent tastes" while minimising the computational latency of high-dimensional vector math
        
- **Small Dataset Strategy**
  - Given the current library size, the engine performs a Global Corpus Scan to maximise the discovery pool and ensure the recommendation set is never empty
        
- **Serendipity (Discovery vs Loyalty)**
  - The 70/30 weighting ratio is a heuristic choice designed to introduce "new but related" titles (Discovery) while respecting the user's established reading habits (Loyalty)
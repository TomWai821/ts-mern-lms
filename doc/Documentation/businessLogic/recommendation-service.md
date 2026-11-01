## Recommendation Service Overview

#### Recommendation Objective

- The recommendation engine analyses a user's recent borrowing behaviour and compares it against the library catalogue to identify books that closely match the user's demonstrated reading interests

- The design aims to balance:
    - **Discovery**
        - Introducing users to new but relevant titles

    - **Preference Consistency**
        - Prioritising genres that users frequently borrow

    - **Performance Efficiency**
        - Generating recommendations with minimal processing overhead


<img src="../../Image/Functions/TF-IDF_Implementation.png" style="width:90%;"/><br>
Figure 1. Recommendation Service Execution Workflow



#### Data Normalisation
<img src="../../Image/Functions/TF-IDF_formatBookMetaData.png" style="width:60%;"/><br>
Figure 2. Metadata Normalisation and Corpus Construction

- **Explanation**
    - Before recommendation processing begins, all book records are transformed into a standardised metadata structure

    - The normalisation process:
        - Extracts the book title, genre, author and publisher
        - Handles incomplete records by assigning default "Unknown" values
        - Resolves nested object properties into a consistent format
        - The extracted attributes are then combined into a single text corpus

- **Example**
    - Input Metadata:
        - Book Name: Harry Potter
        - Genre: Fantasy
        - Author: J.K. Rowling
        - Publisher: Bloomsbury
    
    - Generated Corpus:
        - Harry Potter Fantasy J.K. Rowling Bloomsbury

- **Purpose**
    - Ensure data consistency across all book records
    - Handle incomplete metadata safely
    - Create a unified text representation for TF-IDF processing



#### Recommendation Workflow
<details>
<summary>Step 1: Build User Interest Profile</summary>

- **Explanation**
    - The system retrieves the user's five most recent loan records
    - Using the normalised metadata generated during the data preparation stage, these records are combined to form a User Interest Profile
    - This profile represents the user's recent reading behaviour and serves as the reference point for recommendation generation

- **Purpose**
    - To establish a concise representation of the user's current reading interests based on recent borrowing activity
</details>



<details>
<summary>Step 2: Build Library Comparison Dataset</summary>

- **Explanation**
    - All books within the library catalogue are normalised into a consistent format

    - Example
        - Harry Potter Fantasy J.K. Rowling Bloomsbury

    - This unified metadata structure ensures every book can be analysed using the same comparison method

- **Purpose**
    - To establish a searchable recommendation pool
</details>



<details>
<summary>Step 3: Calculate Content Similarity</summary>

- **Explanation**
    - The system applies TF-IDF vectorisation and Cosine Similarity to compare:
        - User Interest Profile vs Library Book Metadata

    - A similarity score is generated for every available book

    - Higher scores indicate stronger alignment with the user's borrowing history

- **Purpose**
    - To identify books with similar themes, genres, authors or descriptive characteristics
</details>



<details>
<summary>Step 4: Apply Genre Preference Weighting</summary>

- **Explanation**
    - The recommendation service analyses genre distribution within the user's borrowing history
    
    - **Example**
        | Genre           | Borrow Count |
        | --------------- | ------------ |
        | Mystery         | 3            |
        | Science Fiction | 1            |
        | Technology      | 1            |

    - The genre preference score is calculated from the borrowing frequency ratio
    - Books belonging to frequently borrowed genres receive additional weighting.

- **Purpose**
    - To reinforce proven user preferences while maintaining recommendation relevance
</details>



<details>
<summary>Step 5: Generate Final Recommendation Score</summary>

<img src="../../Image/Functions/TF-IDF_CalculateFunction.png" style="width:95%;"/><br>

- **Explanation**
    - The final ranking score combines:
        - Final Score = (0.7 x Content Similarity) + (0.3 x Genre Preference)

    - **Where**
        - Content Similarity = TF-IDF + Cosine Similarity result
        - Genre Preference = User borrowing frequency ratio

- **Purpose**
    - To balance content relevance and historical user preference
</details>



<details>
<summary>Step 6: Filter and Rank Results</summary>

- **Explanation**
    - Before returning results, the system:
        - Excludes books already borrowed by the user
        - Applies a small random tie-breaker for identical scores
        - Sorts recommendations by final score

     The top 8 highest-ranked books are returned to the user interface
</details>


## Why TF-IDF?

#### TF-IDF Technology Justification
- TF-IDF was selected because it:
    - Performs effectively on small and medium-sized datasets
    - Requires minimal computational resources
    - Does not require model training
    - Produces explainable recommendation scores
    - Supports real-time recommendation generation

- For the current library catalogue size, TF-IDF provides an appropriate balance between recommendation quality and implementation complexity

**Remarks**
- Recent Interest Strategy
    - Only the latest five loan records are analysed in order to:

    - Reflect current reading behaviour
    - Reduce computational overhead
    - Improve response time



#### Discovery vs Loyalty Balance
- The recommendation model adopts a hybrid scoring strategy
    - 70% Content Similarity
    - 30% Genre Preference

- This weighting allows the engine to recommend
    - New books with similar characteristics
    - Books from genres frequently selected by the user

- As a result, recommendations remain both relevant and diverse
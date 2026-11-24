type ScoreType = { id: string; score: number }[];

export interface BookCorpusEntry 
{
    id: string;
    metadata: string;
    genre: string;
}

type BookCorpusType = BookCorpusEntry[];

// Calculate TF (Term Frequency)
const termFrequency = (term: string, doc: string[]): number =>
{
    const count = doc.filter(t => t === term).length;
    return count / doc.length;
}

// Calcuate IDF (Inverse Document Frequency)
const inverseDocumentFrequency = (term: string, docs: string[][]): number =>
{
    const numDocsWithTerm = docs.filter(doc => doc.includes(term)).length;
    return Math.log(docs.length / (1 + numDocsWithTerm));
}

// Cosine Similarity (Data Comparing)
const cosineSimilarity = (userVector: number[], bookVector: number[]): number =>
{
    // Measure feature overlap between user preferences and candidate books
    const dotProduct  = userVector.reduce((sum, a, i) => sum + a * bookVector[i], 0);

    // Vector length used for cosine similarity normalisation
    const userVectorMagnitude  = Math.sqrt(bookVector.reduce((sum, a) => sum + a * a, 0));
    // Vector length used for cosine similarity normalisation
    const candidateVectorMagnitude  = Math.sqrt(bookVector.reduce((sum, b) => sum + b * b, 0));
    
    return userVectorMagnitude && candidateVectorMagnitude ? dotProduct / (userVectorMagnitude * candidateVectorMagnitude) : 0;
}

export const calculateTFIDF = (loanCorpus: string[], allBooksCorpus: BookCorpusType, genreFrequencyMap: Map<string, number>, totalUserLoans: number ): ScoreType => 
{
    // return if there are no loan records
    if (totalUserLoans === 0) return [];

    const userDoc = loanCorpus.join(" ").split(/\s+/);
    const docs = [userDoc, ...allBooksCorpus.map(b => b.metadata.split(/\s+/))];

    const vocab = Array.from(new Set(docs.flat()));

    const userVector = vocab.map(term => termFrequency(term, userDoc) * inverseDocumentFrequency(term, docs));

    const scores: ScoreType = allBooksCorpus.map((book) => 
    {
        const doc = book.metadata.split(/\s+/);
        const docVector = vocab.map(term => termFrequency(term, doc) * inverseDocumentFrequency(term, docs));
        const tfidfScore = cosineSimilarity(userVector, docVector);

        const genreCount = genreFrequencyMap.get(book.genre) || 0;
        
        const genreWeight = genreCount / totalUserLoans;

        const finalScore = (0.7 * tfidfScore) + (0.3 * genreWeight);

        return { id: book.id, score: finalScore };
    });

    return scores.sort((a, b) => b.score - a.score);
};


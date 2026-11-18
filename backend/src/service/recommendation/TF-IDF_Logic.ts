type ScoreType = { id: string; score: number }[];
type BookCorpusType = { id: string; metadata: string }[];

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
const cosineSimilarity = (vecA: number[], vecB: number[]): number =>
{
    const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return magA && magB ? dot / (magA * magB) : 0;
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

        const currentBookGenre = doc[1];
        const genreCount = genreFrequencyMap.get(currentBookGenre) || 0;
        
        const genreWeight = genreCount / totalUserLoans;

        const finalScore = (0.7 * tfidfScore) + (0.3 * genreWeight);

        return { id: book.id, score: finalScore };
    });

    return scores.sort((a, b) => b.score - a.score);
};


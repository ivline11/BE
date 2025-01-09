from fastapi import FastAPI, HTTPException # type: ignore
from pydantic import BaseModel
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import random

app = FastAPI()

# 임시 단어 
WORD_DATABASE = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew"]

class WordRequest(BaseModel):
    input_word: str

def calculate_similarity(input_word: str, word_list: list[str]) -> list[dict]:

    input_vector = np.array([[ord(char) for char in input_word]])
    word_vectors = [np.array([ord(char) for char in word]) for word in word_list]


    max_length = max(len(input_word), max(len(word) for word in word_list))
    input_vector = np.pad(input_vector, ((0, 0), (0, max_length - input_vector.shape[1])), constant_values=0)
    word_vectors = [np.pad(w, (0, max_length - len(w)), constant_values=0) for w in word_vectors]

 
    similarities = cosine_similarity([input_vector[0]], word_vectors)[0]
    return [{"word": word, "similarity": sim} for word, sim in zip(word_list, similarities)]


@app.get("/select-word")
async def select_word():
    
    selected_word = random.choice(WORD_DATABASE)
    return {"selected_word": selected_word}

@app.post("/similar-words")
async def similar_words(request: WordRequest):
    try:
        input_word = request.input_word
        if input_word not in WORD_DATABASE:
            raise HTTPException(status_code=400, detail="Word not found in database.")
        
        similarities = calculate_similarity(input_word, WORD_DATABASE)
        sorted_words = sorted(similarities, key=lambda x: x["similarity"], reverse=True)[:1000]
        return {"similar_words": sorted_words}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

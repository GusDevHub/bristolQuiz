//define shuffleArray function that takes an array as input
export const shuffleArray = (array) => {
    //loop backwards through the array, starting from the last element
    for (let i = array.length - 1; i > 0; i--) {
        //generate a random index between 0 and i (inclusive)
        const j = Math.floor(Math.random() * (i + 1));
        //swap the elements at indices i and j
        [array[i], array[j]] = [array[j], array[i]]
    }
    //return the array
    return array
}
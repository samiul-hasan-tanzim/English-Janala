
const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then((res) => res.json())
        .then((json) => displayLessons(json.data));
}
loadLessons()


const removeActive = () => {
    const levelContainer = document.getElementById('level-container')
    const primatyBtn = levelContainer.querySelectorAll('.btn-primary')
    primatyBtn.forEach((btn) => btn.classList.add('btn-soft'))
}



// ------------------------29-4 Load Words by Level and Display Cards------------------------
const loadLevelWord = (id) => {
    // console.log(id)
    manageSpinner(true)
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    // console.log(url)
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            removeActive()
            const clickedBtn = document.getElementById(`lesson-btn-${id}`)
            clickedBtn.classList.remove("btn-soft")
            // console.log(clickedBtn)
            displayLevelWord(data.data)
        })
}
const displayLevelWord = (words) => {
    const wordContaner = document.getElementById('word-container')
    wordContaner.innerHTML = ''

    if (words.length == 0) {
        wordContaner.innerHTML = `
        <div class="text-center col-span-full rounded-xl py-10 space-y-6 font-bangla">
            <img class='mx-auto' src='./assets/alert-error.png'>
            <p class="text-xl font-medium text-gray-400 ">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
        </div>
        `
        manageSpinner(false)
        return;
    }

    words.forEach(word => {
        // console.log(word)
        const card = document.createElement('div')
        card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 max-w-100">
            <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>     <!-- conditional rendering -->
            <p class="font-semibold">Meaning | Pronunciation</p>
            <div class="text-2xl font-medium">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} | ${word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায়নি"}"</div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `
        wordContaner.append(card)
        manageSpinner(false)
    });
}

// ------------------------29-4 Load Words by Level and Display Cards---------------end-----

const displayLessons = (lessons) => {
    // 1. get the cntainer & empty
    const levelContainer = document.getElementById('level-container')
    levelContainer.innerHTML = ''

    // 2. get into every lessons
    for (const lesson of lessons) {
        // 3. create element
        const btnDiv = document.createElement('div')
        // btnDiv.classList.add('flex gap-10')
        btnDiv.innerHTML = `
        <button id ="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-soft btn-primary"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
        `
        // 4. append into container
        levelContainer.appendChild(btnDiv)
    }

}
// loadLessons()



const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    const res = await fetch(url)
    const detailes = await res.json()
    displayWORDSdetailes(detailes.data)
}

const displayWORDSdetailes = (word) => {
    const wordContainer = document.getElementById('detailes-container')
    wordContainer.innerHTML = `
    <div>
                    <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation})</h2>
                </div>
                <div>
                    <h2 class="font-bold">Meaning</h2>
                    <p>${word.meaning}</p>
                </div>
                <div>
                    <h2 class="font-bold">Example</h2>
                    <p>${word.sentence}</p>
                </div>
                <div>
                    <h2 class="text-2xl font-bold">Synonym</h2>
                    <div>${createElement(word.synonyms)}</div>
                </div>
    `
    document.getElementById('word_modal').showModal()
}

const createElement = (arr) => {
    const htmlEleent = arr.map((el) => `<span class= 'btn'>${el}</span>`)
    return htmlEleent.join(" ")
}


const manageSpinner = (status) => {
    if (status) {
        document.getElementById('spinner').classList.remove('hidden')
        document.getElementById('word-container').classList.add('hidden')
    }
    else {
        document.getElementById('spinner').classList.add('hidden')
        document.getElementById('word-container').classList.remove('hidden')
    }
}



document.getElementById("btn-search").addEventListener('click', () => {
    removeActive()
    const input = document.getElementById('input-search')
    const searchValue = input.value.trim().toLowerCase()
    console.log(searchValue)

    fetch('https://openapi.programming-hero.com/api/words/all')
        .then((res) => res.json())
        .then((data) => {
            const allWords = data.data;
            console.log(allWords)
            const filterWord = allWords.filter((word) => word.word.toLowerCase().includes(searchValue))
            displayLevelWord(filterWord)
        })

})



function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
}
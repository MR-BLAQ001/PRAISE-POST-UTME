import { makeQuestions, type SeedRow } from "@/lib/questions/helpers";

const rows: SeedRow[] = [
  // Grammar
  ["Grammar", "easy", "Choose the correct option: Neither the teacher nor the students ___ ready for the assembly.", ["is", "are", "was", "has"], "B", "With 'neither...nor', the verb agrees with the nearer subject, 'students', so the plural verb 'are' is correct."],
  ["Grammar", "easy", "She has been living in Enugu ___ 2015.", ["for", "since", "from", "during"], "B", "'Since' is used with a specific point in time; 'for' is used with a length of time."],
  ["Grammar", "medium", "If I ___ you, I would apologise to the principal immediately.", ["am", "was", "were", "be"], "C", "The subjunctive 'were' is used in hypothetical conditions after 'if I'."],
  ["Grammar", "easy", "The news ___ surprising to everyone in the hall.", ["are", "were", "is", "have been"], "C", "'News' is an uncountable noun that takes a singular verb."],
  ["Grammar", "medium", "He is one of the students who ___ very hard for the examination.", ["works", "work", "has worked", "is working"], "B", "The relative pronoun 'who' refers to 'students', so the plural verb 'work' is required."],
  ["Grammar", "medium", "By next December, Ada ___ her degree programme.", ["completes", "will complete", "will have completed", "has completed"], "C", "The future perfect tense 'will have completed' describes an action finished before a future time."],
  ["Grammar", "hard", "Hardly had the bell rung ___ the students rushed out.", ["than", "when", "then", "that"], "B", "'Hardly...when' is the correct correlative construction."],
  ["Grammar", "easy", "Choose the correctly punctuated sentence.", ["My friend a doctor lives in Abuja.", "My friend, a doctor, lives in Abuja.", "My friend a doctor, lives in Abuja.", "My friend; a doctor lives in Abuja."], "B", "An appositive ('a doctor') is enclosed in commas."],

  // Vocabulary
  ["Vocabulary", "easy", "A person who writes novels is called a ___.", ["playwright", "novelist", "biographer", "columnist"], "B", "A novelist writes novels; a playwright writes plays; a biographer writes lives of people."],
  ["Vocabulary", "medium", "The word 'ephemeral' means ___.", ["lasting forever", "short-lived", "extremely large", "difficult to see"], "B", "Ephemeral describes something lasting for a very short time."],
  ["Vocabulary", "medium", "Choose the word nearest in meaning to 'candid'.", ["secretive", "honest", "rude", "cautious"], "B", "Candid means frank and honest."],
  ["Vocabulary", "medium", "The opposite of 'frugal' is ___.", ["economical", "extravagant", "careful", "simple"], "B", "Frugal means thrifty; its opposite is extravagant."],
  ["Vocabulary", "medium", "The prefix 'audio-' in 'audiovisual' relates to ___.", ["sight", "hearing", "touch", "movement"], "B", "Audio refers to sound or hearing; visual refers to sight."],
  ["Vocabulary", "easy", "A benevolent person is best described as ___.", ["kind", "cruel", "wealthy", "proud"], "A", "Benevolent means well-meaning and kindly."],
  ["Vocabulary", "medium", "Someone who is loquacious ___.", ["talks a lot", "eats a lot", "sleeps a lot", "works a lot"], "A", "Loquacious means very talkative."],
  ["Vocabulary", "medium", "Choose the word nearest in meaning to 'pragmatic'.", ["practical", "poetic", "careless", "stubborn"], "A", "Pragmatic means dealing with things sensibly and practically."],

  // Lexis & Structure
  ["Lexis & Structure", "easy", "Each of the girls ___ a new uniform.", ["have", "has", "are having", "were having"], "B", "'Each' is singular and takes the singular verb 'has'."],
  ["Lexis & Structure", "medium", "The boy, together with his friends, ___ gone to the field.", ["have", "are", "has", "were"], "C", "The subject is 'the boy'; the phrase 'together with his friends' does not change the singular verb."],
  ["Lexis & Structure", "easy", "I look forward to ___ from you soon.", ["hear", "hearing", "heard", "be hearing"], "B", "The preposition 'to' is followed by a gerund, so 'hearing' is correct."],
  ["Lexis & Structure", "medium", "She insisted on ___ the bill herself.", ["pay", "paying", "to pay", "paid"], "B", "A preposition is followed by a gerund: 'insisted on paying'."],
  ["Lexis & Structure", "medium", "The teacher made the students ___ the passage aloud.", ["read", "to read", "reading", "have read"], "A", "After the causative verb 'made', the bare infinitive 'read' is used."],
  ["Lexis & Structure", "medium", "He is used to ___ up early every morning.", ["wake", "waking", "woke", "have woken"], "B", "'Be used to' is followed by a gerund: 'used to waking'."],
  ["Lexis & Structure", "hard", "Not only did she sing beautifully, ___ she also danced gracefully.", ["and", "but", "so", "yet"], "B", "'Not only...but also' is the correct paired conjunction."],
  ["Lexis & Structure", "easy", "Choose the correct question tag: You are coming with us, ___?", ["are you", "aren't you", "don't you", "isn't it"], "B", "A positive statement takes a negative tag using the same auxiliary: 'aren't you?'"],

  // Comprehension
  ["Comprehension", "medium", "Read the passage and answer the question. 'In many Nigerian communities, oral storytelling is more than entertainment. It is a library without shelves, preserving history, values and wisdom across generations.' The main point of the passage is that oral storytelling ___.", ["is only for children", "preserves culture and knowledge", "has replaced written books", "is becoming less popular"], "B", "The passage states that storytelling preserves history, values and wisdom, functioning like a library."],
  ["Comprehension", "medium", "Passage: 'The rain had turned the unpaved road into a ribbon of mud. Passengers pushed the overloaded bus while the driver revved the engine, and by the time they reached the town, everyone was coated in brown.' The tone of the passage is best described as ___.", ["bitter and angry", "humorous and vivid", "sad and mournful", "formal and scientific"], "B", "The vivid, slightly comic description of struggling through mud creates a humorous, vivid tone."],
  ["Comprehension", "hard", "Passage: 'The rain had turned the unpaved road into a ribbon of mud...' The expression 'a ribbon of mud' is an example of ___.", ["hyperbole", "metaphor", "personification", "irony"], "B", "Mud is directly described as a ribbon, creating a metaphor."],
  ["Comprehension", "medium", "Read: 'Education is a lamp that lights the path of a nation. A country that neglects its schools builds its future on sand.' The writer believes education is ___.", ["expensive", "essential to national development", "only for the rich", "a temporary solution"], "B", "The lamp and sand images stress that education is foundational to national development."],
  ["Comprehension", "hard", "Read: 'Education is a lamp that lights the path of a nation.' The figure of speech used here is ___.", ["simile", "metaphor", "onomatopoeia", "alliteration"], "B", "Education is compared to a lamp without using 'like' or 'as', so it is a metaphor."],
  ["Comprehension", "hard", "Read: 'The chairman spoke for an hour without saying anything new. His words were a storm in a teacup.' The writer suggests that the chairman's speech was ___.", ["violent", "impressive", "overblown and empty", "brief"], "C", "A storm in a teacup describes a great fuss about something trivial; combined with 'nothing new', it means overblown and empty."],
  ["Comprehension", "medium", "Read: 'Although the village had no hospital, the nurse's small clinic became a beacon of hope.' The word 'although' signals that the clinic was ___.", ["unnecessary", "remarkable in difficult circumstances", "poorly run", "closed"], "B", "'Although' introduces a contrast: despite the absence of a hospital, the clinic was a source of hope."],
  ["Comprehension", "medium", "Read: 'The candidates entered the hall with pounding hearts. For many, the next two hours would shape their future.' The phrase 'pounding hearts' conveys ___.", ["anger", "nervousness", "excitement about lunch", "confidence"], "B", "Pounding hearts is a physical sign of anxiety or nervousness."],

  // Oral English
  ["Oral English", "medium", "Which word has a different vowel sound from the others?", ["bread", "head", "dead", "bead"], "D", "'Bread', 'head' and 'dead' contain /e/; 'bead' contains /iː/."],
  ["Oral English", "medium", "Which word contains the /ɪə/ sound?", ["near", "nare", "nurse", "nor"], "A", "'Near' is pronounced /nɪə/, containing the centring diphthong /ɪə/."],
  ["Oral English", "easy", "The 'th' in 'think' is pronounced as a ___.", ["voiced dental fricative", "voiceless dental fricative", "voiced alveolar plosive", "voiceless velar stop"], "B", "'Think' begins with /θ/, a voiceless dental fricative."],
  ["Oral English", "medium", "In which position does the primary stress fall in the word 'banana'?", ["First syllable", "Second syllable", "Third syllable", "Every syllable equally"], "B", "Banana is stressed on the second syllable: /bəˈnɑːnə/."],
  ["Oral English", "hard", "Which word has a different pronunciation of 'ough' from the others?", ["cough", "rough", "tough", "dough"], "D", "'Cough', 'rough' and 'tough' end with /f/ or /ʌf/ patterns while 'dough' is /dəʊ/."],
  ["Oral English", "medium", "A yes/no question in English normally ends with a ___ intonation.", ["falling", "rising", "level", "falling-rising"], "B", "Yes/no questions typically use a rising intonation at the end."],
  ["Oral English", "medium", "In the word 'photography', the primary stress falls on the ___ syllable.", ["first", "second", "third", "fourth"], "B", "Photography is stressed on the second syllable: pho-TOG-ra-phy."],
  ["Oral English", "easy", "The plural 'boxes' ends with which sound?", ["/s/", "/z/", "/ɪz/", "/ʃ/"], "C", "Words ending in a sibilant take the extra syllable /ɪz/, as in 'boxes'."],

  // Sentence Interpretation
  ["Sentence Interpretation", "easy", "'The early bird catches the worm' means that ___.", ["birds are early risers", "promptness brings advantages", "worms are useful", "latecomers succeed"], "B", "The proverb teaches that acting promptly gives a person an advantage."],
  ["Sentence Interpretation", "medium", "'He has bitten more than he can chew' means he ___.", ["eats too quickly", "has taken on too much", "is very hungry", "has broken a tooth"], "B", "To bite off more than one can chew is to undertake more than one can manage."],
  ["Sentence Interpretation", "medium", "'The ball is in your court' means ___.", ["you should play tennis", "it is your turn to act", "you have lost the game", "the decision is impossible"], "B", "The idiom means that the responsibility for the next action now belongs to you."],
  ["Sentence Interpretation", "easy", "'A stitch in time saves nine' advises us to ___.", ["sew our clothes", "act early to prevent bigger problems", "count to nine", "avoid hard work"], "B", "Dealing with a problem early prevents it from becoming much larger."],
  ["Sentence Interpretation", "medium", "'She let the cat out of the bag' means she ___.", ["released a pet", "revealed a secret", "told a lie", "became angry"], "B", "The idiom means to disclose a secret unintentionally."],
  ["Sentence Interpretation", "hard", "'The chairman's speech was a storm in a teacup' means the speech was ___.", ["very violent", "full of useful ideas", "a great fuss over nothing", "too long"], "C", "The idiom refers to unnecessary excitement about a trivial matter."],
  ["Sentence Interpretation", "medium", "'He is a thorn in the flesh' means he is ___.", ["a source of constant trouble", "a close friend", "a medical doctor", "very thin"], "A", "A thorn in the flesh is a persistent source of annoyance or difficulty."],
  ["Sentence Interpretation", "medium", "'Once bitten, twice shy' means a person who has been hurt ___.", ["becomes bolder", "becomes cautious", "refuses all help", "forgets quickly"], "B", "Experience of harm makes a person more careful in future."],

  // Additional grammar and vocabulary
  ["Grammar", "easy", "The students, as well as their teacher, ___ present at the ceremony.", ["was", "were", "is", "has been"], "B", "The compound subject is plural ('students'), so the plural verb 'were' is used."],
  ["Vocabulary", "hard", "Choose the word nearest in meaning to 'ubiquitous'.", ["everywhere", "rare", "ancient", "hidden"], "A", "Ubiquitous means present or found everywhere."]
];

export const englishQuestions = makeQuestions("english-language", "eng", rows);

import { makeQuestions, type SeedRow } from "@/lib/questions/helpers";

const rows: SeedRow[] = [
  // Drama
  ["Drama", "easy", "A play is written primarily to be ___.", ["read silently", "performed on stage", "sold as a novel", "recited as a poem"], "B", "Drama is a literary form composed for performance by actors before an audience."],
  ["Drama", "easy", "The person who writes a play is called a ___.", ["novelist", "poet", "playwright", "critic"], "C", "A playwright writes plays; Shakespeare is a famous example."],
  ["Drama", "medium", "A speech in which a character reveals private thoughts to the audience alone is called a ___.", ["dialogue", "soliloquy", "monologue to other characters", "prologue"], "B", "A soliloquy is spoken by a character alone on stage, revealing inner thoughts."],
  ["Drama", "medium", "The main character of a tragedy is called the ___.", ["chorus", "protagonist", "antagonist", "narrator"], "B", "The protagonist is the central character; the antagonist opposes them."],
  ["Drama", "medium", "A tragic flaw in a tragic hero is known as ___.", ["hamartia", "hubris", "catharsis", "anagnorisis"], "A", "Hamartia is the error or flaw that leads to the hero's downfall."],
  ["Drama", "medium", "The emotional release experienced by the audience at the end of a tragedy is called ___.", ["catharsis", "peripeteia", "hubris", "pathos"], "A", "Catharsis is the purging of emotions, especially pity and fear."],
  ["Drama", "easy", "Stage directions in a play are usually written in ___.", ["italics or brackets", "capital letters only", "rhyme", "verse"], "A", "Stage directions are conventionally italicised or placed in brackets."],
  ["Drama", "medium", "A group of actors who comment on the action in classical drama is the ___.", ["chorus", "cast", "crew", "ensemble lead"], "A", "The chorus comments on and interprets the action, especially in Greek drama."],
  ["Drama", "medium", "A one-act play has ___.", ["one act", "one scene only", "one character only", "no dialogue"], "A", "A one-act play is complete in a single act."],
  ["Drama", "hard", "Dramatic irony occurs when the audience ___.", ["knows more than the characters on stage", "laughs at a joke", "is surprised by the ending", "cannot hear the actors"], "A", "In dramatic irony, the audience understands a situation that the characters do not."],

  // Poetry
  ["Poetry", "easy", "A poem of fourteen lines is called a ___.", ["sonnet", "ode", "ballad", "haiku"], "A", "A sonnet is a fourteen-line poem, usually with a set rhyme scheme."],
  ["Poetry", "easy", "A group of lines in a poem is called a ___.", ["stanza", "paragraph", "chapter", "sentence"], "A", "Stanzas are the basic grouped units of a poem, like paragraphs in prose."],
  ["Poetry", "medium", "The pattern of stressed and unstressed syllables in poetry is called ___.", ["rhythm", "rhyme", "alliteration", "onomatopoeia"], "A", "Rhythm is the measured flow of stressed and unstressed syllables."],
  ["Poetry", "medium", "'The moon walked across the silent sky' is an example of ___.", ["personification", "simile", "hyperbole", "alliteration"], "A", "The moon is given the human ability to walk, so it is personified."],
  ["Poetry", "easy", "A word that imitates the sound it describes is called ___.", ["onomatopoeia", "metaphor", "irony", "assonance"], "A", "Examples include 'buzz', 'hiss' and 'bang'."],
  ["Poetry", "medium", "A comparison using 'like' or 'as' is a ___.", ["simile", "metaphor", "personification", "hyperbole"], "A", "A simile compares two things using 'like' or 'as'."],
  ["Poetry", "medium", "The repetition of initial consonant sounds is called ___.", ["alliteration", "assonance", "consonance", "rhyme"], "A", "Alliteration is the repetition of initial consonant sounds, as in 'slippery slope'."],
  ["Poetry", "medium", "An ode is a poem that ___.", ["praises or celebrates someone or something", "tells a comic story", "is always sad", "has no rhyme"], "A", "An ode is a formal lyric poem praising a person, object or idea."],
  ["Poetry", "hard", "The volta in a sonnet refers to the ___.", ["turn in thought or argument", "rhyme scheme", "number of lines", "poet's name"], "A", "The volta is a shift in tone, argument or perspective, often between the octave and sestet."],
  ["Poetry", "medium", "Enjambment occurs when a sentence ___.", ["runs from one line into the next without a pause", "ends at the end of a line", "has no punctuation", "rhymes internally"], "A", "Enjambment carries a sentence across a line break without a pause."],

  // Prose
  ["Prose", "easy", "A long narrative work of fiction is called a ___.", ["novel", "poem", "play", "essay"], "A", "A novel is an extended fictional prose narrative."],
  ["Prose", "medium", "The perspective from which a story is told is called the ___.", ["point of view", "plot", "setting", "theme"], "A", "Point of view describes who narrates and how much they know."],
  ["Prose", "easy", "The sequence of events in a story is the ___.", ["plot", "setting", "theme", "style"], "A", "Plot is the arranged sequence of events and conflicts in a narrative."],
  ["Prose", "easy", "The time and place in which a story occurs is the ___.", ["setting", "plot", "climax", "tone"], "A", "Setting is the social and physical environment of the narrative."],
  ["Prose", "medium", "A story within a story is called a ___.", ["frame narrative", "flashback", "fable", "parody"], "A", "A frame narrative encloses one or more inner stories."],
  ["Prose", "medium", "The central idea or message of a literary work is its ___.", ["theme", "plot", "setting", "character"], "A", "Theme is the underlying idea or insight explored by a text."],
  ["Prose", "medium", "A character who changes significantly during a story is a ___.", ["dynamic character", "flat character", "static character", "stock character"], "A", "Dynamic characters develop or change because of events."],
  ["Prose", "medium", "An omniscient narrator ___.", ["knows everything about the characters and events", "participates in the story", "knows only one character's thoughts", "is unreliable"], "A", "Omniscient means 'all-knowing'; the narrator has access to all minds and events."],
  ["Prose", "hard", "A novel that traces a character's growth from childhood to maturity is called a ___.", ["bildungsroman", "gothic novel", "epistolary novel", "satire"], "A", "Bildungsroman is a coming-of-age novel focused on personal development."],
  ["Prose", "easy", "A short story is usually ___.", ["shorter than a novel with fewer characters and events", "always non-fiction", "written only in verse", "performed on stage"], "A", "A short story is a brief fictional narrative, often focused on a single incident."],

  // Literary Terms
  ["Literary Terms", "easy", "A metaphor is a direct comparison that ___.", ["uses 'like' or 'as'", "does not use 'like' or 'as'", "imitates sound", "repeats vowels"], "B", "A metaphor states that one thing is another without using 'like' or 'as'."],
  ["Literary Terms", "easy", "Exaggeration for emphasis is called ___.", ["hyperbole", "litotes", "irony", "oxymoron"], "A", "Hyperbole is deliberate exaggeration, such as 'I have told you a million times'."],
  ["Literary Terms", "medium", "An oxymoron combines ___.", ["two contradictory terms", "two rhyming lines", "two narrators", "two settings"], "A", "An oxymoron joins opposite ideas, such as 'bitter-sweet'."],
  ["Literary Terms", "medium", "A figure of speech in which an idea is expressed as less than it is, often by denying the opposite, is ___.", ["litotes", "hyperbole", "metonymy", "synecdoche"], "A", "Litotes uses understatement through negation, e.g. 'not bad' for 'very good'."],
  ["Literary Terms", "medium", "Substituting a related term for something (e.g. 'the crown' for the monarchy) is ___.", ["metonymy", "simile", "onomatopoeia", "allusion"], "A", "Metonymy replaces a thing with something closely associated with it."],
  ["Literary Terms", "medium", "A reference to a well-known person, event or text is an ___.", ["allusion", "illusion", "allegory", "alliteration"], "A", "Allusion is an indirect reference to something outside the text."],
  ["Literary Terms", "easy", "Irony involves a contrast between ___.", ["appearance and reality", "two rhymes", "two settings", "two stanzas"], "A", "Irony arises from a contrast between expectation and reality or meaning and saying."],
  ["Literary Terms", "medium", "An allegory is a story in which ___.", ["characters and events have symbolic meaning", "all characters are animals", "nothing is symbolic", "the ending is always sad"], "A", "An allegory uses a narrative to convey a deeper moral or political meaning."],
  ["Literary Terms", "medium", "The repetition of vowel sounds within nearby words is called ___.", ["assonance", "alliteration", "consonance", "rhyme"], "A", "Assonance repeats vowel sounds, as in 'the rain in Spain'."],
  ["Literary Terms", "hard", "A motif is ___.", ["a recurring image, idea or symbol", "the main character", "the final line", "a type of play"], "A", "A motif is a repeated element that develops a theme."],

  // African Literature
  ["African Literature", "medium", "Chinua Achebe's 'Things Fall Apart' is set in ___.", ["Igbo society before and during colonial contact", "Lagos in the 1990s", "ancient Egypt", "apartheid South Africa"], "A", "The novel portrays Igbo life in Umuofia and the arrival of British colonial rule."],
  ["African Literature", "medium", "The protagonist of 'Things Fall Apart' is ___.", ["Okonkwo", "Obi", "Ezeulu", "Unoka"], "A", "Okonkwo is the proud, forceful protagonist of Achebe's novel."],
  ["African Literature", "medium", "Wole Soyinka is best known as a ___.", ["playwright and poet", "novelist only", "historian", "journalist"], "A", "Soyinka is a Nobel-winning playwright, poet and essayist."],
  ["African Literature", "medium", "'The Lion and the Jewel' was written by ___.", ["Wole Soyinka", "Chinua Achebe", "Ngũgĩ wa Thiong'o", "Femi Osofisan"], "A", "Soyinka's play is set in the village of Ilujinle."],
  ["African Literature", "medium", "In 'The Lion and the Jewel', the 'lion' refers to ___.", ["Lakunle", "Baroka", "Sadiku", "Sidi"], "B", "Baroka, the Bale of Ilujinle, is the 'lion', while Sidi, the beautiful village girl, is the 'jewel'."],
  ["African Literature", "easy", "The author of 'Purple Hibiscus' is ___.", ["Chimamanda Ngozi Adichie", "Buchi Emecheta", "Ama Ata Aidoo", "Tsitsi Dangarembga"], "A", "Adichie published 'Purple Hibiscus' in 2003."],
  ["African Literature", "medium", "'Second Class Citizen' is a novel by ___.", ["Buchi Emecheta", "Chimamanda Ngozi Adichie", "Mariama Bâ", "Sefi Atta"], "A", "Buchi Emecheta's novel follows Adah's life in Nigeria and London."],
  ["African Literature", "medium", "Ngũgĩ wa Thiong'o's 'The River Between' explores conflict between ___.", ["tradition and Christianity", "two football clubs", "city and village police", "two universities"], "A", "The novel dramatises the clash between Gikuyu tradition and colonial Christianity."],
  ["African Literature", "medium", "A major theme of much postcolonial African literature is ___.", ["identity and the effects of colonialism", "space travel", "medieval chivalry", "industrial accounting"], "A", "Postcolonial writing often interrogates identity, power, language and colonial legacies."],
  ["African Literature", "hard", "'The beautyful ones are not yet born' (Ayi Kwei Armah) is an example of ___.", ["post-independence disillusionment fiction", "romantic comedy", "epic poetry", "children's literature"], "A", "The novel critiques corruption and dashed hopes in post-independence Ghana."]
];

export const literatureQuestions = makeQuestions("literature-in-english", "lit", rows);

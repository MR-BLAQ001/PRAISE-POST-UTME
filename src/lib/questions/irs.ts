import { makeQuestions, type SeedRow } from "@/lib/questions/helpers";

const rows: SeedRow[] = [
  // Qur'an
  ["Qur'an", "easy", "The Qur'an was revealed to Prophet ___.", ["Musa", "Isa", "Muhammad", "Ibrahim"], "C", "Muslims believe the Qur'an was revealed to Prophet Muhammad through Angel Jibril."],
  ["Qur'an", "easy", "The first verses revealed to the Prophet were from Surah ___.", ["Al-Fatiha", "Al-Alaq", "Al-Baqarah", "An-Nas"], "B", "The first revelation began with 'Iqra' (Read) in Surah Al-Alaq."],
  ["Qur'an", "easy", "The Qur'an contains ___ surahs.", ["99", "100", "114", "120"], "C", "The Qur'an has 114 surahs."],
  ["Qur'an", "easy", "The longest surah of the Qur'an is ___.", ["Al-Fatiha", "Al-Baqarah", "An-Nas", "Al-Kawthar"], "B", "Surah Al-Baqarah is the longest surah."],
  ["Qur'an", "medium", "The shortest surah of the Qur'an is ___.", ["Al-Ikhlas", "Al-Kawthar", "Al-Asr", "An-Nas"], "B", "Surah Al-Kawthar has only three verses and is the shortest surah."],
  ["Qur'an", "medium", "The Qur'an was revealed over a period of about ___ years.", ["10", "15", "23", "40"], "C", "The revelation came over approximately 23 years."],
  ["Qur'an", "easy", "The language of the Qur'an is ___.", ["Hebrew", "Arabic", "Aramaic", "Persian"], "B", "The Qur'an was revealed in Arabic."],
  ["Qur'an", "easy", "The first surah in the Qur'an is ___.", ["Al-Baqarah", "Al-Fatiha", "Al-Ikhlas", "An-Nas"], "B", "Surah Al-Fatiha opens the Qur'an."],
  ["Qur'an", "easy", "The last surah in the Qur'an is ___.", ["Al-Falaq", "An-Nas", "Al-Ikhlas", "Al-Kawthar"], "B", "Surah An-Nas is the final surah."],
  ["Qur'an", "medium", "The Qur'an is divided into ___ juz'.", ["20", "30", "40", "60"], "B", "The Qur'an is divided into thirty juz' for recitation."],
  ["Qur'an", "easy", "A verse of the Qur'an is called an ___.", ["ayah", "surah", "juz'", "hadith"], "A", "An ayah is a verse; a surah is a chapter."],
  ["Qur'an", "medium", "Makkan surahs are those revealed ___.", ["after the hijrah", "before the hijrah", "only in Madinah", "during the Hajj"], "B", "Makkan surahs were revealed before the Prophet's migration to Madinah."],
  ["Qur'an", "medium", "The preservation of the Qur'an was achieved through both writing and ___.", ["translation", "memorisation", "printing", "interpretation only"], "B", "Memorisation and written compilation have preserved the Qur'an."],

  // Hadith
  ["Hadith", "easy", "A hadith is a record of the ___ of Prophet Muhammad.", ["words and actions", "family tree", "business dealings only", "travels"], "A", "Hadith reports the Prophet's sayings, actions and approvals."],
  ["Hadith", "medium", "The most renowned compiler of hadith is ___.", ["Imam Bukhari", "Imam Malik", "Ibn Khaldun", "Al-Ghazali"], "A", "Imam Muhammad al-Bukhari compiled Sahih al-Bukhari."],
  ["Hadith", "medium", "The six major hadith collections in Sunni Islam are called ___.", ["Kutub al-Sittah", "As-Sihah", "Al-Muwatta", "Tafsir"], "A", "Kutub al-Sittah means the six authentic books of hadith."],
  ["Hadith", "medium", "The chain of narrators of a hadith is known as its ___.", ["matn", "isnad", "tafsir", "ijma"], "B", "Isnad is the chain of transmission; matn is the text."],
  ["Hadith", "medium", "The text or content of a hadith is called the ___.", ["isnad", "matn", "sanad", "hadith qudsi"], "B", "Matn is the actual wording of the report."],
  ["Hadith", "hard", "A hadith qudsi is one in which ___.", ["the wording is from God but transmitted by the Prophet", "the chain is missing", "only the companions spoke", "the Prophet wrote it himself"], "A", "A hadith qudsi conveys words attributed to God while the wording is from the Prophet."],
  ["Hadith", "easy", "The Sunnah refers to the ___ of the Prophet.", ["practice and example", "family lineage", "military campaigns only", "trade routes"], "A", "The Sunnah is the Prophet's normative example, recorded in hadith."],
  ["Hadith", "medium", "Sahih Muslim is a collection compiled by ___.", ["Imam Muslim", "Imam Bukhari", "Imam Tirmidhi", "Imam Abu Dawud"], "A", "Imam Muslim ibn al-Hajjaj compiled Sahih Muslim."],
  ["Hadith", "easy", "The hadith 'Actions are judged by intentions' teaches the importance of ___.", ["sincerity", "wealth", "speed", "publicity"], "A", "Intentions determine the moral value of actions in Islamic teaching."],
  ["Hadith", "easy", "The Prophet taught that seeking knowledge is ___ for every Muslim.", ["optional", "obligatory", "forbidden", "unnecessary"], "B", "Seeking beneficial knowledge is regarded as an obligation."],
  ["Hadith", "easy", "Islam places great emphasis on kindness to ___.", ["parents", "strangers only", "the wealthy", "rulers only"], "A", "The Qur'an and hadith repeatedly command excellence toward parents."],
  ["Hadith", "medium", "Which of these is one of the six authentic hadith collections?", ["Sahih al-Bukhari", "Al-Muwatta only", "Tafsir al-Tabari", "Sirat Ibn Hisham"], "A", "Sahih al-Bukhari is the first of the Kutub al-Sittah."],

  // Islamic Jurisprudence
  ["Islamic Jurisprudence", "easy", "Islamic law is known as ___.", ["Shari'ah", "Fiqh only", "Tafsir", "Tajwid"], "A", "Shari'ah is the divinely guided law; fiqh is its human juristic understanding."],
  ["Islamic Jurisprudence", "medium", "Fiqh is best described as ___.", ["the understanding and application of Islamic law by jurists", "the recitation of the Qur'an", "the biography of the Prophet", "Arabic grammar"], "A", "Fiqh is the jurisprudence developed by scholars from primary sources."],
  ["Islamic Jurisprudence", "easy", "The five pillars of Islam are Shahadah, Salah, Zakah, Sawm and ___.", ["Hajj", "Jihad", "Wudu", "Tawbah"], "A", "Hajj is the fifth pillar, performed once in a lifetime if able."],
  ["Islamic Jurisprudence", "easy", "The declaration of faith in Islam is called ___.", ["Shahadah", "Salah", "Zakah", "Sawm"], "A", "Shahadah is the testimony that there is no god but Allah and Muhammad is His messenger."],
  ["Islamic Jurisprudence", "easy", "Muslims observe ___ obligatory daily prayers.", ["three", "four", "five", "seven"], "C", "The five daily prayers are Fajr, Zuhr, Asr, Maghrib and Isha."],
  ["Islamic Jurisprudence", "medium", "Zakah is generally ___ of eligible savings held for a lunar year.", ["2.5%", "5%", "10%", "20%"], "A", "Zakah on monetary savings above the nisab is 2.5%."],
  ["Islamic Jurisprudence", "easy", "Fasting during Ramadan is called ___.", ["Sawm", "Hajj", "Zakah", "Salah"], "A", "Sawm is the fast observed from dawn to sunset in Ramadan."],
  ["Islamic Jurisprudence", "easy", "Hajj is performed in the month of ___.", ["Ramadan", "Dhul-Hijjah", "Muharram", "Shawwal"], "B", "Hajj takes place in Dhul-Hijjah, the twelfth Islamic month."],
  ["Islamic Jurisprudence", "medium", "Wudu is ___.", ["ritual ablution before prayer", "the call to prayer", "charitable giving", "a pilgrimage"], "A", "Wudu is the ritual washing required before Salah."],
  ["Islamic Jurisprudence", "easy", "Permissible acts in Islam are described as ___.", ["halal", "haram", "makruh", "bid'ah"], "A", "Halal means permissible; haram means forbidden."],
  ["Islamic Jurisprudence", "hard", "Ijma in Islamic jurisprudence refers to ___.", ["consensus of qualified scholars", "analogical reasoning", "individual opinion", "custom"], "A", "Ijma is the consensus of scholars on a legal issue."],
  ["Islamic Jurisprudence", "hard", "Qiyas is a method of ___.", ["analogical deduction", "reciting the Qur'an", "narrating hadith", "performing Hajj"], "A", "Qiyas derives rulings for new cases by analogy with established ones."],
  ["Islamic Jurisprudence", "medium", "The four major Sunni schools of jurisprudence include Hanafi, Maliki and ___.", ["Shafi'i and Hanbali", "Ja'fari and Zaidi", "Ibadi and Sufi", "Ash'ari and Maturidi"], "A", "The four Sunni madhahib are Hanafi, Maliki, Shafi'i and Hanbali."],

  // Islamic History
  ["Islamic History", "easy", "Prophet Muhammad was born in ___.", ["Madinah", "Makkah", "Ta'if", "Jerusalem"], "B", "The Prophet was born in Makkah around 570 CE."],
  ["Islamic History", "easy", "The Hijrah was the migration of the Prophet to ___.", ["Madinah", "Ta'if", "Yemen", "Syria"], "A", "The Hijrah from Makkah to Madinah occurred in 622 CE and marks the Islamic calendar."],
  ["Islamic History", "medium", "The Battle of Badr took place in ___ AH.", ["1", "2", "5", "8"], "B", "Badr was fought in the second year after the Hijrah."],
  ["Islamic History", "easy", "The first caliph after the Prophet was ___.", ["Abu Bakr", "Umar", "Uthman", "Ali"], "A", "Abu Bakr as-Siddiq became the first caliph in 632 CE."],
  ["Islamic History", "easy", "The second caliph of Islam was ___.", ["Umar ibn al-Khattab", "Abu Bakr", "Ali", "Uthman"], "A", "Umar ibn al-Khattab succeeded Abu Bakr."],
  ["Islamic History", "medium", "The third caliph of Islam was ___.", ["Uthman ibn Affan", "Umar", "Ali", "Abu Bakr"], "A", "Uthman ibn Affan was the third caliph and supervised the standardisation of the Qur'an."],
  ["Islamic History", "medium", "The fourth caliph of Islam was ___.", ["Ali ibn Abi Talib", "Uthman", "Mu'awiyah", "Umar"], "A", "Ali ibn Abi Talib was the fourth of the Rightly Guided Caliphs."],
  ["Islamic History", "easy", "The first muezzin in Islam was ___.", ["Bilal ibn Rabah", "Abu Bakr", "Hamza", "Khalid"], "A", "Bilal ibn Rabah was known for giving the call to prayer."],
  ["Islamic History", "easy", "The first wife of Prophet Muhammad was ___.", ["Khadijah", "Aisha", "Hafsa", "Zainab"], "A", "Khadijah bint Khuwaylid was the Prophet's first wife and first supporter."],
  ["Islamic History", "medium", "The conquest of Makkah occurred in ___ CE.", ["622", "624", "630", "632"], "C", "The peaceful conquest of Makkah took place around 630 CE."],
  ["Islamic History", "medium", "Timbuktu became an important centre of Islamic learning in ___.", ["Mali", "Egypt", "Morocco", "Turkey"], "A", "Timbuktu in Mali was a renowned centre of scholarship and trade."],
  ["Islamic History", "medium", "The oldest continuously operating university, founded by Fatima al-Fihri, is in ___.", ["Fez, Morocco", "Cairo, Egypt", "Istanbul, Turkey", "Damascus, Syria"], "A", "Al-Qarawiyyin in Fez was founded in 859 CE."]
];

export const irsQuestions = makeQuestions("islamic-religious-studies", "irs", rows);

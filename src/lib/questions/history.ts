import { makeQuestions, type SeedRow } from "@/lib/questions/helpers";

const rows: SeedRow[] = [
  // Pre-colonial Nigeria
  ["Pre-colonial Nigeria", "easy", "The Nok culture is famous for its ___.", ["terracotta figurines", "bronze masks", "stone churches", "iron ships"], "A", "The Nok civilisation produced distinctive terracotta figures and early iron technology."],
  ["Pre-colonial Nigeria", "easy", "The Benin Kingdom is renowned for its ___.", ["bronze artworks", "pyramids", "sugarcane plantations", "railways"], "A", "Benin bronzes are celebrated works of African art."],
  ["Pre-colonial Nigeria", "medium", "The title of the ruler of the Oyo Empire was ___.", ["Alaafin", "Oba of Benin", "Emir", "Attah"], "A", "The Alaafin was the paramount ruler of Oyo."],
  ["Pre-colonial Nigeria", "medium", "The Kanem-Bornu Empire flourished around ___.", ["Lake Chad", "the Niger Delta", "the Jos Plateau", "Lagos Lagoon"], "A", "Kanem-Bornu centred on the Lake Chad basin and trans-Saharan trade."],
  ["Pre-colonial Nigeria", "medium", "The Sokoto Caliphate was founded by ___.", ["Usman dan Fodio", "Oba Ewuare", "Jaja of Opobo", "Herbert Macaulay"], "A", "Usman dan Fodio led the jihad that established the Sokoto Caliphate in 1804."],
  ["Pre-colonial Nigeria", "hard", "The Igbo-Ukwu archaeological site is significant for evidence of ___.", ["early bronze working and ritual objects", "Portuguese forts", "railway construction", "Christian missions"], "A", "Igbo-Ukwu yielded sophisticated bronze and copper artefacts dated to the 9th century."],
  ["Pre-colonial Nigeria", "medium", "The trans-Saharan trade linked West Africa with North Africa mainly through ___.", ["caravan routes", "sea lanes", "railways", "air travel"], "A", "Camels and caravans carried goods such as gold, salt and textiles across the Sahara."],
  ["Pre-colonial Nigeria", "medium", "The Ife kingdom is famous for its ___.", ["naturalistic bronze and terracotta heads", "stone castles", "textile factories", "Islamic universities"], "A", "Ife art is noted for its refined naturalistic heads."],
  ["Pre-colonial Nigeria", "medium", "The Aro Confederacy was a powerful trading network among the ___.", ["Igbo", "Hausa", "Nupe", "Ijaw"], "A", "The Aro controlled trade and the oracle at Arochukwu in Igboland."],
  ["Pre-colonial Nigeria", "easy", "The Oba was the ruler of the ___.", ["Benin Kingdom", "Sokoto Caliphate", "Kanem-Bornu", "Nok culture"], "A", "The Oba was the paramount ruler of Benin."],
  ["Pre-colonial Nigeria", "medium", "Traditional Igbo political organisation was largely ___.", ["republican and decentralised", "centralised under one king", "ruled by emirs", "governed by a sultan"], "A", "Many Igbo communities governed themselves through councils of elders and age grades."],
  ["Pre-colonial Nigeria", "hard", "The Nupe kingdom was located mainly in the present-day ___.", ["Niger State", "Cross River State", "Akwa Ibom State", "Ogun State"], "A", "The Nupe are centred in the Bida area of present-day Niger State."],
  ["Pre-colonial Nigeria", "medium", "Long-distance trade in pre-colonial Nigeria was facilitated by ___.", ["markets and trade routes", "the internet", "the railway", "airports"], "A", "Regional markets and caravan routes connected communities and kingdoms."],

  // Colonial Nigeria
  ["Colonial Nigeria", "easy", "The Berlin Conference of 1884–1885 was convened to ___.", ["partition Africa among European powers", "end the slave trade", "create the United Nations", "grant Nigerian independence"], "A", "European powers agreed on rules for the partition and colonisation of Africa."],
  ["Colonial Nigeria", "medium", "The Royal Niger Company administered parts of Nigeria before ___.", ["direct British colonial rule", "independence", "the civil war", "the republic"], "A", "The company's charter was revoked in 1900, transferring territory to the Crown."],
  ["Colonial Nigeria", "easy", "The amalgamation of Northern and Southern Nigeria took place in ___.", ["1900", "1914", "1922", "1946"], "B", "Lord Frederick Lugard amalgamated the two protectorates in 1914."],
  ["Colonial Nigeria", "medium", "The system of indirect rule was associated with ___.", ["Lord Lugard", "Herbert Macaulay", "Nnamdi Azikiwe", "Obafemi Awolowo"], "A", "Lugard promoted indirect rule through traditional rulers, especially in the North."],
  ["Colonial Nigeria", "medium", "The Aba Women's Riot occurred in ___.", ["1914", "1929", "1945", "1960"], "B", "The 1929 women's protest was against colonial taxation and warrant chiefs."],
  ["Colonial Nigeria", "easy", "The NCNC was led by ___.", ["Herbert Macaulay", "Ahmadu Bello", "Tafawa Balewa", "C. Odumegwu Ojukwu"], "A", "Herbert Macaulay founded the NNDP and later led the NCNC."],
  ["Colonial Nigeria", "medium", "The Action Group was led by ___.", ["Obafemi Awolowo", "Nnamdi Azikiwe", "Ahmadu Bello", "Tafawa Balewa"], "A", "Awolowo founded and led the Action Group, based in the Western Region."],
  ["Colonial Nigeria", "medium", "The Northern People's Congress was led by ___.", ["Ahmadu Bello", "Herbert Macaulay", "Nnamdi Azikiwe", "Obafemi Awolowo"], "A", "Sir Ahmadu Bello was the Sardauna of Sokoto and leader of the NPC."],
  ["Colonial Nigeria", "easy", "Nigeria became independent on ___.", ["1 October 1960", "1 October 1963", "29 May 1999", "15 January 1966"], "A", "Nigeria gained independence from Britain on 1 October 1960."],
  ["Colonial Nigeria", "medium", "Nigeria became a republic in ___.", ["1960", "1963", "1966", "1979"], "B", "Nigeria became a republic on 1 October 1963 with a Nigerian head of state."],
  ["Colonial Nigeria", "medium", "The first military coup in Nigeria took place in ___.", ["1963", "1966", "1970", "1975"], "B", "The January 1966 coup ended the First Republic."],
  ["Colonial Nigeria", "easy", "The Nigerian Civil War lasted from ___.", ["1960 to 1963", "1967 to 1970", "1975 to 1979", "1993 to 1998"], "B", "The civil war was fought between 1967 and 1970."],
  ["Colonial Nigeria", "hard", "The Richards Constitution of 1946 ___.", ["introduced regionalism into Nigeria's legislative structure", "granted immediate independence", "abolished the regions", "created the Fourth Republic"], "A", "The Richards Constitution divided the country into three regions, strengthening regional politics."],

  // Post-independence Nigeria
  ["Post-independence Nigeria", "easy", "Nigeria's first President was ___.", ["Nnamdi Azikiwe", "Tafawa Balewa", "Obafemi Awolowo", "Yakubu Gowon"], "A", "Nnamdi Azikiwe became the first President when Nigeria became a republic in 1963."],
  ["Post-independence Nigeria", "easy", "Nigeria's first Prime Minister was ___.", ["Tafawa Balewa", "Nnamdi Azikiwe", "Herbert Macaulay", "Ahmadu Bello"], "A", "Sir Abubakar Tafawa Balewa served as Nigeria's first Prime Minister."],
  ["Post-independence Nigeria", "medium", "The 1979 Constitution established a ___ system of government.", ["presidential", "parliamentary", "confederal", "monarchical"], "A", "Nigeria adopted an executive presidential system in 1979."],
  ["Post-independence Nigeria", "easy", "Nigeria returned to democratic rule in ___.", ["1979", "1985", "1993", "1999"], "D", "The Fourth Republic began on 29 May 1999."],
  ["Post-independence Nigeria", "medium", "The June 12, 1993 presidential election was annulled by ___.", ["Ibrahim Babangida", "Sani Abacha", "Olusegun Obasanjo", "Yakubu Gowon"], "A", "President Ibrahim Babangida annulled the election widely believed to have been won by MKO Abiola."],
  ["Post-independence Nigeria", "medium", "The presumed winner of the June 12, 1993 election was ___.", ["MKO Abiola", "Tofa", "Obasanjo", "Buhari"], "A", "Moshood Kashimawo Olawale Abiola is widely regarded as the winner."],
  ["Post-independence Nigeria", "medium", "The National Youth Service Corps was established in ___.", ["1960", "1966", "1973", "1999"], "C", "NYSC was created in 1973 to promote national unity."],
  ["Post-independence Nigeria", "medium", "FESTAC '77 was a festival of ___.", ["Black and African arts and culture", "agriculture", "science and technology", "sports"], "A", "The Second World Black and African Festival of Arts and Culture was held in Lagos in 1977."],
  ["Post-independence Nigeria", "medium", "Nigeria's Fourth Republic began with the inauguration of ___ as President.", ["Olusegun Obasanjo", "Umaru Yar'Adua", "Goodluck Jonathan", "Muhammadu Buhari"], "A", "Obasanjo was sworn in on 29 May 1999."],
  ["Post-independence Nigeria", "hard", "One major consequence of military rule in Nigeria was ___.", ["centralisation of political power", "the abolition of the army", "permanent civilian rule", "the end of federalism"], "A", "Successive military governments centralised power and suspended democratic institutions."],
  ["Post-independence Nigeria", "medium", "The current Nigerian constitution was promulgated in ___.", ["1979", "1989", "1999", "2011"], "C", "The 1999 Constitution, as amended, is currently in force."],
  ["Post-independence Nigeria", "medium", "The Nigerian oil boom of the 1970s primarily increased revenue from ___.", ["petroleum", "cocoa", "groundnuts", "palm oil"], "A", "Oil exports became the dominant source of government revenue."],

  // World History
  ["World History", "easy", "The First World War lasted from ___.", ["1914 to 1918", "1939 to 1945", "1900 to 1905", "1920 to 1925"], "A", "World War I was fought from 1914 to 1918."],
  ["World History", "easy", "The Second World War ended in ___.", ["1918", "1939", "1945", "1960"], "C", "World War II ended in 1945."],
  ["World History", "medium", "The French Revolution began in ___.", ["1688", "1776", "1789", "1815"], "C", "The French Revolution began in 1789 with the storming of the Bastille."],
  ["World History", "easy", "The American Declaration of Independence was made in ___.", ["1492", "1776", "1789", "1865"], "B", "The Declaration of Independence was adopted in 1776."],
  ["World History", "medium", "Ancient Egyptian civilisation developed along the ___.", ["Nile River", "Congo River", "Niger River", "Amazon River"], "A", "The Nile's annual floods supported Egyptian agriculture and settlement."],
  ["World History", "medium", "The transatlantic slave trade mainly transported enslaved Africans to ___.", ["the Americas", "Australia", "India", "Japan"], "A", "Millions of Africans were forcibly transported across the Atlantic to the Americas."],
  ["World History", "medium", "The League of Nations was established after ___.", ["the First World War", "the Second World War", "the Cold War", "the French Revolution"], "A", "The League was created in 1920 as part of the post-WWI settlement."],
  ["World History", "medium", "The Cold War was mainly a rivalry between the United States and ___.", ["the Soviet Union", "China", "Japan", "Germany"], "A", "The USA and USSR competed ideologically and geopolitically after 1945."],
  ["World History", "easy", "The Soviet Union dissolved in ___.", ["1989", "1991", "1999", "2000"], "B", "The USSR formally dissolved in December 1991."],
  ["World History", "medium", "Apartheid in South Africa ended with democratic elections in ___.", ["1976", "1990", "1994", "2000"], "C", "South Africa held its first non-racial elections in 1994, electing Nelson Mandela."],
  ["World History", "hard", "The Industrial Revolution began in ___.", ["Britain", "Nigeria", "China", "Brazil"], "A", "Britain was the first country to industrialise in the late eighteenth century."],
  ["World History", "medium", "The Berlin Wall fell in ___.", ["1961", "1979", "1989", "1991"], "C", "The wall was opened in November 1989, symbolising the end of the Cold War division."]
];

export const historyQuestions = makeQuestions("history", "his", rows);

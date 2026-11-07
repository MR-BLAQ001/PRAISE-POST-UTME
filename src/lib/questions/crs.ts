import { makeQuestions, type SeedRow } from "@/lib/questions/helpers";

const rows: SeedRow[] = [
  // Old Testament
  ["Old Testament", "easy", "According to Genesis, God created the world in ___ days and rested on the seventh.", ["three", "five", "six", "seven"], "C", "Genesis describes six days of creation and rest on the seventh day."],
  ["Old Testament", "easy", "Abraham is regarded as the father of ___.", ["faith", "medicine", "agriculture", "music"], "A", "Abraham is called the father of faith because he trusted and obeyed God."],
  ["Old Testament", "easy", "Moses received the Ten Commandments on Mount ___.", ["Carmel", "Sinai", "Zion", "Olives"], "B", "Moses received the commandments on Mount Sinai."],
  ["Old Testament", "easy", "The number of the Ten Commandments is ___.", ["five", "seven", "ten", "twelve"], "C", "Exodus 20 records ten commandments given to Israel."],
  ["Old Testament", "easy", "David defeated Goliath with a ___.", ["sword", "spear", "sling and stone", "chariot"], "C", "David struck Goliath with a stone from his sling."],
  ["Old Testament", "medium", "Solomon asked God for ___.", ["wealth", "wisdom", "long life", "military power"], "B", "Solomon asked for an understanding heart to govern Israel wisely."],
  ["Old Testament", "easy", "Joseph was sold into slavery by his ___.", ["father", "brothers", "sisters", "cousins"], "B", "Joseph's jealous brothers sold him to Ishmaelite traders."],
  ["Old Testament", "medium", "The Exodus refers to the deliverance of the Israelites from ___.", ["Babylon", "Egypt", "Assyria", "Rome"], "B", "The Exodus is Israel's deliverance from slavery in Egypt under Moses."],
  ["Old Testament", "medium", "Which prophet prophesied that a virgin would conceive and bear a son?", ["Isaiah", "Jeremiah", "Amos", "Hosea"], "A", "Isaiah 7:14 contains this messianic prophecy."],
  ["Old Testament", "easy", "Jonah was swallowed by a great fish after he fled towards ___.", ["Nineveh", "Tarshish", "Egypt", "Jerusalem"], "B", "Jonah attempted to flee to Tarshish instead of going to Nineveh."],
  ["Old Testament", "easy", "Cain killed his brother ___.", ["Seth", "Abel", "Enoch", "Noah"], "B", "Cain murdered Abel out of jealousy."],
  ["Old Testament", "easy", "Noah built an ark to escape the ___.", ["famine", "flood", "plague", "earthquake"], "B", "God instructed Noah to build an ark before the flood."],
  ["Old Testament", "easy", "Joshua succeeded Moses as leader of the ___.", ["Egyptians", "Israelites", "Philistines", "Babylonians"], "B", "Joshua led the Israelites into the Promised Land after Moses' death."],

  // New Testament
  ["New Testament", "easy", "Jesus was born in ___.", ["Nazareth", "Bethlehem", "Jerusalem", "Capernaum"], "B", "The Gospels record that Jesus was born in Bethlehem of Judea."],
  ["New Testament", "easy", "The forerunner of Jesus was ___.", ["Peter", "John the Baptist", "Paul", "James"], "B", "John the Baptist prepared the way for Jesus' ministry."],
  ["New Testament", "medium", "The Sermon on the Mount is found in the Gospel of ___.", ["Mark", "Matthew", "Luke", "John"], "B", "Matthew chapters 5–7 record the Sermon on the Mount."],
  ["New Testament", "easy", "Jesus chose ___ apostles.", ["seven", "ten", "twelve", "seventy"], "C", "Jesus chose twelve apostles to be his closest disciples."],
  ["New Testament", "easy", "The Lord's Prayer was taught by Jesus to his ___.", ["disciples", "enemies", "brothers", "mother"], "A", "Jesus taught the prayer to his disciples as a model of prayer."],
  ["New Testament", "easy", "Christians believe Jesus rose from the dead on the ___ day.", ["first", "second", "third", "seventh"], "C", "The resurrection occurred on the third day, which Christians celebrate as Easter Sunday."],
  ["New Testament", "medium", "Saul's conversion took place on the road to ___.", ["Damascus", "Jericho", "Emmaus", "Galilee"], "A", "Saul encountered the risen Christ on the road to Damascus and became Paul."],
  ["New Testament", "medium", "The Holy Spirit descended on the disciples at ___.", ["Passover", "Pentecost", "Christmas", "Easter"], "B", "The Holy Spirit came upon the disciples at Pentecost."],
  ["New Testament", "easy", "In the parable of the Good Samaritan, the neighbour is ___.", ["the priest", "the Levite", "the Samaritan who helped", "the injured traveller"], "C", "Jesus teaches that the one who showed mercy, the Samaritan, acted as a neighbour."],
  ["New Testament", "easy", "The parable of the prodigal son is about a father's ___.", ["anger", "forgiveness", "wealth", "strictness"], "B", "The father forgives and welcomes back his repentant son, illustrating God's mercy."],
  ["New Testament", "medium", "Judas Iscariot betrayed Jesus for ___ pieces of silver.", ["ten", "twenty", "thirty", "fifty"], "C", "Judas agreed to betray Jesus for thirty pieces of silver."],
  ["New Testament", "medium", "The Great Commission is recorded at the end of the Gospel of ___.", ["Matthew", "Mark", "Luke", "John"], "A", "Matthew 28:19–20 commissions the disciples to make disciples of all nations."],
  ["New Testament", "medium", "Jesus told Nicodemus that one must be ___.", ["baptised only", "born again", "wealthy", "a priest"], "B", "John 3 records Jesus' teaching that one must be born of water and the Spirit."],

  // Christian Ethics
  ["Christian Ethics", "easy", "The Golden Rule teaches that we should ___.", ["do to others as we would have them do to us", "seek revenge", "love only our friends", "ignore the poor"], "A", "Jesus summarised ethical conduct in the Golden Rule (Matthew 7:12)."],
  ["Christian Ethics", "easy", "Jesus commanded his followers to love their neighbours as ___.", ["their families", "themselves", "their leaders", "their possessions"], "B", "The second greatest commandment is to love one's neighbour as oneself."],
  ["Christian Ethics", "medium", "Jesus taught that forgiveness should be extended ___ times seven.", ["three", "seven", "seventy", "seventy-seven"], "C", "Jesus told Peter to forgive not seven times but seventy times seven, meaning without limit."],
  ["Christian Ethics", "medium", "Christian stewardship teaches that creation should be ___.", ["exploited without limit", "cared for responsibly", "ignored", "privatised"], "B", "Human beings are entrusted with caring for God's creation."],
  ["Christian Ethics", "easy", "The Bible condemns bribery and corruption because they ___.", ["increase wealth fairly", "pervert justice", "help the poor", "strengthen leadership"], "B", "Dishonest gain undermines justice and is condemned in Scripture."],
  ["Christian Ethics", "medium", "The sanctity of life means that human life is ___.", ["sacred and deserving of protection", "owned by the state", "valuable only if productive", "without moral significance"], "A", "Christian ethics regards life as a gift from God to be protected."],
  ["Christian Ethics", "medium", "Christian marriage is traditionally understood as a covenant between ___.", ["two families", "a man and a woman", "the state and the church", "two businesses"], "B", "Christian marriage is understood as a lifelong covenant between a man and a woman before God."],
  ["Christian Ethics", "medium", "The Protestant work ethic emphasises ___.", ["laziness", "diligence and responsible labour", "gambling", "accumulation by fraud"], "B", "Work is viewed as a calling to be pursued diligently and honestly."],
  ["Christian Ethics", "easy", "Tithing in the Bible refers to giving ___ of one's income.", ["a tenth", "a half", "a quarter", "all"], "A", "A tithe is a tenth, traditionally given to support religious work."],
  ["Christian Ethics", "medium", "Which attitude best reflects Christian teaching on persecution?", ["Retaliation with violence", "Prayer and endurance", "Bitterness and revenge", "Denial of faith"], "B", "Jesus taught love for enemies and endurance in the face of persecution."],
  ["Christian Ethics", "medium", "The Bible teaches that Christians should be honest because God is ___.", ["wealthy", "truthful", "distant", "powerful"], "B", "God's truthfulness is the basis for honest conduct among believers."],
  ["Christian Ethics", "hard", "Christian social justice emphasises care for ___.", ["the rich only", "the vulnerable and marginalised", "political leaders only", "the educated only"], "B", "Scripture repeatedly calls for justice and care for widows, orphans, strangers and the poor."],

  // Church History
  ["Church History", "medium", "Augustine was bishop of ___.", ["Hippo", "Rome", "Alexandria", "Jerusalem"], "A", "Augustine served as Bishop of Hippo in North Africa."],
  ["Church History", "medium", "Martin Luther is credited with beginning the Protestant Reformation in ___.", ["1517", "1453", "1789", "1917"], "A", "Luther's Ninety-Five Theses in 1517 sparked the Reformation."],
  ["Church History", "easy", "A major emphasis of the Protestant Reformation was ___.", ["salvation by grace through faith", "salvation by works alone", "papal supremacy", "polygamy"], "A", "Reformers emphasised justification by faith and the authority of Scripture."],
  ["Church History", "medium", "Mary Slessor is remembered for missionary work in ___.", ["Calabar", "Lagos", "Kano", "Abuja"], "A", "Mary Slessor served in Calabar and championed the protection of twins."],
  ["Church History", "medium", "CMS stands for ___.", ["Church Missionary Society", "Christian Missionary School", "Catholic Ministry of Souls", "Church Ministers Society"], "A", "The Church Missionary Society was a major missionary body in Nigeria."],
  ["Church History", "medium", "Pentecostalism emphasises ___.", ["the work and gifts of the Holy Spirit", "the abolition of prayer", "the worship of saints only", "political rule by bishops"], "A", "Pentecostal movements stress the experience and gifts of the Holy Spirit."],
  ["Church History", "medium", "Ecumenism refers to efforts towards ___.", ["Christian unity", "division of churches", "political revolution", "secularisation"], "A", "Ecumenism promotes cooperation and unity among Christian denominations."],
  ["Church History", "medium", "The Nicene Creed is a statement of ___.", ["Christian faith", "Roman law", "African tradition", "church finance"], "A", "The Nicene Creed summarises core Christian beliefs about God and Christ."],
  ["Church History", "hard", "The canon of the New Testament refers to ___.", ["the list of accepted inspired books", "the order of church services", "the laws of the church", "the names of apostles"], "A", "The canon is the collection of writings recognised as authoritative Scripture."],
  ["Church History", "medium", "Samuel Ajayi Crowther was the first black ___.", ["Anglican bishop", "Pope", "Catholic cardinal", "Pentecostal pastor"], "A", "Crowther was consecrated an Anglican bishop in 1864."],
  ["Church History", "medium", "The Second Vatican Council took place between ___.", ["1869–1870", "1962–1965", "1914–1918", "1990–1992"], "B", "Vatican II was held from 1962 to 1965 and brought major reforms."],
  ["Church History", "hard", "Early Christians faced persecution under the Roman Empire mainly because they ___.", ["refused to worship the emperor as a god", "were wealthy", "spoke Latin", "built large churches"], "A", "Their refusal to participate in imperial cult worship led to persecution."]
];

export const crsQuestions = makeQuestions("christian-religious-studies", "crs", rows);

import { makeQuestions, type SeedRow } from "@/lib/questions/helpers";

const rows: SeedRow[] = [
  // Crop Science
  ["Crop Science", "easy", "Photosynthesis in green plants produces glucose and ___.", ["oxygen", "nitrogen", "methane", "hydrogen"], "A", "Plants use carbon dioxide and water with light energy to produce glucose and oxygen."],
  ["Crop Science", "easy", "Seed germination requires water, oxygen and ___.", ["suitable temperature", "darkness", "fertiliser", "pesticide"], "A", "Water, oxygen and a suitable temperature trigger germination."],
  ["Crop Science", "easy", "NPK fertiliser supplies nitrogen, phosphorus and ___.", ["potassium", "calcium", "sodium", "iron"], "A", "NPK stands for nitrogen, phosphorus and potassium."],
  ["Crop Science", "medium", "Crop rotation helps to ___.", ["maintain soil fertility and reduce pests", "increase soil erosion", "deplete nutrients", "prevent germination"], "A", "Rotating crops replenishes nutrients and breaks pest cycles."],
  ["Crop Science", "medium", "A weed is a plant that ___.", ["grows where it is not wanted", "is always poisonous", "has no roots", "is grown for food"], "A", "Weeds compete with crops for water, nutrients and light."],
  ["Crop Science", "medium", "A major insect pest of stored grains is the ___.", ["weevil", "ladybird", "bee", "butterfly"], "A", "Weevils damage stored maize, beans and other grains."],
  ["Crop Science", "easy", "Irrigation is the artificial application of ___ to crops.", ["water", "fertiliser", "pesticide", "seeds"], "A", "Irrigation supplies water where rainfall is insufficient."],
  ["Crop Science", "easy", "Harvesting is the process of ___ crops.", ["gathering mature", "planting", "spraying", "storing"], "A", "Mature crops are gathered at harvest."],
  ["Crop Science", "medium", "Cassava is mainly grown for its ___.", ["starchy roots", "leaves only", "seeds", "bark"], "A", "Cassava roots are processed into garri, fufu and flour."],
  ["Crop Science", "easy", "Maize is a ___ crop.", ["cereal", "legume", "tuber", "fibre"], "A", "Maize is a cereal grain."],
  ["Crop Science", "medium", "Cocoa is a major cash crop in Nigeria and is used to produce ___.", ["chocolate", "petrol", "cement", "rubber"], "A", "Cocoa beans are processed into chocolate and cocoa products."],
  ["Crop Science", "medium", "Rice grows best in ___.", ["waterlogged or irrigated fields", "deserts", "rocky hills", "deep forests only"], "A", "Rice thrives in flooded or well-irrigated paddies."],
  ["Crop Science", "medium", "A disease of crops caused by fungi is ___.", ["blight", "photosynthesis", "transpiration", "germination"], "A", "Blight is a fungal disease affecting many crops."],

  // Animal Science
  ["Animal Science", "easy", "A ruminant animal has a ___ stomach.", ["four-chambered", "one-chambered", "two-chambered", "no"], "A", "Ruminants such as cattle and goats have four stomach chambers."],
  ["Animal Science", "easy", "Poultry farming involves raising ___.", ["birds such as chickens", "fish", "cattle", "bees"], "A", "Poultry includes chickens, turkeys, ducks and guinea fowl."],
  ["Animal Science", "medium", "Cattle are kept mainly for ___.", ["milk and meat", "wool only", "eggs", "honey"], "A", "Cattle provide milk, meat, hides and draught power."],
  ["Animal Science", "easy", "Fish farming is also known as ___.", ["aquaculture", "apiculture", "sericulture", "horticulture"], "A", "Aquaculture is the controlled rearing of aquatic organisms."],
  ["Animal Science", "easy", "Animal feed is called ___ when it provides all required nutrients.", ["a balanced ration", "a pesticide", "a vaccine", "a hormone"], "A", "A balanced ration supplies energy, protein, vitamins and minerals in correct proportions."],
  ["Animal Science", "medium", "Vaccination protects animals against ___.", ["infectious diseases", "starvation", "overheating", "predators"], "A", "Vaccines stimulate immunity against specific pathogens."],
  ["Animal Science", "easy", "Goats are kept for milk, meat and ___.", ["skins", "wool", "honey", "silk"], "A", "Goat skins are used in leather production."],
  ["Animal Science", "medium", "Pigs are mainly raised for ___.", ["pork", "beef", "mutton", "poultry"], "A", "Pig production supplies pork."],
  ["Animal Science", "medium", "Beekeeping is known as ___.", ["apiculture", "aquaculture", "sericulture", "floriculture"], "A", "Apiculture is the keeping of bees for honey and wax."],
  ["Animal Science", "medium", "Foot-and-mouth disease affects ___.", ["cattle and other cloven-hoofed animals", "poultry only", "fish only", "bees only"], "A", "It is a highly contagious viral disease of cloven-hoofed livestock."],
  ["Animal Science", "medium", "Animal breeding aims to ___.", ["improve desirable traits in offspring", "reduce all reproduction", "eliminate feeding", "stop growth"], "A", "Selective breeding improves productivity, health and quality."],
  ["Animal Science", "easy", "Which of these is an animal product?", ["Milk", "Maize", "Cassava", "Palm oil"], "A", "Milk is produced by animals such as cattle and goats."],
  ["Animal Science", "medium", "Pasture is land covered with ___ used for grazing.", ["grasses and legumes", "concrete", "rocks only", "forest trees only"], "A", "Improved pasture provides nutritious forage for livestock."],

  // Soil Science
  ["Soil Science", "easy", "Soil is formed through the breakdown of ___ over time.", ["rocks and organic matter", "plastic", "metal", "glass"], "A", "Weathering of rocks and decay of organic matter produce soil."],
  ["Soil Science", "easy", "The best soil for most crops is ___ soil.", ["loamy", "sandy", "clayey", "gravelly"], "A", "Loam balances sand, silt and clay, retaining water and nutrients while draining well."],
  ["Soil Science", "medium", "Soil pH measures soil ___.", ["acidity or alkalinity", "temperature", "depth", "colour"], "A", "pH indicates whether soil is acidic, neutral or alkaline."],
  ["Soil Science", "medium", "Which practice helps control soil erosion?", ["Contour ploughing", "Overgrazing", "Deforestation", "Bush burning"], "A", "Contour ploughing slows runoff and reduces erosion."],
  ["Soil Science", "easy", "Humus is ___.", ["decayed organic matter in soil", "fresh rock", "a type of fertiliser pellet", "a mineral crystal"], "A", "Humus improves soil structure, water retention and fertility."],
  ["Soil Science", "medium", "A soil profile is a vertical section showing soil ___.", ["horizons", "temperature only", "rainfall", "crop yield"], "A", "Soil horizons are distinct layers visible in a profile."],
  ["Soil Science", "medium", "Which is an organic fertiliser?", ["Farmyard manure", "Urea", "Superphosphate", "NPK 15-15-15"], "A", "Manure is organic matter; the others are inorganic fertilisers."],
  ["Soil Science", "easy", "Farmyard manure improves soil by adding ___.", ["organic matter and nutrients", "plastic waste", "salt only", "pesticides"], "A", "Manure adds nutrients and improves soil structure."],
  ["Soil Science", "medium", "Waterlogging can be reduced by ___.", ["drainage", "flooding", "compaction", "deforestation"], "A", "Drainage channels remove excess water from the soil."],
  ["Soil Science", "medium", "Soil texture refers to the relative proportions of ___.", ["sand, silt and clay", "water and air", "humus and minerals", "roots and worms"], "A", "Texture depends on particle size composition."],
  ["Soil Science", "easy", "Tillage is the preparation of soil by ___.", ["ploughing and harrowing", "spraying pesticides", "harvesting", "irrigating only"], "A", "Tillage loosens and prepares soil for planting."],
  ["Soil Science", "medium", "Soil conservation aims to ___.", ["prevent loss of soil fertility and erosion", "increase deforestation", "remove all organic matter", "reduce rainfall"], "A", "Conservation practices protect soil from degradation."],

  // Farm Management
  ["Farm Management", "easy", "Farm records are kept to ___.", ["monitor performance and plan decisions", "entertain visitors", "replace labour", "increase pests"], "A", "Records track costs, yields and profits for informed management."],
  ["Farm Management", "medium", "A farm budget is a plan of expected ___ and ___.", ["income; expenditure", "rainfall; temperature", "pests; diseases", "seeds; tools only"], "A", "Budgets forecast farm revenue and costs."],
  ["Farm Management", "easy", "A cooperative society helps farmers by ___.", ["pooling resources and bargaining collectively", "increasing isolation", "eliminating markets", "preventing savings"], "A", "Cooperatives provide credit, inputs and marketing support."],
  ["Farm Management", "medium", "Agricultural extension workers help farmers by ___.", ["disseminating improved practices and information", "collecting all harvests", "setting arbitrary prices", "banning new technology"], "A", "Extension services link research to farmers."],
  ["Farm Management", "easy", "Mechanisation in agriculture means using ___ to do farm work.", ["machines", "only human labour", "animals only", "chemicals only"], "A", "Mechanisation replaces or supplements labour with machinery."],
  ["Farm Management", "medium", "Agricultural marketing involves ___.", ["moving produce from farm to consumers at a profit", "planting only", "irrigating only", "applying pesticides only"], "A", "Marketing includes storage, transport, grading and selling."],
  ["Farm Management", "easy", "A major source of farm finance is ___.", ["agricultural loans and grants", "lottery tickets", "traffic fines", "foreign passports"], "A", "Farmers obtain credit from banks, cooperatives and government schemes."],
  ["Farm Management", "medium", "Labour is a ___ of production.", ["factor", "product", "by-product", "market"], "A", "Labour is one of the factors of production, alongside land, capital and entrepreneurship."],
  ["Farm Management", "medium", "Land tenure refers to the system of ___ land.", ["holding and using", "irrigating", "harvesting", "spraying"], "A", "Land tenure defines ownership, access and use rights."],
  ["Farm Management", "medium", "Farm risks include ___.", ["pests, disease and weather uncertainty", "guaranteed profits", "fixed prices only", "constant yields"], "A", "Agriculture faces biological, climatic and market risks."],
  ["Farm Management", "medium", "Agroforestry combines trees with ___.", ["crops and/or livestock", "only fisheries", "only buildings", "only pesticides"], "A", "Agroforestry integrates trees into farming systems for multiple benefits."],
  ["Farm Management", "medium", "Sustainable agriculture aims to ___.", ["meet present needs without harming future productivity", "maximise deforestation", "deplete all soil nutrients", "ignore environmental impacts"], "A", "Sustainability balances productivity, profitability and environmental care."]
];

export const agricultureQuestions = makeQuestions("agricultural-science", "agr", rows);

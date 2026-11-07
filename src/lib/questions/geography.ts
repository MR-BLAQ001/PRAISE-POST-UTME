import { makeQuestions, type SeedRow } from "@/lib/questions/helpers";

const rows: SeedRow[] = [
  // Physical Geography
  ["Physical Geography", "easy", "The Earth is the ___ planet from the Sun.", ["first", "second", "third", "fourth"], "C", "Mercury, Venus and Earth make Earth the third planet from the Sun."],
  ["Physical Geography", "easy", "The rotation of the Earth on its axis causes ___.", ["day and night", "the seasons", "earthquakes", "tides only"], "A", "One complete rotation takes about 24 hours, producing day and night."],
  ["Physical Geography", "medium", "The revolution of the Earth around the Sun causes ___.", ["day and night", "the seasons", "the tides", "eclipses of the Moon only"], "B", "The tilt of the Earth's axis combined with revolution produces seasonal changes."],
  ["Physical Geography", "easy", "The Equator is a line of ___ at 0°.", ["latitude", "longitude", "bearing", "altitude"], "A", "The Equator is the zero-degree line of latitude."],
  ["Physical Geography", "easy", "The Prime Meridian passes through ___.", ["Greenwich", "Paris", "Lagos", "Cairo"], "A", "The Prime Meridian (0° longitude) passes through Greenwich, London."],
  ["Physical Geography", "medium", "The layer of the atmosphere where weather occurs is the ___.", ["troposphere", "stratosphere", "mesosphere", "thermosphere"], "A", "Most weather phenomena occur in the troposphere."],
  ["Physical Geography", "medium", "Weather differs from climate because weather refers to ___.", ["short-term atmospheric conditions", "long-term average conditions", "ocean currents only", "soil types"], "A", "Weather is the state of the atmosphere at a particular time and place."],
  ["Physical Geography", "medium", "The process by which wind and water wear away rock and soil is called ___.", ["erosion", "deposition", "condensation", "evaporation"], "A", "Erosion transports weathered material away."],
  ["Physical Geography", "medium", "The theory of plate tectonics explains the movement of the Earth's ___.", ["lithospheric plates", "oceans only", "atmosphere", "clouds"], "A", "Plates move on the asthenosphere, causing earthquakes and mountain building."],
  ["Physical Geography", "medium", "A volcano is an opening in the Earth's crust through which ___ erupts.", ["magma", "rainwater", "snow", "sand only"], "A", "Magma, gases and ash escape through volcanic vents."],
  ["Physical Geography", "easy", "The water cycle involves evaporation, condensation and ___.", ["precipitation", "magnetisation", "photosynthesis", "oxidation"], "A", "Water moves through evaporation, condensation, precipitation and runoff."],
  ["Physical Geography", "easy", "The uppermost layer of the Earth's surface in which plants grow is called ___.", ["soil", "magma", "mantle", "core"], "A", "Soil supports plant growth and is formed from weathered rock and organic matter."],
  ["Physical Geography", "medium", "A delta is formed where a river ___.", ["deposits sediment at its mouth", "rises in mountains", "flows underground", "evaporates"], "A", "Deposition at a river mouth builds a delta."],

  // Human Geography
  ["Human Geography", "easy", "A census is the official counting of a country's ___.", ["population", "roads", "schools", "banks"], "A", "A census collects demographic data about the population."],
  ["Human Geography", "medium", "Migration is the movement of people from ___.", ["one place to another", "one job to another in the same office", "one language to another", "one religion to another"], "A", "Migration involves a change of permanent residence."],
  ["Human Geography", "medium", "Urbanisation is the increasing proportion of a population living in ___.", ["cities and towns", "rural villages", "forests", "deserts"], "A", "Urbanisation reflects growth in urban population and settlement."],
  ["Human Geography", "easy", "Farming is an example of a ___ activity.", ["primary", "secondary", "tertiary", "quaternary"], "A", "Primary activities extract resources directly from nature."],
  ["Human Geography", "easy", "Manufacturing is a ___ activity.", ["primary", "secondary", "tertiary", "quaternary"], "A", "Secondary activities process raw materials into finished goods."],
  ["Human Geography", "easy", "Banking and teaching are examples of ___ activities.", ["primary", "secondary", "tertiary", "extractive"], "A", "Tertiary activities provide services."],
  ["Human Geography", "medium", "A push factor in migration is something that ___.", ["encourages people to leave an area", "attracts people to an area", "increases birth rate", "reduces death rate"], "A", "Push factors include unemployment, conflict and poor services."],
  ["Human Geography", "medium", "The birth rate is the number of births per ___ people per year.", ["100", "1,000", "10,000", "100,000"], "B", "Birth rate is usually expressed per 1,000 population per year."],
  ["Human Geography", "medium", "The dependency ratio compares dependants with the ___ population.", ["working-age", "elderly", "child", "migrant"], "A", "It relates children and elderly dependants to the working-age population."],
  ["Human Geography", "easy", "A settlement is a place where people ___.", ["live and interact", "only work", "only worship", "only trade"], "A", "Settlements range from hamlets to megacities."],
  ["Human Geography", "medium", "An industry located near raw materials is said to be ___.", ["raw-material oriented", "market oriented", "labour oriented", "footloose"], "A", "Weight-losing industries often locate near their raw materials."],
  ["Human Geography", "easy", "Transportation is important because it ___.", ["links people and places", "increases isolation", "prevents trade", "eliminates migration"], "A", "Transport facilitates movement of people, goods and services."],
  ["Human Geography", "medium", "A megacity is an urban area with a population of more than ___ million people.", ["1", "5", "10", "50"], "C", "A megacity is commonly defined as having over 10 million inhabitants."],

  // Map Reading
  ["Map Reading", "easy", "Map scale is the ratio between distance on a map and ___.", ["distance on the ground", "height above sea level", "temperature", "population"], "A", "Scale allows map distances to be converted to real distances."],
  ["Map Reading", "easy", "Contour lines join points of equal ___.", ["elevation", "rainfall", "temperature", "longitude"], "A", "Contours represent relief on a topographic map."],
  ["Map Reading", "medium", "A bearing is measured clockwise from ___.", ["north", "south", "east", "west"], "A", "Bearings are measured in degrees clockwise from north."],
  ["Map Reading", "easy", "A map scale of 1:50,000 means 1 cm on the map represents ___.", ["50,000 cm on the ground", "50 cm on the ground", "50,000 km on the ground", "5 km on the ground"], "A", "1 cm represents 50,000 cm, which is 500 m."],
  ["Map Reading", "medium", "On a map, closely spaced contour lines indicate ___.", ["steep slopes", "flat land", "a river", "a settlement"], "A", "Close contours indicate a rapid change in elevation."],
  ["Map Reading", "medium", "If the local time at 0° longitude is 12:00, the local time at 15°E is approximately ___.", ["11:00", "12:30", "13:00", "14:00"], "C", "Every 15° of longitude corresponds to one hour; 15°E is one hour ahead of 0°."],
  ["Map Reading", "easy", "The distance between two points on a map is measured with a ___.", ["ruler or pair of dividers", "thermometer", "rain gauge", "barometer"], "A", "Map distances are measured and then converted using the scale."],
  ["Map Reading", "medium", "Relief on a map refers to the ___.", ["shape and height of the land", "type of vegetation", "number of people", "annual rainfall"], "A", "Relief describes differences in elevation and landform."],
  ["Map Reading", "medium", "A cross-section drawn from a map shows the ___.", ["profile of the land along a line", "climate of an area", "population density", "road network"], "A", "A cross-section shows changes in height along a transect."],
  ["Map Reading", "hard", "GPS stands for ___.", ["Global Positioning System", "Geographic Physical Survey", "Global Population Survey", "Ground Plan Scale"], "A", "GPS uses satellites to determine location."],
  ["Map Reading", "medium", "Altitude is the height of a place above ___.", ["sea level", "the Equator", "the Prime Meridian", "the Moon"], "A", "Altitude is vertical height referenced to mean sea level."],
  ["Map Reading", "medium", "Drainage on a map is shown by ___.", ["rivers and streams", "contour lines only", "settlements", "road signs"], "A", "Drainage features include rivers, streams and lakes."],

  // Nigerian Geography
  ["Nigerian Geography", "easy", "The capital city of Nigeria is ___.", ["Lagos", "Abuja", "Kano", "Ibadan"], "B", "Abuja became the federal capital in 1991."],
  ["Nigerian Geography", "easy", "Nigeria's largest river is the ___.", ["Niger", "Congo", "Nile", "Zambezi"], "A", "The Niger is Nigeria's principal river and gave the country its name."],
  ["Nigerian Geography", "easy", "The Niger and Benue rivers meet at ___.", ["Lokoja", "Onitsha", "Maiduguri", "Sokoto"], "A", "The confluence of the Niger and Benue is at Lokoja."],
  ["Nigerian Geography", "medium", "Nigeria's highest mountain is ___.", ["Chappal Waddi", "Mount Kilimanjaro", "Mount Cameroon", "Zuma Rock"], "A", "Chappal Waddi in Taraba State is Nigeria's highest point."],
  ["Nigerian Geography", "easy", "Lake Chad lies mainly in the ___ of Nigeria.", ["northeast", "southwest", "southeast", "central"], "A", "Lake Chad borders Borno and other Sahelian states."],
  ["Nigerian Geography", "medium", "The tropical rainforest belt in Nigeria is found mainly in the ___.", ["south", "far north", "Sahel", "plateau"], "A", "High rainfall supports rainforest in southern Nigeria."],
  ["Nigerian Geography", "medium", "The Sahel savanna is characterised by ___.", ["low rainfall and sparse vegetation", "heavy rainfall and forests", "permanent snow", "mangrove swamps"], "A", "The Sahel is a semi-arid transition zone south of the Sahara."],
  ["Nigerian Geography", "easy", "Nigeria's largest city by population is ___.", ["Lagos", "Kano", "Ibadan", "Port Harcourt"], "A", "Lagos is Nigeria's largest metropolitan area."],
  ["Nigerian Geography", "easy", "Most of Nigeria's crude oil is produced in the ___.", ["Niger Delta", "Sahel", "Jos Plateau", "Middle Belt"], "A", "The Niger Delta region is the centre of petroleum production."],
  ["Nigerian Geography", "easy", "The Harmattan is a ___ wind.", ["dry and dusty", "wet and warm", "cold and snowy", "humid and calm"], "A", "The Harmattan blows from the Sahara during the dry season."],
  ["Nigerian Geography", "medium", "Nigeria has ___ states plus the Federal Capital Territory.", ["30", "36", "40", "48"], "B", "There are 36 states and the FCT."],
  ["Nigerian Geography", "medium", "The Zuma Rock is located in ___.", ["Niger State", "Lagos State", "Rivers State", "Enugu State"], "A", "Zuma Rock is a prominent monolith near Madalla in Niger State."]
];

export const geographyQuestions = makeQuestions("geography", "geg", rows);

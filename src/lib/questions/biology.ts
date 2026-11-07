import { makeQuestions, type SeedRow } from "@/lib/questions/helpers";

const rows: SeedRow[] = [
  // Genetics
  ["Genetics", "easy", "A gene is best defined as ___.", ["a unit of heredity", "a type of cell", "a protein", "an organ"], "A", "A gene is a segment of DNA that carries hereditary information."],
  ["Genetics", "medium", "The observable characteristics of an organism make up its ___.", ["genotype", "phenotype", "allele", "chromosome"], "B", "Phenotype refers to observable traits; genotype is the genetic makeup."],
  ["Genetics", "easy", "A dominant allele is one that ___.", ["is always hidden", "expresses itself when present", "occurs only in males", "cannot be inherited"], "B", "A dominant allele expresses its trait even when only one copy is present."],
  ["Genetics", "medium", "In a cross between AA and aa, all the offspring will be ___.", ["AA", "Aa", "aa", "A"], "B", "Each parent contributes one allele, giving all offspring the heterozygous genotype Aa."],
  ["Genetics", "easy", "In humans, the male sex chromosomes are ___.", ["XX", "XY", "YY", "XO"], "B", "Males are XY; females are XX."],
  ["Genetics", "easy", "The four bases found in DNA are ___.", ["A, T, C, G", "A, U, C, G", "A, T, U, G", "A, T, C, U"], "A", "DNA contains adenine, thymine, cytosine and guanine; uracil replaces thymine in RNA."],
  ["Genetics", "medium", "A mutation is a ___.", ["change in the genetic material", "type of reproduction", "disease caused by bacteria", "normal cell division"], "A", "A mutation is a change in the nucleotide sequence of DNA."],
  ["Genetics", "medium", "A person with blood group AB is called a universal recipient because ___.", ["their red cells have no antigens", "their plasma has no antibodies", "they can donate to all groups", "they have no antibodies or antigens"], "B", "AB plasma has no anti-A or anti-B antibodies, so it can receive blood from all ABO groups."],
  ["Genetics", "medium", "Sickle cell anaemia results from ___.", ["a chromosomal deletion", "a point mutation in the haemoglobin gene", "a bacterial infection", "excess iron"], "B", "A single base substitution changes glutamic acid to valine in the beta-haemoglobin chain."],

  // Ecology
  ["Ecology", "easy", "An ecosystem consists of ___.", ["only living organisms", "living organisms and their physical environment", "only plants", "only animals"], "B", "An ecosystem includes communities of organisms interacting with their non-living environment."],
  ["Ecology", "easy", "Green plants are called producers because they ___.", ["eat other organisms", "make food by photosynthesis", "decompose waste", "breathe rapidly"], "B", "Producers synthesise organic food from sunlight, carbon dioxide and water."],
  ["Ecology", "medium", "Energy flows through a food chain in ___ direction(s).", ["one", "two", "both", "no fixed"], "A", "Energy flows from producers to consumers in one direction and is lost as heat at each level."],
  ["Ecology", "easy", "Bacteria and fungi that break down dead matter are called ___.", ["producers", "decomposers", "herbivores", "predators"], "B", "Decomposers break down organic matter and recycle nutrients."],
  ["Ecology", "medium", "A relationship in which both organisms benefit is called ___.", ["parasitism", "commensalism", "mutualism", "competition"], "C", "Mutualism is a symbiotic relationship beneficial to both partners."],
  ["Ecology", "medium", "The carbon cycle returns carbon dioxide to the atmosphere mainly through ___.", ["photosynthesis", "respiration and combustion", "nitrogen fixation", "condensation"], "B", "Respiration and the burning of fossil fuels release carbon dioxide."],
  ["Ecology", "easy", "Population density is the number of individuals ___.", ["in a whole country", "per unit area or volume", "born each year", "that die each year"], "B", "Population density is the number of individuals per unit area or volume."],
  ["Ecology", "medium", "Which of the following is an abiotic factor?", ["Rainfall", "Grasshoppers", "Bacteria", "Grasses"], "A", "Rainfall is non-living, hence abiotic; the others are biotic factors."],
  ["Ecology", "medium", "A pyramid of energy is always broadest at the base because ___.", ["producers are the largest organisms", "energy is lost at each trophic level", "consumers eat producers", "there are no decomposers"], "B", "Only about 10% of energy passes to the next level, so producer energy is greatest."],

  // Cell Biology
  ["Cell Biology", "easy", "The mitochondrion is called the powerhouse of the cell because it ___.", ["stores water", "produces energy-rich ATP", "makes proteins", "digests food"], "B", "Mitochondria carry out aerobic respiration, producing ATP."],
  ["Cell Biology", "easy", "Which structure is found in plant cells but not in animal cells?", ["Nucleus", "Cell wall", "Mitochondrion", "Cell membrane"], "B", "Plant cells have a cellulose cell wall; animal cells do not."],
  ["Cell Biology", "easy", "The nucleus contains ___.", ["genetic material", "only water", "chlorophyll", "digestive enzymes"], "A", "The nucleus contains DNA, which controls cell activities."],
  ["Cell Biology", "medium", "Ribosomes are responsible for ___.", ["protein synthesis", "photosynthesis", "lipid storage", "cell division"], "A", "Ribosomes translate mRNA into proteins."],
  ["Cell Biology", "easy", "Photosynthesis takes place in the ___.", ["mitochondrion", "chloroplast", "nucleus", "vacuole"], "B", "Chloroplasts contain chlorophyll and carry out photosynthesis."],
  ["Cell Biology", "medium", "Osmosis is the movement of water molecules from ___.", ["low to high water potential through a semi-permeable membrane", "high to low water potential through a semi-permeable membrane", "high to low concentration of solutes", "any region to another without a membrane"], "B", "Water moves from a region of higher water potential to lower water potential across a semi-permeable membrane."],
  ["Cell Biology", "medium", "Mitosis produces daughter cells that are ___.", ["genetically different", "genetically identical to the parent", "always haploid", "gametes"], "B", "Mitosis produces two genetically identical diploid daughter cells."],
  ["Cell Biology", "medium", "The cell membrane is described as selectively permeable because it ___.", ["allows all substances through", "allows some substances to pass and blocks others", "is completely impermeable", "is made of cellulose"], "B", "The membrane controls which substances enter or leave the cell."],

  // Human Anatomy
  ["Human Anatomy", "easy", "The heart pumps blood through the body by ___.", ["peristalsis", "muscular contraction", "diffusion only", "osmosis"], "B", "Cardiac muscle contractions pump blood through the circulatory system."],
  ["Human Anatomy", "easy", "Gas exchange in humans takes place in the ___.", ["trachea", "lungs", "liver", "stomach"], "B", "Oxygen and carbon dioxide are exchanged across the alveoli in the lungs."],
  ["Human Anatomy", "medium", "The main function of the kidney is to ___.", ["digest food", "filter waste from the blood", "pump blood", "produce bile"], "B", "Kidneys filter blood, removing urea and excess water and salts as urine."],
  ["Human Anatomy", "easy", "Most absorption of digested food occurs in the ___.", ["mouth", "stomach", "small intestine", "large intestine"], "C", "The small intestine has villi that increase surface area for absorption."],
  ["Human Anatomy", "easy", "Red blood cells transport oxygen because they contain ___.", ["haemoglobin", "chlorophyll", "insulin", "fibrin"], "A", "Haemoglobin binds oxygen in the lungs and releases it in tissues."],
  ["Human Anatomy", "medium", "The basic functional unit of the nervous system is the ___.", ["neuron", "nephron", "alveolus", "villus"], "A", "Neurons transmit electrical impulses through the nervous system."],
  ["Human Anatomy", "medium", "The liver plays a role in ___.", ["producing bile and detoxifying substances", "pumping blood", "filtering urine", "gas exchange"], "A", "The liver produces bile, stores glycogen and detoxifies harmful substances."],
  ["Human Anatomy", "medium", "Insulin is produced by the ___.", ["liver", "pancreas", "kidney", "spleen"], "B", "Beta cells of the pancreatic islets secrete insulin."],

  // Evolution
  ["Evolution", "easy", "The theory of natural selection was proposed by ___.", ["Gregor Mendel", "Charles Darwin", "Louis Pasteur", "Robert Hooke"], "B", "Charles Darwin proposed natural selection in 'On the Origin of Species'."],
  ["Evolution", "medium", "Homologous structures provide evidence for evolution because they ___.", ["perform identical functions", "share a common ancestry despite different functions", "are always vestigial", "are found only in fossils"], "B", "Homologous structures have similar underlying anatomy inherited from a common ancestor."],
  ["Evolution", "easy", "Variation within a species is important for evolution because it ___.", ["prevents reproduction", "provides material for natural selection", "reduces population", "stops mutation"], "B", "Natural selection acts on heritable variation."],
  ["Evolution", "medium", "An adaptation is a feature that ___.", ["reduces survival", "improves an organism's chance of survival and reproduction", "is always harmful", "appears only in fossils"], "B", "Adaptations enhance fitness in a particular environment."],
  ["Evolution", "medium", "Fossil records provide evidence of evolution by showing ___.", ["change in organisms over geological time", "that all species appeared at once", "that evolution is impossible", "only living species"], "A", "Fossils document gradual changes and extinct forms over time."],
  ["Evolution", "hard", "Speciation is the process by which ___.", ["new species form", "organisms become extinct", "individuals adapt within a lifetime", "genes mutate randomly"], "A", "Speciation is the formation of new and distinct species through evolution."],
  ["Evolution", "medium", "Vestigial structures such as the human appendix are evidence of ___.", ["common ancestry", "perfect design", "spontaneous generation", "recent creation"], "A", "Vestigial organs are reduced remnants inherited from ancestors in which they were functional."],
  ["Evolution", "medium", "The rapid evolution of antibiotic-resistant bacteria is an example of ___.", ["natural selection", "artificial selection by humans", "Lamarckian inheritance", "mutation only"], "A", "Antibiotics select for resistant bacteria, which survive and reproduce."],

  // Reproduction
  ["Reproduction", "easy", "Fertilisation is the fusion of ___.", ["two somatic cells", "a male and a female gamete", "two eggs", "two sperm cells"], "B", "Fertilisation is the fusion of a sperm and an egg to form a zygote."],
  ["Reproduction", "easy", "Pollination is the transfer of pollen from ___.", ["the stigma to the anther", "the anther to the stigma", "the root to the leaf", "the ovary to the style"], "B", "Pollen moves from the anther (male part) to the stigma (female part)."],
  ["Reproduction", "easy", "Sperm cells are produced in the ___.", ["ovaries", "testes", "uterus", "prostate"], "B", "The testes produce sperm and testosterone."],
  ["Reproduction", "medium", "Ovulation is the release of ___.", ["an egg from the ovary", "sperm from the testes", "milk from the breast", "blood from the uterus"], "A", "Ovulation is the release of a mature egg from the ovary, usually mid-cycle."],
  ["Reproduction", "medium", "The placenta allows ___.", ["exchange of substances between mother and foetus", "the foetus to breathe air", "the mother to produce milk", "the foetus to eat food"], "A", "The placenta facilitates exchange of nutrients, oxygen and waste between mother and foetus."],
  ["Reproduction", "medium", "Asexual reproduction produces offspring that are ___.", ["genetically identical to the parent", "always male", "genetically varied", "always sterile"], "A", "Asexual reproduction involves no gamete fusion and produces clones."],
  ["Reproduction", "easy", "The transfer of seeds away from the parent plant is called ___.", ["germination", "dispersal", "pollination", "fertilisation"], "B", "Seed dispersal reduces competition and spreads the species."],
  ["Reproduction", "medium", "Menstruation occurs when ___.", ["an egg is fertilised", "the uterine lining breaks down", "ovulation stops permanently", "sperm are produced"], "B", "If fertilisation does not occur, the thickened uterine lining is shed as menstruation."]
];

export const biologyQuestions = makeQuestions("biology", "bio", rows);

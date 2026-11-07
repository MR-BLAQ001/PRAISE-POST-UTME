import { makeQuestions, type SeedRow } from "@/lib/questions/helpers";

const rows: SeedRow[] = [
  // Organic Chemistry
  ["Organic Chemistry", "easy", "The general formula of alkanes is ___.", ["CnH2n", "CnH2n+2", "CnH2n−2", "CnHn"], "B", "Alkanes are saturated hydrocarbons with the general formula CnH2n+2."],
  ["Organic Chemistry", "easy", "The molecular formula of methane is ___.", ["CH4", "C2H6", "CH3OH", "CO2"], "A", "Methane, the simplest alkane, has one carbon and four hydrogen atoms: CH4."],
  ["Organic Chemistry", "easy", "The functional group present in alkenes is ___.", ["a carbon–carbon double bond", "a hydroxyl group", "a carboxyl group", "an amino group"], "A", "Alkenes contain a C=C double bond, making them unsaturated."],
  ["Organic Chemistry", "easy", "The molecular formula of ethanol is ___.", ["CH3OH", "C2H5OH", "CH3COOH", "C2H6"], "B", "Ethanol is C2H5OH, a two-carbon alcohol."],
  ["Organic Chemistry", "medium", "The fermentation of glucose produces ethanol and ___.", ["oxygen", "carbon dioxide", "methane", "hydrogen"], "B", "C6H12O6 → 2C2H5OH + 2CO2 during fermentation."],
  ["Organic Chemistry", "medium", "A homologous series is a family of compounds that ___.", ["have identical molecular formulae", "differ by a CH2 unit", "contain only carbon", "are all gases"], "B", "Members of a homologous series differ by one CH2 group and share similar chemical properties."],
  ["Organic Chemistry", "hard", "Which pair are structural isomers?", ["Butane and 2-methylpropane", "Ethene and ethyne", "Methane and methanol", "Propane and butane"], "A", "Butane and 2-methylpropane both have C4H10 but different arrangements of atoms."],
  ["Organic Chemistry", "medium", "Ethene decolourises bromine water because it undergoes ___.", ["addition", "substitution", "elimination", "oxidation to CO2"], "A", "The C=C double bond undergoes addition with bromine, removing its colour."],
  ["Organic Chemistry", "medium", "The reaction between an alcohol and a carboxylic acid produces ___.", ["an ester", "an alkane", "an amine", "a ketone"], "A", "Esterification produces an ester and water."],
  ["Organic Chemistry", "medium", "Polymerisation of ethene produces ___.", ["polythene", "PVC", "nylon", "polystyrene"], "A", "Addition polymerisation of ethene monomers produces polythene (polyethene)."],

  // Atomic Structure
  ["Atomic Structure", "easy", "A chlorine atom has 17 protons and 18 neutrons. What is its mass number?", ["17", "18", "35", "36"], "C", "Mass number is the sum of protons and neutrons: 17 + 18 = 35."],
  ["Atomic Structure", "easy", "Mass number is the sum of ___.", ["protons and electrons", "protons and neutrons", "neutrons and electrons", "protons only"], "B", "Mass number = number of protons + number of neutrons."],
  ["Atomic Structure", "easy", "The electron configuration of oxygen (atomic number 8) is ___.", ["2, 6", "2, 8", "8", "2, 4, 2"], "A", "Oxygen has 8 electrons arranged as 2 in the first shell and 6 in the second."],
  ["Atomic Structure", "medium", "Isotopes of an element have the same number of ___.", ["neutrons but different protons", "protons but different neutrons", "protons and neutrons but different electrons", "electrons and neutrons"], "B", "Isotopes have the same atomic number (protons) but different mass numbers due to different neutrons."],
  ["Atomic Structure", "medium", "The discovery of the nucleus is associated with ___.", ["J. J. Thomson", "Ernest Rutherford", "Niels Bohr", "John Dalton"], "B", "Rutherford's gold-foil experiment led to the nuclear model of the atom."],
  ["Atomic Structure", "easy", "Sodium has an atomic number of 11. Its electron configuration is ___.", ["2, 8, 1", "2, 9", "2, 8, 2", "2, 7, 2"], "A", "Sodium has 11 electrons: 2 + 8 + 1."],
  ["Atomic Structure", "medium", "Chlorine exists mainly as two isotopes of mass numbers 35 and 37. This means the isotopes have ___.", ["different protons", "different neutrons", "different electrons", "different chemical formulae"], "B", "Both isotopes have 17 protons; they differ in the number of neutrons (18 and 20)."],
  ["Atomic Structure", "hard", "The maximum number of electrons in a principal shell is given by ___.", ["n", "2n", "n²", "2n²"], "D", "The maximum electron capacity of a shell is 2n², where n is the principal quantum number."],
  ["Atomic Structure", "medium", "A sodium ion, Na⁺, is formed when a sodium atom ___.", ["gains one electron", "loses one electron", "gains one proton", "loses one neutron"], "B", "Na loses one valence electron to form Na⁺ with a stable noble-gas configuration."],
  ["Atomic Structure", "easy", "The neutron has a charge of ___.", ["+1", "−1", "0", "+2"], "C", "Neutrons are neutral particles."],

  // Chemical Bonding
  ["Chemical Bonding", "easy", "An ionic bond is formed by the ___ of electrons.", ["sharing", "transfer", "loss of protons", "sharing of neutrons"], "B", "Ionic bonding involves transfer of electrons from a metal to a non-metal."],
  ["Chemical Bonding", "easy", "A covalent bond involves the ___ of electrons.", ["transfer", "sharing", "complete loss", "emission"], "B", "Covalent bonds form when atoms share pairs of electrons."],
  ["Chemical Bonding", "easy", "Which compound is ionic?", ["NaCl", "CO2", "CH4", "H2O"], "A", "Sodium chloride is formed by electron transfer between sodium and chlorine."],
  ["Chemical Bonding", "medium", "Water is a polar covalent compound because ___.", ["it contains ions", "oxygen is more electronegative than hydrogen", "it has no bonds", "it is a gas"], "B", "The unequal sharing of electrons, due to oxygen's higher electronegativity, makes water polar."],
  ["Chemical Bonding", "medium", "Metallic bonding is best described as ___.", ["positive ions in a sea of delocalised electrons", "shared electron pairs only", "transfer of protons", "hydrogen bonding"], "A", "Metal cations are held together by a sea of delocalised valence electrons."],
  ["Chemical Bonding", "easy", "Noble gases are chemically unreactive because they ___.", ["have full outer shells", "have one electron", "are metals", "form ionic bonds"], "A", "Noble gases have stable, full outer electron shells."],
  ["Chemical Bonding", "medium", "Diamond has a very high melting point because it has ___.", ["a giant covalent structure", "ionic bonds", "weak van der Waals forces only", "metallic bonds"], "A", "Each carbon atom in diamond is covalently bonded to four others in a giant lattice."],
  ["Chemical Bonding", "medium", "Electrovalent compounds generally have high melting points because ___.", ["they have weak forces", "strong electrostatic forces hold the ions", "they are covalent", "they contain molecules"], "B", "Strong electrostatic attraction between oppositely charged ions requires much energy to break."],
  ["Chemical Bonding", "medium", "Hydrogen bonding in water explains its ___.", ["high boiling point", "low density only", "colour", "radioactivity"], "A", "Hydrogen bonds between water molecules are strong enough to raise its boiling point."],
  ["Chemical Bonding", "hard", "The bond in an oxygen molecule, O2, is a ___.", ["single bond", "double bond", "triple bond", "ionic bond"], "B", "The oxygen atoms share two pairs of electrons, forming a double bond."],

  // Acids & Bases
  ["Acids & Bases", "easy", "A solution with a pH of 3 is ___.", ["acidic", "neutral", "basic", "alkaline"], "A", "pH values below 7 indicate acidity; pH 3 is acidic."],
  ["Acids & Bases", "easy", "Neutralisation of an acid with a base produces ___.", ["a salt and water", "only hydrogen", "an acid and oxygen", "a metal"], "A", "Acid + base → salt + water."],
  ["Acids & Bases", "easy", "Which of the following is a strong acid?", ["Hydrochloric acid", "Ethanoic acid", "Carbonic acid", "Citric acid"], "A", "Hydrochloric acid ionises almost completely in water and is a strong acid."],
  ["Acids & Bases", "easy", "Litmus paper turns ___ in a basic solution.", ["red", "blue", "colourless", "green"], "B", "Blue litmus is retained in bases; red litmus turns blue in a base."],
  ["Acids & Bases", "easy", "Sodium hydroxide is a ___.", ["strong base", "weak acid", "neutral salt", "strong acid"], "A", "Sodium hydroxide is a strong alkali that dissociates completely in water."],
  ["Acids & Bases", "easy", "A neutral aqueous solution has a pH of ___.", ["0", "7", "10", "14"], "B", "At 25 °C, a neutral solution has pH 7."],
  ["Acids & Bases", "hard", "Which oxide is amphoteric?", ["Aluminium oxide", "Sodium oxide", "Carbon dioxide", "Sulphur dioxide"], "A", "Al2O3 can react with both acids and bases, so it is amphoteric."],
  ["Acids & Bases", "medium", "The reaction of an acid with a carbonate releases ___.", ["oxygen", "carbon dioxide", "hydrogen", "chlorine"], "B", "Acid + carbonate → salt + water + carbon dioxide."],
  ["Acids & Bases", "medium", "Phenolphthalein is colourless in ___.", ["acidic solution", "basic solution", "neutral salt only", "all solutions"], "A", "Phenolphthalein is colourless in acidic and neutral solutions and pink in alkaline solution."],
  ["Acids & Bases", "medium", "A weak acid ___.", ["partially ionises in water", "does not contain hydrogen", "is always dilute", "has pH above 7"], "A", "Weak acids only partially ionise in water, unlike strong acids."],

  // Electrochemistry
  ["Electrochemistry", "easy", "Oxidation is the ___ of electrons.", ["gain", "loss", "sharing", "transfer of protons"], "B", "Oxidation involves loss of electrons; reduction involves gain (OIL RIG)."],
  ["Electrochemistry", "easy", "Reduction is the ___ of electrons.", ["loss", "gain", "sharing equally", "removal"], "B", "Reduction is gain of electrons."],
  ["Electrochemistry", "medium", "During electrolysis, oxidation occurs at the ___.", ["cathode", "anode", "salt bridge", "voltmeter"], "B", "The anode is the electrode where oxidation (loss of electrons) occurs."],
  ["Electrochemistry", "easy", "An electrolyte is a substance that ___.", ["conducts electricity when molten or in solution", "never dissolves", "is always a metal", "contains no ions"], "A", "Electrolytes contain mobile ions that carry current when molten or dissolved."],
  ["Electrochemistry", "medium", "In the electrolysis of concentrated brine, ___ is produced at the anode.", ["sodium", "chlorine", "hydrogen", "oxygen"], "B", "Chloride ions are discharged at the anode to form chlorine gas."],
  ["Electrochemistry", "medium", "A galvanic cell converts ___ energy into electrical energy.", ["chemical", "mechanical", "light", "nuclear"], "A", "Galvanic cells convert chemical energy from redox reactions into electrical energy."],
  ["Electrochemistry", "medium", "Rusting of iron is a process in which iron is ___.", ["reduced", "oxidised", "neutralised", "melted"], "B", "Iron loses electrons and is oxidised to hydrated iron(III) oxide."],
  ["Electrochemistry", "easy", "During electrolysis, reduction occurs at the ___.", ["anode", "cathode", "battery", "electrolyte surface"], "B", "Cations gain electrons at the cathode, where reduction occurs."],
  ["Electrochemistry", "medium", "In copper electroplating, copper is deposited at the ___.", ["anode", "cathode", "power supply", "filter"], "B", "Copper ions are reduced and deposited onto the cathode, the object being plated."],
  ["Electrochemistry", "medium", "The oxidation number of oxygen in most compounds is ___.", ["+2", "−2", "0", "+1"], "B", "Oxygen usually has an oxidation number of −2 in compounds."]
];

export const chemistryQuestions = makeQuestions("chemistry", "chm", rows);

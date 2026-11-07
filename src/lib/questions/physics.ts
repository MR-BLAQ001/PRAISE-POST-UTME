import { makeQuestions, type SeedRow } from "@/lib/questions/helpers";

const rows: SeedRow[] = [
  // Mechanics
  ["Mechanics", "easy", "The SI unit of force is the ___.", ["joule", "newton", "watt", "pascal"], "B", "Force is measured in newtons (N), where 1 N = 1 kg·m/s²."],
  ["Mechanics", "medium", "A car starts from rest and accelerates at 2 m/s² for 5 s. Its final velocity is ___.", ["5 m/s", "10 m/s", "20 m/s", "50 m/s"], "B", "Using v = u + at: v = 0 + (2)(5) = 10 m/s."],
  ["Mechanics", "easy", "A body of mass 5 kg has a weight of ___ near the Earth's surface. (Take g = 10 m/s²)", ["0.5 N", "5 N", "50 N", "500 N"], "C", "Weight W = mg = 5 × 10 = 50 N."],
  ["Mechanics", "easy", "Newton's first law of motion is also known as the law of ___.", ["inertia", "gravitation", "momentum", "action and reaction"], "A", "The first law states that a body remains in its state of rest or uniform motion unless acted on by a net force; this property is inertia."],
  ["Mechanics", "medium", "A 2 kg object moves at 3 m/s. Its momentum is ___.", ["1.5 kg·m/s", "5 kg·m/s", "6 kg·m/s", "12 kg·m/s"], "C", "Momentum p = mv = 2 × 3 = 6 kg·m/s."],
  ["Mechanics", "medium", "A force of 10 N moves a body through 4 m in the direction of the force. The work done is ___.", ["2.5 J", "14 J", "40 J", "400 J"], "C", "Work = force × distance = 10 × 4 = 40 J."],
  ["Mechanics", "medium", "The kinetic energy of a 2 kg body moving at 4 m/s is ___.", ["8 J", "16 J", "32 J", "64 J"], "B", "KE = ½mv² = ½ × 2 × 4² = 16 J."],
  ["Mechanics", "medium", "A body moves with constant velocity. The net force acting on it is ___.", ["zero", "equal to its weight", "equal to its momentum", "increasing"], "A", "Constant velocity means zero acceleration, so by Newton's second law the net force is zero."],
  ["Mechanics", "medium", "For a projectile on level ground, the maximum range is obtained at a launch angle of ___.", ["30°", "45°", "60°", "90°"], "B", "The range R = u² sin 2θ/g is maximum when sin 2θ = 1, i.e. θ = 45°."],
  ["Mechanics", "easy", "Pressure is defined as ___.", ["force × area", "force ÷ area", "work ÷ time", "mass × velocity"], "B", "Pressure is the force acting normally per unit area: P = F/A."],

  // Electricity
  ["Electricity", "easy", "Ohm's law is expressed as ___.", ["V = IR", "V = I/R", "I = VR", "R = VI"], "A", "Ohm's law states that V = IR, where V is voltage, I is current and R is resistance."],
  ["Electricity", "easy", "Two resistors of 2 Ω and 3 Ω are connected in series. The effective resistance is ___.", ["1.2 Ω", "2.5 Ω", "5 Ω", "6 Ω"], "C", "In series, resistances add: 2 + 3 = 5 Ω."],
  ["Electricity", "medium", "Two 6 Ω resistors are connected in parallel. The effective resistance is ___.", ["3 Ω", "6 Ω", "12 Ω", "36 Ω"], "A", "For two equal resistors in parallel, R = 6/2 = 3 Ω."],
  ["Electricity", "easy", "The SI unit of electric current is the ___.", ["volt", "ohm", "ampere", "coulomb"], "C", "Current is measured in amperes (A)."],
  ["Electricity", "medium", "An appliance operates on 220 V and draws a current of 2 A. Its power is ___.", ["110 W", "220 W", "440 W", "4400 W"], "C", "Power P = VI = 220 × 2 = 440 W."],
  ["Electricity", "medium", "A current of 2 A flows for 10 s. The quantity of charge transferred is ___.", ["0.2 C", "5 C", "12 C", "20 C"], "D", "Charge Q = It = 2 × 10 = 20 C."],
  ["Electricity", "easy", "The main purpose of a fuse in a circuit is to ___.", ["increase current", "protect against excess current", "store charge", "convert AC to DC"], "B", "A fuse melts and breaks the circuit when the current exceeds a safe value."],
  ["Electricity", "medium", "Conventional current flows from ___ in an external circuit.", ["negative to positive", "positive to negative", "both directions", "no fixed direction"], "B", "Conventional current is taken as the flow of positive charge from the positive terminal to the negative terminal."],
  ["Electricity", "medium", "The unit of electrical energy commonly used for billing is the ___.", ["kilowatt-hour", "newton", "coulomb", "ohm"], "A", "Electrical energy for billing is measured in kilowatt-hours (kWh)."],

  // Waves
  ["Waves", "easy", "Wave speed is given by ___.", ["frequency ÷ wavelength", "frequency × wavelength", "wavelength ÷ frequency", "frequency + wavelength"], "B", "The wave equation is v = fλ."],
  ["Waves", "easy", "The SI unit of frequency is the ___.", ["metre", "second", "hertz", "joule"], "C", "Frequency is measured in hertz (Hz), or cycles per second."],
  ["Waves", "easy", "Sound cannot travel through ___.", ["solids", "liquids", "gases", "a vacuum"], "D", "Sound is a mechanical wave and needs a material medium; it cannot travel through a vacuum."],
  ["Waves", "easy", "Which of the following is a transverse wave?", ["sound wave", "light wave", "compression in a spring", "rarefaction in air"], "B", "Light is an electromagnetic transverse wave; sound is longitudinal."],
  ["Waves", "medium", "A wave of wavelength 2 m has a frequency of 50 Hz. Its speed is ___.", ["25 m/s", "52 m/s", "100 m/s", "200 m/s"], "C", "v = fλ = 50 × 2 = 100 m/s."],
  ["Waves", "easy", "The reflection of sound waves produces ___.", ["an echo", "refraction", "dispersion", "diffraction"], "A", "An echo is heard when sound is reflected from a distant surface."],
  ["Waves", "easy", "The pitch of a sound depends on its ___.", ["amplitude", "frequency", "speed", "quality"], "B", "Pitch increases with frequency; amplitude determines loudness."],
  ["Waves", "medium", "Resonance occurs when a system is driven at its ___.", ["minimum amplitude", "natural frequency", "maximum wavelength", "zero frequency"], "B", "Resonance is maximum energy transfer at the natural frequency of the system."],

  // Optics
  ["Optics", "easy", "The angle of incidence is always equal to the angle of ___ for reflection.", ["refraction", "diffraction", "reflection", "dispersion"], "C", "The law of reflection states that the angle of incidence equals the angle of reflection."],
  ["Optics", "easy", "A convex lens is a ___ lens.", ["diverging", "converging", "plane", "cylindrical"], "B", "A convex lens converges parallel rays to a focal point."],
  ["Optics", "medium", "The image formed on the retina of the human eye is ___.", ["virtual and upright", "real and inverted", "virtual and inverted", "real and upright"], "B", "The eye's lens forms a real, inverted image on the retina; the brain interprets it as upright."],
  ["Optics", "medium", "Refraction of light occurs because light ___.", ["changes speed between media", "is reflected", "is absorbed", "loses energy completely"], "A", "A change in speed as light crosses a boundary causes a change in direction, called refraction."],
  ["Optics", "easy", "A convex mirror is used as a car rear-view mirror mainly because it ___.", ["forms a magnified image", "gives a wider field of view", "forms a real image", "absorbs light"], "B", "A convex mirror gives a wide field of view and forms diminished, upright virtual images."],
  ["Optics", "hard", "Total internal reflection can occur when light travels from ___.", ["air to glass", "glass to air at an angle greater than the critical angle", "air to water", "a vacuum to any medium"], "B", "Total internal reflection occurs when light moves from a denser to a less dense medium and the angle exceeds the critical angle."],
  ["Optics", "medium", "Magnification is defined as ___.", ["image height ÷ object height", "object height ÷ image height", "focal length × object distance", "image distance + object distance"], "A", "Linear magnification m = image height/object height = image distance/object distance."],
  ["Optics", "medium", "The splitting of white light into its component colours by a prism is called ___.", ["reflection", "dispersion", "diffraction", "polarisation"], "B", "Dispersion occurs because different colours refract by different amounts in glass."],

  // Heat
  ["Heat", "easy", "Heat can travel through a vacuum by ___.", ["conduction", "convection", "radiation", "evaporation"], "C", "Radiation transfers energy by electromagnetic waves and does not require a medium."],
  ["Heat", "easy", "At standard atmospheric pressure, pure water boils at ___.", ["0 °C", "50 °C", "100 °C", "212 °C"], "C", "At standard atmospheric pressure, pure water boils at 100 °C (212 °F)."],
  ["Heat", "easy", "The SI unit of specific heat capacity is ___.", ["J/kg·K", "J·K", "N/kg", "kg/J"], "A", "Specific heat capacity is the energy needed to raise 1 kg of a substance by 1 K, measured in J/kg·K."],
  ["Heat", "easy", "Convert 27 °C to kelvin.", ["27 K", "246 K", "273 K", "300 K"], "D", "T(K) = T(°C) + 273 = 27 + 273 = 300 K."],
  ["Heat", "medium", "Metals conduct heat well because they have ___.", ["free electrons", "many air spaces", "low density", "high specific heat"], "A", "Free electrons in metals carry thermal energy rapidly through the lattice."],
  ["Heat", "medium", "During a change of state, the temperature of a pure substance ___.", ["increases steadily", "decreases steadily", "remains constant", "fluctuates randomly"], "C", "Latent heat is used to change state, so the temperature remains constant during the change."],
  ["Heat", "medium", "A thermometer works because a physical property changes with ___.", ["mass", "temperature", "pressure only", "volume only"], "B", "Thermometers rely on a property such as expansion that varies predictably with temperature."],
  ["Heat", "medium", "The bimetallic strip in a thermostat bends because the two metals have different ___.", ["densities at 0 K", "coefficients of expansion", "melting points", "colours"], "B", "Different rates of thermal expansion make the strip bend when heated or cooled."],

  // Modern Physics
  ["Modern Physics", "medium", "The photoelectric effect provides evidence that light ___.", ["is a longitudinal wave", "behaves as a particle", "cannot travel in a vacuum", "has no energy"], "B", "The photoelectric effect is explained by photons, showing the particle nature of light."],
  ["Modern Physics", "easy", "An alpha particle is identical to a ___.", ["helium nucleus", "hydrogen nucleus", "electron", "photon"], "A", "An alpha particle consists of two protons and two neutrons, the same as a helium-4 nucleus."],
  ["Modern Physics", "medium", "The time taken for half of the atoms in a radioactive sample to decay is called the ___.", ["half-life", "decay constant", "period", "lifetime"], "A", "Half-life is the time for half the nuclei in a sample to decay."],
  ["Modern Physics", "easy", "Einstein's mass-energy equivalence is expressed as ___.", ["E = mc²", "E = ½mv²", "F = ma", "E = hf"], "A", "E = mc² relates mass and energy, where c is the speed of light."],
  ["Modern Physics", "medium", "Cathode rays are streams of ___.", ["protons", "electrons", "neutrons", "alpha particles"], "B", "Cathode rays are beams of electrons emitted from a heated cathode in a vacuum tube."],
  ["Modern Physics", "easy", "The atomic number of an element is the number of ___.", ["neutrons", "protons", "nucleons", "electrons plus neutrons"], "B", "Atomic number Z equals the number of protons in the nucleus."],
  ["Modern Physics", "medium", "Nuclear fission involves the ___.", ["splitting of a heavy nucleus", "fusion of light nuclei", "emission of light", "capture of an electron"], "A", "Fission splits a heavy nucleus into lighter nuclei, releasing energy."]
];

export const physicsQuestions = makeQuestions("physics", "phy", rows);

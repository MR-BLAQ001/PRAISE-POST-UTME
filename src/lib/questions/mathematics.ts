import { makeQuestions, type SeedRow } from "@/lib/questions/helpers";

const rows: SeedRow[] = [
  // Algebra
  ["Algebra", "easy", "Solve for x: 2x + 5 = 17.", ["4", "6", "7", "11"], "B", "Subtract 5 from both sides: 2x = 12. Divide by 2: x = 6."],
  ["Algebra", "medium", "The roots of x² − 5x + 6 = 0 are ___.", ["1 and 6", "2 and 3", "−2 and −3", "5 and 6"], "B", "Factorising: (x − 2)(x − 3) = 0, so x = 2 or x = 3."],
  ["Algebra", "medium", "Simplify (x³y²) ÷ (xy⁴).", ["x²/y²", "x²y²", "x⁴/y²", "x²/y⁶"], "A", "Subtract indices for like bases: x³⁻¹ = x² and y²⁻⁴ = y⁻² = 1/y²."],
  ["Algebra", "easy", "Factorise x² − 9.", ["(x − 3)(x + 3)", "(x − 9)(x + 1)", "(x − 3)²", "(x + 3)²"], "A", "This is a difference of two squares: a² − b² = (a − b)(a + b)."],
  ["Algebra", "easy", "If f(x) = 2x − 3, find f(4).", ["5", "7", "8", "11"], "A", "Substitute x = 4: f(4) = 2(4) − 3 = 8 − 3 = 5."],
  ["Algebra", "medium", "Solve 3(x − 2) = 2x + 1.", ["5", "7", "9", "1"], "B", "Expand: 3x − 6 = 2x + 1. Subtract 2x: x − 6 = 1, so x = 7."],
  ["Algebra", "medium", "If log₂ x = 5, then x = ___.", ["10", "25", "32", "64"], "C", "log₂ x = 5 means 2⁵ = x, so x = 32."],
  ["Algebra", "hard", "Simplify (2a²b)³.", ["6a⁵b³", "8a⁶b³", "8a⁵b³", "6a⁶b³"], "B", "Cube each factor: 2³ = 8, (a²)³ = a⁶ and b³ = b³, giving 8a⁶b³."],

  // Geometry
  ["Geometry", "easy", "The sum of the interior angles of a hexagon is ___.", ["540°", "720°", "900°", "1080°"], "B", "For an n-sided polygon the sum is (n − 2) × 180°. For n = 6: 4 × 180° = 720°."],
  ["Geometry", "easy", "Find the area of a circle of radius 7 cm. (Take π = 22/7)", ["44 cm²", "154 cm²", "308 cm²", "49 cm²"], "B", "Area = πr² = (22/7) × 7 × 7 = 154 cm²."],
  ["Geometry", "easy", "A right-angled triangle has legs 3 cm and 4 cm. The hypotenuse is ___.", ["5 cm", "6 cm", "7 cm", "12 cm"], "A", "By Pythagoras: hypotenuse = √(3² + 4²) = √25 = 5 cm."],
  ["Geometry", "medium", "Each exterior angle of a regular pentagon is ___.", ["36°", "72°", "108°", "144°"], "B", "Exterior angle = 360°/n = 360°/5 = 72°."],
  ["Geometry", "easy", "The volume of a cube of side 4 cm is ___.", ["16 cm³", "48 cm³", "64 cm³", "96 cm³"], "C", "Volume of a cube = s³ = 4³ = 64 cm³."],
  ["Geometry", "easy", "Two angles lie on a straight line. If one is 65°, the other is ___.", ["25°", "65°", "115°", "295°"], "C", "Angles on a straight line sum to 180°, so the other angle is 180° − 65° = 115°."],
  ["Geometry", "medium", "A trapezium has parallel sides 8 cm and 12 cm and height 5 cm. Its area is ___.", ["40 cm²", "50 cm²", "60 cm²", "100 cm²"], "B", "Area = ½(a + b)h = ½(8 + 12)(5) = 50 cm²."],
  ["Geometry", "medium", "The circumference of a circle of radius 14 cm is ___. (Take π = 22/7)", ["44 cm", "88 cm", "154 cm", "616 cm"], "B", "Circumference = 2πr = 2 × (22/7) × 14 = 88 cm."],

  // Trigonometry
  ["Trigonometry", "easy", "sin 30° = ___.", ["1/2", "√2/2", "√3/2", "1"], "A", "The exact value of sin 30° is 1/2."],
  ["Trigonometry", "easy", "cos 60° = ___.", ["0", "1/2", "√3/2", "1"], "B", "The exact value of cos 60° is 1/2."],
  ["Trigonometry", "easy", "tan 45° = ___.", ["0", "1/2", "1", "√3"], "C", "tan 45° = sin 45°/cos 45° = 1."],
  ["Trigonometry", "medium", "In a right-angled triangle, the side opposite angle θ is 3 cm and the hypotenuse is 5 cm. Find sin θ.", ["3/5", "4/5", "5/3", "5/4"], "A", "sin θ = opposite/hypotenuse = 3/5."],
  ["Trigonometry", "easy", "Which identity is always true for any angle θ?", ["sin²θ + cos²θ = 1", "sin θ + cos θ = 1", "sin²θ − cos²θ = 1", "tan θ = sin θ cos θ"], "A", "The Pythagorean identity is sin²θ + cos²θ = 1."],
  ["Trigonometry", "easy", "180° is equal to ___ radians.", ["π/2", "π", "2π", "3π/2"], "B", "Since 360° = 2π radians, 180° = π radians."],
  ["Trigonometry", "medium", "cos 0° = ___.", ["0", "1/2", "1", "−1"], "C", "The cosine of 0° is 1."],

  // Statistics
  ["Statistics", "easy", "Find the mean of 2, 4, 6, 8 and 10.", ["5", "6", "7", "8"], "B", "Mean = (2 + 4 + 6 + 8 + 10)/5 = 30/5 = 6."],
  ["Statistics", "easy", "Find the median of 3, 7, 9, 12 and 15.", ["7", "9", "12", "15"], "B", "The values are already ordered; the middle value is 9."],
  ["Statistics", "easy", "Find the mode of 2, 3, 3, 4, 5 and 3.", ["2", "3", "4", "5"], "B", "The value 3 occurs most frequently."],
  ["Statistics", "easy", "Find the range of 12, 7, 15 and 9.", ["6", "8", "12", "15"], "B", "Range = highest − lowest = 15 − 7 = 8."],
  ["Statistics", "medium", "The mean of five numbers is 8. Their total is ___.", ["13", "32", "40", "48"], "C", "Total = mean × number of values = 8 × 5 = 40."],
  ["Statistics", "medium", "Four numbers have a mean of 10. If three of them are 8, 9 and 12, the fourth is ___.", ["9", "10", "11", "12"], "C", "Total = 4 × 10 = 40. The fourth number is 40 − (8 + 9 + 12) = 11."],
  ["Statistics", "medium", "The class mark of the interval 20–30 is ___.", ["20", "25", "30", "50"], "B", "Class mark = (lower + upper)/2 = (20 + 30)/2 = 25."],

  // Probability
  ["Probability", "easy", "What is the probability of obtaining a head when a fair coin is tossed once?", ["1/4", "1/3", "1/2", "1"], "C", "There are 2 equally likely outcomes and 1 favourable outcome, so P(head) = 1/2."],
  ["Probability", "easy", "A fair die is rolled once. What is the probability of obtaining an even number?", ["1/6", "1/3", "1/2", "2/3"], "C", "The even numbers are 2, 4 and 6: 3 favourable outcomes out of 6, so 1/2."],
  ["Probability", "easy", "A bag contains 3 red balls and 7 blue balls. A ball is picked at random. Find P(red).", ["3/10", "7/10", "3/7", "1/3"], "A", "There are 3 red balls out of 10 total, so P(red) = 3/10."],
  ["Probability", "medium", "Two fair coins are tossed together. What is the probability that both show heads?", ["1/2", "1/3", "1/4", "3/4"], "C", "P(HH) = 1/2 × 1/2 = 1/4."],
  ["Probability", "medium", "A fair die is rolled once. What is the probability of not obtaining a 6?", ["1/6", "5/6", "1/2", "2/3"], "B", "P(not 6) = 1 − P(6) = 1 − 1/6 = 5/6."],
  ["Probability", "hard", "How many distinct arrangements can be made with the letters of the word BOOK?", ["4", "6", "12", "24"], "C", "There are 4 letters with O repeated twice: 4!/2! = 24/2 = 12."],

  // Calculus
  ["Calculus", "easy", "Differentiate x³ with respect to x.", ["3x", "x²", "3x²", "x⁴/4"], "C", "Using the power rule: d/dx(xⁿ) = nxⁿ⁻¹, so d/dx(x³) = 3x²."],
  ["Calculus", "easy", "Differentiate 5x² with respect to x.", ["5x", "10x", "10x²", "2x"], "B", "d/dx(5x²) = 2 × 5x = 10x."],
  ["Calculus", "easy", "Evaluate ∫ 2x dx.", ["x² + C", "2x² + C", "x + C", "2 + C"], "A", "Using the power rule for integration: ∫2x dx = 2(x²/2) + C = x² + C."],
  ["Calculus", "medium", "Differentiate sin x with respect to x.", ["cos x", "−cos x", "−sin x", "tan x"], "A", "The derivative of sin x is cos x."],
  ["Calculus", "easy", "Find the gradient of the line y = 3x + 2.", ["2", "3", "5", "1/3"], "B", "In y = mx + c, the gradient m is the coefficient of x, which is 3."],
  ["Calculus", "medium", "Evaluate the definite integral of 2x from x = 0 to x = 1.", ["1", "2", "1/2", "0"], "A", "∫2x dx = x². Evaluating from 0 to 1 gives 1² − 0² = 1."],
  ["Calculus", "medium", "Differentiate x² + 3x.", ["2x + 3", "x + 3", "2x", "2x² + 3"], "A", "Differentiate term by term: d/dx(x²) = 2x and d/dx(3x) = 3, giving 2x + 3."],

  // Number Systems
  ["Number Systems", "easy", "Convert 101₂ to base ten.", ["3", "5", "6", "7"], "B", "1×2² + 0×2¹ + 1×2⁰ = 4 + 0 + 1 = 5."],
  ["Number Systems", "medium", "Express 25₁₀ in binary.", ["10011₂", "11001₂", "11010₂", "10101₂"], "B", "25 = 16 + 8 + 1 = 2⁴ + 2³ + 2⁰, which is 11001₂."],
  ["Number Systems", "easy", "Convert 111₂ to base ten.", ["5", "6", "7", "8"], "C", "1×4 + 1×2 + 1×1 = 7."],
  ["Number Systems", "hard", "Evaluate 7₈ + 5₈, giving the answer in base eight.", ["12₈", "13₈", "14₈", "15₈"], "C", "In base eight, 7 + 5 = 12₁₀, which is 14₈ (1 eight and 4 units)."],
  ["Number Systems", "easy", "Find the LCM of 12 and 18.", ["24", "36", "54", "72"], "B", "Multiples of 12: 12, 24, 36...; multiples of 18: 18, 36...; the lowest common multiple is 36."],
  ["Number Systems", "easy", "Find the HCF of 24 and 36.", ["6", "8", "12", "18"], "C", "The highest common factor of 24 and 36 is 12."],
  ["Number Systems", "medium", "Simplify √50.", ["2√5", "5√2", "10√5", "25√2"], "B", "√50 = √(25 × 2) = √25 × √2 = 5√2."]
];

export const mathematicsQuestions = makeQuestions("mathematics", "mth", rows);

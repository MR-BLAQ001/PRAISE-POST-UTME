import type { University } from "@/lib/types";

/**
 * Institution reference data. Admission requirements, cut-off marks and
 * screening dates change every year and are NOT reproduced here. Every record
 * points students to the official university website for verification.
 */
export const UNIVERSITIES: University[] = [
  {
    id: "unilag",
    name: "University of Lagos",
    abbreviation: "UNILAG",
    state: "Lagos",
    city: "Akoka, Lagos",
    type: "Federal",
    website: "https://unilag.edu.ng",
    established: 1962,
    overview:
      "One of Nigeria's foremost federal universities, known for strong programmes in law, medicine, engineering, sciences, business and the humanities.",
    faculties: [
      "Arts",
      "Science",
      "Engineering",
      "Law",
      "Medicine",
      "Social Sciences",
      "Management Sciences",
      "Education"
    ],
    courses: [
      "Medicine and Surgery",
      "Law",
      "Mechanical Engineering",
      "Electrical/Electronic Engineering",
      "Computer Science",
      "Economics",
      "Accounting",
      "Mass Communication",
      "Pharmacy",
      "Nursing Science",
      "Political Science",
      "English Language"
    ],
    postUtmeSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Government", "Literature in English"],
    subjectCombinations: [
      { course: "Medicine and Surgery", subjects: ["English Language", "Biology", "Chemistry", "Physics"] },
      { course: "Law", subjects: ["English Language", "Literature in English", "Government", "History"] },
      { course: "Mechanical Engineering", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Computer Science", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Economics", subjects: ["English Language", "Mathematics", "Economics", "Government"] },
      { course: "Accounting", subjects: ["English Language", "Mathematics", "Economics", "Commerce"] },
      { course: "Mass Communication", subjects: ["English Language", "Literature in English", "Government", "Economics"] },
      { course: "Pharmacy", subjects: ["English Language", "Biology", "Chemistry", "Physics"] }
    ],
    requirements: [
      "Five O'Level credit passes, including English Language and Mathematics, in not more than two sittings (departmental requirements may differ).",
      "Sit the Unified Tertiary Matriculation Examination (UTME) with the approved subject combination for your course.",
      "Participate in the university's POST-UTME screening and meet the departmental requirements for the year.",
      "Upload valid O'Level and UTME results on the official admission portal when required."
    ],
    verificationNote:
      "Cut-off marks, screening dates and departmental requirements change yearly. Confirm everything on the official UNILAG website and admission portal before applying."
  },
  {
    id: "unn",
    name: "University of Nigeria, Nsukka",
    abbreviation: "UNN",
    state: "Enugu",
    city: "Nsukka, Enugu State",
    type: "Federal",
    website: "https://www.unn.edu.ng",
    established: 1955,
    overview:
      "Founded as Nigeria's first indigenous university, UNN offers a broad range of programmes across sciences, arts, engineering, agriculture, law and health sciences.",
    faculties: [
      "Agriculture",
      "Arts",
      "Biological Sciences",
      "Physical Sciences",
      "Engineering",
      "Law",
      "Health Sciences",
      "Social Sciences",
      "Education"
    ],
    courses: [
      "Medicine and Surgery",
      "Law",
      "Civil Engineering",
      "Computer Science",
      "Economics",
      "Accounting",
      "Agriculture",
      "Nursing Science",
      "Microbiology",
      "Mass Communication",
      "Political Science",
      "English and Literary Studies"
    ],
    postUtmeSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Government", "Literature in English", "Agricultural Science"],
    subjectCombinations: [
      { course: "Medicine and Surgery", subjects: ["English Language", "Biology", "Chemistry", "Physics"] },
      { course: "Law", subjects: ["English Language", "Literature in English", "Government", "History"] },
      { course: "Civil Engineering", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Computer Science", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Economics", subjects: ["English Language", "Mathematics", "Economics", "Government"] },
      { course: "Agriculture", subjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Agricultural Science"] },
      { course: "Microbiology", subjects: ["English Language", "Biology", "Chemistry", "Physics"] },
      { course: "Mass Communication", subjects: ["English Language", "Literature in English", "Government", "Economics"] }
    ],
    requirements: [
      "Five O'Level credit passes, including English Language and Mathematics where required by the course.",
      "A valid UTME result with the correct subject combination for the chosen programme.",
      "Registration for and participation in the UNN POST-UTME/screening exercise.",
      "Meeting the department's specific O'Level and UTME requirements for the admission year."
    ],
    verificationNote:
      "UNN reviews cut-off marks and screening procedures each year. Verify current details on the official UNN website before registering."
  },
  {
    id: "ui",
    name: "University of Ibadan",
    abbreviation: "UI",
    state: "Oyo",
    city: "Ibadan, Oyo State",
    type: "Federal",
    website: "https://www.ui.edu.ng",
    established: 1948,
    overview:
      "Nigeria's oldest university, with a strong research tradition and competitive programmes in medicine, science, agriculture, arts, law and the social sciences.",
    faculties: [
      "Arts",
      "Science",
      "Agriculture",
      "Medicine",
      "Public Health",
      "Law",
      "Social Sciences",
      "Education"
    ],
    courses: [
      "Medicine and Surgery",
      "Law",
      "Nursing Science",
      "Pharmacy",
      "Computer Science",
      "Economics",
      "Accounting",
      "Agriculture",
      "Mass Communication",
      "Political Science",
      "English Language",
      "Geography"
    ],
    postUtmeSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Government", "Literature in English", "Geography", "Agricultural Science"],
    subjectCombinations: [
      { course: "Medicine and Surgery", subjects: ["English Language", "Biology", "Chemistry", "Physics"] },
      { course: "Law", subjects: ["English Language", "Literature in English", "Government", "History"] },
      { course: "Pharmacy", subjects: ["English Language", "Biology", "Chemistry", "Physics"] },
      { course: "Computer Science", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Economics", subjects: ["English Language", "Mathematics", "Economics", "Government"] },
      { course: "Agriculture", subjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Agricultural Science"] },
      { course: "English Language", subjects: ["English Language", "Literature in English", "Government", "CRS/IRS"] },
      { course: "Geography", subjects: ["English Language", "Geography", "Mathematics", "Physics"] }
    ],
    requirements: [
      "Five O'Level credit passes including English Language and Mathematics, plus any course-specific subjects.",
      "UTME entry with the approved four-subject combination for the programme.",
      "Successful participation in the UI POST-UTME screening exercise.",
      "Fulfilment of faculty and departmental admission requirements for the session."
    ],
    verificationNote:
      "UI's admission criteria and screening dates are announced annually. Check the official UI website and admissions portal for the current requirements."
  },
  {
    id: "oau",
    name: "Obafemi Awolowo University",
    abbreviation: "OAU",
    state: "Osun",
    city: "Ile-Ife, Osun State",
    type: "Federal",
    website: "https://oauife.edu.ng",
    established: 1961,
    overview:
      "A leading federal university with respected programmes in law, medicine, engineering, science, arts and agriculture, set on a historic campus in Ile-Ife.",
    faculties: [
      "Arts",
      "Science",
      "Engineering",
      "Law",
      "Clinical Sciences",
      "Basic Medical Sciences",
      "Social Sciences",
      "Agriculture",
      "Environmental Design"
    ],
    courses: [
      "Medicine and Surgery",
      "Law",
      "Mechanical Engineering",
      "Computer Science",
      "Economics",
      "Accounting",
      "Agriculture",
      "Nursing Science",
      "Pharmacy",
      "Mass Communication",
      "Political Science",
      "English Language"
    ],
    postUtmeSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Government", "Literature in English", "Agricultural Science", "Geography"],
    subjectCombinations: [
      { course: "Medicine and Surgery", subjects: ["English Language", "Biology", "Chemistry", "Physics"] },
      { course: "Law", subjects: ["English Language", "Literature in English", "Government", "History"] },
      { course: "Mechanical Engineering", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Computer Science", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Economics", subjects: ["English Language", "Mathematics", "Economics", "Government"] },
      { course: "Accounting", subjects: ["English Language", "Mathematics", "Economics", "Commerce"] },
      { course: "Agriculture", subjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Agricultural Science"] },
      { course: "English Language", subjects: ["English Language", "Literature in English", "Government", "CRS/IRS"] }
    ],
    requirements: [
      "Five O'Level credits including English Language and Mathematics, and course-specific subjects where required.",
      "UTME with the correct subject combination for the chosen course.",
      "Participation in the OAU POST-UTME screening exercise.",
      "Meeting the departmental cut-off and other admission requirements for the year."
    ],
    verificationNote:
      "Cut-off marks and screening details are updated annually. Confirm on the official OAU website before making decisions."
  },
  {
    id: "uniport",
    name: "University of Port Harcourt",
    abbreviation: "UNIPORT",
    state: "Rivers",
    city: "Choba, Port Harcourt",
    type: "Federal",
    website: "https://www.uniport.edu.ng",
    established: 1975,
    overview:
      "A major federal university in the Niger Delta with strong science, engineering, health, management and social science programmes.",
    faculties: [
      "Science",
      "Engineering",
      "College of Health Sciences",
      "Social Sciences",
      "Management Sciences",
      "Agriculture",
      "Humanities",
      "Law",
      "Education"
    ],
    courses: [
      "Medicine and Surgery",
      "Law",
      "Petroleum Engineering",
      "Electrical/Electronic Engineering",
      "Computer Science",
      "Economics",
      "Accounting",
      "Microbiology",
      "Nursing Science",
      "Political Science",
      "Mass Communication",
      "Agriculture"
    ],
    postUtmeSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Government", "Literature in English", "Agricultural Science", "Geography"],
    subjectCombinations: [
      { course: "Medicine and Surgery", subjects: ["English Language", "Biology", "Chemistry", "Physics"] },
      { course: "Law", subjects: ["English Language", "Literature in English", "Government", "History"] },
      { course: "Petroleum Engineering", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Computer Science", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Economics", subjects: ["English Language", "Mathematics", "Economics", "Government"] },
      { course: "Microbiology", subjects: ["English Language", "Biology", "Chemistry", "Physics"] },
      { course: "Accounting", subjects: ["English Language", "Mathematics", "Economics", "Commerce"] },
      { course: "Agriculture", subjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Agricultural Science"] }
    ],
    requirements: [
      "Five O'Level credit passes including English Language and Mathematics, with course-specific requirements.",
      "A valid UTME result with the approved subject combination.",
      "Registration and participation in the UNIPORT POST-UTME screening.",
      "Satisfying departmental admission requirements for the session."
    ],
    verificationNote:
      "Requirements and cut-off marks vary by programme and year. Use the official UNIPORT website for current admission information."
  },
  {
    id: "abu",
    name: "Ahmadu Bello University",
    abbreviation: "ABU",
    state: "Kaduna",
    city: "Zaria, Kaduna State",
    type: "Federal",
    website: "https://abu.edu.ng",
    established: 1962,
    overview:
      "One of Africa's largest universities, ABU offers extensive programmes across agriculture, engineering, medicine, sciences, arts, law and administration.",
    faculties: [
      "Agriculture",
      "Arts",
      "Education",
      "Engineering",
      "Environmental Design",
      "Law",
      "Medicine",
      "Pharmaceutical Sciences",
      "Science",
      "Social Sciences",
      "Administration"
    ],
    courses: [
      "Medicine and Surgery",
      "Law",
      "Agriculture",
      "Civil Engineering",
      "Computer Science",
      "Economics",
      "Accounting",
      "Pharmacy",
      "Nursing Science",
      "Mass Communication",
      "Political Science",
      "Geography"
    ],
    postUtmeSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Government", "Literature in English", "Agricultural Science", "Geography"],
    subjectCombinations: [
      { course: "Medicine and Surgery", subjects: ["English Language", "Biology", "Chemistry", "Physics"] },
      { course: "Law", subjects: ["English Language", "Literature in English", "Government", "History"] },
      { course: "Agriculture", subjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Agricultural Science"] },
      { course: "Civil Engineering", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Computer Science", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Economics", subjects: ["English Language", "Mathematics", "Economics", "Government"] },
      { course: "Pharmacy", subjects: ["English Language", "Biology", "Chemistry", "Physics"] },
      { course: "Geography", subjects: ["English Language", "Geography", "Mathematics", "Physics"] }
    ],
    requirements: [
      "Five O'Level credits including English Language and Mathematics, plus course-specific subjects.",
      "UTME with the correct subject combination for the selected programme.",
      "Participation in ABU's POST-UTME screening exercise.",
      "Meeting the relevant departmental admission requirements."
    ],
    verificationNote:
      "Admission requirements and screening dates can change. Verify current details on ABU's official website and admission portal."
  },
  {
    id: "futo",
    name: "Federal University of Technology, Owerri",
    abbreviation: "FUTO",
    state: "Imo",
    city: "Owerri, Imo State",
    type: "Federal",
    website: "https://futo.edu.ng",
    established: 1980,
    overview:
      "A specialised federal university of technology focused on engineering, science, computing, environmental technology and management.",
    faculties: [
      "Engineering",
      "Science",
      "Computing and Information Technology",
      "Environmental Sciences",
      "Agriculture",
      "Management Technology",
      "Health Sciences"
    ],
    courses: [
      "Computer Science",
      "Software Engineering",
      "Mechanical Engineering",
      "Electrical/Electronic Engineering",
      "Civil Engineering",
      "Petroleum Engineering",
      "Biochemistry",
      "Microbiology",
      "Public Health Technology",
      "Project Management Technology",
      "Agricultural Engineering",
      "Architecture"
    ],
    postUtmeSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Geography", "Agricultural Science"],
    subjectCombinations: [
      { course: "Computer Science", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Software Engineering", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Mechanical Engineering", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Civil Engineering", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Microbiology", subjects: ["English Language", "Biology", "Chemistry", "Physics"] },
      { course: "Biochemistry", subjects: ["English Language", "Biology", "Chemistry", "Physics"] },
      { course: "Architecture", subjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Geography"] },
      { course: "Project Management Technology", subjects: ["English Language", "Mathematics", "Economics", "Government"] }
    ],
    requirements: [
      "Five O'Level credit passes including English Language, Mathematics and relevant science subjects.",
      "UTME with the approved subject combination for the chosen technology or science programme.",
      "Participation in the FUTO POST-UTME screening exercise.",
      "Meeting departmental admission requirements for the session."
    ],
    verificationNote:
      "FUTO updates its admission requirements and screening dates regularly. Confirm on the official FUTO website before applying."
  },
  {
    id: "rsu",
    name: "Rivers State University",
    abbreviation: "RSU",
    state: "Rivers",
    city: "Port Harcourt, Rivers State",
    type: "State",
    website: "https://rsu.edu.ng",
    established: 1979,
    overview:
      "A state university with strong science, engineering, law, management and health programmes, historically rooted in science and technology education.",
    faculties: [
      "Science",
      "Engineering",
      "Law",
      "Management Sciences",
      "Social Sciences",
      "Agriculture",
      "Education",
      "Health Sciences",
      "Environmental Sciences"
    ],
    courses: [
      "Medicine and Surgery",
      "Law",
      "Computer Science",
      "Mechanical Engineering",
      "Electrical/Electronic Engineering",
      "Economics",
      "Accounting",
      "Microbiology",
      "Nursing Science",
      "Mass Communication",
      "Political Science",
      "Agriculture"
    ],
    postUtmeSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Government", "Literature in English", "Agricultural Science"],
    subjectCombinations: [
      { course: "Medicine and Surgery", subjects: ["English Language", "Biology", "Chemistry", "Physics"] },
      { course: "Law", subjects: ["English Language", "Literature in English", "Government", "History"] },
      { course: "Computer Science", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Mechanical Engineering", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Economics", subjects: ["English Language", "Mathematics", "Economics", "Government"] },
      { course: "Microbiology", subjects: ["English Language", "Biology", "Chemistry", "Physics"] },
      { course: "Mass Communication", subjects: ["English Language", "Literature in English", "Government", "Economics"] },
      { course: "Agriculture", subjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Agricultural Science"] }
    ],
    requirements: [
      "Five O'Level credits including English Language and Mathematics, and course-specific subjects.",
      "UTME with the correct subject combination for the chosen programme.",
      "Participation in the RSU POST-UTME screening exercise.",
      "Satisfying the university and departmental admission requirements for the year."
    ],
    verificationNote:
      "RSU's admission details are published annually. Check the official RSU website for verified requirements and dates."
  },
  {
    id: "lasu",
    name: "Lagos State University",
    abbreviation: "LASU",
    state: "Lagos",
    city: "Ojo, Lagos State",
    type: "State",
    website: "https://lasu.edu.ng",
    established: 1983,
    overview:
      "A state university offering diverse programmes in law, science, engineering, arts, education, management and social sciences.",
    faculties: [
      "Arts",
      "Science",
      "Engineering",
      "Law",
      "Education",
      "Social Sciences",
      "Management Sciences",
      "School of Transport and Logistics",
      "Health Sciences"
    ],
    courses: [
      "Law",
      "Computer Science",
      "Mechanical Engineering",
      "Electrical/Electronic Engineering",
      "Economics",
      "Accounting",
      "Mass Communication",
      "Political Science",
      "Nursing Science",
      "Microbiology",
      "English Language",
      "Business Administration"
    ],
    postUtmeSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Government", "Literature in English", "Commerce", "Accounting"],
    subjectCombinations: [
      { course: "Law", subjects: ["English Language", "Literature in English", "Government", "History"] },
      { course: "Computer Science", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Mechanical Engineering", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Economics", subjects: ["English Language", "Mathematics", "Economics", "Government"] },
      { course: "Accounting", subjects: ["English Language", "Mathematics", "Economics", "Commerce"] },
      { course: "Mass Communication", subjects: ["English Language", "Literature in English", "Government", "Economics"] },
      { course: "Nursing Science", subjects: ["English Language", "Biology", "Chemistry", "Physics"] },
      { course: "Business Administration", subjects: ["English Language", "Mathematics", "Economics", "Commerce"] }
    ],
    requirements: [
      "Five O'Level credit passes including English Language and Mathematics, with course-specific subjects.",
      "UTME with the approved subject combination.",
      "Participation in LASU's POST-UTME screening exercise.",
      "Meeting the university and departmental admission requirements for the session."
    ],
    verificationNote:
      "LASU updates cut-off marks and screening arrangements each year. Confirm current information on the official LASU website."
  },
  {
    id: "unizik",
    name: "Nnamdi Azikiwe University",
    abbreviation: "UNIZIK",
    state: "Anambra",
    city: "Awka, Anambra State",
    type: "Federal",
    website: "https://unizik.edu.ng",
    established: 1991,
    overview:
      "A federal university in Awka with strong programmes in medicine, law, engineering, science, arts, management and education.",
    faculties: [
      "Arts",
      "Science",
      "Engineering",
      "Law",
      "Medicine",
      "Health Sciences",
      "Social Sciences",
      "Management Sciences",
      "Education",
      "Agriculture"
    ],
    courses: [
      "Medicine and Surgery",
      "Law",
      "Computer Science",
      "Mechanical Engineering",
      "Electrical/Electronic Engineering",
      "Economics",
      "Accounting",
      "Pharmacy",
      "Nursing Science",
      "Mass Communication",
      "Political Science",
      "English Language"
    ],
    postUtmeSubjects: ["English Language", "Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Government", "Literature in English", "Agricultural Science", "Commerce"],
    subjectCombinations: [
      { course: "Medicine and Surgery", subjects: ["English Language", "Biology", "Chemistry", "Physics"] },
      { course: "Law", subjects: ["English Language", "Literature in English", "Government", "History"] },
      { course: "Computer Science", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Mechanical Engineering", subjects: ["English Language", "Mathematics", "Physics", "Chemistry"] },
      { course: "Economics", subjects: ["English Language", "Mathematics", "Economics", "Government"] },
      { course: "Accounting", subjects: ["English Language", "Mathematics", "Economics", "Commerce"] },
      { course: "Pharmacy", subjects: ["English Language", "Biology", "Chemistry", "Physics"] },
      { course: "Mass Communication", subjects: ["English Language", "Literature in English", "Government", "Economics"] }
    ],
    requirements: [
      "Five O'Level credits including English Language and Mathematics, plus course-specific requirements.",
      "UTME with the correct subject combination for the intended programme.",
      "Registration for and participation in the UNIZIK POST-UTME screening.",
      "Meeting departmental admission requirements for the year."
    ],
    verificationNote:
      "UNIZIK publishes current admission requirements and screening dates each year. Verify via the official UNIZIK website before applying."
  }
];

export function getUniversity(id: string) {
  return UNIVERSITIES.find((university) => university.id === id);
}

export const UNIVERSITY_STATES = Array.from(
  new Set(UNIVERSITIES.map((university) => university.state))
).sort();

import { FAQItem } from "@/components/faq-section"

export const defaultFAQItems: FAQItem[] = [
  {
    id: "1",
    question: "Hvordan booker jeg en tid?",
    answer: "Du kan ringe til mig på telefon 49 40 05 99 eller sende en email til info@synnesdyreklinik.dk. Jeg vender tilbage hurtigst muligt med ledige tider.",
    order: 1
  },
  {
    id: "2", 
    question: "Hvilke typer behandlinger tilbydes?",
    answer: "Jeg tilbyder medicinske udredninger, kirurgiske indgreb, tandbehandlinger og konsultationer for de fleste typer kæledyr.",
    order: 2
  },
  {
    id: "3",
    question: "Hvad koster det – er der en prisliste?", 
    answer: "Priserne varierer efter behandlingstype. Jeg giver altid et estimat før behandlingen påbegyndes, så der ikke er nogle overraskelser.",
    order: 3
  },
  {
    id: "4",
    question: "Kommer du på hjemmebesøg?",
    answer: "Ja, i nogle tilfælde giver det mening at komme på hjemmebesøg. Og afhængigt af behandlingen eller andre udfordringer kommer jeg gerne på hjemmebesøg. Ring og hør om det giver mening, at jeg kommer forbi hjemme hos dig.",
    order: 4
  }
]

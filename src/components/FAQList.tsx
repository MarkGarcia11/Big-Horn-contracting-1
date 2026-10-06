import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { copy, type Localized } from "../data/site";
import { useLanguage } from "../lib/i18n";

export function FAQList({ items }: { items: { question: Localized; answer: Localized }[] }) {
  const { language } = useLanguage();
  return <Accordion.Root type="single" collapsible className="faq-accordion">
    {items.map((item, index) => <Accordion.Item className="faq-item" value={`item-${index}`} key={index}>
      <Accordion.Header><Accordion.Trigger className="faq-trigger"><span>{copy(item.question, language)}</span><Plus size={22} aria-hidden="true" /></Accordion.Trigger></Accordion.Header>
      <Accordion.Content className="faq-content"><p>{copy(item.answer, language)}</p></Accordion.Content>
    </Accordion.Item>)}
  </Accordion.Root>;
}
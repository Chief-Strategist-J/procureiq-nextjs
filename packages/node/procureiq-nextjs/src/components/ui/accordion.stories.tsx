import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion';

const meta: Meta<typeof Accordion> = {
  title: 'UI/Accordion',
  component: Accordion,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is ProcureIQ?</AccordionTrigger>
        <AccordionContent>
          ProcureIQ is an AI-powered enterprise procurement platform.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How does compliance verification work?</AccordionTrigger>
        <AccordionContent>
          It automatically checks vendor credentials against global databases.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

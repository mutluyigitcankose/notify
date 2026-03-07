"use client";

import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DailyEventsPayload } from "@/types/events";
import { HaftalikOzetTab } from "@/components/home/tabs/haftalik-ozet-tab";
import { MiniQuizTab } from "@/components/home/tabs/mini-quiz-tab";
import { SerimTab } from "@/components/home/tabs/serim-tab";
import { TekCumleTab } from "@/components/home/tabs/tek-cumle-tab";
import { TimelineTab } from "@/components/home/tabs/timeline-tab";

type HomeTabsProps = {
  payload: DailyEventsPayload;
  month: number;
  day: number;
  children: ReactNode;
};

export function HomeTabs({ payload, month, day, children }: HomeTabsProps) {
  return (
    <Tabs defaultValue="ana" className="w-full">
      <TabsList className="mb-8 w-full justify-start overflow-x-auto p-2.5">
        <TabsTrigger value="ana">Ana</TabsTrigger>
        <TabsTrigger value="quiz">Mini Quiz</TabsTrigger>
        <TabsTrigger value="tek-cumle">Tek Cümle</TabsTrigger>
        <TabsTrigger value="timeline">Zaman Çizelgesi</TabsTrigger>
        <TabsTrigger value="haftalik">Haftalık Özet</TabsTrigger>
        <TabsTrigger value="serim">Serim</TabsTrigger>
      </TabsList>

      <TabsContent value="ana" className="mt-0 pt-1">
        {children}
      </TabsContent>

      <TabsContent value="quiz" className="mt-0 pt-1">
        <MiniQuizTab payload={payload} />
      </TabsContent>

      <TabsContent value="tek-cumle" className="mt-0 pt-1">
        <TekCumleTab payload={payload} />
      </TabsContent>

      <TabsContent value="timeline" className="mt-0 pt-1">
        <TimelineTab payload={payload} />
      </TabsContent>

      <TabsContent value="haftalik" className="mt-0 pt-1">
        <HaftalikOzetTab month={month} day={day} />
      </TabsContent>

      <TabsContent value="serim" className="mt-0 pt-1">
        <SerimTab month={month} day={day} />
      </TabsContent>
    </Tabs>
  );
}

"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { AIRewriterStandalone } from "@/components/ai-rewriter-standalone"
import { HashtagTools } from "@/components/hashtag-tools"

export function AIContentTools() {
  return (
    <Tabs defaultValue="Rewriter" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="Rewriter">AI Re-writer</TabsTrigger>
        <TabsTrigger value="Hashtags">Hashtag Tools</TabsTrigger>
      </TabsList>

      <TabsContent value="Rewriter">
        <AIRewriterStandalone />
      </TabsContent>

      <TabsContent value="Hashtags">
        <HashtagTools />
      </TabsContent>
    </Tabs>
  )
}

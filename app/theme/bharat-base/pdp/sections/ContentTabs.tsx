import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ContentTabs({
  description,
  howToUse,
  whyItWorks,
}: {
  description?: string | null;
  howToUse?: string | null;
  whyItWorks?: string | null;
}) {
  if (!description && !howToUse && !whyItWorks) return null;

  return (
    <Tabs defaultValue="description">
      <TabsList>
        {description && <TabsTrigger value="description">Description</TabsTrigger>}
        {whyItWorks && <TabsTrigger value="why">Why it Works</TabsTrigger>}
        {howToUse && <TabsTrigger value="how">How to Use</TabsTrigger>}
      </TabsList>

      {description && (
        <TabsContent value="description">
          <div className="prose prose-sm max-w-none"
               dangerouslySetInnerHTML={{ __html: description }} />
        </TabsContent>
      )}

      {whyItWorks && (
        <TabsContent value="why">
          <p className="text-sm">{whyItWorks}</p>
        </TabsContent>
      )}

      {howToUse && (
        <TabsContent value="how">
          <p className="text-sm">{howToUse}</p>
        </TabsContent>
      )}
    </Tabs>
  );
}

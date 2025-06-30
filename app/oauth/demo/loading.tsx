import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function OAuthDemoLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground mt-2">Loading OAuth...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

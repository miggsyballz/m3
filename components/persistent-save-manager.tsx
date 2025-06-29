"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Save, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

interface PersistentSaveManagerProps {
  activeTab: string
  selectedClient: string | null
  onSave?: () => void
  onLoad?: (data: any) => void
}

export function PersistentSaveManager({ activeTab, selectedClient, onSave, onLoad }: PersistentSaveManagerProps) {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!autoSaveEnabled) return

    const interval = setInterval(() => {
      handleAutoSave()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [activeTab, selectedClient, autoSaveEnabled])

  // Load saved data when tab or client changes
  useEffect(() => {
    loadSavedData()
  }, [activeTab, selectedClient])

  const getSaveKey = () => {
    return `m3_progress_${activeTab}_${selectedClient || "global"}`
  }

  const handleAutoSave = async () => {
    if (saveStatus === "saving") return

    setSaveStatus("saving")
    try {
      // Get current form data from the DOM
      const formData = extractFormData()

      if (Object.keys(formData).length > 0) {
        localStorage.setItem(
          getSaveKey(),
          JSON.stringify({
            data: formData,
            timestamp: new Date().toISOString(),
            tab: activeTab,
            client: selectedClient,
          }),
        )

        setSaveStatus("saved")
        setLastSaved(new Date())

        // Reset to idle after 2 seconds
        setTimeout(() => setSaveStatus("idle"), 2000)
      }
    } catch (error) {
      console.error("Auto-save failed:", error)
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  const handleManualSave = async () => {
    setSaveStatus("saving")
    try {
      await handleAutoSave()
      onSave?.()
    } catch (error) {
      setSaveStatus("error")
    }
  }

  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem(getSaveKey())
      if (saved) {
        const parsedData = JSON.parse(saved)
        setLastSaved(new Date(parsedData.timestamp))
        onLoad?.(parsedData.data)
      }
    } catch (error) {
      console.error("Failed to load saved data:", error)
    }
  }

  const extractFormData = () => {
    const formData: any = {}

    // Extract form inputs, textareas, and selects
    const inputs = document.querySelectorAll("input, textarea, select")
    inputs.forEach((input: any) => {
      if (input.name || input.id) {
        const key = input.name || input.id
        if (input.type === "checkbox") {
          formData[key] = input.checked
        } else if (input.type === "radio") {
          if (input.checked) formData[key] = input.value
        } else {
          formData[key] = input.value
        }
      }
    })

    return formData
  }

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case "saving":
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case "saved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Save className="h-4 w-4" />
    }
  }

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case "saving":
        return "Saving..."
      case "saved":
        return "Saved"
      case "error":
        return "Save failed"
      default:
        return "Save Progress"
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="shadow-lg border-2">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleManualSave}
              disabled={saveStatus === "saving"}
              size="sm"
              variant={saveStatus === "saved" ? "default" : "outline"}
            >
              {getSaveStatusIcon()}
              <span className="ml-2">{getSaveStatusText()}</span>
            </Button>

            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {activeTab}
                </Badge>
                {selectedClient && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedClient}
                  </Badge>
                )}
              </div>
              {lastSaved && <p className="mt-1">Last saved: {lastSaved.toLocaleTimeString()}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  UserPlus,
  Save,
  User,
  Instagram,
  Facebook,
  Linkedin,
  Mail,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export function CreateClient() {
  const [formData, setFormData] = useState({
    client_name: "",
    ig_handle: "",
    fb_page: "",
    linkedin_url: "",
    contact_email: "",
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear any previous errors
    if (submitError) setSubmitError("")
    if (submitSuccess) setSubmitSuccess(false)
  }

  const validateForm = (): string | null => {
    if (!formData.client_name.trim()) {
      return "Client name is required"
    }
    if (!formData.contact_email.trim()) {
      return "Contact email is required"
    }
    if (formData.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      return "Please enter a valid email address"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setSubmitError(validationError)
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_name: formData.client_name,
          ig_handle: formData.ig_handle || null,
          fb_page: formData.fb_page || null,
          linkedin_url: formData.linkedin_url || null,
          contact_email: formData.contact_email,
          notes: formData.notes || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create client")
      }

      const newClient = await response.json()
      console.log("Client created successfully:", newClient)

      // Reset form on success
      setFormData({
        client_name: "",
        ig_handle: "",
        fb_page: "",
        linkedin_url: "",
        contact_email: "",
        notes: "",
      })

      setSubmitSuccess(true)

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      console.error("Error creating client:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to create client. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.client_name.trim() && formData.contact_email.trim()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Client</h1>
          <p className="text-muted-foreground">Add a new client to your M3 marketing system</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          New Client
        </Badge>
      </div>

      {submitSuccess && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200">
          <CheckCircle className="h-5 w-5" />
          <span>Client created successfully and saved to database!</span>
        </div>
      )}

      {submitError && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200">
          <AlertCircle className="h-5 w-5" />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Client Information
              </CardTitle>
              <CardDescription>Basic information about your new client</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client_name">Client Name *</Label>
                <Input
                  id="client_name"
                  name="client_name"
                  placeholder="e.g., Rising Star Records"
                  value={formData.client_name}
                  onChange={(e) => handleInputChange("client_name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">Primary Contact Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    placeholder="client@example.com"
                    value={formData.contact_email}
                    onChange={(e) => handleInputChange("contact_email", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Any special requirements, preferences, or notes about this client..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={4}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Instagram className="h-5 w-5" />
                Social Media Profiles
              </CardTitle>
              <CardDescription>Client's social media presence and pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ig_handle">Instagram Handle</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="ig_handle"
                    name="ig_handle"
                    placeholder="@clienthandle"
                    value={formData.ig_handle}
                    onChange={(e) => handleInputChange("ig_handle", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fb_page">Facebook Page</Label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fb_page"
                    name="fb_page"
                    placeholder="facebook.com/clientpage"
                    value={formData.fb_page}
                    onChange={(e) => handleInputChange("fb_page", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="linkedin_url"
                    name="linkedin_url"
                    placeholder="linkedin.com/company/client"
                    value={formData.linkedin_url}
                    onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client Summary</CardTitle>
            <CardDescription>Review the client information before creating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Client Details</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    <strong>Name:</strong> {formData.client_name || "Not specified"}
                  </p>
                  <p>
                    <strong>Email:</strong> {formData.contact_email || "Not specified"}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Social Media</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    <strong>Instagram:</strong> {formData.ig_handle || "Not specified"}
                  </p>
                  <p>
                    <strong>Facebook:</strong> {formData.fb_page || "Not specified"}
                  </p>
                  <p>
                    <strong>LinkedIn:</strong> {formData.linkedin_url || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
            {formData.notes && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground">{formData.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1" disabled={!isFormValid || isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Creating Client..." : "Create Client"}
          </Button>
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

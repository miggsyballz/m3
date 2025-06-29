"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ClientProfileOAuthIntegration } from "./client-profile-oauth-integration"
import { Settings, User, Bell, Shield, Palette, Globe, Key, Database, Zap } from "lucide-react"

interface SettingsViewProps {
  selectedClient: any
}

export function SettingsView({ selectedClient }: SettingsViewProps) {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false,
      campaignUpdates: true,
      contentApproval: true,
      systemAlerts: false,
    },
    privacy: {
      dataCollection: true,
      analytics: true,
      thirdPartyIntegration: false,
    },
    appearance: {
      theme: "system",
      compactMode: false,
      showPreview: true,
    },
  })

  const { toast } = useToast()

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }))
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }))
  }

  const handleAppearanceChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Settings</h2>
        {selectedClient && <Badge variant="secondary">{selectedClient.name}</Badge>}
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Social</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Advanced</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account profile and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter your first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter your last name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Enter your company name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" placeholder="Tell us about yourself" />
              </div>

              <Button onClick={handleSaveSettings}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          {selectedClient ? (
            <ClientProfileOAuthIntegration clientId={selectedClient.id} />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Globe className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Client Selected</h3>
                <p className="text-gray-600">Please select a client to manage their social media integrations.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified about updates and activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Delivery Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.notifications.email}
                      onCheckedChange={(value) => handleNotificationChange("email", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={settings.notifications.push}
                      onCheckedChange={(value) => handleNotificationChange("push", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive text message alerts</p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={settings.notifications.sms}
                      onCheckedChange={(value) => handleNotificationChange("sms", value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="campaign-updates">Campaign Updates</Label>
                      <p className="text-sm text-muted-foreground">Updates about campaign performance</p>
                    </div>
                    <Switch
                      id="campaign-updates"
                      checked={settings.notifications.campaignUpdates}
                      onCheckedChange={(value) => handleNotificationChange("campaignUpdates", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="content-approval">Content Approval</Label>
                      <p className="text-sm text-muted-foreground">When content needs approval</p>
                    </div>
                    <Switch
                      id="content-approval"
                      checked={settings.notifications.contentApproval}
                      onCheckedChange={(value) => handleNotificationChange("contentApproval", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="system-alerts">System Alerts</Label>
                      <p className="text-sm text-muted-foreground">Important system notifications</p>
                    </div>
                    <Switch
                      id="system-alerts"
                      checked={settings.notifications.systemAlerts}
                      onCheckedChange={(value) => handleNotificationChange("systemAlerts", value)}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveSettings}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Data</CardTitle>
              <CardDescription>Control how your data is collected and used</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-collection">Data Collection</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow collection of usage data to improve the service
                    </p>
                  </div>
                  <Switch
                    id="data-collection"
                    checked={settings.privacy.dataCollection}
                    onCheckedChange={(value) => handlePrivacyChange("dataCollection", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics">Analytics</Label>
                    <p className="text-sm text-muted-foreground">Enable analytics tracking for performance insights</p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={settings.privacy.analytics}
                    onCheckedChange={(value) => handlePrivacyChange("analytics", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="third-party">Third-party Integration</Label>
                    <p className="text-sm text-muted-foreground">Allow third-party services to access your data</p>
                  </div>
                  <Switch
                    id="third-party"
                    checked={settings.privacy.thirdPartyIntegration}
                    onCheckedChange={(value) => handlePrivacyChange("thirdPartyIntegration", value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Data Management</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Database className="h-4 w-4 mr-2" />
                    Export My Data
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Delete My Account
                  </Button>
                </div>
              </div>

              <Button onClick={handleSaveSettings}>Save Privacy Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <p className="text-sm text-muted-foreground mb-2">Choose your preferred color scheme</p>
                  <div className="flex space-x-2">
                    <Button
                      variant={settings.appearance.theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAppearanceChange("theme", "light")}
                    >
                      Light
                    </Button>
                    <Button
                      variant={settings.appearance.theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAppearanceChange("theme", "dark")}
                    >
                      Dark
                    </Button>
                    <Button
                      variant={settings.appearance.theme === "system" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAppearanceChange("theme", "system")}
                    >
                      System
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compact-mode">Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Use a more compact layout</p>
                  </div>
                  <Switch
                    id="compact-mode"
                    checked={settings.appearance.compactMode}
                    onCheckedChange={(value) => handleAppearanceChange("compactMode", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-preview">Show Preview</Label>
                    <p className="text-sm text-muted-foreground">Show content previews in lists</p>
                  </div>
                  <Switch
                    id="show-preview"
                    checked={settings.appearance.showPreview}
                    onCheckedChange={(value) => handleAppearanceChange("showPreview", value)}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSettings}>Save Appearance</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Advanced configuration options for power users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <p className="text-sm text-muted-foreground mb-2">Your personal API key for integrations</p>
                  <div className="flex space-x-2">
                    <Input id="api-key" type="password" value="sk-1234567890abcdef" readOnly className="font-mono" />
                    <Button variant="outline" size="sm">
                      <Key className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <p className="text-sm text-muted-foreground mb-2">Receive real-time updates via webhooks</p>
                  <Input id="webhook-url" placeholder="https://your-app.com/webhooks/m3" />
                </div>

                <div>
                  <Label htmlFor="rate-limit">Rate Limit</Label>
                  <p className="text-sm text-muted-foreground mb-2">API requests per minute</p>
                  <Input id="rate-limit" type="number" defaultValue="100" min="1" max="1000" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Danger Zone</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Database className="h-4 w-4 mr-2" />
                    Reset All Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Clear All Data
                  </Button>
                </div>
              </div>

              <Button onClick={handleSaveSettings}>Save Advanced Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

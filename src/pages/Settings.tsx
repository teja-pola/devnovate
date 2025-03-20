
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FadeIn } from '@/components/animations/FadeIn';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Bell, Eye, Shield, LogOut, Mail } from 'lucide-react';

const Settings = () => {
  const { user, signOut } = useAuth();
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    eventReminders: true,
    teamUpdates: true,
    jobAlerts: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    showProfile: true,
    showEmail: false,
    shareActivity: true,
  });

  const handleNotificationChange = (key: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
    
    toast.success('Settings updated successfully');
  };

  const handlePrivacyChange = (key: string) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
    
    toast.success('Settings updated successfully');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 md:py-24">
          <div className="section-container">
            <FadeIn>
              <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Settings</h1>
                
                <Tabs defaultValue="notifications" className="space-y-8">
                  <TabsList className="grid grid-cols-3 gap-2 w-full">
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>Privacy</span>
                    </TabsTrigger>
                    <TabsTrigger value="account" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Account</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="notifications">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="h-5 w-5" />
                          <span>Notification Settings</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor="emailNotifications" className="text-base">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive emails about important updates</p>
                          </div>
                          <Switch
                            id="emailNotifications"
                            checked={notificationSettings.emailNotifications}
                            onCheckedChange={() => handleNotificationChange('emailNotifications')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor="eventReminders" className="text-base">Event Reminders</Label>
                            <p className="text-sm text-muted-foreground">Get notified before registered events</p>
                          </div>
                          <Switch
                            id="eventReminders"
                            checked={notificationSettings.eventReminders}
                            onCheckedChange={() => handleNotificationChange('eventReminders')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor="teamUpdates" className="text-base">Team Updates</Label>
                            <p className="text-sm text-muted-foreground">Receive notifications about your teams</p>
                          </div>
                          <Switch
                            id="teamUpdates"
                            checked={notificationSettings.teamUpdates}
                            onCheckedChange={() => handleNotificationChange('teamUpdates')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor="jobAlerts" className="text-base">Job Alerts</Label>
                            <p className="text-sm text-muted-foreground">Get notified about new job opportunities</p>
                          </div>
                          <Switch
                            id="jobAlerts"
                            checked={notificationSettings.jobAlerts}
                            onCheckedChange={() => handleNotificationChange('jobAlerts')}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="privacy">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          <span>Privacy Settings</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor="showProfile" className="text-base">Public Profile</Label>
                            <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
                          </div>
                          <Switch
                            id="showProfile"
                            checked={privacySettings.showProfile}
                            onCheckedChange={() => handlePrivacyChange('showProfile')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor="showEmail" className="text-base">Show Email</Label>
                            <p className="text-sm text-muted-foreground">Make your email visible to other users</p>
                          </div>
                          <Switch
                            id="showEmail"
                            checked={privacySettings.showEmail}
                            onCheckedChange={() => handlePrivacyChange('showEmail')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor="shareActivity" className="text-base">Activity History</Label>
                            <p className="text-sm text-muted-foreground">Share your event and job application history</p>
                          </div>
                          <Switch
                            id="shareActivity"
                            checked={privacySettings.shareActivity}
                            onCheckedChange={() => handlePrivacyChange('shareActivity')}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="account">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          <span>Account Settings</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="p-4 bg-secondary/30 rounded-md">
                          <div className="flex items-start gap-4">
                            <Mail className="h-5 w-5 mt-1 text-muted-foreground" />
                            <div>
                              <h3 className="font-medium">Email Address</h3>
                              <p className="text-sm text-muted-foreground mb-2">{user?.email}</p>
                              <Button variant="outline" size="sm">
                                Change Email
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-secondary/30 rounded-md">
                          <div className="flex items-start gap-4">
                            <Shield className="h-5 w-5 mt-1 text-muted-foreground" />
                            <div>
                              <h3 className="font-medium">Password</h3>
                              <p className="text-sm text-muted-foreground mb-2">Change your password regularly for security</p>
                              <Button variant="outline" size="sm">
                                Change Password
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-destructive/10 rounded-md border border-destructive/20">
                          <div className="flex items-start gap-4">
                            <LogOut className="h-5 w-5 mt-1 text-destructive" />
                            <div>
                              <h3 className="font-medium text-destructive">Sign Out</h3>
                              <p className="text-sm text-muted-foreground mb-2">Sign out from all devices</p>
                              <Button variant="destructive" size="sm" onClick={signOut}>
                                Sign Out
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;

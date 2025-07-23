import { useState } from "react";
import { useTheme, type ColorTheme, type ThemeMode } from "@/contexts/theme-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Palette, 
  Moon, 
  Sun, 
  Type, 
  Minimize2, 
  Eye,
  Check,
  Settings
} from "lucide-react";

const colorThemes: Array<{ value: ColorTheme; name: string; color: string }> = [
  { value: 'blue', name: 'Ocean Blue', color: 'from-blue-500 to-blue-700' },
  { value: 'green', name: 'Forest Green', color: 'from-green-500 to-green-700' },
  { value: 'purple', name: 'Royal Purple', color: 'from-purple-500 to-purple-700' },
  { value: 'orange', name: 'Sunset Orange', color: 'from-orange-500 to-orange-700' },
  { value: 'red', name: 'Crimson Red', color: 'from-red-500 to-red-700' },
  { value: 'indigo', name: 'Deep Indigo', color: 'from-indigo-500 to-indigo-700' }
];

export function ThemeSelector() {
  const { settings, updateSettings, toggleMode } = useTheme();
  const [previewMode, setPreviewMode] = useState<ThemeMode | null>(null);

  const handleColorThemeChange = (colorTheme: ColorTheme) => {
    updateSettings({ colorTheme });
  };

  const handleFontSizeChange = (fontSize: 'small' | 'medium' | 'large') => {
    updateSettings({ fontSize });
  };

  const handleCompactModeChange = (compactMode: boolean) => {
    updateSettings({ compactMode });
  };

  const previewTheme = (mode: ThemeMode) => {
    setPreviewMode(mode);
    document.documentElement.classList.toggle('dark', mode === 'dark');
    setTimeout(() => {
      setPreviewMode(null);
      document.documentElement.classList.toggle('dark', settings.mode === 'dark');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Theme Customization</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dark/Light Mode */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Display Mode</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Choose between light and dark interface
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4" />
                <Switch
                  checked={settings.mode === 'dark'}
                  onCheckedChange={toggleMode}
                />
                <Moon className="w-4 h-4" />
              </div>
            </div>
            
            {/* Preview Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => previewTheme('light')}
                disabled={previewMode !== null}
                className="flex items-center space-x-1"
              >
                <Eye className="w-3 h-3" />
                <span>Preview Light</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => previewTheme('dark')}
                disabled={previewMode !== null}
                className="flex items-center space-x-1"
              >
                <Eye className="w-3 h-3" />
                <span>Preview Dark</span>
              </Button>
              {previewMode && (
                <Badge variant="secondary" className="animate-pulse">
                  Previewing {previewMode} mode...
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Color Theme Selection */}
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-base font-medium">Color Theme</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Select your preferred color scheme
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {colorThemes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleColorThemeChange(theme.value)}
                  className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    settings.colorTheme === theme.value
                      ? 'border-primary shadow-md'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className={`w-full h-8 bg-gradient-to-r ${theme.color} rounded mb-2`} />
                  <div className="text-sm font-medium text-left">{theme.name}</div>
                  {settings.colorTheme === theme.value && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Font Size */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-base font-medium">Font Size</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Adjust text size for better readability
              </p>
            </div>
            
            <Select
              value={settings.fontSize}
              onValueChange={handleFontSizeChange}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center space-x-2">
                  <Type className="w-4 h-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small - Compact text</SelectItem>
                <SelectItem value="medium">Medium - Standard text</SelectItem>
                <SelectItem value="large">Large - Enhanced readability</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Compact Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Compact Mode</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Reduce spacing for more content density
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Minimize2 className="w-4 h-4" />
              <Switch
                checked={settings.compactMode}
                onCheckedChange={handleCompactModeChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Theme Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border">
              <span className="font-medium">Sample Interface Element</span>
              <Badge variant="outline">Active</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="default" size="sm">Primary Action</Button>
              <Button variant="outline" size="sm">Secondary Action</Button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This preview shows how your theme customizations will appear throughout the application.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
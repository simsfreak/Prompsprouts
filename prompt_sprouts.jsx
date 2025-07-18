import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ICON_CATEGORIES = {
  Subject: ['🧙‍♂️', '🤖', '🐉'],
  Style: ['🎨', '🖌', '🕹'],
  Setting: ['🌲', '🏙', '🌌'],
  Mood: ['😃', '😱', '🤯'],
  Action: ['⚔️', '🧘‍♀️', '🕺']
};

const LABELS = {
  '🧙‍♂️': 'a wizard', '🤖': 'a robot', '🐉': 'a dragon',
  '🎨': 'in watercolor style', '🖌': 'in pixel art style', '🕹': 'in retro style',
  '🌲': 'in a forest', '🏙': 'in a city', '🌌': 'in space',
  '😃': 'with a happy mood', '😱': 'with a scary atmosphere', '🤯': 'with a surreal vibe',
  '⚔️': 'fighting', '🧘‍♀️': 'meditating', '🕺': 'dancing'
};

export default function PromptBuilderApp() {
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addIcon = (icon) => {
    if (selectedIcons.length < 5 && !selectedIcons.includes(icon)) {
      setSelectedIcons([...selectedIcons, icon]);
    }
  };

  const clearIcons = () => {
    setSelectedIcons([]);
    setImageUrl('');
    setError('');
  };

  const promptText = selectedIcons.map(icon => LABELS[icon]).join(', ');

  const generateImage = async () => {
    if (!promptText) return;
    setLoading(true);
    setError('');
    setImageUrl('');
    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_KEY}`

        body: JSON.stringify({
          prompt: promptText,
          n: 1,
          size: "512x512"
        })
      });

      const data = await response.json();
      if (data?.data?.[0]?.url) {
        setImageUrl(data.data[0].url);
      } else {
        setError("No image returned");
      }
    } catch (err) {
      setError("Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🧠 PromptForge (MVP)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(ICON_CATEGORIES).map(([category, icons]) => (
          <Card key={category} className="p-4">
            <h2 className="font-semibold mb-2">{category}</h2>
            <div className="flex gap-2 flex-wrap">
              {icons.map((icon) => (
                <Button key={icon} variant="outline" onClick={() => addIcon(icon)}>
                  {icon}
                </Button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div>
            <h2 className="font-semibold">🧩 Selected Icons</h2>
            <div className="text-2xl">{selectedIcons.join(' ') || 'No icons selected'}</div>
          </div>

          <div>
            <h2 className="font-semibold">📝 Prompt Preview</h2>
            <p className="italic">{promptText || 'Prompt will appear here...'}</p>
          </div>

          <div>
            <h2 className="font-semibold">🎨 AI Image Output</h2>
            <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
              {loading ? 'Generating image...' :
                imageUrl ? <img src={imageUrl} alt="AI Output" className="h-full object-contain" /> :
                error ? <span>{error}</span> :
                'Image will appear here (placeholder)'}
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={generateImage} disabled={loading || !promptText}>Generate Image</Button>
            <Button onClick={clearIcons} variant="destructive">Clear</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

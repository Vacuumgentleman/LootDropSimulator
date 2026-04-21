import { Audio } from 'expo-av';

// Free sound effects from Mixkit (https://mixkit.co/free-sound-effects/game/)
// Replace any URI with your own file or URL if preferred.
const SOUND_URIS = {
  open:   'https://assets.mixkit.co/sfx/preview/mixkit-fairy-arcade-sparkle-866.mp3',
  Common: 'https://assets.mixkit.co/sfx/preview/mixkit-coin-win-notification-1992.mp3',
  Rare:   'https://assets.mixkit.co/sfx/preview/mixkit-magic-sweep-game-trophy-257.mp3',
  Epic:   'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
  reset:  'https://assets.mixkit.co/sfx/preview/mixkit-interface-click-1126.mp3',
};

const _sounds = {};
let _ready = false;

export async function loadSounds() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
    const entries = Object.entries(SOUND_URIS);
    await Promise.all(
      entries.map(async ([key, uri]) => {
        try {
          const { sound } = await Audio.Sound.createAsync(
            { uri },
            { shouldPlay: false, volume: 1.0 }
          );
          _sounds[key] = sound;
        } catch {
          // Individual sound failed to load — app continues silently
        }
      })
    );
    _ready = true;
  } catch {
    // Audio setup failed — app continues without sound
  }
}

export async function playSound(key) {
  if (!_ready) return;
  const sound = _sounds[key];
  if (!sound) return;
  try {
    await sound.replayAsync();
  } catch {
    // Playback error — ignore
  }
}

export async function unloadSounds() {
  _ready = false;
  await Promise.all(
    Object.values(_sounds).map(async s => {
      try { await s.unloadAsync(); } catch {}
    })
  );
}

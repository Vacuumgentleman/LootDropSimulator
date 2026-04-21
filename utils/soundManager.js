import { Audio } from 'expo-av';

// Local WAV files bundled with the app — no internet required
const SOUND_FILES = {
  open:   require('../assets/sounds/open.wav'),
  Common: require('../assets/sounds/common.wav'),
  Rare:   require('../assets/sounds/rare.wav'),
  Epic:   require('../assets/sounds/epic.wav'),
  reset:  require('../assets/sounds/reset.wav'),
};

const _sounds = {};
let _ready = false;

export async function loadSounds() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
    await Promise.all(
      Object.entries(SOUND_FILES).map(async ([key, src]) => {
        try {
          const { sound } = await Audio.Sound.createAsync(
            src,
            { shouldPlay: false, volume: 1.0 }
          );
          _sounds[key] = sound;
        } catch {
          // fallo silencioso por archivo individual
        }
      })
    );
    _ready = true;
  } catch {
    // fallo silencioso global
  }
}

export async function playSound(key) {
  if (!_ready) return;
  const sound = _sounds[key];
  if (!sound) return;
  try {
    await sound.replayAsync();
  } catch {}
}

export async function unloadSounds() {
  _ready = false;
  await Promise.all(
    Object.values(_sounds).map(async s => {
      try { await s.unloadAsync(); } catch {}
    })
  );
}

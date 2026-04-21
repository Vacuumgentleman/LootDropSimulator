import { Audio } from 'expo-av';

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
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: false, // no bajar volumen cuando hay otro audio
    });

    await Promise.all(
      Object.entries(SOUND_FILES).map(async ([key, src]) => {
        try {
          const { sound } = await Audio.Sound.createAsync(
            src,
            { shouldPlay: false, volume: 1.0 }
          );
          _sounds[key] = sound;
        } catch {}
      })
    );

    _ready = true;
  } catch {}
}

export async function playSound(key) {
  if (!_ready) return;
  const sound = _sounds[key];
  if (!sound) return;
  try {
    const status = await sound.getStatusAsync();
    if (!status.isLoaded) return;
    // setStatusAsync es atómico: seek a 0 + play en una sola operación,
    // más fiable que replayAsync() en Android
    await sound.setStatusAsync({ positionMillis: 0, shouldPlay: true });
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

import * as Speech from 'expo-speech';

// Japanese script ranges (hiragana, katakana, kanji, half-width kana).
const JP = /[぀-ヿ㐀-䶿一-鿿豈-﫿ｦ-ﾟ]/;

// Read text aloud (TTS via expo-speech). Picks Japanese voice when JP script is present.
export function speak(text: string) {
  Speech.stop();
  Speech.speak(text, { language: JP.test(text) ? 'ja-JP' : 'fr-FR' });
}

export function stopSpeaking() {
  Speech.stop();
}

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  AppState,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { Audio, InterruptionModeAndroid, type AVPlaybackStatus } from 'expo-av';
import LottieView from 'lottie-react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../theme/colors';
import { styles } from './AudioRecordingScreen.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../types/navigation';

type SessionMode =
  | 'idle'
  | 'recording'
  | 'paused_record'
  | 'ready'
  | 'playing'
  | 'playing_paused';

function formatDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

async function ensureMicPermission(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone',
          message: 'This app needs microphone access to record audio.',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    const { status } = await Audio.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

async function setRecordingMode(active: boolean) {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: active,
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });
}

type Props = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'AudioRecording'>;
};

export default function AudioRecordingScreen({ navigation }: Props) {
  const lottieRef = useRef<LottieView>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const modeRef = useRef<SessionMode>('idle');
  const [mode, setMode] = useState<SessionMode>('idle');
  const setModeTracked = useCallback((m: SessionMode) => {
    modeRef.current = m;
    setMode(m);
  }, []);
  const [timeLabel, setTimeLabel] = useState('00:00:00');
  const [recordPath, setRecordPath] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const unloadSound = useCallback(async () => {
    const s = soundRef.current;
    soundRef.current = null;
    if (s) {
      try {
        await s.stopAsync();
      } catch {
        /* */
      }
      try {
        await s.unloadAsync();
      } catch {
        /* */
      }
    }
  }, []);

  const syncLottie = useCallback(() => {
    const anim = lottieRef.current;
    if (!anim) return;
    if (mode === 'recording' || mode === 'playing') {
      anim.play();
    } else {
      anim.pause();
    }
  }, [mode]);

  useEffect(() => {
    syncLottie();
  }, [syncLottie]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'background' || next === 'inactive') {
        const m = modeRef.current;
        if (m === 'recording') {
          recordingRef.current?.pauseAsync().catch(() => {});
          setModeTracked('paused_record');
        }
        if (m === 'playing') {
          soundRef.current?.pauseAsync().catch(() => {});
          setModeTracked('playing_paused');
        }
      }
    });
    return () => sub.remove();
  }, [setModeTracked]);

  useEffect(() => {
    return () => {
      const rec = recordingRef.current;
      recordingRef.current = null;
      if (rec) {
        rec.stopAndUnloadAsync().catch(() => {});
      }
      unloadSound();
    };
  }, [unloadSound]);

  const onStartRecord = async () => {
    const ok = await ensureMicPermission();
    if (!ok) {
      Alert.alert('Permission', 'Microphone access is required to record.');
      return;
    }
    setBusy(true);
    try {
      await unloadSound();
      await setRecordingMode(true);
      const prev = recordingRef.current;
      if (prev) {
        try {
          await prev.stopAndUnloadAsync();
        } catch {
          /* */
        }
        recordingRef.current = null;
      }
      const recording = new Audio.Recording();
      recording.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording && status.durationMillis != null) {
          setTimeLabel(formatDuration(status.durationMillis));
        }
      });
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      setRecordPath(null);
      setModeTracked('recording');
      setTimeLabel('00:00:00');
    } catch (e: any) {
      Alert.alert('Recording', e?.message ?? 'Could not start recording.');
    } finally {
      setBusy(false);
    }
  };

  const onPauseRecord = async () => {
    const rec = recordingRef.current;
    if (!rec) return;
    setBusy(true);
    try {
      await rec.pauseAsync();
      setModeTracked('paused_record');
    } catch (e: any) {
      Alert.alert(
        'Recording',
        Platform.OS === 'ios'
          ? 'Pause while recording is not supported on this iOS build. Use Stop or Save to finish.'
          : (e?.message ?? 'Could not pause.'),
      );
    } finally {
      setBusy(false);
    }
  };

  const onResumeRecord = async () => {
    const rec = recordingRef.current;
    if (!rec) return;
    setBusy(true);
    try {
      await rec.startAsync();
      setModeTracked('recording');
    } catch (e: any) {
      Alert.alert('Recording', e?.message ?? 'Could not resume.');
    } finally {
      setBusy(false);
    }
  };

  const finalizeRecording = async (withSaveMessage: boolean) => {
    const rec = recordingRef.current;
    if (!rec) return;
    setBusy(true);
    try {
      await rec.stopAndUnloadAsync();
      recordingRef.current = null;
      const uri = rec.getURI();
      setRecordPath(uri);
      await setRecordingMode(false);
      setModeTracked('ready');
      if (withSaveMessage) {
        Alert.alert('Saved', 'Recording saved. You can play it back or start a new one.');
      }
    } catch (e: any) {
      Alert.alert('Recording', e?.message ?? 'Could not stop recording.');
    } finally {
      setBusy(false);
    }
  };

  const onStopRecord = () => finalizeRecording(false);
  const onSaveRecord = () => finalizeRecording(true);

  const onStartPlay = async () => {
    if (!recordPath) return;
    setBusy(true);
    try {
      await unloadSound();
      await setRecordingMode(false);
      const rec = recordingRef.current;
      if (rec) {
        try {
          await rec.stopAndUnloadAsync();
        } catch {
          /* */
        }
        recordingRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: recordPath },
        { shouldPlay: true, progressUpdateIntervalMillis: 250 },
        (status: AVPlaybackStatus) => {
          if (!status.isLoaded) return;
          setTimeLabel(formatDuration(status.positionMillis ?? 0));
          if (status.didJustFinish) {
            unloadSound();
            setModeTracked('ready');
            setTimeLabel('00:00:00');
          }
        },
      );
      soundRef.current = sound;
      setModeTracked('playing');
    } catch (e: any) {
      Alert.alert('Playback', e?.message ?? 'Could not play recording.');
      setModeTracked('ready');
    } finally {
      setBusy(false);
    }
  };

  const onPausePlay = async () => {
    setBusy(true);
    try {
      await soundRef.current?.pauseAsync();
      setModeTracked('playing_paused');
    } catch (e: any) {
      Alert.alert('Playback', e?.message ?? 'Could not pause playback.');
    } finally {
      setBusy(false);
    }
  };

  const onResumePlay = async () => {
    setBusy(true);
    try {
      await soundRef.current?.playAsync();
      setModeTracked('playing');
    } catch (e: any) {
      Alert.alert('Playback', e?.message ?? 'Could not resume playback.');
    } finally {
      setBusy(false);
    }
  };

  const onStopPlay = async () => {
    setBusy(true);
    try {
      await unloadSound();
      setModeTracked('ready');
      setTimeLabel('00:00:00');
    } catch (e: any) {
      Alert.alert('Playback', e?.message ?? 'Could not stop playback.');
    } finally {
      setBusy(false);
    }
  };

  const onNewRecording = async () => {
    await unloadSound();
    const rec = recordingRef.current;
    if (rec) {
      try {
        await rec.stopAndUnloadAsync();
      } catch {
        /* */
      }
      recordingRef.current = null;
    }
    await setRecordingMode(false);
    setRecordPath(null);
    setModeTracked('idle');
    setTimeLabel('00:00:00');
  };

  const subtitle =
    mode === 'idle'
      ? 'New Recording'
      : mode === 'recording'
        ? ''
        : mode === 'paused_record'
          ? ''
          : mode === 'ready'
            ? ''
            : mode === 'playing'
              ? ''
              : '';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Audio Recording</Text>
      </View>

      <View style={styles.root}>
      <View style={styles.lottieWrap}>
        <View style={[styles.ring, styles.ringOuter]} />
        <View style={[styles.ring, styles.ringMid]} />
        <LottieView
          ref={lottieRef}
          source={require('../../../assets/recording-lottie.json')}
          style={styles.lottie}
          loop
        />
      </View>

      <Text style={styles.timer}>{timeLabel}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {busy && <ActivityIndicator color={COLORS.primary} style={styles.busy} />}

      <View style={styles.actions}>
        {mode === 'idle' && (
          <TouchableOpacity style={styles.micFab} onPress={onStartRecord} disabled={busy}>
            <Ionicons name="mic" size={32} color="#fff" />
          </TouchableOpacity>
        )}

        {mode === 'recording' && (
          <View style={styles.row3}>
            <ActionButton icon="pause" label="Pause" onPress={onPauseRecord} disabled={busy} />
            <ActionButton icon="stop" label="Stop" onPress={onStopRecord} disabled={busy} />
            <ActionButton icon="save-outline" label="Save" onPress={onSaveRecord} disabled={busy} />
          </View>
        )}

        {mode === 'paused_record' && (
          <View style={styles.row2}>
            <ActionButton icon="play" label="Resume" onPress={onResumeRecord} disabled={busy} />
            <ActionButton icon="save-outline" label="Save" onPress={onSaveRecord} disabled={busy} />
          </View>
        )}

        {mode === 'ready' && (
          <View style={styles.row2}>
            <ActionButton icon="play" label="Play" onPress={onStartPlay} disabled={busy} />
            <ActionButton icon="add-circle-outline" label="New" onPress={onNewRecording} disabled={busy} />
          </View>
        )}

        {mode === 'playing' && (
          <View style={styles.row3}>
            <ActionButton icon="pause" label="Pause" onPress={onPausePlay} disabled={busy} />
            <ActionButton icon="stop" label="Stop" onPress={onStopPlay} disabled={busy} />
          </View>
        )}

        {mode === 'playing_paused' && (
          <View style={styles.row2}>
            <ActionButton icon="play" label="Resume" onPress={onResumePlay} disabled={busy} />
            <ActionButton icon="stop" label="Stop" onPress={onStopPlay} disabled={busy} />
          </View>
        )}
      </View>

      </View>
    </SafeAreaView>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.actionItem} onPress={onPress} disabled={disabled}>
            <Text style={styles.actionLabel}>{label}</Text>
            <View style={styles.actionCircle}>
        <Ionicons name={icon} size={26} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

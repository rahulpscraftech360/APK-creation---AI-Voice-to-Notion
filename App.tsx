/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import Svg, {Path} from 'react-native-svg';
import Icon from 'react-native-vector-icons/AntDesign';
import type {PropsWithChildren} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Platform,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

import {authorize} from 'react-native-app-auth';
import axios from 'axios';
import {encode as btoa} from 'base-64';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';

function App() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00');
  const [lastRecording, setLastRecording] = useState('');
  const [playTime, setPlayTime] = useState('00:00');
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const playInterval = useRef(null);
  const recordInterval = useRef(null);

  const isDarkMode = useColorScheme() === 'dark';

  const onUpload = async () => {};
  useEffect(() => {
    return () => {
      if (playInterval.current) {
        clearInterval(playInterval.current);
      }
      if (recordInterval.current) {
        clearInterval(recordInterval.current);
      }
    };
  }, []);
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: -1, // Infinite iterations
      },
    ).start();
  }, [fadeAnim]);
  const dropboxAccessToken =
    'sl.Bv_iO_UeiZEUT33HCqc0t5EG3XYyvIKotq1ipl6kphjeLQKv5KuUGlnFJ332eg9M-mbCFGLE60r_cnwHluWQPEAqeOwhgRAnDRFMKBy2p2H1EBAmB0HqPbNR3fiY2WXBxPfAYPQxa2Z-Ki4gag_GTzQ';

  const onStartRecord = async () => {
    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVModeIOS: AVModeIOSOption.measurement,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    const dirs = RNFetchBlob.fs.dirs;
    console.log('dirs', dirs);
    const path = Platform.select({
      ios: 'hello.m4a',
      android: `${dirs.CacheDir}/hello.mp3`,
    });
    const meteringEnabled = false;
    const result = await audioRecorderPlayer.startRecorder(
      path,
      audioSet,
      meteringEnabled,
    );
    console.log('result', result);

    audioRecorderPlayer.addRecordBackListener(e => {
      console.log('recording', e);
      return;
    });
    setIsRecording(true);
    setRecordTime('00:00');
    recordInterval.current = setInterval(() => {
      setRecordTime(currentRecordTime => updateTime(currentRecordTime));
    }, 1000);
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    console.log(result);
    audioRecorderPlayer.removeRecordBackListener();
    setIsRecording(false);
    clearInterval(recordInterval.current);
    recordInterval.current = null;
    setLastRecording(result);
  };
  // const uploadFileToDropbox = async lastRecording => {
  //   console.log('here');
  //   const dropboxAccessToken =
  //     'sl.Bv_iO_UeiZEUT33HCqc0t5EG3XYyvIKotq1ipl6kphjeLQKv5KuUGlnFJ332eg9M-mbCFGLE60r_cnwHluWQPEAqeOwhgRAnDRFMKBy2p2H1EBAmB0HqPbNR3fiY2WXBxPfAYPQxa2Z-Ki4gag_GTzQ';
  //   // console.log(dropboxAccessToken);

  //   setIsUploading(true);
  //   const fileUri = lastRecording; // Local file path
  //   const dropboxApiArg = {
  //     path: '/your-app-folder/' + new Date().toISOString() + '.mp3', // Example path where the file will be saved
  //     mode: 'add',
  //     autorename: true,
  //     mute: false,
  //   };

  //   try {
  //     console.log('here>>>>>');
  //     // shareFile();

  //     const fileContent = await RNFS.readFile(lastRecording, 'base64');

  //     console.log(fileContent);
  //     const response = await axios.post(
  //       'https://content.dropboxapi.com/2/files/upload',
  //       fileContent,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${dropboxAccessToken}`,
  //           'Dropbox-API-Arg': JSON.stringify(dropboxApiArg),
  //           'Content-Type': 'application/octet-stream',
  //         },
  //         onUploadProgress: function (progressEvent) {
  //           // Calculate the percentage of upload completed
  //           const percentCompleted = Math.round(
  //             (progressEvent.loaded * 100) / progressEvent.total,
  //           );
  //           console.log(percentCompleted + '%');
  //           setUploadProgress(percentCompleted); // Log the uploading percentage
  //         },
  //       },
  //     );

  //     console.log('File uploaded!');
  //     // Handle success case
  //     setIsUploading(false);
  //   } catch (error) {
  //     console.error(
  //       'Upload failed',
  //       error.response ? error.response.data : error.message,
  //     );
  //     // Handle error
  //   }
  // };

  const uploadFileToDropbox = async lastrecording => {
    //console.log('Uploading', lastRecording);
    const dropboxAccessToken =
      'sl.BwDjUOY_avZp6APE9keLEDloOVX3VhyCL6Fu0TkAatkFGyuFQ5FLUeam9w-T1tgBFZejjCNK7iD83K9oQMvS3gbN2bC3phI2fjfj76pzy7C1TepSk3hx8bFq2RctQmTehFgyaMi86TpBgqCCPHvbEhE';
    const dropboxApiArg = JSON.stringify({
      path: '/your-app-folder/hello.mp3',
      mode: 'add',
      autorename: true,
      mute: false,
    });

    try {
      setIsUploading(!isUploading);

      // const fileStats = await RNFS.stat(lastRecording.replace('file://', '')); // Remove 'file://' prefix for RNFS compatibility
      // console.log('File size>>>>>>>>>>>>>>>>>>>>>>>>>>>>:', fileStats.size);
      // if (fileStats.size === 0) {
      //   console.error('File is empty, not uploading.');
      //   // Exit the function if file is empty
      // }

      console.log('fileData');
      // console.log(lastrecording);
      // Using RNFetchBlob to handle the file upload
      const response = await RNFetchBlob.fetch(
        'POST',
        'https://content.dropboxapi.com/2/files/upload',
        {
          Authorization: `Bearer ${dropboxAccessToken}`,
          'Dropbox-API-Arg': dropboxApiArg,
          'Content-Type': 'application/octet-stream',
        },

        RNFetchBlob.wrap(lastRecording),
      );

      console.log('File uploaded!', response.text());

      setIsUploading(false);
      setUploadProgress(100); // Since RNFetchBlob doesn't support onUploadProgress, you might set it to 100% on success
    } catch (error) {
      console.error('Upload failed', error);
      setIsUploading(false);
    }
  };
  const onPlayPauseRecord = async () => {
    if (isPlaying) {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setIsPlaying(false);
      clearInterval(playInterval.current);
      playInterval.current = null;
    } else {
      setIsPlaying(true);
      setPlayTime('00:00');
      await audioRecorderPlayer.startPlayer(lastRecording);
      audioRecorderPlayer.addPlayBackListener(e => {
        if (e.currentPosition === e.duration) {
          audioRecorderPlayer.stopPlayer();
          audioRecorderPlayer.removePlayBackListener();
          setIsPlaying(false);
          clearInterval(playInterval.current);
          playInterval.current = null;
        } else {
          setPlayTime(
            audioRecorderPlayer
              .mmssss(Math.floor(e.currentPosition))
              .split(':')[0] +
              ':' +
              audioRecorderPlayer
                .mmssss(Math.floor(e.currentPosition))
                .split(':')[1],
          );
        }
      });

      playInterval.current = setInterval(() => {
        setPlayTime(currentPlayTime => updateTime(currentPlayTime));
      }, 1000);
    }
  };

  const updateTime = currentTime => {
    const [mins, secs] = currentTime.split(':').map(Number);
    const totalSecs = mins * 60 + secs + 1;
    const minutes = Math.floor(totalSecs / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSecs % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
  const [isUploading, setIsUploading] = useState(false);
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" />
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            textTransform: 'uppercase',
            width: '100%',
            fontSize: 36,
            height: 100,
            backgroundColor: 'skyblue',
            textAlign: 'center',
            lineHeight: 50,
          }}>
          Audio Recorder
        </Text>
      </View>

      <ScrollView contentInsetAdjustmentBehavior="automatic" style={{flex: 1}}>
        <View style={styles.audioControl}>
          {!isPlaying && (
            <View style={styles.container}>
              <Text style={styles.timerText}>{recordTime}</Text>
            </View>
          )}
          {isPlaying && (
            <View style={styles.container}>
              <Text style={styles.timerText}>{playTime}</Text>
            </View>
          )}
          {isRecording ? (
            <TouchableWithoutFeedback onPress={onStopRecord}>
              <View
                style={{
                  paddingHorizontal: 40,
                  paddingVertical: 40,
                  backgroundColor: '#dd1818',
                  borderRadius: 40,
                  elevation: 5,
                }}>
                <Text style={{fontSize: 20, color: 'white'}}>
                  Stop Recording
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ) : (
            // <Button onPress={onStopRecord} title="Stop Recording" />
            <TouchableWithoutFeedback onPress={onStartRecord}>
              <View
                style={{
                  paddingHorizontal: 40,
                  paddingVertical: 40,
                  backgroundColor: '#00b09b',
                  borderRadius: 40,
                  elevation: 5,
                }}>
                <Text style={{fontSize: 20, color: 'white'}}>
                  Start Recording
                </Text>
              </View>
            </TouchableWithoutFeedback>
            // <Button  title="Start Recording" />
          )}
        </View>

        {lastRecording ? (
          <View style={styles.audioControl}>
            <TouchableWithoutFeedback onPress={onPlayPauseRecord}>
              {isPlaying ? (
                <View
                  style={{
                    paddingHorizontal: 30,
                    paddingVertical: 30,
                    backgroundColor: '#dd1818',
                    borderRadius: 40,
                    elevation: 5,
                  }}>
                  <Text style={{fontSize: 20, color: 'white'}}>Stop</Text>
                </View>
              ) : (
                <View
                  style={{
                    paddingHorizontal: 30,
                    paddingVertical: 30,
                    backgroundColor: '#11998e',
                    borderRadius: 40,
                    elevation: 5,
                  }}>
                  <Text style={{fontSize: 20, color: 'white'}}>Play</Text>
                </View>
              )}
            </TouchableWithoutFeedback>
            {/* <Button
              title={isPlaying ? 'Stop' : 'Play'}
              onPress={onPlayPauseRecord}
            /> */}
            {/* <Button
              style={styles.upload}
              title={isUploading ? `Uploading...` : 'Upload'}
              onPress={uploadFileToDropbox}
            /> */}
            <TouchableWithoutFeedback onPress={uploadFileToDropbox}>
              <View style={styles.button}>
                <Animated.Text
                  style={[
                    styles.buttonText,
                    {opacity: isUploading ? fadeAnim : 1},
                  ]}>
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Animated.Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        ) : null}
        <View style={styles.container}>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, {width: `${uploadProgress}%`}]} />
          </View>
          {/* <Text>{uploadProgress}%</Text>
          <TouchableOpacity onPress={uploadFileToDropbox} style={styles.button}>
            <Text style={styles.buttonText}>Upload File</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Container styles to center the timer text, feel free to adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  timerText: {
    fontSize: 24, // Adjust the font size as needed
    color: '#3498db', // A pleasant blue, but choose what fits your app
    backgroundColor: '#ecf0f1', // Light grey background
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20, // Gives a rounded look
    borderWidth: 2,
    borderColor: '#2980b9', // Darker blue border
    textAlign: 'center',
    fontWeight: 'bold',
    elevation: 3, // Adds shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2}, // Shadow for iOS
    shadowOpacity: 0.1, // Shadow for iOS
    shadowRadius: 4, // Shadow for iOS
  },
  scrollView: {},
  audioControl: {
    alignItems: 'center',
    marginBottom: 20,
  },
  recordingsList: {
    marginTop: 20,
  },
  recordingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordingText: {
    marginRight: 10,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  upload: {
    paddingTop: 5,
    marginTop: 20,
    borderRadius: 15,
  },
  button: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: '#108dc7',
    borderRadius: 40,
    elevation: 5,
    alignItems: 'center', // Center the text horizontally
    justifyContent: 'center', // Center the text vertically
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
});

export default App;

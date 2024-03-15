import Geolocation from '@react-native-community/geolocation';
import React, {useState} from 'react';
import {
  Alert,
  Button,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {
  PERMISSIONS,
  checkMultiple,
  openSettings,
  request,
  requestMultiple,
} from 'react-native-permissions';
import BackgroundService from 'react-native-background-actions';
import notifee from '@notifee/react-native';
import CustomButton from './src/components/CustomButton';
Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'always',
  enableBackgroundLocationUpdates: true,
  locationProvider: 'auto',
});

function App() {
  const [locationAccess, setLocationAccess] = useState(false);
  const [batteryOptimizationEnabled1, setBatteryOptimizationEnabled1] =
    useState(true);
  const [powerinfo, setPowerInfo] = useState(true);
  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));

  // You can do anything in your task such as network requests, timers and so on,
  // as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
  // React Native will go into "paused" mode (unless there are other tasks running,
  // or there is a foreground app).
  const veryIntensiveTask = async taskDataArguments => {
    // Example of an infinite loop task
    const {delay} = taskDataArguments;
    await new Promise(async resolve => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        getUserLocation();
        await sleep(delay);
      }
    });
  };

  const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    parameters: {
      delay: 1000 * 5,
    },
  };

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        console.log('Here you can send it to any API');
      },
      error => {},
      {enableHighAccuracy: false, timeout: 5000, maximumAge: 10000},
    );
  };

  const requestCoarseLocationAccess = () => {
    if (Platform.OS == 'android') {
      request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then(status => {
        if (status == 'granted') {
          checkAllPermissions();
          ToastAndroid.showWithGravityAndOffset(
            'Coarse Location Access has been granted',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        } else {
          Alert.alert(
            'Permission Denied',
            'To run the app pleaase open setting and allow location permission',
            [
              {
                text: 'Open Setting',
                onPress: () => openSettings(),
              },
            ],
          );
        }
      });
    }
  };

  const requestBgLocationAccess = () => {
    if (Platform.OS == 'android') {
      request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION).then(status => {
        if (status == 'granted') {
          checkAllPermissions();
          ToastAndroid.showWithGravityAndOffset(
            'Bg Location Access has been granted',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        } else {
          Alert.alert(
            'Permission Denied',
            'To run the app pleaase open setting and allow location permission',
            [
              {
                text: 'Open Setting',
                onPress: () => openSettings(),
              },
            ],
          );
        }
      });
    }
  };

  const requestFineLocationAccess = () => {
    if (Platform.OS == 'android') {
      request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(status => {
        if (status == 'granted') {
          checkAllPermissions();
          ToastAndroid.showWithGravityAndOffset(
            'Fine Location Access has been granted',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        } else {
          Alert.alert(
            'Permission Denied',
            'To run the app pleaase open setting and allow location permission',
            [
              {
                text: 'Open Setting',
                onPress: () => openSettings(),
              },
            ],
          );
        }
      });
    }
  };

  const checkAllPermissions = () => {
    checkMultiple([
      PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    ]).then(statuses => {
      if (
        statuses['android.permission.ACCESS_BACKGROUND_LOCATION'] ==
          'granted' &&
        statuses['android.permission.ACCESS_COARSE_LOCATION'] &&
        statuses['android.permission.ACCESS_FINE_LOCATION'] == 'granted'
      ) {
        setLocationAccess(true);
      }
    });
  };
  const startBgService = async () => {
    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({
      taskDesc: 'New ExampleTask description',
    });
  };

  const stopBgService = async () => {
    await BackgroundService.stop();
  };

  const checkBatteryOptimizationTechniques = async () => {
    const batteryOptimizationEnabled =
      await notifee.isBatteryOptimizationEnabled();
    setBatteryOptimizationEnabled1(batteryOptimizationEnabled);
    if (batteryOptimizationEnabled) {
      // 2. ask your users to disable the feature
      Alert.alert(
        'Restrictions Detected',
        'To ensure app run in background, please disable battery optimization for the app.',
        [
          // 3. launch intent to navigate the user to the appropriate screen
          {
            text: 'OK, open settings',
            onPress: async () =>
              await notifee.openBatteryOptimizationSettings(),
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    }
  };

  const powerManagerInfo = async () => {
    const powerManagerInfo = await notifee.getPowerManagerInfo();
    
    console.log(powerManagerInfo);
    if (powerManagerInfo.activity) {
      // 2. ask your users to adjust their settings
      Alert.alert(
        'Restrictions Detected',
        'To ensure notifications are delivered, please adjust your settings to prevent the app from being killed',
        [
          // 3. launch intent to navigate the user to the appropriate screen
          {
            text: 'OK, open settings',
            onPress: async () => await notifee.openPowerManagerSettings(),
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
      }}>
      {locationAccess ? (
        <View>
          <Text
            style={{
              padding: 15,
              fontWeight: '700',
              textAlign: 'justify',
              fontSize: 16,
            }}>
            To ensure that the background service starts successfully, it's
            essential to enable battery optimization and power options for the
            app. Otherwise, the operating system might terminate your app.
          </Text>
          {batteryOptimizationEnabled1 && (
            <CustomButton
              label={
                'Battery Optimization help to keep app live in backgroud and will be killed closed by OS. you can read more about this here . '
              }
              link={
                'https://notifee.app/react-native/docs/android/background-restrictions'
              }
              text="Open Battery Optimization Setting"
              onPress={() => checkBatteryOptimizationTechniques()}
            />
          )}

          {powerinfo && (
            <CustomButton
              label={
                'Power Manager help to keep app live and can help you to restart app if it has been closed by OS. you can read more about this here . '
              }
              link={
                'https://notifee.app/react-native/docs/android/background-restrictions'
              }
              text="Open Power Manager setting"
              onPress={() => powerManagerInfo()}
            />
          )}

          <CustomButton
            label={
              "To ensure that the background service starts successfully, it's essential to enable battery optimization and power options for the app. Otherwise, the operating system might terminate your app."
            }
            text="Start Backgroud Service"
            onPress={() => startBgService()}
          />

          <CustomButton
            label={'You can stop the service from here'}
            text="Stop Backgroud Service"
            onPress={() => stopBgService()}
          />
        </View>
      ) : (
        <View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              textAlign: 'justify',
              padding: 15,
            }}>
            The Android operating system provides three types of location
            access: Fine Location and Coarse Location. Fine Location and Coarse
            Location are used in the foreground. If you require access to
            location services in the background, you'll need to obtain
            permission for this. To get background permission, you may need to
            open the app's settings on your Android device and enable the
            necessary permission from there.
          </Text>
          <CustomButton
            label={'Click Here to Get Backgroud Location Accesss'}
            text="Request Background Location"
            onPress={() => requestBgLocationAccess()}
          />
          <CustomButton
            label={'Click Here to Get Fine Location Accesss'}
            text="Request Fine Location"
            onPress={() => requestFineLocationAccess()}
          />
          <CustomButton
            label={'Click Here to Get Coarse Location Accesss'}
            text="Request Coarse Location"
            onPress={() => requestCoarseLocationAccess()}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});

export default App;

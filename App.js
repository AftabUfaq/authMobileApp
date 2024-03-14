import Geolocation from '@react-native-community/geolocation';
import React, {useState} from 'react';
import {Alert, Button, Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import BackgroundService from 'react-native-background-actions';
Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'always',
  enableBackgroundLocationUpdates: true,
  locationProvider: 'auto',
});

function App() {
  const [locationAccess, setLocationAccess] = useState(false);

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
        getUserLocation()
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
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
      delay: 1000 *5,
    },
  };


  const getUserLocation = () => {
    
  
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          console.log("Here you can send it to any API");
        },
        error => {},
        {enableHighAccuracy: false, timeout: 5000, maximumAge: 10000},
      );
    
    
  }
  const requestLocationAccess = () => {
    if (Platform.OS == 'android') {
      requestMultiple([
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]).then(statuses => {
        if (
          statuses['android.permission.ACCESS_BACKGROUND_LOCATION'] ==
            'granted' &&
          statuses['android.permission.ACCESS_COARSE_LOCATION'] == 'granted' &&
          statuses['android.permission.ACCESS_FINE_LOCATION']
        ) {
          setLocationAccess(true);
        } else {
          setLocationAccess(false);
        }
      });
    }
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
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
      }}>
      {locationAccess ? (
        <View>
          <Button title="Start Bg service" onPress={() => startBgService()} />
          <View style={{height: 30}} />
          <Button title="Stop Bg service" onPress={() => stopBgService()} />
          <View style={{height: 30}} />
        </View>
      ) : (
        <Button
          title="Request Location Access"
          onPress={() => requestLocationAccess()}
        />
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

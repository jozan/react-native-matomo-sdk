/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Matomo from 'react-native-matomo-sdk';

// Use values from respective platform examples
const matomoConfig =
  Platform.OS === 'ios'
    ? {
        baseUrl: 'https://demo2.matomo.org/piwik.php',
        siteId: 23,
      }
    : {
        baseUrl: 'https://demo.matomo.org/matomo.php',
        siteId: 53,
      };

Matomo.initialize(matomoConfig.baseUrl, matomoConfig.siteId)
  .catch(error => console.warn('Failed to initialize matomo', error))
  .then(async () => {
    try {
      // For more info about custom dimensions: https://matomo.org/docs/custom-dimensions/
      await Matomo.setCustomDimension(1, '1.0.0').catch(error =>
        console.warn('Error setting custom dimension', error),
      );

      await Matomo.setCustomDimension(2, 'en-US').catch(error =>
        console.warn('Error setting custom dimension', error),
      );

      Matomo.trackEvent('Application', 'Startup').catch(error =>
        console.warn('Failed to track event', error),
      );
    } catch (error) {
      console.error('Error in Matomo SDK', error);
    }
  });

const App: () => React$Node = () => {
  React.useEffect(() => {
    let run = async () => {
      // Clear a custom dimension by setting it to null
      await Matomo.setCustomDimension(2, null).catch(error =>
        console.warn('Error clearing custom dimension', error),
      );

      Matomo.trackView(['start']).catch(error =>
        console.warn('Failed to track screen', error),
      );
    };

    run();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;

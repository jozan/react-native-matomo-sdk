
package com.terveystalo.react_native.matomo_sdk;

import android.support.annotation.Nullable;
import android.text.TextUtils;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import org.matomo.sdk.Matomo;
import org.matomo.sdk.Tracker;
import org.matomo.sdk.TrackerBuilder;
import org.matomo.sdk.extra.CustomDimension;
import org.matomo.sdk.extra.DimensionQueue;
import org.matomo.sdk.extra.TrackHelper;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;



public class RNMatomoSdkModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private Tracker tracker;
  private DimensionQueue mOneTimeDimensionQueue;
  private List<CustomDimension> mCustomDimensions = new ArrayList<>();

  public RNMatomoSdkModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNMatomoSdk";
  }

  @ReactMethod
  @SuppressWarnings("unused")
  public void initialize(String apiUrl, int siteId, Promise promise) {
    try {
      if (tracker == null) {
        tracker = TrackerBuilder
                .createDefault(apiUrl, siteId)
                .build(Matomo.getInstance(this.reactContext));
      }
      promise.resolve(null);
    } catch(Exception e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  @SuppressWarnings("unused")
  public void trackView(ReadableArray route, Promise promise) {
    try {
      List<String> routeList = new LinkedList<>();
      for (int i = 0 ; i < route.size() ; i++) {
        routeList.add(route.getString(i));
      }
      String path = TextUtils.join("/", routeList);

      insertCustomDimensions(tracker);

      TrackHelper.track().screen(path).title(path).with(tracker);
      promise.resolve(null);
    } catch(Exception e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  @SuppressWarnings("unused")
  public void trackEvent(String category, String action, ReadableMap optionalParameters, Promise promise) {
    try {
      TrackHelper.EventBuilder event = TrackHelper.track().event(category, action);
      if (optionalParameters.hasKey("name")) {
        event.name(optionalParameters.getString("name"));
      }
      if (optionalParameters.hasKey("value")) {
        event.value((float) optionalParameters.getDouble("value"));
      }

      insertCustomDimensions(tracker);

      event.with(tracker);

      promise.resolve(null);
    } catch(Exception e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  @SuppressWarnings("unused")
  public void setCustomDimension(int dimensionId, @Nullable String value, Promise promise) {
    try {
      if (value != null) {
        mCustomDimensions.add(new CustomDimension(dimensionId, value));
      } else {
        for (Iterator<CustomDimension> it = mCustomDimensions.iterator(); it.hasNext(); ) {
          CustomDimension dimension = it.next();
          if (dimension.getId() == dimensionId) {
            it.remove();
          }
        }
      }
      promise.resolve(null);
    } catch(Exception e) {
      promise.reject(e);
    }
  }

  private void insertCustomDimensions(Tracker tracker) {
    if (mOneTimeDimensionQueue == null) {
      mOneTimeDimensionQueue = new DimensionQueue(tracker);
    }

    for (Iterator<CustomDimension> it = mCustomDimensions.iterator(); it.hasNext(); ) {
      CustomDimension dimension = it.next();
      mOneTimeDimensionQueue.add(dimension.getId(), dimension.getValue());
    }
  }
}

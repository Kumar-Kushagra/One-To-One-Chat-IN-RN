package com.firebase;

import com.facebook.react.ReactActivity;
import androidx.multidex.MultiDexApplication;import androidx.multidex.MultiDexApplication;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Firebase";
  }
}

#!/bin/sh

# Configuration
ANDROID_HOME="/home/i0ne/Programming/3rd-party/android/sdk"
APP_LABEL_NAME=Proxy
APP_COMPANY_NAME=kototuz
APP_PRODUCT_NAME=proxy_app
APP_KEYSTORE_PASS=$APP_PRODUCT_NAME

BUILD_TOOLS=$ANDROID_HOME/build-tools/29.0.3
SRC_PATH=./src/com/$APP_COMPANY_NAME/$APP_PRODUCT_NAME
PACKAGE_NAME=com.$APP_COMPANY_NAME.$APP_PRODUCT_NAME

if [ "$1" = "setup" ]; then
    # Clear
    rm -rf ./build
    rm -rf ./src

    mkdir -p $SRC_PATH assets build/dex
    
    # Generate keystore
    keytool -genkeypair -validity 1000 -dname "CN=$APP_KEYSTORE_PASS,O=Android,C=ES" -keystore build/$APP_KEYSTORE_PASS.keystore -storepass $APP_KEYSTORE_PASS -keypass $APP_KEYSTORE_PASS -alias projectKey -keyalg RSA

    # Generate 'AndroidManifest.xml'
    echo "\
<?xml version=\"1.0\" encoding=\"utf-8\"?>
<manifest xmlns:android=\"http://schemas.android.com/apk/res/android\"
        package=\"$PACKAGE_NAME\"
        android:versionCode=\"1\" android:versionName=\"1.0\" >
    <uses-sdk android:minSdkVersion=\"23\" android:targetSdkVersion=\"34\"/>
    <application android:label=\"$APP_LABEL_NAME\">
        <activity android:name=\"$PACKAGE_NAME.MainActivity\"
            android:theme=\"@android:style/Theme.NoTitleBar.Fullscreen\"
            android:exported=\"true\">
            <intent-filter>
                <action android:name=\"android.intent.action.MAIN\"/>
                <category android:name=\"android.intent.category.LAUNCHER\"/>
            </intent-filter>
        </activity>
    </application> 
</manifest>" \
    > AndroidManifest.xml

    # Generate 'MainActivity.java'
    echo "\
package $PACKAGE_NAME;
import android.app.Activity;
import android.os.Bundle;
public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.simple_layout);
    }
}" \
    > $SRC_PATH/MainActivity.java

    exit 0
fi

# stop on error and display each command as it gets executed. Optional step but helpful in catching where errors happen if they do.
set -xe

$BUILD_TOOLS/aapt package -f -m \
	-S ./res -J ./src -M ./AndroidManifest.xml \
	-I $ANDROID_HOME/platforms/android-29/android.jar

# Compile MainActivity.java
javac -verbose -source 1.8 -target 1.8 -d ./build/obj \
	-bootclasspath jre/lib/rt.jar \
	-classpath $ANDROID_HOME/platforms/android-29/android.jar:build/obj \
	-sourcepath ./src $SRC_PATH/R.java \
    $SRC_PATH/MainActivity.java $SRC_PATH/ProxyTile.java

$BUILD_TOOLS/dx --verbose --dex --output=./build/dex/classes.dex ./build/obj

# Add resources and assets to APK
$BUILD_TOOLS/aapt package -f \
	-M ./AndroidManifest.xml -S ./res -A ./assets \
	-I $ANDROID_HOME/platforms/android-29/android.jar -F ./build/$APP_LABEL_NAME.apk ./build/dex

# Zipalign APK and sign
# NOTE: If you changed the storepass and keypass in the setup process, change them here too
$BUILD_TOOLS/zipalign -f 4 ./build/$APP_LABEL_NAME.apk game.final.apk
mv -f game.final.apk ./build/$APP_LABEL_NAME.apk

# Install apksigner with `sudo apt install apksigner`
apksigner sign  --ks ./build/$APP_KEYSTORE_PASS.keystore --out ./build/my-app-release.apk --ks-pass pass:$APP_KEYSTORE_PASS ./build/$APP_LABEL_NAME.apk
mv ./build/my-app-release.apk ./build/$APP_LABEL_NAME.apk

# Install to device or emulator
$ANDROID_HOME/platform-tools/adb install -r ./build/$APP_LABEL_NAME.apk

package com.kototuz.proxy_app;

import android.service.quicksettings.TileService;
import android.service.quicksettings.Tile;
import android.util.Log;
import android.content.SharedPreferences;
import android.content.Context;
import android.content.ContentResolver;
import android.provider.Settings;
import android.widget.Toast;

public class ProxyTile extends TileService {
    @Override
    public void onClick() {
        super.onClick();

        Tile tile = getQsTile();
        switch (tile.getState()) {
        case Tile.STATE_ACTIVE:
            if (!setProxy(":0")) break;
            tile.setState(Tile.STATE_INACTIVE);
            break;

        case Tile.STATE_INACTIVE:
            SharedPreferences prefs = getSharedPreferences("Proxy", Context.MODE_PRIVATE);
            if (!setProxy(MainActivity.PROXIES[prefs.getInt("proxyIndex", 0)])) break;
            tile.setState(Tile.STATE_ACTIVE);
            break;
        }

        tile.updateTile();
    }

    private boolean setProxy(String url) {
        boolean result = Settings.Global.putString(getContentResolver(), Settings.Global.HTTP_PROXY, url);
        if (!result) {
            Toast.makeText(this, "Could not set proxy settings", Toast.LENGTH_LONG).show();
        }
        return result;
    }
}

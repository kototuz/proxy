package com.kototuz.proxy_app;

import android.app.Activity;
import android.os.Bundle;
import android.content.Context;
import android.util.Log;
import android.provider.Settings;
import android.view.View;
import android.widget.Button;
import android.widget.ToggleButton;
import android.widget.Toast;
import android.content.SharedPreferences;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.graphics.Color;

public class MainActivity extends Activity implements AdapterView.OnItemClickListener {
    public static final String[] PROXIES = {
        // PLACE YOUR PROXIES HERE
        // format: "<ip>:<port>"
    };

    private SharedPreferences prefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.simple_layout);

        prefs = getSharedPreferences("Proxy", Context.MODE_PRIVATE);

        ListView l = findViewById(R.id.proxy_list);
        ArrayAdapter<String> arr = new ArrayAdapter<String>(this, R.layout.proxy_item, PROXIES);
        l.setAdapter(arr);
        l.setOnItemClickListener(this);
        l.setItemChecked(prefs.getInt("proxyIndex", 0), true);
    }

    @Override
    public void onItemClick(AdapterView<?> parent, View v, int pos, long id) {
        SharedPreferences.Editor editor = prefs.edit();
        editor.putInt("proxyIndex", pos);
        editor.commit();

        String proxy = Settings.Global.getString(getContentResolver(), Settings.Global.HTTP_PROXY);
        if (proxy == null) {
            Toast.makeText(this, "Could not get proxy settings", Toast.LENGTH_LONG).show();
            return;
        }
        if (!proxy.equals(":0")) {
            boolean result = Settings.Global.putString(getContentResolver(), Settings.Global.HTTP_PROXY, PROXIES[pos]);
            if (!result) {
                Toast.makeText(this, "Could not set proxy settings", Toast.LENGTH_LONG).show();
            }
        }
    }
}

package com.jinwanzaodian.app;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.SharedPreferences;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * 桥：让 React 把"今晚关灯时间"写进原生 SharedPreferences 并立即刷新桌面小组件。
 * JS 侧见 src/lib/widget.ts。
 */
@CapacitorPlugin(name = "ZaodianWidget")
public class ZaodianWidgetPlugin extends Plugin {

    @PluginMethod
    public void update(PluginCall call) {
        String lightsOff = call.getString("lightsOff", "23:00");
        Context ctx = getContext();

        SharedPreferences sp = ctx.getSharedPreferences(ZaodianWidgetProvider.PREFS, Context.MODE_PRIVATE);
        sp.edit().putString(ZaodianWidgetProvider.KEY_LIGHTS_OFF, lightsOff).apply();

        AppWidgetManager mgr = AppWidgetManager.getInstance(ctx);
        int[] ids = mgr.getAppWidgetIds(new ComponentName(ctx, ZaodianWidgetProvider.class));
        for (int id : ids) ZaodianWidgetProvider.updateOne(ctx, mgr, id);

        call.resolve();
    }
}

package com.jinwanzaodian.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

import java.util.Calendar;

/**
 * 今晚早点 桌面小组件 — 精灵图 + 今晚关灯承诺（随时辰变一句）。
 * 数据走 SharedPreferences 快照（由 ZaodianWidgetPlugin 从 React 写入），
 * 和 Finch 一样接受轻微滞后：组件自己每 30 分钟刷一次，打开 app 立即同步。
 */
public class ZaodianWidgetProvider extends AppWidgetProvider {

    static final String PREFS = "zaodian_widget";
    static final String KEY_LIGHTS_OFF = "lightsOff";

    @Override
    public void onUpdate(Context context, AppWidgetManager mgr, int[] ids) {
        for (int id : ids) updateOne(context, mgr, id);
    }

    static void updateOne(Context context, AppWidgetManager mgr, int id) {
        SharedPreferences sp = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        String lightsOff = sp.getString(KEY_LIGHTS_OFF, "23:00");

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_zaodian);
        views.setTextViewText(R.id.widget_line, buildMessage(lightsOff));

        Intent launch = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        if (launch != null) {
            PendingIntent pi = PendingIntent.getActivity(
                context, 0, launch,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.widget_root, pi);
        }

        mgr.updateAppWidget(id, views);
    }

    /** 随时辰给一句，核心是今晚关灯承诺 */
    static String buildMessage(String lightsOff) {
        int hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
        int closeHour = parseHour(lightsOff);
        int closeNorm = closeHour < 6 ? closeHour + 24 : closeHour;
        int hourNorm = hour < 6 ? hour + 24 : hour;

        if (hourNorm >= closeNorm) return "打烊了，放下手机，明早见";
        if (hour >= 6 && hour < 11) return "早呀，铺子开门了";
        return "今晚 " + lightsOff + " 关灯";
    }

    static int parseHour(String hhmm) {
        try {
            return Integer.parseInt(hhmm.split(":")[0]);
        } catch (Exception e) {
            return 23;
        }
    }
}

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.util.Log;

public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals(Intent.ACTION_BOOT_COMPLETED)) {
            Log.d("BootReceiver", "🚨 부팅 후 불필요한 알람 제거 시작");

            // 모든 예약된 알람 제거
            AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            Intent alarmIntent = new Intent(context, AlarmReceiver.class);
            PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, alarmIntent, PendingIntent.FLAG_UPDATE_CURRENT);

            if (alarmManager != null) {
                alarmManager.cancel(pendingIntent);
                Log.d("BootReceiver", "✅ 모든 알람이 취소되었습니다.");
            }
        }
    }
}

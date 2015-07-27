package com.red_folder.phonegap.plugin.backgroundservice.nopho;

import com.red_folder.phonegap.plugin.backgroundservice.BackgroundService;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import android.app.ActivityManager;
import android.content.ComponentName;

public class NophoService extends BackgroundService {

public final static String APP_NAME = "com.ionicframework.nophoapp347342";

	@Override
	protected JSONObject doWork() {
		JSONObject result = new JSONObject();

		try {
      // Following three lines simply produce a text string with Hello World and the date & time (UK format)
			SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss"); 
			String now = df.format(new Date(System.currentTimeMillis())); 
			String msg = "Hello World - its currently " + now;
			msg += ""+isForeground("test");
      // We output the message to the logcat
			Log.d("NophoService", msg);

      // We also provide the same message in our JSON Result
			result.put("Message", msg);
		} catch (JSONException e) {
      // In production code, you would have some exception handling here
		}

		return result; 
	}

	public boolean isForeground(String myPackage) {
		ActivityManager manager = (ActivityManager) getSystemService(ACTIVITY_SERVICE);
		boolean result=false;

		System.out.println("Manager: " + manager.toString());
		List<ActivityManager.RunningAppProcessInfo> runningTasks = manager.getRunningAppProcesses();
				
		for(ActivityManager.RunningAppProcessInfo temp : runningTasks){
			if(temp.importance==ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND && temp.processName.equals(APP_NAME)){
				System.out.println("Process in foreground: " + temp.processName);
				result=true;
				break;
			}
		}
		return result;
	}

	@Override
	protected JSONObject getConfig() {
		return null;
	}

	@Override
	protected void setConfig(JSONObject config) {
	}     

	@Override
	protected JSONObject initialiseLatestResult() {
		return null;
	}



}
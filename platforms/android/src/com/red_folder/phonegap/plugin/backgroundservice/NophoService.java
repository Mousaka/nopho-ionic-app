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
import android.os.CountDownTimer;

public class NophoService extends BackgroundService {

	public final static String APP_NAME = "com.ionicframework.nophoapp347342";
	private int goalTimeInMs =0;
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
       		System.out.println("Json exception in doWork");
		}


		return result; 
	}

	public void startSession(int goalTimeInMs){
		CountDownTimer countDownTimer = new CountDownTimer(goalTimeInMs, 2 * 1000) {

			@Override
			public void onTick(long millisUntilFinished) {
				System.out.println("TICK " + millisUntilFinished);
				isForeground("test");
			}

			@Override
			public void onFinish() {
        // Do something, maybe?

			//	this.start();
			}
		};
		countDownTimer.start();
	}

	public boolean isForeground(String myPackage) {
		ActivityManager manager = (ActivityManager) getSystemService(ACTIVITY_SERVICE);
		boolean result=false;

		Log.d("NophopService", manager.toString());
		List<ActivityManager.RunningAppProcessInfo> runningTasks = manager.getRunningAppProcesses();

		if(!runningTasks.isEmpty()){
		for(ActivityManager.RunningAppProcessInfo temp : runningTasks){
			if(temp.importance==ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND && temp.processName.equals(APP_NAME)){
				System.out.println("Process in foreground: " + temp.processName);
				result=true;
				break;
			}else{
				System.out.println("Process in foreground: 1" + temp.processName);
			}
		}
	}else{
		System.out.println("Process in foreground: ?");
	}
		return result;
	}

	@Override
	protected JSONObject getConfig() {
		JSONObject tmp = new JSONObject();
		try{
		tmp.put("goalTime", goalTimeInMs);
		}catch (JSONException e) {
				System.out.println("Json exception in doWork");
		}
		return tmp;
	}

	@Override
	protected void setConfig(JSONObject config) {
		System.out.println("i setConfig");
		String msg = "Setting goaltime to: "+ config.toString();
		Log.d("NophoService", msg);
		try{
			if(config.has("goalTime")){
				goalTimeInMs = config.getInt("goalTime");
				System.out.println("Goaltime is now: "+goalTimeInMs);
				doWork();
			}else{
				System.out.println("No goal time");
			}
		}catch(JSONException e){
			System.out.println("Conf errror");
		}
	}     

	@Override
	protected JSONObject initialiseLatestResult() {
		return null;
	}



}
package mono.com.estimote.sdk;


public class BeaconManager_MonitoringListenerImplementor
	extends java.lang.Object
	implements
		mono.android.IGCUserPeer,
		com.estimote.sdk.BeaconManager.MonitoringListener
{
/** @hide */
	public static final String __md_methods;
	static {
		__md_methods = 
			"n_onEnteredRegion:(Lcom/estimote/sdk/Region;Ljava/util/List;)V:GetOnEnteredRegion_Lcom_estimote_sdk_Region_Ljava_util_List_Handler:EstimoteSdk.BeaconManager/IMonitoringListenerInvoker, Xamarin.Estimote.Android\n" +
			"n_onExitedRegion:(Lcom/estimote/sdk/Region;)V:GetOnExitedRegion_Lcom_estimote_sdk_Region_Handler:EstimoteSdk.BeaconManager/IMonitoringListenerInvoker, Xamarin.Estimote.Android\n" +
			"";
		mono.android.Runtime.register ("EstimoteSdk.BeaconManager+IMonitoringListenerImplementor, Xamarin.Estimote.Android, Version=1.0.8.7, Culture=neutral, PublicKeyToken=null", BeaconManager_MonitoringListenerImplementor.class, __md_methods);
	}


	public BeaconManager_MonitoringListenerImplementor () throws java.lang.Throwable
	{
		super ();
		if (getClass () == BeaconManager_MonitoringListenerImplementor.class)
			mono.android.TypeManager.Activate ("EstimoteSdk.BeaconManager+IMonitoringListenerImplementor, Xamarin.Estimote.Android, Version=1.0.8.7, Culture=neutral, PublicKeyToken=null", "", this, new java.lang.Object[] {  });
	}


	public void onEnteredRegion (com.estimote.sdk.Region p0, java.util.List p1)
	{
		n_onEnteredRegion (p0, p1);
	}

	private native void n_onEnteredRegion (com.estimote.sdk.Region p0, java.util.List p1);


	public void onExitedRegion (com.estimote.sdk.Region p0)
	{
		n_onExitedRegion (p0);
	}

	private native void n_onExitedRegion (com.estimote.sdk.Region p0);

	private java.util.ArrayList refList;
	public void monodroidAddReference (java.lang.Object obj)
	{
		if (refList == null)
			refList = new java.util.ArrayList ();
		refList.add (obj);
	}

	public void monodroidClearReferences ()
	{
		if (refList != null)
			refList.clear ();
	}
}

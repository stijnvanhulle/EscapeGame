package mono.com.estimote.sdk;


public class BeaconManager_RangingListenerImplementor
	extends java.lang.Object
	implements
		mono.android.IGCUserPeer,
		com.estimote.sdk.BeaconManager.RangingListener
{
/** @hide */
	public static final String __md_methods;
	static {
		__md_methods = 
			"n_onBeaconsDiscovered:(Lcom/estimote/sdk/Region;Ljava/util/List;)V:GetOnBeaconsDiscovered_Lcom_estimote_sdk_Region_Ljava_util_List_Handler:EstimoteSdk.BeaconManager/IRangingListenerInvoker, Xamarin.Estimote.Android\n" +
			"";
		mono.android.Runtime.register ("EstimoteSdk.BeaconManager+IRangingListenerImplementor, Xamarin.Estimote.Android, Version=1.0.8.7, Culture=neutral, PublicKeyToken=null", BeaconManager_RangingListenerImplementor.class, __md_methods);
	}


	public BeaconManager_RangingListenerImplementor () throws java.lang.Throwable
	{
		super ();
		if (getClass () == BeaconManager_RangingListenerImplementor.class)
			mono.android.TypeManager.Activate ("EstimoteSdk.BeaconManager+IRangingListenerImplementor, Xamarin.Estimote.Android, Version=1.0.8.7, Culture=neutral, PublicKeyToken=null", "", this, new java.lang.Object[] {  });
	}


	public void onBeaconsDiscovered (com.estimote.sdk.Region p0, java.util.List p1)
	{
		n_onBeaconsDiscovered (p0, p1);
	}

	private native void n_onBeaconsDiscovered (com.estimote.sdk.Region p0, java.util.List p1);

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

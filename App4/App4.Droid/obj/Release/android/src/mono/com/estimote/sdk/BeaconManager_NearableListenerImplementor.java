package mono.com.estimote.sdk;


public class BeaconManager_NearableListenerImplementor
	extends java.lang.Object
	implements
		mono.android.IGCUserPeer,
		com.estimote.sdk.BeaconManager.NearableListener
{
/** @hide */
	public static final String __md_methods;
	static {
		__md_methods = 
			"n_onNearablesDiscovered:(Ljava/util/List;)V:GetOnNearablesDiscovered_Ljava_util_List_Handler:EstimoteSdk.BeaconManager/INearableListenerInvoker, Xamarin.Estimote.Android\n" +
			"";
		mono.android.Runtime.register ("EstimoteSdk.BeaconManager+INearableListenerImplementor, Xamarin.Estimote.Android, Version=1.0.8.7, Culture=neutral, PublicKeyToken=null", BeaconManager_NearableListenerImplementor.class, __md_methods);
	}


	public BeaconManager_NearableListenerImplementor () throws java.lang.Throwable
	{
		super ();
		if (getClass () == BeaconManager_NearableListenerImplementor.class)
			mono.android.TypeManager.Activate ("EstimoteSdk.BeaconManager+INearableListenerImplementor, Xamarin.Estimote.Android, Version=1.0.8.7, Culture=neutral, PublicKeyToken=null", "", this, new java.lang.Object[] {  });
	}


	public void onNearablesDiscovered (java.util.List p0)
	{
		n_onNearablesDiscovered (p0);
	}

	private native void n_onNearablesDiscovered (java.util.List p0);

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

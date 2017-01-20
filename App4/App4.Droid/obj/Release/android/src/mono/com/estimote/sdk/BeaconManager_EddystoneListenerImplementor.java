package mono.com.estimote.sdk;


public class BeaconManager_EddystoneListenerImplementor
	extends java.lang.Object
	implements
		mono.android.IGCUserPeer,
		com.estimote.sdk.BeaconManager.EddystoneListener
{
/** @hide */
	public static final String __md_methods;
	static {
		__md_methods = 
			"n_onEddystonesFound:(Ljava/util/List;)V:GetOnEddystonesFound_Ljava_util_List_Handler:EstimoteSdk.BeaconManager/IEddystoneListenerInvoker, Xamarin.Estimote.Android\n" +
			"";
		mono.android.Runtime.register ("EstimoteSdk.BeaconManager+IEddystoneListenerImplementor, Xamarin.Estimote.Android, Version=1.0.8.7, Culture=neutral, PublicKeyToken=null", BeaconManager_EddystoneListenerImplementor.class, __md_methods);
	}


	public BeaconManager_EddystoneListenerImplementor () throws java.lang.Throwable
	{
		super ();
		if (getClass () == BeaconManager_EddystoneListenerImplementor.class)
			mono.android.TypeManager.Activate ("EstimoteSdk.BeaconManager+IEddystoneListenerImplementor, Xamarin.Estimote.Android, Version=1.0.8.7, Culture=neutral, PublicKeyToken=null", "", this, new java.lang.Object[] {  });
	}


	public void onEddystonesFound (java.util.List p0)
	{
		n_onEddystonesFound (p0);
	}

	private native void n_onEddystonesFound (java.util.List p0);

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

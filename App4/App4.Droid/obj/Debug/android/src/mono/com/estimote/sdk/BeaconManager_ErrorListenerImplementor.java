package mono.com.estimote.sdk;


public class BeaconManager_ErrorListenerImplementor
	extends java.lang.Object
	implements
		mono.android.IGCUserPeer,
		com.estimote.sdk.BeaconManager.ErrorListener
{
/** @hide */
	public static final String __md_methods;
	static {
		__md_methods = 
			"n_onError:(Ljava/lang/Integer;)V:GetOnError_Ljava_lang_Integer_Handler:EstimoteSdk.BeaconManager/IErrorListenerInvoker, Xamarin.Estimote.Android\n" +
			"";
		mono.android.Runtime.register ("EstimoteSdk.BeaconManager+IErrorListenerImplementor, Xamarin.Estimote.Android, Version=1.0.8.7, Culture=neutral, PublicKeyToken=null", BeaconManager_ErrorListenerImplementor.class, __md_methods);
	}


	public BeaconManager_ErrorListenerImplementor () throws java.lang.Throwable
	{
		super ();
		if (getClass () == BeaconManager_ErrorListenerImplementor.class)
			mono.android.TypeManager.Activate ("EstimoteSdk.BeaconManager+IErrorListenerImplementor, Xamarin.Estimote.Android, Version=1.0.8.7, Culture=neutral, PublicKeyToken=null", "", this, new java.lang.Object[] {  });
	}


	public void onError (java.lang.Integer p0)
	{
		n_onError (p0);
	}

	private native void n_onError (java.lang.Integer p0);

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

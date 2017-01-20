package md56e06d980c628df001e1ceabdba454932;


public class ServiceReadyCallbackImpl
	extends java.lang.Object
	implements
		mono.android.IGCUserPeer,
		com.estimote.sdk.BeaconManager.ServiceReadyCallback
{
/** @hide */
	public static final String __md_methods;
	static {
		__md_methods = 
			"n_onServiceReady:()V:GetOnServiceReadyHandler:EstimoteSdk.BeaconManager/IServiceReadyCallbackInvoker, Xamarin.Estimote.Android\n" +
			"";
		mono.android.Runtime.register ("Estimotes.ServiceReadyCallbackImpl, Estimotes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", ServiceReadyCallbackImpl.class, __md_methods);
	}


	public ServiceReadyCallbackImpl () throws java.lang.Throwable
	{
		super ();
		if (getClass () == ServiceReadyCallbackImpl.class)
			mono.android.TypeManager.Activate ("Estimotes.ServiceReadyCallbackImpl, Estimotes, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "", this, new java.lang.Object[] {  });
	}


	public void onServiceReady ()
	{
		n_onServiceReady ();
	}

	private native void n_onServiceReady ();

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

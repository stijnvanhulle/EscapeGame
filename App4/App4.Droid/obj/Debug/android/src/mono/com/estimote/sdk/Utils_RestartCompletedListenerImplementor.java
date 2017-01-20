package mono.com.estimote.sdk;


public class Utils_RestartCompletedListenerImplementor
	extends java.lang.Object
	implements
		mono.android.IGCUserPeer,
		com.estimote.sdk.Utils.RestartCompletedListener
{
/** @hide */
	public static final String __md_methods;
	static {
		__md_methods = 
			"n_onRestartCompleted:()V:GetOnRestartCompletedHandler:EstimoteSdk.Utils/IRestartCompletedListenerInvoker, Xamarin.Estimote.Android\n" +
			"";
		mono.android.Runtime.register ("EstimoteSdk.Utils+IRestartCompletedListenerImplementor, Xamarin.Estimote.Android, Version=1.0.8.7, Culture=neutral, PublicKeyToken=null", Utils_RestartCompletedListenerImplementor.class, __md_methods);
	}


	public Utils_RestartCompletedListenerImplementor () throws java.lang.Throwable
	{
		super ();
		if (getClass () == Utils_RestartCompletedListenerImplementor.class)
			mono.android.TypeManager.Activate ("EstimoteSdk.Utils+IRestartCompletedListenerImplementor, Xamarin.Estimote.Android, Version=1.0.8.7, Culture=neutral, PublicKeyToken=null", "", this, new java.lang.Object[] {  });
	}


	public void onRestartCompleted ()
	{
		n_onRestartCompleted ();
	}

	private native void n_onRestartCompleted ();

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

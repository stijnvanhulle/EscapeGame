using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using App4.Helpers;
using System.IO;
using App4.Models;

namespace App4.Droid
{
    public class FileHelper : IFileHelper
    {
        public MainActivity m = new MainActivity();
        public byte[] SendByteArray(byte[] image)
        {
            m.SendByteArrayToSocket(image);
            return image;
        }

        public string SendBeacon(string b)
        {
            m.SendBeaconToSocket(b);
            return b;
        }

        public string SendData(string d)
        {
            m.SendDataToSocket(d);
            return d;
        }

        public void SendStart(object obj)
        {
            m.SendStartToSocket(obj);
        }
    }
}
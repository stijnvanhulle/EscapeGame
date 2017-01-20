using App4.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App4.Helpers
{
    public interface IFileHelper
    {
        byte[] SendByteArray(Byte[] image);
        string SendBeacon(string b);
        string SendData(string text);
        void SendStart(object obj);
    }
}

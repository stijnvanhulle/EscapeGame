using App4.ViewModels;
using Estimotes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;

namespace App4
{
    public partial class Page4 : Acr.XamForms.ContentPage
    {
        static string aantalBeacons;

        public Page4()
        {
            InitializeComponent();

            this.BindingContext = new RangingViewModel();
        }

        
        
    }
}

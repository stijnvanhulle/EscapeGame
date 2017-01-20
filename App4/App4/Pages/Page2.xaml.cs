using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;

namespace App4
{
    public partial class Page2 : ContentPage
    {
        public Page2()
        {
            InitializeComponent();
        }

        private void btnData_Onclicked(object sender, EventArgs e)
        {

            string text = test.Text;
            App.StuurDataDoor(text);
            test.Text = "";

        }

        private void btnBom_Onclicked(object sender, EventArgs e)
        {
            App.StuurDataDoor("true");

        }
    }
}

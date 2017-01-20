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
            if (test.Keyboard == Keyboard.Numeric)
            {
                test.Keyboard = Keyboard.Default;
                return;

            }
            else if (test.Keyboard == Keyboard.Default)
            {
                test.Keyboard = Keyboard.Text;
                return;
            }
            else if (test.Keyboard == Keyboard.Text)
            {
                test.Keyboard = Keyboard.Numeric;
            }

            
        }
    }
}

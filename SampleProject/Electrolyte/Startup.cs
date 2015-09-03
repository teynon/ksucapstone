using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Electrolyte.Startup))]
namespace Electrolyte
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}

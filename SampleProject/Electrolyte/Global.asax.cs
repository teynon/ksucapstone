using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using AutoMapper;
using Electrolyte.Model;
using Electrolyte.Models;

namespace Electrolyte
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        public static void ConfigureAutoMapper()
        {
            //Put automapper code from Model <=> View Models here
            Mapper.CreateMap<Agreement, AgreementViewModel>();
            Mapper.CreateMap<AgreementViewModel, Agreement>();

            Mapper.CreateMap<Message, MessageViewModel>();
            Mapper.CreateMap<MessageViewModel, Message>();

            Mapper.CreateMap<Section, SectionViewModel>();
            Mapper.CreateMap<SectionViewModel, Section>();

            Mapper.CreateMap<SectionItem, SectionItemViewModel>();
            Mapper.CreateMap<SectionItemViewModel, SectionItem>();

            Mapper.CreateMap<User, UserViewModel>();
            Mapper.CreateMap<UserViewModel, User>();
        }
    }
}

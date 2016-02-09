using Breeze.ContextProvider;
using Breeze.ContextProvider.NH;
using CodeCamper.Da;
using CodeCamper.Da.Mappings;
using CodeCamper.Web.Utilities;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Metadata;

namespace CodeCamper.Controllers
{
    [BreezeNHController]
    public class CodeCamperController : ApiController, ICodeCamperController
    {
        private CodeCamperContext context;

        protected override void Initialize(System.Web.Http.Controllers.HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            context = new CodeCamperContext();
        }

        [HttpGet]
        public String Metadata()
        {
            return context.Metadata();
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return context.SaveChanges(saveBundle);
        }

        [HttpGet]
        public IQueryable<Room> Rooms()
        {
            var custs = context.Rooms;
            return custs;
        }

        [HttpGet]
        public IQueryable<Track> Tracks()
        {
            var orders = context.Tracks;
            return orders;
        }

        [HttpGet]
        public IQueryable<TimeSlot> TimeSlots()
        {
            return context.TimeSlots;
        }

        [HttpGet]
        public IQueryable<Person> Persons()
        {
            return context.Persons;
        }

        [HttpGet]
        public IQueryable<Person> Speakers()
        {
            var pers = context.Speakers;
            return pers;
        }


        [HttpGet]
        public IQueryable<Session> Sessions()
        {
            return context.Sessions;
        }
        [HttpGet]
        public IQueryable<Attendance> Attendances()
        {
            var attendances = context.Attendances;
            return attendances;
        }
        [HttpGet]
        public object Lookups(string separatedNames)
        {
            Object tracksCount = new { };
            var arr = separatedNames.ToLower().Split(';');
            if (arr.Contains("trackscount"))
            {
                tracksCount = context.Sessions.GroupBy(s => s.Track.Name)
                .Select(g => new
                {
                    Track = g.FirstOrDefault().Track.Name,
                    Total = g.Count()
                }).ToList();
            }
            var retBag = new
            {
                rooms = (arr.Contains("rooms") ? context.Rooms.ToList() : new List<Room>()),
                tracks = (arr.Contains("tracks") ? context.Tracks.ToList() : new List<Track>()),
                timeSlots = (arr.Contains("timeslots") ? context.TimeSlots.ToList() : new List<TimeSlot>()),
                personsCount = (arr.Contains("personscount") ? context.Persons.Count() : 0),
                sessionsCount = (arr.Contains("sessionscount") ? context.Sessions.Count() : 0),
                tracksCount = tracksCount,
                customAttributes = MapUtilities.GetCustomAttributes()
            };
            return retBag;
        }
        [HttpGet]
        public IQueryable<KeyValuePair<int, int>> TopSpeakers()
        {
            var list = (context.Sessions.GroupBy(s => s.SpeakerId)
                .Select(g => new KeyValuePair<int,int>(g.FirstOrDefault().Speaker.Id, g.Count()))).ToList();
            return list.AsQueryable<KeyValuePair<int, int>>();
        }

    }
}
using Breeze.ContextProvider.NH;
using CodeCamper.Da;
using CodeCamper.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Collections.Generic;
using System.Linq;

namespace CodeCamper.Controllers
{
    public class CodeCamperContext : NHContext
    {
        public CodeCamperContext() : base(NHConfig.OpenSession(MvcApplication.sulPath)) { }
        
        public CodeCamperContext Context
        {
            get { return this; }
        }

        public List<string> Properties()
        {
            var rslt = new List<string>();
            Dictionary<string, object> meta = GetMetadata();
            var types = (IEnumerable<Dictionary<string, object>>) meta["structuralTypes"];
            foreach (var e in types)
            {
                var ame = string.Format("{1},{0}", e["shortName"], e["namespace"]);
                var properties = (IEnumerable<Dictionary<string, object>>)e["dataProperties"];
                foreach (var p in properties)
                {
                    var pName = string.Format("{0},{1},{2}", e["namespace"], e["shortName"], p["nameOnServer"] );
                    rslt.Add(pName);
                }
            }
            return rslt;
        }
        public NhQueryableInclude<Room> Rooms
        {
            get { return GetQuery<Room>(); }
        }
        public NhQueryableInclude<Track> Tracks
        {
            get { return GetQuery<Track>(); }
        }
        public NhQueryableInclude<TimeSlot> TimeSlots
        {
            get { return GetQuery<TimeSlot>(); }
        }
        public NhQueryableInclude<Person> Persons
        {
            get { return GetQuery<Person>(); }
        }

        public IQueryable<Person> Speakers
        {
            get { return GetQuery<Person>().Where(p => p.SpeakerSessions.Any()); }
            //get { return GetQuery<Person>(); }
        }


        public NhQueryableInclude<Session> Sessions
        {
            get { return GetQuery<Session>(); }
        }
        
        public NhQueryableInclude<Attendance> Attendances
        {
            get { return GetQuery<Attendance>(); }
        }
    }
}